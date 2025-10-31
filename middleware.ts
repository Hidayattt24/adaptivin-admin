import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  const { pathname } = req.nextUrl;

  // Jika user belum login dan mau masuk ke halaman admin, arahkan ke login
  if (!token && pathname.startsWith("/kelola")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Jika user sudah login tapi mencoba buka halaman login, arahkan ke dashboard
  if (token && pathname === "/login") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

// Tentukan halaman mana yang dilindungi middleware ini
export const config = {
  matcher: ["/dashboard/:path*", "/login"],
};
