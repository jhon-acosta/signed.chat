import mongoose from "mongoose";

const configs = {
  MONGO_URI:
    process.env.MONGO_URI ||
    "mongodb+srv://jecacosta:oxO4Iej2XsIYuBkn@signedchatdev.lxaqgul.mongodb.net/signedchat?retryWrites=true&w=majority",
};

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
