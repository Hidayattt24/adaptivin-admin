"use client";

import { useState } from "react";
import { Email, Lock, Person, Visibility, VisibilityOff } from "@mui/icons-material";

interface AuthInputProps {
  label: string;
  type: "text" | "email" | "password";
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  icon?: "Email" | "Lock" | "Person";
  hasToggle?: boolean;
  required?: boolean;
  minLength?: number;
  id?: string;
  name?: string;
}

const iconMap = {
  Email: Email,
  Lock: Lock,
  Person: Person,
};

export default function AuthInput({
  label,
  type,
  value,
  onChange,
  placeholder,
  icon,
  hasToggle = false,
  required = false,
  minLength,
  id,
  name,
}: AuthInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const IconComponent = icon ? iconMap[icon] : null;
  const inputType = type === "password" && showPassword ? "text" : type;

  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-medium text-[#33A1E0]">
        {label}
      </label>
      <div className="relative">
        {IconComponent && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#33A1E0]/60">
            <IconComponent sx={{ fontSize: 20 }} />
          </div>
        )}
        <input
          id={id}
          name={name}
          type={inputType}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          minLength={minLength}
          className={`
            w-full py-3 px-4 bg-white border-2 border-[#33A1E0] rounded-full
            text-gray-700 placeholder-gray-400
            focus:outline-none focus:border-[#2288C3] focus:ring-2 focus:ring-[#33A1E0]/20
            transition-all duration-200
            ${IconComponent ? "pl-12" : ""}
            ${hasToggle ? "pr-12" : ""}
          `}
        />
        {hasToggle && type === "password" && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#33A1E0]/60 hover:text-[#33A1E0] transition-colors"
          >
            {showPassword ? (
              <VisibilityOff sx={{ fontSize: 20 }} />
            ) : (
              <Visibility sx={{ fontSize: 20 }} />
            )}
          </button>
        )}
      </div>
    </div>
  );
}
