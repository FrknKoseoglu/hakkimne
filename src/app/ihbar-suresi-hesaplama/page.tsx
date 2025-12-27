import { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { NoticeCalculator } from "@/components/calculators/NoticeCalculator";
import { Clock, Info } from "lucide-react";
import { CURRENT_YEAR } from "@/lib/constants";

export const metadata: Metadata = {
  title: `İhbar Süresi Hesaplama ${CURRENT_YEAR} | İşten Ne Zaman Ayrılabilirim?`,
  description: "İstifa ettikten sonra kaç hafta çalışmalısınız? İhbar sürenizi ve işten çıkış tarihinizi hemen hesaplayın.",
  keywords: [
    "ihbar süresi hesaplama",
    "ihbar tazminatı süresi",
    "işten ayrılma süresi",
    "istifa ihbar süresi",
    `${CURRENT_YEAR} ihbar süresi`,
    "4857 sayılı iş kanunu madde 17",
  ],
  openGraph: {
    title: `İhbar Süresi Hesaplama ${CURRENT_YEAR}`,
    description: "İstifa ettikten sonra kaç hafta çalışmalısınız? Hemen hesaplayın.",
    type: "website",
  },
};

export default function IhbarSuresiHesaplamaPage() {
  return (
    <div className="min-h-screen bg-[var(--background-light)]">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-600 to-indigo-700 text-white py-10 md:py-14">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/20 mb-4">
            <Clock className="w-8 h-8" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            İhbar Süresi Hesaplama
          </h1>
          <p className="text-lg opacity-90 max-w-2xl mx-auto">
            İstifa ettikten sonra kaç hafta çalışmanız gerektiğini ve son iş gününüzü hesaplayın.
          </p>
        </div>
      </section>

      {/* Calculator Section */}
      <section className="py-8 md:py-12">
        <div className="max-w-2xl mx-auto px-4">
          <NoticeCalculator />

          {/* Legal Reference */}
          <div className="mt-8 p-6 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <div>
                <h2 className="font-semibold text-[var(--text-main)] mb-2">
                  İhbar Süreleri (4857 Sayılı İş Kanunu Madde 17)
                </h2>
                <ul className="text-sm text-[var(--text-muted)] space-y-1">
                  <li>• <strong>0-6 ay:</strong> 2 hafta (14 gün)</li>
                  <li>• <strong>6-18 ay:</strong> 4 hafta (28 gün)</li>
                  <li>• <strong>18 ay - 3 yıl:</strong> 6 hafta (42 gün)</li>
                  <li>• <strong>3 yıl üzeri:</strong> 8 hafta (56 gün)</li>
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
            Bu araç bilgilendirme amaçlıdır. Kesin bilgi için iş hukuku uzmanına danışın.
          </p>
        </div>
      </footer>
    </div>
  );
}
