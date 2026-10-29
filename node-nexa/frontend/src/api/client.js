import axios from 'axios';

// Membuat client API dan otomatis menyisipkan JWT ke setiap request.
const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api', withCredentials: true });
let csrfToken = '';

// Mengambil token CSRF dari backend agar tetap bekerja lintas domain Vercel-Render.
export async function ensureCsrfToken() {
  if (!csrfToken) {
    const { data } = await api.get('/csrf');
    csrfToken = data.csrfToken;
  }
  return csrfToken;
}

api.interceptors.request.use(async (config) => {
  if (['post', 'put', 'patch', 'delete'].includes(config.method?.toLowerCase())) {
    const token = await ensureCsrfToken();
    config.headers['X-CSRF-Token'] = token;
  }
  return config;
});
export default api;
