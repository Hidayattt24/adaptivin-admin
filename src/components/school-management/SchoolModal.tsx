"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Close,
  SchoolOutlined,
  LocationOnOutlined,
  Save
} from "@mui/icons-material";

interface Sekolah {
  id: string;
  nama_sekolah: string;
  alamat_sekolah: string;
}

interface SekolahModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (sekolah: Sekolah) => void;
  sekolah?: Sekolah | null;
  mode: "create" | "edit";
}

export default function SchoolModal({
  isOpen,
  onClose,
  onSave,
  sekolah,
  mode
}: SekolahModalProps) {
  const [formData, setFormData] = useState<Sekolah>({
    id: "",
    nama_sekolah: "",
    alamat_sekolah: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (sekolah && mode === "edit") {
      setFormData(sekolah);
    } else {
      setFormData({
        id: "",
        nama_sekolah: "",
        alamat_sekolah: "",
      });
    }
    setErrors({});
  }, [sekolah, mode, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.nama_sekolah.trim()) newErrors.nama_sekolah = "Nama sekolah wajib diisi";
    if (!formData.alamat_sekolah.trim()) newErrors.alamat_sekolah = "Alamat wajib diisi";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onSave(formData);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="relative bg-white rounded-[25px] shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#33A1E0] to-[#2288C3] px-6 lg:px-8 py-4 lg:py-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl lg:text-2xl font-bold text-white mb-1">
                    {mode === "create" ? "Tambah" : "Edit"} Sekolah
                  </h2>
                  <p className="text-white/80 text-xs lg:text-sm">
                    Lengkapi form di bawah untuk {mode === "create" ? "menambahkan" : "mengubah"} data sekolah
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                >
                  <Close className="text-white" />
                </motion.button>
              </div>
            </div>

            {/* Form Content */}
            <form onSubmit={handleSubmit} className="p-6 lg:p-8 overflow-y-auto max-h-[calc(90vh-200px)]">
              <div className="space-y-6">
                {/* Nama Sekolah */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <SchoolOutlined className="text-[#33A1E0]" sx={{ fontSize: 18 }} />
                    Nama Sekolah
                  </label>
                  <input
                    type="text"
                    name="nama_sekolah"
                    value={formData.nama_sekolah}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-[12px] border-2 transition-all text-gray-900 font-medium ${
                      errors.nama ? "border-red-500" : "border-gray-200 focus:border-[#33A1E0]"
                    } focus:outline-none text-sm lg:text-base`}
                    placeholder="Contoh: SDN 1 Banda Aceh"
                    autoFocus
                  />
                  {errors.nama && <p className="text-red-500 text-xs mt-1">{errors.nama}</p>}
                </div>

                {/* Alamat Lengkap */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <LocationOnOutlined className="text-[#33A1E0]" sx={{ fontSize: 18 }} />
                    Alamat Lengkap
                  </label>
                  <textarea
                    name="alamat_sekolah"
                    value={formData.alamat_sekolah}
                    onChange={handleChange}
                    rows={4}
                    className={`w-full px-4 py-3 rounded-[12px] border-2 transition-all text-gray-900 font-medium ${
                      errors.alamat ? "border-red-500" : "border-gray-200 focus:border-[#33A1E0]"
                    } focus:outline-none resize-none text-sm lg:text-base`}
                    placeholder="Jl. Pendidikan No. 123, Banda Aceh, Aceh"
                  />
                  {errors.alamat && <p className="text-red-500 text-xs mt-1">{errors.alamat}</p>}
                  <p className="text-xs text-gray-500 mt-2">💡 Sertakan nama jalan, nomor, kota, dan provinsi</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 lg:gap-4 mt-8 pt-6 border-t border-gray-200">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                  className="px-4 lg:px-6 py-2 lg:py-3 rounded-[12px] border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-all text-sm lg:text-base"
                >
                  Batal
                </motion.button>
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-4 lg:px-6 py-2 lg:py-3 rounded-[12px] bg-gradient-to-r from-[#33A1E0] to-[#2288C3] text-white font-semibold hover:shadow-lg transition-all text-sm lg:text-base"
                >
                  <Save sx={{ fontSize: 20 }} />
                  <span>{mode === "create" ? "Simpan" : "Update"}</span>
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
