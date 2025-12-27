import { Metadata } from "next";
import { Suspense } from "react";
import { Navbar } from "@/components/Navbar";
import { OvertimeCalculator } from "@/components/calculators/OvertimeCalculator";
import { CURRENT_YEAR } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Fazla Mesai Ücreti Hesaplama ${CURRENT_YEAR} | Mesai ve Bayram Parası - Hakkım Ne?`,
  description: `Saatlik mesai ücretiniz ne kadar? Haftalık 45 saati aşan çalışmalarınızı ve resmi tatil mesailerinizi güncel katsayılarla hesaplayın.`,
  keywords: [
    "fazla mesai ücreti hesaplama",
    "mesai parası hesaplama",
    "saatlik mesai ücreti",
    "bayram mesaisi hesaplama",
    "resmi tatil ücreti",
    `${CURRENT_YEAR} mesai hesaplama`,
    "fazla çalışma ücreti",
  ],
  openGraph: {
    title: `Fazla Mesai Ücreti Hesaplama ${CURRENT_YEAR} | Hakkım Ne?`,
    description: `Haftalık 45 saati aşan çalışmalarınızı ve resmi tatil mesailerinizi güncel katsayılarla hesaplayın.`,
    type: "website",
  },
};

export default function FazlaMesaiPage() {
  return (
    <div className="min-h-screen bg-[var(--background-light)]">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[var(--primary)] to-blue-700 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3">
            Fazla Mesai Ücreti Hesaplama
          </h1>
          <p className="text-base md:text-lg opacity-90 max-w-2xl mx-auto">
            {CURRENT_YEAR} güncel verileriyle haftalık 45 saati aşan çalışmalarınızı 
            ve resmi tatil mesailerinizi hesaplayın.
          </p>
        </div>
      </section>

      {/* Calculator Section */}
      <section className="py-8">
        <div className="max-w-[960px] mx-auto px-4">
          <Suspense fallback={<div className="text-center">Yükleniyor...</div>}>
            <OvertimeCalculator />
          </Suspense>
        </div>
      </section>

      {/* Info Section */}
      <section className="py-12 px-4 bg-[var(--muted)]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-center">
            Fazla Mesai Hakkında
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[var(--card)] rounded-xl p-6 shadow-sm border border-[var(--border-light)]">
              <h3 className="font-semibold text-lg mb-3 text-[var(--primary)]">
                Fazla Mesai Nasıl Hesaplanır?
              </h3>
              <ul className="space-y-2 text-sm text-[var(--text-muted)]">
                <li>• Aylık çalışma süresi: <strong>225 saat</strong></li>
                <li>• Saatlik ücret = Maaş ÷ 225</li>
                <li>• Mesai ücreti = Saatlik × <strong>1.5</strong></li>
                <li>• Haftalık 45 saat üzeri mesai sayılır</li>
              </ul>
            </div>

            <div className="bg-[var(--card)] rounded-xl p-6 shadow-sm border border-[var(--border-light)]">
              <h3 className="font-semibold text-lg mb-3 text-[var(--primary)]">
                Resmi Tatil Çalışması
              </h3>
              <ul className="space-y-2 text-sm text-[var(--text-muted)]">
                <li>• Tatilde çalışana <strong>1 günlük ek ücret</strong></li>
                <li>• Günlük ücret = Maaş ÷ 30</li>
                <li>• Bayramlar, yılbaşı, milli tatiller</li>
                <li>• Sözleşmede daha yüksek oran olabilir</li>
              </ul>
            </div>

            <div className="bg-[var(--card)] rounded-xl p-6 shadow-sm border border-[var(--border-light)]">
              <h3 className="font-semibold text-lg mb-3 text-[var(--primary)]">
                Yasal Sınırlar
              </h3>
              <ul className="space-y-2 text-sm text-[var(--text-muted)]">
                <li>• Yıllık en fazla <strong>270 saat</strong> fazla mesai</li>
                <li>• İşçinin yazılı onayı gerekli</li>
                <li>• Mesai yerine 1.5 kat izin alınabilir</li>
                <li>• Gece mesaisi en fazla 7.5 saat</li>
              </ul>
            </div>

            <div className="bg-[var(--card)] rounded-xl p-6 shadow-sm border border-[var(--border-light)]">
              <h3 className="font-semibold text-lg mb-3 text-[var(--primary)]">
                Dikkat Edilmesi Gerekenler
              </h3>
              <ul className="space-y-2 text-sm text-[var(--text-muted)]">
                <li>• İş sözleşmenizi kontrol edin</li>
                <li>• Mesai kayıtlarınızı saklayın</li>
                <li>• Ödenmezse İŞKUR&apos;a şikayet edin</li>
                <li>• Zamanaşımı süresi 5 yıldır</li>
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
            Bu araç bilgilendirme amaçlıdır. Kesin hesaplamalar için bir iş hukuku uzmanına danışın.
          </p>
        </div>
      </footer>
    </div>
  );
}
