import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "No token found" }, { status: 401 });
    }
    return NextResponse.json({ message: "Token found" }, { status: 200 });
  } catch (error) {
    //console.error("Error checking token:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}