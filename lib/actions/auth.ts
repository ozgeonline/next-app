'use server';

import connect from "@/lib/db";
import User from "@/app/models/User";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { getAuthCookieOptions } from "@/lib/auth";

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
      { userId: user._id, name: user.name, email: user.email },
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
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables.");
  }

  try {
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
      { userId: user._id, name: user.name, email: user.email },
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
