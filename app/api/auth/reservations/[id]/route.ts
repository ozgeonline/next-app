import { NextRequest, NextResponse } from "next/server";
import connect from "@/lib/db";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import Reservation from "@/app/models/Reservation";

export async function PUT(
  req: NextRequest,
 context: { params: Promise<{ id: string }> }
) {
  try {
    await connect();

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "No token found" }, { status: 401 });
    }

    let decoded: any;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    } catch (error) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

   const { id } = await context.params;//reservation ID
    const body = await req.json();

    //reservation & user_id relationship
    const reservation = await Reservation.findOne({ _id: id, userId: decoded.userId });
    if (!reservation) {
      return NextResponse.json(
        { error: "Reservation not found or not authorized" },
        { status: 404 }
      );
    }

    //update the reservation
    reservation.date = new Date(body.date);
    reservation.time = body.time;
    reservation.guests = body.guests;
    reservation.notes = body.notes || null;

    await reservation.save();

    //populate userId for response
    const populated = await reservation.populate("userId", "name email");

    return NextResponse.json({
      message: "Reservation updated successfully",
      reservation: populated,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}