"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Close,
  CloudUpload,
  Download,
  Check,
  Error as ErrorIcon,
  Warning,
} from "@mui/icons-material";
import Swal from "sweetalert2";
import { getAllSekolah } from "@/lib/api/sekolah";
import { getAllKelas } from "@/lib/api/kelas";

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  role: "guru" | "siswa";
  onSuccess: () => void;
  userRole: "superadmin" | "admin";
  userSekolahId?: string | null;
}

interface PreviewRow {
  nama_lengkap: string;
  email: string;
  nip?: string;
  nisn?: string;
  jenis_kelamin: string;
  tanggal_lahir?: string;
  alamat?: string;
  rowNumber: number;
  errors?: string[];
}

interface PreviewData {
  totalRows: number;
  validCount: number;
  invalidCount: number;
  validRows: PreviewRow[];
  invalidRows: PreviewRow[];
  previewOnly: boolean;
}

export default function ImportModal({
  isOpen,
  onClose,
  role,
  onSuccess,
  userRole,
  userSekolahId,
}: ImportModalProps) {
  const [step, setStep] = useState<"upload" | "preview" | "importing">("upload");
  const [file, setFile] = useState<File | null>(null);
  const [selectedSekolah, setSelectedSekolah] = useState<string>("");
  const [selectedKelas, setSelectedKelas] = useState<string>("");
  const [selectedKelasIds, setSelectedKelasIds] = useState<string[]>([]);
  const [sekolahList, setSekolahList] = useState<any[]>([]);
  const [kelasList, setKelasList] = useState<any[]>([]);
  const [previewData, setPreviewData] = useState<PreviewData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const isGuru = role === "guru";
  const isSuperadmin = userRole === "superadmin";

  useEffect(() => {
    if (isOpen && isSuperadmin) {
      loadSekolah();
    }
    if (isOpen && !isSuperadmin && userSekolahId) {
      setSelectedSekolah(userSekolahId);
      loadKelas(userSekolahId);
    }
  }, [isOpen, isSuperadmin, userSekolahId]);

  useEffect(() => {
    if (selectedSekolah) {
      loadKelas(selectedSekolah);
    }
  }, [selectedSekolah]);

  const loadSekolah = async () => {
    try {
      const data = await getAllSekolah();
      setSekolahList(data);
    } catch (error) {
      console.error("Error loading sekolah:", error);
    }
  };

  const loadKelas = async (sekolahId: string) => {
    try {
      const data = await getAllKelas({ sekolahId });
      setKelasList(data);
    } catch (error) {
      console.error("Error loading kelas:", error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const allowedTypes = [
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.ms-excel",
        "text/csv",
      ];
      if (!allowedTypes.includes(selectedFile.type)) {
        Swal.fire({
          icon: "error",
          title: "Format File Salah",
          text: "Hanya file .xlsx atau .csv yang diperbolehkan",
        });
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleDownloadTemplate = async () => {
    try {
      const token = localStorage.getItem("admin_token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/template/${role}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) throw new Error("Gagal download template");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `template_${role}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      Swal.fire({
        icon: "success",
        title: "Template Berhasil Diunduh",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Error downloading template:", error);
      Swal.fire({
        icon: "error",
        title: "Gagal Download Template",
        text: "Terjadi kesalahan saat mengunduh template",
      });
    }
  };

  const handlePreview = async () => {
    if (!file) {
      Swal.fire({
        icon: "warning",
        title: "File Belum Dipilih",
        text: "Silakan pilih file Excel/CSV terlebih dahulu",
      });
      return;
    }

    if (isSuperadmin && !selectedSekolah) {
      Swal.fire({
        icon: "warning",
        title: "Sekolah Belum Dipilih",
        text: "Silakan pilih sekolah terlebih dahulu",
      });
      return;
    }

    if (isGuru && selectedKelasIds.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "Kelas Belum Dipilih",
        text: "Pilih minimal satu kelas untuk guru",
      });
      return;
    }

    if (!isGuru && !selectedKelas) {
      Swal.fire({
        icon: "warning",
        title: "Kelas Belum Dipilih",
        text: "Silakan pilih kelas terlebih dahulu",
      });
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("role", role);
      if (isSuperadmin) {
        formData.append("sekolah_id", selectedSekolah);
      }
      if (isGuru) {
        formData.append("kelas_ids", JSON.stringify(selectedKelasIds));
      } else {
        formData.append("kelas_id", selectedKelas);
      }

      const token = localStorage.getItem("admin_token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/import/preview`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Gagal preview data");
      }

      setPreviewData(result.data);
      setStep("preview");
    } catch (error: any) {
      console.error("Error preview:", error);
      Swal.fire({
        icon: "error",
        title: "Gagal Preview",
        text: error.message || "Terjadi kesalahan saat preview data",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleImport = async () => {
    if (!file) return;

    const confirmation = await Swal.fire({
      title: "Konfirmasi Import",
      text: `Import ${previewData?.validCount} data ${role}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3B82F6",
      cancelButtonColor: "#EF4444",
      confirmButtonText: "Ya, Import!",
      cancelButtonText: "Batal",
    });

    if (!confirmation.isConfirmed) return;

    setStep("importing");
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("role", role);
      if (isSuperadmin) {
        formData.append("sekolah_id", selectedSekolah);
      }
      if (isGuru) {
        formData.append("kelas_ids", JSON.stringify(selectedKelasIds));
      } else {
        formData.append("kelas_id", selectedKelas);
      }

      const token = localStorage.getItem("admin_token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/import`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Gagal import data");
      }

      // Download credentials file if available
      if (result.data.credentialsFile) {
        const credentialsBlob = base64ToBlob(
          result.data.credentialsFile,
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        const url = window.URL.createObjectURL(credentialsBlob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `credentials_${role}_${Date.now()}.xlsx`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }

      await Swal.fire({
        icon: "success",
        title: "Import Berhasil!",
        html: `
          <div class="text-left">
            <p><strong>Total:</strong> ${result.data.totalRows} baris</p>
            <p class="text-green-600"><strong>Berhasil:</strong> ${result.data.successCount}</p>
            <p class="text-red-600"><strong>Gagal:</strong> ${result.data.failedCount}</p>
            ${result.data.credentialsFile ? '<p class="text-blue-600 mt-2"><strong>✓</strong> File credentials telah diunduh</p>' : ''}
          </div>
        `,
        confirmButtonColor: "#3B82F6",
      });

      onSuccess();
      handleClose();
    } catch (error: any) {
      console.error("Error import:", error);
      Swal.fire({
        icon: "error",
        title: "Gagal Import",
        text: error.message || "Terjadi kesalahan saat import data",
      });
      setStep("preview");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setStep("upload");
    setFile(null);
    setSelectedSekolah("");
    setSelectedKelas("");
    setSelectedKelasIds([]);
    setPreviewData(null);
    onClose();
  };

  const base64ToBlob = (base64: string, type: string) => {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type });
  };

  const toggleKelasSelection = (kelasId: string) => {
    setSelectedKelasIds((prev) =>
      prev.includes(kelasId)
        ? prev.filter((id) => id !== kelasId)
        : [...prev, kelasId]
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={handleClose}
          />
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-[20px] shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
            >
              {/* Header */}
              <div className="bg-linear-to-r from-primary to-primary-dark p-6 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">
                  Import {role === "guru" ? "Guru" : "Siswa"}
                </h2>
                <button
                  onClick={handleClose}
                  className="text-white hover:bg-white/20 p-2 rounded-lg transition-all"
                >
                  <Close />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
                {step === "upload" && (
                  <div className="space-y-6">
                    {/* Download Template */}
                    <div className="bg-blue-50 border-2 border-blue-200 rounded-[15px] p-4">
                      <div className="flex items-start gap-3">
                        <Download className="text-blue-600 mt-1" />
                        <div className="flex-1">
                          <h3 className="font-semibold text-blue-900 mb-2">
                            Download Template Excel
                          </h3>
                          <p className="text-sm text-blue-700 mb-3">
                            Download template untuk format yang benar
                          </p>
                          <button
                            onClick={handleDownloadTemplate}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all text-sm font-semibold"
                          >
                            Download Template
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Select Sekolah (Superadmin only) */}
                    {isSuperadmin && (
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Pilih Sekolah <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={selectedSekolah}
                          onChange={(e) => setSelectedSekolah(e.target.value)}
                          className="w-full px-4 py-3 border-2 text-black border-gray-200 rounded-[15px] focus:outline-none focus:border-primary transition-all"
                        >
                          <option value="">-- Pilih Sekolah --</option>
                          {sekolahList.map((sekolah) => (
                            <option key={sekolah.id} value={sekolah.id}>
                              {sekolah.nama_sekolah}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    {/* Select Kelas */}
                    {!isGuru ? (
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Pilih Kelas <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={selectedKelas}
                          onChange={(e) => setSelectedKelas(e.target.value)}
                          className="w-full px-4 py-3 border-2 text-black border-gray-200 rounded-[15px] focus:outline-none focus:border-primary transition-all"
                          disabled={!selectedSekolah && isSuperadmin}
                        >
                          <option value="">-- Pilih Kelas --</option>
                          {kelasList.map((kelas) => (
                            <option key={kelas.id} value={kelas.id}>
                              {kelas.nama_kelas}
                            </option>
                          ))}
                        </select>
                      </div>
                    ) : (
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Pilih Kelas (Multi) <span className="text-red-500">*</span>
                        </label>
                        <div className="border-2 border-gray-200 rounded-[15px] p-4 max-h-48 overflow-y-auto">
                          {kelasList.length === 0 ? (
                            <p className="text-gray-500 text-sm">Tidak ada kelas</p>
                          ) : (
                            kelasList.map((kelas) => (
                              <label
                                key={kelas.id}
                                className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                              >
                                <input
                                  type="checkbox"
                                  checked={selectedKelasIds.includes(kelas.id)}
                                  onChange={() => toggleKelasSelection(kelas.id)}
                                  className="w-4 h-4 accent-primary"
                                />
                                <span className="text-sm text-gray-700">
                                  {kelas.nama_kelas}
                                </span>
                              </label>
                            ))
                          )}
                        </div>
                        {selectedKelasIds.length > 0 && (
                          <p className="text-sm text-primary mt-2">
                            {selectedKelasIds.length} kelas dipilih
                          </p>
                        )}
                      </div>
                    )}

                    {/* File Upload */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Upload File Excel/CSV <span className="text-red-500">*</span>
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-[15px] p-8 text-center hover:border-primary transition-all">
                        <input
                          type="file"
                          id="file-upload"
                          accept=".xlsx,.xls,.csv"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                        <label
                          htmlFor="file-upload"
                          className="cursor-pointer flex flex-col items-center"
                        >
                          <CloudUpload
                            className="text-gray-400 mb-3"
                            sx={{ fontSize: 48 }}
                          />
                          <p className="text-sm text-gray-600 mb-1">
                            Klik untuk upload atau drag & drop
                          </p>
                          <p className="text-xs text-gray-500">
                            Format: .xlsx atau .csv (Max 10MB)
                          </p>
                        </label>
                      </div>
                      {file && (
                        <div className="mt-3 flex items-center gap-2 text-sm text-green-600">
                          <Check sx={{ fontSize: 18 }} />
                          <span>{file.name}</span>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                      <button
                        onClick={handleClose}
                        className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-[15px] text-gray-700 font-semibold hover:bg-gray-50 transition-all"
                      >
                        Batal
                      </button>
                      <button
                        onClick={handlePreview}
                        disabled={isLoading}
                        className="flex-1 px-6 py-3 bg-primary text-white rounded-[15px] font-semibold hover:bg-primary-dark transition-all disabled:bg-gray-300 disabled:cursor-not-allowed"
                      >
                        {isLoading ? "Memproses..." : "Preview Data"}
                      </button>
                    </div>
                  </div>
                )}

                {step === "preview" && previewData && (
                  <div className="space-y-6">
                    {/* Summary */}
                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-blue-50 rounded-[15px] p-4 text-center">
                        <p className="text-sm text-blue-700 mb-1">Total Baris</p>
                        <p className="text-2xl font-bold text-blue-900">
                          {previewData.totalRows}
                        </p>
                      </div>
                      <div className="bg-green-50 rounded-[15px] p-4 text-center">
                        <p className="text-sm text-green-700 mb-1">Valid</p>
                        <p className="text-2xl font-bold text-green-900">
                          {previewData.validCount}
                        </p>
                      </div>
                      <div className="bg-red-50 rounded-[15px] p-4 text-center">
                        <p className="text-sm text-red-700 mb-1">Invalid</p>
                        <p className="text-2xl font-bold text-red-900">
                          {previewData.invalidCount}
                        </p>
                      </div>
                    </div>

                    {/* Invalid Rows */}
                    {previewData.invalidCount > 0 && (
                      <div className="bg-red-50 border-2 border-red-200 rounded-[15px] p-4">
                        <div className="flex items-start gap-3">
                          <ErrorIcon className="text-red-600 mt-1" />
                          <div className="flex-1">
                            <h3 className="font-semibold text-red-900 mb-2">
                              Data Invalid ({previewData.invalidCount})
                            </h3>
                            <div className="space-y-2 max-h-48 overflow-y-auto">
                              {previewData.invalidRows.slice(0, 10).map((row, idx) => (
                                <div
                                  key={idx}
                                  className="bg-white rounded-lg p-3 border border-red-200"
                                >
                                  <p className="text-sm font-semibold text-red-900 mb-1">
                                    Baris {row.rowNumber}: {row.nama_lengkap}
                                  </p>
                                  <ul className="text-xs text-red-700 list-disc list-inside">
                                    {row.errors?.map((error, errIdx) => (
                                      <li key={errIdx}>{error}</li>
                                    ))}
                                  </ul>
                                </div>
                              ))}
                              {previewData.invalidRows.length > 10 && (
                                <p className="text-xs text-red-600">
                                  ... dan {previewData.invalidRows.length - 10} lainnya
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Warning */}
                    {previewData.invalidCount > 0 && (
                      <div className="bg-yellow-50 border-2 border-yellow-200 rounded-[15px] p-4">
                        <div className="flex items-start gap-3">
                          <Warning className="text-yellow-600 mt-1" />
                          <div>
                            <h3 className="font-semibold text-yellow-900 mb-1">
                              Peringatan
                            </h3>
                            <p className="text-sm text-yellow-700">
                              Hanya data valid yang akan di-import. Data invalid akan
                              dilewati.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3">
                      <button
                        onClick={() => setStep("upload")}
                        className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-[15px] text-gray-700 font-semibold hover:bg-gray-50 transition-all"
                      >
                        Kembali
                      </button>
                      <button
                        onClick={handleImport}
                        disabled={previewData.validCount === 0}
                        className="flex-1 px-6 py-3 bg-green-600 text-white rounded-[15px] font-semibold hover:bg-green-700 transition-all disabled:bg-gray-300 disabled:cursor-not-allowed"
                      >
                        Import {previewData.validCount} Data
                      </button>
                    </div>
                  </div>
                )}

                {step === "importing" && (
                  <div className="flex flex-col items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent mb-4"></div>
                    <p className="text-lg font-semibold text-gray-700">
                      Mengimport data...
                    </p>
                    <p className="text-sm text-gray-500">
                      Mohon tunggu, proses ini mungkin memakan waktu
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
