import { NextResponse } from "next/server";
import Reservation from "@/app/models/Reservation";
import connect from "@/lib/db";

export async function DELETE() {
  try {
    await connect();
  
    const now = new Date();
    const result = await Reservation.deleteMany({ date: { $lt: now } });

    return NextResponse.json({
      success: true,
      deletedCount: result.deletedCount, // ui
      message: `${result.deletedCount} expired reservations removed.`,
    });
  } catch (error) {
    console.error("Cleanup error:", error);
    return NextResponse.json(
      { error: "Internal server error during cleanup" },
      { status: 500 }
    );
  }
}
