"use client";

import Link from "next/link";
import { useState } from "react";
import AuthLayout from "@/components/auth/AuthLayout";
import AuthCard from "@/components/auth/AuthCard";
import AuthHeader from "@/components/auth/AuthHeader";
import AuthInput from "@/components/auth/AuthInput";
import AuthButton from "@/components/auth/AuthButton";

export default function MasukPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Mock login - ready for Supabase integration
    console.log({ email, password });

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      // TODO: Add actual authentication logic here
    }, 1500);
  };

  return (
    <AuthLayout>
      <AuthCard>
        <AuthHeader
          title="Masuk ke Akun Admin"
          subtitle="Kelola sistem Adaptivin dengan mudah"
        />

        <form onSubmit={handleSubmit} className="space-y-5 mt-6">
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
            placeholder="Masukkan password"
            icon="Lock"
            hasToggle
            id="password"
            name="password"
            required
            minLength={6}
          />

          <div className="pt-2">
            <AuthButton
              label="Masuk"
              type="submit"
              primary
              loading={loading}
            />
          </div>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Belum punya akun?{" "}
          <Link
            href="/daftar"
            className="text-[#33A1E0] font-medium hover:underline transition-all"
          >
            Daftar sekarang
          </Link>
        </p>
      </AuthCard>
    </AuthLayout>
  );
}
