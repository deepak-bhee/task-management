import mongoose from 'mongoose';

export default async function connectDatabase() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error('MONGODB_URI is required. Set it in backend/.env or use a local MongoDB connection string.');
  }

  if (uri.includes('username:password@cluster.mongodb.net') || (uri.includes('cluster.mongodb.net') && uri.includes('username'))) {
    throw new Error(
      'MONGODB_URI appears to be a placeholder. Replace it with a valid MongoDB Atlas connection string or use a local MongoDB URI.'
    );
  }

  await mongoose.connect(uri);
  console.log('MongoDB connected');
}
