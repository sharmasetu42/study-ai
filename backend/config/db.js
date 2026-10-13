// ============================================================
//  config/db.js
//  Connects to MongoDB Atlas using Mongoose.
//  Called once at server startup.
// ============================================================

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
    // Exit the process so the server doesn't start with no DB
    process.exit(1);
  }
};

module.exports = connectDB;
