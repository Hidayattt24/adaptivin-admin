import axios from "axios";
import { extractData } from "./responseHelper";

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

interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    nama_lengkap: string;
    role: string;
  };
}

// Login (bisa untuk admin/guru/siswa, tergantung endpoint backend kamu)
export const loginAPI = async (email: string, password: string) => {
  try {
    console.log("🔐 Attempting login for:", email);

    const response = await api.post("/auth/login", { email, password });

    console.log("📦 Raw response:", response.data);

    // Backend response: { success: true, status: "success", data: { token, user }, message }
    const loginData = extractData<LoginResponse>(response);

    console.log("✅ Extracted login data:", {
      hasToken: !!loginData.token,
      hasUser: !!loginData.user,
      userRole: loginData.user?.role,
      userEmail: loginData.user?.email,
    });

    return loginData;
  } catch (error) {
    console.error("❌ Login API error:", error);

    if (axios.isAxiosError(error)) {
      const errorData = error.response?.data as ApiErrorResponse;
      console.error("❌ Error response data:", errorData);
      throw new Error(errorData?.error || errorData?.message || "Login gagal");
    }
    throw error;
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
