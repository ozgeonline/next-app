import { NextResponse, NextRequest } from "next/server";
import Reservation from "@/models/Reservation";
import connect from "@/lib/db";
import { rateLimit } from "@/lib/rateLimit";
import { getUserFromCookies } from "@/lib/getUserFromCookies";
import { isPastReservation } from "@/lib/reservations";

export async function DELETE(req: NextRequest) {
  try {
    // DDOS Protection
    const ip = req.headers.get("x-forwarded-for") ?? "127.0.0.1";
    const limitStatus = rateLimit(ip, 5, 60000);

    if (!limitStatus.success) {
      return NextResponse.json({ error: "Too many requests." }, { status: 429 });
    }
    await connect();

    const decoded = await getUserFromCookies();
    if (!decoded) {
      return NextResponse.json({ error: "Please log in again." }, { status: 401 });
    }

    const reservations = await Reservation.find({
      userId: decoded.userId,
      status: "active",
    }).select("_id date time");

    const pastCount = reservations.filter((reservation) => (
      isPastReservation(reservation.date, reservation.time)
    )).length;

    return NextResponse.json({
      success: true,
      pastCount,
      message: `${pastCount} reservations are in history.`,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Reservation history could not be refreshed." },
      { status: 500 }
    );
  }
}
