"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  InfoOutlined,
  CloseOutlined,
  ComputerOutlined
} from "@mui/icons-material";

export default function MobileWarning() {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Check if warning has been shown in this session
    const shownInSession = sessionStorage.getItem("mobileWarningShown");
    // Check if user has permanently dismissed the warning
    const permanentlyDismissed = localStorage.getItem("mobileWarningDismissed");
    
    // Only show if not shown in this session AND not permanently dismissed
    if (!shownInSession && !permanentlyDismissed) {
      // Mark as shown in this session
      sessionStorage.setItem("mobileWarningShown", "true");
      
      // Show warning after a short delay
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1000);

      return () => clearTimeout(timer);
    } else {
      setIsDismissed(true);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
    // Save to localStorage for permanent dismissal
    localStorage.setItem("mobileWarningDismissed", "true");
  };

  const handleDismissTemporary = () => {
    setIsVisible(false);
    setIsDismissed(true);
    // Already marked in sessionStorage, so won't show again this session
  };

  if (isDismissed) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-[60]"
            onClick={handleDismissTemporary}
          />

          {/* Warning Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="lg:hidden fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[70] w-[90%] max-w-md"
          >
            <div className="bg-white rounded-[25px] shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-[#33A1E0] to-[#2288C3] p-6 relative">
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={handleDismissTemporary}
                  className="absolute top-4 right-4 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center"
                >
                  <CloseOutlined className="text-white" sx={{ fontSize: 18 }} />
                </motion.button>

                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <InfoOutlined className="text-white" sx={{ fontSize: 28 }} />
                  </div>
                  <h3 className="text-xl font-bold text-white">Informasi</h3>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-16 h-16 bg-blue-50 rounded-[15px] flex items-center justify-center flex-shrink-0">
                    <ComputerOutlined className="text-[#33A1E0]" sx={{ fontSize: 32 }} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 mb-2">
                      Pengalaman Lebih Baik di Desktop
                    </h4>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Untuk pengalaman terbaik dan akses ke semua fitur, kami merekomendasikan menggunakan 
                      <span className="font-semibold text-[#33A1E0]"> laptop atau PC</span>.
                    </p>
                  </div>
                </div>

                {/* Features List */}
                <div className="bg-blue-50 rounded-[15px] p-4 mb-6">
                  <p className="text-xs font-semibold text-gray-700 mb-3">Keuntungan menggunakan Desktop:</p>
                  <ul className="space-y-2 text-xs text-gray-600">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-[#33A1E0] rounded-full"></span>
                      Tampilan lebih luas dan nyaman
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-[#33A1E0] rounded-full"></span>
                      Akses lebih cepat ke semua menu
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-[#33A1E0] rounded-full"></span>
                      Fitur lengkap dan optimal
                    </li>
                  </ul>
                </div>

                {/* Buttons */}
                <div className="space-y-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleDismiss}
                    className="w-full py-3 bg-gradient-to-r from-[#33A1E0] to-[#2288C3] text-white font-semibold rounded-[12px] shadow-lg"
                  >
                    Mengerti, Jangan Tampilkan Lagi
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleDismissTemporary}
                    className="w-full py-3 border-2 border-gray-200 text-gray-700 font-semibold rounded-[12px] hover:bg-gray-50 transition-colors"
                  >
                    Lanjutkan di Mobile
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
