import mongoose from "mongoose";
import Meal from "./Meal";
import User from "./User";

const CommentSchema = new mongoose.Schema(
  {
    mealId: { type: mongoose.Schema.Types.ObjectId, ref: Meal, required: true, index: true },
    parentCommentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
      default: null,
      index: true,
    },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: User, required: true, index: true },
    userName: { type: String, required: true, maxlength: 50 },
    content: { type: String, required: true, maxlength: 500 },
    status: {
      type: String,
      enum: ["visible", "deleted"],
      default: "visible",
      index: true,
    },
  },
  { timestamps: true }
);

CommentSchema.index({ mealId: 1, parentCommentId: 1, status: 1, createdAt: -1 });
CommentSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.models.Comment || mongoose.model("Comment", CommentSchema);
