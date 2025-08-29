import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { defaultMetadata } from "@/utils/metadata";

import Footer from "@/components/shared/footer";
import Header from "@/components/shared/header";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  ...defaultMetadata,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased min-h-screen bg-background`}>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
