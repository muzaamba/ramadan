import type { Metadata } from "next";
import { Inter, Amiri } from "next/font/google";
import Navbar from "@/components/layout/Navbar";
import "./globals.css";
import { SocialProvider } from "@/contexts/SocialContext";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const amiri = Amiri({
  weight: ['400', '700'],
  subsets: ["arabic", "latin"],
  variable: "--font-serif"
});

export const metadata: Metadata = {
  title: "DeenTracker - Ramadan & Habit Tracking",
  description: "Track your prayers, reading, and habits during Ramadan and beyond.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${amiri.variable}`}>
        <SocialProvider>
          <Navbar />
          <main>
            {children}
          </main>
        </SocialProvider>
      </body>
    </html>
  );
}
