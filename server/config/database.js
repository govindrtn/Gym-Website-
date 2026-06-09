import mongoose from "mongoose";

const DEFAULT_MONGODB_URI = "mongodb://127.0.0.1:27017/silver-gym";

async function connectDatabase() {
  const mongoUri = process.env.MONGODB_URI || DEFAULT_MONGODB_URI;

  mongoose.set("strictQuery", true);

  await mongoose.connect(mongoUri);
  console.log(`MongoDB connected: ${mongoose.connection.name}`);
}

export { connectDatabase };
