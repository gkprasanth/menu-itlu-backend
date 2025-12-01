import mongoose from "mongoose";

async function connectDB() {
  try {
    await mongoose.connect('mongodb+srv://helloasynclabs_db_user:d0GcFkcFXDgwDlRf@itly.p3a4oip.mongodb.net/');
    console.log("✅ MongoDB connected");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
    process.exit(1);
  }
}

export { connectDB };
