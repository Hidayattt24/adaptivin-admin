"use client";

import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import UserManagementTable from "@/components/user-management/UserManagementTable";
import UserModal from "@/components/user-management/UserModal";
import Swal from "sweetalert2";

interface User {
  nisn: string;
  nama: string;
  tanggalLahir: string;
  alamat: string;
  kelas: string;
  paralel: string;
  sekolah: string;
  username: string;
  password: string;
  jenisKelamin: string;
  role: "Murid" | "Guru";
}

// Mock data untuk murid
const mockMuridData: User[] = [
  {
    nisn: "2208001",
    nama: "Hidayat Rahman",
    tanggalLahir: "2012-09-24",
    alamat: "Banda Aceh",
    kelas: "IV",
    paralel: "A",
    sekolah: "SDN 1 Banda Aceh",
    username: "hidayat.rahman",
    password: "hidayat123",
    jenisKelamin: "Laki-laki",
    role: "Murid",
  },
  {
    nisn: "2208002",
    nama: "Siti Nurhaliza",
    tanggalLahir: "2012-03-15",
    alamat: "Banda Aceh",
    kelas: "IV",
    paralel: "A",
    sekolah: "SDN 1 Banda Aceh",
    username: "siti.nurhaliza",
    password: "siti123",
    jenisKelamin: "Perempuan",
    role: "Murid",
  },
  {
    nisn: "2208004",
    nama: "Dewi Lestari",
    tanggalLahir: "2012-11-20",
    alamat: "Banda Aceh",
    kelas: "V",
    paralel: "B",
    sekolah: "SDN 2 Banda Aceh",
    username: "dewi.lestari",
    password: "dewi123",
    jenisKelamin: "Perempuan",
    role: "Murid",
  },
  {
    nisn: "2208005",
    nama: "Budi Santoso",
    tanggalLahir: "2013-01-05",
    alamat: "Banda Aceh",
    kelas: "III",
    paralel: "C",
    sekolah: "SDN 3 Banda Aceh",
    username: "budi.santoso",
    password: "budi123",
    jenisKelamin: "Laki-laki",
    role: "Murid",
  },
  {
    nisn: "2208006",
    nama: "Fatimah Zahra",
    tanggalLahir: "2012-08-12",
    alamat: "Banda Aceh",
    kelas: "IV",
    paralel: "B",
    sekolah: "SDN 1 Banda Aceh",
    username: "fatimah.zahra",
    password: "fatimah123",
    jenisKelamin: "Perempuan",
    role: "Murid",
  },
];

export default function AkunMuridPage() {
  const [users, setUsers] = useState<User[]>(mockMuridData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const handleAdd = () => {
    setModalMode("create");
    setSelectedUser(null);
    setIsModalOpen(true);
  };

  const handleEdit = (user: User) => {
    setModalMode("edit");
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleDelete = async (user: User) => {
    const result = await Swal.fire({
      title: "Hapus Akun Murid?",
      html: `Apakah Anda yakin ingin menghapus akun <b>${user.nama}</b>?<br/>Tindakan ini tidak dapat dibatalkan.`,
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
      setUsers(users.filter(u => u.nisn !== user.nisn));
      Swal.fire({
        title: "Berhasil!",
        text: `Akun ${user.nama} telah dihapus.`,
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

  const handleSave = (user: User) => {
    if (modalMode === "create") {
      setUsers([...users, user]);
      Swal.fire({
        title: "Berhasil!",
        text: `Akun ${user.nama} telah ditambahkan.`,
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
      setUsers(users.map(u => (u.nisn === user.nisn ? user : u)));
      Swal.fire({
        title: "Berhasil!",
        text: `Akun ${user.nama} telah diperbarui.`,
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
    <div className="min-h-screen bg-white">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="ml-[300px] p-8 bg-gradient-to-br from-gray-50 to-white min-h-screen">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#33A1E0] mb-2">
            Kelola Akun Murid
          </h1>
          <p className="text-gray-600 text-sm">
            Kelola dan pantau seluruh akun murid dalam sistem
          </p>
        </div>

        {/* Table */}
        <UserManagementTable
          title="Daftar Akun Murid"
          users={users}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onAdd={handleAdd}
        />
      </main>

      {/* Modal */}
      <UserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        user={selectedUser}
        mode={modalMode}
        role="Murid"
      />
    </div>
  );
}
