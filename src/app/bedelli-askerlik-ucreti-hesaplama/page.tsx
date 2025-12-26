import { Metadata } from "next";
import { Suspense } from "react";
import { Navbar } from "@/components/Navbar";
import { MilitaryCalculator } from "@/components/calculators/MilitaryCalculator";
import { CURRENT_YEAR } from "@/lib/constants";

export const metadata: Metadata = {
  title: `${CURRENT_YEAR} Bedelli Askerlik Ücreti ve Yoklama Kaçağı Cezası Hesaplama | Hakkım Ne?`,
  description: `${CURRENT_YEAR} güncel bedelli askerlik ücreti ne kadar? Yoklama kaçağı veya bakaya durumundaysanız ödeyeceğiniz ek bedel ve cezayı hemen hesaplayın.`,
  keywords: [
    "bedelli askerlik",
    "bedelli askerlik ücreti",
    `${CURRENT_YEAR} bedelli askerlik`,
    "yoklama kaçağı cezası",
    "bakaya cezası",
    "bedelli askerlik hesaplama",
    "ek bedel hesaplama",
    "idari para cezası",
  ],
  openGraph: {
    title: `${CURRENT_YEAR} Bedelli Askerlik Ücreti Hesaplama | Hakkım Ne?`,
    description: `${CURRENT_YEAR} güncel bedelli askerlik ücreti ve yoklama kaçağı cezası hesaplama aracı.`,
    type: "website",
  },
};

export default function BedelliAskerlikPage() {
  return (
    <div className="min-h-screen bg-[var(--background-light)]">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[var(--primary)] to-blue-700 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3">
            Bedelli Askerlik Ücreti Hesaplama
          </h1>
          <p className="text-base md:text-lg opacity-90 max-w-2xl mx-auto">
            {CURRENT_YEAR} güncel bedelli askerlik ücreti ve yoklama kaçağı / bakaya
            cezası hesaplama aracı.
          </p>
        </div>
      </section>

      {/* Calculator Section */}
      <section className="py-8">
        <div className="max-w-[960px] mx-auto px-4">
          <Suspense fallback={<div className="text-center">Yükleniyor...</div>}>
            <MilitaryCalculator />
          </Suspense>
        </div>
      </section>

      {/* Info Section - FAQ */}
      <section className="py-12 px-4 bg-[var(--muted)]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-8 text-center">
            Bedelli Askerlik Hakkında Sıkça Sorulanlar
          </h2>

          <div className="space-y-6">
            <div className="bg-[var(--card)] rounded-xl p-6 shadow-sm border border-[var(--border-light)]">
              <h3 className="font-semibold text-lg mb-3 text-[var(--primary)]">
                {CURRENT_YEAR} Bedelli Askerlik Ücreti Ne Kadar?
              </h3>
              <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                Bedelli askerlik ücreti, Memur Maaş Katsayısına endekslidir ve yılda
                iki kez (Ocak ve Temmuz) güncellenir. {CURRENT_YEAR} yılının ilk yarısı
                (Ocak-Haziran) için geçerli taban ücret, yukarıdaki hesaplama aracında
                belirtildiği gibidir.
              </p>
            </div>

            <div className="bg-[var(--card)] rounded-xl p-6 shadow-sm border border-[var(--border-light)]">
              <h3 className="font-semibold text-lg mb-3 text-[var(--primary)]">
                Yoklama Kaçağı veya Bakaya Olanlar Bedelli Yapabilir mi?
              </h3>
              <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                Evet, 7179 sayılı Askeralma Kanunu&apos;na göre yoklama kaçağı veya bakaya
                durumunda olanlar da bedelli askerlikten yararlanabilir. Ancak bu kişiler,
                normal bedelli ücretine ek olarak, <strong>kaçak kaldıkları her ay için
                ek bir bedel</strong> ödemek zorundadır.
              </p>
            </div>

            <div className="bg-[var(--card)] rounded-xl p-6 shadow-sm border border-[var(--border-light)]">
              <h3 className="font-semibold text-lg mb-3 text-[var(--primary)]">
                Ek Bedel Nasıl Hesaplanır?
              </h3>
              <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                Kaçak kalınan her ay için; 3.500 gösterge rakamının memur maaş katsayısı
                ile çarpımı kadar ek ücret alınır. Bu tutar, normal bedelli ücretine
                ilave edilir.
              </p>
            </div>

            <div className="bg-[var(--card)] rounded-xl p-6 shadow-sm border border-[var(--border-light)]">
              <h3 className="font-semibold text-lg mb-3 text-[var(--primary)]">
                Ödeme Taksitle Yapılır mı?
              </h3>
              <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                Hayır, bedelli askerlik ücreti (ve varsa ek bedeller) başvuru tarihinden
                itibaren 2 ay içinde <strong>peşin</strong> olarak ödenmelidir.
                Taksitlendirme yapılmamaktadır.
              </p>
            </div>

            <div className="bg-[var(--card)] rounded-xl p-6 shadow-sm border border-[var(--border-light)]">
              <h3 className="font-semibold text-lg mb-3 text-[var(--primary)]">
                İdari Para Cezası Nedir?
              </h3>
              <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                Yoklama kaçağı olarak geçirilen süreler için ayrıca idari para cezası
                uygulanır. Kendiliğinden gelenler daha düşük, yakalanarak getirilenler
                daha yüksek ceza öderler. Bu ceza Vergi Dairesine ödenir, bedelli
                ücretinden bağımsızdır.
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
