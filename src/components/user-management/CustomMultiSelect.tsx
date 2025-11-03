"use client";

import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { KeyboardArrowDown, Close, CheckCircle } from "@mui/icons-material";

interface Option {
  value: string;
  label: string;
}

interface CustomMultiSelectProps {
  value: string[];
  onChange: (value: string[]) => void;
  options: Option[];
  placeholder?: string;
  icon?: React.ReactNode;
  error?: string;
  disabled?: boolean;
}

export default function CustomMultiSelect({
  value,
  onChange,
  options,
  placeholder = "Pilih opsi",
  icon,
  error,
  disabled = false,
}: CustomMultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const handleSelect = (optionValue: string) => {
    const newValue = value.includes(optionValue)
      ? value.filter((v) => v !== optionValue)
      : [...value, optionValue];
    onChange(newValue);
  };

  const handleRemove = (optionValue: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(value.filter((v) => v !== optionValue));
  };

  const getSelectedLabels = () => {
    return options
      .filter((opt) => value.includes(opt.value))
      .map((opt) => opt.label);
  };

  const selectedLabels = getSelectedLabels();

  return (
    <div ref={containerRef} className="relative">
      <div
        onClick={handleToggle}
        className={`relative flex min-h-12 w-full cursor-pointer items-center rounded-xl border-2 px-4 py-2 text-gray-900 transition-all ${error
            ? "border-red-500"
            : isOpen
              ? "border-primary"
              : "border-gray-200 hover:border-gray-300"
          } ${disabled ? "cursor-not-allowed bg-gray-50 opacity-60" : "bg-white"}`}
      >
        {icon && (
          <div className="mr-3 shrink-0 text-primary">{icon}</div>
        )}

        <div className="flex flex-1 flex-wrap gap-2">
          {selectedLabels.length === 0 ? (
            <span className="text-gray-400">{placeholder}</span>
          ) : (
            selectedLabels.map((label, index) => {
              const optionValue = options.find((opt) => opt.label === label)?.value;
              return (
                <motion.div
                  key={optionValue ?? index}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  className="flex items-center gap-1 rounded-lg bg-primary/10 px-2 py-1 text-sm font-medium text-primary"
                >
                  <span>{label}</span>
                  {!disabled && (
                    <button
                      type="button"
                      onClick={(e) => handleRemove(optionValue!, e)}
                      className="rounded-full hover:bg-primary/20 transition p-0.5"
                    >
                      <Close sx={{ fontSize: 14 }} />
                    </button>
                  )}
                </motion.div>
              );
            })
          )}
        </div>

        <KeyboardArrowDown
          className={`ml-2 shrink-0 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""
            }`}
          sx={{ fontSize: 20 }}
        />
      </div>

      <AnimatePresence>
        {isOpen && options.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 mt-2 max-h-60 w-full overflow-y-auto rounded-xl border-2 border-gray-200 bg-white shadow-lg"
          >
            {options.map((option) => {
              const isSelected = value.includes(option.value);
              return (
                <div
                  key={option.value}
                  onClick={() => handleSelect(option.value)}
                  className={`flex cursor-pointer items-center justify-between px-4 py-3 transition-colors ${isSelected
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-gray-700 hover:bg-gray-50"
                    }`}
                >
                  <span>{option.label}</span>
                  {isSelected && (
                    <CheckCircle className="text-primary" sx={{ fontSize: 20 }} />
                  )}
                </div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
