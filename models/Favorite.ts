import mongoose from "mongoose";
import Meal from "./Meal";
import User from "./User";

const FavoriteSchema = new mongoose.Schema(
  {
    mealId: { type: mongoose.Schema.Types.ObjectId, ref: Meal, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: User, required: true },
  },
  { timestamps: true }
);

FavoriteSchema.index({ mealId: 1, userId: 1 }, { unique: true });
FavoriteSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.models.Favorite || mongoose.model("Favorite", FavoriteSchema);
