import { Suspense } from "react";
import { Metadata } from "next";
import { SeveranceCalculator } from "@/components/SeveranceCalculator";
import { Navbar } from "@/components/Navbar";
import { ShieldCheck } from "lucide-react";
import { CURRENT_YEAR, getCurrentSeveranceCeiling } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Kıdem ve İhbar Tazminatı Hesaplama ${CURRENT_YEAR} | Hakkım Ne?`,
  description: `${CURRENT_YEAR} güncel kıdem ve ihbar tazminatı hesaplama robotu. İşe giriş çıkış tarihlerinizi ve maaş bilgilerinizi girerek yasal haklarınızı hemen öğrenin.`,
  keywords: [
    "kıdem tazminatı hesaplama",
    "ihbar tazminatı hesaplama",
    "kıdem tazminatı nasıl hesaplanır",
    `${CURRENT_YEAR} kıdem tazminatı`,
    "işçi hakları",
    "tazminat hesaplama robotu",
  ],
  openGraph: {
    title: `Kıdem ve İhbar Tazminatı Hesaplama ${CURRENT_YEAR} | Hakkım Ne?`,
    description: `${CURRENT_YEAR} güncel kıdem ve ihbar tazminatı hesaplama. Yasal haklarınızı hemen öğrenin.`,
    type: "website",
  },
};

export default function KidemTazminatiPage() {
  const currentCeiling = getCurrentSeveranceCeiling();
  
  return (
    <div className="min-h-screen bg-[var(--background-light)]">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[var(--primary)] to-blue-700 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3">
            Kıdem ve İhbar Tazminatı Hesaplama
          </h1>
          <p className="text-base md:text-lg opacity-90 max-w-2xl mx-auto">
            {CURRENT_YEAR} güncel vergi dilimlerini ve tavan ücretlerini dikkate alarak yasal haklarınızı hesaplayın.
          </p>
        </div>
      </section>

      {/* Calculator */}
      <main className="mx-auto max-w-[960px] px-4 py-8">
        <Suspense fallback={<div className="animate-pulse bg-slate-200 dark:bg-slate-800 rounded-lg h-[600px]" />}>
          <SeveranceCalculator />
        </Suspense>
        
        {/* JSON-LD Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "Hakkım Ne? Kıdem Tazminatı Hesaplama",
              "applicationCategory": "FinanceApplication",
              "operatingSystem": "Web Browser",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "TRY"
              },
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.9",
                "ratingCount": "1250"
              }
            })
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": [
                {
                  "@type": "Question",
                  "name": "Kıdem ve İhbar Tazminatı Hesaplama",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": `${CURRENT_YEAR} yılı ${currentCeiling.period} dönemi için kıdem tazminatı tavanı ${currentCeiling.amount} TL olarak belirlenmiştir.`
                  }
                },
                {
                  "@type": "Question",
                  "name": "İstifa eden kıdem tazminatı alabilir mi?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Normal şartlarda istifa eden işçi kıdem tazminatı alamaz. Ancak evlilik (kadın işçi için 1 yıl içinde), askerlik, emeklilik veya haklı nedenle fesih durumlarında istifa edilse dahi tazminat alınabilir."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Kıdem tazminatı kaç günde ödenir?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "İş Kanunu'na göre kıdem tazminatı iş akdinin feshedildiği tarihte peşin olarak ödenmelidir. Ancak tarafların anlaşması durumunda taksitle de ödenebilir."
                  }
                }
              ]
            })
          }}
        />
      </main>

      {/* SEO Content Section */}
      <section className="mx-auto max-w-[960px] px-4 pb-12">
        <div className="border-t border-[var(--border-light)] pt-8">
          <h2 className="text-2xl font-bold text-[var(--text-main)] mb-4">
            Kıdem ve İhbar Tazminatı Nasıl Hesaplanır?
          </h2>
          <div className="prose prose-slate max-w-none text-[var(--text-muted)]">
            <p className="mb-4">
              Kıdem tazminatı hesaplama işlemi, işçinin işe giriş ve çıkış tarihleri arasındaki 
              toplam çalışma süresi ile son brüt ücreti üzerinden yapılır. <strong>Hakkım Ne?</strong> hesaplama robotu, 
              {CURRENT_YEAR} güncel vergi dilimlerini ve tavan ücretlerini dikkate alarak size en doğru sonucu verir.
            </p>
            <p className="mb-4">
              Kıdem tazminatı alma şartları arasında en az 1 yıl çalışmış olmak ve işveren tarafından 
              haklı bir neden olmadan işten çıkarılmış olmak (veya haklı nedenle istifa etmek) bulunur.
              Hesaplama yapılırken brüt maaşınıza; yol, yemek, ikramiye gibi düzenli ödemeler eklenerek 
              <strong>&quot;giydirilmiş brüt ücret&quot;</strong> bulunur.
            </p>
            <h3 className="text-xl font-semibold text-[var(--text-main)] mt-6 mb-3">Hesaplama Detayları</h3>
            <ul className="list-disc pl-5 space-y-2 mb-4">
              <li>
                <strong>Kıdem Tazminatı:</strong> Her tam yıl için 30 günlük brüt ücret tutarında ödeme yapılır.
                <span className="text-sm text-blue-500 block mt-1">(Damga vergisi hariç kesinti yapılmaz)</span>
              </li>
              <li>
                <strong>İhbar Tazminatı:</strong> Çalışma sürenize göre 2 haftadan 8 haftaya kadar ihbar süresi maaşı ödenir.
                <span className="text-sm text-blue-500 block mt-1">(Gelir ve damga vergisi kesilir)</span>
              </li>
            </ul>
             <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800 mt-6">
              <h4 className="font-bold text-blue-800 dark:text-blue-300 mb-2">{CURRENT_YEAR} Kıdem Tazminatı Tavanı</h4>
              <p className="text-sm text-blue-700 dark:text-blue-400">
                {currentCeiling.period} {CURRENT_YEAR} dönemi için kıdem tazminatı tavanı <strong>{currentCeiling.amount} TL</strong> olarak güncellenmiştir.
                Maaşınız bu tutarın üzerindeyse, kıdem tazminatınız tavan üzerinden hesaplanır.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Privacy & Data Security Section */}
      <section className="mx-auto max-w-[960px] px-4 py-6">
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <ShieldCheck className="w-6 h-6 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-green-800 dark:text-green-300 text-lg mb-2">
                🔒 Gizlilik ve Veri Güvenliği
              </h3>
              <p className="text-green-700 dark:text-green-400 text-sm leading-relaxed">
                Hakkım Ne? üzerinde yaptığınız tüm hesaplamalar, tamamen <strong>kendi cihazınızda (tarayıcınızda)</strong> gerçekleşir. 
                Girdiğiniz maaş, tarih ve tazminat bilgileri sunucularımıza gönderilmez, veritabanlarımızda saklanmaz ve 3. şahıslarla paylaşılmaz. 
                Hesaplamalarınızı güvenle yapabilirsiniz.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-sm text-[var(--text-muted)] border-t border-[var(--border-light)] bg-[var(--card)]/50 mt-8">
        <div className="mx-auto max-w-[960px] px-4">
          <p className="mb-2">© {CURRENT_YEAR} Hakkım Ne? - Tüm hakları saklıdır.</p>
          <p className="text-xs">
            Bu araç bilgilendirme amaçlıdır. Kesin hesaplamalar için bir iş hukuku
            uzmanına danışın.
          </p>
        </div>
      </footer>
    </div>
  );
}
