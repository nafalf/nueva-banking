# Nueva - Realtime Digital Banking App & Wealth Management Simulator

<p align="center">
  <img src="https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Node.js-24-339933?logo=nodedotjs&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express.js-4-000000?logo=express&logoColor=white" alt="Express.js" />
  <img src="https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white" alt="MongoDB Atlas" />
  <img src="https://img.shields.io/badge/Mongoose-ODM-880000?logo=mongodb&logoColor=white" alt="Mongoose" />
  <img src="https://img.shields.io/badge/Socket.io-4-010101?logo=socketdotio&logoColor=white" alt="Socket.io" />
  <img src="https://img.shields.io/badge/Axios-HTTP-5A29E4?logo=axios&logoColor=white" alt="Axios" />
  <img src="https://img.shields.io/badge/JWT-Auth-000000?logo=jsonwebtokens&logoColor=white" alt="JWT" />
  <img src="https://img.shields.io/badge/Vercel-Frontend-000000?logo=vercel&logoColor=white" alt="Vercel" />
  <img src="https://img.shields.io/badge/Render-Backend-46E3B7?logo=render&logoColor=white" alt="Render" />
</p>

Nueva adalah simulasi digital banking modern berbasis MERN Stack yang dirancang sebagai proyek portofolio ODP IT Bank BNI. Nama **Nueva** berarti *baru*, merepresentasikan pengalaman perbankan digital yang lebih sederhana, realtime, dan berorientasi pada pengelolaan aset.

Konsep antarmuka dan fitur terinspirasi oleh kebutuhan core digital banking modern seperti dashboard saldo, transfer antarrekening, mutasi, serta ringkasan aset tanpa merepresentasikan sistem resmi Bank BNI atau layanan keuangan nyata.

## Fitur Utama

- **JWT Authentication** untuk register, login, dan endpoint terproteksi.
- **Password hashing** menggunakan bcrypt.
- **Transfer antarrekening** dengan validasi saldo, batas transaksi, dan MongoDB transaction.
- **Realtime balance update** menggunakan Socket.io untuk pengirim dan penerima.
- **Top up simulasi** dengan pencatatan mutasi.
- **Portfolio & wealth management simulator** dengan data holding per user.
- **Third-party gold price API** dengan fallback mock untuk harga emas.
- **Mock/optional fund data** untuk kategori pasar uang, obligasi, saham, dan emas.
- **Microservices-ready API** melalui pemisahan route, controller, model, middleware, dan konfigurasi.
- **Security baseline**: Helmet, rate limiting, JWT authorization, idempotency key, dan validasi nominal.
- **Mobile-first responsive UI** dengan frame aplikasi mobile, bottom navigation, dan palet premium oranye, teal, lime, dan lavender.

## Tech Stack

| Teknologi | Area | Peran dan alasan penggunaan |
|---|---|---|
| React.js 18 | Frontend | SPA berbasis komponen dan state UI reusable |
| Vite | Frontend tooling | Dev server cepat dan production bundling |
| Tailwind CSS 4 | Frontend styling | UI mobile-first yang konsisten |
| `@tailwindcss/vite` | Frontend tooling | Integrasi Tailwind dengan Vite |
| `lucide-react` | Frontend UI | Ikon ringan dan konsisten |
| Axios | Frontend networking | HTTP client dengan cookie credentials |
| `socket.io-client` | Frontend realtime | Menerima update saldo dan transaksi instan |
| Node.js | Backend runtime | Non-blocking I/O dan JavaScript end-to-end |
| Express.js | Backend API | REST routing dan middleware modular |
| MongoDB Atlas | Database | Penyimpanan cloud user, transaksi, dan asset |
| Mongoose | Backend data layer | Schema, index, validasi, populate, dan transaction |
| bcryptjs | Security | Hashing password |
| jsonwebtoken | Security | Pembuatan dan validasi JWT |
| Cookie `HttpOnly` | Security | Menyimpan JWT agar tidak dibaca JavaScript |
| CSRF double-submit | Security | Validasi request yang mengubah data |
| Helmet | Security | Security-related HTTP headers |
| CORS | Security/API | Mengatur origin dan credentials |
| express-rate-limit | Security/API | Membatasi request dan percobaan login |
| Socket.io | Backend realtime | Room-based event pengirim dan penerima |
| dotenv | Configuration | Memuat secret dan environment variables |
| GoldAPI.io | Third-party API | Harga emas XAU/IDR dengan fallback mock |
| Node.js Fetch | Backend integration | Request API emas tanpa dependency tambahan |

## Struktur Proyek

```text
node-nexa/
├── backend/
│   ├── src/config/          # Koneksi database
│   ├── src/controllers/     # Business logic
│   ├── src/middleware/      # JWT dan keamanan
│   ├── src/models/          # User, Transaction, PortfolioAsset
│   ├── src/routes/          # Auth, banking, portofolio
│   └── src/server.js
└── frontend/
    ├── src/api/             # Axios client
    ├── src/components/      # App shell dan navigation
    ├── src/context/         # Auth state
    ├── src/pages/           # Dashboard, Transfer, Portofolio, Mutasi
    └── src/App.jsx
```

## Menjalankan di Lokal

### Backend

Pastikan MongoDB Atlas memiliki database user dan Network Access yang mengizinkan IP development.

```bash
cd node-nexa/backend
npm install
copy .env.example .env
```

Isi `.env`:

```env
PORT=5000
MONGODB_URI=mongodb+srv://<db_user>:<db_password>@<cluster-url>/nueva?retryWrites=true&w=majority
MONGODB_DB_NAME=nueva
JWT_SECRET=ganti-dengan-rahasia-panjang
JWT_EXPIRES_IN=1d
CLIENT_URL=http://localhost:5173
GOLD_API_KEY=opsional
```

Template environment khusus deployment Render tersedia di `node-nexa/backend/render.env.example`. Gunakan file tersebut sebagai checklist, tetapi masukkan nilai rahasia secara manual melalui menu **Environment Variables** Render.

Jalankan backend:

```bash
npm start
```

Mode development:

```bash
npm run dev
```

### Frontend

```bash
cd node-nexa/frontend
npm install
copy .env.example .env
npm run dev
```

Production URL frontend: [`https://nueva-digital-banking.vercel.app`](https://nueva-digital-banking.vercel.app)  
Production URL backend: [`https://nueva-api-2s5t.onrender.com`](https://nueva-api-2s5t.onrender.com)  
Local URL frontend: `http://localhost:5173`  
Local URL backend: `http://localhost:5000`

## API Utama

| Method | Endpoint | Keterangan |
|---|---|---|
| POST | `/api/auth/register` | Membuat akun baru |
| POST | `/api/auth/login` | Login dan memperoleh JWT |
| GET | `/api/balance` | Melihat saldo user aktif |
| POST | `/api/transfer` | Transfer antarrekening |
| POST | `/api/topup` | Top up simulasi |
| GET | `/api/transactions` | Riwayat mutasi user |
| GET | `/api/portofolio` | Portfolio dan harga emas |
| POST | `/api/portofolio/assets` | Menambah holding simulasi |
| GET | `/health` | Health check service |

## Catatan Keamanan

- Jangan commit file `.env` atau credential MongoDB Atlas.
- Gunakan HTTPS dan secret manager pada deployment production.
- Simpan API key harga emas hanya di backend.
- Jika belum memiliki holding, total portfolio otomatis Rp0.
- Proyek ini adalah simulasi edukasi dan bukan layanan perbankan atau rekomendasi investasi.

## Status Proyek

Nueva siap digunakan sebagai portfolio untuk mendemonstrasikan full-stack JavaScript, REST API, authentication, realtime event, database transaction, dan desain mobile-first.
