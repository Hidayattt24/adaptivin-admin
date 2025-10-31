import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Adaptivin Admin - Sistem AI Pembelajaran Matematika SD",
  description:
    "Sistem AI Berbasis Web untuk Identifikasi Kesulitan dan Rekomendasi Belajar Matematika Siswa SD",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={`${poppins.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
