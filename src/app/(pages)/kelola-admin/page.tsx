"use client";

import { useState } from "react";
import ResponsiveLayout from "@/components/layout/ResponsiveLayout";
import { AdminManagementTable, AdminModal } from "@/components/admin-management";
import Swal from "sweetalert2";

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

// Mock data untuk admin
const mockAdminData: Admin[] = [
  {
    id: "1",
    nama: "Ahmad Fauzi",
    email: "ahmad.fauzi@adaptivin.com",
    telepon: "0812-3456-7890",
    sekolah: "SDN 1 Banda Aceh",
    alamatSekolah: "Jl. Pendidikan No. 123, Banda Aceh",
    jenisKelamin: "Laki-laki",
    username: "ahmad.fauzi",
    password: "admin123",
    tanggalDibuat: "2024-01-15"
  },
  {
    id: "2",
    nama: "Siti Maryam",
    email: "siti.maryam@adaptivin.com",
    telepon: "0813-4567-8901",
    sekolah: "SDN 2 Banda Aceh",
    alamatSekolah: "Jl. Merdeka No. 456, Banda Aceh",
    jenisKelamin: "Perempuan",
    username: "siti.maryam",
    password: "admin123",
    tanggalDibuat: "2024-02-20"
  },
  {
    id: "3",
    nama: "Budi Hartono",
    email: "budi.hartono@adaptivin.com",
    telepon: "0814-5678-9012",
    sekolah: "SDN 3 Banda Aceh",
    alamatSekolah: "Jl. Pahlawan No. 789, Banda Aceh",
    jenisKelamin: "Laki-laki",
    username: "budi.hartono",
    password: "admin123",
    tanggalDibuat: "2024-03-10"
  }
];

export default function KelolaAdminPage() {
  const [admins, setAdmins] = useState<Admin[]>(mockAdminData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);

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
      html: `Apakah Anda yakin ingin menghapus admin <b>${admin.nama}</b>?<br/>Tindakan ini tidak dapat dibatalkan.`,
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

    if (result.isConfirmed) {
      setAdmins(admins.filter(a => a.id !== admin.id));
      Swal.fire({
        title: "Berhasil!",
        text: `Admin ${admin.nama} telah dihapus.`,
        icon: "success",
        confirmButtonColor: "#33A1E0",
        confirmButtonText: "OK",
        background: "#ffffff",
        customClass: {
          popup: "rounded-[20px] shadow-2xl",
          title: "text-[#33A1E0] text-2xl font-semibold",
          confirmButton: "font-semibold px-6 py-3 rounded-[12px]",
        },
      });
    }
  };

  const handleSave = (admin: Admin) => {
    if (modalMode === "create") {
      const newAdmin = {
        ...admin,
        id: Date.now().toString(),
        tanggalDibuat: new Date().toISOString().split('T')[0]
      };
      setAdmins([...admins, newAdmin]);
      Swal.fire({
        title: "Berhasil!",
        text: `Admin ${admin.nama} telah ditambahkan.`,
        icon: "success",
        confirmButtonColor: "#33A1E0",
        confirmButtonText: "OK",
        background: "#ffffff",
        customClass: {
          popup: "rounded-[20px] shadow-2xl",
          title: "text-[#33A1E0] text-2xl font-semibold",
          confirmButton: "font-semibold px-6 py-3 rounded-[12px]",
        },
      });
    } else {
      setAdmins(admins.map(a => (a.id === admin.id ? admin : a)));
      Swal.fire({
        title: "Berhasil!",
        text: `Admin ${admin.nama} telah diperbarui.`,
        icon: "success",
        confirmButtonColor: "#33A1E0",
        confirmButtonText: "OK",
        background: "#ffffff",
        customClass: {
          popup: "rounded-[20px] shadow-2xl",
          title: "text-[#33A1E0] text-2xl font-semibold",
          confirmButton: "font-semibold px-6 py-3 rounded-[12px]",
        },
      });
    }
  };

  return (
    <ResponsiveLayout title="Kelola Admin">
      {/* Header Section */}
      <div className="mb-6 lg:mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-[#33A1E0] mb-2">
          Kelola Admin Sekolah
        </h1>
        <p className="text-gray-600 text-sm">
          Kelola dan pantau seluruh admin sekolah dalam sistem
        </p>
      </div>

      {/* Table */}
      <AdminManagementTable
        admins={admins}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onAdd={handleAdd}
      />

      {/* Modal */}
      <AdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        admin={selectedAdmin}
        mode={modalMode}
      />
    </ResponsiveLayout>
  );
}
