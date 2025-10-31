"use client";

import Link from "next/link";
import { ReactNode } from "react";

interface SidebarItemProps {
  icon: ReactNode;
  label: string;
  href: string;
  active?: boolean;
}

export default function SidebarItem({ icon, label, href, active = false }: SidebarItemProps) {
  return (
    <Link
      href={href}
      className={`
        flex items-center gap-3 px-4 py-3 rounded-[10px] transition-all
        ${
          active
            ? "bg-[#2288C3] border-2 border-white text-white"
            : "bg-white text-[#33A1E0] hover:bg-gray-50"
        }
      `}
    >
      <div
        className={`w-[28px] h-[28px] rounded-full flex items-center justify-center flex-shrink-0 ${
          active ? "bg-white/30" : "bg-[#33A1E0]/15"
        }`}
      >
        <span className={active ? "text-white" : "text-[#33A1E0]"}>
          {icon}
        </span>
      </div>
      <span className="text-[15px] font-medium leading-tight">{label}</span>
    </Link>
  );
}
