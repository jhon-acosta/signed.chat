import { Collections } from "../collections";
import mongoose, { Schema, model } from "mongoose";

export interface User {
  username: string;
  avatar: string;
  publicKey?: string;
  privateKey?: string;
}

const User = new Schema<User>({
  username: { type: String, required: true, unique: true },
  avatar: { type: String, required: true },
  publicKey: { type: String },
  privateKey: { type: String },
});

export default mongoose.models[Collections.USERS] ||
  model(Collections.USERS, User);
