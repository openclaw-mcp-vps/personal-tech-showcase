import type { Metadata } from "next";
import { Manrope, Space_Grotesk } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const siteUrl = "https://personal-tech-showcase.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "personal-tech-showcase",
    template: "%s | personal-tech-showcase",
  },
  description:
    "Turn GitHub repositories into high-converting project portfolios with demo links, tech stack analysis, and impact metrics.",
  keywords: [
    "developer portfolio",
    "github portfolio",
    "tech showcase",
    "project storytelling",
    "freelancer branding",
  ],
  openGraph: {
    title: "personal-tech-showcase",
    description:
      "Share your personal tech projects beautifully with commit velocity, stack insights, and live demo proof.",
    type: "website",
    url: siteUrl,
    siteName: "personal-tech-showcase",
  },
  twitter: {
    card: "summary_large_image",
    title: "personal-tech-showcase",
    description:
      "Automated portfolio builder for developers who need stronger technical positioning.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`dark ${manrope.variable} ${spaceGrotesk.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-[#0d1117] text-[#e6edf3]">{children}</body>
    </html>
  );
}
