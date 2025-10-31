import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// Ambil token dari cookie browser
function getTokenFromCookie() {
  if (typeof document === "undefined") return null;
  const token = document.cookie
    .split("; ")
    .find((row) => row.startsWith("token="))
    ?.split("=")[1];
  return token;
}

// Buat instance axios dengan konfigurasi default
const api = axios.create({
  baseURL: `${API_BASE}/api`,
  withCredentials: true,
});

// Interceptor untuk selalu menambahkan Authorization header
api.interceptors.request.use(
  (config) => {
    const token = getTokenFromCookie();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Fungsi CRUD sekolah
export async function getAllSekolah() {
  const res = await api.get("/sekolah");
  return res.data.sekolah;
}

export async function createSekolah(payload: {
  nama_sekolah: string;
  alamat_sekolah: string;
}) {
  const res = await api.post("/sekolah/buat-sekolah", payload);
  return res.data.sekolah;
}

export async function getSekolahById(id: string) {
  const res = await api.get(`/sekolah/${id}`);
  return res.data.sekolah;
}

export async function updateSekolah(id: string, payload: any) {
  const res = await api.put(`/sekolah/${id}`, payload);
  return res.data.sekolah;
}

export async function deleteSekolah(id: string) {
  const res = await api.delete(`/sekolah/${id}`);
  return res.data.sekolah;
}
