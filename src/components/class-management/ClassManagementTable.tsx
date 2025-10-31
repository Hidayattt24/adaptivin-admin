"use client";

import { useState, useMemo } from "react";
import {
  ExpandMore,
  Search,
  SchoolOutlined,
  ClassOutlined,
  SubjectOutlined,
  Edit,
  Delete,
  Add
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import EmptyState from "../user-management/EmptyState";

interface ClassData {
  id: string;
  sekolah: string;
  kelas: string;
  paralel: string;
  mataPelajaran: string[];
  jumlahMurid: number;
}

interface ClassManagementTableProps {
  classes: ClassData[];
  onEdit: (classData: ClassData) => void;
  onDelete: (classData: ClassData) => void;
  onAdd: () => void;
}

export default function ClassManagementTable({
  classes,
  onEdit,
  onDelete,
  onAdd
}: ClassManagementTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedKelas, setSelectedKelas] = useState("Semua Kelas");
  const [currentPage, setCurrentPage] = useState(1);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedClasses, setSelectedClasses] = useState<string[]>([]);

  const itemsPerPage = 10;
  const kelasOptions = ["Semua Kelas", "I", "II", "III", "IV", "V", "VI"];

  const toggleSelectClass = (id: string) => {
    setSelectedClasses(prev =>
      prev.includes(id)
        ? prev.filter(classId => classId !== id)
        : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedClasses.length === displayedClasses.length) {
      setSelectedClasses([]);
    } else {
      setSelectedClasses(displayedClasses.map(c => c.id));
    }
  };

  // Filter classes based on search and filter
  const filteredClasses = useMemo(() => {
    return classes.filter((classData) => {
      const matchesSearch =
        classData.sekolah.toLowerCase().includes(searchTerm.toLowerCase()) ||
        classData.kelas.toLowerCase().includes(searchTerm.toLowerCase()) ||
        classData.paralel.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesKelas =
        selectedKelas === "Semua Kelas" || classData.kelas === selectedKelas;

      return matchesSearch && matchesKelas;
    });
  }, [searchTerm, selectedKelas, classes]);

  // Pagination
  const totalPages = Math.ceil(filteredClasses.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedClasses = filteredClasses.slice(startIndex, startIndex + itemsPerPage);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-[20px] p-6 shadow-lg bg-gradient-to-br from-[#33A1E0] to-[#2288C3]"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-white text-2xl font-bold">Data Kelas</h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onAdd}
          className="flex items-center gap-2 px-6 py-3 bg-white rounded-[15px] text-[#33A1E0] font-semibold hover:bg-gray-50 transition-all shadow-lg"
        >
          <Add sx={{ fontSize: 20 }} />
          <span>Tambah Kelas</span>
        </motion.button>
      </div>

      {/* Search and Filter */}
      <div className="flex items-center gap-4 mb-6">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Cari sekolah, kelas, atau paralel..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-12 pr-4 py-3 rounded-[15px] bg-white border-none text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all duration-200 shadow-md"
          />
        </div>

        {/* Class Filter Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 px-5 py-3 bg-white rounded-[15px] text-[#33A1E0] font-semibold hover:bg-gray-50 transition-all shadow-md min-w-[150px] justify-between"
          >
            <span>{selectedKelas}</span>
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
                {kelasOptions.map((kelas) => (
                  <button
                    key={kelas}
                    onClick={() => {
                      setSelectedKelas(kelas);
                      setIsDropdownOpen(false);
                      setCurrentPage(1);
                    }}
                    className={`w-full px-5 py-3 text-left hover:bg-[#ECF3F6] transition-all ${
                      selectedKelas === kelas
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

      {/* Results Info */}
      <div className="mb-4">
        <p className="text-white text-sm">
          Menampilkan <span className="font-bold">{displayedClasses.length}</span> dari <span className="font-bold">{filteredClasses.length}</span> data
          {selectedClasses.length > 0 && (
            <span className="ml-4">
              (<span className="font-bold">{selectedClasses.length}</span> dipilih)
            </span>
          )}
        </p>
      </div>

      {/* Table */}
      <div className="bg-white/95 backdrop-blur-sm rounded-[15px] overflow-hidden shadow-lg border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-[#33A1E0] to-[#2288C3]">
                <th className="px-4 py-4 text-left">
                  <input
                    type="checkbox"
                    checked={selectedClasses.length === displayedClasses.length && displayedClasses.length > 0}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 rounded accent-white cursor-pointer"
                  />
                </th>
                <th className="px-4 py-4 text-left">
                  <div className="flex items-center gap-2">
                    <SchoolOutlined className="text-white" sx={{ fontSize: 18 }} />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">Sekolah</span>
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
                    <SubjectOutlined className="text-white" sx={{ fontSize: 18 }} />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">Mata Pelajaran</span>
                  </div>
                </th>
                <th className="px-4 py-4 text-left">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">Jumlah Murid</span>
                </th>
                <th className="px-4 py-4 text-center">
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
                    transition={{ delay: index * 0.03 }}
                    className={`border-b border-gray-100 hover:bg-[#33A1E0]/5 transition-colors ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                    }`}
                  >
                    <td className="px-4 py-4">
                      <input
                        type="checkbox"
                        checked={selectedClasses.includes(classData.id)}
                        onChange={() => toggleSelectClass(classData.id)}
                        className="w-4 h-4 rounded accent-[#33A1E0] cursor-pointer"
                      />
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
                          <SchoolOutlined className="text-indigo-600" sx={{ fontSize: 16 }} />
                        </div>
                        <span className="text-sm text-gray-700 font-medium">{classData.sekolah}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                          <ClassOutlined className="text-blue-600" sx={{ fontSize: 16 }} />
                        </div>
                        <span className="text-sm text-gray-700 font-semibold">{classData.kelas}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center">
                          <ClassOutlined className="text-purple-600" sx={{ fontSize: 16 }} />
                        </div>
                        <span className="text-sm text-gray-700 font-semibold">{classData.paralel}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center">
                          <SubjectOutlined className="text-green-600" sx={{ fontSize: 16 }} />
                        </div>
                        <span className="px-3 py-1 bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 rounded-lg text-sm font-semibold border border-green-200">
                          Matematika
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="px-3 py-1 bg-[#33A1E0]/10 text-[#33A1E0] rounded-full text-sm font-bold">
                        {classData.jumlahMurid} Murid
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => onEdit(classData)}
                          className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all shadow-md"
                          title="Edit"
                        >
                          <Edit sx={{ fontSize: 18 }} />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => onDelete(classData)}
                          className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all shadow-md"
                          title="Hapus"
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
            <EmptyState
              message="Tidak ada data kelas yang ditemukan"
              description={searchTerm || selectedKelas !== "Semua Kelas"
                ? "Coba ubah kata kunci pencarian atau filter Anda"
                : "Belum ada data kelas. Klik tombol 'Tambah Kelas' untuk menambahkan data baru"}
            />
          )}
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              currentPage === 1
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-white text-[#33A1E0] hover:bg-gray-50 shadow-md"
            }`}
          >
            Sebelumnya
          </motion.button>

          <div className="flex gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <motion.button
                key={page}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setCurrentPage(page)}
                className={`w-10 h-10 rounded-lg font-semibold transition-all ${
                  currentPage === page
                    ? "bg-white text-[#33A1E0] shadow-lg"
                    : "bg-white/30 text-white hover:bg-white/50"
                }`}
              >
                {page}
              </motion.button>
            ))}
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              currentPage === totalPages
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-white text-[#33A1E0] hover:bg-gray-50 shadow-md"
            }`}
          >
            Selanjutnya
          </motion.button>
        </div>
      )}
    </motion.div>
  );
}
