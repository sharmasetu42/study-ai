// ============================================================
//  config/db.js
//  Connects to MongoDB Atlas using Mongoose.
//  Called once at server startup.
// ============================================================

const mongoose = require('mongoose');

const connectDB = async () => {
  // Log the URI (masked) so we can confirm it's set on Render
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('❌ MONGODB_URI is not set in environment variables!');
    console.error('Available env keys:', Object.keys(process.env).filter(k => !k.includes('npm')).join(', '));
    process.exit(1);
  }
  console.log(`🔌 Connecting to MongoDB... (${uri.substring(0, 40)}...)`);

  try {
    const conn = await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
