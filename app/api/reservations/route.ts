import { NextResponse } from "next/server";
import Reservation from "@/models/Reservation";
import connect from "@/lib/db";
import { getUserFromCookies } from "@/lib/getUserFromCookies";
import { rateLimit } from "@/lib/rateLimit";
import { isPastReservation } from "@/lib/reservations";

export async function GET() {
  try {
    await connect();

    const decoded = await getUserFromCookies();
    if (!decoded) {
      return NextResponse.json({ error: "Please log in to view reservations." }, { status: 401 });
    }

    const reservations = await Reservation.find({ userId: decoded.userId })
      .sort({ date: -1, time: -1 })
      .populate("userId", "name email")
      .lean(); //just json

    return NextResponse.json({
      message: "Reservations successfully",
      reservations,
    });
  } catch {
    return NextResponse.json({ error: "Reservations could not be loaded." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    // IP Spam/Bot Protection
    const ip = req.headers.get("x-forwarded-for") ?? "127.0.0.1";
    const limitStatus = rateLimit(ip, 5, 60000);

    if (!limitStatus.success) {
      return NextResponse.json({ error: "Too many reservations. Please wait." }, { status: 429 });
    }

    await connect();

    const decoded = await getUserFromCookies();
    if (!decoded) {
      return NextResponse.json({ error: "Please log in to make a reservation." }, { status: 401 });
    }

    const body = await req.json();

    // Type Validation
    if (!body.date || !body.time || typeof body.guests !== "number") {
      return NextResponse.json({ error: "Invalid reservation data format" }, { status: 400 });
    }

    if (isPastReservation(body.date, body.time)) {
      return NextResponse.json({ error: "You cannot make a reservation for a past date or time." }, { status: 400 });
    }

    const activeReservations = await Reservation.find({
      userId: decoded.userId,
      status: "active",
    }).select("date time").lean();

    const hasUpcomingActiveReservation = activeReservations.some((reservation) => (
      !isPastReservation(reservation.date, reservation.time)
    ));

    if (hasUpcomingActiveReservation) {
      return NextResponse.json({ error: "You can only have one upcoming active reservation." }, { status: 409 });
    }

    const newReservation = new Reservation({
      userId: decoded.userId,
      name: decoded.name,
      date: new Date(body.date).toISOString().split("T")[0],
      time: body.time,
      guests: body.guests,
      notes: typeof body.notes === "string" ? body.notes : null,
      status: "active",
      editCount: 0,
    });

    const saved = await newReservation.save();
    await saved.populate("userId", "name email");

    return NextResponse.json({
      message: "Reservation created successfully",
      reservation: {
        _id: saved._id.toString(),
        userId: saved.userId,
        date: saved.date.toString(),
        time: saved.time,
        guests: saved.guests,
        notes: saved.notes || null,
        status: saved.status,
        editCount: saved.editCount,
        cancelledAt: saved.cancelledAt,
      },
    });
  } catch {
    return NextResponse.json({ error: "Reservation could not be created. Please try again." }, { status: 500 });
  }
}
