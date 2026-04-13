import mongoose, { Schema, Model } from "mongoose";
import type { User } from "@/types/userTypes";
import bcrypt from "bcryptjs";

const userSchema = new Schema<User>(
  {
    name: { type: String, maxlength: 50 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: /^\S+@\S+\.\S+$/
    },
    password: {
      type: String,
      required: true,
      select: false
    }
  },
  { timestamps: true }
);

userSchema.methods.comparePassword = async function (userPassword: string): Promise<boolean> {
  return bcrypt.compare(userPassword, this.password);
};

userSchema.pre("save", async function (next) {
  const user = this as User;

  // only works when the password is created or updated
  if (!user.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

const User: Model<User> = mongoose.models.User || mongoose.model<User>("User", userSchema);

export default User;