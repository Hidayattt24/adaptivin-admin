"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export interface SchoolData {
  id: string;
  nama: string;
  alamat: string;
  kota: string;
  provinsi: string;
  telepon: string;
  email: string;
  kepalaSekolah: string;
  jumlahKelas: number;
  jumlahMurid: number;
  tanggalDibuat: string;
}

interface SchoolDataContextType {
  schools: SchoolData[];
  setSchools: (schools: SchoolData[]) => void;
  getSchoolNames: () => { value: string; label: string; alamat: string }[];
}

const SchoolDataContext = createContext<SchoolDataContextType | undefined>(undefined);

export function SchoolDataProvider({ children }: { children: ReactNode }) {
  const [schools, setSchools] = useState<SchoolData[]>([]);

  const getSchoolNames = () => {
    return schools.map(school => ({
      value: school.nama,
      label: school.nama,
      alamat: school.alamat
    }));
  };

  return (
    <SchoolDataContext.Provider
      value={{
        schools,
        setSchools,
        getSchoolNames
      }}
    >
      {children}
    </SchoolDataContext.Provider>
  );
}

export function useSchoolData() {
  const context = useContext(SchoolDataContext);
  if (context === undefined) {
    throw new Error("useSchoolData must be used within a SchoolDataProvider");
  }
  return context;
}
