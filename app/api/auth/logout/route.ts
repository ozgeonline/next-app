import { NextResponse } from "next/server";
import { getLogoutCookieOptions } from "@/lib/authHelpers";

export async function POST() {
  const response = NextResponse.json({ message: "Logged out" });
  response.cookies.set("token", "", getLogoutCookieOptions());
  return response;
}

export async function GET() {
  console.log("GET /api/auth/logout: Method not allowed");
  return NextResponse.json({ error: "Method Not Allowed - Use POST for logout" }, { status: 405 });
}