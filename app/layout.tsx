import type { Metadata } from "next";
import Script from "next/script";
import { IBM_Plex_Mono, Space_Grotesk } from "next/font/google";

import "./globals.css";

const heading = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["500", "600", "700"]
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"]
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Personal Tech Showcase",
    template: "%s | Personal Tech Showcase"
  },
  description:
    "Turn your GitHub repositories into polished, outcome-focused portfolio pages with live demos, stack insights, and impact metrics recruiters care about.",
  keywords: [
    "developer portfolio",
    "GitHub portfolio",
    "project showcase",
    "portfolio builder",
    "developer branding"
  ],
  openGraph: {
    title: "Personal Tech Showcase",
    description:
      "Automatically transform your repositories into compelling technical case studies.",
    url: siteUrl,
    siteName: "Personal Tech Showcase",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Personal Tech Showcase",
    description:
      "Share your personal tech projects beautifully with automated GitHub storytelling."
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${heading.variable} ${mono.variable} bg-[#0d1117] text-slate-100 antialiased`}
      >
        <Script src="https://assets.lemonsqueezy.com/lemon.js" strategy="afterInteractive" />
        {children}
      </body>
    </html>
  );
}
