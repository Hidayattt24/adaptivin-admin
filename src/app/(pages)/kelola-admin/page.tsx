"use client";

import { useEffect, useState } from "react";
import ResponsiveLayout from "@/components/layout/ResponsiveLayout";
import { AdminManagementTable, AdminModal } from "@/components/admin-management";
import Swal from "sweetalert2";
import {
  createAdmin,
  getAllAdmins,
  updateAdmin,
  getAdminById,
  deleteAdmin,
  type AdminData,
  type AdminPayload,
} from "@/lib/api/user";

export default function KelolaAdminPage() {
  const [admins, setAdmins] = useState<AdminData[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedAdmin, setSelectedAdmin] = useState<AdminData | null>(null);

  useEffect(() => {
    async function fetchAdmins() {
      try {
        const adminData = await getAllAdmins();
        setAdmins(adminData);
      } catch (err) {
        console.error("Gagal ambil data admin:", err);
        Swal.fire("Gagal", "Tidak bisa memuat data admin", "error");
      }
    }

    fetchAdmins();
  }, []);

  const handleAdd = () => {
    setModalMode("create");
    setSelectedAdmin(null);
    setIsModalOpen(true);
  };

  const handleEdit = async (admin: AdminData) => {
    setModalMode("edit");
    try {
      const latestAdmin = await getAdminById(admin.id);
      setSelectedAdmin(latestAdmin);
    } catch (err) {
      console.error("Gagal memuat detail admin:", err);
      setSelectedAdmin(admin);
      Swal.fire(
        "Perhatian",
        "Data terbaru admin tidak bisa dimuat, gunakan data yang ada.",
        "warning"
      );
    } finally {
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedAdmin(null);
  };

  const handleDelete = async (admin: AdminData) => {
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
        setAdmins((prev) => prev.filter((a) => a.id !== admin.id));
        Swal.fire(
          "Berhasil!",
          `${admin.nama_lengkap} telah dihapus.`,
          "success"
        );
      } catch (error) {
        console.error("Gagal menghapus admin:", error);
        Swal.fire("Gagal", "Terjadi kesalahan saat menghapus admin", "error");
      }
    }
  };

  const handleSave = async (admin: AdminPayload) => {
    try {
      if (modalMode === "create") {
        if (!admin.password) {
          throw new Error("Password wajib diisi");
        }

        const newAdmin = await createAdmin({
          ...admin,
          password: admin.password.trim(),
          nama_lengkap: admin.nama_lengkap.trim(),
          email: admin.email.trim(),
        });
        setAdmins((prev) => [...prev, newAdmin]);
        Swal.fire(
          "Berhasil!",
          `Admin ${admin.nama_lengkap} telah ditambahkan.`,
          "success"
        );
      } else if (selectedAdmin) {
        const { password, ...rest } = admin;
        const updatePayload: Partial<AdminPayload> = {
          ...rest,
        };

        if (password && password.trim().length > 0) {
          updatePayload.password = password.trim();
        }

        const updatedAdmin = await updateAdmin(selectedAdmin.id, {
          ...updatePayload,
          nama_lengkap: updatePayload.nama_lengkap?.trim(),
          email: updatePayload.email?.trim(),
        });

        setAdmins((prev) =>
          prev.map((a) => (a.id === updatedAdmin.id ? updatedAdmin : a))
        );
        Swal.fire(
          "Berhasil!",
          `Admin ${admin.nama_lengkap} telah diperbarui.`,
          "success"
        );
      }
      setSelectedAdmin(null);
    } catch (err) {
      console.error("Gagal menyimpan admin:", err);
      Swal.fire("Gagal", "Terjadi kesalahan saat menyimpan admin", "error");
      throw err;
    }
  };

  return (
    <ResponsiveLayout title="Kelola Admin">
      <div className="mb-6 lg:mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-primary mb-2">
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

      {isModalOpen && (
        <AdminModal
          key={`${modalMode}-${selectedAdmin?.id ?? "new"}`}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleSave}
          admin={selectedAdmin}
          mode={modalMode}
        />
      )}
    </ResponsiveLayout>
  );
}
