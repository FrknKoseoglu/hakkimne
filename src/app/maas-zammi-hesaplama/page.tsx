import { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { RaiseCalculator } from "@/components/calculators/RaiseCalculator";
import { TrendingUp, Info } from "lucide-react";
import { CURRENT_YEAR } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Maaş Zammı Hesaplama ${CURRENT_YEAR} | Zam Oranı ve Yeni Maaş Öğrenme`,
  description: "Maaşınıza yüzde kaç zam yapıldı? Veya %X zam alırsanız yeni maaşınız ne olur? En pratik maaş artış hesaplama aracı.",
  keywords: [
    "maaş zammı hesaplama",
    "zam oranı hesaplama",
    "maaş artışı hesaplama",
    "yeni maaş hesaplama",
    `${CURRENT_YEAR} maaş zammı`,
    "enflasyon zam karşılaştırma",
  ],
  openGraph: {
    title: `Maaş Zammı Hesaplama ${CURRENT_YEAR}`,
    description: "Maaşınıza yapılan zam oranını veya yeni maaşınızı kolayca hesaplayın.",
    type: "website",
  },
};

export default function MaasZammiHesaplamaPage() {
  return (
    <div className="min-h-screen bg-[var(--background-light)]">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-600 to-emerald-700 text-white py-10 md:py-14">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/20 mb-4">
            <TrendingUp className="w-8 h-8" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            Maaş Zammı Hesaplama
          </h1>
          <p className="text-lg opacity-90 max-w-2xl mx-auto">
            Maaşınıza yapılan zam oranını veya belirli bir zam oranıyla yeni maaşınızı kolayca hesaplayın.
          </p>
        </div>
      </section>

      {/* Calculator Section */}
      <section className="py-8 md:py-12">
        <div className="max-w-2xl mx-auto px-4">
          <RaiseCalculator />

          {/* Explanation */}
          <div className="mt-8 p-6 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <div>
                <h2 className="font-semibold text-[var(--text-main)] mb-2">
                  Nasıl Çalışır?
                </h2>
                <p className="text-sm text-[var(--text-muted)] mb-3">
                  Bu hesaplayıcı iki farklı mod sunar:
                </p>
                <ul className="text-sm text-[var(--text-muted)] space-y-2 list-disc list-inside">
                  <li>
                    <strong>Yeni Maaşı Hesapla:</strong> Mevcut maaşınızı ve zam oranını girin, yeni maaşınızı öğrenin.
                  </li>
                  <li>
                    <strong>Zam Oranını Hesapla:</strong> Eski ve yeni maaşınızı girin, zam oranınızı öğrenin.
                  </li>
                </ul>
                <p className="text-sm text-[var(--text-muted)] mt-3">
                  Hesaplama hem net hem brüt maaşlar için geçerlidir çünkü matematiksel oran aynı şekilde uygulanır.
                </p>
              </div>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="mt-4 p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
            <p className="text-xs text-amber-700 dark:text-amber-400">
              <strong>Not:</strong> Hesaplama matematiksel oran üzerinedir. Brütten nete geçişlerde vergi dilimi kaynaklı farklar oluşabilir. Kesin hesaplamalar için bordronuzu kontrol edin.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-sm text-[var(--text-muted)] border-t border-[var(--border-light)] bg-[var(--card)]/50">
        <div className="mx-auto max-w-7xl px-4">
          <p className="mb-2">© {CURRENT_YEAR} Hakkım Ne? - Tüm hakları saklıdır.</p>
          <p className="text-xs">
            Bu araç bilgilendirme amaçlıdır. Kesin hesaplamalar için bordronuzu veya işvereninizi kontrol edin.
          </p>
        </div>
      </footer>
    </div>
  );
}
