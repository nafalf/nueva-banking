import crypto from 'node:crypto';

function readCookies(header = '') { return Object.fromEntries(header.split(';').filter(Boolean).map(item => { const [key, ...value] = item.trim().split('='); return [key, decodeURIComponent(value.join('='))]; })); }

function cookieOptions() {
  return { httpOnly: false, secure: process.env.NODE_ENV === 'production', sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', path: '/' };
}

// Mengambil token yang tersimpan atau membuat token baru untuk frontend.
export function getCsrfToken(req, res) {
  const existing = readCookies(req.headers.cookie).nueva_csrf;
  const token = existing || crypto.randomBytes(32).toString('hex');
  if (!existing) res.cookie('nueva_csrf', token, cookieOptions());
  return token;
}

// Membuat token CSRF yang boleh dibaca frontend tetapi tidak berisi credential.
export function issueCsrfCookie(req, res, next) {
  getCsrfToken(req, res);
  next();
}

// Memastikan request yang mengubah data berasal dari frontend Nueva.
export function requireCsrf(req, res, next) {
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) return next();
  const cookieToken = readCookies(req.headers.cookie).nueva_csrf;
  const headerToken = req.headers['x-csrf-token'];
  if (!cookieToken || !headerToken || cookieToken.length !== headerToken.length || !crypto.timingSafeEqual(Buffer.from(cookieToken), Buffer.from(headerToken))) return res.status(403).json({ message: 'CSRF token tidak valid.' });
  next();
}
