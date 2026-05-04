import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import connect from "@/lib/db";
import Comment from "@/models/Comment";
import { validateCommentContent } from "@/lib/comments";
import { getUserFromCookies } from "@/lib/getUserFromCookies";
import { rateLimit } from "@/lib/rateLimit";

function getClientIp(req: NextRequest) {
  return req.headers.get("x-forwarded-for") ?? "127.0.0.1";
}

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ commentId: string }> }
) {
  try {
    const limitStatus = rateLimit(getClientIp(req), 20, 60000);

    if (!limitStatus.success) {
      return NextResponse.json({ error: "Too many update attempts. Please wait." }, { status: 429 });
    }

    await connect();

    const decoded = await getUserFromCookies();
    if (!decoded) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const { commentId } = await context.params;

    if (!mongoose.Types.ObjectId.isValid(commentId)) {
      return NextResponse.json({ error: "Invalid comment ID" }, { status: 400 });
    }

    const body = await req.json();
    const validation = validateCommentContent(body.content);

    if (validation.error || !validation.content) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const comment = await Comment.findOne({
      _id: commentId,
      userId: decoded.userId,
      status: "visible",
    });

    if (!comment) {
      return NextResponse.json({ error: "Comment not found or not authorized" }, { status: 404 });
    }

    comment.content = validation.content;
    await comment.save();

    return NextResponse.json({
      comment: {
        id: comment._id.toString(),
        mealId: comment.mealId.toString(),
        parentCommentId: comment.parentCommentId?.toString() || null,
        userId: comment.userId.toString(),
        userName: comment.userName,
        content: comment.content,
        createdAt: comment.createdAt,
        updatedAt: comment.updatedAt,
        canManage: true,
      },
    });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ commentId: string }> }
) {
  try {
    const limitStatus = rateLimit(getClientIp(req), 20, 60000);

    if (!limitStatus.success) {
      return NextResponse.json({ error: "Too many delete attempts. Please wait." }, { status: 429 });
    }

    await connect();

    const decoded = await getUserFromCookies();
    if (!decoded) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const { commentId } = await context.params;

    if (!mongoose.Types.ObjectId.isValid(commentId)) {
      return NextResponse.json({ error: "Invalid comment ID" }, { status: 400 });
    }

    const comment = await Comment.findOne({
      _id: commentId,
      userId: decoded.userId,
      status: "visible",
    });

    if (!comment) {
      return NextResponse.json({ error: "Comment not found or not authorized" }, { status: 404 });
    }

    comment.status = "deleted";
    await comment.save();

    return NextResponse.json({ message: "Comment deleted successfully" });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
