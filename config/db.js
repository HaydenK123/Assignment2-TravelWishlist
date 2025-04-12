import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Verify MONGO_URI is available
if (!process.env.MONGO_URI) {
  console.error('Error: MONGO_URI is not defined in .env file');
  process.exit(1);
}

// Load MongoDB URI from the environment variable
const dbURI = process.env.MONGO_URI;

// Connect to MongoDB with enhanced options
mongoose.connect(dbURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 30000,  // Timeout for server selection (30 seconds)
  socketTimeoutMS: 45000,          // Timeout for socket connection (45 seconds)
})
.then(() => console.log('MongoDB Connected'))
.catch((err) => console.log('MongoDB connection error:', err));


export { dbURI }; // Named export (since you're using ESM)
