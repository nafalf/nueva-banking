import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  amount: { type: Number, required: true, min: 1 },
  type: { type: String, enum: ['Transfer', 'Topup'], required: true },
  date: { type: Date, default: Date.now },
  idempotencyKey: { type: String, sparse: true, unique: true, select: false }
}, { versionKey: false });

transactionSchema.index({ sender: 1, date: -1 });
transactionSchema.index({ recipient: 1, date: -1 });

export default mongoose.model('Transaction', transactionSchema);
