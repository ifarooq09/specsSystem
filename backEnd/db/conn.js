// db/conn.js
import mongoose from 'mongoose';

const connectDb = async (url) => {
  try {
    await mongoose.connect(url);
    console.log('Database connected successfully');
  } catch (error) {
    console.error('Database connection error:', error);
    throw error;
  }
};

export default connectDb;
