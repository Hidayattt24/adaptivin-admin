import axios from "axios";

// Ambil base URL dari environment variable (aman dan fleksibel)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// Buat instance axios agar semua request otomatis pakai base URL
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Middleware axios untuk otomatis nambah token JWT kalau ada
api.interceptors.request.use(
  (config) => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("admin_token") : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

//
// ========== AUTH (ADMIN & USER) ==========
//

// Login (bisa untuk admin/guru/siswa, tergantung endpoint backend kamu)
export const loginAPI = async (email: string, password: string) => {
  try {
    const response = await api.post("/api/auth/login", { email, password });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Login gagal");
  }
};

// Logout (opsional — kalau backend kamu handle revoke token)
export const logoutAPI = async () => {
  try {
    await api.post("/api/auth/logout");
  } catch (error) {
    console.warn("Logout warning:", error);
  }
};

// Ambil data admin dari backend (misal verifikasi token)
export const getAdminProfile = async () => {
  try {
    const response = await api.get("/api/admin/profile");
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Gagal ambil profil admin");
  }
};

//
// ========== CONTOH TAMBAHAN ==========
//

// Contoh ambil daftar pengguna
export const getAllUsers = async () => {
  try {
    const response = await api.get("/api/users");
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Gagal ambil data pengguna");
  }
};

// Contoh ambil data dashboard admin
export const getDashboardStats = async () => {
  try {
    const response = await api.get("/api/admin/stats");
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Gagal ambil statistik");
  }
};

export default api;
