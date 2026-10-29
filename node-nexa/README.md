# Nexa Web Banking

Portfolio web banking sederhana untuk demonstrasi kemampuan backend dan frontend.

## Teknologi

- Node.js dan Express
- EJS
- MySQL
- Express Session dengan penyimpanan session di MySQL
- Vanilla JavaScript dan CSS

## Menjalankan lokal

```bash
npm install
copy .env.example .env
```

Import `database.sql` melalui phpMyAdmin, lalu jalankan:

```bash
npm start
```

Buka `http://localhost:3000`.

Akun demo: `demo@nexa.id` / `Nexa1234`. OTP transfer: `123456`.

## Endpoint

- `GET /health`
- `GET /dashboard`
- `GET /activity`
- `GET /transfer`
- `GET /profile`

Semua data hanya simulasi dan tidak mewakili rekening nyata.

## Deployment

Deploy sebagai Node Web Service di Render atau Railway. Root directory adalah `node-nexa`, build command `npm install`, dan start command `npm start`. Isi environment variable dari `.env.example`; jangan mengunggah `.env` ke GitHub.
