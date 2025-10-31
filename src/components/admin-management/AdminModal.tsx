"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Close,
  PersonOutline,
  EmailOutlined,
  PhoneOutlined,
  SchoolOutlined,
  LocationOnOutlined,
  WcOutlined,
  AccountCircleOutlined,
  LockOutlined,
  Save,
  Visibility,
  VisibilityOff,
  ArrowForward,
  ArrowBack,
  CheckCircle
} from "@mui/icons-material";
import CustomSelect from "../user-management/CustomSelect";
import { useSchoolData } from "@/contexts/SchoolDataContext";

interface Admin {
  id: string;
  nama: string;
  email: string;
  telepon: string;
  sekolah: string;
  alamatSekolah: string;
  jenisKelamin: string;
  username: string;
  password: string;
  tanggalDibuat: string;
}

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (admin: Admin) => void;
  admin?: Admin | null;
  mode: "create" | "edit";
}

export default function AdminModal({
  isOpen,
  onClose,
  onSave,
  admin,
  mode
}: AdminModalProps) {
  const { getSchoolNames } = useSchoolData();
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<Admin>({
    id: "",
    nama: "",
    email: "",
    telepon: "",
    sekolah: "",
    alamatSekolah: "",
    jenisKelamin: "",
    username: "",
    password: "",
    tanggalDibuat: ""
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const steps = [
    { number: 1, title: "Data Pribadi", icon: PersonOutline },
    { number: 2, title: "Data Sekolah", icon: SchoolOutlined },
    { number: 3, title: "Akun Login", icon: AccountCircleOutlined },
    { number: 4, title: "Konfirmasi", icon: CheckCircle }
  ];

  useEffect(() => {
    if (admin && mode === "edit") {
      setFormData(admin);
      setCurrentStep(1);
    } else {
      setFormData({
        id: "",
        nama: "",
        email: "",
        telepon: "",
        sekolah: "",
        alamatSekolah: "",
        jenisKelamin: "",
        username: "",
        password: "",
        tanggalDibuat: ""
      });
      setCurrentStep(1);
    }
    setErrors({});
  }, [admin, mode, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateStep = (step: number) => {
    const newErrors: { [key: string]: string } = {};

    if (step === 1) {
      if (!formData.nama.trim()) newErrors.nama = "Nama wajib diisi";
      if (!formData.email.trim()) newErrors.email = "Email wajib diisi";
      if (!formData.telepon.trim()) newErrors.telepon = "Telepon wajib diisi";
      if (!formData.jenisKelamin) newErrors.jenisKelamin = "Jenis kelamin wajib dipilih";
    } else if (step === 2) {
      if (!formData.sekolah.trim()) newErrors.sekolah = "Nama sekolah wajib diisi";
      if (!formData.alamatSekolah.trim()) newErrors.alamatSekolah = "Alamat sekolah wajib diisi";
    } else if (step === 3) {
      if (!formData.username.trim()) newErrors.username = "Username wajib diisi";
      if (!formData.password.trim()) newErrors.password = "Password wajib diisi";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    setErrors({});
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

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
            <div className="bg-gradient-to-r from-[#33A1E0] to-[#2288C3] px-6 lg:px-8 py-4 lg:py-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl lg:text-2xl font-bold text-white mb-1">
                    {mode === "create" ? "Tambah" : "Edit"} Admin Sekolah
                  </h2>
                  <p className="text-white/80 text-xs lg:text-sm">
                    Lengkapi form di bawah untuk {mode === "create" ? "menambahkan" : "mengubah"} data admin
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

            {/* Step Indicator */}
            <div className="px-6 lg:px-8 py-4 lg:py-6 bg-gray-50 border-b border-gray-200">
              <div className="flex items-center justify-between max-w-lg mx-auto">
                {steps.map((step, index) => (
                  <div key={step.number} className="flex items-center">
                    <div className="flex flex-col items-center">
                      <motion.div
                        initial={false}
                        animate={{
                          scale: currentStep === step.number ? 1.1 : 1,
                          backgroundColor: currentStep >= step.number ? "#33A1E0" : "#E5E7EB"
                        }}
                        className={`w-10 h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center ${currentStep >= step.number ? "text-white" : "text-gray-400"
                          } font-bold shadow-md`}
                      >
                        {currentStep > step.number ? (
                          <CheckCircle sx={{ fontSize: { xs: 20, lg: 24 } }} />
                        ) : (
                          <step.icon sx={{ fontSize: { xs: 20, lg: 24 } }} />
                        )}
                      </motion.div>
                      <span className={`text-xs mt-2 font-medium hidden sm:block ${currentStep >= step.number ? "text-[#33A1E0]" : "text-gray-400"
                        }`}>
                        {step.title}
                      </span>
                    </div>
                    {index < steps.length - 1 && (
                      <div className={`w-8 lg:w-16 h-1 mx-1 lg:mx-2 rounded-full transition-all ${currentStep > step.number ? "bg-[#33A1E0]" : "bg-gray-300"
                        }`} />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Form Content */}
            <form onSubmit={handleSubmit} className="p-6 lg:p-8 overflow-y-auto max-h-[calc(90vh-350px)]">
              <AnimatePresence mode="wait">
                {/* Step 1: Data Pribadi */}
                {currentStep === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <div className="text-center mb-6">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#33A1E0] to-[#2288C3] rounded-full mb-4">
                        <PersonOutline className="text-white" sx={{ fontSize: 32 }} />
                      </div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">Data Pribadi</h3>
                      <p className="text-sm text-gray-600">Masukkan informasi pribadi admin</p>
                    </div>

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
                        className={`w-full px-4 py-3 rounded-[12px] border-2 transition-all text-gray-900 font-medium ${errors.nama ? "border-red-500" : "border-gray-200 focus:border-[#33A1E0]"
                          } focus:outline-none text-sm lg:text-base`}
                        placeholder="Masukkan nama lengkap"
                        autoFocus
                      />
                      {errors.nama && <p className="text-red-500 text-xs mt-1">{errors.nama}</p>}
                    </div>

                    <div>
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                        <EmailOutlined className="text-[#33A1E0]" sx={{ fontSize: 18 }} />
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 rounded-[12px] border-2 transition-all text-gray-900 font-medium ${errors.email ? "border-red-500" : "border-gray-200 focus:border-[#33A1E0]"
                          } focus:outline-none text-sm lg:text-base`}
                        placeholder="admin@email.com"
                      />
                      {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                    </div>

                    <div>
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                        <PhoneOutlined className="text-[#33A1E0]" sx={{ fontSize: 18 }} />
                        Nomor Telepon
                      </label>
                      <input
                        type="tel"
                        name="telepon"
                        value={formData.telepon}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 rounded-[12px] border-2 transition-all text-gray-900 font-medium ${errors.telepon ? "border-red-500" : "border-gray-200 focus:border-[#33A1E0]"
                          } focus:outline-none text-sm lg:text-base`}
                        placeholder="0812-3456-7890"
                      />
                      {errors.telepon && <p className="text-red-500 text-xs mt-1">{errors.telepon}</p>}
                    </div>

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
                      {errors.jenisKelamin && <p className="text-red-500 text-xs mt-1">{errors.jenisKelamin}</p>}
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Data Sekolah */}
                {currentStep === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <div className="text-center mb-6">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#33A1E0] to-[#2288C3] rounded-full mb-4">
                        <SchoolOutlined className="text-white" sx={{ fontSize: 32 }} />
                      </div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">Data Sekolah</h3>
                      <p className="text-sm text-gray-600">Masukkan informasi sekolah yang dikelola</p>
                    </div>

                    <div>
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                        <SchoolOutlined className="text-[#33A1E0]" sx={{ fontSize: 18 }} />
                        Pilih Sekolah
                      </label>
                      <CustomSelect
                        value={formData.sekolah}
                        onChange={(value) => {
                          const schoolData = getSchoolNames().find(s => s.value === value);
                          setFormData(prev => ({ 
                            ...prev, 
                            sekolah: value,
                            alamatSekolah: schoolData?.alamat || ""
                          }));
                          if (errors.sekolah) {
                            setErrors(prev => ({ ...prev, sekolah: "" }));
                          }
                        }}
                        options={getSchoolNames()}
                        placeholder="Pilih sekolah dari daftar"
                        icon={<SchoolOutlined sx={{ fontSize: 18 }} />}
                        error={errors.sekolah}
                      />
                      {errors.sekolah && <p className="text-red-500 text-xs mt-1">{errors.sekolah}</p>}
                      <p className="text-xs text-gray-500 mt-2">💡 Pilih dari daftar sekolah yang sudah terdaftar</p>
                    </div>

                    {formData.sekolah && (
                      <div className="p-4 bg-blue-50 border border-blue-200 rounded-[12px]">
                        <div className="flex items-start gap-3">
                          <LocationOnOutlined className="text-blue-600 mt-0.5" sx={{ fontSize: 20 }} />
                          <div>
                            <p className="text-xs font-semibold text-blue-800 mb-1">Alamat Sekolah:</p>
                            <p className="text-sm text-blue-700">{formData.alamatSekolah}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Step 3: Akun Login */}
                {currentStep === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <div className="text-center mb-6">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#33A1E0] to-[#2288C3] rounded-full mb-4">
                        <AccountCircleOutlined className="text-white" sx={{ fontSize: 32 }} />
                      </div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">Akun Login</h3>
                      <p className="text-sm text-gray-600">Buat username dan password untuk login</p>
                    </div>

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
                        className={`w-full px-4 py-3 rounded-[12px] border-2 transition-all text-gray-900 font-medium ${errors.username ? "border-red-500" : "border-gray-200 focus:border-[#33A1E0]"
                          } focus:outline-none font-mono text-sm lg:text-base`}
                        placeholder="username"
                      />
                      {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
                    </div>

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
                          className={`w-full px-4 py-3 pr-12 rounded-[12px] border-2 transition-all text-gray-900 font-medium ${errors.password ? "border-red-500" : "border-gray-200 focus:border-[#33A1E0]"
                            } focus:outline-none font-mono text-sm lg:text-base`}
                          placeholder="••••••••"
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
                      {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                    </div>
                  </motion.div>
                )}

                {/* Step 4: Konfirmasi */}
                {currentStep === 4 && (
                  <motion.div
                    key="step4"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <div className="text-center mb-6">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full mb-4">
                        <CheckCircle className="text-white" sx={{ fontSize: 32 }} />
                      </div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">Konfirmasi Data</h3>
                      <p className="text-sm text-gray-600">Periksa kembali data sebelum menyimpan</p>
                    </div>

                    <div className="bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200 rounded-[20px] p-6 space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Nama</p>
                          <p className="text-sm font-semibold text-gray-800">{formData.nama}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Jenis Kelamin</p>
                          <p className="text-sm font-semibold text-gray-800">{formData.jenisKelamin}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Email</p>
                          <p className="text-sm font-semibold text-gray-800">{formData.email}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Telepon</p>
                          <p className="text-sm font-semibold text-gray-800">{formData.telepon}</p>
                        </div>
                      </div>
                      <div className="pt-4 border-t border-gray-200">
                        <p className="text-xs text-gray-500 mb-1">Sekolah</p>
                        <p className="text-sm font-semibold text-gray-800">{formData.sekolah}</p>
                        <p className="text-xs text-gray-600 mt-1">{formData.alamatSekolah}</p>
                      </div>
                      <div className="pt-4 border-t border-gray-200">
                        <p className="text-xs text-gray-500 mb-1">Username</p>
                        <p className="text-sm font-semibold text-gray-800 font-mono">{formData.username}</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={currentStep === 1 ? onClose : handleBack}
                  className="flex items-center gap-2 px-4 lg:px-6 py-2 lg:py-3 rounded-[12px] border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-all text-sm lg:text-base"
                >
                  {currentStep === 1 ? (
                    <>
                      <Close sx={{ fontSize: 20 }} />
                      <span>Batal</span>
                    </>
                  ) : (
                    <>
                      <ArrowBack sx={{ fontSize: 20 }} />
                      <span>Kembali</span>
                    </>
                  )}
                </motion.button>

                {currentStep < 4 ? (
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleNext}
                    className="flex items-center gap-2 px-4 lg:px-6 py-2 lg:py-3 rounded-[12px] bg-gradient-to-r from-[#33A1E0] to-[#2288C3] text-white font-semibold hover:shadow-lg transition-all text-sm lg:text-base"
                  >
                    <span>Lanjut</span>
                    <ArrowForward sx={{ fontSize: 20 }} />
                  </motion.button>
                ) : (
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-4 lg:px-6 py-2 lg:py-3 rounded-[12px] bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold hover:shadow-lg transition-all text-sm lg:text-base"
                  >
                    <Save sx={{ fontSize: 20 }} />
                    <span>{mode === "create" ? "Simpan Data" : "Update Data"}</span>
                  </motion.button>
                )}
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
