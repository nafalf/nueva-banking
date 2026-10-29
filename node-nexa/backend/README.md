# Nueva Backend — MERN API

Backend REST API untuk simulasi digital banking Nueva menggunakan MongoDB, Express, React client, dan Node.js.

## Menjalankan

```bash
npm install
copy .env.example .env
npm run dev
```

Isi `MONGODB_URI` dengan connection string MongoDB Atlas dari menu **Connect > Drivers**. Sebelum menjalankan server, pastikan:

1. Di **Database Access**, sudah ada database user dan password.
2. Di **Network Access**, tambahkan IP Anda atau `0.0.0.0/0` untuk development sementara.
3. Ganti placeholder `<db_user>`, `<db_password>`, dan `<cluster-url>` di `.env`. Jika password memiliki karakter khusus seperti `@`, `#`, atau `/`, URL-encode terlebih dahulu.

`DNS_SERVERS=1.1.1.1,8.8.8.8` membantu koneksi Atlas pada jaringan yang DNS lokalnya menolak query SRV. Jika jaringan kantor memblokir DNS publik, hapus variabel ini atau gunakan DNS jaringan yang diizinkan.

Endpoint transfer memakai transaction MongoDB, sehingga MongoDB lokal perlu replica set; MongoDB Atlas sudah mendukungnya.

## Endpoint utama

- `POST /api/auth/register` — `{ name, email, password }`
- `POST /api/auth/login` — `{ email, password }`
- `GET /api/balance` — Bearer JWT
- `GET /api/transactions` — Bearer JWT
- `POST /api/transfer` — Bearer JWT, `{ recipientAccountNumber, amount }`
- `POST /api/topup` — Bearer JWT, `{ amount }`
- `GET /api/investasi` — data emas simulasi dan tiga reksadana
- `GET /health`

## Socket.io

Frontend membuat koneksi dengan `io(API_URL, { auth: { token } })`. Server otomatis memasukkan socket ke room user dari JWT. Setelah transfer/topup sukses, server mengirim event `balance:updated` dan `transaction:created` ke room user terkait.
