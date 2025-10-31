"use client";

import ResponsiveLayout from "@/components/layout/ResponsiveLayout";
import StatsCard from "@/components/dashboard/StatsCard";
import UserTable from "@/components/dashboard/UserTable";
import ClassTable from "@/components/dashboard/ClassTable";
import { People, Person, School, Class } from "@mui/icons-material";

export default function DashboardPage() {
  return (
    <ResponsiveLayout title="Dashboard">
      {/* Greeting Section */}
      <div className="mb-6 lg:mb-8">
        <h1 className="text-2xl lg:text-3xl font-semibold text-[#33A1E0] mb-2">
          Hello Admin,
        </h1>
        <p className="text-gray-600 text-sm">Let's check your asset</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-6 lg:mb-8">
        <StatsCard
          title="Total Pengguna"
          subtitle="User"
          value={50}
          icon={<People sx={{ fontSize: 28 }} />}
        />
        <StatsCard
          title="Total Pengguna"
          subtitle="Guru"
          value={10}
          icon={<Person sx={{ fontSize: 28 }} />}
        />
        <StatsCard
          title="Total Pengguna"
          subtitle="Murid"
          value={40}
          icon={<School sx={{ fontSize: 28 }} />}
        />
        <StatsCard
          title="Total Kelas"
          subtitle="Kelas"
          value={5}
          icon={<Class sx={{ fontSize: 28 }} />}
        />
      </div>

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
