import { NextResponse } from "next/server";
import connect from "@/lib/db";
import User from "@/app/models/User";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    //console.log("POST /api/auth/signup: Request successful");
    await connect();
    
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      //console.error("POST /api/auth/signup: Missing name, email, or password");
      return NextResponse.json({ error: "Name, email, and password are required" }, { status: 400 });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() }).lean();
    if (existingUser) {
      //console.error("POST /api/auth/signup: Email already in use:", email);
      return NextResponse.json({ error: "Email already in use" }, { status: 400 });
    }

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password
    });

    const token = jwt.sign(
      { userId: user._id, name: user.name, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    //console.log("POST /api/auth/signup: Generated token:", token);

    const res = NextResponse.json({
      message: "Signup successful",
      user: { _id: user._id, email: user.email, name: user.name },
    });

    res.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    //console.log("POST /api/auth/signup: Response sent with cookie");
    return res;
  } catch (error: any) {
    //console.error("POST /api/auth/signup error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET() {
  console.log("GET /api/auth/signup: Method not allowed");
  return NextResponse.json({ error: "Method Not Allowed - Use POST for signup" }, { status: 405 });
}