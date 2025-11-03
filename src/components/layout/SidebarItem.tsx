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
            ? "bg-primary-dark border-2 border-white text-white shadow-lg"
            : "bg-white text-primary hover:bg-gray-50 hover:shadow-md"
        }
      `}
    >
      <div
        className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-all ${
          active ? "bg-white/30 group-hover:bg-white/40" : "bg-primary/15 group-hover:bg-primary/25"
        }`}
      >
        <span className={active ? "text-white" : "text-primary"}>
          {icon}
        </span>
      </div>
      <span className="text-[15px] font-medium leading-tight">
        {label}
      </span>
    </Link>
  );
}
