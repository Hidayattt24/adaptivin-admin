"use client";

import { useState, useMemo } from "react";
import {
  Search,
  PersonOutline,
  EmailOutlined,
  SchoolOutlined,
  Edit,
  Delete,
  Add
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import EmptyState from "../user-management/EmptyState";
import type { AdminData } from "@/lib/api/user";

interface AdminManagementTableProps {
  admins: AdminData[];
  onEdit: (admin: AdminData) => void | Promise<void>;
  onDelete: (admin: AdminData) => void | Promise<void>;
  onAdd: () => void;
}

export default function AdminManagementTable({
  admins,
  onEdit,
  onDelete,
  onAdd
}: AdminManagementTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedAdmins, setSelectedAdmins] = useState<string[]>([]);

  const itemsPerPage = 10;

  const toggleSelectAdmin = (id: string) => {
    setSelectedAdmins(prev =>
      prev.includes(id)
        ? prev.filter(adminId => adminId !== id)
        : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedAdmins.length === displayedAdmins.length) {
      setSelectedAdmins([]);
    } else {
      setSelectedAdmins(displayedAdmins.map(a => a.id));
    }
  };

  // Filter admins based on search
  const filteredAdmins = useMemo(() => {
    return admins.filter((admin) => {
      const nama = admin.nama_lengkap?.toLowerCase?.() ?? "";
      const email = admin.email?.toLowerCase?.() ?? "";
      const sekolahId = admin.sekolah_id?.toLowerCase?.() ?? "";
      const matchesSearch =
        nama.includes(searchTerm.toLowerCase()) ||
        email.includes(searchTerm.toLowerCase()) ||
        sekolahId.includes(searchTerm.toLowerCase());

      return matchesSearch;
    });
  }, [searchTerm, admins]);

  // Pagination
  const totalPages = Math.ceil(filteredAdmins.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedAdmins = filteredAdmins.slice(startIndex, startIndex + itemsPerPage);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-[20px] p-4 lg:p-6 shadow-lg bg-linear-to-br from-primary to-primary-dark"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <h2 className="text-white text-xl lg:text-2xl font-bold">Data Admin Sekolah</h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onAdd}
          className="flex items-center gap-2 px-4 lg:px-6 py-2 lg:py-3 bg-white rounded-[15px] text-primary font-semibold hover:bg-gray-50 transition-all shadow-lg text-sm lg:text-base"
        >
          <Add sx={{ fontSize: 20 }} />
          <span>Tambah Admin</span>
        </motion.button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Cari nama, email, atau sekolah..."
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
          Menampilkan <span className="font-bold">{displayedAdmins.length}</span> dari <span className="font-bold">{filteredAdmins.length}</span> data
          {selectedAdmins.length > 0 && (
            <span className="ml-4">
              (<span className="font-bold">{selectedAdmins.length}</span> dipilih)
            </span>
          )}
        </p>
      </div>

      {/* Table */}
      <div className="bg-white/95 backdrop-blur-sm rounded-[15px] overflow-hidden shadow-lg border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-linear-to-r from-primary to-primary-dark">
                <th className="px-4 py-4 text-left">
                  <input
                    type="checkbox"
                    checked={selectedAdmins.length === displayedAdmins.length && displayedAdmins.length > 0}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 rounded accent-white cursor-pointer"
                  />
                </th>
                <th className="px-4 py-4 text-left">
                  <div className="flex items-center gap-2">
                    <PersonOutline className="text-white" sx={{ fontSize: 18 }} />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">Nama</span>
                  </div>
                </th>
                <th className="px-4 py-4 text-left hidden lg:table-cell">
                  <div className="flex items-center gap-2">
                    <EmailOutlined className="text-white" sx={{ fontSize: 18 }} />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">Email</span>
                  </div>
                </th>
                <th className="px-4 py-4 text-left hidden md:table-cell">
                  <div className="flex items-center gap-2">
                    <SchoolOutlined className="text-white" sx={{ fontSize: 18 }} />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">Sekolah</span>
                  </div>
                </th>
                <th className="px-4 py-4 text-center">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">Aksi</span>
                </th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {displayedAdmins.map((admin, index) => (
                  <motion.tr
                    key={admin.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className={`border-b border-gray-100 hover:bg-primary/5 transition-colors ${index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                      }`}
                  >
                    <td className="px-4 py-4">
                      <input
                        type="checkbox"
                        checked={selectedAdmins.includes(admin.id)}
                        onChange={() => toggleSelectAdmin(admin.id)}
                        className="w-4 h-4 rounded accent-primary cursor-pointer"
                      />
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                          <PersonOutline className="text-blue-600" sx={{ fontSize: 16 }} />
                        </div>
                        <div>
                          <span className="text-sm text-gray-700 font-medium block">{admin.nama_lengkap}</span>
                          <span className="text-xs text-gray-500 lg:hidden">{admin.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 hidden lg:table-cell">
                      <span className="text-sm text-gray-700">{admin.email}</span>
                    </td>
                    <td className="px-4 py-4 hidden md:table-cell">
                      <span className="text-sm text-gray-700 font-medium">{admin.sekolahName || "-"}</span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => onEdit(admin)}
                          className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all shadow-md"
                          title="Edit"
                        >
                          <Edit sx={{ fontSize: 18 }} />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => onDelete(admin)}
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

          {filteredAdmins.length === 0 && (
            <EmptyState
              message="Tidak ada data admin yang ditemukan"
              description={searchTerm
                ? "Coba ubah kata kunci pencarian Anda"
                : "Belum ada data admin. Klik tombol 'Tambah Admin' untuk menambahkan data baru"}
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
              : "bg-white text-primary hover:bg-gray-50 shadow-md"
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
                  ? "bg-white text-primary shadow-lg"
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
              : "bg-white text-primary hover:bg-gray-50 shadow-md"
              }`}
          >
            Selanjutnya
          </motion.button>
        </div>
      )}
    </motion.div>
  );
}
