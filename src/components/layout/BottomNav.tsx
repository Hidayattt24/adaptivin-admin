"use client";

import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  DashboardOutlined,
  SchoolOutlined,
  GroupsOutlined,
  SettingsOutlined
} from "@mui/icons-material";

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    {
      label: "Dashboard",
      icon: DashboardOutlined,
      path: "/dashboard",
      color: "#33A1E0"
    },
    {
      label: "Admin",
      icon: SettingsOutlined,
      path: "/kelola-admin",
      color: "#ef4444"
    },
    {
      label: "Sekolah",
      icon: SchoolOutlined,
      path: "/kelola-sekolah",
      color: "#10b981"
    },
    {
      label: "Lainnya",
      icon: GroupsOutlined,
      path: "/kelola-kelas",
      color: "#f59e0b"
    }
  ];

  const isActive = (path: string) => {
    if (path === "/kelola-kelas") {
      return pathname.includes("/kelola-kelas") || 
             pathname.includes("/kelola-pengguna") ||
             pathname.includes("/pengaturan");
    }
    return pathname === path;
  };

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-2xl">
      <div className="grid grid-cols-4 h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <motion.button
              key={item.path}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push(item.path)}
              className="flex flex-col items-center justify-center gap-1 relative"
            >
              {/* Active Indicator */}
              {active && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 rounded-b-full"
                  style={{ backgroundColor: item.color }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}

              <Icon
                sx={{ fontSize: 24 }}
                className={active ? "text-[#33A1E0]" : "text-gray-400"}
              />
              <span
                className={`text-xs font-medium ${
                  active ? "text-[#33A1E0]" : "text-gray-400"
                }`}
              >
                {item.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
