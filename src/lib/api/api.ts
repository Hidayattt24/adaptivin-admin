import axios from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

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
      typeof window !== "undefined"
        ? localStorage.getItem("admin_token")
        : null;
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

// Type untuk error response dari axios
interface ApiErrorResponse {
  error?: string;
  message?: string;
  details?: string;
}

// Login (bisa untuk admin/guru/siswa, tergantung endpoint backend kamu)
export const loginAPI = async (email: string, password: string) => {
  try {
    // Backend: POST /api/auth/login
    // baseURL sudah http://localhost:5000/api
    // Jadi endpoint: /auth/login (TANPA /api lagi!)
    const response = await api.post("/auth/login", { email, password });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorData = error.response?.data as ApiErrorResponse;
      console.error("Login API error:", errorData);
      throw new Error(errorData?.error || errorData?.message || "Login gagal");
    }
    throw new Error("Login gagal");
  }
};

// Logout (opsional — kalau backend kamu handle revoke token)
export const logoutAPI = async () => {
  try {
    await api.post("/auth/logout");
  } catch (error) {
    console.warn("Logout warning:", error);
  }
};