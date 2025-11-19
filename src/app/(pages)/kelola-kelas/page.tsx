"use client";

import { useState, useEffect, useCallback } from "react";
import ResponsiveLayout from "@/components/layout/ResponsiveLayout";
import ClassManagementTable from "@/components/class-management/ClassManagementTable";
import ClassModal from "@/components/class-management/ClassModal";
import ClassDetailModal from "@/components/class-management/ClassDetailModal";
import Swal from "sweetalert2";
import { useAuth } from "@/contexts/AuthContext";
import {
  getAllKelas,
  createKelas,
  updateKelas,
  deleteKelas,
  KelasPayload,
  KelasResponse,
} from "@/lib/api/kelas";
import { getAllSekolah } from "@/lib/api/sekolah";
import { getAllUsers } from "@/lib/api/user";

interface ClassData {
  id: string;
  sekolah: string;
  kelas: string;
  paralel: string;
  mataPelajaran: string[];
  jumlahMurid: number;
  sekolahId?: string;
  namaKelas?: string;
  tingkatKelas?: string;
  tahunAjaran?: string | null;
  createdAt?: string;
  updatedAt?: string;
  guruNames?: string[];
}

export default function KelolaKelasPage() {
  const { admin } = useAuth();
  const [classes, setClasses] = useState<ClassData[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedClass, setSelectedClass] = useState<ClassData | null>(null);
  const [modalInstanceKey, setModalInstanceKey] = useState("class-modal");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const mapKelasResponse = useCallback(
    (kelas: KelasResponse, sekolahMap: Record<string, string>, guruMap: Record<string, string[]>): ClassData => ({
      id: kelas.id,
      sekolahId: kelas.sekolah_id,
      sekolah: sekolahMap[kelas.sekolah_id] ?? "Sekolah tidak ditemukan",
      kelas: kelas.tingkat_kelas || kelas.nama_kelas,
      paralel: kelas.rombel ?? "",
      mataPelajaran: [kelas.mata_pelajaran ?? "Matematika"],
      jumlahMurid: kelas.jumlah_siswa ?? 0,
      namaKelas: kelas.nama_kelas,
      tingkatKelas: kelas.tingkat_kelas,
      tahunAjaran: kelas.tahun_ajaran,
      createdAt: kelas.created_at,
      updatedAt: kelas.updated_at,
      guruNames: guruMap[kelas.id] ?? [],
    }),
    []
  );

  const buildClassName = (tingkat: string, paralel: string) => {
    const trimmedTingkat = tingkat?.trim();
    const trimmedParalel = paralel?.trim();
    return [trimmedTingkat, trimmedParalel].filter(Boolean).join(" ");
  };

  const extractErrorMessage = (error: unknown, fallback: string) => {
    if (typeof error === "object" && error !== null) {
      const maybeAxios = error as {
        response?: { data?: { error?: string; message?: string; details?: string } };
        message?: string;
      };
      return (
        maybeAxios.response?.data?.error ??
        maybeAxios.response?.data?.message ??
        maybeAxios.response?.data?.details ??
        maybeAxios.message ??
        fallback
      );
    }
    if (error instanceof Error) {
      return error.message;
    }
    return fallback;
  };

  const fetchSchools = useCallback(async () => {
    try {
      const sekolahList = await getAllSekolah();
      const map: Record<string, string> = {};
      (sekolahList || []).forEach((item: { id: string; nama_sekolah?: string }) => {
        if (item?.id) {
          map[item.id] = item.nama_sekolah ?? "Nama sekolah tidak tersedia";
        }
      });
      return map;
    } catch (error) {
      console.error("Gagal memuat data sekolah:", error);
      return {};
    }
  }, []);

  const refreshClasses = useCallback(async () => {
    if (!admin) return;
    setIsLoading(true);
    try {
      const sekolahMap = await fetchSchools();

      const kelasList = await getAllKelas();
      
      // Fetch all teachers to map them by kelasId
      const allTeachers = await getAllUsers({ role: "guru" });
      const guruMap: Record<string, string[]> = {};
      allTeachers.forEach((guru) => {
        if (guru.kelasId) {
          // Split kelasId by comma in case there are multiple classes
          const kelasIds = guru.kelasId.split(',').map((id: string) => id.trim());
          kelasIds.forEach((kelasId: string) => {
            if (!guruMap[kelasId]) {
              guruMap[kelasId] = [];
            }
            guruMap[kelasId].push(guru.nama);
          });
        }
      });

      const mapped = kelasList.map((kelas) => mapKelasResponse(kelas, sekolahMap, guruMap));
      setClasses(mapped);
    } catch (error) {
      const message = extractErrorMessage(error, "Gagal memuat data kelas");
      Swal.fire({
        icon: "error",
        title: "Gagal memuat data",
        text: message,
        confirmButtonColor: "#33A1E0",
      });
    } finally {
      setIsLoading(false);
    }
  }, [admin, fetchSchools, mapKelasResponse, setClasses]);

  useEffect(() => {
    refreshClasses();
  }, [refreshClasses]);

  const handleAdd = () => {
    setModalMode("create");
    setSelectedClass(null);
    setModalInstanceKey(`create-${Date.now()}`);
    setIsModalOpen(true);
  };

  const handleEdit = (classData: ClassData) => {
    setModalMode("edit");
    setSelectedClass(classData);
    setModalInstanceKey(`edit-${classData.id}`);
    setIsModalOpen(true);
  };

  const handleDetail = (classData: ClassData) => {
    setSelectedClass(classData);
    setIsDetailModalOpen(true);
  };

  const handleDelete = async (classData: ClassData) => {
    if (isSubmitting) return;

    const result = await Swal.fire({
      title: "Hapus Kelas?",
      html: `
        <div class="text-left">
          <p class="mb-3">Apakah Anda yakin ingin menghapus kelas <b>${classData.kelas} ${classData.paralel} - ${classData.sekolah}</b>?</p>
          <div class="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
            <p class="text-sm text-yellow-800 mb-2"><b>⚠️ Perhatian:</b></p>
            <ul class="text-sm text-yellow-700 list-disc list-inside space-y-1">
              <li>Guru dan siswa akan dilepaskan dari kelas ini</li>
              <li>Assignment guru dan siswa ke kelas akan dihapus</li>
              <li>Data guru dan siswa <b>tidak</b> akan dihapus</li>
              <li>Tindakan ini tidak dapat dibatalkan</li>
            </ul>
          </div>
        </div>
      `,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#94a3b8",
      confirmButtonText: "Ya, Hapus Kelas",
      cancelButtonText: "Batal",
      background: "#ffffff",
      customClass: {
        popup: "rounded-[20px] shadow-2xl",
        title: "text-[#ef4444] text-2xl font-semibold",
        htmlContainer: "text-gray-600",
        confirmButton: "font-semibold px-6 py-3 rounded-[12px]",
        cancelButton: "font-semibold px-6 py-3 rounded-[12px]",
      },
    });

    if (!result.isConfirmed) return;

    try {
      setIsSubmitting(true);
      const response = await deleteKelas(classData.id);
      await refreshClasses();
      
      // Show detailed success message
      const affected = response?.affected || {};
      await Swal.fire({
        title: "Berhasil!",
        html: `
          <div class="text-left">
            <p class="mb-3">Kelas <b>${classData.kelas} ${classData.paralel}</b> telah dihapus.</p>
            ${affected.guru || affected.siswa ? `
              <div class="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <p class="text-sm text-blue-800 mb-2"><b>📊 Data yang terpengaruh:</b></p>
                <ul class="text-sm text-blue-700 list-disc list-inside space-y-1">
                  ${affected.guru ? `<li>${affected.guru} Guru dilepaskan dari kelas</li>` : ''}
                  ${affected.siswa ? `<li>${affected.siswa} Siswa dilepaskan dari kelas</li>` : ''}
                </ul>
              </div>
            ` : ''}
          </div>
        `,
        icon: "success",
        confirmButtonColor: "#33A1E0",
        confirmButtonText: "OK",
        background: "#ffffff",
        customClass: {
          popup: "rounded-[20px] shadow-2xl",
          title: "text-primary text-2xl font-semibold",
          htmlContainer: "text-gray-600",
          confirmButton: "font-semibold px-6 py-3 rounded-[12px]",
        },
      });
    } catch (error) {
      const message = extractErrorMessage(error, "Gagal menghapus data kelas");
      await Swal.fire({
        icon: "error",
        title: "Gagal menghapus",
        text: message,
        confirmButtonColor: "#33A1E0",
        customClass: {
          popup: "rounded-[20px] shadow-2xl",
          title: "text-[#ef4444] text-2xl font-semibold",
          confirmButton: "font-semibold px-6 py-3 rounded-[12px]",
        },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSave = async (classData: ClassData) => {
    if (isSubmitting) return;

    const payload: KelasPayload = {
      nama_kelas:
        buildClassName(classData.kelas, classData.paralel) ||
        classData.namaKelas ||
        "Kelas Baru",
      tingkat_kelas: classData.kelas,
      rombel: classData.paralel || null,
      mata_pelajaran: classData.mataPelajaran?.[0] ?? "Matematika",
    };

    // Tambahkan sekolah_id jika superadmin atau dari classData
    if (classData.sekolahId) {
      payload.sekolah_id = classData.sekolahId;
    } else if (admin?.sekolah_id) {
      payload.sekolah_id = admin.sekolah_id;
    }

    if (!payload.nama_kelas || !payload.tingkat_kelas) {
      Swal.fire({
        icon: "warning",
        title: "Data belum lengkap",
        text: "Pastikan tingkat kelas dan paralel terisi dengan benar.",
        confirmButtonColor: "#33A1E0",
      });
      return;
    }

    // Validasi sekolah_id untuk superadmin
    if (admin?.role === "superadmin" && !payload.sekolah_id) {
      Swal.fire({
        icon: "warning",
        title: "Sekolah belum dipilih",
        text: "Superadmin harus memilih sekolah terlebih dahulu.",
        confirmButtonColor: "#33A1E0",
      });
      return;
    }

    try {
      setIsSubmitting(true);

      if (modalMode === "create") {
        await createKelas(payload);
        await refreshClasses();
        Swal.fire({
          title: "Berhasil!",
          text: `Data kelas ${payload.nama_kelas} berhasil ditambahkan.`,
          icon: "success",
          confirmButtonColor: "#33A1E0",
          confirmButtonText: "OK",
          background: "#ffffff",
          customClass: {
            popup: "rounded-[20px] shadow-2xl",
            title: "text-primary text-2xl font-semibold",
            confirmButton: "font-semibold px-6 py-3 rounded-[12px]",
          },
        });
      } else if (selectedClass) {
        await updateKelas(selectedClass.id, payload);
        await refreshClasses();
        Swal.fire({
          title: "Berhasil!",
          text: `Data kelas ${payload.nama_kelas} berhasil diperbarui.`,
          icon: "success",
          confirmButtonColor: "#33A1E0",
          confirmButtonText: "OK",
          background: "#ffffff",
          customClass: {
            popup: "rounded-[20px] shadow-2xl",
            title: "text-primary text-2xl font-semibold",
            confirmButton: "font-semibold px-6 py-3 rounded-[12px]",
          },
        });
      }
    } catch (error) {
      const message = extractErrorMessage(error, "Gagal menyimpan data kelas");
      Swal.fire({
        icon: "error",
        title: "Gagal menyimpan",
        text: message,
        confirmButtonColor: "#33A1E0",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ResponsiveLayout title="Kelola Kelas">
      <div className="mb-6 lg:mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-primary mb-2">
          Kelola Kelas
        </h1>
        <p className="text-gray-600 text-sm">
          Kelola master data kelas, sekolah, dan mata pelajaran dalam sistem
        </p>
      </div>

      {isLoading ? (
        <div className="rounded-2xl bg-white p-6 shadow-md">
          <p className="text-center text-gray-500">Memuat data kelas...</p>
        </div>
      ) : (
        <ClassManagementTable
          classes={classes}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onAdd={handleAdd}
          onDetail={handleDetail}
        />
      )}

      <ClassModal
        key={modalInstanceKey}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        classData={selectedClass}
        mode={modalMode}
        studentCount={selectedClass?.jumlahMurid ?? 0}
        isSaving={isSubmitting}
        isSuperAdmin={admin?.role === "superadmin"}
        adminSekolahId={admin?.sekolah_id}
      />

      <ClassDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        classData={selectedClass}
      />
    </ResponsiveLayout>
  );
}
