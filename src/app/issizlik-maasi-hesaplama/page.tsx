import { Metadata } from "next";
import { Suspense } from "react";
import { Navbar } from "@/components/Navbar";
import { UnemploymentCalculator } from "@/components/calculators/UnemploymentCalculator";
import { CURRENT_YEAR } from "@/lib/constants";

export const metadata: Metadata = {
  title: `İşsizlik Maaşı Hesaplama ${CURRENT_YEAR} | Ne Kadar Maaş Alırım? - Hakkım Ne?`,
  description: `${CURRENT_YEAR} güncel işsizlik maaşı hesaplama robotu. Son 4 aylık brüt maaşınıza göre ne kadar ve kaç ay işsizlik maaşı alacağınızı hemen öğrenin.`,
  keywords: [
    "işsizlik maaşı hesaplama",
    "işsizlik maaşı ne kadar",
    "işsizlik maaşı süresi",
    "işsizlik sigortası",
    "işsizlik ödeneği",
    `${CURRENT_YEAR} işsizlik maaşı`,
    "işsizlik maaşı hesaplama robotu",
  ],
  openGraph: {
    title: `İşsizlik Maaşı Hesaplama ${CURRENT_YEAR} | Hakkım Ne?`,
    description: `${CURRENT_YEAR} güncel işsizlik maaşı hesaplama. Ne kadar ve kaç ay işsizlik maaşı alacağınızı hemen öğrenin.`,
    type: "website",
  },
};

export default function IsizlikMaasiPage() {
  return (
    <div className="min-h-screen bg-[var(--background-light)]">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[var(--primary)] to-blue-700 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3">
            İşsizlik Maaşı Hesaplama
          </h1>
          <p className="text-base md:text-lg opacity-90 max-w-2xl mx-auto">
            {CURRENT_YEAR} güncel verileriyle ne kadar ve kaç ay işsizlik maaşı
            alacağınızı hesaplayın.
          </p>
        </div>
      </section>


      {/* Calculator Section */}
      <section className="py-8">
        <div className="max-w-[960px] mx-auto px-4">
          <Suspense fallback={<div className="text-center">Yükleniyor...</div>}>
            <UnemploymentCalculator />
          </Suspense>
        </div>
      </section>

      {/* Info Section */}
      <section className="py-12 px-4 bg-[var(--muted)]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-center">
            İşsizlik Maaşı Hakkında
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[var(--card)] rounded-xl p-6 shadow-sm border border-[var(--border-light)]">
              <h3 className="font-semibold text-lg mb-3 text-[var(--primary)]">
                Kimler Alabilir?
              </h3>
              <ul className="space-y-2 text-sm text-[var(--text-muted)]">
                <li>• Son 3 yılda en az 600 gün prim ödenmiş olmalı</li>
                <li>• Son 120 gün kesintisiz çalışılmış olmalı</li>
                <li>• Kendi isteğiyle işten ayrılmamış olmalı</li>
                <li>• İŞKUR&apos;a 30 gün içinde başvurulmalı</li>
              </ul>
            </div>

            <div className="bg-[var(--card)] rounded-xl p-6 shadow-sm border border-[var(--border-light)]">
              <h3 className="font-semibold text-lg mb-3 text-[var(--primary)]">
                Ne Kadar Süre Alınır?
              </h3>
              <ul className="space-y-2 text-sm text-[var(--text-muted)]">
                <li>• 600 - 899 gün prim: <strong>6 ay</strong></li>
                <li>• 900 - 1079 gün prim: <strong>8 ay</strong></li>
                <li>• 1080 gün ve üzeri prim: <strong>10 ay</strong></li>
              </ul>
            </div>

            <div className="bg-[var(--card)] rounded-xl p-6 shadow-sm border border-[var(--border-light)]">
              <h3 className="font-semibold text-lg mb-3 text-[var(--primary)]">
                Nasıl Hesaplanır?
              </h3>
              <ul className="space-y-2 text-sm text-[var(--text-muted)]">
                <li>• Son 4 ayın brüt maaş ortalaması alınır</li>
                <li>• Bu tutarın <strong>%40&apos;ı</strong> işsizlik maaşıdır</li>
                <li>• Ancak asgari ücretin <strong>%80&apos;ini</strong> geçemez</li>
                <li>• Sadece damga vergisi kesilir</li>
              </ul>
            </div>

            <div className="bg-[var(--card)] rounded-xl p-6 shadow-sm border border-[var(--border-light)]">
              <h3 className="font-semibold text-lg mb-3 text-[var(--primary)]">
                Başvuru Nasıl Yapılır?
              </h3>
              <ul className="space-y-2 text-sm text-[var(--text-muted)]">
                <li>• e-Devlet veya İŞKUR şubesinden başvuru</li>
                <li>• İşten ayrılış tarihinden itibaren 30 gün içinde</li>
                <li>• Gerekli belgeler: kimlik, SGK belgesi</li>
                <li>• Ödemeler PTT veya banka hesabına yapılır</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-[var(--border-light)]">
        <div className="max-w-7xl mx-auto text-center text-sm text-[var(--text-muted)]">
          <p>
            Bu hesaplama aracı bilgilendirme amaçlıdır. Kesin sonuçlar için
            İŞKUR&apos;a başvurunuz.
          </p>
        </div>
      </footer>
    </div>
  );
}
