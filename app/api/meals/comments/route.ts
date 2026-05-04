import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import connect from "@/lib/db";
import Comment from "@/models/Comment";
import Meal from "@/models/Meal";
import { validateCommentContent } from "@/lib/comments";
import { getUserFromCookies } from "@/lib/getUserFromCookies";
import { rateLimit } from "@/lib/rateLimit";

type CommentDocument = {
  _id: { toString: () => string };
  mealId: { toString: () => string };
  parentCommentId?: { toString: () => string } | null;
  userId: { toString: () => string };
  userName: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
};

type MealOwnerDocument = {
  creatorId?: { toString: () => string } | null;
  creator_email?: string;
};

function getClientIp(req: NextRequest) {
  return req.headers.get("x-forwarded-for") ?? "127.0.0.1";
}

function isValidMealId(mealId: string | null) {
  return Boolean(mealId && mongoose.Types.ObjectId.isValid(mealId));
}

function isMealCreator(meal: MealOwnerDocument, user: { userId: string; email?: string }) {
  if (meal.creatorId) {
    return meal.creatorId.toString() === user.userId;
  }

  return Boolean(user.email && meal.creator_email === user.email);
}

export async function GET(req: NextRequest) {
  try {
    const limitStatus = rateLimit(getClientIp(req), 80, 60000);

    if (!limitStatus.success) {
      return NextResponse.json({ error: "Too many requests. Please wait." }, { status: 429 });
    }

    const mealId = req.nextUrl.searchParams.get("mealId");

    if (!isValidMealId(mealId)) {
      return NextResponse.json({ error: "Invalid meal ID" }, { status: 400 });
    }

    await connect();

    const decoded = await getUserFromCookies();
    const comments = await Comment.find({ mealId, status: "visible" })
      .sort({ createdAt: -1 })
      .limit(50)
      .select("mealId parentCommentId userId userName content createdAt updatedAt")
      .lean<CommentDocument[]>();

    return NextResponse.json({
      comments: comments.map((comment) => ({
        id: comment._id.toString(),
        mealId: comment.mealId.toString(),
        parentCommentId: comment.parentCommentId?.toString() || null,
        userId: comment.userId.toString(),
        userName: comment.userName,
        content: comment.content,
        createdAt: comment.createdAt,
        updatedAt: comment.updatedAt,
        canManage: decoded?.userId === comment.userId.toString(),
      })),
    });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const limitStatus = rateLimit(getClientIp(req), 12, 60000);

    if (!limitStatus.success) {
      return NextResponse.json({ error: "Too many comment attempts. Please wait." }, { status: 429 });
    }

    await connect();

    const decoded = await getUserFromCookies();
    if (!decoded) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const body = await req.json();

    if (!body.mealId || typeof body.mealId !== "string" || !mongoose.Types.ObjectId.isValid(body.mealId)) {
      return NextResponse.json({ error: "Invalid meal ID" }, { status: 400 });
    }

    const validation = validateCommentContent(body.content);

    if (validation.error || !validation.content) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const parentCommentId = typeof body.parentCommentId === "string" ? body.parentCommentId : null;

    if (parentCommentId && !mongoose.Types.ObjectId.isValid(parentCommentId)) {
      return NextResponse.json({ error: "Invalid parent comment ID" }, { status: 400 });
    }

    const meal = await Meal.findById(body.mealId)
      .select("creatorId creator_email")
      .lean<MealOwnerDocument | null>();

    if (!meal) {
      return NextResponse.json({ error: "Meal not found" }, { status: 404 });
    }

    const userIsMealCreator = isMealCreator(meal, decoded);

    if (userIsMealCreator && !parentCommentId) {
      return NextResponse.json(
        { error: "Recipe creators can reply to comments, but cannot add a direct comment to their own recipe." },
        { status: 403 }
      );
    }

    if (parentCommentId) {
      const parentComment = await Comment.findOne({
        _id: parentCommentId,
        mealId: body.mealId,
        parentCommentId: null,
        status: "visible",
      }).select("userId").lean<{ userId: { toString: () => string } } | null>();

      if (!parentComment) {
        return NextResponse.json({ error: "Parent comment not found" }, { status: 404 });
      }

      if (parentComment.userId.toString() === decoded.userId) {
        return NextResponse.json({ error: "You cannot reply to your own comment." }, { status: 403 });
      }
    }

    const comment = await Comment.create({
      mealId: body.mealId,
      parentCommentId,
      userId: decoded.userId,
      userName: decoded.name || "TasteShare User",
      content: validation.content,
      status: "visible",
    });

    return NextResponse.json(
      {
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
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
