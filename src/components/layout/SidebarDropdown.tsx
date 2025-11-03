"use client";

import Link from "next/link";
import { ReactNode } from "react";
import { ExpandMore } from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

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
  const pathname = usePathname();

  // Check if any child item is active
  const isAnyChildActive = items.some(item => pathname === item.href);
  const isActive = isOpen || isAnyChildActive;

  return (
    <div>
      {/* Dropdown Header */}
      <button
        onClick={onToggle}
        className={`
          w-full flex items-center justify-between gap-3 px-4 py-3 rounded-[10px]
          transition-all duration-300 ease-in-out group
          ${
            isActive
              ? "bg-primary-dark border-2 border-white text-white shadow-lg"
              : "bg-white text-primary hover:bg-gray-50 hover:shadow-md"
          }
        `}
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-all ${
              isActive ? "bg-white/30 group-hover:bg-white/40" : "bg-primary/15 group-hover:bg-primary/25"
            }`}
          >
            <span className={isActive ? "text-white" : "text-primary"}>
              {icon}
            </span>
          </div>
          <span className="text-[15px] font-medium leading-tight">
            {label}
          </span>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ExpandMore className={isActive ? "text-white" : "text-primary"} />
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
            <div className="ml-4 mt-2 space-y-2">
              {items.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  className={`
                    flex items-center gap-3 px-4 py-2.5 rounded-[10px] transition-all group
                    ${
                      pathname === item.href
                        ? "bg-[#1E7AAF] text-white font-medium shadow-md"
                        : "bg-white/60 text-primary hover:bg-white hover:shadow-sm"
                    }
                  `}
                >
                  <span className="text-[14px] leading-tight">{item.label}</span>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
