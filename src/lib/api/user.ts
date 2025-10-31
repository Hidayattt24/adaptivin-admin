import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// Ambil token dari cookie browser
function getTokenFromCookie() {
  if (typeof document === "undefined") return null;
  const token = document.cookie
    .split("; ")
    .find((row) => row.startsWith("token="))
    ?.split("=")[1];
  return token;
}

// Buat instance axios dengan konfigurasi default
const api = axios.create({
  baseURL: `${API_BASE}/api`,
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
  return res.data.admins;
}

export async function getAdminById(id: string) {
  const res = await api.get(`/admins/${id}`);
  return res.data.admin;
}

export async function createAdmin(payload: {
  nama_lengkap: string;
  email: string;
  password: string;
  jenis_kelamin?: string;
  sekolah_id: string;
}) {
  const res = await api.post("/admins/buat-admin", payload);
  return res.data.admin;
}

export async function updateAdmin(id: string, payload: any) {
  const res = await api.put(`/admins/${id}`, payload);
  return res.data.admin;
}

export async function deleteAdmin(id: string) {
  const res = await api.delete(`/admins/${id}`);
  return res.data.admin;
}

// Fungsi CRUD user
export async function getAllUsers() {
  const res = await api.get("/users");
  return res.data.users;
}

export async function getUserById(id: string) {
  const res = await api.get(`/users/${id}`);
  return res.data.user;
}

export async function createUser(payload: any) {
  const res = await api.post("/users", payload);
  return res.data.user;
}

export async function updateUser(id: string, payload: any) {
  const res = await api.put(`/users/${id}`, payload);
  return res.data.user;
}

export async function deleteUser(id: string) {
  const res = await api.delete(`/users/${id}`);
  return res.data.user;
}