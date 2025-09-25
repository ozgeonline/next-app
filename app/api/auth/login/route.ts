import { NextResponse } from "next/server";
import connect from "@/lib/db";
import User from "@/app/models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    //console.log("POST /api/auth/login: connecting, login req ok");
    await connect();

    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      //console.error("POST /api/auth/login: not found mail | password");
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).lean();
    if (!user) {
      //console.error("POST /api/auth/login: user not found for mail:", email);
      return NextResponse.json({ error: "Invalid credentials - user not found" }, { status: 401 });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      //console.error("POST /api/auth/login: incorrect password for mail:", email);
      return NextResponse.json({ error: "Invalid credentials - incorrect password" }, { status: 401 });
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

    //console.log("POST /api/auth/login: generated token:", token.slice(0, 10) + "...");

    const res = NextResponse.json({
      message: "Login successful",
      user: {
        _id: user._id.toString(),
        email: user.email,
        name: user.name || ""
      },
    });

    res.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    //console.log("POST /api/auth/login: res. sent with cookie");
    return res;
  } catch (error: any) {
    //console.error("POST /api/auth/login error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET() {
  console.log("GET /api/auth/login: Method not allowed");
  return NextResponse.json({ error: "Method Not Allowed - Use POST for login" }, { status: 405 });
}