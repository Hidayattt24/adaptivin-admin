"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { loginAPI } from "../lib/api";

interface Admin {
  id: string;
  email: string;
  role: string;
  nama_lengkap: string;
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
      const data = await loginAPI(email, password); // Panggil backend kamu (Express)

      const allowedRoles = ["superadmin", "admin"];

      if (!allowedRoles.includes(data.user.role)) {
        throw new Error("Akses ditolak: tidak memiliki izin");
      }

      setAdmin(data.user);
      localStorage.setItem("admin", JSON.stringify(data.user));
      localStorage.setItem("admin_token", data.token);

      // Simpan juga ke cookie agar middleware bisa pakai
      document.cookie = `token=${data.token}; path=/;`;
      document.cookie = `role=${data.user.role}; path=/;`;

      router.push("/dashboard");
    } catch (error: any) {
      console.error("Login gagal:", error.message);
      throw error;
    }
  };

  const logout = () => {
    setAdmin(null);
    localStorage.removeItem("admin");
    localStorage.removeItem("admin_token");
    document.cookie = "token=; Max-Age=0; path=/;";
    document.cookie = "role=; Max-Age=0; path=/;";
    router.push("/masuk");
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
