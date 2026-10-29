import mongoose from 'mongoose';

// Membuka koneksi ke MongoDB sebelum server menerima request.
export async function connectDatabase() {
  await mongoose.connect(process.env.MONGODB_URI, { dbName: process.env.MONGODB_DB_NAME || 'nueva' });
  console.log('MongoDB terhubung');
}
