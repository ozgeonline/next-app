import { NextResponse, NextRequest } from "next/server";
import Reservation from "@/models/Reservation";
import connect from "@/lib/db";
import { rateLimit } from "@/lib/rateLimit";

export async function DELETE(req: NextRequest) {
  try {
    // DDOS Protection
    const ip = req.headers.get("x-forwarded-for") ?? "127.0.0.1";
    const limitStatus = rateLimit(ip, 5, 60000);

    if (!limitStatus.success) {
      return NextResponse.json({ error: "Too many requests." }, { status: 429 });
    }
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
