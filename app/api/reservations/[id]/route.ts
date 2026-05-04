import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import connect from "@/lib/db";
import { getUserFromCookies } from "@/lib/getUserFromCookies";
import Reservation from "@/models/Reservation";
import { rateLimit } from "@/lib/rateLimit";
import {
  canEditReservation,
  isPastReservation,
  MAX_RESERVATION_EDITS,
  RESERVATION_EDIT_CUTOFF_HOURS,
} from "@/lib/reservations";

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const ip = req.headers.get("x-forwarded-for") ?? "127.0.0.1";
    const limitStatus = rateLimit(ip, 15, 60000);

    if (!limitStatus.success) {
      return NextResponse.json({ error: "Too many requests. Please wait." }, { status: 429 });
    }

    await connect();
    const decoded = await getUserFromCookies();
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token-user" }, { status: 401 });
    }

    const { id } = await context.params;//reservation ID

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid Reservation ID format" }, { status: 400 });
    }

    const body = await req.json();

    //reservation & user_id relationship
    const reservation = await Reservation.findOne({ _id: id, userId: decoded.userId });
    if (!reservation) {
      return NextResponse.json(
        { error: "Reservation not found or not authorized" },
        { status: 404 }
      );
    }

    if (!canEditReservation(reservation)) {
      return NextResponse.json(
        {
          error: `Reservations can be edited up to ${MAX_RESERVATION_EDITS} times and not within ${RESERVATION_EDIT_CUTOFF_HOURS} hours of the reservation time.`,
        },
        { status: 403 }
      );
    }

    if (!body.date || !body.time || typeof body.guests !== "number") {
      return NextResponse.json({ error: "Invalid reservation data format" }, { status: 400 });
    }

    if (isPastReservation(body.date, body.time)) {
      return NextResponse.json({ error: "You cannot update a reservation to a past date or time." }, { status: 400 });
    }

    //update the reservation
    reservation.date = new Date(body.date).toISOString().split("T")[0];
    reservation.time = body.time;
    reservation.guests = body.guests;
    reservation.notes = body.notes || null;
    reservation.editCount = (reservation.editCount || 0) + 1;

    await reservation.save();

    //populate: userId for response
    const populated = await reservation.populate("userId", "name email");

    return NextResponse.json({
      message: "Reservation updated successfully",
      reservation: populated,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const ip = req.headers.get("x-forwarded-for") ?? "127.0.0.1";
    const limitStatus = rateLimit(ip, 10, 60000);

    if (!limitStatus.success) {
      return NextResponse.json({ error: "Too many delete attempts. Please wait." }, { status: 429 });
    }

    await connect();
    const decoded = await getUserFromCookies();
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token-user" }, { status: 401 });
    }

    const { id } = await context.params;//reservation ID

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid Reservation ID format" }, { status: 400 });
    }

    const reservation = await Reservation.findOne({ _id: id, userId: decoded.userId });
    if (!reservation) {
      return NextResponse.json(
        { error: "Reservation not found or not authorized" },
        { status: 404 }
      );
    }

    if (reservation.status === "cancelled") {
      return NextResponse.json({ message: "Reservation is already cancelled" });
    }

    reservation.status = "cancelled";
    reservation.cancelledAt = new Date();
    await reservation.save();

    return NextResponse.json({ message: "Reservation cancelled successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
