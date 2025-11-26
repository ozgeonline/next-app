import { NextResponse } from "next/server";
import connect from "@/lib/db";
import User from "@/app/models/User";
import jwt from "jsonwebtoken";
import { getAuthCookieOptions } from "@/lib/authHelpers";

export async function POST(req: Request) {
  try {
    await connect();

    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      console.error("login: Email and password are required");
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      console.error("login: Invalid credentials");
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
      console.error("login: Invalid credentials");
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const token = jwt.sign(
      {
        userId: user._id,
        name: user.name,
        email: user.email
      },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    const res = NextResponse.json({
      message: "Login successful",
      user: {
        _id: user._id.toString(),
        email: user.email,
        name: user.name || ""
      },
    });

    res.cookies.set("token", token, getAuthCookieOptions());

    return res;
  } catch (error: any) {
    console.error("login: Internal server error", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET() {
  console.log("login: Method not allowed");
  return NextResponse.json({ error: "Method Not Allowed - Use POST for login" }, { status: 405 });
}