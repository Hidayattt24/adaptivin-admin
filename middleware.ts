import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const role = req.cookies.get("role")?.value;

  const { pathname } = req.nextUrl;

  // Jika user belum login dan mau masuk ke halaman protected, arahkan ke login
  if (
    !token &&
    (pathname.startsWith("/dashboard") ||
      pathname.startsWith("/kelola") ||
      pathname.startsWith("/pengaturan"))
  ) {
    return NextResponse.redirect(new URL("/masuk", req.url));
  }

  // Jika user sudah login tapi mencoba buka halaman login/daftar, arahkan ke dashboard
  if (token && (pathname === "/masuk" || pathname === "/daftar")) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Jika bukan superadmin tapi mencoba akses halaman superadmin-only
  if (token && role !== "superadmin") {
    if (pathname === "/kelola-sekolah" || pathname === "/kelola-admin") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  return NextResponse.next();
}

// Tentukan halaman mana yang dilindungi middleware ini
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/kelola-sekolah/:path*",
    "/kelola-admin/:path*",
    "/kelola-kelas/:path*",
    "/kelola-pengguna/:path*",
    "/pengaturan/:path*",
    "/masuk",
    "/daftar",
  ],
};
