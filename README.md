# 🎯 Adaptivin Admin Dashboard

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-16.0-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Material-UI](https://img.shields.io/badge/Material--UI-7.3-0081CB?style=for-the-badge&logo=mui)
![Supabase](https://img.shields.io/badge/Supabase-2.0-3ECF8E?style=for-the-badge&logo=supabase)

**Platform Manajemen Administrasi untuk Sistem Pembelajaran Adaptif Numerasi**

🏆 **Finalis LIDM 2025 - Top 20**

[Demo](#) • [Dokumentasi](#) • [Lapor Bug](https://github.com/yourusername/adaptivin/issues)

</div>

---

## 📖 Tentang

**Adaptivin Admin Dashboard** adalah panel kontrol administratif untuk mengelola ekosistem pembelajaran adaptif Adaptivin. Platform ini memungkinkan administrator dan guru untuk:

- 📊 **Monitoring Real-time** - Memantau aktivitas siswa dan performa pembelajaran
- 👥 **Manajemen Pengguna** - Kelola akun guru, siswa, dan admin
- 📝 **Bank Soal** - Kurasikan dan kelola soal-soal numerasi adaptif
- 📈 **Analitik Mendalam** - Dashboard analitik untuk insight pembelajaran
- 🎓 **Asesmen Formatif** - Pantau progres asesmen berbasis data
- ⚙️ **Konfigurasi Sistem** - Atur parameter adaptive learning engine

## 🌟 Fitur Utama

### 🔐 Manajemen Akses Multi-Level
- Super Admin, Admin Sekolah, dan Guru
- Role-based access control (RBAC)
- Audit trail untuk setiap aktivitas

### 📊 Dashboard Analitik Komprehensif
- Visualisasi performa siswa real-time
- Statistik penggunaan platform
- Laporan kemajuan pembelajaran per kelas/individu
- Export data untuk analisis lanjutan

### 📚 Manajemen Konten
- CRUD lengkap untuk soal numerasi
- Kategorisasi berdasarkan tingkat kesulitan
- Preview dan validasi soal
- Bulk upload via Excel/CSV

### 👨‍🏫 Tools untuk Guru
- Monitor progres siswa secara individu
- Rekomendasi intervensi pembelajaran
- Laporan asesmen formatif
- Komunikasi dengan siswa

### 🎨 UI/UX Modern
- Design responsif untuk desktop dan tablet
- Dark mode support
- Animasi smooth dengan Framer Motion
- Material Design 3 principles

## 🛠️ Tech Stack

| Kategori | Teknologi |
|----------|-----------|
| **Framework** | Next.js 16.0 (App Router) |
| **Language** | TypeScript 5.0 |
| **UI Library** | Material-UI (MUI) v7.3 |
| **Styling** | Tailwind CSS v4 + Emotion |
| **Animation** | Framer Motion |
| **State Management** | React Context API |
| **Backend/Database** | Supabase (PostgreSQL) |
| **HTTP Client** | Axios |
| **Notifications** | SweetAlert2 |
| **Authentication** | Supabase Auth + JWT |

## 🚀 Getting Started

### Prerequisites

Pastikan Anda sudah menginstall:
- Node.js 18.x atau lebih baru
- npm atau yarn atau pnpm
- Git

### Installation

1. **Clone repository**
   ```bash
   git clone https://github.com/yourusername/adaptivin.git
   cd adaptivin/adaptivin-admin
   ```

2. **Install dependencies**
   ```bash
   npm install
   # atau
   yarn install
   # atau
   pnpm install
   ```

3. **Setup environment variables**

   Buat file `.env.local` di root folder:
   ```env
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

   # API Configuration
   NEXT_PUBLIC_API_URL=http://localhost:5000

   # App Configuration
   NEXT_PUBLIC_APP_URL=http://localhost:3001
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

5. **Open browser**

   Akses [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
# Pre-build check
npm run build:check

# Production build
npm run build:production

# Start production server
npm start
```

## 📁 Struktur Project

```
adaptivin-admin/
├── src/
│   ├── app/              # Next.js App Router pages
│   │   ├── dashboard/    # Main dashboard
│   │   ├── users/        # User management
│   │   ├── questions/    # Question bank
│   │   └── reports/      # Analytics & reports
│   ├── components/       # Reusable UI components
│   │   ├── ui/          # Base UI components
│   │   ├── forms/       # Form components
│   │   ├── tables/      # Table components
│   │   └── charts/      # Chart components
│   ├── contexts/         # React Context providers
│   ├── lib/             # Utility libraries
│   └── utils/           # Helper functions
├── public/              # Static assets
└── scripts/             # Build scripts
```

## 🔒 Authentication & Authorization

Platform menggunakan sistem autentikasi berbasis JWT dengan Supabase Auth:

1. **Login Flow**
   - User login dengan email/password
   - Server validasi dan return JWT token
   - Token disimpan di secure HTTP-only cookie
   - Setiap request menggunakan token untuk authorization

2. **Role Hierarchy**
   ```
   Super Admin (full access)
   ├── Admin Sekolah (manage sekolahnya)
   └── Guru (manage kelasnya)
   ```

## 📊 Integrasi dengan Backend

Admin dashboard berkomunikasi dengan backend melalui REST API:

```typescript
// Example API call
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true
});

// Get students data
const students = await api.get('/api/admin/students');

// Update question
await api.put('/api/admin/questions/:id', questionData);
```

## 🎨 Customization

### Theme Configuration

Edit `src/theme/theme.ts` untuk mengubah tema:

```typescript
export const theme = createTheme({
  palette: {
    primary: {
      main: '#your-color',
    },
    // ... other colors
  },
  typography: {
    fontFamily: 'Your Font',
  },
});
```

## 🧪 Testing

```bash
# Run linter
npm run lint

# Type checking
npm run type-check

# Build verification
npm run build:check
```

## 📈 Performance Optimization

- ✅ Server Components untuk faster initial load
- ✅ Dynamic imports untuk code splitting
- ✅ Image optimization dengan Next.js Image
- ✅ API response caching
- ✅ Lazy loading untuk tables dan charts

## 🤝 Contributing

Kontribusi sangat diterima! Silakan baca [CONTRIBUTING.md](../CONTRIBUTING.md) untuk detail.

## 📝 License

Project ini dikembangkan untuk kompetisi LIDM 2025. Untuk informasi lisensi, silakan hubungi tim pengembang.

## 👥 Tim Pengembang

Developed with ❤️ by Tim Adaptivin untuk LIDM 2025

## 🏆 Penghargaan

**Finalis LIDM 2025 - Top 20**

Adaptivin dikembangkan sebagai solusi kesenjangan kemampuan numerasi siswa sekolah dasar dan keterbatasan asesmen konvensional dalam memetakan kesulitan individual. Platform ini memadukan Rule-Based Adaptive Learning System dengan analisis AI untuk menghasilkan rekomendasi belajar yang personal.

## 📞 Support

- 📧 Email: support@adaptivin.com
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/adaptivin/issues)
- 📖 Docs: [Documentation](https://docs.adaptivin.com)

---

<div align="center">

**Berkontribusi pada SDG 4: Pendidikan Berkualitas**

Made with 💚 for Indonesian Education

</div>
