"use client";

import { useMemo, useState } from "react";
import {
  ExpandMore,
  Search,
  BadgeOutlined,
  PersonOutline,
  SchoolOutlined,
  AccountCircleOutlined,
  Edit,
  Delete,
  Add,
  LockReset,
  SwapHoriz,
  FileUpload,
  FileDownload,
  Visibility,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import EmptyState from "./EmptyState";
import type { ManagedUser, ManagedUserRole } from "@/lib/api/user";

const DEFAULT_CLASS_FILTER = "Semua Kelas";
const DEFAULT_SCHOOL_FILTER = "Semua Sekolah";

const identifierLabelMap: Record<ManagedUserRole, "NIP" | "NISN"> = {
  guru: "NIP",
  siswa: "NISN",
};

const normalize = (value: string | null | undefined) =>
  (value ?? "").toLowerCase();

const formatClassDisplay = (kelas: string | null, paralel: string | null) => {
  if (!kelas && !paralel) return "-";
  if (!kelas) return paralel ?? "-";
  if (!paralel) return kelas;
  return `${kelas} ${paralel}`;
};

interface UserManagementTableProps {
  title: string;
  role: ManagedUserRole;
  users: ManagedUser[];
  onEdit: (user: ManagedUser) => void;
  onDelete: (user: ManagedUser) => void;
  onAdd: () => void;
  onResetPassword?: (user: ManagedUser) => void;
  onBulkMove?: () => void;
  onImport?: () => void;
  onExport?: () => void;
  onViewDetail?: (user: ManagedUser) => void;
  selectedUserIds?: string[];
  onSelectionChange?: (ids: string[]) => void;
}

export default function UserManagementTable({
  title,
  role,
  users,
  onEdit,
  onDelete,
  onAdd,
  onResetPassword,
  onBulkMove,
  onImport,
  onExport,
  onViewDetail,
  selectedUserIds = [],
  onSelectionChange,
}: UserManagementTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState(DEFAULT_CLASS_FILTER);
  const [selectedSchool, setSelectedSchool] = useState(DEFAULT_SCHOOL_FILTER);
  const [currentPage, setCurrentPage] = useState(1);
  const [isClassDropdownOpen, setIsClassDropdownOpen] = useState(false);
  const [isSchoolDropdownOpen, setIsSchoolDropdownOpen] = useState(false);

  // Use external selection if provided, otherwise manage internally
  const selectedUsers = onSelectionChange ? selectedUserIds : [];
  const setSelectedUsers = onSelectionChange || (() => { });

  const itemsPerPage = 10;
  const identifierLabel = identifierLabelMap[role];

  const classOptions = useMemo(() => {
    const levels = new Set<string>();
    users.forEach((user) => {
      if (user.kelasLevel) {
        levels.add(user.kelasLevel);
      }
    });
    return [
      DEFAULT_CLASS_FILTER,
      ...Array.from(levels).sort((a, b) => a.localeCompare(b)),
    ];
  }, [users]);

  const schoolOptions = useMemo(() => {
    const schools = new Set<string>();
    users.forEach((user) => {
      if (user.sekolahName) {
        schools.add(user.sekolahName);
      }
    });
    return [
      DEFAULT_SCHOOL_FILTER,
      ...Array.from(schools).sort((a, b) => a.localeCompare(b)),
    ];
  }, [users]);

  const effectiveSelectedClass = classOptions.includes(selectedClass)
    ? selectedClass
    : DEFAULT_CLASS_FILTER;

  const effectiveSelectedSchool = schoolOptions.includes(selectedSchool)
    ? selectedSchool
    : DEFAULT_SCHOOL_FILTER;

  const filteredUsers = useMemo(() => {
    const keyword = normalize(searchTerm);
    return users.filter((user) => {
      const matchesSearch =
        !keyword ||
        normalize(user.nama).includes(keyword) ||
        normalize(user.identifier).includes(keyword) ||
        normalize(user.email).includes(keyword);

      const matchesClass =
        effectiveSelectedClass === DEFAULT_CLASS_FILTER ||
        user.kelasLevel === effectiveSelectedClass;

      const matchesSchool =
        effectiveSelectedSchool === DEFAULT_SCHOOL_FILTER ||
        user.sekolahName === effectiveSelectedSchool;

      return matchesSearch && matchesClass && matchesSchool;
    });
  }, [searchTerm, effectiveSelectedClass, effectiveSelectedSchool, users]);

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / itemsPerPage));
  const activePage = Math.max(1, Math.min(currentPage, totalPages));
  const startIndex = (activePage - 1) * itemsPerPage;
  const displayedUsers = filteredUsers.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const toggleSelectUser = (userId: string) => {
    if (onSelectionChange) {
      const newSelection = selectedUsers.includes(userId)
        ? selectedUsers.filter((id) => id !== userId)
        : [...selectedUsers, userId];
      onSelectionChange(newSelection);
    }
  };

  const toggleSelectAll = () => {
    if (!onSelectionChange) return;

    if (displayedUsers.length === 0) {
      onSelectionChange([]);
      return;
    }

    if (selectedUsers.length === displayedUsers.length) {
      onSelectionChange([]);
    } else {
      onSelectionChange(displayedUsers.map((user) => user.id));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-[20px] p-6 shadow-lg bg-linear-to-br from-primary to-primary-dark"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-white text-2xl font-bold">{title}</h2>
        <div className="flex items-center gap-3">
          {role === "siswa" && onBulkMove && selectedUsers.length > 0 && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onBulkMove}
              className="flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 rounded-[15px] text-white font-semibold transition-all shadow-lg"
            >
              <SwapHoriz sx={{ fontSize: 20 }} />
              <span>Pindah Kelas ({selectedUsers.length})</span>
            </motion.button>
          )}
          {onImport && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onImport}
              className="flex items-center gap-2 px-6 py-3 bg-purple-500 hover:bg-purple-600 rounded-[15px] text-white font-semibold transition-all shadow-lg"
            >
              <FileUpload sx={{ fontSize: 20 }} />
              <span>Import Excel</span>
            </motion.button>
          )}
          {onExport && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onExport}
              className="flex items-center gap-2 px-6 py-3 bg-cyan-500 hover:bg-cyan-600 rounded-[15px] text-white font-semibold transition-all shadow-lg"
            >
              <FileDownload sx={{ fontSize: 20 }} />
              <span>Export Excel</span>
            </motion.button>
          )}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onAdd}
            className="flex items-center gap-2 px-6 py-3 bg-white rounded-[15px] text-primary font-semibold hover:bg-slate-50 transition-all shadow-lg"
          >
            <Add sx={{ fontSize: 20 }} />
            <span>Tambah Akun</span>
          </motion.button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Cari nama, email, atau ID pengguna..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-12 pr-4 py-3 rounded-[15px] bg-white border-none text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all duration-200 shadow-md"
          />
        </div>

        {/* School Filter Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsSchoolDropdownOpen(!isSchoolDropdownOpen)}
            className="flex items-center gap-2 px-5 py-3 bg-white rounded-[15px] text-primary font-semibold hover:bg-slate-50 transition-all shadow-md min-w-[180px] justify-between"
          >
            <span className="truncate">{effectiveSelectedSchool}</span>
            <ExpandMore
              className={`transition-transform ${isSchoolDropdownOpen ? "rotate-180" : ""}`}
            />
          </button>

          <AnimatePresence>
            {isSchoolDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full mt-2 right-0 bg-white rounded-[15px] shadow-xl overflow-hidden z-10 min-w-[180px] max-h-[300px] overflow-y-auto"
              >
                {schoolOptions.map((sekolah) => (
                  <button
                    key={sekolah}
                    onClick={() => {
                      setSelectedSchool(sekolah);
                      setIsSchoolDropdownOpen(false);
                      setCurrentPage(1);
                      if (onSelectionChange) onSelectionChange([]);
                    }}
                    className={`w-full px-5 py-3 text-left transition-all ${effectiveSelectedSchool === sekolah
                      ? "bg-primary text-white font-semibold"
                      : "text-slate-700 hover:bg-slate-100"
                      }`}
                  >
                    {sekolah}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Class Filter Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsClassDropdownOpen(!isClassDropdownOpen)}
            className="flex items-center gap-2 px-5 py-3 bg-white rounded-[15px] text-primary font-semibold hover:bg-slate-50 transition-all shadow-md min-w-[150px] justify-between"
          >
            <span>{effectiveSelectedClass}</span>
            <ExpandMore
              className={`transition-transform ${isClassDropdownOpen ? "rotate-180" : ""}`}
            />
          </button>

          <AnimatePresence>
            {isClassDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full mt-2 right-0 bg-white rounded-[15px] shadow-xl overflow-hidden z-10 min-w-[150px]"
              >
                {classOptions.map((kelas) => (
                  <button
                    key={kelas}
                    onClick={() => {
                      setSelectedClass(kelas);
                      setIsClassDropdownOpen(false);
                      setCurrentPage(1);
                      if (onSelectionChange) onSelectionChange([]);
                    }}
                    className={`w-full px-5 py-3 text-left transition-all ${effectiveSelectedClass === kelas
                      ? "bg-primary text-white font-semibold"
                      : "text-slate-700 hover:bg-slate-100"
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
              <tr className="bg-linear-to-r from-primary to-primary-dark">
                {role === "siswa" && (
                  <th className="px-4 py-4 text-left">
                    <input
                      type="checkbox"
                      checked={
                        selectedUsers.length === displayedUsers.length &&
                        displayedUsers.length > 0
                      }
                      onChange={toggleSelectAll}
                      className="w-4 h-4 rounded accent-white cursor-pointer"
                    />
                  </th>
                )}
                <th className="px-4 py-4 text-left">
                  <div className="flex items-center gap-2">
                    <BadgeOutlined className="text-white" sx={{ fontSize: 18 }} />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      {identifierLabel}
                    </span>
                  </div>
                </th>
                <th className="px-4 py-4 text-left">
                  <div className="flex items-center gap-2">
                    <PersonOutline className="text-white" sx={{ fontSize: 18 }} />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      Nama
                    </span>
                  </div>
                </th>
                <th className="px-4 py-4 text-left">
                  <div className="flex items-center gap-2">
                    <AccountCircleOutlined className="text-white" sx={{ fontSize: 18 }} />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      Email
                    </span>
                  </div>
                </th>
                <th className="px-4 py-4 text-left">
                  <div className="flex items-center gap-2">
                    <SchoolOutlined className="text-white" sx={{ fontSize: 18 }} />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      Kelas
                    </span>
                  </div>
                </th>
                <th className="px-4 py-4 text-center">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    Aksi
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {displayedUsers.map((user, index) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className={`border-b border-gray-100 hover:bg-primary/5 transition-colors ${index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                      }`}
                  >
                    {role === "siswa" && (
                      <td className="px-4 py-4">
                        <input
                          type="checkbox"
                          checked={selectedUsers.includes(user.id)}
                          onChange={() => toggleSelectUser(user.id)}
                          className="w-4 h-4 rounded accent-primary cursor-pointer"
                        />
                      </td>
                    )}
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                          <BadgeOutlined className="text-primary" sx={{ fontSize: 16 }} />
                        </div>
                        <span className="text-sm text-gray-700 font-medium">
                          {user.identifier ?? "-"}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center">
                          <PersonOutline className="text-purple-600" sx={{ fontSize: 16 }} />
                        </div>
                        <span className="text-sm text-gray-700 font-medium">
                          {user.nama}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-cyan-50 flex items-center justify-center">
                          <AccountCircleOutlined className="text-cyan-600" sx={{ fontSize: 16 }} />
                        </div>
                        <span className="text-sm text-gray-600 font-medium break-all">
                          {user.email || "-"}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center shrink-0">
                          <SchoolOutlined className="text-green-600" sx={{ fontSize: 16 }} />
                        </div>
                        {role === "guru" && user.kelasAssignments && user.kelasAssignments.length > 1 ? (
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                              {user.kelasAssignments.length} Kelas
                            </span>
                            <span className="text-sm text-gray-700 font-semibold">
                              {user.kelasAssignments.map((a) => a.kelasName ?? formatClassDisplay(a.kelasLevel, a.kelasRombel)).join(", ")}
                            </span>
                          </div>
                        ) : role === "guru" && user.kelasAssignments && user.kelasAssignments.length === 1 ? (
                          <span className="text-sm text-gray-700 font-semibold">
                            {user.kelasName ?? formatClassDisplay(user.kelasLevel, user.kelasRombel)}
                          </span>
                        ) : (
                          <span className="text-sm text-gray-700 font-semibold">
                            {user.kelasName ?? formatClassDisplay(user.kelasLevel, user.kelasRombel)}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-center gap-2">
                        {onViewDetail && (
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => onViewDetail(user)}
                            className="p-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-all shadow-md"
                            title="Lihat Detail"
                          >
                            <Visibility sx={{ fontSize: 18 }} />
                          </motion.button>
                        )}
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => onEdit(user)}
                          className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all shadow-md"
                          title="Edit"
                        >
                          <Edit sx={{ fontSize: 18 }} />
                        </motion.button>
                        {onResetPassword && (
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => onResetPassword(user)}
                            className="p-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-all shadow-md"
                            title="Reset Password"
                          >
                            <LockReset sx={{ fontSize: 18 }} />
                          </motion.button>
                        )}
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
              description={searchTerm || selectedClass !== DEFAULT_CLASS_FILTER || selectedSchool !== DEFAULT_SCHOOL_FILTER
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
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={activePage === 1}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${activePage === 1
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-white text-primary hover:bg-gray-50 shadow-md"
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
                className={`w-10 h-10 rounded-lg font-semibold transition-all ${activePage === page
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
            onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={activePage === totalPages}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${activePage === totalPages
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
