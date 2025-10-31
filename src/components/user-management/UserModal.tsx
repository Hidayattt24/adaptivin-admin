"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Close,
  BadgeOutlined,
  PersonOutline,
  LocationOnOutlined,
  SchoolOutlined,
  AccountCircleOutlined,
  LockOutlined,
  WcOutlined,
  Save,
  Visibility,
  VisibilityOff
} from "@mui/icons-material";
import CustomDatePicker from "./CustomDatePicker";
import CustomSelect from "./CustomSelect";
import { useClassData } from "@/contexts/ClassDataContext";

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

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (user: User) => void;
  user?: User | null;
  mode: "create" | "edit";
  role: "Murid" | "Guru";
}

export default function UserModal({
  isOpen,
  onClose,
  onSave,
  user,
  mode,
  role
}: UserModalProps) {
  const { getUniqueSchools, getClassesBySchool, getParalelsBySchoolAndClass } = useClassData();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<User>({
    nisn: "",
    nama: "",
    tanggalLahir: "",
    alamat: "",
    kelas: "",
    paralel: "",
    sekolah: "",
    username: "",
    password: "",
    jenisKelamin: "",
    role: role
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  
  // Dynamic options based on selections
  const schoolOptions = getUniqueSchools().map(school => ({ value: school, label: school }));
  const classOptions = formData.sekolah 
    ? getClassesBySchool(formData.sekolah).map(kelas => ({ value: kelas, label: `Kelas ${kelas}` }))
    : [];
  const paralelOptions = formData.sekolah && formData.kelas
    ? getParalelsBySchoolAndClass(formData.sekolah, formData.kelas).map(paralel => ({ value: paralel, label: paralel }))
    : [];

  useEffect(() => {
    if (user && mode === "edit") {
      setFormData(user);
    } else {
      setFormData({
        nisn: "",
        nama: "",
        tanggalLahir: "",
        alamat: "",
        kelas: "",
        paralel: "",
        sekolah: "",
        username: "",
        password: "",
        jenisKelamin: "",
        role: role
      });
    }
    setErrors({});
  }, [user, mode, role, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.nisn.trim()) newErrors.nisn = "NISN wajib diisi";
    if (!formData.nama.trim()) newErrors.nama = "Nama wajib diisi";
    if (!formData.tanggalLahir) newErrors.tanggalLahir = "Tanggal lahir wajib diisi";
    if (!formData.alamat.trim()) newErrors.alamat = "Alamat wajib diisi";
    if (!formData.kelas) newErrors.kelas = "Kelas wajib dipilih";
    if (!formData.paralel) newErrors.paralel = "Paralel wajib dipilih";
    if (!formData.sekolah.trim()) newErrors.sekolah = "Sekolah wajib diisi";
    if (!formData.username.trim()) newErrors.username = "Username wajib diisi";
    if (!formData.password.trim()) newErrors.password = "Password wajib diisi";
    if (!formData.jenisKelamin) newErrors.jenisKelamin = "Jenis kelamin wajib dipilih";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onSave(formData);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="relative bg-white rounded-[25px] shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#33A1E0] to-[#2288C3] px-8 py-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-1">
                    {mode === "create" ? "Tambah" : "Edit"} Akun {role}
                  </h2>
                  <p className="text-white/80 text-sm">
                    Lengkapi form di bawah untuk {mode === "create" ? "menambahkan" : "mengubah"} data {role.toLowerCase()}
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                >
                  <Close className="text-white" />
                </motion.button>
              </div>
            </div>

            {/* Form Content */}
            <form onSubmit={handleSubmit} className="p-8 overflow-y-auto max-h-[calc(90vh-200px)]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* NISN */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <BadgeOutlined className="text-[#33A1E0]" sx={{ fontSize: 18 }} />
                    NISN
                  </label>
                  <input
                    type="text"
                    name="nisn"
                    value={formData.nisn}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-[12px] border-2 transition-all text-gray-900 font-medium ${
                      errors.nisn
                        ? "border-red-500 focus:border-red-500"
                        : "border-gray-200 focus:border-[#33A1E0]"
                    } focus:outline-none placeholder:text-gray-400 placeholder:font-normal`}
                    placeholder="Masukkan NISN"
                  />
                  {errors.nisn && (
                    <p className="text-red-500 text-xs mt-1">{errors.nisn}</p>
                  )}
                </div>

                {/* Nama */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <PersonOutline className="text-[#33A1E0]" sx={{ fontSize: 18 }} />
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    name="nama"
                    value={formData.nama}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-[12px] border-2 transition-all text-gray-900 font-medium ${
                      errors.nama
                        ? "border-red-500 focus:border-red-500"
                        : "border-gray-200 focus:border-[#33A1E0]"
                    } focus:outline-none placeholder:text-gray-400 placeholder:font-normal`}
                    placeholder="Masukkan nama lengkap"
                  />
                  {errors.nama && (
                    <p className="text-red-500 text-xs mt-1">{errors.nama}</p>
                  )}
                </div>

                {/* Tanggal Lahir */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    Tanggal Lahir
                  </label>
                  <CustomDatePicker
                    value={formData.tanggalLahir}
                    onChange={(value) => {
                      setFormData(prev => ({ ...prev, tanggalLahir: value }));
                      if (errors.tanggalLahir) {
                        setErrors(prev => ({ ...prev, tanggalLahir: "" }));
                      }
                    }}
                    placeholder="Pilih tanggal lahir"
                    error={errors.tanggalLahir}
                  />
                  {errors.tanggalLahir && (
                    <p className="text-red-500 text-xs mt-1">{errors.tanggalLahir}</p>
                  )}
                </div>

                {/* Jenis Kelamin */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <WcOutlined className="text-[#33A1E0]" sx={{ fontSize: 18 }} />
                    Jenis Kelamin
                  </label>
                  <CustomSelect
                    value={formData.jenisKelamin}
                    onChange={(value) => {
                      setFormData(prev => ({ ...prev, jenisKelamin: value }));
                      if (errors.jenisKelamin) {
                        setErrors(prev => ({ ...prev, jenisKelamin: "" }));
                      }
                    }}
                    options={[
                      { value: "Laki-laki", label: "Laki-laki" },
                      { value: "Perempuan", label: "Perempuan" }
                    ]}
                    placeholder="Pilih jenis kelamin"
                    icon={<WcOutlined sx={{ fontSize: 18 }} />}
                    error={errors.jenisKelamin}
                  />
                  {errors.jenisKelamin && (
                    <p className="text-red-500 text-xs mt-1">{errors.jenisKelamin}</p>
                  )}
                </div>

                {/* Alamat - Full Width */}
                <div className="md:col-span-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <LocationOnOutlined className="text-[#33A1E0]" sx={{ fontSize: 18 }} />
                    Alamat
                  </label>
                  <input
                    type="text"
                    name="alamat"
                    value={formData.alamat}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-[12px] border-2 transition-all text-gray-900 font-medium ${
                      errors.alamat
                        ? "border-red-500 focus:border-red-500"
                        : "border-gray-200 focus:border-[#33A1E0]"
                    } focus:outline-none placeholder:text-gray-400 placeholder:font-normal`}
                    placeholder="Masukkan alamat lengkap"
                  />
                  {errors.alamat && (
                    <p className="text-red-500 text-xs mt-1">{errors.alamat}</p>
                  )}
                </div>

                {/* Sekolah - Full Width */}
                <div className="md:col-span-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <SchoolOutlined className="text-[#33A1E0]" sx={{ fontSize: 18 }} />
                    Sekolah
                  </label>
                  <CustomSelect
                    value={formData.sekolah}
                    onChange={(value) => {
                      setFormData(prev => ({ ...prev, sekolah: value, kelas: "", paralel: "" }));
                      if (errors.sekolah) {
                        setErrors(prev => ({ ...prev, sekolah: "" }));
                      }
                    }}
                    options={schoolOptions}
                    placeholder="Pilih sekolah"
                    icon={<SchoolOutlined sx={{ fontSize: 18 }} />}
                    error={errors.sekolah}
                  />
                  {errors.sekolah && (
                    <p className="text-red-500 text-xs mt-1">{errors.sekolah}</p>
                  )}
                </div>

                {/* Kelas */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <SchoolOutlined className="text-[#33A1E0]" sx={{ fontSize: 18 }} />
                    Kelas
                  </label>
                  <CustomSelect
                    value={formData.kelas}
                    onChange={(value) => {
                      setFormData(prev => ({ ...prev, kelas: value, paralel: "" }));
                      if (errors.kelas) {
                        setErrors(prev => ({ ...prev, kelas: "" }));
                      }
                    }}
                    options={classOptions}
                    placeholder={formData.sekolah ? "Pilih kelas" : "Pilih sekolah terlebih dahulu"}
                    icon={<SchoolOutlined sx={{ fontSize: 18 }} />}
                    error={errors.kelas}
                    disabled={!formData.sekolah}
                  />
                  {errors.kelas && (
                    <p className="text-red-500 text-xs mt-1">{errors.kelas}</p>
                  )}
                </div>

                {/* Paralel */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <SchoolOutlined className="text-[#33A1E0]" sx={{ fontSize: 18 }} />
                    Paralel
                  </label>
                  <CustomSelect
                    value={formData.paralel}
                    onChange={(value) => {
                      setFormData(prev => ({ ...prev, paralel: value }));
                      if (errors.paralel) {
                        setErrors(prev => ({ ...prev, paralel: "" }));
                      }
                    }}
                    options={paralelOptions}
                    placeholder={formData.sekolah && formData.kelas ? "Pilih paralel" : "Pilih sekolah dan kelas terlebih dahulu"}
                    icon={<SchoolOutlined sx={{ fontSize: 18 }} />}
                    error={errors.paralel}
                    disabled={!formData.sekolah || !formData.kelas}
                  />
                  {errors.paralel && (
                    <p className="text-red-500 text-xs mt-1">{errors.paralel}</p>
                  )}
                </div>

                {/* Username */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <AccountCircleOutlined className="text-[#33A1E0]" sx={{ fontSize: 18 }} />
                    Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-[12px] border-2 transition-all text-gray-900 font-medium ${
                      errors.username
                        ? "border-red-500 focus:border-red-500"
                        : "border-gray-200 focus:border-[#33A1E0]"
                    } focus:outline-none font-mono placeholder:text-gray-400 placeholder:font-normal`}
                    placeholder="Masukkan username"
                  />
                  {errors.username && (
                    <p className="text-red-500 text-xs mt-1">{errors.username}</p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <LockOutlined className="text-[#33A1E0]" sx={{ fontSize: 18 }} />
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 pr-12 rounded-[12px] border-2 transition-all text-gray-900 font-medium ${
                        errors.password
                          ? "border-red-500 focus:border-red-500"
                          : "border-gray-200 focus:border-[#33A1E0]"
                      } focus:outline-none font-mono placeholder:text-gray-400 placeholder:font-normal`}
                      placeholder="Masukkan password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded transition-colors"
                    >
                      {showPassword ? (
                        <VisibilityOff className="text-gray-400" sx={{ fontSize: 20 }} />
                      ) : (
                        <Visibility className="text-gray-400" sx={{ fontSize: 20 }} />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-4 mt-8 pt-6 border-t border-gray-200">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                  className="px-6 py-3 rounded-[12px] border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-all"
                >
                  Batal
                </motion.button>
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-6 py-3 rounded-[12px] bg-gradient-to-r from-[#33A1E0] to-[#2288C3] text-white font-semibold hover:shadow-lg transition-all"
                >
                  <Save sx={{ fontSize: 20 }} />
                  <span>{mode === "create" ? "Simpan" : "Update"}</span>
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
