'use server';

import connect from "@/lib/db";
import User from "@/app/models/User";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { getAuthCookieOptions } from "@/lib/auth";
import { getUserFromCookies } from "@/lib/getUserFromCookies";

interface AuthResult {
  success: boolean;
  error?: string;
  redirectTo?: string;
}

export async function loginAction(email: string, password: string): Promise<AuthResult> {
  try {
    await connect();

    if (!email || !password) {
      return { success: false, error: "Email and password are required" };
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
      { userId: user._id.toString(), name: user.name, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    const cookieStore = await cookies();
    cookieStore.set("token", token, getAuthCookieOptions());

    return { success: true };
  } catch (error) {
    console.error("loginAction error:", error);
    return { success: false, error: "Internal server error" };
  }
}

export async function signupAction(name: string, email: string, password: string): Promise<AuthResult> {
  try {
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is not defined in environment variables.");
      return { success: false, error: "Internal server configuration error." };
    }

    await connect();

    if (!name || !email || !password) {
      return { success: false, error: "Name, email, and password are required" };
    }

    const lowerCaseEmail = email.toLowerCase();

    const existingUser = await User.findOne({ email: lowerCaseEmail }).lean();
    if (existingUser) {
      return { success: false, error: "Email already in use", redirectTo: "/login" };
    }

    const user = await User.create({ name, email: lowerCaseEmail, password });

    const token = jwt.sign(
      { userId: user._id.toString(), name: user.name, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    const cookieStore = await cookies();
    cookieStore.set("token", token, getAuthCookieOptions());

    return { success: true };
  } catch (error) {
    console.error("signupAction error:", error);
    return { success: false, error: "Internal server error" };
  }
}

export async function updateUserNameAction(newName: string): Promise<AuthResult> {
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

    return { success: true };
  } catch (error) {
    console.error("updateUserNameAction error:", error);
    return { success: false, error: "Internal server error" };
  }
}
