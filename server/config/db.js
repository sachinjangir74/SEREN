const mongoose = require('mongoose');

let lastError = null;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    lastError = null;
  } catch (error) {
    lastError = error.message;
    console.error(`MongoDB Connection Error: ${error.message}`);
    console.error('Retrying connection in 5 seconds...');
    setTimeout(connectDB, 5000);
  }
};

module.exports = { connectDB, lastError: () => lastError };
