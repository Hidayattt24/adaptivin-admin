"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  PersonOutline,
  EmailOutlined,
  PhoneOutlined,
  LocationOnOutlined,
  Save,
  BadgeOutlined
} from "@mui/icons-material";
import Swal from "sweetalert2";

export default function ProfileSettings() {
  const [formData, setFormData] = useState({
    nama: "Admin Adaptivin",
    email: "admin@adaptivin.com",
    telepon: "0812-3456-7890",
    alamat: "Banda Aceh, Aceh",
    jabatan: "Administrator Sistem",
    bio: "Administrator sistem pembelajaran Matematika SD"
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
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
  };

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
            {formData.nama.charAt(0)}
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">{formData.nama}</h3>
            <p className="text-sm text-gray-600">{formData.jabatan}</p>
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
            name="nama"
            value={formData.nama}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-[12px] border-2 border-gray-200 focus:border-[#33A1E0] transition-all text-gray-900 font-medium focus:outline-none"
            placeholder="Masukkan nama lengkap"
          />
        </div>

        {/* Jabatan */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
            <BadgeOutlined className="text-[#33A1E0]" sx={{ fontSize: 18 }} />
            Jabatan
          </label>
          <input
            type="text"
            name="jabatan"
            value={formData.jabatan}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-[12px] border-2 border-gray-200 focus:border-[#33A1E0] transition-all text-gray-900 font-medium focus:outline-none"
            placeholder="Masukkan jabatan"
          />
        </div>

        {/* Email */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
            <EmailOutlined className="text-[#33A1E0]" sx={{ fontSize: 18 }} />
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-[12px] border-2 border-gray-200 focus:border-[#33A1E0] transition-all text-gray-900 font-medium focus:outline-none"
            placeholder="Masukkan email"
          />
        </div>

        {/* Telepon */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
            <PhoneOutlined className="text-[#33A1E0]" sx={{ fontSize: 18 }} />
            Nomor Telepon
          </label>
          <input
            type="tel"
            name="telepon"
            value={formData.telepon}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-[12px] border-2 border-gray-200 focus:border-[#33A1E0] transition-all text-gray-900 font-medium focus:outline-none"
            placeholder="Masukkan nomor telepon"
          />
        </div>

        {/* Alamat - Full Width */}
        <div className="md:col-span-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
            <LocationOnOutlined className="text-[#33A1E0]" sx={{ fontSize: 18 }} />
            Alamat
          </label>
          <input
            type="text"
            name="alamat"
            value={formData.alamat}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-[12px] border-2 border-gray-200 focus:border-[#33A1E0] transition-all text-gray-900 font-medium focus:outline-none"
            placeholder="Masukkan alamat"
          />
        </div>

        {/* Bio - Full Width */}
        <div className="md:col-span-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
            Bio
          </label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-3 rounded-[12px] border-2 border-gray-200 focus:border-[#33A1E0] transition-all text-gray-900 font-medium focus:outline-none resize-none"
            placeholder="Ceritakan tentang diri Anda"
          />
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end mt-8 pt-6 border-t border-gray-200">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSave}
          className="flex items-center gap-2 px-6 py-3 rounded-[12px] bg-gradient-to-r from-[#33A1E0] to-[#2288C3] text-white font-semibold hover:shadow-lg transition-all"
        >
          <Save sx={{ fontSize: 20 }} />
          <span>Simpan Perubahan</span>
        </motion.button>
      </div>
    </div>
  );
}
