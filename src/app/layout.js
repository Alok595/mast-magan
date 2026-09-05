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

export const metadata = {
  metadataBase: new URL("https://dhun.com"), // Replace with actual domain when ready
  title: {
    default: "Dhun | Handpicked Nostalgic Vibes",
    template: "%s | Dhun"
  },
  description: "A premium community-driven platform for curating, sharing, and discovering nostalgic mixtapes and soulful music vibes.",
  keywords: ["music", "mixtapes", "nostalgia", "lofi", "bollywood lofi", "indie", "playlist curator"],
  authors: [{ name: "Dhun Community" }],
  creator: "Dhun Studio",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://dhun.com",
    title: "Dhun | Handpicked Nostalgic Vibes",
    description: "Discover curated nostalgic mixtapes and soulful music vibes on Dhun.",
    siteName: "Dhun",
    images: [
      {
        url: "/og-image.jpg", // We'll assume an og-image exists or user can add later
        width: 1200,
        height: 630,
        alt: "Dhun - Nostalgic Vibes",
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dhun | Handpicked Nostalgic Vibes",
    description: "Discover curated nostalgic mixtapes and soulful music vibes on Dhun.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

import AuthProvider from "@/components/AuthProvider";
import LenisProvider from "@/components/LenisProvider";
import GlobalPlayer from "@/components/GlobalPlayer";

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#140C07] text-[#E8DCC4]">
        <AuthProvider>
          <LenisProvider>
            {children}
            <GlobalPlayer />
          </LenisProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
