import axios from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

type Nullable<T> = T | null | undefined;

interface AdminResponse {
  id: string;
  nama_lengkap?: Nullable<string>;
  jenis_kelamin?: Nullable<string>;
  sekolah_id?: Nullable<string>;
  sekolah_name?: Nullable<string>;
  alamat?: Nullable<string>;
  email?: Nullable<string>;
  role?: Nullable<string>;
  created_at?: Nullable<string>;
  updated_at?: Nullable<string>;
}

export interface AdminPayload {
  id?: string;
  nama_lengkap: string;
  email: string;
  password?: string;
  jenisKelamin?: string;
  sekolah_id: string;
  alamat?: string;
}

export interface AdminData {
  id: string;
  nama_lengkap: string;
  email: string;
  jenisKelamin: string;
  sekolah_id: string;
  sekolahName?: string;
  alamat: string;
  role?: string;
  created_at?: string;
  updated_at?: string;
}

function getTokenFromCookie() {
  if (typeof document === "undefined") return null;
  const token = document.cookie
    .split("; ")
    .find((row) => row.startsWith("token="))
    ?.split("=")[1];
  return token;
}

function transformAdmin(
  admin: AdminResponse,
  fallback: Partial<AdminPayload> = {}
): AdminData {
  return {
    id: admin.id,
    nama_lengkap: admin.nama_lengkap ?? fallback.nama_lengkap ?? "",
    email: admin.email ?? fallback.email ?? "",
    jenisKelamin: admin.jenis_kelamin ?? fallback.jenisKelamin ?? "",
    sekolah_id: admin.sekolah_id ?? fallback.sekolah_id ?? "",
    sekolahName: admin.sekolah_name ?? undefined,
    alamat: admin.alamat ?? fallback.alamat ?? "",
    role: admin.role ?? undefined,
    created_at: admin.created_at ?? undefined,
    updated_at: admin.updated_at ?? undefined,
  };
}

// Buat instance axios dengan konfigurasi default
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// Interceptor untuk selalu menambahkan Authorization header
api.interceptors.request.use(
  (config) => {
    const token = getTokenFromCookie();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Fungsi CRUD admin
export async function getAllAdmins() {
  const res = await api.get("/admins");
  const admins: AdminResponse[] = res.data.admins ?? [];
  return admins.map((admin) => transformAdmin(admin));
}

export async function getAdminById(id: string) {
  const res = await api.get(`/admins/${id}`);
  return transformAdmin(res.data.admin ?? res.data.user);
}

export async function createAdmin(payload: AdminPayload) {
  const { jenisKelamin, alamat, ...rest } = payload;

  const backendPayload = {
    ...rest,
    jenis_kelamin: jenisKelamin,
    alamat,
  };

  const res = await api.post("/admins/buat-admin", backendPayload);
  const adminResponse: AdminResponse = res.data.admin;
  return transformAdmin(adminResponse, payload);
}

export async function updateAdmin(id: string, payload: Partial<AdminPayload>) {
  const { jenisKelamin, alamat, ...rest } = payload;

  const backendPayload = {
    ...rest,
    jenis_kelamin: jenisKelamin,
    alamat,
  };

  const res = await api.put(`/admins/${id}`, backendPayload);
  return transformAdmin(res.data.admin, { id, ...payload } as AdminPayload);
}

export async function deleteAdmin(id: string) {
  const res = await api.delete(`/admins/${id}`);
  return res.data.admin ?? res.data;
}

// ================= Managed Users (Guru & Siswa) =================

export type ManagedUserRole = "guru" | "siswa";

interface ManagedUserClassResponse {
  id: string;
  role_dalam_kelas?: Nullable<string>;
  kelas?: {
    id: string;
    nama_kelas?: Nullable<string>;
    tingkat_kelas?: Nullable<string>;
    rombel?: Nullable<string>;
    sekolah_id?: Nullable<string>;
  } | null;
}

interface ManagedUserResponse {
  id: string;
  email?: Nullable<string>;
  nama_lengkap?: Nullable<string>;
  role?: Nullable<string>;
  jenis_kelamin?: Nullable<string>;
  alamat?: Nullable<string>;
  tanggal_lahir?: Nullable<string>;
  nisn?: Nullable<string>;
  nip?: Nullable<string>;
  sekolah_id?: Nullable<string>;
  sekolah?: {
    id: string;
    nama_sekolah?: Nullable<string>;
  } | null;
  kelas?: {
    id: string;
    nama_kelas?: Nullable<string>;
    tingkat_kelas?: Nullable<string>;
    rombel?: Nullable<string>;
    sekolah_id?: Nullable<string>;
  } | null;
  kelas_assignments?: ManagedUserClassResponse[];
  created_at?: Nullable<string>;
  updated_at?: Nullable<string>;
}

export interface ManagedUserClassAssignment {
  id: string;
  roleDalamKelas: string | null;
  kelasId: string | null;
  kelasName: string | null;
  kelasLevel: string | null;
  kelasRombel: string | null;
}

export interface ManagedUser {
  id: string;
  role: ManagedUserRole;
  nama: string;
  email: string;
  jenisKelamin: string | null;
  alamat: string | null;
  tanggalLahir: string | null;
  identifier: string | null;
  identifierLabel: "nisn" | "nip";
  sekolahId: string | null;
  sekolahName: string | null;
  kelasId: string | null;
  kelasName: string | null;
  kelasLevel: string | null;
  kelasRombel: string | null;
  kelasAssignments: ManagedUserClassAssignment[];
  createdAt: string | null;
  updatedAt: string | null;
}

const transformManagedUser = (user: ManagedUserResponse): ManagedUser => {
  const rawRole = (user.role ?? "").toString().toLowerCase() as ManagedUserRole;
  const role: ManagedUserRole = rawRole === "guru" ? "guru" : "siswa";
  const identifierLabel = role === "guru" ? "nip" : "nisn";
  const identifierValue = role === "guru" ? user.nip : user.nisn;

  const assignments: ManagedUserClassAssignment[] = (
    user.kelas_assignments ?? []
  ).map((assignment) => ({
    id: assignment.id,
    roleDalamKelas: assignment.role_dalam_kelas ?? null,
    kelasId: assignment.kelas?.id ?? null,
    kelasName: assignment.kelas?.nama_kelas ?? null,
    kelasLevel: assignment.kelas?.tingkat_kelas ?? null,
    kelasRombel: assignment.kelas?.rombel ?? null,
  }));

  return {
    id: user.id,
    role,
    nama: user.nama_lengkap ?? "",
    email: user.email ?? "",
    jenisKelamin: user.jenis_kelamin ?? null,
    alamat: user.alamat ?? null,
    tanggalLahir: user.tanggal_lahir ?? null,
    identifier: identifierValue ?? null,
    identifierLabel,
    sekolahId: user.sekolah_id ?? null,
    sekolahName: user.sekolah?.nama_sekolah ?? null,
    kelasId: user.kelas?.id ?? assignments[0]?.kelasId ?? null,
    kelasName: user.kelas?.nama_kelas ?? assignments[0]?.kelasName ?? null,
    kelasLevel: user.kelas?.tingkat_kelas ?? assignments[0]?.kelasLevel ?? null,
    kelasRombel: user.kelas?.rombel ?? assignments[0]?.kelasRombel ?? null,
    kelasAssignments: assignments,
    createdAt: user.created_at ?? null,
    updatedAt: user.updated_at ?? null,
  };
};

type GetUsersParams = {
  role?: ManagedUserRole;
  sekolah_id?: string;
};

export async function getAllUsers(
  params?: GetUsersParams
): Promise<ManagedUser[]> {
  const res = await api.get("/users", { params });
  const users: ManagedUserResponse[] = res.data.users ?? [];
  return users.map(transformManagedUser);
}

export const getUsersByRole = (role: ManagedUserRole) => getAllUsers({ role });

export async function getUserById(id: string): Promise<ManagedUser> {
  const res = await api.get(`/users/${id}`);
  return transformManagedUser(res.data.user);
}

export interface CreateManagedUserPayload {
  email: string;
  password: string;
  namaLengkap: string;
  role: ManagedUserRole;
  jenisKelamin?: string;
  alamat?: string;
  tanggalLahir?: string;
  sekolahId: string;
  kelasId?: string | null;
  identifier: string;
  kelasIds?: string[]; // For guru multi-class assignment
}

export async function createManagedUser(
  payload: CreateManagedUserPayload
): Promise<ManagedUser> {
  const {
    email,
    password,
    namaLengkap,
    role,
    jenisKelamin,
    alamat,
    tanggalLahir,
    sekolahId,
    kelasId,
    identifier,
    kelasIds,
  } = payload;

  const backendPayload: Record<string, unknown> = {
    email,
    password,
    nama_lengkap: namaLengkap,
    role,
    jenis_kelamin: jenisKelamin,
    alamat,
    tanggal_lahir: tanggalLahir,
    sekolah_id: sekolahId,
    kelas_id: kelasId ?? null,
  };

  if (role === "siswa") {
    backendPayload.nisn = identifier;
  } else {
    backendPayload.nip = identifier;
  }

  // If guru with multiple classes
  if (role === "guru" && kelasIds && kelasIds.length > 0) {
    backendPayload.kelas_ids = kelasIds;
  }

  const res = await api.post("/users", backendPayload);
  return transformManagedUser(res.data.user);
}

export interface UpdateManagedUserPayload {
  role: ManagedUserRole;
  namaLengkap?: string;
  jenisKelamin?: string;
  alamat?: string;
  tanggalLahir?: string | null;
  sekolahId?: string;
  kelasId?: string | null;
  identifier?: string | null;
  kelasIds?: string[]; // For guru multi-class assignment
}

export async function updateManagedUser(
  id: string,
  payload: UpdateManagedUserPayload
): Promise<ManagedUser> {
  const {
    role,
    namaLengkap,
    jenisKelamin,
    alamat,
    tanggalLahir,
    sekolahId,
    kelasId,
    identifier,
    kelasIds,
  } = payload;

  const backendPayload: Record<string, unknown> = {
    role,
  };

  if (namaLengkap !== undefined) backendPayload.nama_lengkap = namaLengkap;
  if (jenisKelamin !== undefined) backendPayload.jenis_kelamin = jenisKelamin;
  if (alamat !== undefined) backendPayload.alamat = alamat;
  if (tanggalLahir !== undefined) backendPayload.tanggal_lahir = tanggalLahir;
  if (sekolahId !== undefined) backendPayload.sekolah_id = sekolahId;
  if (kelasId !== undefined) backendPayload.kelas_id = kelasId;

  if (identifier !== undefined) {
    if (role === "siswa") {
      backendPayload.nisn = identifier;
    } else {
      backendPayload.nip = identifier;
    }
  }

  // If guru with multiple classes
  if (role === "guru" && kelasIds !== undefined) {
    backendPayload.kelas_ids = kelasIds;
  }

  const res = await api.put(`/users/${id}`, backendPayload);
  return transformManagedUser(res.data.user);
}

export async function deleteManagedUser(id: string): Promise<void> {
  await api.delete(`/users/${id}`);
}

// ================= Current Admin Profile =================

export async function getMyProfile(): Promise<AdminData> {
  const res = await api.get("/admins/me");
  return transformAdmin(res.data.admin);
}

export interface UpdateMyProfilePayload {
  nama_lengkap?: string;
  jenisKelamin?: string;
  alamat?: string;
}

export async function updateMyProfile(
  payload: UpdateMyProfilePayload
): Promise<AdminData> {
  const { jenisKelamin, ...rest } = payload;

  const backendPayload = {
    ...rest,
    jenis_kelamin: jenisKelamin,
  };

  const res = await api.put("/admins/me", backendPayload);
  return transformAdmin(res.data.admin);
}

export interface UpdatePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export async function updateMyPassword(
  payload: UpdatePasswordPayload
): Promise<void> {
  await api.put("/admins/me/password", payload);
}
