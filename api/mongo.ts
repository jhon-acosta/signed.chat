import mongoose from "mongoose";

const configs = { MONGO_URI: process.env.NEXT_PUBLIC_MONGO_URI! };

let isConnected = false;

export default async function mongoClient() {
  try {
    if (!isConnected) {
      await mongoose.connect(configs.MONGO_URI);
      console.log("[mongoose]: database connected");
      isConnected = true;
    } else {
      console.log("[mongoose]: already connected");
    }
  } catch (error) {
    console.log("[mongoose]: error ", error);
  }
}
