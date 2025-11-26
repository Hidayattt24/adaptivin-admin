"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Close,
  SchoolOutlined,
  LocationOnOutlined,
  PersonOutline,
  ClassOutlined,
  GroupOutlined,
} from "@mui/icons-material";
import { getAllUsers } from "@/lib/api/user";
import { getAllKelas } from "@/lib/api/kelas";
import { getAllAdmins } from "@/lib/api/user";

interface Sekolah {
  id: string;
  nama_sekolah: string;
  alamat_sekolah: string;
}

interface SchoolDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  sekolah: Sekolah | null;
}

interface SchoolStats {
  totalGuru: number;
  totalSiswa: number;
  totalKelas: number;
  totalAdmin: number;
  adminDetails: Array<{ nama: string; email: string; jenisKelamin: string }>;
  isLoading: boolean;
}

export default function SchoolDetailModal({
  isOpen,
  onClose,
  sekolah,
}: SchoolDetailModalProps) {
  const [stats, setStats] = useState<SchoolStats>({
    totalGuru: 0,
    totalSiswa: 0,
    totalKelas: 0,
    totalAdmin: 0,
    adminDetails: [],
    isLoading: true,
  });

  useEffect(() => {
    if (!isOpen || !sekolah) return;

    const fetchStats = async () => {
      setStats((prev) => ({ ...prev, isLoading: true }));

      try {
        // Fetch semua data secara paralel
        const [users, kelas, admins] = await Promise.all([
          getAllUsers({ sekolah_id: sekolah.id }),
          getAllKelas({ sekolahId: sekolah.id }),
          getAllAdmins(),
        ]);

        // Hitung jumlah guru dan siswa
        const totalGuru = users.filter((u) => u.role === "guru").length;
        const totalSiswa = users.filter((u) => u.role === "siswa").length;
        const totalKelas = kelas.length;

        // Filter admin yang terkait dengan sekolah ini
        const schoolAdmins = admins.filter((admin) => admin.sekolah_id === sekolah.id);
        const totalAdmin = schoolAdmins.length;
        const adminDetails = schoolAdmins.map((admin) => ({
          nama: admin.nama_lengkap,
          email: admin.email,
          jenisKelamin: admin.jenisKelamin,
        }));

        setStats({
          totalGuru,
          totalSiswa,
          totalKelas,
          totalAdmin,
          adminDetails,
          isLoading: false,
        });
      } catch (error) {
        console.error("Failed to fetch school stats:", error);
        setStats({
          totalGuru: 0,
          totalSiswa: 0,
          totalKelas: 0,
          totalAdmin: 0,
          adminDetails: [],
          isLoading: false,
        });
      }
    };

    fetchStats();
  }, [isOpen, sekolah]);

  if (!sekolah) return null;

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
            className="relative bg-white rounded-[25px] shadow-2xl w-full max-w-3xl max-h-screen overflow-hidden"
          >
            {/* Header */}
            <div className="bg-linear-to-r from-primary to-primary-dark px-6 lg:px-8 py-4 lg:py-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                    <SchoolOutlined className="text-white" sx={{ fontSize: 28 }} />
                  </div>
                  <div>
                    <h2 className="text-xl lg:text-2xl font-bold text-white mb-1">
                      Detail Sekolah
                    </h2>
                    <p className="text-white/80 text-xs lg:text-sm">
                      Informasi lengkap dan statistik sekolah
                    </p>
                  </div>
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

            {/* Content */}
            <div className="p-6 lg:p-8 overflow-y-auto max-h-[calc(90vh-140px)]">
              {/* Informasi Sekolah */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <SchoolOutlined className="text-primary" />
                  Informasi Sekolah
                </h3>
                <div className="bg-linear-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100">
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Nama Sekolah</p>
                      <p className="text-lg font-bold text-gray-800">{sekolah.nama_sekolah}</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <LocationOnOutlined className="text-gray-400 mt-1" sx={{ fontSize: 18 }} />
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Alamat</p>
                        <p className="text-sm text-gray-700">{sekolah.alamat_sekolah}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Daftar Admin */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <PersonOutline className="text-primary" />
                  Admin Sekolah
                </h3>
                {stats.adminDetails.length > 0 ? (
                  <div className="space-y-3">
                    {stats.adminDetails.map((admin, index) => (
                      <div
                        key={index}
                        className="bg-white p-4 rounded-xl border border-gray-200 hover:border-primary transition-colors"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                            <PersonOutline className="text-primary" sx={{ fontSize: 20 }} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-800 mb-1">
                              {admin.nama}
                            </p>
                            <div className="space-y-1">
                              <p className="text-xs text-gray-600 flex items-center gap-1">
                                <span className="font-medium">Email:</span>
                                <span className="truncate">{admin.email}</span>
                              </p>
                              {admin.jenisKelamin && (
                                <p className="text-xs text-gray-600">
                                  <span className="font-medium">Jenis Kelamin:</span>{" "}
                                  <span className="capitalize">{admin.jenisKelamin}</span>
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : !stats.isLoading ? (
                  <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 text-center">
                    <PersonOutline className="text-gray-400 mx-auto mb-2" sx={{ fontSize: 40 }} />
                    <p className="text-gray-500 text-sm">Belum ada admin yang ditugaskan di sekolah ini</p>
                  </div>
                ) : null}
              </div>

              {/* Statistik */}
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <GroupOutlined className="text-primary" />
                  Statistik
                </h3>

                {stats.isLoading ? (
                  <div className="bg-gray-50 rounded-xl p-8 text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"></div>
                    <p className="text-gray-500 mt-3 text-sm">Memuat statistik...</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Jumlah Guru */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="bg-linear-to-br from-green-50 to-emerald-50 rounded-xl p-5 border border-green-200"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                          <PersonOutline className="text-green-600" sx={{ fontSize: 24 }} />
                        </div>
                      </div>
                      <p className="text-3xl font-bold text-green-700 mb-1">{stats.totalGuru}</p>
                      <p className="text-sm text-green-600 font-medium">Guru Terdaftar</p>
                    </motion.div>

                    {/* Jumlah Siswa */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="bg-linear-to-br from-purple-50 to-pink-50 rounded-xl p-5 border border-purple-200"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                          <GroupOutlined className="text-purple-600" sx={{ fontSize: 24 }} />
                        </div>
                      </div>
                      <p className="text-3xl font-bold text-purple-700 mb-1">{stats.totalSiswa}</p>
                      <p className="text-sm text-purple-600 font-medium">Siswa Terdaftar</p>
                    </motion.div>

                    {/* Jumlah Kelas */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="bg-linear-to-br from-orange-50 to-yellow-50 rounded-xl p-5 border border-orange-200"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                          <ClassOutlined className="text-orange-600" sx={{ fontSize: 24 }} />
                        </div>
                      </div>
                      <p className="text-3xl font-bold text-orange-700 mb-1">{stats.totalKelas}</p>
                      <p className="text-sm text-orange-600 font-medium">Kelas Aktif</p>
                    </motion.div>

                    {/* Jumlah Admin */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="bg-linear-to-br from-blue-50 to-cyan-50 rounded-xl p-5 border border-blue-200"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                          <PersonOutline className="text-blue-600" sx={{ fontSize: 24 }} />
                        </div>
                      </div>
                      <p className="text-3xl font-bold text-blue-700 mb-1">{stats.totalAdmin}</p>
                      <p className="text-sm text-blue-600 font-medium">Admin Sekolah</p>
                    </motion.div>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 lg:px-8 py-4 bg-gray-50 border-t border-gray-200">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="w-full px-6 py-3 rounded-xl bg-primary text-white font-semibold hover:bg-primary-dark transition-all"
              >
                Tutup
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

