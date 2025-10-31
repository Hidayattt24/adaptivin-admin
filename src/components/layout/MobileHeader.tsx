"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  PersonOutline
} from "@mui/icons-material";
import { useRouter } from "next/navigation";

export default function MobileHeader({ title }: { title: string }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  return (
    <>
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-gradient-to-r from-[#33A1E0] to-[#2288C3] shadow-lg">
        <div className="flex items-center justify-between px-4 py-4">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-[12px] flex items-center justify-center shadow-md">
              <span className="text-[#33A1E0] font-bold text-lg">A</span>
            </div>
            <div>
              <h1 className="text-white font-bold text-lg leading-tight">{title}</h1>
              <p className="text-white/80 text-xs">Adaptivin Admin</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => router.push("/pengaturan")}
              className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center"
            >
              <PersonOutline className="text-white" sx={{ fontSize: 20 }} />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Spacer for fixed header */}
      <div className="lg:hidden h-[72px]" />
    </>
  );
}
