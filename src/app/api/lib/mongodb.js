import mongoose from 'mongoose';

const MONGODB_URI = process.env.API_URL_MONGODB;
if (!MONGODB_URI) throw new Error('Define MONGODB_URI en .env.local');

let cached = global.mongoose;
if (!cached) cached = global.mongoose = { conn: null, promise: null };
export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn; 
  }
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI).then((m) => m);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
