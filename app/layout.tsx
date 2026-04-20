import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"]
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"]
});

export const metadata: Metadata = {
  metadataBase: new URL("https://personal-tech-showcase.dev"),
  title: {
    default: "Personal Tech Showcase",
    template: "%s | Personal Tech Showcase"
  },
  description:
    "Turn GitHub repositories into polished project showcases with live demos, technical depth, and measurable engineering impact.",
  keywords: [
    "developer portfolio",
    "github portfolio generator",
    "technical project showcase",
    "portfolio builder for developers",
    "freelancer portfolio"
  ],
  openGraph: {
    title: "Personal Tech Showcase",
    description:
      "Share your personal tech projects beautifully with auto-generated stories, stack highlights, and impact metrics.",
    type: "website",
    url: "https://personal-tech-showcase.dev",
    siteName: "Personal Tech Showcase"
  },
  twitter: {
    card: "summary_large_image",
    title: "Personal Tech Showcase",
    description:
      "Build a recruiter-ready technical portfolio from your GitHub repositories in minutes, not weekends."
  },
  robots: {
    index: true,
    follow: true
  }
};

export const viewport: Viewport = {
  themeColor: "#0d1117"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
        <Script src="https://assets.lemonsqueezy.com/lemon.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
