import mongoose from 'mongoose';

const portfolioAssetSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  name: { type: String, required: true, trim: true },
  category: { type: String, enum: ['Pasar Uang', 'Obligasi', 'Saham', 'Emas'], required: true },
  units: { type: Number, required: true, min: 0 },
  currentPrice: { type: Number, required: true, min: 0 },
  returnPercent: { type: Number, default: 0 }
}, { timestamps: true, versionKey: false });

export default mongoose.model('PortfolioAsset', portfolioAssetSchema);
