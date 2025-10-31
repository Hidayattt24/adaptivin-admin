"use client";

import { useState, useEffect } from "react";
import ResponsiveLayout from "@/components/layout/ResponsiveLayout";
import ClassManagementTable from "@/components/class-management/ClassManagementTable";
import ClassModal from "@/components/class-management/ClassModal";
import Swal from "sweetalert2";
import { useClassData, ClassData } from "@/contexts/ClassDataContext";

// Mock data untuk murid (dummy data untuk menghitung jumlah murid per kelas)
const mockStudentData = [
  { sekolah: "SDN 1 Banda Aceh", kelas: "IV", paralel: "A", nama: "Hidayat Rahman" },
  { sekolah: "SDN 1 Banda Aceh", kelas: "IV", paralel: "A", nama: "Siti Nurhaliza" },
  { sekolah: "SDN 1 Banda Aceh", kelas: "IV", paralel: "A", nama: "Ahmad Fauzi" },
  { sekolah: "SDN 1 Banda Aceh", kelas: "IV", paralel: "A", nama: "Fatimah Zahra" },
  { sekolah: "SDN 1 Banda Aceh", kelas: "IV", paralel: "A", nama: "Budi Santoso" },
  { sekolah: "SDN 1 Banda Aceh", kelas: "IV", paralel: "B", nama: "Dewi Lestari" },
  { sekolah: "SDN 1 Banda Aceh", kelas: "IV", paralel: "B", nama: "Andi Wijaya" },
  { sekolah: "SDN 1 Banda Aceh", kelas: "IV", paralel: "B", nama: "Rina Sari" },
  { sekolah: "SDN 2 Banda Aceh", kelas: "V", paralel: "B", nama: "Hasan Basri" },
  { sekolah: "SDN 2 Banda Aceh", kelas: "V", paralel: "B", nama: "Nurul Hidayah" },
  { sekolah: "SDN 3 Banda Aceh", kelas: "III", paralel: "C", nama: "Rizki Ramadhan" },
  { sekolah: "SDN 3 Banda Aceh", kelas: "III", paralel: "C", nama: "Siti Maryam" },
  { sekolah: "SDN 3 Banda Aceh", kelas: "III", paralel: "C", nama: "Dimas Pratama" },
];

// Fungsi untuk menghitung jumlah murid per kelas
const getStudentCount = (sekolah: string, kelas: string, paralel: string) => {
  return mockStudentData.filter(
    student => 
      student.sekolah === sekolah && 
      student.kelas === kelas && 
      student.paralel === paralel
  ).length;
};

// Mock data untuk kelas (hanya Matematika)
const mockClassData: ClassData[] = [
  {
    id: "1",
    sekolah: "SDN 1 Banda Aceh",
    kelas: "IV",
    paralel: "A",
    mataPelajaran: ["Matematika"],
    jumlahMurid: getStudentCount("SDN 1 Banda Aceh", "IV", "A")
  },
  {
    id: "2",
    sekolah: "SDN 1 Banda Aceh",
    kelas: "IV",
    paralel: "B",
    mataPelajaran: ["Matematika"],
    jumlahMurid: getStudentCount("SDN 1 Banda Aceh", "IV", "B")
  },
  {
    id: "3",
    sekolah: "SDN 2 Banda Aceh",
    kelas: "V",
    paralel: "B",
    mataPelajaran: ["Matematika"],
    jumlahMurid: getStudentCount("SDN 2 Banda Aceh", "V", "B")
  },
  {
    id: "4",
    sekolah: "SDN 3 Banda Aceh",
    kelas: "III",
    paralel: "C",
    mataPelajaran: ["Matematika"],
    jumlahMurid: getStudentCount("SDN 3 Banda Aceh", "III", "C")
  }
];

export default function KelolaKelasPage() {
  const { classes, setClasses } = useClassData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedClass, setSelectedClass] = useState<ClassData | null>(null);

  // Initialize with mock data on mount
  useEffect(() => {
    if (classes.length === 0) {
      setClasses(mockClassData);
    }
  }, []);

  const handleAdd = () => {
    setModalMode("create");
    setSelectedClass(null);
    setIsModalOpen(true);
  };

  const handleEdit = (classData: ClassData) => {
    setModalMode("edit");
    setSelectedClass(classData);
    setIsModalOpen(true);
  };

  const handleDelete = async (classData: ClassData) => {
    const result = await Swal.fire({
      title: "Hapus Data Kelas?",
      html: `Apakah Anda yakin ingin menghapus data kelas <b>${classData.kelas} ${classData.paralel} - ${classData.sekolah}</b>?<br/>Tindakan ini tidak dapat dibatalkan.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#94a3b8",
      confirmButtonText: "Ya, Hapus",
      cancelButtonText: "Batal",
      background: "#ffffff",
      customClass: {
        popup: "rounded-[20px] shadow-2xl",
        title: "text-[#ef4444] text-2xl font-semibold",
        htmlContainer: "text-gray-600 text-base font-medium",
        confirmButton: "font-semibold px-6 py-3 rounded-[12px]",
        cancelButton: "font-semibold px-6 py-3 rounded-[12px]",
      },
    });

    if (result.isConfirmed) {
      setClasses(classes.filter(c => c.id !== classData.id));
      Swal.fire({
        title: "Berhasil!",
        text: `Data kelas ${classData.kelas} ${classData.paralel} telah dihapus.`,
        icon: "success",
        confirmButtonColor: "#33A1E0",
        confirmButtonText: "OK",
        background: "#ffffff",
        customClass: {
          popup: "rounded-[20px] shadow-2xl",
          title: "text-[#33A1E0] text-2xl font-semibold",
          confirmButton: "font-semibold px-6 py-3 rounded-[12px]",
        },
      });
    }
  };

  const handleSave = (classData: ClassData) => {
    // Update jumlah murid secara realtime
    const updatedClassData = {
      ...classData,
      jumlahMurid: getStudentCount(classData.sekolah, classData.kelas, classData.paralel)
    };

    if (modalMode === "create") {
      setClasses([...classes, updatedClassData]);
      Swal.fire({
        title: "Berhasil!",
        text: `Data kelas ${classData.kelas} ${classData.paralel} telah ditambahkan.`,
        icon: "success",
        confirmButtonColor: "#33A1E0",
        confirmButtonText: "OK",
        background: "#ffffff",
        customClass: {
          popup: "rounded-[20px] shadow-2xl",
          title: "text-[#33A1E0] text-2xl font-semibold",
          confirmButton: "font-semibold px-6 py-3 rounded-[12px]",
        },
      });
    } else {
      setClasses(classes.map(c => (c.id === classData.id ? updatedClassData : c)));
      Swal.fire({
        title: "Berhasil!",
        text: `Data kelas ${classData.kelas} ${classData.paralel} telah diperbarui.`,
        icon: "success",
        confirmButtonColor: "#33A1E0",
        confirmButtonText: "OK",
        background: "#ffffff",
        customClass: {
          popup: "rounded-[20px] shadow-2xl",
          title: "text-[#33A1E0] text-2xl font-semibold",
          confirmButton: "font-semibold px-6 py-3 rounded-[12px]",
        },
      });
    }
  };

  return (
    <ResponsiveLayout title="Kelola Kelas">
      {/* Header Section */}
      <div className="mb-6 lg:mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-[#33A1E0] mb-2">
          Kelola Kelas
        </h1>
        <p className="text-gray-600 text-sm">
          Kelola master data kelas, sekolah, dan mata pelajaran dalam sistem
        </p>
      </div>

      {/* Table */}
      <ClassManagementTable
        classes={classes}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onAdd={handleAdd}
      />

      {/* Modal */}
      <ClassModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        classData={selectedClass}
        mode={modalMode}
        studentCount={
          selectedClass 
            ? getStudentCount(selectedClass.sekolah, selectedClass.kelas, selectedClass.paralel)
            : 0
        }
      />
    </ResponsiveLayout>
  );
}
