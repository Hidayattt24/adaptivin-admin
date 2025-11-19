import axios from "axios";
import { extractData } from "./responseHelper";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

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
  baseURL: API_BASE_URL,
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

interface SekolahResponse {
  id: string;
  nama_sekolah: string;
  alamat_sekolah: string;
  created_at?: string;
  updated_at?: string;
}

interface SekolahDeleteResponse extends SekolahResponse {
  affected?: {
    guru?: number;
    siswa?: number;
    kelas?: number;
  };
}

// Fungsi CRUD sekolah
export async function getAllSekolah() {
  const res = await api.get("/sekolah");

  // Backend response: { success: true, status: "success", data: [...], message }
  return extractData<SekolahResponse[]>(res);
}

export async function createSekolah(payload: {
  nama_sekolah: string;
  alamat_sekolah: string;
}) {
  const res = await api.post("/sekolah/buat-sekolah", payload);

  // Backend response: { success: true, status: "success", data: {...}, message }
  return extractData<SekolahResponse>(res);
}

export async function getSekolahById(id: string) {
  const res = await api.get(`/sekolah/${id}`);

  // Backend response: { success: true, status: "success", data: {...}, message }
  return extractData<SekolahResponse>(res);
}

export async function updateSekolah(
  id: string,
  payload: {
    nama_sekolah?: string;
    alamat_sekolah?: string;
  }
) {
  const res = await api.put(`/sekolah/${id}`, payload);

  // Backend response: { success: true, status: "success", data: {...}, message }
  return extractData<SekolahResponse>(res);
}

export async function deleteSekolah(id: string) {
  const res = await api.delete(`/sekolah/${id}`);

  // Backend response: { success: true, status: "success", data: {...affected}, message }
  return extractData<SekolahDeleteResponse>(res);
}
