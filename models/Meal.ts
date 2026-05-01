import mongoose, { Schema } from 'mongoose';

const mealSchema = new Schema({
  title: { type: String, required: true, maxlength: 100 },
  slug: { type: String, required: true, unique: true },
  image: { type: String, required: true },
  summary: { type: String, required: true, maxlength: 300 },
  instructions: { type: String, required: true, maxlength: 5000 },
  creatorId: { type: Schema.Types.ObjectId, ref: "User", index: true },
  creator: { type: String, required: true, maxlength: 50 },
  creator_email: { type: String, required: true, match: /^\S+@\S+\.\S+$/ },
  createdAt: { type: Date, default: Date.now },
  averageRating: { type: Number, default: 0 },
}, { timestamps: true });
mealSchema.index({ createdAt: -1 });

const Meal = mongoose.models.Meal || mongoose.model('Meal', mealSchema);

export default Meal;
