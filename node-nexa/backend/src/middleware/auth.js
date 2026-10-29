import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Memvalidasi Bearer token dan menyimpan user aktif ke request.
export async function protect(req, res, next) {
  try {
    const cookies = Object.fromEntries((req.headers.cookie || '').split(';').filter(Boolean).map(item => { const [key, ...value] = item.trim().split('='); return [key, decodeURIComponent(value.join('='))]; }));
    const token = cookies.nueva_access_token || (req.headers.authorization?.startsWith('Bearer ') ? req.headers.authorization.split(' ')[1] : null);
    if (!token) return res.status(401).json({ message: 'Token wajib dikirim.' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'], issuer: 'nueva-api', audience: 'nueva-client' });
    req.user = await User.findById(decoded.userId);
    if (!req.user) return res.status(401).json({ message: 'User tidak ditemukan.' });
    next();
  } catch {
    return res.status(401).json({ message: 'Token tidak valid atau sudah kedaluwarsa.' });
  }
}
