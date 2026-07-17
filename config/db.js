import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

// Connects to MongoDB using the URI from .env.
// Exits the process if the connection fails — no point running
// an API that can't reach its database.
async function connectDB() {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    console.error("MongoDB connection failed: MONGO_URI is not defined in the environment.");
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(mongoUri);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection failed: ${error.message}`);
    process.exit(1);
  }
}

export default connectDB;
