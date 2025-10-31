// Utility untuk generate dummy data murid dan kelas
// Berguna untuk testing dan development

export interface StudentData {
    sekolah: string;
    kelas: string;
    paralel: string;
    nama: string;
}

// Daftar nama-nama untuk dummy data
const namaDepan = [
    "Ahmad", "Siti", "Budi", "Dewi", "Rizki", "Fatimah", "Hasan", "Nurul",
    "Andi", "Rina", "Dimas", "Ayu", "Fajar", "Lestari", "Rudi", "Maya",
    "Arif", "Indah", "Yusuf", "Putri", "Agus", "Sari", "Irfan", "Wulan"
];

const namaBelakang = [
    "Rahman", "Nurhaliza", "Santoso", "Lestari", "Ramadhan", "Zahra", "Basri", "Hidayah",
    "Wijaya", "Sari", "Pratama", "Permata", "Hakim", "Kusuma", "Saputra", "Dewi",
    "Maulana", "Anggraini", "Firmansyah", "Maharani", "Setiawan", "Puspita", "Hidayat", "Cahyani"
];

const sekolahList = [
    "SDN 1 Banda Aceh",
    "SDN 2 Banda Aceh",
    "SDN 3 Banda Aceh",
    "SDN 4 Banda Aceh",
    "SDN 5 Banda Aceh"
];

const kelasList = ["I", "II", "III", "IV", "V", "VI"];
const paralelList = ["A", "B", "C", "D"];

/**
 * Generate nama acak dari kombinasi nama depan dan belakang
 */
export const generateRandomName = (): string => {
    const depan = namaDepan[Math.floor(Math.random() * namaDepan.length)];
    const belakang = namaBelakang[Math.floor(Math.random() * namaBelakang.length)];
    return `${depan} ${belakang}`;
};

/**
 * Generate dummy data murid
 * @param count Jumlah murid yang ingin di-generate
 * @returns Array of StudentData
 */
export const generateStudentData = (count: number = 50): StudentData[] => {
    const students: StudentData[] = [];

    for (let i = 0; i < count; i++) {
        students.push({
            sekolah: sekolahList[Math.floor(Math.random() * sekolahList.length)],
            kelas: kelasList[Math.floor(Math.random() * kelasList.length)],
            paralel: paralelList[Math.floor(Math.random() * paralelList.length)],
            nama: generateRandomName()
        });
    }

    return students;
};

/**
 * Generate dummy data murid untuk kelas tertentu
 * @param sekolah Nama sekolah
 * @param kelas Tingkat kelas
 * @param paralel Paralel kelas
 * @param count Jumlah murid
 * @returns Array of StudentData
 */
export const generateStudentDataForClass = (
    sekolah: string,
    kelas: string,
    paralel: string,
    count: number = 25
): StudentData[] => {
    const students: StudentData[] = [];

    for (let i = 0; i < count; i++) {
        students.push({
            sekolah,
            kelas,
            paralel,
            nama: generateRandomName()
        });
    }

    return students;
};

/**
 * Hitung jumlah murid per kelas dari array student data
 * @param students Array of StudentData
 * @param sekolah Nama sekolah
 * @param kelas Tingkat kelas
 * @param paralel Paralel kelas
 * @returns Jumlah murid
 */
export const countStudents = (
    students: StudentData[],
    sekolah: string,
    kelas: string,
    paralel: string
): number => {
    return students.filter(
        student =>
            student.sekolah === sekolah &&
            student.kelas === kelas &&
            student.paralel === paralel
    ).length;
};

/**
 * Get daftar sekolah unik dari student data
 * @param students Array of StudentData
 * @returns Array of unique school names
 */
export const getUniqueSchools = (students: StudentData[]): string[] => {
    return [...new Set(students.map(s => s.sekolah))].sort();
};

/**
 * Get statistik per sekolah
 * @param students Array of StudentData
 * @returns Object dengan statistik per sekolah
 */
export const getSchoolStatistics = (students: StudentData[]) => {
    const schools = getUniqueSchools(students);

    return schools.map(sekolah => {
        const schoolStudents = students.filter(s => s.sekolah === sekolah);
        const classes = [...new Set(schoolStudents.map(s => `${s.kelas}-${s.paralel}`))];

        return {
            sekolah,
            totalMurid: schoolStudents.length,
            jumlahKelas: classes.length,
            kelas: classes
        };
    });
};

// Export data dummy default untuk development
export const defaultMockStudentData: StudentData[] = [
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
