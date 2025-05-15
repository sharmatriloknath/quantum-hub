// app/layout.tsx
"use client"; // Add "use client" if using hooks like useState here

import type { Metadata } from "next"; // Metadata can still be exported from server component layouts
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { useState, useEffect, ReactNode } from "react"; // Import useState
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// If you need metadata, you might need a separate server component layout
// or handle it differently if this becomes a full client component.
// For now, let's assume metadata can be set elsewhere or this structure is fine.
// export const metadata: Metadata = { ... };

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-zinc-50 dark:bg-zinc-950`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Navbar />
          <main className="flex flex-col items-center justify-center min-h-screen pt-[65px] px-4">
            {children}
            <Footer />
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}