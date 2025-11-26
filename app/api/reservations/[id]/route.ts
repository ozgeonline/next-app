import { NextRequest, NextResponse } from "next/server";
import connect from "@/lib/db";
import { getUserFromCookies } from "@/lib/getUserFromCookies";
import Reservation from "@/app/models/Reservation";

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connect();
    const decoded = await getUserFromCookies();
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token-user" }, { status: 401 });
    }

    const { id } = await context.params;//reservation ID
    const body = await req.json();
    //console.log("PUT /api/reservations/[id]: body:", body);

    //reservation & user_id relationship
    const reservation = await Reservation.findOne({ _id: id, userId: decoded.userId });
    if (!reservation) {
      return NextResponse.json(
        { error: "Reservation not found or not authorized" },
        { status: 404 }
      );
    }

    //update the reservation
    reservation.date = new Date(body.date).toISOString().split("T")[0];
    reservation.time = body.time;
    reservation.guests = body.guests;
    reservation.notes = body.notes || null;

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
    await connect();
    const decoded = await getUserFromCookies();
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token-user" }, { status: 401 });
    }

    const { id } = await context.params;//reservation ID
    const reservation = await Reservation.findOne({ _id: id, userId: decoded.userId });
    if (!reservation) {
      return NextResponse.json(
        { error: "Reservation not found or not authorized" },
        { status: 404 }
      );
    }

    await reservation.deleteOne();

    return NextResponse.json({ message: "Reservation deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}