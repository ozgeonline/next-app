import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { Schema } from "mongoose";
import Reservation from "@/app/models/Reservation";
import connect from "@/lib/db";

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
      .lean(); //just json

    return NextResponse.json({
      message: "Reservations successfully",
      reservations,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connect();
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "No token found" }, { status: 401 });
    }

    let decoded: any;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string;}; //type?
      if (typeof decoded !== 'object') {
        throw new Error('Invalid token payload');
      }
    } catch (error) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const body = await req.json();

    const newReservation = new Reservation({
      userId: decoded.userId as Schema.Types.ObjectId,
      date: new Date(body.date),
      time: body.time,
      guests: body.guests,
      notes: body.notes || null,
    });

    const saved = await newReservation.save();
    await saved.populate("userId", "name email");

    return NextResponse.json({
      message: "Reservation created successfully",
      reservation: {
        _id: saved._id.toString(),
        userId: saved.userId.id,
        date: saved.date.toISOString(),
        time: saved.time,
        guests: saved.guests,
        notes: saved.notes || null,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}