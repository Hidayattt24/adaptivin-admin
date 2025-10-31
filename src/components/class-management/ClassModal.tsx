"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Close,
  SchoolOutlined,
  ClassOutlined,
  GroupsOutlined,
  Save,
  ArrowForward,
  ArrowBack,
  CheckCircle
} from "@mui/icons-material";
import CustomSelect from "../user-management/CustomSelect";
import { useClassData } from "@/contexts/ClassDataContext";

interface ClassData {
  id: string;
  sekolah: string;
  kelas: string;
  paralel: string;
  mataPelajaran: string[];
  jumlahMurid: number;
}

interface ClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (classData: ClassData) => void;
  classData?: ClassData | null;
  mode: "create" | "edit";
  studentCount?: number;
}

export default function ClassModal({
  isOpen,
  onClose,
  onSave,
  classData,
  mode,
  studentCount = 0
}: ClassModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<ClassData>({
    id: "",
    sekolah: "",
    kelas: "",
    paralel: "",
    mataPelajaran: ["Matematika"],
    jumlahMurid: 0
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const steps = [
    { number: 1, title: "Informasi Sekolah", icon: SchoolOutlined },
    { number: 2, title: "Detail Kelas", icon: ClassOutlined },
    { number: 3, title: "Konfirmasi", icon: CheckCircle }
  ];

  useEffect(() => {
    if (classData && mode === "edit") {
      setFormData(classData);
      setCurrentStep(1);
    } else {
      setFormData({
        id: Date.now().toString(),
        sekolah: "",
        kelas: "",
        paralel: "",
        mataPelajaran: ["Matematika"],
        jumlahMurid: studentCount
      });
      setCurrentStep(1);
    }
    setErrors({});
  }, [classData, mode, isOpen, studentCount]);

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
      if (!formData.sekolah.trim()) newErrors.sekolah = "Sekolah wajib diisi";
    } else if (step === 2) {
      if (!formData.kelas) newErrors.kelas = "Kelas wajib dipilih";
      if (!formData.paralel.trim()) newErrors.paralel = "Paralel wajib diisi";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 3));
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
            className="relative bg-white rounded-[25px] shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#33A1E0] to-[#2288C3] px-8 py-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-1">
                    {mode === "create" ? "Tambah" : "Edit"} Data Kelas
                  </h2>
                  <p className="text-white/80 text-sm">
                    Lengkapi form di bawah untuk {mode === "create" ? "menambahkan" : "mengubah"} data kelas
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

            {/* Step Indicator */}
            <div className="px-8 py-6 bg-gray-50 border-b border-gray-200">
              <div className="flex items-center justify-between max-w-md mx-auto">
                {steps.map((step, index) => (
                  <div key={step.number} className="flex items-center">
                    <div className="flex flex-col items-center">
                      <motion.div
                        initial={false}
                        animate={{
                          scale: currentStep === step.number ? 1.1 : 1,
                          backgroundColor: currentStep >= step.number ? "#33A1E0" : "#E5E7EB"
                        }}
                        className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          currentStep >= step.number ? "text-white" : "text-gray-400"
                        } font-bold shadow-md`}
                      >
                        {currentStep > step.number ? (
                          <CheckCircle sx={{ fontSize: 24 }} />
                        ) : (
                          <step.icon sx={{ fontSize: 24 }} />
                        )}
                      </motion.div>
                      <span className={`text-xs mt-2 font-medium ${
                        currentStep >= step.number ? "text-[#33A1E0]" : "text-gray-400"
                      }`}>
                        {step.title}
                      </span>
                    </div>
                    {index < steps.length - 1 && (
                      <div className={`w-16 h-1 mx-2 rounded-full transition-all ${
                        currentStep > step.number ? "bg-[#33A1E0]" : "bg-gray-300"
                      }`} />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Form Content */}
            <form onSubmit={handleSubmit} className="p-8 overflow-y-auto max-h-[calc(90vh-300px)]">
              <AnimatePresence mode="wait">
                {/* Step 1: Informasi Sekolah */}
                {currentStep === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="text-center mb-6">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#33A1E0] to-[#2288C3] rounded-full mb-4">
                        <SchoolOutlined className="text-white" sx={{ fontSize: 32 }} />
                      </div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">Informasi Sekolah</h3>
                      <p className="text-sm text-gray-600">Masukkan nama sekolah untuk kelas yang akan dibuat</p>
                    </div>

                    <div>
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                        <SchoolOutlined className="text-[#33A1E0]" sx={{ fontSize: 18 }} />
                        Nama Sekolah
                      </label>
                      <input
                        type="text"
                        name="sekolah"
                        value={formData.sekolah}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 rounded-[12px] border-2 transition-all text-gray-900 font-medium ${
                          errors.sekolah
                            ? "border-red-500 focus:border-red-500"
                            : "border-gray-200 focus:border-[#33A1E0]"
                        } focus:outline-none placeholder:text-gray-400 placeholder:font-normal`}
                        placeholder="Contoh: SDN 1 Banda Aceh"
                        autoFocus
                      />
                      {errors.sekolah && (
                        <p className="text-red-500 text-xs mt-1">{errors.sekolah}</p>
                      )}
                      <p className="text-xs text-gray-500 mt-2">💡 Tip: Gunakan nama lengkap sekolah</p>
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Detail Kelas */}
                {currentStep === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="text-center mb-6">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#33A1E0] to-[#2288C3] rounded-full mb-4">
                        <ClassOutlined className="text-white" sx={{ fontSize: 32 }} />
                      </div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">Detail Kelas</h3>
                      <p className="text-sm text-gray-600">Tentukan tingkat kelas dan paralel</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                          <ClassOutlined className="text-[#33A1E0]" sx={{ fontSize: 18 }} />
                          Tingkat Kelas
                        </label>
                        <CustomSelect
                          value={formData.kelas}
                          onChange={(value) => {
                            setFormData(prev => ({ ...prev, kelas: value }));
                            if (errors.kelas) {
                              setErrors(prev => ({ ...prev, kelas: "" }));
                            }
                          }}
                          options={[
                            { value: "I", label: "Kelas I" },
                            { value: "II", label: "Kelas II" },
                            { value: "III", label: "Kelas III" },
                            { value: "IV", label: "Kelas IV" },
                            { value: "V", label: "Kelas V" },
                            { value: "VI", label: "Kelas VI" }
                          ]}
                          placeholder="Pilih kelas"
                          icon={<ClassOutlined sx={{ fontSize: 18 }} />}
                          error={errors.kelas}
                        />
                        {errors.kelas && (
                          <p className="text-red-500 text-xs mt-1">{errors.kelas}</p>
                        )}
                      </div>

                      <div>
                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                          <ClassOutlined className="text-[#33A1E0]" sx={{ fontSize: 18 }} />
                          Paralel
                        </label>
                        <input
                          type="text"
                          name="paralel"
                          value={formData.paralel}
                          onChange={handleChange}
                          className={`w-full px-4 py-3 rounded-[12px] border-2 transition-all text-gray-900 font-medium ${
                            errors.paralel
                              ? "border-red-500 focus:border-red-500"
                              : "border-gray-200 focus:border-[#33A1E0]"
                          } focus:outline-none placeholder:text-gray-400 placeholder:font-normal uppercase`}
                          placeholder="A, B, C, dll"
                          maxLength={1}
                        />
                        {errors.paralel && (
                          <p className="text-red-500 text-xs mt-1">{errors.paralel}</p>
                        )}
                      </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-[12px] p-4">
                      <p className="text-sm text-blue-800">
                        <span className="font-semibold">📚 Mata Pelajaran:</span> Matematika (otomatis)
                      </p>
                      <p className="text-xs text-blue-600 mt-1">
                        Sistem ini khusus untuk pembelajaran Matematika SD
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Konfirmasi */}
                {currentStep === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="text-center mb-6">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full mb-4">
                        <CheckCircle className="text-white" sx={{ fontSize: 32 }} />
                      </div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">Konfirmasi Data</h3>
                      <p className="text-sm text-gray-600">Periksa kembali data kelas sebelum menyimpan</p>
                    </div>

                    <div className="bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200 rounded-[20px] p-6 space-y-4">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-[#33A1E0]/10 rounded-full flex items-center justify-center flex-shrink-0">
                          <SchoolOutlined className="text-[#33A1E0]" sx={{ fontSize: 20 }} />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-gray-500 mb-1">Sekolah</p>
                          <p className="text-base font-semibold text-gray-800">{formData.sekolah}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-[#33A1E0]/10 rounded-full flex items-center justify-center flex-shrink-0">
                          <ClassOutlined className="text-[#33A1E0]" sx={{ fontSize: 20 }} />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-gray-500 mb-1">Kelas & Paralel</p>
                          <p className="text-base font-semibold text-gray-800">
                            Kelas {formData.kelas} - {formData.paralel}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-[#33A1E0]/10 rounded-full flex items-center justify-center flex-shrink-0">
                          <GroupsOutlined className="text-[#33A1E0]" sx={{ fontSize: 20 }} />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-gray-500 mb-1">Jumlah Murid</p>
                          <p className="text-base font-semibold text-gray-800">
                            {formData.jumlahMurid} Murid
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            *Akan diperbarui otomatis saat menambah/menghapus murid
                          </p>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-gray-200">
                        <div className="flex items-center gap-2 text-sm">
                          <span className="px-3 py-1 bg-gradient-to-r from-[#33A1E0] to-[#2288C3] text-white rounded-full font-medium">
                            Matematika
                          </span>
                        </div>
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
                  className="flex items-center gap-2 px-6 py-3 rounded-[12px] border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-all"
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

                {currentStep < 3 ? (
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleNext}
                    className="flex items-center gap-2 px-6 py-3 rounded-[12px] bg-gradient-to-r from-[#33A1E0] to-[#2288C3] text-white font-semibold hover:shadow-lg transition-all"
                  >
                    <span>Lanjut</span>
                    <ArrowForward sx={{ fontSize: 20 }} />
                  </motion.button>
                ) : (
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-6 py-3 rounded-[12px] bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold hover:shadow-lg transition-all"
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
