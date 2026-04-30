'use server';

import connect from "@/lib/db";
import User from "@/models/User";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { Resend } from "resend";
import { getAuthCookieOptions } from "@/lib/auth";
import { getUserFromCookies } from "@/lib/getUserFromCookies";

interface AuthResult {
  success: boolean;
  error?: string;
  redirectTo?: string;
  message?: string;
}

const resend = new Resend(process.env.RESEND_API_KEY);
const RESET_TOKEN_BYTES = 32;
const RESET_TOKEN_TTL_MS = 1000 * 60 * 30;
const PASSWORD_RESET_REQUEST_WINDOW_MS = 1000 * 60 * 60 * 24;
const DEFAULT_AUTH_ORIGIN = "http://localhost:3000";
const PASSWORD_RESET_RESPONSE_MESSAGE = "If an account exists, we sent a password reset link.";
const PASSWORD_RESET_LIMIT_MESSAGE =
  "For security, password reset can be requested once every 24 hours. If you already requested one, please check your inbox.";
const DEFAULT_PASSWORD_RESET_FROM = "TasteShare <onboarding@resend.dev>";

function getJwtMaxAge(rememberMe: boolean) {
  return rememberMe ? "30d" : "7d";
}

function getBaseUrl() {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL;
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return DEFAULT_AUTH_ORIGIN;
}

function hashResetToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function canRequestPasswordReset(lastRequestedAt?: Date) {
  if (!lastRequestedAt) return true;
  return Date.now() - lastRequestedAt.getTime() >= PASSWORD_RESET_REQUEST_WINDOW_MS;
}

export async function loginAction(
  email: string,
  password: string,
  rememberMe = false
): Promise<AuthResult> {
  try {
    await connect();

    if (!email || !password) {
      return { success: false, error: "Email and password are required" };
    }

    if (!isValidEmail(email)) {
      return { success: false, error: "Invalid email format" };
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      return { success: false, error: "Invalid credentials" };
    }

    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
      return { success: false, error: "Invalid credentials" };
    }

    const token = jwt.sign(
      {
        userId: user._id.toString(),
        name: user.name,
        email: user.email
      },
      process.env.JWT_SECRET!,
      { expiresIn: getJwtMaxAge(rememberMe) }
    );

    const cookieStore = await cookies();
    cookieStore.set("token", token, getAuthCookieOptions(rememberMe));

    return { success: true };
  } catch {
    return { success: false, error: "Internal server error" };
  }
}

export async function signupAction(
  name: string,
  email: string,
  password: string
): Promise<AuthResult> {
  try {
    if (!process.env.JWT_SECRET) {
      return { success: false, error: "Internal server configuration error." };
    }

    await connect();

    if (!name || !email || !password) {
      return { success: false, error: "Name, email, and password are required" };
    }

    if (name.trim().length < 2 || name.trim().length > 50) {
      return { success: false, error: "Name must be between 2 and 50 characters" };
    }

    if (!isValidEmail(email)) {
      return { success: false, error: "Invalid email format" };
    }

    if (password.length < 6) {
      return { success: false, error: "Password must be at least 6 characters long" };
    }

    const lowerCaseEmail = email.toLowerCase();

    const existingUser = await User.findOne({ email: lowerCaseEmail }).lean();
    if (existingUser) {
      return { success: false, error: "Email already in use", redirectTo: "/login" };
    }

    const user = await User.create({ name, email: lowerCaseEmail, password });

    const token = jwt.sign(
      {
        userId: user._id.toString(),
        name: user.name,
        email: user.email
      },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    const cookieStore = await cookies();
    cookieStore.set("token", token, getAuthCookieOptions());

    return { success: true };
  } catch {
    return { success: false, error: "Internal server error" };
  }
}

export async function updateUserNameAction(
  newName: string
): Promise<AuthResult> {
  try {
    await connect();

    const decoded = await getUserFromCookies();
    if (!decoded) {
      return { success: false, error: "Invalid token or user not authenticated" };
    }

    if (!newName || typeof newName !== "string" || !newName.trim()) {
      return { success: false, error: "Name is required" };
    }

    const updatedUser = await User.findByIdAndUpdate(
      decoded.userId,
      { name: newName.trim() },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return { success: false, error: "User not found" };
    }

    // The front end was updated by creating a new token.
    const token = jwt.sign(
      {
        userId: updatedUser._id.toString(),
        name: updatedUser.name,
        email: updatedUser.email
      },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    const cookieStore = await cookies();
    cookieStore.set("token", token, getAuthCookieOptions());

    return { success: true };
  } catch {
    return { success: false, error: "Internal server error" };
  }
}

export async function requestPasswordResetAction(email: string): Promise<AuthResult> {
  try {
    await connect();

    if (!email || !isValidEmail(email)) {
      return { success: false, error: "Please enter a valid email address" };
    }

    const normalizedEmail = email.toLowerCase();
    const user = await User.findOne({ email: normalizedEmail }).select(
      "+passwordResetToken +passwordResetExpires +passwordResetRequestedAt"
    );

    if (!user) {
      return { success: true, message: PASSWORD_RESET_RESPONSE_MESSAGE };
    }

    if (!canRequestPasswordReset(user.passwordResetRequestedAt)) {
      return { success: true, message: PASSWORD_RESET_LIMIT_MESSAGE };
    }

    const resetToken = crypto.randomBytes(RESET_TOKEN_BYTES).toString("hex");
    user.passwordResetToken = hashResetToken(resetToken);
    user.passwordResetExpires = new Date(Date.now() + RESET_TOKEN_TTL_MS);
    user.passwordResetRequestedAt = new Date();
    await user.save();

    const resetUrl = `${getBaseUrl()}/reset-password?token=${resetToken}`;
    const { error } = await resend.emails.send({
      from: process.env.PASSWORD_RESET_FROM_EMAIL || DEFAULT_PASSWORD_RESET_FROM,
      to: normalizedEmail,
      subject: "Reset your TasteShare password",
      text: `Use this link to reset your password. It expires in 30 minutes:\n\n${resetUrl}`,
    });

    if (error) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      user.passwordResetRequestedAt = undefined;
      await user.save();
      return { success: false, error: "Failed to send reset email" };
    }

    return { success: true, message: PASSWORD_RESET_RESPONSE_MESSAGE };
  } catch {
    return { success: false, error: "Internal server error" };
  }
}

export async function resetPasswordAction(
  token: string,
  password: string
): Promise<AuthResult> {
  try {
    await connect();

    if (!token) {
      return { success: false, error: "Reset token is missing" };
    }

    if (!password || password.length < 6) {
      return { success: false, error: "Password must be at least 6 characters long" };
    }

    const hashedToken = hashResetToken(token);
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: new Date() },
    }).select("+password +passwordResetToken +passwordResetExpires");

    if (!user) {
      return { success: false, error: "Reset link is invalid or expired" };
    }

    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    return { success: true, message: "Password updated successfully. You can log in now." };
  } catch {
    return { success: false, error: "Internal server error" };
  }
}
