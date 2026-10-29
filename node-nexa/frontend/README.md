# Nueva Frontend

Frontend React + Tailwind CSS untuk backend `node-nexa/backend`.

## Instalasi

```bash
cd node-nexa/frontend
npm install
copy .env.example .env
npm run dev
```

Library utama: `axios` untuk HTTP API, `lucide-react` untuk ikon, dan `socket.io-client` untuk update saldo realtime.

URL default API adalah `http://localhost:5000/api`, sedangkan Socket.io default ke `http://localhost:5000`. Sesuaikan melalui `.env` jika diperlukan.
