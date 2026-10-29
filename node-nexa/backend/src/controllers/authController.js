import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Membuat nomor rekening 10 digit dan memastikan belum dipakai user lain.
async function createAccountNumber() {
  let number;
  do { number = String(Math.floor(1000000000 + Math.random() * 9000000000)); }
  while (await User.exists({ accountNumber: number }));
  return number;
}

// Membentuk token yang dipakai frontend untuk request terproteksi.
function createToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '15m', algorithm: 'HS256', issuer: 'nueva-api', audience: 'nueva-client' });
}

// Menyimpan access token di cookie HttpOnly agar tidak dapat dibaca JavaScript/XSS.
function setAuthCookie(res, token) { res.cookie('nueva_access_token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', maxAge: 15 * 60 * 1000, path: '/' }); }

// Mendaftarkan user baru, mengenkripsi password, lalu mengembalikan JWT.
export async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password || password.length < 6)
      return res.status(400).json({ message: 'Nama, email, dan password minimal 6 karakter wajib diisi.' });
    if (await User.exists({ email: email.toLowerCase() }))
      return res.status(409).json({ message: 'Email sudah terdaftar.' });
    const user = await User.create({ name, email, password: await bcrypt.hash(password, 12), accountNumber: await createAccountNumber() });
    setAuthCookie(res, createToken(user.id));
    return res.status(201).json({ user: publicUser(user) });
  } catch (error) { next(error); }
}

// Memeriksa kredensial login dan menerbitkan token baru.
export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email?.toLowerCase() }).select('+password');
    if (!user || !(await bcrypt.compare(password || '', user.password)))
      return res.status(401).json({ message: 'Email atau password salah.' });
    setAuthCookie(res, createToken(user.id));
    return res.json({ user: publicUser(user) });
  } catch (error) { next(error); }
}

// Menghapus cookie autentikasi saat user logout.
export function logout(req, res) { res.clearCookie('nueva_access_token', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', path: '/' }); res.json({ message: 'Logout berhasil.' }); }

// Menghapus field sensitif sebelum data user dikirim ke client.
export function publicUser(user) {
  return { id: user.id, name: user.name, email: user.email, accountNumber: user.accountNumber, balance: user.balance };
}
