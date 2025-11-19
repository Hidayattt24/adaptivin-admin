"use client";

import { useCallback, useEffect, useState } from "react";
import Swal from "sweetalert2";
import ResponsiveLayout from "@/components/layout/ResponsiveLayout";
import UserManagementTable from "@/components/user-management/UserManagementTable";
import UserModal, {
  type UserModalSubmission,
} from "@/components/user-management/UserModal";
import ImportModal from "@/components/user-management/ImportModal";
import UserDetailModal from "@/components/user-management/UserDetailModal";
import { useAuth } from "@/contexts/AuthContext";
import {
  createManagedUser,
  deleteManagedUser,
  getUsersByRole,
  updateManagedUser,
  resetUserPassword,
  type ManagedUser,
  type ManagedUserRole,
} from "@/lib/api/user";

const ROLE: ManagedUserRole = "guru";

export default function GuruPage() {
  const { admin } = useAuth();
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedUser, setSelectedUser] = useState<ManagedUser | null>(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [detailUser, setDetailUser] = useState<ManagedUser | null>(null);

  const loadUsers = useCallback(async () => {
    setIsLoading(true);
    setFetchError(null);
    try {
      const data = await getUsersByRole(ROLE);
      setUsers(data);
    } catch (error) {
      console.error("Failed to load managed users:", error);
      setFetchError("Gagal memuat data akun guru. Silakan coba lagi.");
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

  const handleResetPassword = async (user: ManagedUser) => {
    const result = await Swal.fire({
      title: "Reset Password?",
      html: `Password akun <b>${user.nama}</b> akan direset ke format default.<br/><br/><i>Format: nama[0] + 123<br/>Contoh: ${user.nama.split(' ')[0].toLowerCase()}123</i>`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#f59e0b",
      cancelButtonColor: "#94a3b8",
      confirmButtonText: "Ya, Reset",
      cancelButtonText: "Batal",
      background: "#ffffff",
      customClass: {
        popup: "rounded-[20px] shadow-2xl",
        title: "text-[#f59e0b] text-2xl font-semibold",
        htmlContainer: "text-gray-600 text-base font-medium",
        confirmButton: "font-semibold px-6 py-3 rounded-[12px]",
        cancelButton: "font-semibold px-6 py-3 rounded-[12px]",
      },
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      const { newPassword } = await resetUserPassword(user.id);
      await Swal.fire({
        title: "Password Berhasil Direset!",
        html: `Password baru untuk <b>${user.nama}</b>:<br/><br/><div style="background: #f3f4f6; padding: 12px; border-radius: 8px; font-size: 20px; font-weight: bold; color: #1f2937; letter-spacing: 2px;">${newPassword}</div><br/><small style="color: #6b7280;">Salin dan bagikan ke guru yang bersangkutan</small>`,
        icon: "success",
        confirmButtonColor: "#33A1E0",
        confirmButtonText: "OK, Saya Sudah Catat",
        background: "#ffffff",
        customClass: {
          popup: "rounded-[20px] shadow-2xl",
          title: "text-[#33A1E0] text-2xl font-semibold",
          confirmButton: "font-semibold px-6 py-3 rounded-[12px]",
        },
      });
    } catch (error) {
      console.error("Failed to reset password:", error);
      const errorMessage = error instanceof Error ? error.message : "Terjadi kesalahan saat mereset password.";
      await Swal.fire({
        title: "Gagal",
        text: errorMessage,
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

  const handleDelete = async (user: ManagedUser) => {
    const result = await Swal.fire({
      title: "Hapus Akun Guru?",
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
      const errorMessage = error instanceof Error ? error.message : "Terjadi kesalahan saat menghapus akun guru.";
      await Swal.fire({
        title: "Gagal",
        text: errorMessage,
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
    } catch (error: any) {
      console.error("Failed to submit managed user form:", error);

      // Extract error message dari axios error
      let errorMessage = submission.mode === "create"
        ? "Terjadi kesalahan saat menambahkan akun guru."
        : "Terjadi kesalahan saat memperbarui akun guru.";

      // Cek apakah ada response dari backend
      if (error?.response?.data) {
        const backendError = error.response.data;
        // Prioritas: error > message > details
        errorMessage = backendError.error || backendError.message || backendError.details || errorMessage;

        // Translate beberapa error message umum ke bahasa yang lebih user-friendly
        if (errorMessage.includes("email address has already been registered")) {
          errorMessage = "Email sudah terdaftar. Gunakan email lain atau cek data yang sudah ada.";
        } else if (errorMessage.includes("username") && errorMessage.includes("already")) {
          errorMessage = "Username sudah digunakan. Silakan gunakan username lain.";
        } else if (errorMessage.includes("NIP") && errorMessage.includes("already")) {
          errorMessage = "NIP sudah terdaftar. Gunakan NIP lain atau cek data yang sudah ada.";
        }
      } else if (error?.message) {
        errorMessage = error.message;
      }

      await Swal.fire({
        title: "Gagal",
        text: errorMessage,
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

  const handleImport = () => {
    setIsImportModalOpen(true);
  };

  const handleViewDetail = (user: ManagedUser) => {
    setDetailUser(user);
    setIsDetailModalOpen(true);
  };

  const handleExport = async () => {
    try {
      const token = localStorage.getItem("admin_token");
      const params = new URLSearchParams({ role: ROLE });

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/export?${params}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) throw new Error("Gagal export data");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `export_guru_${Date.now()}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      await Swal.fire({
        icon: "success",
        title: "Export Berhasil",
        text: "Data guru berhasil di-export ke Excel",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Error exporting:", error);
      await Swal.fire({
        icon: "error",
        title: "Gagal Export",
        text: "Terjadi kesalahan saat export data",
      });
    }
  };

  return (
    <ResponsiveLayout title="Kelola Akun Guru">
      <div className="mb-6 lg:mb-8">
        <h1 className="mb-2 text-2xl font-bold text-primary lg:text-3xl">
          Kelola Akun Guru
        </h1>
        <p className="text-sm text-gray-600">
          Kelola dan pantau seluruh akun guru dalam sistem
        </p>
      </div>

      {fetchError && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {fetchError}
        </div>
      )}

      {isLoading ? (
        <div className="rounded-xl border border-gray-200 bg-white p-6 text-center text-gray-500">
          Memuat data guru...
        </div>
      ) : (
        <UserManagementTable
          title="Daftar Akun Guru"
          role={ROLE}
          users={users}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onAdd={handleAdd}
          onResetPassword={handleResetPassword}
          onImport={handleImport}
          onExport={handleExport}
          onViewDetail={handleViewDetail}
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

      <ImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        role={ROLE}
        onSuccess={loadUsers}
        userRole={admin?.role === "superadmin" ? "superadmin" : "admin"}
        userSekolahId={admin?.sekolah_id}
      />

      <UserDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        user={detailUser}
        role={ROLE}
      />
    </ResponsiveLayout>
  );
}
