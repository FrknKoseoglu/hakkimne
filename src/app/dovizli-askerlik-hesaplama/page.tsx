import { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { CURRENT_YEAR } from "@/lib/constants";
import { BEDELLI_ASKERLIK } from "@/lib/financial-data";
import { getCachedExchangeRates } from "@/lib/currency-service";
import { Calendar, TrendingUp, Euro, DollarSign, AlertCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "2026 Dövizli Askerlik Ücreti Ne Kadar? (Euro/Dolar Hesaplama) | Hakkım Ne?",
  description:
    "Yurtdışında yaşayanlar için 2026 dövizli askerlik hesaplama robotu. Almanya, Fransa ve diğer ülkelerden ödeme yapacaklar için güncel TCMB kurlarıyla Euro ve Dolar karşılığı.",
  keywords: [
    "dövizli askerlik",
    "bedelli askerlik euro",
    "bedelli askerlik dolar",
    "yurtdışından askerlik",
    "almanya askerlik",
    "fransa askerlik",
    "döviz hesaplama",
    "TCMB kur",
    "bedelli askerlik 2026",
  ],
  openGraph: {
    title: "2026 Dövizli Askerlik Ücreti Hesaplama | Hakkım Ne?",
    description:
      "Yurtdışında yaşayanlar için güncel TCMB kurlarıyla Euro ve Dolar karşılığı bedelli askerlik ücreti hesaplama.",
    type: "website",
  },
};

function formatCurrency(amount: number, locale = "tr-TR", currency = "TRY"): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export default async function DovizliAskerlikPage() {
  // Calculate current Bedelli fee
  const bedelliFee = BEDELLI_ASKERLIK.BEDELLI_GOSTERGE * BEDELLI_ASKERLIK.MEMUR_MAAS_KATSAYISI;

  // Fetch exchange rates
  const rates = await getCachedExchangeRates();

  // Calculate foreign currency amounts
  const euroAmount = bedelliFee / rates.EUR;
  const usdAmount = bedelliFee / rates.USD;

  return (
    <div className="min-h-screen bg-[var(--background-light)]">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[var(--primary)] to-blue-700 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3">
            2026 Dövizli Askerlik Hesaplama
          </h1>
          <p className="text-base md:text-lg opacity-90 max-w-2xl mx-auto">
            Yurtdışında yaşayanlar için güncel TCMB kurlarıyla Euro ve Dolar
            karşılığı bedelli askerlik ücreti.
          </p>
        </div>
      </section>

      {/* Calculator Section */}
      <section className="py-8">
        <div className="max-w-[960px] mx-auto px-4">
          {/* Info Cards Grid */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Bedelli Fee Card */}
            <div className="bg-[var(--card)] rounded-xl p-6 shadow-sm border border-[var(--border-light)]">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <h2 className="text-lg font-semibold">2026 Bedelli Askerlik Ücreti</h2>
              </div>
              <div className="space-y-2">
                <p className="text-3xl font-bold text-[var(--primary)]">
                  {formatCurrency(bedelliFee)}
                </p>
                <p className="text-sm text-[var(--text-muted)]">
                  Gösterge: {BEDELLI_ASKERLIK.BEDELLI_GOSTERGE.toLocaleString("tr-TR")} ×{" "}
                  {BEDELLI_ASKERLIK.MEMUR_MAAS_KATSAYISI}
                </p>
                <p className="text-xs text-[var(--text-muted)] mt-2">
                  {BEDELLI_ASKERLIK.period} dönemi
                </p>
              </div>
            </div>

            {/* Exchange Rates Card */}
            <div className="bg-[var(--card)] rounded-xl p-6 shadow-sm border border-[var(--border-light)]">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <h2 className="text-lg font-semibold">Güncel TCMB Kurları</h2>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[var(--text-muted)]">EUR (Euro)</span>
                  <span className="text-lg font-semibold">
                    ₺{rates.EUR.toFixed(4)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[var(--text-muted)]">USD (Dolar)</span>
                  <span className="text-lg font-semibold">
                    ₺{rates.USD.toFixed(4)}
                  </span>
                </div>
                <div className="pt-2 border-t border-[var(--border-light)]">
                  <p className="text-xs text-[var(--text-muted)]">
                    {rates.source === "TCMB" ? `Tarih: ${rates.date}` : "⚠️ Tahmini Kur (TCMB erişilemedi)"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Result Cards */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Euro Result */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-8 shadow-lg border-2 border-blue-200 dark:border-blue-700">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-blue-600 rounded-full">
                  <Euro className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-blue-900 dark:text-blue-100">
                  Euro Karşılığı
                </h3>
              </div>
              <p className="text-4xl md:text-5xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                {formatCurrency(euroAmount, "de-DE", "EUR")}
              </p>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                {formatCurrency(bedelliFee)} ÷ {rates.EUR.toFixed(4)}
              </p>
            </div>

            {/* USD Result */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl p-8 shadow-lg border-2 border-green-200 dark:border-green-700">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-green-600 rounded-full">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-green-900 dark:text-green-100">
                  Dolar Karşılığı
                </h3>
              </div>
              <p className="text-4xl md:text-5xl font-bold text-green-600 dark:text-green-400 mb-2">
                {formatCurrency(usdAmount, "en-US", "USD")}
              </p>
              <p className="text-sm text-green-700 dark:text-green-300">
                {formatCurrency(bedelliFee)} ÷ {rates.USD.toFixed(4)}
              </p>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 p-6 rounded-lg mb-8">
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
              <div className="space-y-2">
                <p className="text-sm text-yellow-800 dark:text-yellow-200 font-semibold">
                  Önemli Uyarı
                </p>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  <strong>Ödemeler ödeme günündeki TCMB Efektif Satış Kuru üzerinden yapılır.</strong>{" "}
                  Bu hesaplama bilgilendirme amaçlıdır. Kesin tutar için ödeme günündeki güncel kuru kontrol ediniz.
                </p>
                <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-3">
                  Dövizli askerlik için{" "}
                  <strong className="font-semibold">
                    Uzaktan Eğitim portalını
                  </strong>{" "}
                  tamamlamanız gerekmektedir.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="py-12 px-4 bg-[var(--muted)]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-8 text-center">
            Dövizli Askerlik Hakkında Bilgiler
          </h2>

          <div className="space-y-6">
            <div className="bg-[var(--card)] rounded-xl p-6 shadow-sm border border-[var(--border-light)]">
              <h3 className="font-semibold text-lg mb-3 text-[var(--primary)]">
                Hangi Ülkelerden Dövizle Ödeme Yapılabilir?
              </h3>
              <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                Almanya, Fransa, Avusturya, Belçika, Hollanda, İngiltere ve diğer
                yurtdışında yaşayan vatandaşlar bedelli askerlik ücretini Euro veya
                Dolar ile ödeyebilirler. Ödeme, ödeme günündeki TCMB kuruna göre
                hesaplanır.
              </p>
            </div>

            <div className="bg-[var(--card)] rounded-xl p-6 shadow-sm border border-[var(--border-light)]">
              <h3 className="font-semibold text-lg mb-3 text-[var(--primary)]">
                Ödeme Nasıl Yapılır?
              </h3>
              <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                Bedelli askerlik başvurusu yaptıktan sonra size verilen banka hesap
                numarasına, belirlenen süre içinde (genellikle 2 ay) ödeme yapmanız
                gerekmektedir. Yurtdışından yapılacak ödemeler için bankanızın
                uluslararası transfer ücretlerini de dikkate alınız.
              </p>
            </div>

            <div className="bg-[var(--card)] rounded-xl p-6 shadow-sm border border-[var(--border-light)]">
              <h3 className="font-semibold text-lg mb-3 text-[var(--primary)]">
                Uzaktan Eğitim Zorunluluğu
              </h3>
              <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                Bedelli askerlik başvurusu yapan tüm adayların, Milli Savunma
                Bakanlığı tarafından belirlenen{" "}
                <strong>Uzaktan Temel Askerlik Eğitimi</strong> portalını
                tamamlamaları gerekmektedir. Bu eğitim online olarak
                tamamlanabilmektedir.
              </p>
            </div>

            <div className="bg-[var(--card)] rounded-xl p-6 shadow-sm border border-[var(--border-light)]">
              <h3 className="font-semibold text-lg mb-3 text-[var(--primary)]">
                Kur Değişimi Riski
              </h3>
              <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                TCMB döviz kurları günlük olarak değişmektedir. Başvuru tarihi ile
                ödeme tarihi arasında kur farkı olabileceğinden, ödeme yapmadan önce
                güncel kurları kontrol etmeniz önerilir. Yukarıdaki hesaplama
                anlık kur bilgilerini kullanmaktadır.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-[var(--border-light)]">
        <div className="max-w-7xl mx-auto text-center text-sm text-[var(--text-muted)]">
          <p>
            Bu hesaplama aracı bilgilendirme amaçlıdır. Kesin sonuçlar için
            Askerlik Şubenize başvurunuz.
          </p>
        </div>
      </footer>
    </div>
  );
}
