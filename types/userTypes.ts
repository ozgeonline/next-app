import { Document } from "mongoose";

export interface User extends Document {
  email: string;
  password: string;
  name?: string;
}

export type SafeUser = Omit<User, "password">;
export type ClientUser = Pick<SafeUser, "_id" | "email" | "name">;