"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Close,
  PersonOutline,
  EmailOutlined,
  BadgeOutlined,
  CakeOutlined,
  WcOutlined,
  LocationOnOutlined,
  SchoolOutlined,
  ClassOutlined,
  CalendarTodayOutlined,
} from "@mui/icons-material";
import type { ManagedUser } from "@/lib/api/user";

interface UserDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: ManagedUser | null;
  role: "guru" | "siswa";
}

const formatDate = (dateString: string | null) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const formatClassDisplay = (kelas: string | null, paralel: string | null) => {
  if (!kelas && !paralel) return "-";
  if (!kelas) return paralel ?? "-";
  if (!paralel) return kelas;
  return `${kelas} ${paralel}`;
};

export default function UserDetailModal({
  isOpen,
  onClose,
  user,
  role,
}: UserDetailModalProps) {
  if (!user) return null;

  const identifierLabel = role === "guru" ? "NIP" : "NISN";

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
            >
              {/* Header */}
              <div className="bg-linear-to-r from-primary to-primary-dark p-6 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <PersonOutline className="text-white" sx={{ fontSize: 28 }} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      Detail {role === "guru" ? "Guru" : "Siswa"}
                    </h2>
                    <p className="text-white/80 text-sm">
                      Informasi lengkap akun
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                >
                  <Close className="text-white" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Identitas */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-primary mb-4 pb-2 border-b-2 border-primary/20">
                      Identitas
                    </h3>

                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <PersonOutline className="text-primary" sx={{ fontSize: 20 }} />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 mb-1">Nama Lengkap</p>
                        <p className="text-sm font-semibold text-gray-800">
                          {user.nama}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <BadgeOutlined className="text-primary" sx={{ fontSize: 20 }} />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 mb-1">{identifierLabel}</p>
                        <p className="text-sm font-semibold text-gray-800">
                          {user.identifier || "-"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <EmailOutlined className="text-primary" sx={{ fontSize: 20 }} />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 mb-1">Email</p>
                        <p className="text-sm font-semibold text-gray-800 break-all">
                          {user.email}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <WcOutlined className="text-primary" sx={{ fontSize: 20 }} />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 mb-1">Jenis Kelamin</p>
                        <p className="text-sm font-semibold text-gray-800">
                          {user.jenisKelamin === "laki-laki"
                            ? "Laki-laki"
                            : user.jenisKelamin === "perempuan"
                              ? "Perempuan"
                              : "-"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <CakeOutlined className="text-primary" sx={{ fontSize: 20 }} />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 mb-1">Tanggal Lahir</p>
                        <p className="text-sm font-semibold text-gray-800">
                          {formatDate(user.tanggalLahir)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Informasi Sekolah & Lainnya */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-primary mb-4 pb-2 border-b-2 border-primary/20">
                      Informasi {role === "guru" ? "Mengajar" : "Sekolah"}
                    </h3>

                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <SchoolOutlined className="text-primary" sx={{ fontSize: 20 }} />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 mb-1">Sekolah</p>
                        <p className="text-sm font-semibold text-gray-800">
                          {user.sekolahName || "-"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <ClassOutlined className="text-primary" sx={{ fontSize: 20 }} />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 mb-1">
                          {role === "guru" ? "Kelas yang Diampu" : "Kelas"}
                        </p>
                        {role === "guru" && user.kelasAssignments && user.kelasAssignments.length > 0 ? (
                          <div className="flex flex-wrap gap-2 mt-1">
                            {user.kelasAssignments.map((assignment, idx) => (
                              <span
                                key={idx}
                                className="px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full"
                              >
                                {assignment.kelasName}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm font-semibold text-gray-800">
                            {formatClassDisplay(user.kelasLevel, user.kelasRombel)}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <LocationOnOutlined className="text-primary" sx={{ fontSize: 20 }} />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 mb-1">Alamat</p>
                        <p className="text-sm font-semibold text-gray-800">
                          {user.alamat || "-"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <CalendarTodayOutlined className="text-primary" sx={{ fontSize: 20 }} />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 mb-1">Dibuat Pada</p>
                        <p className="text-sm font-semibold text-gray-800">
                          {formatDate(user.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 bg-gray-50 border-t border-gray-200">
                <button
                  onClick={onClose}
                  className="w-full py-3 bg-primary hover:bg-primary-dark text-white font-semibold rounded-xl transition-colors"
                >
                  Tutup
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
