import { NextResponse } from "next/server";
import connect from "@/lib/db";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import Reservation from "@/app/models/Reservation";

export async function GET(req: Request) {
  try {
    await connect();

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "No token found" }, { status: 401 });
    }

    let decoded: any;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string;};
    } catch (error) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const reservations = await Reservation.find({ userId: decoded.userId })
      .populate("userId", "name email")
      .lean();

    return NextResponse.json({
      message: "Reservations successfully",
      reservations,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}