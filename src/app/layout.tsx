import type { Metadata } from "next";
import { Bangers, Geist, Geist_Mono, Rubik } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const bangers = Bangers({
  weight: "400",
  variable: "--font-bangers",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Bingo do Debate",
  description: "Marque as frases do debate",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5160546340699166"
        crossOrigin="anonymous"></script>
      <body
        className={`${bangers.variable} ${bangers.className} antialiased`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
