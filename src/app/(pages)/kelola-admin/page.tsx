"use client";

import { useEffect, useState } from "react";
import ResponsiveLayout from "@/components/layout/ResponsiveLayout";
import { AdminManagementTable, AdminModal } from "@/components/admin-management";
import Swal from "sweetalert2";
import { createAdmin, getAllAdmins, updateAdmin, getAdminById,  deleteAdmin } from "@/lib/api/user";
import { getAllSekolah } from "@/lib/api/sekolah";

interface Admin {
  id: string;
  sekolah_id: string;
  nama_lengkap: string;
  email: string;
  password: string;
  alamat: string;
  jenisKelamin?: string;
}

interface Sekolah {
  id: string;
  nama_sekolah: string;
}

export default function KelolaAdminPage() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [sekolahList, setSekolahList] = useState<Sekolah[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);

  // Ambil daftar sekolah dari backend
  useEffect(() => {
    async function fetchSekolah() {
      try {
        const sekolahData = await getAllSekolah();
        setSekolahList(sekolahData);
      } catch (err) {
        console.error("Gagal ambil data sekolah:", err);
        Swal.fire("Gagal", "Tidak bisa memuat data sekolah", "error");
      }
    }
    fetchSekolah();
  }, []);

  const handleAdd = () => {
    setModalMode("create");
    setSelectedAdmin(null);
    setIsModalOpen(true);
  };

  const handleEdit = (admin: Admin) => {
    setModalMode("edit");
    setSelectedAdmin(admin);
    setIsModalOpen(true);
  };

  const handleDelete = async (admin: Admin) => {
    const result = await Swal.fire({
      title: "Hapus Admin Sekolah?",
      html: `Apakah Anda yakin ingin menghapus admin <b>${admin.nama_lengkap}</b>?<br/>Tindakan ini tidak dapat dibatalkan.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#94a3b8",
      confirmButtonText: "Ya, Hapus",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      try {
        await deleteAdmin(admin.id);
        setAdmins(admins.filter((a) => a.id !== admin.id));
        Swal.fire("Berhasil!", `${admin.nama_lengkap} telah dihapus.`, "success");
      } catch (err) {
        Swal.fire("Gagal", "Terjadi kesalahan saat menghapus admin", "error");
      }
    }
  };

  const handleSave = async (admin: Admin) => {
    try {
      if (modalMode === "create") {
        const newAdmin = await createAdmin(admin);
        setAdmins([...admins, newAdmin]);
        Swal.fire("Berhasil!", `Admin ${admin.nama_lengkap} telah ditambahkan.`, "success");
      } else {
        // kalau nanti kamu buat updateAdmin(), bisa dipakai di sini
        setAdmins(admins.map((a) => (a.id === admin.id ? admin : a)));
        Swal.fire("Berhasil!", `Admin ${admin.nama_lengkap} telah diperbarui.`, "success");
      }
    } catch (err) {
      console.error("Gagal menyimpan admin:", err);
      Swal.fire("Gagal", "Terjadi kesalahan saat menyimpan admin", "error");
    }
  };

  return (
    <ResponsiveLayout title="Kelola Admin">
      <div className="mb-6 lg:mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-[#33A1E0] mb-2">
          Kelola Admin Sekolah
        </h1>
        <p className="text-gray-600 text-sm">
          Kelola dan pantau seluruh admin sekolah dalam sistem
        </p>
      </div>

      <AdminManagementTable
        admins={admins}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onAdd={handleAdd}
      />

      <AdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        admin={selectedAdmin}
        mode={modalMode}
        sekolahList={sekolahList}
      />
    </ResponsiveLayout>
  );
}
