import { NextResponse } from "next/server";
import Reservation from "@/app/models/Reservation";
import connect from "@/lib/db";

export async function DELETE() {
  try {
    await connect();

    const now = new Date();

    // Check all reservations
    const reservations = await Reservation.find({}, "_id date time");

    const idsToDelete = [];

    for (const res of reservations) {
      if (!res.date || !res.time) continue;

      const dateString = new Date(res.date).toISOString().split("T")[0];

      const resFullDate = new Date(`${dateString}T${res.time}:00`);

      if (resFullDate < now) {
        idsToDelete.push(res._id);
      }
    }

    let deletedCount = 0;
    if (idsToDelete.length > 0) {
      const result = await Reservation.deleteMany({ _id: { $in: idsToDelete } });
      deletedCount = result.deletedCount;
    }

    return NextResponse.json({
      success: true,
      deletedCount: deletedCount, // ui
      message: `${deletedCount} expired reservations removed.`,
    });
  } catch (error) {
    console.error("Cleanup error:", error);
    return NextResponse.json(
      { error: "Internal server error during cleanup" },
      { status: 500 }
    );
  }
}
