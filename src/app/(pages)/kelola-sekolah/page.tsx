"use client";

import { useState, useEffect } from "react";
import ResponsiveLayout from "@/components/layout/ResponsiveLayout";
import SchoolManagementTable from "@/components/school-management/SchoolManagementTable";
import SchoolModal from "@/components/school-management/SchoolModal";
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

  const handleDelete = async (school: Sekolah) => {
    const result = await Swal.fire({
      title: "Yakin hapus sekolah?",
      text: `Sekolah ${school.nama_sekolah} akan dihapus permanen.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      try {
        await deleteSekolah(school.id);
        setSchools(schools.filter((s) => s.id !== school.id));
        Swal.fire("Berhasil!", `${school.nama_sekolah} telah dihapus.`, "success");
      } catch (err) {
        Swal.fire("Gagal", "Terjadi kesalahan saat menghapus sekolah", "error");
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
      />

      <SchoolModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        sekolah={selectedSchool}
        mode={modalMode}
      />
    </ResponsiveLayout>
  );
}
