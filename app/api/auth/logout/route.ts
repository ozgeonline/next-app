import { NextResponse } from "next/server";
import { getLogoutCookieOptions } from "@/lib/auth";
import { rateLimit } from "@/lib/rateLimit";

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for") ?? "127.0.0.1";
  const limitStatus = rateLimit(ip, 10, 60000);

  if (!limitStatus.success) {
    return NextResponse.json(
      { error: "Too many logout attempts. Please wait." },
      { status: 429 }
    );
  }

  const response = NextResponse.json({ message: "Logged out" });
  response.cookies.set("token", "", getLogoutCookieOptions());
  return response;
}

export async function GET() {
  console.log("GET /api/auth/logout: Method not allowed");
  return NextResponse.json({ error: "Method Not Allowed - Use POST for logout" }, { status: 405 });
}