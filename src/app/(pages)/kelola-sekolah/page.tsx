"use client";

import { useState, useEffect } from "react";
import ResponsiveLayout from "@/components/layout/ResponsiveLayout";
import SchoolManagementTable from "@/components/school-management/SchoolManagementTable";
import SchoolModal from "@/components/school-management/SchoolModal";
import SchoolDetailModal from "@/components/school-management/SchoolDetailModal";
import Swal from "sweetalert2";
import {
  getAllSekolah,
  createSekolah,
  updateSekolah,
  deleteSekolah,
} from "@/lib/api/sekolah";
import { useAuth } from "@/contexts/AuthContext";

interface Sekolah {
  id: string;
  nama_sekolah: string;
  alamat_sekolah: string;
}

export default function KelolaSekolahPage() {
  const { admin } = useAuth();
  const [schools, setSchools] = useState<Sekolah[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedSchool, setSelectedSchool] = useState<Sekolah | null>(null);

  useEffect(() => {
    const fetchSekolah = async () => {
      // ✅ Hanya fetch jika user sudah login
      if (!admin) return;

      try {
        const data = await getAllSekolah();
        setSchools(data);
      } catch (error) {
        console.error("Error fetching sekolah:", error);
      }
    };
    fetchSekolah();
  }, [admin]);

  const handleAdd = () => {
    setModalMode("create");
    setSelectedSchool(null);
    setIsModalOpen(true);
  };

  const handleEdit = (sekolah: Sekolah) => {
    setModalMode("edit");
    setSelectedSchool(sekolah);
    setIsModalOpen(true);
  };

  const handleDetail = (sekolah: Sekolah) => {
    setSelectedSchool(sekolah);
    setIsDetailModalOpen(true);
  };

  const handleDelete = async (school: Sekolah) => {
    const result = await Swal.fire({
      title: "Hapus Sekolah?",
      html: `
        <div class="text-left">
          <p class="mb-3">Apakah Anda yakin ingin menghapus sekolah <b>${school.nama_sekolah}</b>?</p>
          <div class="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
            <p class="text-sm text-yellow-800 mb-2"><b>⚠️ Perhatian:</b></p>
            <ul class="text-sm text-yellow-700 list-disc list-inside space-y-1">
              <li>Guru dan siswa di sekolah ini akan kehilangan afiliasi sekolah</li>
              <li>Kelas di sekolah ini akan kehilangan afiliasi sekolah</li>
              <li>Data guru, siswa, dan kelas <b>tidak</b> akan dihapus</li>
              <li>Tindakan ini tidak dapat dibatalkan</li>
            </ul>
          </div>
        </div>
      `,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#94a3b8",
      confirmButtonText: "Ya, Hapus Sekolah",
      cancelButtonText: "Batal",
      customClass: {
        popup: "rounded-[20px] shadow-2xl",
        title: "text-[#ef4444] text-2xl font-semibold",
        htmlContainer: "text-gray-600",
        confirmButton: "font-semibold px-6 py-3 rounded-[12px]",
        cancelButton: "font-semibold px-6 py-3 rounded-[12px]",
      },
    });

    if (result.isConfirmed) {
      try {
        const response = await deleteSekolah(school.id);
        setSchools(schools.filter((s) => s.id !== school.id));
        
        // Show detailed success message
        const affected = response?.affected || {};
        await Swal.fire({
          title: "Berhasil!",
          html: `
            <div class="text-left">
              <p class="mb-3">Sekolah <b>${school.nama_sekolah}</b> telah dihapus.</p>
              ${affected.guru || affected.siswa || affected.kelas ? `
                <div class="bg-blue-50 p-3 rounded-lg border border-blue-200">
                  <p class="text-sm text-blue-800 mb-2"><b>📊 Data yang terpengaruh:</b></p>
                  <ul class="text-sm text-blue-700 list-disc list-inside space-y-1">
                    ${affected.guru ? `<li>${affected.guru} Guru dilepaskan dari sekolah</li>` : ''}
                    ${affected.siswa ? `<li>${affected.siswa} Siswa dilepaskan dari sekolah</li>` : ''}
                    ${affected.kelas ? `<li>${affected.kelas} Kelas dilepaskan dari sekolah</li>` : ''}
                  </ul>
                </div>
              ` : ''}
            </div>
          `,
          icon: "success",
          confirmButtonColor: "#33A1E0",
          confirmButtonText: "OK",
          customClass: {
            popup: "rounded-[20px] shadow-2xl",
            title: "text-[#33A1E0] text-2xl font-semibold",
            htmlContainer: "text-gray-600",
            confirmButton: "font-semibold px-6 py-3 rounded-[12px]",
          },
        });
      } catch (err: any) {
        const errorMessage = err?.response?.data?.error || err?.message || "Terjadi kesalahan saat menghapus sekolah";
        await Swal.fire({
          title: "Gagal",
          text: errorMessage,
          icon: "error",
          confirmButtonColor: "#33A1E0",
          confirmButtonText: "OK",
          customClass: {
            popup: "rounded-[20px] shadow-2xl",
            title: "text-[#ef4444] text-2xl font-semibold",
            confirmButton: "font-semibold px-6 py-3 rounded-[12px]",
          },
        });
      }
    }
  };

  const handleSave = async (sekolah: Sekolah) => {
    try {
      if (modalMode === "create") {
        const newSekolah = await createSekolah(sekolah);
        setSchools([...schools, newSekolah]);
        Swal.fire("Berhasil!", `${sekolah.nama_sekolah} telah ditambahkan.`, "success");
      } else {
        const updated = await updateSekolah(sekolah.id, sekolah);
        setSchools(schools.map((s) => (s.id === sekolah.id ? updated : s)));
        Swal.fire("Berhasil!", `${sekolah.nama_sekolah} telah diperbarui.`, "success");
      }
    } catch (error) {
      Swal.fire("Gagal", "Terjadi kesalahan saat menyimpan data", "error");
    }
  };

  return (
    <ResponsiveLayout title="Kelola Sekolah">
      <div className="mb-6 lg:mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-primary mb-2">
          Kelola Sekolah
        </h1>
        <p className="text-gray-600 text-sm">
          Hanya superadmin yang dapat menambah atau menghapus sekolah.
        </p>
      </div>

      <SchoolManagementTable
        sekolah={schools.map((s) => ({
          id: s.id,
          nama_sekolah: s.nama_sekolah ?? "",
          alamat_sekolah: s.alamat_sekolah ?? "",
        }))}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onAdd={handleAdd}
        onDetail={handleDetail}
      />

      <SchoolModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        sekolah={selectedSchool}
        mode={modalMode}
      />

      <SchoolDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        sekolah={selectedSchool}
      />
    </ResponsiveLayout>
  );
}
