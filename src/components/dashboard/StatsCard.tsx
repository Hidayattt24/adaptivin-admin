"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface StatsCardProps {
  title: string;
  subtitle: string;
  value: number;
  icon: ReactNode;
}

export default function StatsCard({ title, subtitle, value, icon }: StatsCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.03, y: -5 }}
      transition={{ duration: 0.3 }}
      className="rounded-[10px] p-6 shadow-lg"
      style={{
        background: 'linear-gradient(180deg, #33A1E0 0%, #7AB4D5 100%)'
      }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-white text-xs font-semibold mb-1 opacity-90 uppercase tracking-wide">
            {title}
          </p>
          <div className="flex items-center gap-4 mt-4">
            <div className="w-14 h-14 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center text-white shadow-md">
              {icon}
            </div>
            <div>
              <p className="text-white text-sm font-medium opacity-90">{subtitle}</p>
              <p className="text-white text-4xl font-bold mt-1">{value}</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
