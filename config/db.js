// config/db.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const dbURI = process.env.MONGO_URI;

const connectDB = async () => {
  try {
    if (!dbURI) {
      console.error('❌ Error: MONGO_URI is not defined in .env');
      process.exit(1);
    }

    await mongoose.connect(dbURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000,  // 30s timeout
      socketTimeoutMS: 45000            // 45s socket timeout
    });

    console.log('✅ MongoDB Connected');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  }
};

export default connectDB;
