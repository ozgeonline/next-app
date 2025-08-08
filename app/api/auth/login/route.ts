import { NextResponse } from "next/server";
import connect from "@/lib/db";
import User from "@/app/models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  try {
    await connect();
    const { email, password } = await req.json();
    // console.log("Login email:", email);
    // console.log("Login password:", password);

    const user = await User.findOne({ email: email.toLowerCase() });
    //console.log("user:", user);
    if (!user) {
      //console.log("User not found");
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const passwordMatch  = await bcrypt.compare(password, user.password);
    if (!passwordMatch ) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, {
      expiresIn: "7d",
    });

    // console.log("login password:", password);
    // console.log("hash password:", user.password);
    // console.log("match:", passwordMatch);
    // console.log("token:", token);

    const cookieStore = await cookies();
    cookieStore.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });


    return NextResponse.json({ 
      token, 
      user: { 
        email: user.email,
        name: user.name 
      }, 
      message: 'Login successful'
    }, { status: 200 });
    
  } catch (error) {
    //console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
