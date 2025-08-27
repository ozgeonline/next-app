import { NextResponse } from "next/server";
import connect from "@/lib/db";
import User from "@/app/models/User";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function GET(req: Request) {
  try {
    await connect();

    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: "No token found" }, { status: 401 });
    }

    let decoded:any;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string; name: string; email: string };
    } catch (error) {
      return NextResponse.json({ error: "Invalid token-user" }, { status: 401 });
    }

    const user = await User.findById(decoded.userId).select("name email");
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "User data fetched successfully",
      user: { 
        name: user.name, 
        email: user.email, 
        userId: user._id 
      }
    });

  } catch (error) {
    console.error("Error fetching user data:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
export async function PUT(req: Request) {
  try {
    await connect();

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "No token found" }, { status: 401 });
    }

    let decoded: any;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
        userId: string;
        name: string;
        email: string;
      };
    } catch (error) {
      return NextResponse.json(
        { error: "Invalid token-user middleware" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { name } = body;

    if (!name || typeof name !== "string") {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const updatedUser = await User.findByIdAndUpdate(
      decoded.userId,
      { name },
      { new: true }
    ).select("name email");

    return NextResponse.json({
      message: "User updated successfully",
      user: {
        name: updatedUser?.name,
        email: updatedUser?.email,
        userId: updatedUser?._id,
      },
    });
  } catch (error) {
    //console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
