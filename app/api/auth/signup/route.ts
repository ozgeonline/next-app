import { NextResponse } from "next/server";
import connect from "@/lib/db";
import User from "@/app/models/User";
import jwt from "jsonwebtoken";
import { getAuthCookieOptions } from "@/lib/authHelpers";

export async function POST(req: Request) {

  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables.");
  }

  try {
    //console.log("signup: Request successful");
    await connect();
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      console.error("signup: Missing name, email, or password");
      return NextResponse.json({ error: "Name, email, and password are required" }, { status: 400 });
    }

    const lowerCaseEmail = email.toLowerCase();

    const existingUser = await User.findOne({ email: lowerCaseEmail }).lean();
    if (existingUser) {
      console.error("signup: Email already in use:", email);
      return NextResponse.json({ error: "Email already in use" }, { status: 400 });
    }

    const user = await User.create({
      name,
      email: lowerCaseEmail,
      password
    });

    const token = jwt.sign(
      {
        userId: user._id,
        name: user.name,
        email: user.email
      },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );
    //console.log("signup: Generated token:", token);

    const res = NextResponse.json({
      message: "Signup successful",
      user: {
        _id: user._id.toString(),
        email: user.email,
        name: user.name
      }
    });

    res.cookies.set("token", token, getAuthCookieOptions());
    return res;
  } catch (error: any) {
    console.error("signup error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET() {
  console.log("GET - signup: Method not allowed");
  return NextResponse.json({ error: "Method Not Allowed - Use POST for signup" }, { status: 405 });
}