import 'dotenv/config';
import http from 'node:http';
import dns from 'node:dns';
import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { getCsrfToken, issueCsrfCookie, requireCsrf } from './middleware/csrf.js';
import { Server } from 'socket.io';
import { connectDatabase } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import bankRoutes from './routes/bankRoutes.js';
import portfolioRoutes from './routes/portfolioRoutes.js';

// Menghindari resolver DNS lokal yang menolak query SRV MongoDB Atlas.
dns.setServers((process.env.DNS_SERVERS || '1.1.1.1,8.8.8.8').split(','));

const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer, { cors: { origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true } });

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }));
app.use(helmet());
app.use(express.json());
app.use(issueCsrfCookie);
app.use(requireCsrf);
app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 300, standardHeaders: 'draft-7', legacyHeaders: false }));
app.use('/api/auth', rateLimit({ windowMs: 15 * 60 * 1000, limit: 20, message: { message: 'Terlalu banyak percobaan autentikasi.' } }));
app.use((req, res, next) => { req.io = io; next(); });
app.get('/health', (req, res) => res.json({ status: 'ok', service: 'nueva-api' }));
app.get('/api/health', (req, res) => res.json({ status: 'ok', service: 'nueva-api' }));
app.get('/api/csrf', (req, res) => res.json({ csrfToken: getCsrfToken(req, res) }));
app.use('/api/auth', authRoutes);
app.use('/api', bankRoutes);
app.use('/api/portofolio', portfolioRoutes);
app.use((error, req, res, next) => { console.error(error); res.status(error.status || 500).json({ message: error.message || 'Internal server error.' }); });

// Memvalidasi JWT Socket.io agar client hanya bisa masuk ke room miliknya sendiri.
io.use((socket, next) => {
  try {
    const cookies = Object.fromEntries((socket.handshake.headers.cookie || '').split(';').filter(Boolean).map(item => { const [key, ...value] = item.trim().split('='); return [key, decodeURIComponent(value.join('='))]; }));
    const token = cookies.nueva_access_token;
    socket.userId = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'], issuer: 'nueva-api', audience: 'nueva-client' }).userId;
    next();
  } catch { next(new Error('Socket authentication failed.')); }
});

// Mengelompokkan koneksi Socket.io berdasarkan user agar update privat tepat sasaran.
io.on('connection', (socket) => {
  socket.join(`user:${socket.userId}`);
});

// Memastikan database siap sebelum API mulai menerima traffic.
connectDatabase().then(() => {
  httpServer.listen(process.env.PORT || 5000, () => console.log(`Nueva API berjalan di http://localhost:${process.env.PORT || 5000}`));
}).catch((error) => { console.error('Gagal terhubung ke MongoDB:', error.message); process.exit(1); });
