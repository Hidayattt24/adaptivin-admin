"use client";

import { useState, useMemo, useEffect } from "react";
import {
  ExpandMore,
  Search,
  BadgeOutlined,
  PersonOutline,
  CakeOutlined,
  LocationOnOutlined,
  SchoolOutlined,
  AccountCircleOutlined,
  WcOutlined
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { getAllUsers, getAllAdmins } from "@/lib/api/user";
import type { ManagedUser, AdminData } from "@/lib/api/user";

interface User {
  id: string;
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
  role: "Murid" | "Guru" | "Admin";
}

export default function UserTable() {
  const { admin } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("Semua");
  const [showAll, setShowAll] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const isSuperAdmin = admin?.role === "superadmin";

  // Filter roles based on admin type
  const roleOptions = isSuperAdmin
    ? ["Semua", "Admin", "Guru", "Murid"]
    : ["Semua", "Guru", "Murid"];

  useEffect(() => {
    const fetchUsers = async () => {
      if (!admin) return;

      try {
        setIsLoading(true);
        let fetchedUsers: User[] = [];

        // Fetch admin data for superadmin
        if (isSuperAdmin) {
          const adminData = await getAllAdmins();
          const adminUsers: User[] = adminData.map((a: AdminData) => ({
            id: a.id,
            nisn: "-",
            nama: a.nama_lengkap || "N/A",
            tanggalLahir: "-",
            alamat: a.alamat || "-",
            kelas: "-",
            paralel: "-",
            sekolah: "-",
            username: a.email || "N/A",
            password: "••••••",
            jenisKelamin: a.jenisKelamin || "-",
            role: "Admin" as const,
          }));
          fetchedUsers = [...adminUsers];
        }

        // Fetch managed users (guru and siswa)
        const managedUsers = await getAllUsers();
        const managedUserData: User[] = managedUsers.map((u: ManagedUser) => ({
          id: u.id,
          nisn: u.identifier || "-",
          nama: u.nama || "N/A",
          tanggalLahir: u.tanggalLahir ? new Date(u.tanggalLahir).toLocaleDateString("id-ID") : "-",
          alamat: u.alamat || "-",
          kelas: u.kelasAssignments?.[0]?.kelasLevel || "-",
          paralel: u.kelasAssignments?.[0]?.kelasRombel || "-",
          sekolah: u.sekolahName || "-",
          username: u.email || "N/A",
          password: "••••••",
          jenisKelamin: u.jenisKelamin || "-",
          role: u.role === "guru" ? "Guru" : "Murid",
        }));

        fetchedUsers = [...fetchedUsers, ...managedUserData];
        setUsers(fetchedUsers);
      } catch (error) {
        console.error("Gagal memuat data pengguna:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [admin, isSuperAdmin]);

  // const togglePasswordVisibility = (id: string) => {
  //   setVisiblePasswords(prev => ({
  //     ...prev,
  //     [id]: !prev[id]
  //   }));
  // };

  // Filter users based on search and role
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.nisn.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.username.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesRole =
        selectedRole === "Semua" || user.role === selectedRole;

      return matchesSearch && matchesRole;
    });
  }, [searchTerm, selectedRole, users]);

  const displayedUsers = showAll ? filteredUsers : filteredUsers.slice(0, 2);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-[20px] p-6 shadow-lg bg-primary"
    >
      {/* Header */}
      <h2 className="text-white text-2xl font-bold mb-6">Pengguna</h2>

      {/* Search and Filter */}
      <div className="flex items-center gap-4 mb-6">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Cari nama pengguna atau Nomor induk..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-[15px] bg-white border-none text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all duration-200 shadow-md"
          />
        </div>

        {/* Role Filter Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 px-5 py-3 bg-white rounded-[15px] text-primary font-semibold hover:bg-gray-50 transition-all shadow-md min-w-[150px] justify-between"
          >
            <span>{selectedRole}</span>
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
                {roleOptions.map((role) => (
                  <button
                    key={role}
                    onClick={() => {
                      setSelectedRole(role);
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full px-5 py-3 text-left hover:bg-[#ECF3F6] transition-all ${selectedRole === role
                      ? "bg-primary text-white font-semibold"
                      : "text-gray-700"
                      }`}
                  >
                    {role}
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
            <p className="text-gray-500 font-medium">Memuat data pengguna...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-primary">
                  <th className="px-4 py-4 text-left">
                    <input type="checkbox" className="w-4 h-4 rounded accent-white" />
                  </th>
                  <th className="px-4 py-4 text-left">
                    <div className="flex items-center gap-2">
                      <BadgeOutlined className="text-white" sx={{ fontSize: 18 }} />
                      <span className="text-xs font-bold text-white uppercase tracking-wider">Nomor Induk</span>
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
                      <SchoolOutlined className="text-white" sx={{ fontSize: 18 }} />
                      <span className="text-xs font-bold text-white uppercase tracking-wider">Sekolah</span>
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
                      <WcOutlined className="text-white" sx={{ fontSize: 18 }} />
                      <span className="text-xs font-bold text-white uppercase tracking-wider">Gender</span>
                    </div>
                  </th>
                  <th className="px-4 py-4 text-left">
                    <span className="text-xs font-bold text-white uppercase tracking-wider">Role</span>
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
                      transition={{ delay: index * 0.05 }}
                      className={`border-b border-gray-100 hover:bg-primary/5 transition-colors ${index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                        }`}
                    >
                      <td className="px-4 py-4">
                        <input type="checkbox" className="w-4 h-4 rounded accent-primary" />
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                            <BadgeOutlined className="text-primary" sx={{ fontSize: 16 }} />
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
                          <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
                            <SchoolOutlined className="text-indigo-600" sx={{ fontSize: 16 }} />
                          </div>
                          <span className="text-sm text-gray-600">{user.sekolah}</span>
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
                          <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center">
                            <WcOutlined className="text-teal-600" sx={{ fontSize: 16 }} />
                          </div>
                          <span className="text-sm text-gray-600">{user.jenisKelamin}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`px-4 py-1.5 rounded-lg text-xs font-bold text-white shadow-sm ${user.role === "Murid" ? "bg-linear-to-r from-green-500 to-green-600" : "bg-gradient-to-r from-blue-500 to-blue-600"
                            }`}
                        >
                          {user.role}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>

            {filteredUsers.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 font-medium">Tidak ada data yang ditemukan</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* View More Button */}
      {filteredUsers.length > 2 && (
        <div className="flex justify-center mt-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAll(!showAll)}
            className="px-8 py-3 bg-white rounded-full text-primary font-bold hover:bg-gray-50 transition-all shadow-lg"
          >
            {showAll ? "Lihat Lebih Sedikit" : `Lihat Selengkapnya (${filteredUsers.length - 2} lagi)`}
          </motion.button>
        </div>
      )}
    </motion.div>
  );
}
