import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

interface DecodedToken {
  userId: string;
  name?: string;
  email?: string;
}

export async function getUserFromCookies(): Promise<DecodedToken | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;
    return decoded;
  } catch(error) {
    console.error("Invalid token:", error);
    return null;
  }
}