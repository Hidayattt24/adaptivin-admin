"use client";

import Link from "next/link";
import { useState } from "react";
import AuthLayout from "@/components/auth/AuthLayout";
import AuthCard from "@/components/auth/AuthCard";
import AuthHeader from "@/components/auth/AuthHeader";
import AuthInput from "@/components/auth/AuthInput";
import AuthButton from "@/components/auth/AuthButton";

export default function DaftarPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!agreeTerms) {
      alert("Anda harus menyetujui persyaratan dan ketentuan");
      return;
    }

    if (password !== confirmPassword) {
      alert("Password dan konfirmasi password tidak cocok");
      return;
    }

    if (password.length < 6) {
      alert("Password minimal 6 karakter");
      return;
    }

    setLoading(true);

    // Mock registration - ready for Supabase integration
    console.log({ fullName, email, password });

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      // TODO: Add actual registration logic here
    }, 1500);
  };

  return (
    <AuthLayout>
      <AuthCard>
        <AuthHeader
          title="Buat Akun Admin"
          subtitle="Bergabung untuk mengelola sistem Adaptivin"
        />

        <form onSubmit={handleSubmit} className="space-y-5 mt-6">
          <AuthInput
            label="Nama Lengkap"
            type="text"
            value={fullName}
            onChange={setFullName}
            placeholder="Masukkan nama lengkap"
            icon="Person"
            id="fullName"
            name="fullName"
            required
          />

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
          />

          <AuthInput
            label="Password"
            type="password"
            value={password}
            onChange={setPassword}
            placeholder="Minimal 6 karakter"
            icon="Lock"
            hasToggle
            id="password"
            name="password"
            required
            minLength={6}
          />

          <AuthInput
            label="Konfirmasi Password"
            type="password"
            value={confirmPassword}
            onChange={setConfirmPassword}
            placeholder="Ulangi password"
            icon="Lock"
            hasToggle
            id="confirmPassword"
            name="confirmPassword"
            required
            minLength={6}
          />

          <div className="flex items-start pt-2">
            <input
              type="checkbox"
              id="agreeTerms"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="mt-1 w-4 h-4 text-[#33A1E0] border-2 border-gray-300 rounded focus:ring-2 focus:ring-[#33A1E0]/50"
              required
            />
            <label htmlFor="agreeTerms" className="ml-3 text-sm text-gray-600">
              Saya menyetujui{" "}
              <a href="#" className="text-[#33A1E0] hover:underline font-medium">
                persyaratan dan ketentuan
              </a>{" "}
              yang berlaku
            </label>
          </div>

          <div className="pt-2">
            <AuthButton
              label="Daftar Sekarang"
              type="submit"
              primary
              loading={loading}
              disabled={!agreeTerms}
            />
          </div>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Sudah punya akun?{" "}
          <Link
            href="/masuk"
            className="text-[#33A1E0] font-medium hover:underline transition-all"
          >
            Masuk di sini
          </Link>
        </p>
      </AuthCard>
    </AuthLayout>
  );
}
