import mongoose from "mongoose";
import { MONGO_URI } from "../config";

export default async () => {
  try {
    await mongoose.connect(MONGO_URI);

    console.log("Connected to MongoDB...");
  } catch (exception) {
    console.log(exception);
  }
};
