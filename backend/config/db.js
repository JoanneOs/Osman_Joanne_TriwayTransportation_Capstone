import mongoose from 'mongoose';
import logger from './logger.js';

const connectDB = async () => {
  try {
    // Connecting to MongoDB without the deprecated options
    const conn = await mongoose.connect(process.env.MONGO_URI);
    logger.info(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    logger.error(`Error: ${error.message}`);
    process.exit(1);  // Exit the process if the connection fails
  }
};

export default connectDB;
