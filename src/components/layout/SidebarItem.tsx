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
        flex items-center gap-3 px-4 py-3 rounded-[10px] transition-all group
        ${
          active
            ? "bg-[#2288C3] border-2 border-white text-white shadow-lg"
            : "bg-white text-[#33A1E0] hover:bg-gray-50 hover:shadow-md"
        }
      `}
    >
      <div
        className={`w-[28px] h-[28px] rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
          active ? "bg-white/30 group-hover:bg-white/40" : "bg-[#33A1E0]/15 group-hover:bg-[#33A1E0]/25"
        }`}
      >
        <span className={active ? "text-white" : "text-[#33A1E0]"}>
          {icon}
        </span>
      </div>
      <span className="text-[15px] font-medium leading-tight">
        {label}
      </span>
    </Link>
  );
}
