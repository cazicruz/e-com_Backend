const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    // Check if MongoDB URI is provided
    const mongoURI = process.env.NODE_ENV === 'production' 
      ? process.env.MONGODB_URI_PROD 
      : process.env.MONGODB_URI;

    if (!mongoURI) {
      console.error('❌ MongoDB URI not found in environment variables');
      console.log('📝 Please set up your .env file with:');
      console.log('   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/vtu_app');
      console.log('   or for local MongoDB: MONGODB_URI=mongodb://localhost:27017/vtu_app');
      process.exit(1);
    }

    const conn = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  } catch (error) {
    console.error('❌ Database connection error:', error.message);
    
    if (error.message.includes('ECONNREFUSED')) {
      console.log('\n🔧 Troubleshooting tips:');
      console.log('1. If using local MongoDB:');
      console.log('   - Install MongoDB: https://docs.mongodb.com/manual/installation/');
      console.log('   - Start MongoDB service: mongod');
      console.log('2. If using MongoDB Atlas:');
      console.log('   - Check your connection string in .env file');
      console.log('   - Ensure your IP is whitelisted in Atlas');
      console.log('   - Verify username and password are correct');
    }
    
    if (error.message.includes('Authentication failed')) {
      console.log('\n🔐 Authentication failed:');
      console.log('   - Check your MongoDB username and password');
      console.log('   - Ensure the user has proper permissions');
    }
    
    process.exit(1);
  }
};

module.exports = connectDB; 