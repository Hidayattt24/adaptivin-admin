"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  LockOutlined,
  Visibility,
  VisibilityOff,
  Save,
  CheckCircleOutline,
  ErrorOutline
} from "@mui/icons-material";
import Swal from "sweetalert2";

export default function SecuritySettings() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [passwordStrength, setPasswordStrength] = useState(0);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));

    // Calculate password strength for new password
    if (name === "newPassword") {
      let strength = 0;
      if (value.length >= 8) strength++;
      if (value.length >= 12) strength++;
      if (/[a-z]/.test(value) && /[A-Z]/.test(value)) strength++;
      if (/\d/.test(value)) strength++;
      if (/[^a-zA-Z0-9]/.test(value)) strength++;
      setPasswordStrength(strength);
    }
  };

  const getStrengthColor = () => {
    if (passwordStrength <= 1) return "bg-red-500";
    if (passwordStrength <= 3) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getStrengthText = () => {
    if (passwordStrength <= 1) return "Lemah";
    if (passwordStrength <= 3) return "Sedang";
    return "Kuat";
  };

  const [isChanging, setIsChanging] = useState(false);

  const handleChangePassword = async () => {
    if (isChanging) return;

    if (!passwordData.currentPassword) {
      Swal.fire({
        title: "Error!",
        text: "Password saat ini harus diisi.",
        icon: "error",
        confirmButtonColor: "#ef4444",
        confirmButtonText: "OK",
      });
      return;
    }

    if (!passwordData.newPassword) {
      Swal.fire({
        title: "Error!",
        text: "Password baru harus diisi.",
        icon: "error",
        confirmButtonColor: "#ef4444",
        confirmButtonText: "OK",
      });
      return;
    }

    if (passwordData.newPassword.length < 8) {
      Swal.fire({
        title: "Error!",
        text: "Password baru minimal 8 karakter.",
        icon: "error",
        confirmButtonColor: "#ef4444",
        confirmButtonText: "OK",
      });
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      Swal.fire({
        title: "Error!",
        text: "Password baru dan konfirmasi password tidak cocok.",
        icon: "error",
        confirmButtonColor: "#ef4444",
        confirmButtonText: "OK",
      });
      return;
    }

    try {
      setIsChanging(true);

      // Import the API function dynamically
      const { updateMyPassword } = await import("@/lib/api/user");

      await updateMyPassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      Swal.fire({
        title: "Berhasil!",
        text: "Password Anda telah diubah.",
        icon: "success",
        confirmButtonColor: "#33A1E0",
        confirmButtonText: "OK",
        background: "#ffffff",
        customClass: {
          popup: "rounded-[20px] shadow-2xl",
          title: "text-primary text-2xl font-semibold",
          confirmButton: "font-semibold px-6 py-3 rounded-[12px]",
        },
      });

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
      setPasswordStrength(0);
    } catch (error: unknown) {
      console.error("Gagal mengubah password:", error);
      let errorMessage = "Gagal mengubah password";

      if (error instanceof Error) {
        errorMessage = error.message || errorMessage;
      } else if (typeof error === "object" && error !== null) {
        const maybeResponse = (error as { response?: unknown }).response;
        if (typeof maybeResponse === "object" && maybeResponse !== null) {
          const maybeData = (maybeResponse as { data?: unknown }).data;
          if (typeof maybeData === "object" && maybeData !== null) {
            const maybeError = (maybeData as { error?: unknown }).error;
            if (typeof maybeError === "string" && maybeError.length > 0) {
              errorMessage = maybeError;
            }
          }
        }
      }

      Swal.fire({
        title: "Error!",
        text: errorMessage,
        icon: "error",
        confirmButtonColor: "#ef4444",
        confirmButtonText: "OK",
      });
    } finally {
      setIsChanging(false);
    }
  };

  return (
    <div className="bg-white rounded-[20px] shadow-lg p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Ubah Password</h2>
        <p className="text-sm text-gray-600">Perbarui password Anda secara berkala untuk menjaga keamanan akun</p>
      </div>

      <div className="space-y-6">
        {/* Current Password */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
            <LockOutlined className="text-primary" sx={{ fontSize: 18 }} />
            Password Saat Ini
          </label>
          <div className="relative">
            <input
              type={showCurrentPassword ? "text" : "password"}
              name="currentPassword"
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
              className="w-full px-4 py-3 pr-12 rounded-xl border-2 border-gray-200 focus:border-primary transition-all text-gray-900 font-medium focus:outline-none"
              placeholder="Masukkan password saat ini"
            />
            <button
              type="button"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded transition-colors"
            >
              {showCurrentPassword ? (
                <VisibilityOff className="text-gray-400" sx={{ fontSize: 20 }} />
              ) : (
                <Visibility className="text-gray-400" sx={{ fontSize: 20 }} />
              )}
            </button>
          </div>
        </div>

        {/* New Password */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
            <LockOutlined className="text-primary" sx={{ fontSize: 18 }} />
            Password Baru
          </label>
          <div className="relative">
            <input
              type={showNewPassword ? "text" : "password"}
              name="newPassword"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              className="w-full px-4 py-3 pr-12 rounded-xl border-2 border-gray-200 focus:border-primary transition-all text-gray-900 font-medium focus:outline-none"
              placeholder="Masukkan password baru (min. 8 karakter)"
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded transition-colors"
            >
              {showNewPassword ? (
                <VisibilityOff className="text-gray-400" sx={{ fontSize: 20 }} />
              ) : (
                <Visibility className="text-gray-400" sx={{ fontSize: 20 }} />
              )}
            </button>
          </div>

          {/* Password Strength Indicator */}
          {passwordData.newPassword && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-600">Kekuatan Password:</span>
                <span className={`text-xs font-semibold ${passwordStrength <= 1 ? "text-red-600" :
                    passwordStrength <= 3 ? "text-yellow-600" :
                      "text-green-600"
                  }`}>
                  {getStrengthText()}
                </span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(passwordStrength / 5) * 100}%` }}
                  className={`h-full ${getStrengthColor()} transition-all`}
                />
              </div>
            </motion.div>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
            <LockOutlined className="text-primary" sx={{ fontSize: 18 }} />
            Konfirmasi Password Baru
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              className="w-full px-4 py-3 pr-12 rounded-xl border-2 border-gray-200 focus:border-primary transition-all text-gray-900 font-medium focus:outline-none"
              placeholder="Konfirmasi password baru"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded transition-colors"
            >
              {showConfirmPassword ? (
                <VisibilityOff className="text-gray-400" sx={{ fontSize: 20 }} />
              ) : (
                <Visibility className="text-gray-400" sx={{ fontSize: 20 }} />
              )}
            </button>
          </div>

          {/* Password Match Indicator */}
          {passwordData.confirmPassword && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-2"
            >
              {passwordData.newPassword === passwordData.confirmPassword ? (
                <div className="flex items-center gap-2 text-green-600 text-sm">
                  <CheckCircleOutline sx={{ fontSize: 16 }} />
                  <span>Password cocok</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-red-600 text-sm">
                  <ErrorOutline sx={{ fontSize: 16 }} />
                  <span>Password tidak cocok</span>
                </div>
              )}
            </motion.div>
          )}
        </div>

        {/* Password Requirements */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
          <p className="text-sm font-semibold text-blue-800 mb-2">Persyaratan Password:</p>
          <ul className="space-y-1 text-xs text-blue-700">
            <li className="flex items-center gap-2">
              <span className={passwordData.newPassword.length >= 8 ? "text-green-600" : ""}>
                {passwordData.newPassword.length >= 8 ? "✓" : "•"}
              </span>
              Minimal 8 karakter
            </li>
            <li className="flex items-center gap-2">
              <span className={/[A-Z]/.test(passwordData.newPassword) && /[a-z]/.test(passwordData.newPassword) ? "text-green-600" : ""}>
                {/[A-Z]/.test(passwordData.newPassword) && /[a-z]/.test(passwordData.newPassword) ? "✓" : "•"}
              </span>
              Kombinasi huruf besar dan kecil
            </li>
            <li className="flex items-center gap-2">
              <span className={/\d/.test(passwordData.newPassword) ? "text-green-600" : ""}>
                {/\d/.test(passwordData.newPassword) ? "✓" : "•"}
              </span>
              Mengandung angka
            </li>
            <li className="flex items-center gap-2">
              <span className={/[^a-zA-Z0-9]/.test(passwordData.newPassword) ? "text-green-600" : ""}>
                {/[^a-zA-Z0-9]/.test(passwordData.newPassword) ? "✓" : "•"}
              </span>
              Mengandung karakter khusus (!@#$%^&*)
            </li>
          </ul>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end mt-8 pt-6 border-t border-gray-200">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleChangePassword}
          disabled={isChanging}
          className="flex items-center gap-2 px-8 py-3 rounded-xl bg-linear-to-r from-primary to-primary-dark text-white font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save sx={{ fontSize: 20 }} />
          <span>{isChanging ? "Mengubah Password..." : "Ubah Password"}</span>
        </motion.button>
      </div>
    </div>
  );
}
