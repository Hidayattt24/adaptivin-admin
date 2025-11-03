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
    try {
      await login(email, password);
      router.push("/dashboard");
    } catch (error) {
      setError("Login failed");
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
      </AuthCard>
    </AuthLayout>
  );
}
