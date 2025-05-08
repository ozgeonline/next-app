// pages/api/test-db.js
import { NextResponse } from "next/server";
import connect from "@/lib/db";

export const GET = async () => {
  try {
    await connect();
    return NextResponse.json({ message: "Connected to MongoDB" }, { status: 200 });
  } catch (err) {
    console.error("Test DB connection failed:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
};