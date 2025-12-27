import { Metadata } from "next";
import { Suspense } from "react";
import { Navbar } from "@/components/Navbar";
import { PetitionGenerator } from "@/components/generators/PetitionGenerator";
import { CURRENT_YEAR } from "@/lib/constants";

export const metadata: Metadata = {
  title: `İstifa Dilekçesi Oluştur ${CURRENT_YEAR} | Hazır Şablonlar (PDF/Yazdır) - Hakkım Ne?`,
  description: `İşten ayrılırken ihtiyacınız olan istifa dilekçesini saniyeler içinde oluşturun. Haklı fesih, normal istifa ve emeklilik dilekçesi örnekleri.`,
  keywords: [
    "istifa dilekçesi",
    "istifa dilekçesi örneği",
    "istifa dilekçesi nasıl yazılır",
    "haklı fesih dilekçesi",
    "emeklilik istifa dilekçesi",
    `${CURRENT_YEAR} istifa dilekçesi`,
    "istifa mektubu",
    "işten ayrılma dilekçesi",
  ],
  openGraph: {
    title: `İstifa Dilekçesi Oluştur ${CURRENT_YEAR} | Hakkım Ne?`,
    description: `İşten ayrılırken ihtiyacınız olan istifa dilekçesini saniyeler içinde oluşturun.`,
    type: "website",
  },
};

export default function IstifaDilekcesiPage() {
  return (
    <div className="min-h-screen bg-[var(--background-light)]">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[var(--primary)] to-blue-700 text-white py-8 print:hidden">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3">
            İstifa Dilekçesi Oluşturucu
          </h1>
          <p className="text-base md:text-lg opacity-90 max-w-2xl mx-auto">
            Normal istifa, haklı fesih veya emeklilik dilekçenizi hazırlayın ve yazdırın.
          </p>
        </div>
      </section>

      {/* Generator Section */}
      <section className="py-8">
        <div className="max-w-6xl mx-auto px-4">
          <Suspense fallback={<div className="text-center">Yükleniyor...</div>}>
            <PetitionGenerator />
          </Suspense>
        </div>
      </section>

      {/* Info Section */}
      <section className="py-12 px-4 bg-[var(--muted)] print:hidden">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-center">
            İstifa Dilekçesi Hakkında
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[var(--card)] rounded-xl p-6 shadow-sm border border-[var(--border-light)]">
              <h3 className="font-semibold text-lg mb-3 text-[var(--primary)]">
                Normal İstifa
              </h3>
              <ul className="space-y-2 text-sm text-[var(--text-muted)]">
                <li>• İhbar süresi kullanılır</li>
                <li>• Kıdem tazminatı alınamaz</li>
                <li>• İşsizlik maaşı alınamaz</li>
                <li>• 2-8 hafta ihbar süresi</li>
              </ul>
            </div>

            <div className="bg-[var(--card)] rounded-xl p-6 shadow-sm border border-[var(--border-light)]">
              <h3 className="font-semibold text-lg mb-3 text-[var(--primary)]">
                Haklı Fesih
              </h3>
              <ul className="space-y-2 text-sm text-[var(--text-muted)]">
                <li>• Maaş ödenmemesi, mobbing vb.</li>
                <li>• <strong>Kıdem tazminatı alınır</strong></li>
                <li>• <strong>İşsizlik maaşı alınır</strong></li>
                <li>• Derhal ayrılma hakkı</li>
              </ul>
            </div>

            <div className="bg-[var(--card)] rounded-xl p-6 shadow-sm border border-[var(--border-light)]">
              <h3 className="font-semibold text-lg mb-3 text-[var(--primary)]">
                Emeklilik İstifası
              </h3>
              <ul className="space-y-2 text-sm text-[var(--text-muted)]">
                <li>• 15 yıl + 3600 gün prim</li>
                <li>• SGK yazısı gerekli</li>
                <li>• <strong>Kıdem tazminatı alınır</strong></li>
                <li>• İşsizlik maaşı alınamaz</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-sm text-[var(--text-muted)] border-t border-[var(--border-light)] bg-[var(--card)]/50 print:hidden">
        <div className="mx-auto max-w-7xl px-4">
          <p className="mb-2">© {CURRENT_YEAR} Hakkım Ne? - Tüm hakları saklıdır.</p>
          <p className="text-xs">
            Bu araç bilgilendirme amaçlıdır. Dilekçeleri imzalamadan önce bir uzmana danışın.
          </p>
        </div>
      </footer>
    </div>
  );
}
