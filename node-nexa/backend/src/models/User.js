import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, minlength: 2 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, select: false },
  accountNumber: { type: String, required: true, unique: true, index: true },
  balance: { type: Number, default: 500000, min: 0 }
}, { timestamps: true, versionKey: false });

export default mongoose.model('User', userSchema);
