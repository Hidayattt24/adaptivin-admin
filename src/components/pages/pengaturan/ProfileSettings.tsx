"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  PersonOutline,
  EmailOutlined,
  LocationOnOutlined,
  Save,
  WcOutlined
} from "@mui/icons-material";
import Swal from "sweetalert2";
import { useAuth } from "@/contexts/AuthContext";
import { getMyProfile, updateMyProfile } from "@/lib/api/user";

export default function ProfileSettings() {
  const { admin } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    nama_lengkap: "",
    email: "",
    jenisKelamin: "",
    alamat: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      if (!admin) return;

      try {
        setIsLoading(true);
        const profile = await getMyProfile();
        setFormData({
          nama_lengkap: profile.nama_lengkap || "",
          email: profile.email || "",
          jenisKelamin: profile.jenisKelamin || "",
          alamat: profile.alamat || "",
        });
      } catch (error) {
        console.error("Gagal memuat profil:", error);
        Swal.fire({
          title: "Error!",
          text: "Gagal memuat data profil",
          icon: "error",
          confirmButtonColor: "#ef4444",
          confirmButtonText: "OK",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [admin]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (isSaving) return;

    try {
      setIsSaving(true);
      await updateMyProfile({
        nama_lengkap: formData.nama_lengkap,
        jenisKelamin: formData.jenisKelamin,
        alamat: formData.alamat,
      });

      Swal.fire({
        title: "Berhasil!",
        text: "Profil Anda telah diperbarui.",
        icon: "success",
        confirmButtonColor: "#33A1E0",
        confirmButtonText: "OK",
        background: "#ffffff",
        customClass: {
          popup: "rounded-[20px] shadow-2xl",
          title: "text-[#33A1E0] text-2xl font-semibold",
          confirmButton: "font-semibold px-6 py-3 rounded-[12px]",
        },
      });
    } catch (error) {
      console.error("Gagal menyimpan profil:", error);
      Swal.fire({
        title: "Error!",
        text: "Gagal menyimpan perubahan profil",
        icon: "error",
        confirmButtonColor: "#ef4444",
        confirmButtonText: "OK",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-[20px] shadow-lg p-8">
        <div className="text-center py-12">
          <p className="text-gray-500 font-medium">Memuat data profil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[20px] shadow-lg p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Profil Saya</h2>
        <p className="text-sm text-gray-600">Kelola informasi profil Anda</p>
      </div>

      {/* Info Card */}
      <div className="mb-8 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-[15px] border border-blue-100">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#33A1E0] to-[#2288C3] flex items-center justify-center text-white text-2xl font-bold shadow-lg">
            {formData.nama_lengkap.charAt(0) || "A"}
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">{formData.nama_lengkap || "Admin"}</h3>
            <p className="text-sm text-gray-600">{admin?.role === "superadmin" ? "Super Administrator" : "Administrator"}</p>
            <p className="text-xs text-gray-500 mt-1">{formData.email}</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Nama */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
            <PersonOutline className="text-[#33A1E0]" sx={{ fontSize: 18 }} />
            Nama Lengkap
          </label>
          <input
            type="text"
            name="nama_lengkap"
            value={formData.nama_lengkap}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-[12px] border-2 border-gray-200 focus:border-[#33A1E0] transition-all text-gray-900 font-medium focus:outline-none"
            placeholder="Masukkan nama lengkap"
          />
        </div>

        {/* Jenis Kelamin */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
            <WcOutlined className="text-[#33A1E0]" sx={{ fontSize: 18 }} />
            Jenis Kelamin
          </label>
          <select
            name="jenisKelamin"
            value={formData.jenisKelamin}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-[12px] border-2 border-gray-200 focus:border-[#33A1E0] transition-all text-gray-900 font-medium focus:outline-none"
          >
            <option value="">Pilih Jenis Kelamin</option>
            <option value="laki-laki">Laki-laki</option>
            <option value="perempuan">Perempuan</option>
          </select>
        </div>

        {/* Email (Read-only) */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
            <EmailOutlined className="text-[#33A1E0]" sx={{ fontSize: 18 }} />
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            disabled
            className="w-full px-4 py-3 rounded-[12px] border-2 border-gray-200 bg-gray-50 text-gray-500 font-medium cursor-not-allowed"
            placeholder="Email"
          />
          <p className="text-xs text-gray-500 mt-1">Email tidak dapat diubah</p>
        </div>

        {/* Role (Read-only) */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
            Role
          </label>
          <input
            type="text"
            value={admin?.role === "superadmin" ? "Super Administrator" : "Administrator"}
            disabled
            className="w-full px-4 py-3 rounded-[12px] border-2 border-gray-200 bg-gray-50 text-gray-500 font-medium cursor-not-allowed"
          />
        </div>

        {/* Alamat - Full Width */}
        <div className="md:col-span-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
            <LocationOnOutlined className="text-[#33A1E0]" sx={{ fontSize: 18 }} />
            Alamat
          </label>
          <textarea
            name="alamat"
            value={formData.alamat}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-3 rounded-[12px] border-2 border-gray-200 focus:border-[#33A1E0] transition-all text-gray-900 font-medium focus:outline-none resize-none"
            placeholder="Masukkan alamat lengkap"
          />
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end mt-8 pt-6 border-t border-gray-200">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-6 py-3 rounded-[12px] bg-gradient-to-r from-[#33A1E0] to-[#2288C3] text-white font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save sx={{ fontSize: 20 }} />
          <span>{isSaving ? "Menyimpan..." : "Simpan Perubahan"}</span>
        </motion.button>
      </div>
    </div>
  );
}
