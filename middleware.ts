import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const role = req.cookies.get("role")?.value;

  const { pathname } = req.nextUrl;

  // Daftar halaman yang dilindungi (butuh autentikasi)
  const protectedPaths = [
    "/dashboard",
    "/kelola-sekolah",
    "/kelola-admin",
    "/kelola-kelas",
    "/kelola-pengguna",
    "/pengaturan",
  ];

  // Halaman khusus superadmin
  const superadminOnlyPaths = ["/kelola-sekolah", "/kelola-admin"];

  // Halaman auth (login/register)
  const authPaths = ["/masuk", "/daftar"];

  // Cek apakah user mencoba akses halaman protected tanpa login
  const isProtectedPath = protectedPaths.some((path) =>
    pathname.startsWith(path)
  );

  if (!token && isProtectedPath) {
    console.log(`🚫 Unauthorized access attempt to: ${pathname}`);
    return NextResponse.redirect(new URL("/masuk", req.url));
  }

  // Jika user sudah login tapi mencoba buka halaman login, redirect ke dashboard
  if (token && authPaths.includes(pathname)) {
    console.log(`✅ Already authenticated, redirecting to dashboard`);
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Cek role untuk halaman superadmin-only
  if (token && role !== "superadmin") {
    const isSuperadminPath = superadminOnlyPaths.some((path) =>
      pathname.startsWith(path)
    );

    if (isSuperadminPath) {
      console.log(
        `🚫 Insufficient permissions for ${pathname}. Role: ${role}`
      );
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  return NextResponse.next();
}

// Tentukan halaman mana yang dilindungi middleware ini
export const config = {
  matcher: [
    // Protected pages
    "/dashboard/:path*",
    "/kelola-sekolah/:path*",
    "/kelola-admin/:path*",
    "/kelola-kelas/:path*",
    "/kelola-pengguna/:path*",
    "/pengaturan/:path*",
    // Auth pages
    "/masuk",
    "/daftar",
  ],
};
