"use client";

import { useState, useMemo } from "react";
import {
  Search,
  SchoolOutlined,
  LocationOnOutlined,
  Edit,
  Delete,
  Add
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import EmptyState from "../user-management/EmptyState";

interface Sekolah {
  id: string;
  nama_sekolah: string;
  alamat_sekolah: string;
}

interface SekolahManagementTableProps {
  sekolah: Sekolah[];
  onEdit: (sekolah: Sekolah) => void;
  onDelete: (sekolah: Sekolah) => void;
  onAdd: () => void;
}

export default function SchoolManagementTable({
  sekolah,
  onEdit,
  onDelete,
  onAdd
}: SekolahManagementTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSekolah, setSelectedSekolah] = useState<string[]>([]);

  const itemsPerPage = 10;

  const toggleSelectSekolah = (id: string) => {
    setSelectedSekolah(prev =>
      prev.includes(id)
        ? prev.filter(sekolahId => sekolahId !== id)
        : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedSekolah.length === displayedSekolah.length) {
      setSelectedSekolah([]);
    } else {
      setSelectedSekolah(displayedSekolah.map(s => s.id));
    }
  };

  const filteredSekolah = useMemo(() => {
    return sekolah.filter((sekolah) => {
      const matchesSearch =
        sekolah.nama_sekolah.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sekolah.alamat_sekolah.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesSearch;
    });
  }, [searchTerm, sekolah]);

  const totalPages = Math.ceil(filteredSekolah.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedSekolah = filteredSekolah.slice(startIndex, startIndex + itemsPerPage);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-[20px] p-4 lg:p-6 shadow-lg bg-gradient-to-br from-[#33A1E0] to-[#2288C3]"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <h2 className="text-white text-xl lg:text-2xl font-bold">Data Sekolah</h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onAdd}
          className="flex items-center gap-2 px-4 lg:px-6 py-2 lg:py-3 bg-white rounded-[15px] text-[#33A1E0] font-semibold hover:bg-gray-50 transition-all shadow-lg text-sm lg:text-base"
        >
          <Add sx={{ fontSize: 20 }} />
          <span>Tambah Sekolah</span>
        </motion.button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Cari nama sekolah, alamat, atau kota..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-12 pr-4 py-3 rounded-[15px] bg-white border-none text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all duration-200 shadow-md text-sm lg:text-base"
          />
        </div>
      </div>

      {/* Results Info */}
      <div className="mb-4">
        <p className="text-white text-sm">
          Menampilkan <span className="font-bold">{displayedSekolah.length}</span> dari <span className="font-bold">{filteredSekolah.length}</span> data
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
                    checked={selectedSekolah.length === displayedSekolah.length && displayedSekolah.length > 0}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 rounded accent-white cursor-pointer"
                  />
                </th>
                <th className="px-4 py-4 text-left">
                  <div className="flex items-center gap-2">
                    <SchoolOutlined className="text-white" sx={{ fontSize: 18 }} />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">Nama Sekolah</span>
                  </div>
                </th>
                <th className="px-4 py-4 text-left hidden lg:table-cell">
                  <div className="flex items-center gap-2">
                    <LocationOnOutlined className="text-white" sx={{ fontSize: 18 }} />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">Alamat</span>
                  </div>
                </th>
                <th className="px-4 py-4 text-center">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">Aksi</span>
                </th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {displayedSekolah.map((sekolah, index) => (
                  <motion.tr
                    key={sekolah.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className={`border-b border-gray-100 hover:bg-[#33A1E0]/5 transition-colors ${index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                      }`}
                  >
                    <td className="px-4 py-4">
                      <input
                        type="checkbox"
                        checked={selectedSekolah.includes(sekolah.id)}
                        onChange={() => toggleSelectSekolah(sekolah.id)}
                        className="w-4 h-4 rounded accent-[#33A1E0] cursor-pointer"
                      />
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center">
                          <SchoolOutlined className="text-green-600" sx={{ fontSize: 16 }} />
                        </div>
                        <div>
                          <span className="text-sm text-gray-700 font-medium block">{sekolah.nama_sekolah}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 hidden lg:table-cell">
                      <span className="text-sm text-gray-700">{sekolah.alamat_sekolah}</span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => onEdit(sekolah)}
                          className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all shadow-md"
                          title="Edit"
                        >
                          <Edit sx={{ fontSize: 18 }} />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => onDelete(sekolah)}
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

          {filteredSekolah.length === 0 && (
            <EmptyState
              message="Tidak ada data sekolah yang ditemukan"
              description={searchTerm
                ? "Coba ubah kata kunci pencarian Anda"
                : "Belum ada data sekolah. Klik tombol 'Tambah Sekolah' untuk menambahkan data baru"}
            />
          )}
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6 flex-wrap">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className={`px-3 lg:px-4 py-2 rounded-lg font-semibold transition-all text-sm lg:text-base ${currentPage === 1
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-white text-[#33A1E0] hover:bg-gray-50 shadow-md"
              }`}
          >
            Sebelumnya
          </motion.button>

          <div className="flex gap-2">
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(page => (
              <motion.button
                key={page}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 lg:w-10 lg:h-10 rounded-lg font-semibold transition-all text-sm lg:text-base ${currentPage === page
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
            className={`px-3 lg:px-4 py-2 rounded-lg font-semibold transition-all text-sm lg:text-base ${currentPage === totalPages
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
