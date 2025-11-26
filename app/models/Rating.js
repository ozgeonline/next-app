import mongoose from 'mongoose';

const RatingSchema = new mongoose.Schema({
  mealId: { type: mongoose.Schema.Types.ObjectId, ref: 'Meal', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  createdAt: { type: Date, default: Date.now },
});

RatingSchema.index({ mealId: 1, userId: 1 },{ unique: true });
export default mongoose.models.Rating || mongoose.model('Rating', RatingSchema);