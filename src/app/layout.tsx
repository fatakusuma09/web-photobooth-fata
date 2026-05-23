import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfitFont = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "📸 Web-Based Simple Photobooth | GIF Animasi & Kolase",
  description: "Aplikasi Photobooth berbasis web. Ambil foto menggunakan kamera WebRTC, pilih frame dan filter estetik, lalu unduh hasilnya sebagai GIF animasi atau kolase foto.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${outfitFont.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#fdfaf6] text-[#2d2a2e] font-sans">
        {children}
      </body>
    </html>
  );
}
