"use client";

import Link from "next/link";
import { useState } from "react";
import AuthLayout from "@/components/auth/AuthLayout";
import AuthCard from "@/components/auth/AuthCard";
import AuthHeader from "@/components/auth/AuthHeader";
import AuthInput from "@/components/auth/AuthInput";
import AuthButton from "@/components/auth/AuthButton";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function MasukPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
      // Router.push sudah ada di AuthContext, tapi kita tetap panggil untuk memastikan
      router.push("/dashboard");
    } catch (error: any) {
      // Menampilkan error yang lebih deskriptif
      const errorMessage =
        error?.message ||
        "Login gagal. Periksa kembali email dan password Anda.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <AuthCard>
        <AuthHeader
          title="Masuk ke Akun Admin"
          subtitle="Kelola sistem Adaptivin dengan mudah"
        />

        <form onSubmit={handleSubmit} className="space-y-5 mt-6">
          {/* Error Alert */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start gap-3 animate-shake animate-fadeIn">
              <svg
                className="w-5 h-5 mt-0.5 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <div className="flex-1">
                <p className="font-medium text-sm">{error}</p>
              </div>
              <button
                type="button"
                onClick={() => setError("")}
                className="text-red-500 hover:text-red-700 transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          )}

          {/* Loading Indicator */}
          {loading && (
            <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg flex items-center gap-3 animate-fadeIn">
              <svg
                className="animate-spin h-5 w-5 text-blue-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <p className="font-medium text-sm">Memproses login...</p>
            </div>
          )}

          <AuthInput
            label="Email"
            type="email"
            value={email}
            onChange={setEmail}
            placeholder="admin@adaptivin.com"
            icon="Email"
            id="email"
            name="email"
            required
            disabled={loading}
          />

          <AuthInput
            label="Password"
            type="password"
            value={password}
            onChange={setPassword}
            placeholder="Masukkan password"
            icon="Lock"
            hasToggle
            id="password"
            name="password"
            required
            minLength={6}
            disabled={loading}
          />

          <div className="pt-2">
            <AuthButton
              label={loading ? "Memproses..." : "Masuk"}
              type="submit"
              primary
              loading={loading}
            />
          </div>

          {/* Info Text */}
          <div className="text-center text-sm text-gray-500 mt-4">
            <p>Belum punya akun admin?</p>
            <p className="mt-1">
              Hubungi <span className="font-semibold text-primary-600">superadmin</span> untuk mendapatkan akses
            </p>
          </div>
        </form>
      </AuthCard>
    </AuthLayout>
  );
}
