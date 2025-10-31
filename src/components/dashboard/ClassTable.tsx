"use client";

import { useState, useMemo } from "react";
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

interface ClassData {
  id: string;
  namaSekolah: string;
  kelas: string;
  paralel: string;
  mataPelajaran: string;
  jumlahMurid: number;
  tahunAjaran: string;
}

const mockClasses: ClassData[] = [
  {
    id: "1",
    namaSekolah: "SDN 1 Banda Aceh",
    kelas: "4",
    paralel: "A",
    mataPelajaran: "MATEMATIKA",
    jumlahMurid: 32,
    tahunAjaran: "2025/2026",
  },
  {
    id: "2",
    namaSekolah: "SDN 2 Banda Aceh",
    kelas: "4",
    paralel: "B",
    mataPelajaran: "MATEMATIKA",
    jumlahMurid: 30,
    tahunAjaran: "2025/2026",
  },
  {
    id: "3",
    namaSekolah: "SDN 3 Banda Aceh",
    kelas: "5",
    paralel: "A",
    mataPelajaran: "MATEMATIKA",
    jumlahMurid: 28,
    tahunAjaran: "2025/2026",
  },
  {
    id: "4",
    namaSekolah: "SDN 1 Banda Aceh",
    kelas: "3",
    paralel: "C",
    mataPelajaran: "MATEMATIKA",
    jumlahMurid: 35,
    tahunAjaran: "2024/2025",
  },
];

export default function ClassTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState("Semua Kelas");
  const [showAll, setShowAll] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const classes = ["Semua Kelas", "3", "4", "5"];

  // Filter classes based on search and class selection
  const filteredClasses = useMemo(() => {
    return mockClasses.filter((classData) => {
      const matchesSearch =
        classData.namaSekolah.toLowerCase().includes(searchTerm.toLowerCase()) ||
        classData.paralel.toLowerCase().includes(searchTerm.toLowerCase()) ||
        classData.mataPelajaran.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesClass =
        selectedClass === "Semua Kelas" || classData.kelas === selectedClass;

      return matchesSearch && matchesClass;
    });
  }, [searchTerm, selectedClass]);

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
                {classes.map((kelas) => (
                  <button
                    key={kelas}
                    onClick={() => {
                      setSelectedClass(kelas);
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full px-5 py-3 text-left hover:bg-[#ECF3F6] transition-all ${
                      selectedClass === kelas
                        ? "bg-[#33A1E0] text-white font-semibold"
                        : "text-gray-700"
                    }`}
                  >
                    {kelas}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white/95 backdrop-blur-sm rounded-[15px] overflow-hidden shadow-lg border border-gray-100">
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
                <th className="px-4 py-4 text-left">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">Aksi</span>
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
                    className={`border-b border-gray-100 hover:bg-[#33A1E0]/5 transition-colors ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
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
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleEdit(classData)}
                          className="w-9 h-9 rounded-lg bg-gradient-to-r from-[#33A1E0] to-[#5BB3E8] flex items-center justify-center text-white hover:shadow-lg transition-all shadow-md"
                        >
                          <Edit sx={{ fontSize: 18 }} />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleDelete(classData)}
                          className="w-9 h-9 rounded-lg bg-gradient-to-r from-red-500 to-red-600 flex items-center justify-center text-white hover:shadow-lg transition-all shadow-md"
                        >
                          <Delete sx={{ fontSize: 18 }} />
                        </motion.button>
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
