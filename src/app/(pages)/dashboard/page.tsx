"use client";

import { useEffect, useState } from "react";
import ResponsiveLayout from "@/components/layout/ResponsiveLayout";
import StatsCard from "@/components/dashboard/StatsCard";
import UserTable from "@/components/dashboard/UserTable";
import ClassTable from "@/components/dashboard/ClassTable";
import { People, Person, School, Class } from "@mui/icons-material";
import { useAuth } from "@/contexts/AuthContext";
import { getAllUsers } from "@/lib/api/user";
import { getAllKelas } from "@/lib/api/kelas";
import { getAllSekolah } from "@/lib/api/sekolah";
import { getAllAdmins } from "@/lib/api/user";

export default function DashboardPage() {
  const { admin } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalGuru: 0,
    totalMurid: 0,
    totalKelas: 0,
    totalSekolah: 0,
    totalAdmin: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (!admin) return;

      try {
        setIsLoading(true);

        // Fetch users data
        const allUsers = await getAllUsers();

        const guruCount = allUsers.filter((u) => u.role === "guru").length;
        const muridCount = allUsers.filter((u) => u.role === "siswa").length;

        // Fetch kelas data
        const kelasData = await getAllKelas();
        const kelasCount = kelasData?.length || 0;

        // Fetch sekolah data (only for superadmin)
        let sekolahCount = 0;
        if (admin.role === "superadmin") {
          const sekolahData = await getAllSekolah();
          sekolahCount = sekolahData?.length || 0;
        }

        // Fetch admin data (only for superadmin)
        let adminCount = 0;
        if (admin.role === "superadmin") {
          const adminData = await getAllAdmins();
          adminCount = adminData?.length || 0;
        }

        setStats({
          totalUsers: guruCount + muridCount,
          totalGuru: guruCount,
          totalMurid: muridCount,
          totalKelas: kelasCount,
          totalSekolah: sekolahCount,
          totalAdmin: adminCount,
        });
      } catch (error) {
        console.error("Gagal memuat statistik:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [admin]);

  const isSuperAdmin = admin?.role === "superadmin";

  return (
    <ResponsiveLayout title="Dashboard">
      {/* Greeting Section */}
      <div className="mb-6 lg:mb-8">
        <h1 className="text-2xl lg:text-3xl font-semibold text-primary mb-2">
          Hello {admin?.nama_lengkap || "Admin"},
        </h1>
        <p className="text-gray-600 text-sm">Let&#39;s check your asset</p>
      </div>

      {/* Stats Cards */}
      {isLoading ? (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 lg:gap-4 mb-6 lg:mb-8">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="rounded-[10px] p-6 shadow-lg bg-linear-to-b from-gray-200 to-gray-300 animate-pulse h-32"
            />
          ))}
        </div>
      ) : (
        <div className={`grid grid-cols-2 ${isSuperAdmin ? "lg:grid-cols-5" : "lg:grid-cols-3"} gap-3 lg:gap-4 mb-6 lg:mb-8`}>
          {isSuperAdmin && (
            <StatsCard
              title="Total Admin"
              subtitle="Admin"
              value={stats.totalAdmin}
              icon={<People sx={{ fontSize: 28 }} />}
            />
          )}
          {isSuperAdmin && (
            <StatsCard
              title="Total Sekolah"
              subtitle="Sekolah"
              value={stats.totalSekolah}
              icon={<School sx={{ fontSize: 28 }} />}
            />
          )}
          <StatsCard
            title="Total Kelas"
            subtitle="Kelas"
            value={stats.totalKelas}
            icon={<Class sx={{ fontSize: 28 }} />}
          />
          <StatsCard
            title="Total Guru"
            subtitle="Guru"
            value={stats.totalGuru}
            icon={<Person sx={{ fontSize: 28 }} />}
          />
          <StatsCard
            title="Total Murid"
            subtitle="Murid"
            value={stats.totalMurid}
            icon={<People sx={{ fontSize: 28 }} />}
          />
        </div>
      )}

      {/* User Table */}
      <div className="mb-6 lg:mb-8">
        <UserTable />
      </div>

      {/* Class Table */}
      <div>
        <ClassTable />
      </div>
    </ResponsiveLayout>
  );
}
