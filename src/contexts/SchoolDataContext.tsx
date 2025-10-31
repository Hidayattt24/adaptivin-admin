"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { getAllSekolah } from "@/lib/api/sekolah";

export interface SchoolData {
  id: string;
  nama_sekolah: string;
  alamat_sekolah: string;
}

export interface SchoolDataContextType {
  schools: SchoolData[];
  setSchools: React.Dispatch<React.SetStateAction<SchoolData[]>>;
  getSchoolNames: () => { value: string; label: string; alamat: string }[];
}

// 🧩 Inisialisasi context
const SchoolDataContext = createContext<SchoolDataContextType | null>(null);

// 🧠 Provider utama
export function SchoolDataProvider({ children }: { children: ReactNode }) {
  const [schools, setSchools] = useState<SchoolData[]>([]);

  // 🔁 Ambil data sekolah saat komponen mount
  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const data = await getAllSekolah();
        setSchools(data);
      } catch (error) {
        console.error("Gagal memuat data sekolah:", error);
      }
    };
    fetchSchools();
  }, []);

  const getSchoolNames = () =>
    schools.map((s: SchoolData) => ({
      value: s.id,
      label: s.nama_sekolah,
      alamat: s.alamat_sekolah,
    }));

  return (
    <SchoolDataContext.Provider value={{ schools, setSchools, getSchoolNames }}>
      {children}
    </SchoolDataContext.Provider>
  );
}

// 🧩 Hook khusus biar gampang pakai context
export function useSchoolData() {
  const context = useContext(SchoolDataContext);
  if (!context) {
    throw new Error("useSchoolData harus dipakai di dalam <SchoolDataProvider>");
  }
  return context;
}
