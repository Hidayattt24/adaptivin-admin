# 🚀 Adaptivin Admin - Deployment Guide

Panduan deployment aplikasi Adaptivin Admin ke Vercel.

## 📋 Pre-requisites

- Node.js 18.x atau lebih tinggi
- npm atau yarn
- Akun Vercel
- Backend API sudah running
- Supabase project sudah setup

## 🛠️ Setup Environment Variables

### 1. Create `.env.local` file

```bash
cp .env.example .env.local
```

### 2. Update values

```env
# API Configuration
NEXT_PUBLIC_API_URL=https://your-backend-api.vercel.app/api

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

## 🏗️ Local Build Test

```bash
# Install dependencies
npm install

# Run pre-build check
npm run pre-build

# Build for production
npm run build

# Test production build locally
npm run start
```

## 🚀 Deploy ke Vercel Desktop

### 1. Import Project

- Buka Vercel Desktop
- Klik "Import Project"
- Pilih folder `adaptivin-admin`

### 2. Configure Project

```
Framework Preset: Next.js
Build Command: npm run build
Output Directory: .next
Install Command: npm install
```

### 3. Set Environment Variables

Di Vercel Dashboard → Project Settings → Environment Variables:

```
NEXT_PUBLIC_API_URL=https://your-backend.vercel.app/api
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 4. Deploy

- Klik "Deploy"
- Wait for build (3-5 minutes)
- Test deployed URL

## 🧪 Post-Deployment Checklist

- [ ] Homepage loads
- [ ] Login Superadmin works
- [ ] Dashboard accessible
- [ ] API connection working
- [ ] Navigation works
- [ ] All pages load correctly

## 🐛 Troubleshooting

### Build Errors

**Type Errors:**

```bash
npm run build
# Fix TypeScript errors
```

**Environment Variables:**

- Verify all env vars in Vercel Dashboard
- Redeploy after updating

### Runtime Errors

**API Connection Failed:**

- Check NEXT_PUBLIC_API_URL
- Verify backend is running
- Check CORS settings

**Auth Not Working:**

- Verify Supabase keys
- Check middleware.ts
- Clear cookies and retry

## 🔄 Update Deployment

### Auto-deploy

1. Connect repo to Vercel
2. Push to main branch
3. Vercel auto-deploys

### Manual deploy

```bash
vercel --prod
```

## 🎯 Test Accounts

### Superadmin (after seeding backend)

- Email: superadmin@gmail.com
- Password: Superadmin123!

---

**Ready to Deploy! 🚀**
