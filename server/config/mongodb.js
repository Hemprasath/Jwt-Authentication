import mongoose from "mongoose";

const connectDB = async () => {
 try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: "testdb",
    });

    console.log("database connected");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1); // Stop server
  }
}

export default connectDB;
  