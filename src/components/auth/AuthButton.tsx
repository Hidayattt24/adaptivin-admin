"use client";

import { motion } from "framer-motion";

interface AuthButtonProps {
  label: string;
  onClick?: () => void;
  type?: "button" | "submit";
  primary?: boolean;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
}

export default function AuthButton({
  label,
  onClick,
  type = "submit",
  primary = true,
  loading = false,
  disabled = false,
  fullWidth = true,
}: AuthButtonProps) {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      whileHover={{ scale: primary ? 1.02 : 1 }}
      whileTap={{ scale: 0.98 }}
      className={`
        ${fullWidth ? "w-full" : ""}
        py-3 px-6 rounded-xl font-semibold uppercase text-sm
        transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        ${
          primary
            ? "bg-linear-to-r from-primary to-primary-dark text-white shadow-md hover:shadow-lg"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        }
      `}
    >
      {loading ? (
        <div className="flex items-center justify-center gap-2">
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          <span>Loading...</span>
        </div>
      ) : (
        label
      )}
    </motion.button>
  );
}
