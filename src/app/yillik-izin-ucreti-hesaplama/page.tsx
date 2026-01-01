import { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { AnnualLeavePaymentCalculator } from "@/components/calculators/AnnualLeavePaymentCalculator";
import { DollarSign } from "lucide-react";
import { CURRENT_YEAR } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Yıllık İzin Ücreti Hesaplama ${CURRENT_YEAR} | Kullanılmayan İzin Harcı`,
  description: "Kullanılmayan yıllık izin günlerinizin ücretini hesaplayın. İşten ayrılırken ödenecek izin harcı tutarını SGK ve vergi kesintileriyle birlikte öğrenin.",
  keywords: [
    "yıllık izin ücreti hesaplama",
    "kullanılmayan izin harcı",
    `${CURRENT_YEAR} izin ücreti`,
    "izin ücreti hesaplama",
    "işten ayrılma izin parası",
    "yıllık izin tazminatı",
  ],
  openGraph: {
    title: `Y\u0131ll\u0131k İzin Ücreti Hesaplama ${CURRENT_YEAR}`,
    description: "Kullanılmayan yıllık izin günlerinizin ücretini kolayca hesaplayın.",
    type: "website",
  },
};

export default function YillikIzinUcretiHesaplamaPage() {
  return (
    <div className="min-h-screen bg-[var(--background-light)]">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[var(--primary)] to-blue-700 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3">
            Yıllık İzin Ücreti Hesaplama
          </h1>
          <p className="text-base md:text-lg opacity-90 max-w-2xl mx-auto">
            {CURRENT_YEAR} güncel vergi dilimlerini dikkate alarak kullanılmayan yıllık izin harcınızı hesaplayın.
          </p>
        </div>
      </section>

      {/* Calculator */}
      <main className="mx-auto max-w-[960px] px-4 py-8">
        <AnnualLeavePaymentCalculator />
      </main>

      {/* SEO Content Section */}
      <section className="mx-auto max-w-[960px] px-4 pb-12">
        <div className="border-t border-[var(--border-light)] pt-8">
          <h2 className="text-2xl font-bold text-[var(--text-main)] mb-4">
            Yıllık İzin Ücreti Nasıl Hesaplanır?
          </h2>
          <div className="prose prose-slate max-w-none text-[var(--text-muted)]">
            <p className="mb-4">
              Y\u0131ll\u0131k izin ücreti, kullanılmayan yıllık izin günleriniz için işten ayrılırken 
              alacağınız ödemedir. <strong>Hakkım Ne?</strong> hesaplama robotu, 
              {CURRENT_YEAR} güncel vergi dilimlerini ve kesintileri dikkate alarak size en doğru sonucu verir.
            </p>
            <p className="mb-4">
              İş sözleşmesi sona erdiğinde, hak ettiğiniz ancak kullanamadığınız yıllık izin günleri 
              için işvereniniz tarafından ödeme yapılması zorunludur. Önceki yıllardan birikmiş 
              izinler de bu ödemeye dahildir.
            </p>
            <h3 className="text-xl font-semibold text-[var(--text-main)] mt-6 mb-3">Hesaplama Detayları</h3>
            <ul className="list-disc pl-5 space-y-2 mb-4">
              <li>
                <strong>Günlük Brüt Ücret:</strong> Aylık brüt maaşınız 30'a bölünerek bulunur.
              </li>
              <li>
                <strong>Brüt İzin Ücreti:</strong> Günlük brüt ücret × Kullanılmayan gün sayısı
              </li>
              <li>
                <strong>Kesintiler:</strong> SGK (%14), İşsizlik Sigortası (%1), Gelir Vergisi, Damga Vergisi (%0.759)
                <span className="text-sm text-blue-500 block mt-1">(Normal maaş kesintileri ile aynıdır)</span>
              </li>
            </ul>
            <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border border-amber-100 dark:border-amber-800 mt-6">
              <h4 className="font-bold text-amber-800 dark:text-amber-300 mb-2">⚠️ Önemli Bilgiler</h4>
              <ul className="text-sm text-amber-700 dark:text-amber-400 space-y-1">
                <li>• Sadece iş sözleşmesi sona erdiğinde ödenir</li>
                <li>• İş devam ederken izin yerine ücret talep edilemez</li>
                <li>• Son çalışma ayındaki brüt maaş baz alınır</li>
                <li>• Yıllık izin alacakları için zamanaşımı süresi 5 yıldır</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Privacy & Data Security Section */}
      <section className="mx-auto max-w-[960px] px-4 py-6">
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-green-800 dark:text-green-300 text-lg mb-2">
                🔒 Hesaplama Güvenliği
              </h3>
              <p className="text-green-700 dark:text-green-400 text-sm leading-relaxed">
                Hakkım Ne? üzerinde yaptığınız tüm hesaplamalar, tamamen <strong>kendi cihazınızda (tarayıcınızda)</strong> gerçekleşir. 
                Girdiğiniz maaş bilgileri sunucularımıza gönderilmez, veritabanlarımızda saklanmaz ve 3. şahıslarla paylaşılmaz. 
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
            Bu araç bilgilendirme amaçlıdır. Kesin hesaplamalar için bir iş hukuku uzmanına danışın.
          </p>
        </div>
      </footer>
    </div>
  );
}
