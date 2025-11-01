"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Close,
  ClassOutlined,
  Save
} from "@mui/icons-material";
import CustomSelect from "../user-management/CustomSelect";

interface ClassData {
  id: string;
  sekolah: string;
  kelas: string;
  paralel: string;
  mataPelajaran: string[];
  jumlahMurid: number;
}

interface ClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (classData: ClassData) => void;
  classData?: ClassData | null;
  mode: "create" | "edit";
  studentCount?: number;
  isSaving?: boolean;
}

export default function ClassModal({
  isOpen,
  onClose,
  onSave,
  classData,
  mode,
  studentCount = 0,
  isSaving = false,
}: ClassModalProps) {
  const [formData, setFormData] = useState<ClassData>(() =>
    classData && mode === "edit"
      ? {
        ...classData,
        mataPelajaran:
          classData.mataPelajaran && classData.mataPelajaran.length > 0
            ? classData.mataPelajaran
            : ["Matematika"],
        jumlahMurid: classData.jumlahMurid ?? studentCount,
      }
      : {
        id: "",
        sekolah: classData?.sekolah ?? "",
        kelas: classData?.kelas ?? "",
        paralel: classData?.paralel ?? "",
        mataPelajaran:
          classData?.mataPelajaran && classData.mataPelajaran.length > 0
            ? classData.mataPelajaran
            : ["Matematika"],
        jumlahMurid: studentCount,
      }
  );

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.kelas) newErrors.kelas = "Kelas wajib dipilih";
    if (!formData.paralel.trim()) newErrors.paralel = "Paralel wajib diisi";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isSaving) return;

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
            <div className="bg-linear-to-r from-primary to-primary-dark px-6 lg:px-8 py-4 lg:py-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl lg:text-2xl font-bold text-white mb-1">
                    {mode === "create" ? "Tambah" : "Edit"} Data Kelas
                  </h2>
                  <p className="text-white/80 text-xs lg:text-sm">
                    Lengkapi form di bawah untuk {mode === "create" ? "menambahkan" : "mengubah"} data kelas
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
                {/* Kelas & Paralel */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                      <ClassOutlined className="text-primary" sx={{ fontSize: 18 }} />
                      Tingkat Kelas
                    </label>
                    <CustomSelect
                      value={formData.kelas}
                      onChange={(value) => {
                        setFormData(prev => ({ ...prev, kelas: value }));
                        if (errors.kelas) {
                          setErrors(prev => ({ ...prev, kelas: "" }));
                        }
                      }}
                      options={[
                        { value: "I", label: "Kelas I" },
                        { value: "II", label: "Kelas II" },
                        { value: "III", label: "Kelas III" },
                        { value: "IV", label: "Kelas IV" },
                        { value: "V", label: "Kelas V" },
                        { value: "VI", label: "Kelas VI" }
                      ]}
                      placeholder="Pilih kelas"
                      icon={<ClassOutlined sx={{ fontSize: 18 }} />}
                      error={errors.kelas}
                    />
                    {errors.kelas && (
                      <p className="text-red-500 text-xs mt-1">{errors.kelas}</p>
                    )}
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                      <ClassOutlined className="text-primary" sx={{ fontSize: 18 }} />
                      Paralel
                    </label>
                    <input
                      type="text"
                      name="paralel"
                      value={formData.paralel}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-xl border-2 transition-all text-gray-900 font-medium ${errors.paralel
                        ? "border-red-500 focus:border-red-500"
                        : "border-gray-200 focus:border-primary"
                        } focus:outline-none placeholder:text-gray-400 placeholder:font-normal uppercase text-sm lg:text-base`}
                      placeholder="A, B, C"
                      maxLength={1}
                    />
                    {errors.paralel && (
                      <p className="text-red-500 text-xs mt-1">{errors.paralel}</p>
                    )}
                  </div>
                </div>

                {/* Info Boxes */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <p className="text-sm text-blue-800">
                      <span className="font-semibold">📚 Mata Pelajaran:</span> Matematika
                    </p>
                    <p className="text-xs text-blue-600 mt-1">
                      Sistem khusus pembelajaran Matematika SD
                    </p>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                    <p className="text-sm text-green-800">
                      <span className="font-semibold">👥 Jumlah Murid:</span> {formData.jumlahMurid} Murid
                    </p>
                    <p className="text-xs text-green-600 mt-1">
                      Update otomatis dari data pengguna
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 lg:gap-4 mt-8 pt-6 border-t border-gray-200">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                  className="px-4 lg:px-6 py-2 lg:py-3 rounded-xl border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-all text-sm lg:text-base"
                >
                  Batal
                </motion.button>
                <motion.button
                  type="submit"
                  whileHover={{ scale: isSaving ? 1 : 1.05 }}
                  whileTap={{ scale: isSaving ? 1 : 0.95 }}
                  disabled={isSaving}
                  className={`flex items-center gap-2 px-4 lg:px-6 py-2 lg:py-3 rounded-xl bg-linear-to-r from-primary to-primary-dark text-white font-semibold transition-all text-sm lg:text-base ${isSaving ? "opacity-70 cursor-not-allowed" : "hover:shadow-lg"
                    }`}
                >
                  <Save sx={{ fontSize: 20 }} />
                  <span>{isSaving ? "Menyimpan..." : mode === "create" ? "Simpan" : "Update"}</span>
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
