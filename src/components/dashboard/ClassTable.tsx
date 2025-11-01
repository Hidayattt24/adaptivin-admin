"use client";

import { useState, useMemo, useEffect } from "react";
import {
  Edit,
  Delete,
  ExpandMore,
  Search,
  SchoolOutlined,
  ClassOutlined,
  MenuBookOutlined,
  PeopleOutlineOutlined,
  CalendarTodayOutlined,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";
import { useAuth } from "@/contexts/AuthContext";
import { getAllKelas, type KelasResponse } from "@/lib/api/kelas";
import { getAllSekolah } from "@/lib/api/sekolah";

interface ClassData {
  id: string;
  namaSekolah: string;
  kelas: string;
  paralel: string;
  mataPelajaran: string;
  jumlahMurid: number;
  tahunAjaran: string;
}

export default function ClassTable() {
  const { admin } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState("Semua Kelas");
  const [showAll, setShowAll] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [classes, setClasses] = useState<ClassData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const classLevels = ["Semua Kelas", "I", "II", "III", "IV", "V", "VI"];

  useEffect(() => {
    const fetchClasses = async () => {
      if (!admin) return;

      try {
        setIsLoading(true);

        // Fetch sekolah map
        const sekolahData = await getAllSekolah();
        const sekolahMap: Record<string, string> = {};
        (sekolahData || []).forEach((s: { id: string; nama_sekolah?: string }) => {
          if (s?.id) {
            sekolahMap[s.id] = s.nama_sekolah ?? "Sekolah tidak ditemukan";
          }
        });

        // Fetch kelas data
        const kelasData = await getAllKelas();
        const transformedClasses: ClassData[] = kelasData.map((k: KelasResponse) => ({
          id: k.id,
          namaSekolah: sekolahMap[k.sekolah_id] ?? "Sekolah tidak ditemukan",
          kelas: k.tingkat_kelas || "-",
          paralel: k.rombel || "-",
          mataPelajaran: k.mata_pelajaran?.toUpperCase() || "MATEMATIKA",
          jumlahMurid: k.jumlah_siswa ?? 0,
          tahunAjaran: k.tahun_ajaran || "-",
        }));

        setClasses(transformedClasses);
      } catch (error) {
        console.error("Gagal memuat data kelas:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClasses();
  }, [admin]);

  // Filter classes based on search and class selection
  const filteredClasses = useMemo(() => {
    return classes.filter((classData) => {
      const matchesSearch =
        classData.namaSekolah.toLowerCase().includes(searchTerm.toLowerCase()) ||
        classData.paralel.toLowerCase().includes(searchTerm.toLowerCase()) ||
        classData.mataPelajaran.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesClass =
        selectedClass === "Semua Kelas" || classData.kelas === selectedClass;

      return matchesSearch && matchesClass;
    });
  }, [searchTerm, selectedClass, classes]);

  const displayedClasses = showAll ? filteredClasses : filteredClasses.slice(0, 2);

  const handleEdit = (classData: ClassData) => {
    Swal.fire({
      title: "Edit Kelas",
      text: `Edit data untuk kelas ${classData.kelas}${classData.paralel} - ${classData.namaSekolah}`,
      icon: "info",
      confirmButtonColor: "#33A1E0",
      confirmButtonText: "OK",
      customClass: {
        popup: "rounded-[20px] shadow-2xl",
        title: "text-[#33A1E0] text-2xl font-semibold",
        confirmButton: "font-semibold px-6 py-3 rounded-[12px]",
      },
    });
  };

  const handleDelete = async (classData: ClassData) => {
    const result = await Swal.fire({
      title: "Hapus Kelas?",
      text: `Apakah Anda yakin ingin menghapus kelas ${classData.kelas}${classData.paralel}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EF4444",
      cancelButtonColor: "#94a3b8",
      confirmButtonText: "Ya, Hapus",
      cancelButtonText: "Batal",
      customClass: {
        popup: "rounded-[20px] shadow-2xl",
        title: "text-gray-800 text-2xl font-semibold",
        confirmButton: "font-semibold px-6 py-3 rounded-[12px]",
        cancelButton: "font-semibold px-6 py-3 rounded-[12px]",
      },
    });

    if (result.isConfirmed) {
      Swal.fire({
        title: "Berhasil!",
        text: "Data kelas telah dihapus",
        icon: "success",
        confirmButtonColor: "#22C55E",
        confirmButtonText: "OK",
        customClass: {
          popup: "rounded-[20px] shadow-2xl",
          confirmButton: "font-semibold px-6 py-3 rounded-[12px]",
        },
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="rounded-[20px] p-6 shadow-lg bg-[#33A1E0]"
    >
      {/* Header */}
      <h2 className="text-white text-2xl font-bold mb-6">Kelas</h2>

      {/* Search and Filter */}
      <div className="flex items-center gap-4 mb-6">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Cari nama sekolah atau kelas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-[15px] bg-white border-none text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all duration-200 shadow-md"
          />
        </div>

        {/* Class Filter Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 px-5 py-3 bg-white rounded-[15px] text-[#33A1E0] font-semibold hover:bg-gray-50 transition-all shadow-md min-w-[150px] justify-between"
          >
            <span>{selectedClass}</span>
            <ExpandMore
              className={`transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
            />
          </button>

          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full mt-2 right-0 bg-white rounded-[15px] shadow-xl overflow-hidden z-10 min-w-[150px]"
              >
                {classLevels.map((level) => (
                  <button
                    key={level}
                    onClick={() => {
                      setSelectedClass(level);
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full px-5 py-3 text-left hover:bg-[#ECF3F6] transition-all ${selectedClass === level
                        ? "bg-[#33A1E0] text-white font-semibold"
                        : "text-gray-700"
                      }`}
                  >
                    {level}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white/95 backdrop-blur-sm rounded-[15px] overflow-hidden shadow-lg border border-gray-100">
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-500 font-medium">Memuat data kelas...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#33A1E0]">
                  <th className="px-4 py-4 text-left">
                    <input type="checkbox" className="w-4 h-4 rounded accent-white" />
                  </th>
                  <th className="px-4 py-4 text-left">
                    <div className="flex items-center gap-2">
                      <SchoolOutlined className="text-white" sx={{ fontSize: 18 }} />
                      <span className="text-xs font-bold text-white uppercase tracking-wider">Nama Sekolah</span>
                    </div>
                  </th>
                  <th className="px-4 py-4 text-left">
                    <div className="flex items-center gap-2">
                      <ClassOutlined className="text-white" sx={{ fontSize: 18 }} />
                      <span className="text-xs font-bold text-white uppercase tracking-wider">Kelas</span>
                    </div>
                  </th>
                  <th className="px-4 py-4 text-left">
                    <div className="flex items-center gap-2">
                      <ClassOutlined className="text-white" sx={{ fontSize: 18 }} />
                      <span className="text-xs font-bold text-white uppercase tracking-wider">Paralel</span>
                    </div>
                  </th>
                  <th className="px-4 py-4 text-left">
                    <div className="flex items-center gap-2">
                      <MenuBookOutlined className="text-white" sx={{ fontSize: 18 }} />
                      <span className="text-xs font-bold text-white uppercase tracking-wider">Mata Pelajaran</span>
                    </div>
                  </th>
                  <th className="px-4 py-4 text-left">
                    <div className="flex items-center gap-2">
                      <PeopleOutlineOutlined className="text-white" sx={{ fontSize: 18 }} />
                      <span className="text-xs font-bold text-white uppercase tracking-wider">Jumlah Murid</span>
                    </div>
                  </th>
                  <th className="px-4 py-4 text-left">
                    <div className="flex items-center gap-2">
                      <CalendarTodayOutlined className="text-white" sx={{ fontSize: 18 }} />
                      <span className="text-xs font-bold text-white uppercase tracking-wider">Tahun Ajaran</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {displayedClasses.map((classData, index) => (
                    <motion.tr
                      key={classData.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`border-b border-gray-100 hover:bg-[#33A1E0]/5 transition-colors ${index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                        }`}
                    >
                      <td className="px-4 py-4">
                        <input type="checkbox" className="w-4 h-4 rounded accent-[#33A1E0]" />
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                            <SchoolOutlined className="text-[#33A1E0]" sx={{ fontSize: 16 }} />
                          </div>
                          <span className="text-sm text-gray-700 font-medium">{classData.namaSekolah}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center">
                            <ClassOutlined className="text-purple-600" sx={{ fontSize: 16 }} />
                          </div>
                          <span className="text-sm text-gray-700 font-bold">{classData.kelas}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
                            <ClassOutlined className="text-indigo-600" sx={{ fontSize: 16 }} />
                          </div>
                          <span className="text-sm text-gray-700 font-semibold">{classData.paralel}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center">
                            <MenuBookOutlined className="text-green-600" sx={{ fontSize: 16 }} />
                          </div>
                          <span className="text-sm text-gray-600">{classData.mataPelajaran}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center">
                            <PeopleOutlineOutlined className="text-orange-600" sx={{ fontSize: 16 }} />
                          </div>
                          <span className="text-sm text-gray-700 font-semibold">{classData.jumlahMurid}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-cyan-50 flex items-center justify-center">
                            <CalendarTodayOutlined className="text-cyan-600" sx={{ fontSize: 16 }} />
                          </div>
                          <span className="text-sm text-gray-600">{classData.tahunAjaran}</span>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>

            {filteredClasses.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 font-medium">Tidak ada data yang ditemukan</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* View More Button */}
      {filteredClasses.length > 2 && (
        <div className="flex justify-center mt-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAll(!showAll)}
            className="px-8 py-3 bg-white rounded-full text-[#33A1E0] font-bold hover:bg-gray-50 transition-all shadow-lg"
          >
            {showAll ? "Lihat Lebih Sedikit" : `Lihat Selengkapnya (${filteredClasses.length - 2} lagi)`}
          </motion.button>
        </div>
      )}
    </motion.div>
  );
}
