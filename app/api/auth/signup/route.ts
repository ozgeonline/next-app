import connect from "@/lib/db";
import User from "@/app/models/User";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {   
      await connect();
      const { email, password, name } = await req.json();
    
      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        return NextResponse.json({ error: "email already in use" }, { status: 400 });
      }
    
      const newUser = await User.create({
        email: email.toLowerCase(),
        password,
        name,
      });
    
      return NextResponse.json({
        message: "User registered successfully",
        user: { 
          id: newUser._id, 
          email: newUser.email, 
          name: newUser.name
        }
      },
      { status: 201 });
  } catch (error) {
      //console.error('Login error:', error);
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 }); 
  }
}
