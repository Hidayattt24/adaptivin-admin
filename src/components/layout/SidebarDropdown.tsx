"use client";

import Link from "next/link";
import { ReactNode } from "react";
import { ExpandMore } from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";

interface SidebarDropdownProps {
  icon: ReactNode;
  label: string;
  isOpen: boolean;
  onToggle: () => void;
  items: { label: string; href: string }[];
}

export default function SidebarDropdown({
  icon,
  label,
  isOpen,
  onToggle,
  items,
}: SidebarDropdownProps) {
  return (
    <div>
      {/* Dropdown Header */}
      <button
        onClick={onToggle}
        className="
          w-full flex items-center justify-between gap-3 px-4 py-2.5 rounded-lg
          text-white hover:bg-white/20
          transition-all duration-300 ease-in-out
        "
      >
        <div className="flex items-center gap-3">
          <span className="text-xl">{icon}</span>
          <span className="text-sm font-medium">{label}</span>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ExpandMore className="text-white" />
        </motion.div>
      </button>

      {/* Dropdown Items */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="ml-8 mt-1 space-y-1">
              {items.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  className="
                    block px-4 py-2 rounded-lg text-sm text-white
                    hover:bg-white/20 transition-all duration-200
                  "
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
