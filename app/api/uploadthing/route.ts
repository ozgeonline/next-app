import { createRouteHandler } from "uploadthing/next";
import { NextRequest, NextResponse } from "next/server";
import { ourFileRouter } from "./core";
import { rateLimit } from "@/lib/rateLimit";

//createRouteHandler: ref: UPLOADTHING_<NAME>

const handlers = createRouteHandler({
  router: ourFileRouter,
});

export const GET = handlers.GET;

export const POST = async (req: NextRequest) => {
  const ip = req.headers.get("x-forwarded-for") ?? "127.0.0.1";
  const limitStatus = rateLimit(ip, 5, 60000);

  if (!limitStatus.success) {
    return NextResponse.json(
      { error: "Too many upload attempts. Please wait." },
      { status: 429 }
    );
  }

  return handlers.POST(req);
};