"use client";

import { motion } from "framer-motion";
import { SearchOff } from "@mui/icons-material";

interface EmptyStateProps {
  message?: string;
  description?: string;
}

export default function EmptyState({
  message = "Tidak ada data yang ditemukan",
  description = "Coba ubah kata kunci pencarian atau filter Anda"
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 20,
          delay: 0.1
        }}
        className="relative mb-6"
      >
        {/* Animated circles */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute inset-0 bg-primary/20 rounded-full blur-xl"
        />

        <motion.div
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="relative w-32 h-32 rounded-full bg-linear-to-br from-primary/10 to-primary-dark/10 flex items-center justify-center"
        >
          <motion.div
            animate={{
              y: [0, -10, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <SearchOff sx={{ fontSize: 60 }} className="text-primary/50" />
          </motion.div>
        </motion.div>

        {/* Floating particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: [0, 1, 0],
              opacity: [0, 1, 0],
              x: [0, Math.cos(i * 60 * Math.PI / 180) * 50],
              y: [0, Math.sin(i * 60 * Math.PI / 180) * 50],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.2,
              ease: "easeOut"
            }}
            className="absolute top-1/2 left-1/2 w-2 h-2 bg-primary rounded-full"
          />
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-center"
      >
        <motion.h3
          animate={{
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="text-xl font-bold text-gray-700 mb-2"
        >
          {message}
        </motion.h3>
        <p className="text-gray-500 text-sm max-w-md">
          {description}
        </p>
      </motion.div>

      {/* Animated lines */}
      <div className="mt-8 flex gap-2">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: [0, 1, 0] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.2,
              ease: "easeInOut"
            }}
            className="h-1 w-16 bg-linear-to-r from-primary to-primary-dark rounded-full"
          />
        ))}
      </div>
    </div>
  );
}
