import { Geist, Geist_Mono } from "next/font/google";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Toaster } from "@/components/ui/toast";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: {
    default: "Kindora — Social Development Events",
    template: "%s | Kindora",
  },
  description:
    "Discover and join social development events near you — volunteering drives, community cleanups, education campaigns, health camps, and charity fundraisers.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full scroll-smooth antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        {/* Global toast viewport used by client components (forms, menus…). */}
        <Toaster />
      </body>
    </html>
  );
}
