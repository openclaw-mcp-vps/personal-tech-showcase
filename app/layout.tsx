import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ShowBuild | Share your personal tech projects beautifully",
  description:
    "Turn your GitHub repositories into recruiter-ready project showcases with live demos, code stories, and measurable impact.",
  metadataBase: new URL("https://showbuild.dev"),
  openGraph: {
    title: "ShowBuild",
    description:
      "Portfolio builder for developers who want their technical depth to stand out.",
    url: "https://showbuild.dev",
    siteName: "ShowBuild",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "ShowBuild portfolio builder preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ShowBuild",
    description:
      "Auto-generate a technical portfolio from your GitHub repos, commits, and deployment links.",
    images: ["/og-image.png"],
  },
  keywords: [
    "developer portfolio",
    "GitHub portfolio",
    "technical showcase",
    "recruiter portfolio",
    "freelancer branding",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${jetBrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-[#0d1117] text-[#e6edf3]">{children}</body>
    </html>
  );
}
