"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Close,
  ClassOutlined,
  PeopleOutline,
  ArrowForward,
  SchoolOutlined,
} from "@mui/icons-material";
import { getAllKelas, type KelasResponse } from "@/lib/api/kelas";
import { getAllSekolah } from "@/lib/api/sekolah";
import CustomSelect from "./CustomSelect";

interface BulkMoveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (targetKelasId: string) => void;
  selectedCount: number;
  isSaving?: boolean;
  isSuperAdmin?: boolean;
  adminSekolahId?: string;
}

export default function BulkMoveModal({
  isOpen,
  onClose,
  onConfirm,
  selectedCount,
  isSaving = false,
  isSuperAdmin = false,
  adminSekolahId,
}: BulkMoveModalProps) {
  const [sekolahOptions, setSekolahOptions] = useState<{ value: string; label: string }[]>([]);
  const [selectedSekolah, setSelectedSekolah] = useState("");
  const [kelasOptions, setKelasOptions] = useState<{ value: string; label: string }[]>([]);
  const [selectedKelas, setSelectedKelas] = useState("");
  const [isLoadingSekolah, setIsLoadingSekolah] = useState(false);
  const [isLoadingKelas, setIsLoadingKelas] = useState(false);
  const [error, setError] = useState("");

  // Load sekolah list for superadmin
  useEffect(() => {
    if (!isOpen || !isSuperAdmin) {
      setSelectedSekolah("");
      setSekolahOptions([]);
      return;
    }

    const loadSekolah = async () => {
      setIsLoadingSekolah(true);
      try {
        const sekolahList = await getAllSekolah();
        const options = sekolahList.map((s) => ({
          value: s.id,
          label: s.nama_sekolah || "Nama sekolah tidak tersedia",
        }));
        setSekolahOptions(options);
      } catch (err) {
        console.error("Failed to load sekolah:", err);
        setError("Gagal memuat data sekolah");
      } finally {
        setIsLoadingSekolah(false);
      }
    };

    loadSekolah();
  }, [isOpen, isSuperAdmin]);

  // Load kelas based on selected sekolah or admin's sekolah
  useEffect(() => {
    if (!isOpen) {
      setSelectedKelas("");
      setKelasOptions([]);
      setError("");
      return;
    }

    // For superadmin: wait until sekolah is selected
    if (isSuperAdmin && !selectedSekolah) {
      setKelasOptions([]);
      return;
    }

    // For admin: use their sekolah_id
    const targetSekolahId = isSuperAdmin ? selectedSekolah : adminSekolahId;
    
    if (!targetSekolahId) {
      return;
    }

    const loadKelas = async () => {
      setIsLoadingKelas(true);
      try {
        const kelasList = await getAllKelas({ sekolahId: targetSekolahId });
        const options = kelasList.map((k) => ({
          value: k.id,
          label: k.nama_kelas || `${k.tingkat_kelas} ${k.rombel || ""}`.trim(),
        }));
        setKelasOptions(options);
      } catch (err) {
        console.error("Failed to load kelas:", err);
        setError("Gagal memuat data kelas");
      } finally {
        setIsLoadingKelas(false);
      }
    };

    loadKelas();
  }, [isOpen, isSuperAdmin, selectedSekolah, adminSekolahId]);

  const handleSubmit = () => {
    if (isSuperAdmin && !selectedSekolah) {
      setError("Pilih sekolah terlebih dahulu");
      return;
    }
    if (!selectedKelas) {
      setError("Pilih kelas tujuan terlebih dahulu");
      return;
    }
    onConfirm(selectedKelas);
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
            className="relative bg-white rounded-[25px] shadow-2xl w-full max-w-md overflow-hidden"
          >
            {/* Header */}
            <div className="bg-linear-to-r from-primary to-primary-dark px-6 py-5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white mb-1">
                    Pindah Siswa Massal
                  </h2>
                  <p className="text-white/80 text-sm">
                    Pindahkan {selectedCount} siswa ke kelas lain
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  disabled={isSaving}
                  className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors disabled:opacity-50"
                >
                  <Close className="text-white" />
                </motion.button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="mb-6 bg-blue-50 p-4 rounded-xl border border-blue-200">
                <div className="flex items-center gap-3 mb-2">
                  <PeopleOutline className="text-blue-600" sx={{ fontSize: 24 }} />
                  <p className="text-blue-800 font-semibold">
                    {selectedCount} Siswa Dipilih
                  </p>
                </div>
                <p className="text-sm text-blue-700">
                  Siswa yang dipilih akan dipindahkan ke kelas yang Anda tentukan
                </p>
              </div>

              {/* Pilihan Sekolah - hanya untuk superadmin */}
              {isSuperAdmin && (
                <div className="mb-6">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <SchoolOutlined className="text-primary" sx={{ fontSize: 18 }} />
                    Sekolah <span className="text-red-500">*</span>
                  </label>
                  <CustomSelect
                    value={selectedSekolah}
                    onChange={(value) => {
                      setSelectedSekolah(value);
                      setSelectedKelas(""); // Reset kelas when sekolah changes
                      setError("");
                    }}
                    options={sekolahOptions}
                    placeholder={isLoadingSekolah ? "Memuat sekolah..." : "Pilih sekolah"}
                    icon={<SchoolOutlined sx={{ fontSize: 18 }} />}
                    error={error && !selectedSekolah ? error : ""}
                    disabled={isLoadingSekolah || isSaving}
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    💡 Pilih sekolah terlebih dahulu untuk melihat daftar kelas
                  </p>
                </div>
              )}

              <div className="mb-6">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <ClassOutlined className="text-primary" sx={{ fontSize: 18 }} />
                  Kelas Tujuan <span className="text-red-500">*</span>
                </label>
                <CustomSelect
                  value={selectedKelas}
                  onChange={(value) => {
                    setSelectedKelas(value);
                    setError("");
                  }}
                  options={kelasOptions}
                  placeholder={
                    isSuperAdmin && !selectedSekolah
                      ? "Pilih sekolah terlebih dahulu"
                      : isLoadingKelas
                      ? "Memuat kelas..."
                      : kelasOptions.length === 0
                      ? "Tidak ada kelas tersedia"
                      : "Pilih kelas tujuan"
                  }
                  icon={<ClassOutlined sx={{ fontSize: 18 }} />}
                  error={error && selectedKelas === "" ? error : ""}
                  disabled={
                    isLoadingKelas || 
                    isSaving || 
                    (isSuperAdmin && !selectedSekolah) ||
                    kelasOptions.length === 0
                  }
                />
                {error && (
                  <p className="text-red-500 text-xs mt-1">{error}</p>
                )}
              </div>

              <div className="flex items-center justify-center gap-2 mb-6">
                <div className="flex items-center gap-2 text-gray-500">
                  <PeopleOutline sx={{ fontSize: 20 }} />
                  <span className="text-sm font-medium">{selectedCount} Siswa</span>
                </div>
                <ArrowForward className="text-primary" sx={{ fontSize: 24 }} />
                <div className="flex items-center gap-2 text-primary">
                  <ClassOutlined sx={{ fontSize: 20 }} />
                  <span className="text-sm font-medium">
                    {selectedKelas
                      ? kelasOptions.find((k) => k.value === selectedKelas)?.label
                      : "?"}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onClose}
                  disabled={isSaving}
                  className="flex-1 px-5 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-[15px] font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Batal
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSubmit}
                  disabled={
                    isSaving || 
                    !selectedKelas || 
                    isLoadingKelas || 
                    (isSuperAdmin && !selectedSekolah)
                  }
                  className="flex-1 px-5 py-3 bg-primary hover:bg-primary-dark text-white rounded-[15px] font-semibold transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? "Memproses..." : "Pindahkan"}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

