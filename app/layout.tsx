import type { Metadata } from "next";
import { IBM_Plex_Sans, Space_Grotesk } from "next/font/google";
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";
import "./globals.css";

const plexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "700"],
});

export const metadata: Metadata = {
  title: "RoomID — Privacy-preserving rental identity",
  description:
    "Transform your rental history into a portable, privacy-preserving credential. Powered by Noir zk-proofs on EVM.",
  icons: { icon: "/favicon.svg" },
  openGraph: {
    title: "RoomID — Privacy-preserving rental identity",
    description: "Transform your rental history into a portable, privacy-preserving credential.",
    type: "website",
    siteName: "RoomID",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "RoomID — Privacy-preserving rental identity",
    description: "Transform your rental history into a portable, privacy-preserving credential.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${plexSans.variable} ${spaceGrotesk.variable}`}>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
