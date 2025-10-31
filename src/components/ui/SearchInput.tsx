"use client";

import { Search } from "@mui/icons-material";

interface SearchInputProps {
  placeholder: string;
  value?: string;
  onChange?: (value: string) => void;
}

export default function SearchInput({ placeholder, value, onChange }: SearchInputProps) {
  return (
    <div className="relative flex-1 max-w-md">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className="
          w-full pl-10 pr-4 py-2.5 rounded-lg
          bg-white border-none
          text-gray-700 placeholder-gray-400
          focus:outline-none focus:ring-2 focus:ring-white/30
          transition-all duration-200
        "
      />
    </div>
  );
}
