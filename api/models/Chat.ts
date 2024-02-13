import { Collections } from "../collections";
import mongoose, { Schema, SchemaTypes, Types, model } from "mongoose";

interface Chat {
  from: Types.ObjectId;
  to: Types.ObjectId;
  message: string;
}

const Chat = new Schema<Chat>({
  from: { type: SchemaTypes.ObjectId, required: true },
  to: { type: SchemaTypes.ObjectId, required: true },
  message: { type: String, required: true },
});

export default mongoose.models[Collections.CHATS] ||
  model(Collections.CHATS, Chat);
