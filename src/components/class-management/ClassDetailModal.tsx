"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Close,
  ClassOutlined,
  SchoolOutlined,
  PeopleOutline,
  PersonOutline,
  SubjectOutlined,
  CalendarTodayOutlined,
} from "@mui/icons-material";
import { getKelasById } from "@/lib/api/kelas";
import { getAllUsers } from "@/lib/api/user";

interface ClassData {
  id: string;
  sekolah: string;
  kelas: string;
  paralel: string;
  mataPelajaran: string[];
  jumlahMurid: number;
  sekolahId?: string;
  namaKelas?: string;
  tingkatKelas?: string;
  tahunAjaran?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

interface ClassDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  classData?: ClassData | null;
}

export default function ClassDetailModal({
  isOpen,
  onClose,
  classData,
}: ClassDetailModalProps) {
  const [detailData, setDetailData] = useState<any | null>(null);
  const [counts, setCounts] = useState({
    teachers: 0,
    students: 0,
  });
  const [teacherDetails, setTeacherDetails] = useState<Array<{ nama: string; email: string; nip: string | null }>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen || !classData?.id) {
      setDetailData(null);
      setCounts({ teachers: 0, students: 0 });
      setTeacherDetails([]);
      setError(null);
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Fetch class details
        const classDetail = await getKelasById(classData.id);
        setDetailData(classDetail);

        // Fetch all users
        const [allTeachers, allStudents] = await Promise.all([
          getAllUsers({ role: "guru" }),
          getAllUsers({ role: "siswa" }),
        ]);

        // Filter teachers who teach this class using kelasAssignments
        const teachersInClass = allTeachers.filter((teacher) => {
          if (!teacher.kelasAssignments || teacher.kelasAssignments.length === 0) {
            return false;
          }
          // Check if any of the teacher's assignments match this class
          return teacher.kelasAssignments.some(
            (assignment) => assignment.kelasId === classData.id
          );
        });

        // Filter students who are in this class
        const studentsInClass = allStudents.filter((student) => {
          return student.kelasId === classData.id;
        });

        // Extract teacher details (nama, email, NIP)
        const details = teachersInClass.map((teacher) => ({
          nama: teacher.nama,
          email: teacher.email,
          nip: teacher.identifier,
        }));

        setCounts({
          teachers: teachersInClass.length,
          students: studentsInClass.length,
        });
        setTeacherDetails(details);
      } catch (err) {
        console.error("Failed to fetch class details or counts:", err);
        setError("Gagal memuat detail kelas. Silakan coba lagi.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [isOpen, classData]);

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
                    Detail Kelas
                  </h2>
                  <p className="text-white/80 text-xs lg:text-sm">
                    Informasi lengkap mengenai kelas ini
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

            {/* Content */}
            <div className="p-6 lg:p-8 overflow-y-auto max-h-[calc(90vh-200px)]">
              {isLoading ? (
                <div className="text-center text-gray-500 py-8">
                  Memuat detail kelas...
                </div>
              ) : error ? (
                <div className="text-center text-red-500 py-8">
                  {error}
                </div>
              ) : classData ? (
                <div className="space-y-6">
                  {/* Informasi Umum */}
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                    <h3 className="font-semibold text-lg text-gray-800 mb-3 flex items-center gap-2">
                      <ClassOutlined className="text-primary" /> Informasi Umum
                    </h3>
                    <div className="space-y-2 text-sm text-gray-700">
                      <p className="flex items-center gap-2">
                        <SchoolOutlined className="text-gray-500" sx={{ fontSize: 18 }} />
                        <span className="font-medium">Sekolah:</span>{" "}
                        {classData.sekolah}
                      </p>
                      <p>
                        <span className="font-medium">Nama Kelas:</span>{" "}
                        {classData.namaKelas || `${classData.kelas} ${classData.paralel}`.trim()}
                      </p>
                      <p>
                        <span className="font-medium">Tingkat Kelas:</span>{" "}
                        {classData.tingkatKelas || classData.kelas}
                      </p>
                      {classData.paralel && (
                        <p>
                          <span className="font-medium">Paralel:</span>{" "}
                          {classData.paralel}
                        </p>
                      )}
                      <p className="flex items-center gap-2">
                        <SubjectOutlined className="text-gray-500" sx={{ fontSize: 18 }} />
                        <span className="font-medium">Mata Pelajaran:</span>{" "}
                        {classData.mataPelajaran?.[0] || "Matematika"}
                      </p>
                      {classData.tahunAjaran && (
                        <p className="flex items-center gap-2">
                          <CalendarTodayOutlined className="text-gray-500" sx={{ fontSize: 18 }} />
                          <span className="font-medium">Tahun Ajaran:</span>{" "}
                          {classData.tahunAjaran}
                        </p>
                      )}
                      {classData.createdAt && (
                        <p className="flex items-center gap-2">
                          <CalendarTodayOutlined className="text-gray-500" sx={{ fontSize: 18 }} />
                          <span className="font-medium">Ditambahkan pada:</span>{" "}
                          {new Date(classData.createdAt).toLocaleDateString("id-ID", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Statistik */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-200 flex flex-col items-center justify-center text-center">
                      <PersonOutline className="text-blue-600 mb-2" sx={{ fontSize: 30 }} />
                      <p className="text-blue-800 font-bold text-2xl">
                        {counts.teachers}
                      </p>
                      <p className="text-blue-700 text-sm">Guru</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-xl border border-green-200 flex flex-col items-center justify-center text-center">
                      <PeopleOutline className="text-green-600 mb-2" sx={{ fontSize: 30 }} />
                      <p className="text-green-800 font-bold text-2xl">
                        {counts.students}
                      </p>
                      <p className="text-green-700 text-sm">Siswa</p>
                    </div>
                  </div>

                  {/* Daftar Guru */}
                  <div>
                    <h3 className="font-semibold text-lg text-gray-800 mb-3 flex items-center gap-2">
                      <PersonOutline className="text-purple-600" /> Daftar Guru
                    </h3>
                    {teacherDetails.length > 0 ? (
                      <div className="space-y-3">
                        {teacherDetails.map((teacher, index) => (
                          <div
                            key={index}
                            className="bg-white p-4 rounded-xl border border-gray-200 hover:border-purple-300 transition-colors"
                          >
                            <div className="flex items-start gap-3">
                              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center shrink-0">
                                <PersonOutline className="text-purple-600" sx={{ fontSize: 20 }} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-gray-800 mb-1">
                                  {teacher.nama}
                                </p>
                                <div className="space-y-1">
                                  <p className="text-xs text-gray-600 flex items-center gap-1">
                                    <span className="font-medium">Email:</span>
                                    <span className="truncate">{teacher.email}</span>
                                  </p>
                                  {teacher.nip && (
                                    <p className="text-xs text-gray-600">
                                      <span className="font-medium">NIP:</span> {teacher.nip}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 text-center">
                        <PersonOutline className="text-gray-400 mx-auto mb-2" sx={{ fontSize: 40 }} />
                        <p className="text-gray-500 text-sm">Belum ada guru yang ditugaskan di kelas ini</p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  Tidak ada data kelas yang dipilih.
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

