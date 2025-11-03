"use client";

import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Dashboard, People, Class, Settings, Logout, School, AdminPanelSettings } from "@mui/icons-material";
import SidebarItem from "./SidebarItem";
import SidebarDropdown from "./SidebarDropdown";
import Swal from "sweetalert2";
import { useAuth } from "@/contexts/AuthContext";

export default function Sidebar() {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const pathname = usePathname();
  const { admin, logout } = useAuth();

  // Check if user is superadmin
  const isSuperAdmin = admin?.role === "superadmin";

  const toggleDropdown = (name: string) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();

    const result = await Swal.fire({
      title: "Keluar dari Admin?",
      text: "Apakah Anda yakin ingin keluar?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#D32F2F",
      cancelButtonColor: "#94a3b8",
      confirmButtonText: "Ya, Keluar",
      cancelButtonText: "Batal",
      background: "#ffffff",
      customClass: {
        popup: "rounded-[20px] shadow-2xl",
        title: "text-[#33A1E0] text-2xl font-semibold",
        htmlContainer: "text-gray-600 text-base font-medium",
        confirmButton: "font-semibold px-6 py-3 rounded-[12px]",
        cancelButton: "font-semibold px-6 py-3 rounded-[12px]",
      },
    });

    if (result.isConfirmed) {
      logout(); // Use logout from AuthContext
    }
  };

  return (
    <aside
      className="hidden lg:fixed left-0 top-0 h-screen w-[300px] shadow-2xl z-40 overflow-y-auto scrollbar-hide rounded-r-[30px] lg:block"
      style={{
        background: 'linear-gradient(180deg, #33A1E0 0%, #ECF3F6 100%)'
      }}
    >
      {/* Logo Section */}
      <div className="flex items-center justify-center gap-2 px-6 py-8">
        <Image
          src="/logo/logo-with-name.svg"
          alt="Adaptivin Logo"
          width={140}
          height={48}
          priority
          className="brightness-0 invert"
        />
      </div>

      {/* DASHBOARD Section */}
      <div className="px-6 py-4">
        <h2 className="text-white text-xl font-bold mb-4 tracking-wide">
          DASHBOARD
        </h2>
        <div className="space-y-2">
          <SidebarItem
            icon={<Dashboard sx={{ fontSize: 20 }} />}
            label="Dashboard"
            href="/dashboard"
            active={pathname === "/dashboard"}
          />

          {/* Kelola Sekolah - Hanya untuk Superadmin */}
          {isSuperAdmin && (
            <SidebarItem
              icon={<School sx={{ fontSize: 20 }} />}
              label="Kelola Sekolah"
              href="/kelola-sekolah"
              active={pathname === "/kelola-sekolah"}
            />
          )}

          {/* Kelola Admin - Hanya untuk Superadmin */}
          {isSuperAdmin && (
            <SidebarItem
              icon={<AdminPanelSettings sx={{ fontSize: 20 }} />}
              label="Kelola Admin"
              href="/kelola-admin"
              active={pathname === "/kelola-admin"}
            />
          )}

          <SidebarItem
            icon={<Class sx={{ fontSize: 20 }} />}
            label="Kelola Kelas"
            href="/kelola-kelas"
            active={pathname === "/kelola-kelas"}
          />
          <SidebarDropdown
            icon={<People sx={{ fontSize: 20 }} />}
            label="Kelola Pengguna"
            isOpen={openDropdown === "pengguna"}
            onToggle={() => toggleDropdown("pengguna")}
            items={[
              { label: "Kelola Akun Murid", href: "/kelola-pengguna/akun-murid" },
              { label: "Kelola Akun Guru", href: "/kelola-pengguna/guru" },
            ]}
          />
        </div>
      </div>

      {/* PENGATURAN Section */}
      <div className="px-6 py-4">
        <h2 className="text-white text-xl font-bold mb-4 tracking-wide">
          PENGATURAN
        </h2>
        <div className="space-y-2">
          <SidebarItem
            icon={<Settings sx={{ fontSize: 20 }} />}
            label="Pengaturan"
            href="/pengaturan"
            active={pathname === "/pengaturan"}
          />
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-[10px] transition-all bg-red-500 text-white hover:bg-red-600 hover:shadow-md"
          >
            <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 bg-white/15">
              <Logout className="text-white" sx={{ fontSize: 16 }} />
            </div>
            <span className="text-[15px] font-medium leading-tight">
              Keluar
            </span>
          </button>
        </div>
      </div>
    </aside>
  );
}
