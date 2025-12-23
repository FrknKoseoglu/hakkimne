import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Hakkım Ne? | Kıdem ve İhbar Tazminatı Hesaplayıcı",
  description: "Türk İş Kanunu'na göre kıdem tazminatı ve ihbar tazminatı hesaplayın. Ücretsiz, hızlı ve güncel tavan oranları ile online hesaplama aracı.",
  keywords: ["kıdem tazminatı", "ihbar tazminatı", "tazminat hesaplama", "işten çıkarma hakları", "işçi hakları", "tazminat hesaplayıcı"],
  openGraph: {
    title: "Hakkım Ne? | Kıdem ve İhbar Tazminatı Hesaplayıcı",
    description: "Türk İş Kanunu'na göre kıdem ve ihbar tazminatınızı hesaplayın.",
    type: "website",
    locale: "tr_TR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0"
        />
      </head>
      <body className={`${inter.variable} font-sans antialiased bg-[var(--background-light)] text-[var(--text-main)]`}>
        {children}
      </body>
    </html>
  );
}
