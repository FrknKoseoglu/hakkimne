import { Metadata } from "next";
import { Suspense } from "react";
import { Navbar } from "@/components/Navbar";
import { RentCalculator } from "@/components/calculators/RentCalculator";
import { CURRENT_YEAR } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Kira Artış Oranı Hesaplama ${CURRENT_YEAR} | Yasal TÜFE ile Kira Zammı - Hakkım Ne?`,
  description: `${CURRENT_YEAR} Aralık ayı kira artış oranı yüzde kaç oldu? TÜİK 12 aylık ortalamalara göre yasal kira zammı hesaplama aracı.`,
  keywords: [
    "kira artış oranı hesaplama",
    "kira zammı hesaplama",
    "tüfe kira artışı",
    `${CURRENT_YEAR} kira zammı`,
    "konut kira artışı",
    "yasal kira artış oranı",
    "12 aylık tüfe ortalaması",
    "kira artış sınırı",
  ],
  openGraph: {
    title: `Kira Artış Oranı Hesaplama ${CURRENT_YEAR} | Hakkım Ne?`,
    description: `TÜİK 12 aylık ortalamalara göre yasal konut kira zammını hesaplayın.`,
    type: "website",
  },
};

export default function KiraArtisPage() {
  return (
    <div className="min-h-screen bg-[var(--background-light)]">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[var(--primary)] to-blue-700 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3">
            Kira Artış Oranı Hesaplama
          </h1>
          <p className="text-base md:text-lg opacity-90 max-w-2xl mx-auto">
            {CURRENT_YEAR} güncel TÜFE verileriyle konut ve işyeri kira artışınızı hesaplayın.
          </p>
        </div>
      </section>

      {/* Calculator Section */}
      <section className="py-8">
        <div className="max-w-[960px] mx-auto px-4">
          <Suspense fallback={<div className="text-center">Yükleniyor...</div>}>
            <RentCalculator />
          </Suspense>
        </div>
      </section>

      {/* Info Section */}
      <section className="py-12 px-4 bg-[var(--muted)]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-center">
            Kira Artışı Hakkında
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[var(--card)] rounded-xl p-6 shadow-sm border border-[var(--border-light)]">
              <h3 className="font-semibold text-lg mb-3 text-[var(--primary)]">
                Yasal Artış Oranı Nedir?
              </h3>
              <ul className="space-y-2 text-sm text-[var(--text-muted)]">
                <li>• Konut kiralarında üst sınır: <strong>TÜFE 12 aylık ortalama</strong></li>
                <li>• Oran TÜİK tarafından aylık açıklanır</li>
                <li>• %25 sınırı Temmuz 2024&apos;te kalktı</li>
                <li>• Yenileme döneminde geçerlidir</li>
              </ul>
            </div>

            <div className="bg-[var(--card)] rounded-xl p-6 shadow-sm border border-[var(--border-light)]">
              <h3 className="font-semibold text-lg mb-3 text-[var(--primary)]">
                İşyeri Kiraları
              </h3>
              <ul className="space-y-2 text-sm text-[var(--text-muted)]">
                <li>• İşyeri kiralarında sınırlama yok</li>
                <li>• Taraflar serbestçe anlaşabilir</li>
                <li>• Sözleşmeye bağlı artış uygulanır</li>
                <li>• TÜFE üzerinden artış da mümkün</li>
              </ul>
            </div>

            <div className="bg-[var(--card)] rounded-xl p-6 shadow-sm border border-[var(--border-light)]">
              <h3 className="font-semibold text-lg mb-3 text-[var(--primary)]">
                Artış Ne Zaman Uygulanır?
              </h3>
              <ul className="space-y-2 text-sm text-[var(--text-muted)]">
                <li>• Kira sözleşmesinin yıldönümünde</li>
                <li>• Kontrat yenileme tarihinde</li>
                <li>• Yıl içinde artış yapılamaz</li>
                <li>• Geriye dönük artış geçersiz</li>
              </ul>
            </div>

            <div className="bg-[var(--card)] rounded-xl p-6 shadow-sm border border-[var(--border-light)]">
              <h3 className="font-semibold text-lg mb-3 text-[var(--primary)]">
                Kiracı Hakları
              </h3>
              <ul className="space-y-2 text-sm text-[var(--text-muted)]">
                <li>• Yasal oranı aşan artış geçersiz</li>
                <li>• Fazla ödeme iade edilebilir</li>
                <li>• Dava yoluyla hak aranabilir</li>
                <li>• Kira tespit davası açılabilir</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-sm text-[var(--text-muted)] border-t border-[var(--border-light)] bg-[var(--card)]/50">
        <div className="mx-auto max-w-7xl px-4">
          <p className="mb-2">© {CURRENT_YEAR} Hakkım Ne? - Tüm hakları saklıdır.</p>
          <p className="text-xs">
            Bu araç bilgilendirme amaçlıdır. Yasal oran TÜİK verilerine göre güncellenir.
          </p>
        </div>
      </footer>
    </div>
  );
}
