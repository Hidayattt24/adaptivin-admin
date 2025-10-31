"use client";

import { useState, useMemo } from "react";
import {
  ExpandMore,
  Search,
  BadgeOutlined,
  PersonOutline,
  CakeOutlined,
  LocationOnOutlined,
  SchoolOutlined,
  AccountCircleOutlined,
  LockOutlined,
  WcOutlined,
  Visibility,
  VisibilityOff,
  Edit,
  Delete,
  Add
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import EmptyState from "./EmptyState";

interface User {
  nisn: string;
  nama: string;
  tanggalLahir: string;
  alamat: string;
  kelas: string;
  paralel: string;
  sekolah: string;
  username: string;
  password: string;
  jenisKelamin: string;
  role: "Murid" | "Guru";
}

interface UserManagementTableProps {
  title: string;
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  onAdd: () => void;
}

export default function UserManagementTable({
  title,
  users,
  onEdit,
  onDelete,
  onAdd
}: UserManagementTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState("Semua Kelas");
  const [currentPage, setCurrentPage] = useState(1);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [visiblePasswords, setVisiblePasswords] = useState<{ [key: string]: boolean }>({});
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  const itemsPerPage = 10;
  const classes = ["Semua Kelas", "III", "IV", "V", "VI"];

  const togglePasswordVisibility = (nisn: string) => {
    setVisiblePasswords(prev => ({
      ...prev,
      [nisn]: !prev[nisn]
    }));
  };

  const toggleSelectUser = (nisn: string) => {
    setSelectedUsers(prev =>
      prev.includes(nisn)
        ? prev.filter(id => id !== nisn)
        : [...prev, nisn]
    );
  };

  const toggleSelectAll = () => {
    if (selectedUsers.length === displayedUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(displayedUsers.map(user => user.nisn));
    }
  };

  // Filter users based on search and class
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.nisn.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.username.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesClass =
        selectedClass === "Semua Kelas" || user.kelas === selectedClass;

      return matchesSearch && matchesClass;
    });
  }, [searchTerm, selectedClass, users]);

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-[20px] p-6 shadow-lg bg-gradient-to-br from-[#33A1E0] to-[#2288C3]"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-white text-2xl font-bold">{title}</h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onAdd}
          className="flex items-center gap-2 px-6 py-3 bg-white rounded-[15px] text-[#33A1E0] font-semibold hover:bg-gray-50 transition-all shadow-lg"
        >
          <Add sx={{ fontSize: 20 }} />
          <span>Tambah Akun</span>
        </motion.button>
      </div>

      {/* Search and Filter */}
      <div className="flex items-center gap-4 mb-6">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Cari nama atau NISN..."
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
                      setCurrentPage(1);
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

      {/* Results Info */}
      <div className="mb-4">
        <p className="text-white text-sm">
          Menampilkan <span className="font-bold">{displayedUsers.length}</span> dari <span className="font-bold">{filteredUsers.length}</span> data
          {selectedUsers.length > 0 && (
            <span className="ml-4">
              (<span className="font-bold">{selectedUsers.length}</span> dipilih)
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
                    checked={selectedUsers.length === displayedUsers.length && displayedUsers.length > 0}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 rounded accent-white cursor-pointer"
                  />
                </th>
                <th className="px-4 py-4 text-left">
                  <div className="flex items-center gap-2">
                    <BadgeOutlined className="text-white" sx={{ fontSize: 18 }} />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">NISN</span>
                  </div>
                </th>
                <th className="px-4 py-4 text-left">
                  <div className="flex items-center gap-2">
                    <PersonOutline className="text-white" sx={{ fontSize: 18 }} />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">Nama</span>
                  </div>
                </th>
                <th className="px-4 py-4 text-left">
                  <div className="flex items-center gap-2">
                    <CakeOutlined className="text-white" sx={{ fontSize: 18 }} />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">Tanggal Lahir</span>
                  </div>
                </th>
                <th className="px-4 py-4 text-left">
                  <div className="flex items-center gap-2">
                    <LocationOnOutlined className="text-white" sx={{ fontSize: 18 }} />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">Alamat</span>
                  </div>
                </th>
                <th className="px-4 py-4 text-left">
                  <div className="flex items-center gap-2">
                    <SchoolOutlined className="text-white" sx={{ fontSize: 18 }} />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">Kelas</span>
                  </div>
                </th>
                <th className="px-4 py-4 text-left">
                  <div className="flex items-center gap-2">
                    <AccountCircleOutlined className="text-white" sx={{ fontSize: 18 }} />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">Username</span>
                  </div>
                </th>
                <th className="px-4 py-4 text-left">
                  <div className="flex items-center gap-2">
                    <LockOutlined className="text-white" sx={{ fontSize: 18 }} />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">Password</span>
                  </div>
                </th>
                <th className="px-4 py-4 text-left">
                  <div className="flex items-center gap-2">
                    <WcOutlined className="text-white" sx={{ fontSize: 18 }} />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">Gender</span>
                  </div>
                </th>
                <th className="px-4 py-4 text-center">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">Aksi</span>
                </th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {displayedUsers.map((user, index) => (
                  <motion.tr
                    key={user.nisn}
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
                        checked={selectedUsers.includes(user.nisn)}
                        onChange={() => toggleSelectUser(user.nisn)}
                        className="w-4 h-4 rounded accent-[#33A1E0] cursor-pointer"
                      />
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                          <BadgeOutlined className="text-[#33A1E0]" sx={{ fontSize: 16 }} />
                        </div>
                        <span className="text-sm text-gray-700 font-medium">{user.nisn}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center">
                          <PersonOutline className="text-purple-600" sx={{ fontSize: 16 }} />
                        </div>
                        <span className="text-sm text-gray-700 font-medium">{user.nama}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-pink-50 flex items-center justify-center">
                          <CakeOutlined className="text-pink-600" sx={{ fontSize: 16 }} />
                        </div>
                        <span className="text-sm text-gray-600">{user.tanggalLahir}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center">
                          <LocationOnOutlined className="text-orange-600" sx={{ fontSize: 16 }} />
                        </div>
                        <span className="text-sm text-gray-600">{user.alamat}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center">
                          <SchoolOutlined className="text-green-600" sx={{ fontSize: 16 }} />
                        </div>
                        <span className="text-sm text-gray-700 font-semibold">{user.kelas} {user.paralel}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-cyan-50 flex items-center justify-center">
                          <AccountCircleOutlined className="text-cyan-600" sx={{ fontSize: 16 }} />
                        </div>
                        <span className="text-sm text-gray-600 font-mono">{user.username}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center">
                          <LockOutlined className="text-red-600" sx={{ fontSize: 16 }} />
                        </div>
                        <span className="text-sm text-gray-600 font-mono">
                          {visiblePasswords[user.nisn] ? user.password : "••••••"}
                        </span>
                        <button
                          onClick={() => togglePasswordVisibility(user.nisn)}
                          className="p-1 hover:bg-gray-200 rounded transition-colors"
                        >
                          {visiblePasswords[user.nisn] ? (
                            <VisibilityOff className="text-gray-400" sx={{ fontSize: 16 }} />
                          ) : (
                            <Visibility className="text-gray-400" sx={{ fontSize: 16 }} />
                          )}
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center">
                          <WcOutlined className="text-teal-600" sx={{ fontSize: 16 }} />
                        </div>
                        <span className="text-sm text-gray-600">{user.jenisKelamin}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => onEdit(user)}
                          className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all shadow-md"
                          title="Edit"
                        >
                          <Edit sx={{ fontSize: 18 }} />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => onDelete(user)}
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

          {filteredUsers.length === 0 && (
            <EmptyState
              message="Tidak ada data yang ditemukan"
              description={searchTerm || selectedClass !== "Semua Kelas"
                ? "Coba ubah kata kunci pencarian atau filter Anda"
                : "Belum ada data pengguna. Klik tombol 'Tambah Akun' untuk menambahkan data baru"}
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
