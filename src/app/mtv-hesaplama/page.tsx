import { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { MtvCalculator } from "@/components/calculators/MtvCalculator";
import { Car, Info } from "lucide-react";
import { CURRENT_YEAR } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Motorlu Taşıtlar Vergisi (MTV) Hesaplama ${CURRENT_YEAR} | Hakkım Ne?`,
  description: `${CURRENT_YEAR} yılı MTV tutarınızı hesaplayın. Otomobil, motosiklet ve elektrikli araçlar için güncel vergi tarifeleri, taksit seçenekleri ve banka kampanyaları.`,
  keywords: [
    "MTV hesaplama",
    "motorlu taşıtlar vergisi",
    `MTV ${CURRENT_YEAR}`,
    "MTV taksit",
    "araç vergisi hesaplama",
    "elektrikli araç MTV",
    "MTV ödeme",
    "MTV ne kadar",
    "MTV banka taksit",
  ],
  openGraph: {
    title: `Motorlu Taşıtlar Vergisi (MTV) Hesaplama ${CURRENT_YEAR}`,
    description: "Aracınızın MTV tutarını hesaplayın, taksit ve ödeme seçeneklerini öğrenin.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `MTV Hesaplama ${CURRENT_YEAR} | Hakkım Ne?`,
    description: "Aracınızın MTV tutarını hesaplayın, taksit ve ödeme seçeneklerini öğrenin.",
  },
  alternates: {
    canonical: "https://hakkimne.com/mtv-hesaplama",
  },
};

export default function MtvHesaplamaPage() {
  return (
    <div className="min-h-screen bg-[var(--background-light)]">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white py-10 md:py-14">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/20 mb-4">
            <Car className="w-8 h-8" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            Motorlu Taşıtlar Vergisi (MTV) Hesaplama
          </h1>
          <p className="text-lg opacity-90 max-w-2xl mx-auto">
            {CURRENT_YEAR} yılı için aracınızın MTV tutarını hesaplayın, taksit seçeneklerini ve banka kampanyalarını inceleyin.
          </p>
        </div>
      </section>

      {/* Calculator Section */}
      <section className="py-8 md:py-12">
        <div className="max-w-4xl mx-auto px-4">
          <MtvCalculator />

          {/* Legal Reference */}
          <div className="mt-8 p-6 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <div>
                <h2 className="font-semibold text-[var(--text-main)] mb-2">
                  MTV Nedir?
                </h2>
                <p className="text-sm text-[var(--text-muted)] mb-3">
                  Motorlu Taşıtlar Vergisi (MTV), Türkiye&apos;de tescil edilmiş motorlu araçlar için yılda iki taksit halinde ödenen bir vergidir. Verginin tutarı aracın motor hacmi/gücü, yaşı ve türüne göre belirlenir.
                </p>
                <h3 className="font-semibold text-[var(--text-main)] mb-2 text-sm">
                  {CURRENT_YEAR} Yılı Değişiklikleri
                </h3>
                <ul className="text-sm text-[var(--text-muted)] space-y-1">
                  <li>• MTV artış oranı: <strong>%18.95</strong> (Cumhurbaşkanı Kararı)</li>
                  <li>• 1. Taksit son ödeme: <strong>31 Ocak {CURRENT_YEAR}</strong></li>
                  <li>• 2. Taksit son ödeme: <strong>31 Temmuz {CURRENT_YEAR}</strong></li>
                  <li>• Elektrikli araçlar benzinli araçların <strong>1/4&apos;ü</strong> kadar MTV öder</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-sm text-[var(--text-muted)] border-t border-[var(--border-light)] bg-[var(--card)]/50">
        <div className="mx-auto max-w-7xl px-4">
          <p className="mb-2">© {CURRENT_YEAR} Hakkım Ne? - Tüm hakları saklıdır.</p>
          <p className="text-xs">
            Bu araç bilgilendirme amaçlıdır. Kesin MTV tutarı için GİB Dijital Vergi Dairesi&apos;ni kullanın.
          </p>
        </div>
      </footer>
    </div>
  );
}
