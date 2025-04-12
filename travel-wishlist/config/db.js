require('dotenv').config();  // Ensure environment variables are loaded

const mongoose = require('mongoose');

// Load MongoDB URI from the environment variable
const dbURI = process.env.MONGO_URI;

// Connect to MongoDB
mongoose.connect(dbURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.log('MongoDB connection error:', err));

module.exports = { dbURI };
