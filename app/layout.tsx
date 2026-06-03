import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Aura 2026 - Jardines del Renacer",
  description: "Sistema de Proyección Corporativo",
  icons: {
    icon: "/imagenes/log_footer.webp",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      style={{ backgroundColor: '#E3F2FD' }}
    >
      <body className="min-h-full flex flex-col text-slate-800" style={{ backgroundColor: '#E3F2FD' }}>{children}</body>
    </html>
  );
}
