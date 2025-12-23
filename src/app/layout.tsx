import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#020617" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://hakkimne.com"),
  title: {
    default: "Hakkım Ne? | 2025 Güncel Kıdem ve İhbar Tazminatı Hesaplama Robotu",
    template: "%s | Hakkım Ne? - İşçi Hakları ve Tazminat Hesaplama",
  },
  description: "Hakkım Ne ile kıdem ve ihbar tazminatınızı saniyeler içinde hesaplayın. 2025 güncel verileri, brüt maaş ve yan haklar dahil en doğru hesaplama aracı.",
  keywords: [
    "kıdem tazminatı hesaplama",
    "ihbar tazminatı",
    "brüt maaş hesaplama",
    "işten çıkış kodları",
    "kod 29",
    "işsizlik maaşı hesaplama",
    "hakkım ne",
    "tazminat robotu",
    "2025 tazminat tavanı",
  ],
  authors: [{ name: "Hakkım Ne?", url: "https://hakkimne.com" }],
  creator: "Hakkım Ne?",
  publisher: "Hakkım Ne?",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Hakkım Ne? | 2025 Kıdem ve İhbar Tazminatı Hesaplama",
    description: "İşten mi ayrılıyorsunuz? Tazminat haklarınızı saniyeler içinde ücretsiz hesaplayın. 2025 güncel verileriyle en doğru sonuç.",
    url: "https://hakkimne.com",
    siteName: "Hakkım Ne?",
    locale: "tr_TR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hakkım Ne? | Tazminat Hesaplama Robotu",
    description: "Kıdem ve İhbar tazminatınızı hemen hesaplayın.",
    creator: "@hakkimne",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${inter.variable} font-sans antialiased bg-[var(--background-light)] text-[var(--text-main)]`}>
        <ThemeProvider>
          {children}
          <SpeedInsights />
        </ThemeProvider>
      </body>
    </html>
  );
}
