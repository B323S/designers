import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Designers Box",
  description: "Organización creativa y clara para tus estudios.",
};

import { Providers } from "@/components/Providers";

// ... (imports)

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${outfit.variable} font-sans antialiased min-h-screen flex flex-col bg-peach-50`}>
        <Providers>
          <Navbar />
          <div className="flex flex-1">
            <Sidebar />
            <main className="flex-1 w-full relative overflow-x-hidden p-6 md:p-8">
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
