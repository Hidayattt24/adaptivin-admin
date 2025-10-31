"use client";

import Sidebar from "@/components/layout/Sidebar";
import StatsCard from "@/components/dashboard/StatsCard";
import UserTable from "@/components/dashboard/UserTable";
import ClassTable from "@/components/dashboard/ClassTable";
import { People, Person, School, Class } from "@mui/icons-material";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="ml-[300px] p-8 bg-gradient-to-br from-gray-50 to-white min-h-screen">
        {/* Greeting Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-[#33A1E0] mb-2">
            Hello Admin,
          </h1>
          <p className="text-gray-600 text-sm">Let's check your asset</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
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
        <div className="mb-8">
          <UserTable />
        </div>

        {/* Class Table */}
        <div>
          <ClassTable />
        </div>
      </main>
    </div>
  );
}
