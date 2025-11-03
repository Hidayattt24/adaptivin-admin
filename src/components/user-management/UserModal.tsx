
"use client";

import {
  useEffect,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Close,
  BadgeOutlined,
  PersonOutline,
  LocationOnOutlined,
  SchoolOutlined,
  AccountCircleOutlined,
  LockOutlined,
  WcOutlined,
  Save,
  ErrorOutline,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import CustomDatePicker from "./CustomDatePicker";
import CustomSelect from "./CustomSelect";
import CustomMultiSelect from "./CustomMultiSelect";
import {
  type ManagedUser,
  type ManagedUserRole,
  type CreateManagedUserPayload,
  type UpdateManagedUserPayload,
} from "@/lib/api/user";
import { getAllSekolah } from "@/lib/api/sekolah";
import { getAllKelas, type KelasResponse } from "@/lib/api/kelas";

interface Option {
  value: string;
  label: string;
}

interface FormState {
  identifier: string;
  namaLengkap: string;
  email: string;
  password: string;
  jenisKelamin: string;
  tanggalLahir: string;
  alamat: string;
  sekolahId: string;
  kelasId: string;
  kelasIds: string[]; // For guru multi-select
}

type FormErrors = Partial<Record<keyof FormState, string>>;

export type UserModalSubmission =
  | { mode: "create"; payload: CreateManagedUserPayload }
  | { mode: "edit"; id: string; payload: UpdateManagedUserPayload };

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "create" | "edit";
  role: ManagedUserRole;
  user?: ManagedUser | null;
  onSubmit: (submission: UserModalSubmission) => Promise<void> | void;
}

const defaultFormState: FormState = {
  identifier: "",
  namaLengkap: "",
  email: "",
  password: "",
  jenisKelamin: "",
  tanggalLahir: "",
  alamat: "",
  sekolahId: "",
  kelasId: "",
  kelasIds: [],
};

const roleLabelMap: Record<ManagedUserRole, string> = {
  guru: "Guru",
  siswa: "Murid",
};

const identifierLabelMap: Record<ManagedUserRole, "NIP" | "NISN"> = {
  guru: "NIP",
  siswa: "NISN",
};

type SekolahResponse = {
  id: string;
  nama_sekolah?: string | null;
};

const genderOptions: Option[] = [
  { value: "Laki-laki", label: "Laki-laki" },
  { value: "Perempuan", label: "Perempuan" },
];

const formatKelasLabel = (kelas: KelasResponse) => {
  const parts = [kelas.tingkat_kelas, kelas.rombel, kelas.nama_kelas].filter(
    (part) => part && part.trim().length > 0,
  );
  if (parts.length === 0) {
    return "Kelas Tanpa Nama";
  }
  if (kelas.nama_kelas) {
    return kelas.nama_kelas;
  }
  return parts.join(" ");
};
export default function UserModal({
  isOpen,
  onClose,
  mode,
  role,
  user,
  onSubmit,
}: UserModalProps) {
  const [formState, setFormState] = useState<FormState>(defaultFormState);
  const [errors, setErrors] = useState<FormErrors>({});
  const [sekolahOptions, setSekolahOptions] = useState<Option[]>([]);
  const [kelasOptions, setKelasOptions] = useState<Option[]>([]);
  const [isSekolahLoading, setIsSekolahLoading] = useState(false);
  const [isKelasLoading, setIsKelasLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const identifierLabel = identifierLabelMap[role];
  const roleLabel = roleLabelMap[role];

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    let isCancelled = false;

    const loadSekolah = async () => {
      setIsSekolahLoading(true);
      setFetchError(null);

      try {
        const sekolahList = (await getAllSekolah()) as SekolahResponse[];
        if (isCancelled) return;

        const options = sekolahList.map((item) => ({
          value: item.id,
          label: item.nama_sekolah ?? "Sekolah Tanpa Nama",
        }));

        if (mode === "edit" && user?.sekolahId && user?.sekolahName) {
          const exists = options.some((option) => option.value === user.sekolahId);
          if (!exists) {
            options.push({
              value: user.sekolahId,
              label: user.sekolahName ?? "Sekolah Tanpa Nama",
            });
          }
        }

        setSekolahOptions(options);
      } catch {
        if (isCancelled) return;
        setFetchError("Gagal memuat data sekolah. Silakan coba lagi.");
        setSekolahOptions([]);
      } finally {
        if (!isCancelled) {
          setIsSekolahLoading(false);
        }
      }
    };

    loadSekolah();

    return () => {
      isCancelled = true;
    };
  }, [isOpen, mode, user]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    if (mode === "edit" && user) {
      const kelasIdsValue = user.kelasAssignments.map((k) => k.kelasId).filter((id): id is string => id !== null);

      setFormState({
        identifier: user.identifier ?? "",
        namaLengkap: user.nama ?? "",
        email: user.email ?? "",
        password: "",
        jenisKelamin: user.jenisKelamin ?? "",
        tanggalLahir: user.tanggalLahir ?? "",
        alamat: user.alamat ?? "",
        sekolahId: user.sekolahId ?? "",
        kelasId: user.kelasId ?? "",
        kelasIds: kelasIdsValue,
      });
    } else {
      setFormState(defaultFormState);
    }

    setErrors({});
    setSubmitError(null);
    setIsPasswordVisible(false);
  }, [isOpen, mode, user, role]);

  useEffect(() => {
    if (!isOpen || !formState.sekolahId) {
      setKelasOptions([]);
      return;
    }

    let isCancelled = false;

    const loadKelas = async () => {
      setIsKelasLoading(true);

      try {
        const kelasList = await getAllKelas({ sekolahId: formState.sekolahId });
        if (isCancelled) return;

        const options = kelasList.map((kelas) => ({
          value: kelas.id,
          label: formatKelasLabel(kelas),
        }));

        if (mode === "edit" && user?.kelasId && user?.kelasName) {
          const exists = options.some((option) => option.value === user.kelasId);
          if (!exists) {
            options.push({
              value: user.kelasId,
              label: user.kelasName ?? "Kelas Tanpa Nama",
            });
          }
        }

        setKelasOptions(options);
        setFetchError(null);
      } catch {
        if (isCancelled) return;
        setFetchError("Gagal memuat data kelas. Silakan coba lagi.");
        setKelasOptions([]);
      } finally {
        if (!isCancelled) {
          setIsKelasLoading(false);
        }
      }
    };

    loadKelas();

    return () => {
      isCancelled = true;
    };
  }, [formState.sekolahId, isOpen, mode, user]);

  const clearFieldError = (field: keyof FormState) => {
    setErrors((prev) => {
      if (!prev[field]) {
        return prev;
      }
      const updated = { ...prev };
      delete updated[field];
      return updated;
    });
  };

  const handleInputChange =
    (field: keyof FormState) =>
      (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { value } = event.target;
        setFormState((prev) => ({ ...prev, [field]: value }));
        clearFieldError(field);
      };

  const handleSekolahChange = (value: string) => {
    setFormState((prev) => ({
      ...prev,
      sekolahId: value,
      kelasId: "",
    }));
    clearFieldError("sekolahId");
    clearFieldError("kelasId");
  };

  const handleSelectChange = (field: keyof FormState) => (value: string) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
    clearFieldError(field);
  };

  const handleDateChange = (value: string) => {
    setFormState((prev) => ({ ...prev, tanggalLahir: value }));
    clearFieldError("tanggalLahir");
  };

  const validateForm = (): FormErrors => {
    const nextErrors: FormErrors = {};

    if (!formState.identifier.trim()) {
      nextErrors.identifier = `${identifierLabel} wajib diisi`;
    }

    if (!formState.namaLengkap.trim()) {
      nextErrors.namaLengkap = "Nama lengkap wajib diisi";
    }

    const email = formState.email.trim();
    if (!email) {
      nextErrors.email = "Email wajib diisi";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      nextErrors.email = "Format email tidak valid";
    }

    if (mode === "create") {
      if (!formState.password.trim()) {
        nextErrors.password = "Password wajib diisi";
      } else if (formState.password.trim().length < 6) {
        nextErrors.password = "Password minimal 6 karakter";
      }
    }

    if (!formState.jenisKelamin) {
      nextErrors.jenisKelamin = "Jenis kelamin wajib dipilih";
    }

    if (!formState.sekolahId) {
      nextErrors.sekolahId = "Sekolah wajib dipilih";
    }

    // Validation untuk kelas berbeda antara guru dan siswa
    if (role === "siswa") {
      if (kelasOptions.length > 0 && !formState.kelasId) {
        nextErrors.kelasId = "Kelas wajib dipilih";
      }
    } else {
      // Untuk guru, kelas tidak wajib (boleh tidak mengajar kelas apapun)
      // Jika ingin wajib minimal 1 kelas, uncomment kode di bawah:
      // if (kelasOptions.length > 0 && formState.kelasIds.length === 0) {
      //   nextErrors.kelasId = "Minimal pilih 1 kelas yang diajar";
      // }
    }

    return nextErrors;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    if (mode === "edit" && !user) {
      setSubmitError("Data pengguna tidak ditemukan.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    const trimmedIdentifier = formState.identifier.trim();
    const trimmedNama = formState.namaLengkap.trim();
    const trimmedEmail = formState.email.trim();

    // Tentukan kelasId berdasarkan role
    const finalKelasId = role === "siswa"
      ? (formState.kelasId || null)
      : (formState.kelasIds.length > 0 ? formState.kelasIds[0] : null);

    const submission: UserModalSubmission =
      mode === "create"
        ? {
          mode: "create",
          payload: {
            email: trimmedEmail,
            password: formState.password,
            namaLengkap: trimmedNama,
            role,
            jenisKelamin: formState.jenisKelamin || undefined,
            alamat: formState.alamat || undefined,
            tanggalLahir: formState.tanggalLahir || undefined,
            sekolahId: formState.sekolahId,
            kelasId: finalKelasId,
            identifier: trimmedIdentifier,
            kelasIds: role === "guru" ? formState.kelasIds : undefined,
          },
        }
        : {
          mode: "edit",
          id: user!.id,
          payload: {
            role,
            namaLengkap: trimmedNama,
            jenisKelamin: formState.jenisKelamin || undefined,
            alamat: formState.alamat || undefined,
            tanggalLahir: formState.tanggalLahir || null,
            sekolahId: formState.sekolahId,
            kelasId: finalKelasId,
            identifier: trimmedIdentifier || null,
            kelasIds: role === "guru" ? formState.kelasIds : undefined,
          },
        };

    try {
      await onSubmit(submission);
      onClose();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat menyimpan data.";
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-999 flex items-center justify-center bg-black/40 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 30 }}
            className="relative w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl"
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 top-4 rounded-full bg-white/80 p-2 text-gray-500 shadow-md transition hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <Close />
            </button>

            <div className="bg-linear-to-r from-primary to-primary-dark px-8 py-6 text-white">
              <p className="text-sm uppercase tracking-wide text-white/80">
                Manajemen Pengguna {roleLabel}
              </p>
              <h2 className="mt-1 text-2xl font-bold">
                {mode === "create" ? `Tambah ${roleLabel}` : `Edit ${roleLabel}`}
              </h2>
              <p className="mt-2 text-sm text-white/80">
                Lengkapi informasi berikut untuk {mode === "create" ? "membuat" : "memperbarui"} akun {roleLabel.toLowerCase()}.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="max-h-[80vh] space-y-6 overflow-y-auto px-8 py-6"
            >
              {(fetchError || submitError) && (
                <div className="space-y-3">
                  {fetchError && (
                    <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                      <ErrorOutline className="mt-0.5" sx={{ fontSize: 20 }} />
                      <span>{fetchError}</span>
                    </div>
                  )}
                  {submitError && (
                    <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                      <ErrorOutline className="mt-0.5" sx={{ fontSize: 20 }} />
                      <span>{submitError}</span>
                    </div>
                  )}
                </div>
              )}

              <section className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Informasi Personal
                </h3>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      {identifierLabel}
                    </label>
                    <div className="relative">
                      <BadgeOutlined
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-primary"
                        sx={{ fontSize: 20 }}
                      />
                      <input
                        type="text"
                        value={formState.identifier}
                        onChange={handleInputChange("identifier")}
                        placeholder={`Masukkan ${identifierLabel.toLowerCase()}`}
                        className={`w-full rounded-xl border-2 px-4 py-3 pl-12 text-gray-900 transition-all focus:border-primary focus:outline-none focus:ring-0 placeholder:text-gray-400 ${errors.identifier ? "border-red-500" : "border-gray-200 hover:border-gray-300"
                          }`}
                      />
                    </div>
                    {errors.identifier && (
                      <p className="mt-2 text-sm text-red-500">
                        {errors.identifier}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      Nama Lengkap
                    </label>
                    <div className="relative">
                      <PersonOutline
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-primary"
                        sx={{ fontSize: 20 }}
                      />
                      <input
                        type="text"
                        value={formState.namaLengkap}
                        onChange={handleInputChange("namaLengkap")}
                        placeholder="Masukkan nama lengkap"
                        className={`w-full rounded-xl border-2 px-4 py-3 pl-12 text-gray-900 transition-all focus:border-primary focus:outline-none focus:ring-0 placeholder:text-gray-400 ${errors.namaLengkap ? "border-red-500" : "border-gray-200 hover:border-gray-300"
                          }`}
                      />
                    </div>
                    {errors.namaLengkap && (
                      <p className="mt-2 text-sm text-red-500">
                        {errors.namaLengkap}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      Jenis Kelamin
                    </label>
                    <CustomSelect
                      value={formState.jenisKelamin}
                      onChange={handleSelectChange("jenisKelamin")}
                      options={genderOptions}
                      placeholder="Pilih jenis kelamin"
                      icon={<WcOutlined sx={{ fontSize: 20 }} />}
                      error={errors.jenisKelamin}
                    />
                    {errors.jenisKelamin && (
                      <p className="mt-2 text-sm text-red-500">
                        {errors.jenisKelamin}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      Tanggal Lahir
                    </label>
                    <CustomDatePicker
                      value={formState.tanggalLahir}
                      onChange={handleDateChange}
                      placeholder="Pilih tanggal lahir"
                      error={errors.tanggalLahir}
                    />
                    {errors.tanggalLahir && (
                      <p className="mt-2 text-sm text-red-500">
                        {errors.tanggalLahir}
                      </p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      Alamat
                    </label>
                    <div className="relative">
                      <LocationOnOutlined
                        className="absolute left-4 top-4 text-primary"
                        sx={{ fontSize: 20 }}
                      />
                      <textarea
                        value={formState.alamat}
                        onChange={handleInputChange("alamat")}
                        placeholder="Masukkan alamat lengkap"
                        rows={3}
                        className={`w-full rounded-xl border-2 px-4 py-3 pl-12 text-gray-900 transition-all focus:border-primary focus:outline-none focus:ring-0 placeholder:text-gray-400 ${errors.alamat ? "border-red-500" : "border-gray-200 hover:border-gray-300"
                          }`}
                      />
                    </div>
                    {errors.alamat && (
                      <p className="mt-2 text-sm text-red-500">
                        {errors.alamat}
                      </p>
                    )}
                  </div>
                </div>
              </section>

              <section className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Informasi Sekolah
                </h3>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      Sekolah
                    </label>
                    <CustomSelect
                      value={formState.sekolahId}
                      onChange={handleSekolahChange}
                      options={sekolahOptions}
                      placeholder={
                        isSekolahLoading ? "Memuat data sekolah..." : "Pilih sekolah"
                      }
                      icon={<SchoolOutlined sx={{ fontSize: 20 }} />}
                      error={errors.sekolahId}
                      disabled={isSekolahLoading}
                    />
                    {errors.sekolahId && (
                      <p className="mt-2 text-sm text-red-500">
                        {errors.sekolahId}
                      </p>
                    )}
                  </div>

                  {role === "siswa" ? (
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-gray-700">
                        Kelas
                      </label>
                      <CustomSelect
                        value={formState.kelasId}
                        onChange={handleSelectChange("kelasId")}
                        options={kelasOptions}
                        placeholder={
                          !formState.sekolahId
                            ? "Pilih sekolah terlebih dahulu"
                            : isKelasLoading
                              ? "Memuat data kelas..."
                              : kelasOptions.length > 0
                                ? "Pilih kelas"
                                : "Tidak ada data kelas"
                        }
                        icon={<SchoolOutlined sx={{ fontSize: 20 }} />}
                        error={errors.kelasId}
                        disabled={isKelasLoading || !formState.sekolahId}
                      />
                      {errors.kelasId && (
                        <p className="mt-2 text-sm text-red-500">
                          {errors.kelasId}
                        </p>
                      )}
                    </div>
                  ) : (
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-gray-700">
                        Kelas yang Diajar
                        <span className="ml-2 text-xs font-normal text-gray-500">
                          (Bisa memilih lebih dari satu)
                        </span>
                      </label>
                      <CustomMultiSelect
                        value={formState.kelasIds}
                        onChange={(value) =>
                          setFormState((prev) => ({ ...prev, kelasIds: value }))
                        }
                        options={kelasOptions}
                        placeholder={
                          !formState.sekolahId
                            ? "Pilih sekolah terlebih dahulu"
                            : isKelasLoading
                              ? "Memuat data kelas..."
                              : kelasOptions.length > 0
                                ? "Pilih kelas yang diajar"
                                : "Tidak ada data kelas"
                        }
                        icon={<SchoolOutlined sx={{ fontSize: 20 }} />}
                        error={errors.kelasId}
                        disabled={isKelasLoading || !formState.sekolahId}
                      />
                      {errors.kelasId && (
                        <p className="mt-2 text-sm text-red-500">
                          {errors.kelasId}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </section>

              <section className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Akun</h3>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="md:col-span-2">
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      Email
                    </label>
                    <div className="relative">
                      <AccountCircleOutlined
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-primary"
                        sx={{ fontSize: 20 }}
                      />
                      <input
                        type="email"
                        value={formState.email}
                        onChange={handleInputChange("email")}
                        placeholder="Masukkan email"
                        className={`w-full rounded-xl border-2 px-4 py-3 pl-12 text-gray-900 transition-all focus:border-primary focus:outline-none focus:ring-0 placeholder:text-gray-400 ${errors.email ? "border-red-500" : "border-gray-200 hover:border-gray-300"
                          } ${mode === "edit" ? "bg-gray-50" : ""}`}
                        disabled={mode === "edit"}
                      />
                    </div>
                    {errors.email && (
                      <p className="mt-2 text-sm text-red-500">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      Password
                    </label>
                    <div className="relative">
                      <LockOutlined
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-primary"
                        sx={{ fontSize: 20 }}
                      />
                      <input
                        type={isPasswordVisible ? "text" : "password"}
                        value={formState.password}
                        onChange={handleInputChange("password")}
                        placeholder={
                          mode === "create"
                            ? "Masukkan password minimal 6 karakter"
                            : "Kosongkan jika tidak ingin mengubah password"
                        }
                        className={`w-full rounded-xl border-2 px-4 py-3 pr-12 pl-12 text-gray-900 transition-all focus:border-primary focus:outline-none focus:ring-0 placeholder:text-gray-400 ${errors.password ? "border-red-500" : "border-gray-200 hover:border-gray-300"
                          } ${mode === "edit" ? "bg-gray-50" : ""}`}
                        disabled={mode === "edit"}
                      />
                      {mode === "create" && (
                        <button
                          type="button"
                          onClick={() => setIsPasswordVisible((prev) => !prev)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-gray-600"
                        >
                          {isPasswordVisible ? (
                            <VisibilityOff sx={{ fontSize: 20 }} />
                          ) : (
                            <Visibility sx={{ fontSize: 20 }} />
                          )}
                        </button>
                      )}
                    </div>
                    {mode === "create" ? (
                      errors.password && (
                        <p className="mt-2 text-sm text-red-500">
                          {errors.password}
                        </p>
                      )
                    ) : (
                      <p className="mt-2 text-sm text-gray-500">
                        Password tidak dapat diubah dari sini.
                      </p>
                    )}
                  </div>
                </div>
              </section>

              <div className="flex flex-col-reverse gap-3 md:flex-row md:justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-xl border-2 border-gray-300 px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-50"
                  disabled={isSubmitting}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 rounded-xl bg-linear-to-r from-primary to-primary-dark px-6 py-3 font-semibold text-white shadow-md transition hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Save sx={{ fontSize: 20 }} />
                  {isSubmitting ? "Menyimpan..." : "Simpan"}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
