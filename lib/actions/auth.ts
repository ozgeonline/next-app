'use server';

import connect from "@/lib/db";
import User from "@/models/User";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { getAuthCookieOptions } from "@/lib/auth";
import { getUserFromCookies } from "@/lib/getUserFromCookies";

interface AuthResult {
  success: boolean;
  error?: string;
  redirectTo?: string;
}

const ACCOUNT_NAME_MIN_LENGTH = 2;
const ACCOUNT_NAME_MAX_LENGTH = 20;

function getJwtMaxAge(rememberMe: boolean) {
  return rememberMe ? "30d" : "7d";
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isMongooseValidationError(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "name" in error &&
    error.name === "ValidationError"
  );
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
    return { success: false, error: "Login could not be completed. Please try again." };
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

    if (name.trim().length < ACCOUNT_NAME_MIN_LENGTH || name.trim().length > ACCOUNT_NAME_MAX_LENGTH) {
      return { success: false, error: `Name must be between ${ACCOUNT_NAME_MIN_LENGTH} and ${ACCOUNT_NAME_MAX_LENGTH} characters` };
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
  } catch (error: unknown) {
    if (isMongooseValidationError(error)) {
      return { success: false, error: "Please check your details and try again." };
    }

    return { success: false, error: "Signup could not be completed. Please try again." };
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

    const trimmedName = newName.trim();

    if (trimmedName.length < ACCOUNT_NAME_MIN_LENGTH || trimmedName.length > ACCOUNT_NAME_MAX_LENGTH) {
      return { success: false, error: `Name must be between ${ACCOUNT_NAME_MIN_LENGTH} and ${ACCOUNT_NAME_MAX_LENGTH} characters` };
    }

    const updatedUser = await User.findByIdAndUpdate(
      decoded.userId,
      { name: trimmedName },
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
  } catch (error: unknown) {
    if (isMongooseValidationError(error)) {
      return { success: false, error: `Name must be between ${ACCOUNT_NAME_MIN_LENGTH} and ${ACCOUNT_NAME_MAX_LENGTH} characters` };
    }

    return { success: false, error: "Account name could not be updated. Please try again." };
  }
}
