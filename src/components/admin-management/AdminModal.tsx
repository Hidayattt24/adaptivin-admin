"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Close,
  PersonOutline,
  EmailOutlined,
  SchoolOutlined,
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
  sekolah_id: string;
  nama_lengkap: string;
  email: string;
  password: string;
  alamat: string;
  jenisKelamin?: string;
}

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (admin: Admin) => void;
  admin?: Admin | null;
  mode: "create" | "edit";
  sekolahList: { id: string; nama_sekolah: string }[];
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
    sekolah_id: "",
    nama_lengkap: "",
    email: "",
    password: "",
    alamat: "",
    jenisKelamin: "",
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
        nama_lengkap: "",
        email: "",
        password: "",
        sekolah_id: "",
        alamat: "",
        jenisKelamin: "",
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
      if (!formData.nama_lengkap.trim()) newErrors.nama_lengkap = "Nama wajib diisi";
      if (!formData.jenisKelamin) newErrors.jenisKelamin = "Jenis kelamin wajib dipilih";
    } else if (step === 2) {
      if (!formData.sekolah_id.trim()) newErrors.sekolah_id = "Nama sekolah wajib diisi";
      if (!formData.alamat.trim()) newErrors.alamat = "Alamat sekolah wajib diisi";
    } else if (step === 3) {
      if (!formData.email.trim()) newErrors.email = "Email wajib diisi";
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
                        name="nama_lengkap"
                        value={formData.nama_lengkap}
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
                        <WcOutlined className="text-[#33A1E0]" sx={{ fontSize: 18 }} />
                        Jenis Kelamin
                      </label>
                      <CustomSelect
                        value={formData.jenisKelamin ? formData.jenisKelamin : ""}
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
                        value={formData.sekolah_id}
                        onChange={(value) => {
                          const schoolData = getSchoolNames().find(s => s.value === value);
                          setFormData(prev => ({
                            ...prev,
                            sekolah_id: value,
                            alamat: schoolData?.alamat || ""
                          }));
                          if (errors.sekolah_id) {
                            setErrors(prev => ({ ...prev, sekolah_id: "" }));
                          }
                        }}
                        options={getSchoolNames()}
                        placeholder="Pilih sekolah dari daftar"
                        icon={<SchoolOutlined sx={{ fontSize: 18 }} />}
                        error={errors.sekolah_id}
                      />
                      {errors.sekolah_id && <p className="text-red-500 text-xs mt-1">{errors.sekolah_id}</p>}
                      <p className="text-xs text-gray-500 mt-2">💡 Pilih dari daftar sekolah yang sudah terdaftar</p>
                    </div>
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
                      <p className="text-sm text-gray-600">Buat username(email) dan password untuk login</p>
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
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#33A1E0] to-[#2288C3] rounded-full mb-4">
                        <CheckCircle className="text-white" sx={{ fontSize: 32 }} />
                      </div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">Konfirmasi Data</h3>
                      <p className="text-sm text-gray-600">Pastikan semua data sudah benar sebelum disimpan</p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-xl border text-sm space-y-2">
                      <p><strong>Nama Lengkap:</strong> {formData.nama_lengkap}</p>
                      <p><strong>Jenis Kelamin:</strong> {formData.jenisKelamin}</p>
                      <p><strong>Sekolah:</strong> {getSchoolNames().find(s => s.value === formData.sekolah_id)?.label}</p>
                      <p><strong>Alamat:</strong> {formData.alamat}</p>
                      <p><strong>Email:</strong> {formData.email}</p>
                    </div>

                    <p className="text-xs text-gray-500 text-center">Jika sudah sesuai, klik tombol simpan untuk melanjutkan.</p>
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
