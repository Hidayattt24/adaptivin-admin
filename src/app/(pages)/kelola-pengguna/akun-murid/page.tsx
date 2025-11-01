"use client";

import { useCallback, useEffect, useState } from "react";
import Swal from "sweetalert2";
import ResponsiveLayout from "@/components/layout/ResponsiveLayout";
import UserManagementTable from "@/components/user-management/UserManagementTable";
import UserModal, {
  type UserModalSubmission,
} from "@/components/user-management/UserModal";
import {
  createManagedUser,
  deleteManagedUser,
  getUsersByRole,
  updateManagedUser,
  type ManagedUser,
  type ManagedUserRole,
} from "@/lib/api/user";

const ROLE: ManagedUserRole = "siswa";

export default function AkunMuridPage() {
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedUser, setSelectedUser] = useState<ManagedUser | null>(null);

  const loadUsers = useCallback(async () => {
    setIsLoading(true);
    setFetchError(null);
    try {
      const data = await getUsersByRole(ROLE);
      setUsers(data);
    } catch (error) {
      console.error("Failed to load managed users:", error);
      setFetchError("Gagal memuat data akun murid. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadUsers();
  }, [loadUsers]);

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const handleAdd = () => {
    setModalMode("create");
    setSelectedUser(null);
    setIsModalOpen(true);
  };

  const handleEdit = (user: ManagedUser) => {
    setModalMode("edit");
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleDelete = async (user: ManagedUser) => {
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

    if (!result.isConfirmed) {
      return;
    }

    try {
      await deleteManagedUser(user.id);
      setUsers((prev) => prev.filter((item) => item.id !== user.id));
      await Swal.fire({
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
    } catch (error) {
      console.error("Failed to delete managed user:", error);
      await Swal.fire({
        title: "Gagal",
        text: "Terjadi kesalahan saat menghapus akun murid.",
        icon: "error",
        confirmButtonColor: "#33A1E0",
        confirmButtonText: "OK",
        background: "#ffffff",
        customClass: {
          popup: "rounded-[20px] shadow-2xl",
          title: "text-[#ef4444] text-2xl font-semibold",
          confirmButton: "font-semibold px-6 py-3 rounded-[12px]",
        },
      });
    }
  };

  const handleModalSubmit = async (submission: UserModalSubmission) => {
    try {
      if (submission.mode === "create") {
        const created = await createManagedUser(submission.payload);
        setUsers((prev) => [created, ...prev]);
        await Swal.fire({
          title: "Berhasil!",
          text: `Akun ${created.nama} berhasil ditambahkan.`,
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
        const updated = await updateManagedUser(submission.id, submission.payload);
        setUsers((prev) =>
          prev.map((item) => (item.id === updated.id ? updated : item)),
        );
        await Swal.fire({
          title: "Berhasil!",
          text: `Akun ${updated.nama} berhasil diperbarui.`,
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
    } catch (error) {
      console.error("Failed to submit managed user form:", error);
      const message =
        submission.mode === "create"
          ? "Terjadi kesalahan saat menambahkan akun murid."
          : "Terjadi kesalahan saat memperbarui akun murid.";
      await Swal.fire({
        title: "Gagal",
        text: message,
        icon: "error",
        confirmButtonColor: "#33A1E0",
        confirmButtonText: "OK",
        background: "#ffffff",
        customClass: {
          popup: "rounded-[20px] shadow-2xl",
          title: "text-[#ef4444] text-2xl font-semibold",
          confirmButton: "font-semibold px-6 py-3 rounded-[12px]",
        },
      });
      throw error;
    }
  };

  return (
    <ResponsiveLayout title="Kelola Akun Murid">
      <div className="mb-6 lg:mb-8">
        <h1 className="mb-2 text-2xl font-bold text-primary lg:text-3xl">
          Kelola Akun Murid
        </h1>
        <p className="text-sm text-gray-600">
          Kelola dan pantau seluruh akun murid dalam sistem
        </p>
      </div>

      {fetchError && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {fetchError}
        </div>
      )}

      {isLoading ? (
        <div className="rounded-xl border border-gray-200 bg-white p-6 text-center text-gray-500">
          Memuat data murid...
        </div>
      ) : (
        <UserManagementTable
          title="Daftar Akun Murid"
          role={ROLE}
          users={users}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onAdd={handleAdd}
        />
      )}

      <UserModal
        isOpen={isModalOpen}
        onClose={closeModal}
        mode={modalMode}
        role={ROLE}
        user={selectedUser}
        onSubmit={handleModalSubmit}
      />
    </ResponsiveLayout>
  );
}
