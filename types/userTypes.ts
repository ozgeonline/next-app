import { Document, Types } from "mongoose";

export interface User extends Document {
  email: string;
  password: string;
  name?: string;
  _id: string;
  comparePassword(userPassword: string): Promise<boolean>;
}


export type SafeUser = Omit<User, "password">;
export type ClientUser = Pick<SafeUser, "_id" | "email" | "name">;