import { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { NetToGrossCalculator } from "@/components/calculators/NetToGrossCalculator";
import { Calculator, Info } from "lucide-react";
import { CURRENT_YEAR } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Netten Brüte Maaş Hesaplama ${CURRENT_YEAR} | Net Maaştan Brüt Maaş Hesaplama`,
  description: "Net maaşınızın brüt karşılığını ve işverene maliyetini öğrenin. SGK, gelir vergisi, damga vergisi ve AGİ hesaplamaları ile detaylı sonuçlar.",
  keywords: [
    "netten brüte hesaplama",
    "net brüt maaş hesaplama",
    "brüt maaş hesaplama",
    `${CURRENT_YEAR} brüt maaş`,
    "agi hesaplama",
    "işverene maliyet hesaplama",
    "gelir vergisi hesaplama",
  ],
  openGraph: {
    title: `Netten Brüte Maaş Hesaplama ${CURRENT_YEAR}`,
    description: "Net maaşınızın brüt karşılığını ve işverene maliyetini kolayca hesaplayın.",
    type: "website",
  },
};

export default function NettenBruteHesaplamaPage() {
  return (
    <div className="min-h-screen bg-[var(--background-light)]">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-600 to-indigo-700 text-white py-10 md:py-14">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/20 mb-4">
            <Calculator className="w-8 h-8" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            Netten Brüte Maaş Hesaplama
          </h1>
          <p className="text-lg opacity-90 max-w-2xl mx-auto">
            Net maaşınızın aylık ne kadar brüt ücrete denk geldiğini ve çalışanın işverene maliyetini 
            kesinti tutarlarıyla birlikte öğrenin.
          </p>
        </div>
      </section>

      {/* Calculator Section */}
      <section className="py-8 md:py-12">
        <div className="max-w-6xl mx-auto px-4">
          <NetToGrossCalculator />

          {/* Explanation */}
          <div className="mt-8 p-6 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <div>
                <h2 className="font-semibold text-[var(--text-main)] mb-2">
                  Nasıl Çalışır?
                </h2>
                <p className="text-sm text-[var(--text-muted)] mb-3">
                  Bu hesaplayıcı net maaşınızdan geriye doğru hesaplama yaparak brüt maaşınızı bulur:
                </p>
                <ul className="text-sm text-[var(--text-muted)] space-y-2 list-disc list-inside">
                  <li>
                    <strong>SGK Primi:</strong> Çalışan ve işveren payı ayrı ayrı hesaplanır.
                  </li>
                  <li>
                    <strong>Gelir Vergisi:</strong> Artan oranlı vergi dilimleri uygulanarak hesaplanır.
                  </li>
                  <li>
                    <strong>Damga Vergisi:</strong> Brüt ücretin %0,759&apos;u olarak hesaplanır.
                  </li>
                  <li>
                    <strong>AGİ (Asgari Geçim İndirimi):</strong> Aile durumunuza göre vergi indirim tutarı hesaplanır.
                  </li>
                  <li>
                    <strong>İşverene Maliyet:</strong> Tüm işveren payları ve teşvikler dahil toplam maliyet gösterilir.
                  </li>
                </ul>
                <p className="text-sm text-[var(--text-muted)] mt-3">
                  Aylık bazda hesaplama yapabilir ve kümülatif vergi matrahınızı da dikkate alabilirsiniz.
                </p>
              </div>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="mt-4 p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
            <p className="text-xs text-amber-700 dark:text-amber-400">
              <strong>Not:</strong> Bu hesaplama genel vergi oranları ve SGK kesintileri üzerinden yapılmaktadır. 
              Kesin hesaplamalar için bordronuzu veya işvereninizi kontrol edin. Özel durumlar (ek kazançlar, primsiz 
              gün sayıları vb.) hesaba katılmamıştır.
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
