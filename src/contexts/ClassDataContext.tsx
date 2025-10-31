"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export interface ClassData {
  id: string;
  sekolah: string;
  kelas: string;
  paralel: string;
  mataPelajaran: string[];
  jumlahMurid: number;
}

interface ClassDataContextType {
  classes: ClassData[];
  setClasses: (classes: ClassData[]) => void;
  getUniqueSchools: () => string[];
  getClassesBySchool: (school: string) => string[];
  getParalelsBySchoolAndClass: (school: string, kelas: string) => string[];
}

const ClassDataContext = createContext<ClassDataContextType | undefined>(undefined);

export function ClassDataProvider({ children }: { children: ReactNode }) {
  const [classes, setClasses] = useState<ClassData[]>([]);

  const getUniqueSchools = () => {
    const schools = classes.map(c => c.sekolah);
    return [...new Set(schools)].sort();
  };

  const getClassesBySchool = (school: string) => {
    const schoolClasses = classes
      .filter(c => c.sekolah === school)
      .map(c => c.kelas);
    return [...new Set(schoolClasses)].sort();
  };

  const getParalelsBySchoolAndClass = (school: string, kelas: string) => {
    const paralels = classes
      .filter(c => c.sekolah === school && c.kelas === kelas)
      .map(c => c.paralel);
    return [...new Set(paralels)].sort();
  };

  return (
    <ClassDataContext.Provider
      value={{
        classes,
        setClasses,
        getUniqueSchools,
        getClassesBySchool,
        getParalelsBySchoolAndClass
      }}
    >
      {children}
    </ClassDataContext.Provider>
  );
}

export function useClassData() {
  const context = useContext(ClassDataContext);
  if (context === undefined) {
    throw new Error("useClassData must be used within a ClassDataProvider");
  }
  return context;
}
