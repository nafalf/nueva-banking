// Mengambil harga emas dari provider eksternal; fallback mock menjaga demo tetap berjalan.
async function getGoldPrice() {
  const fallback = 1_850_000 + (new Date().getUTCDate() % 10) * 5_000;
  if (!process.env.GOLD_API_KEY) return { source: 'mock', pricePerGram: fallback, currency: 'IDR' };
  try {
    const response = await fetch('https://www.goldapi.io/api/XAU/IDR', { headers: { 'x-access-token': process.env.GOLD_API_KEY, 'Content-Type': 'application/json' } });
    if (!response.ok) throw new Error(`Gold API ${response.status}`);
    const result = await response.json();
    return { source: 'GoldAPI.io', pricePerGram: Math.round(result.price_gram_24k), currency: 'IDR', timestamp: result.timestamp };
  } catch (error) {
    console.warn('Gold API fallback:', error.message);
    return { source: 'mock-fallback', pricePerGram: fallback, currency: 'IDR' };
  }
}

// Mengembalikan ringkasan portofolio dan harga emas terbaru.
export async function getPortfolioData(req, res) {
  const updatedAt = new Date();
  const gold = await getGoldPrice();
  const assets = await PortfolioAsset.find({ user: req.user._id }).sort({ createdAt: -1 }).lean();
  const mappedAssets = assets.map(asset => ({ ...asset, value: asset.units * asset.currentPrice, risk: asset.category === 'Pasar Uang' ? 'Rendah' : asset.category === 'Obligasi' ? 'Sedang' : 'Tinggi' }));
  const totalValue = mappedAssets.reduce((sum, asset) => sum + asset.value, 0);
  const totalReturnPercent = totalValue ? mappedAssets.reduce((sum, asset) => sum + asset.returnPercent * asset.value, 0) / totalValue : 0;
  res.json({ updatedAt, gold, totalValue, totalReturnPercent: Number(totalReturnPercent.toFixed(2)), assets: mappedAssets });
}
import PortfolioAsset from '../models/PortfolioAsset.js';


// Menambahkan holding portofolio milik user untuk kebutuhan simulasi.
export async function addPortfolioAsset(req, res, next) {
  try {
    const { name, category, units, currentPrice, returnPercent = 0 } = req.body;
    if (!name || !['Pasar Uang', 'Obligasi', 'Saham', 'Emas'].includes(category) || Number(units) <= 0 || Number(currentPrice) < 0)
      return res.status(400).json({ message: 'Data aset tidak valid.' });
    const asset = await PortfolioAsset.create({ user: req.user._id, name, category, units: Number(units), currentPrice: Number(currentPrice), returnPercent: Number(returnPercent) });
    res.status(201).json({ message: 'Aset portofolio ditambahkan.', data: asset });
  } catch (error) { next(error); }
}
