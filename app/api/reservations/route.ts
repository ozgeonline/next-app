import { NextResponse } from "next/server";
import Reservation from "@/app/models/Reservation";
import connect from "@/lib/db";
import { getUserFromCookies } from "@/lib/getUserFromCookies";

export async function GET() {
  try {
    await connect();

    const decoded = await getUserFromCookies();
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token-user" }, { status: 401 });
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
    
    const decoded = await getUserFromCookies();
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token-user" }, { status: 401 });
    }

    const body = await req.json();

    const newReservation = new Reservation({
      userId: decoded.userId,
      name: decoded.name,
      date: new Date(body.date),
      time: body.time,
      guests: body.guests,
      notes: body.notes || null,
    });

    const saved = await newReservation.save();
    await saved.populate("userId", "name email");
    //console.log("newReservation:", saved);

    return NextResponse.json({
      message: "Reservation created successfully",
      reservation: {
        _id: saved._id.toString(),
        userId: saved.userId,
        date: saved.date.toString(),
        time: saved.time,
        guests: saved.guests,
        notes: saved.notes || null,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}