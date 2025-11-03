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

// Logout - invalidate token di backend
export const logoutAPI = async () => {
  try {
    const response = await api.post("/auth/logout");
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorData = error.response?.data as ApiErrorResponse;
      console.error("Logout API error:", errorData);
      throw new Error(errorData?.error || errorData?.message || "Logout gagal");
    }
    throw new Error("Logout gagal");
  }
};
