"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { loginAPI, logoutAPI } from "../lib/api/auth";

interface Admin {
  id: string;
  email: string;
  role: string;
  nama_lengkap: string;
  sekolah_id?: string;
}

interface AuthContextType {
  admin: Admin | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const router = useRouter();

  // Load admin dari localStorage (supaya tetap login saat refresh)
  useEffect(() => {
    const savedAdmin = localStorage.getItem("admin");
    if (savedAdmin) setAdmin(JSON.parse(savedAdmin));
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // Response dari loginAPI sudah di-extract: { token, user }
      const { token, user } = await loginAPI(email, password);

      // Validasi user data
      if (!user.role || !user.email) {
        console.error("❌ User data incomplete:", user);
        throw new Error("Data user tidak lengkap");
      }

      const allowedRoles = ["superadmin", "admin"];

      if (!allowedRoles.includes(user.role)) {
        throw new Error("Akses ditolak: tidak memiliki izin admin");
      }

      console.log("✅ Login successful:", user.email, user.role);

      setAdmin(user);
      localStorage.setItem("admin", JSON.stringify(user));
      localStorage.setItem("admin_token", token);

      // Simpan juga ke cookie agar middleware bisa pakai
      document.cookie = `token=${token}; path=/;`;
      document.cookie = `role=${user.role}; path=/;`;

      router.push("/dashboard");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Login gagal";
      console.error("❌ Login failed:", errorMessage);
      throw error;
    }
  };

  const logout = async () => {
    try {
      // Call backend to invalidate token
      await logoutAPI();
    } catch (error) {
      // Log error but still proceed with client-side cleanup
      console.error("Logout API error:", error);
    } finally {
      // Always clear client-side data
      setAdmin(null);
      localStorage.removeItem("admin");
      localStorage.removeItem("admin_token");
      document.cookie = "token=; Max-Age=0; path=/;";
      document.cookie = "role=; Max-Age=0; path=/;";
      router.push("/masuk");
    }
  };

  return (
    <AuthContext.Provider value={{ admin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
