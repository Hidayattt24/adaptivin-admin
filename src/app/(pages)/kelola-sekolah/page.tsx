"use client";

import { useState, useEffect } from "react";
import ResponsiveLayout from "@/components/layout/ResponsiveLayout";
import SchoolManagementTable from "@/components/school-management/SchoolManagementTable";
import SchoolModal from "@/components/school-management/SchoolModal";
import Swal from "sweetalert2";
import { useSchoolData, SchoolData } from "@/contexts/SchoolDataContext";


// Mock data untuk sekolah
const mockSchoolData: SchoolData[] = [
    {
        id: "1",
        nama: "SDN 1 Banda Aceh",
        alamat: "Jl. Pendidikan No. 123",
        kota: "Banda Aceh",
        provinsi: "Aceh",
        telepon: "0651-1234567",
        email: "sdn1@bandaaceh.sch.id",
        kepalaSekolah: "Dr. Ahmad Fauzi, S.Pd",
        jumlahKelas: 12,
        jumlahMurid: 360,
        tanggalDibuat: "2024-01-10"
    },
    {
        id: "2",
        nama: "SDN 2 Banda Aceh",
        alamat: "Jl. Merdeka No. 456",
        kota: "Banda Aceh",
        provinsi: "Aceh",
        telepon: "0651-2345678",
        email: "sdn2@bandaaceh.sch.id",
        kepalaSekolah: "Siti Maryam, M.Pd",
        jumlahKelas: 10,
        jumlahMurid: 300,
        tanggalDibuat: "2024-01-15"
    },
    {
        id: "3",
        nama: "SDN 3 Banda Aceh",
        alamat: "Jl. Pahlawan No. 789",
        kota: "Banda Aceh",
        provinsi: "Aceh",
        telepon: "0651-3456789",
        email: "sdn3@bandaaceh.sch.id",
        kepalaSekolah: "Budi Hartono, S.Pd., M.M",
        jumlahKelas: 8,
        jumlahMurid: 240,
        tanggalDibuat: "2024-02-01"
    }
];

export default function KelolaSekolahPage() {
    const { schools, setSchools } = useSchoolData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<"create" | "edit">("create");
    const [selectedSchool, setSelectedSchool] = useState<SchoolData | null>(null);

    // Initialize with mock data on mount
    useEffect(() => {
        if (schools.length === 0) {
            setSchools(mockSchoolData);
        }
    }, []);

    const handleAdd = () => {
        setModalMode("create");
        setSelectedSchool(null);
        setIsModalOpen(true);
    };

    const handleEdit = (school: SchoolData) => {
        setModalMode("edit");
        setSelectedSchool(school);
        setIsModalOpen(true);
    };

    const handleDelete = async (school: SchoolData) => {
        const result = await Swal.fire({
            title: "Hapus Data Sekolah?",
            html: `Apakah Anda yakin ingin menghapus <b>${school.nama}</b>?<br/>Tindakan ini tidak dapat dibatalkan.`,
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
            setSchools(schools.filter(s => s.id !== school.id));
            Swal.fire({
                title: "Berhasil!",
                text: `${school.nama} telah dihapus.`,
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

    const handleSave = (school: SchoolData) => {
        if (modalMode === "create") {
            const newSchool = {
                ...school,
                id: Date.now().toString(),
                tanggalDibuat: new Date().toISOString().split('T')[0]
            };
            setSchools([...schools, newSchool]);
            Swal.fire({
                title: "Berhasil!",
                text: `${school.nama} telah ditambahkan.`,
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
            setSchools(schools.map(s => (s.id === school.id ? school : s)));
            Swal.fire({
                title: "Berhasil!",
                text: `${school.nama} telah diperbarui.`,
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
        <ResponsiveLayout title="Kelola Sekolah">
            {/* Header Section */}
            <div className="mb-6 lg:mb-8">
                <h1 className="text-2xl lg:text-3xl font-bold text-[#33A1E0] mb-2">
                    Kelola Sekolah
                </h1>
                <p className="text-gray-600 text-sm">
                    Kelola dan pantau seluruh sekolah yang terdaftar dalam sistem
                </p>
            </div>

            {/* Table */}
            <SchoolManagementTable
                schools={schools}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onAdd={handleAdd}
            />

            {/* Modal */}
            <SchoolModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
                school={selectedSchool}
                mode={modalMode}
            />
        </ResponsiveLayout>
    );
}
