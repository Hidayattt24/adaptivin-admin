"use client";

import { useState } from "react";
import ResponsiveLayout from "@/components/layout/ResponsiveLayout";
import ProfileSettings from "@/components/pages/pengaturan/ProfileSettings";
import SecuritySettings from "@/components/pages/pengaturan/SecuritySettings";
import {
  PersonOutline,
  SecurityOutlined
} from "@mui/icons-material";
import { motion } from "framer-motion";

type SettingsTab = "profile" | "security";

export default function PengaturanPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");

  const tabs = [
    {
      id: "profile" as SettingsTab,
      label: "Profil Saya",
      icon: PersonOutline,
      description: "Kelola informasi profil Anda",
      color: "from-blue-500 to-blue-600"
    },
    {
      id: "security" as SettingsTab,
      label: "Keamanan",
      icon: SecurityOutlined,
      description: "Ubah password akun Anda",
      color: "from-red-500 to-red-600"
    }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return <ProfileSettings />;
      case "security":
        return <SecuritySettings />;
      default:
        return <ProfileSettings />;
    }
  };

  return (
    <ResponsiveLayout title="Pengaturan">
      {/* Header */}
      <div className="mb-6 lg:mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-[#33A1E0] mb-2">
          Pengaturan Akun
        </h1>
        <p className="text-gray-600 text-sm">
          Kelola profil dan keamanan akun Anda
        </p>
      </div>

      {/* Tab Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6 mb-6 lg:mb-8">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <motion.button
              key={tab.id}
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab(tab.id)}
              className={`relative overflow-hidden rounded-[20px] p-4 lg:p-6 transition-all ${isActive
                ? "shadow-2xl"
                : "shadow-lg hover:shadow-xl"
                }`}
            >
              {/* Background Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${isActive ? tab.color : "from-gray-100 to-gray-200"
                } transition-all`}></div>

              {/* Content */}
              <div className="relative z-10 flex items-center gap-3 lg:gap-4">
                <div className={`w-12 h-12 lg:w-16 lg:h-16 rounded-[15px] flex items-center justify-center ${isActive ? "bg-white/20" : "bg-white"
                  } transition-all`}>
                  <Icon
                    className={isActive ? "text-white" : "text-gray-600"}
                    sx={{ fontSize: { xs: 24, lg: 32 } }}
                  />
                </div>
                <div className="text-left flex-1">
                  <h3 className={`text-lg lg:text-xl font-bold mb-1 ${isActive ? "text-white" : "text-gray-800"
                    }`}>
                    {tab.label}
                  </h3>
                  <p className={`text-xs lg:text-sm ${isActive ? "text-white/90" : "text-gray-600"
                    }`}>
                    {tab.description}
                  </p>
                </div>

                {/* Active Indicator */}
                {isActive && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-3 h-3 bg-white rounded-full"
                  />
                )}
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Content Area */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {renderContent()}
      </motion.div>
    </ResponsiveLayout>
  );
}
