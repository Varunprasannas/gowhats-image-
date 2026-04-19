import mongoose from 'mongoose';

const connectDB = async () => {
  let retries = 3;
  
  while (retries > 0) {
    try {
      let uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/gowhats-image-host';
      
      let connectionOptions = {
        serverSelectionTimeoutMS: 60000,
        socketTimeoutMS: 60000,
        connectTimeoutMS: 60000,
        retryWrites: true,
        maxPoolSize: 10,
        family: 4, // Force IPv4
      };

      // Try connecting
      console.log('🔗 Attempting to connect to MongoDB...');
      const conn = await mongoose.connect(uri, connectionOptions);
      
      console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
      return conn;
    } catch (error) {
      retries--;
      console.error(`❌ MongoDB Connection Error (${3 - retries}/3): ${error.message}`);
      
      if (retries === 0) {
        console.error(`❌ Failed to connect to MongoDB after 3 attempts`);
        console.error(`Full Error:`, error);
        throw error;
      }
      
      console.log(`⏳ Retrying in 5 seconds...`);
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
};

export default connectDB;
