"use client";

import { useState, useEffect, useCallback } from "react";
import ResponsiveLayout from "@/components/layout/ResponsiveLayout";
import ClassManagementTable from "@/components/class-management/ClassManagementTable";
import ClassModal from "@/components/class-management/ClassModal";
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

  const mapKelasResponse = useCallback(
    (kelas: KelasResponse, sekolahMap: Record<string, string>): ClassData => ({
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
      const mapped = kelasList.map((kelas) => mapKelasResponse(kelas, sekolahMap));
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

  const handleDelete = async (classData: ClassData) => {
    if (isSubmitting) return;

    const result = await Swal.fire({
      title: "Hapus Data Kelas?",
      html: `Apakah Anda yakin ingin menghapus data kelas <b>${classData.kelas} ${classData.paralel} - ${classData.sekolah}</b>?<br/>Tindakan ini tidak dapat dibatalkan.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#94a3b8",
      confirmButtonText: "Ya, Hapus",
      cancelButtonText: "Batal",
      background: "#ffffff",
      customClass: {
        popup: "rounded-[20px] shadow-2xl",
        title: "text-[#ef4444] text-2xl font-semibold",
        htmlContainer: "text-gray-600 text-base font-medium",
        confirmButton: "font-semibold px-6 py-3 rounded-[12px]",
        cancelButton: "font-semibold px-6 py-3 rounded-[12px]",
      },
    });

    if (!result.isConfirmed) return;

    try {
      setIsSubmitting(true);
      await deleteKelas(classData.id);
      await refreshClasses();
      Swal.fire({
        title: "Berhasil!",
        text: `Data kelas ${classData.kelas} ${classData.paralel} berhasil dihapus.`,
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
    } catch (error) {
      const message = extractErrorMessage(error, "Gagal menghapus data kelas");
      Swal.fire({
        icon: "error",
        title: "Gagal menghapus",
        text: message,
        confirmButtonColor: "#33A1E0",
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

    if (!payload.nama_kelas || !payload.tingkat_kelas) {
      Swal.fire({
        icon: "warning",
        title: "Data belum lengkap",
        text: "Pastikan tingkat kelas dan paralel terisi dengan benar.",
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
      />
    </ResponsiveLayout>
  );
}
