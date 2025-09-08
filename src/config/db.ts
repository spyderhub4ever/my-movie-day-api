import mongoose from "mongoose";
import env from "./env";

async function connectDB() {
  try {
    await mongoose.connect(env.DATABASE_URL, {
      dbName: "my_movie_day",
    });

    console.log("Database connected");
  } catch (err) {
    console.error("Database connection failed:", err);
    process.exit(1);
  }
}

export default connectDB;
