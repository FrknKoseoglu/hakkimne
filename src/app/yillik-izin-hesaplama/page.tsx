import { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { AnnualLeaveCalculator } from "@/components/calculators/AnnualLeaveCalculator";
import { Calendar, Info } from "lucide-react";
import { CURRENT_YEAR } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Yıllık İzin Hesaplama ${CURRENT_YEAR} | İzin Hakkı Sorgulama`,
  description: "Özel sektör ve devlet memuru için yıllık izin hakkınızı hesaplayın. Kıdem yılı, yaş ve özel durumlarınıza göre kaç gün izin hakkınız olduğunu öğrenin.",
  keywords: [
    "yıllık izin hesaplama",
    "izin hakkı hesaplama",
    `${CURRENT_YEAR} yıllık izin`,
    "devlet memuru izin",
    "özel sektör izin",
    "kıdem izin hesaplama",
    "iş kanunu izin",
  ],
  openGraph: {
    title: `Yıllık İzin Hesaplama ${CURRENT_YEAR}`,
    description: "Yıllık izin hakkınızı kıdem yılınıza ve çalışan türünüze göre kolayca hesaplayın.",
    type: "website",
  },
};

export default function YillikIzinHesaplamaPage() {
  return (
    <div className="min-h-screen bg-[var(--background-light)]">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white py-10 md:py-14">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/20 mb-4">
            <Calendar className="w-8 h-8" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            Yıllık İzin Hesaplama
          </h1>
          <p className="text-lg opacity-90 max-w-2xl mx-auto">
            Çalışma sürenize ve yaşınıza göre yıllık izin hakkınızı hesaplayın. 
            Özel sektör ve devlet memuru ayrımı ile doğru sonuçlar.
          </p>
        </div>
      </section>

      {/* Calculator Section */}
      <section className="py-8 md:py-12">
        <div className="max-w-3xl mx-auto px-4">
          <AnnualLeaveCalculator />

          {/* Explanation */}
          <div className="mt-8 p-6 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <div>
                <h2 className="font-semibold text-[var(--text-main)] mb-2">
                  Yıllık İzin Hakları
                </h2>
                
                <div className="space-y-4 text-sm text-[var(--text-muted)]">
                  <div>
                    <p className="font-semibold text-[var(--text-main)] mb-1">Özel Sektör (4857 sayılı İş Kanunu)</p>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                      <li>1-5 yıl arası çalışma: <strong>14 gün</strong></li>
                      <li>5-15 yıl arası çalışma: <strong>20 gün</strong></li>
                      <li>15 yıl ve üzeri: <strong>26 gün</strong></li>
                      <li>18 yaş ve altı veya 50 yaş ve üzeri: <strong>Minimum 20 gün</strong></li>
                      <li>Yeraltı işçileri: <strong>+4 gün ek izin</strong></li>
                    </ul>
                  </div>

                  <div>
                    <p className="font-semibold text-[var(--text-main)] mb-1">Devlet Memuru (657 sayılı Devlet Memurları Kanunu)</p>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                      <li>1-10 yıl arası hizmet: <strong>20 gün</strong></li>
                      <li>10 yıldan fazla hizmet: <strong>30 gün</strong></li>
                      <li>Zorunlu hallerde gidiş-dönüş için en çok 2&apos;şer gün eklenebilir</li>
                    </ul>
                  </div>

                  <div className="mt-3 pt-3 border-t border-blue-200 dark:border-blue-800">
                    <p className="text-xs">
                      <strong>Not:</strong> Resmi tatiller ve hafta tatilleri yıllık izin süresinden sayılmaz. 
                      Deneme süresi de çalışma süresine dahildir.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="mt-4 p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
            <p className="text-xs text-amber-700 dark:text-amber-400">
              <strong>Uyarı:</strong> Bu hesaplama genel yasal düzenlemelere göre yapılmaktadır. 
              İş sözleşmeniz veya toplu iş sözleşmeniz daha fazla izin süresi öngörebilir. 
              Kesin bilgi için İK departmanınıza veya işvereninize danışınız.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-sm text-[var(--text-muted)] border-t border-[var(--border-light)] bg-[var(--card)]/50">
        <div className="mx-auto max-w-7xl px-4">
          <p className="mb-2">© {CURRENT_YEAR} Hakkım Ne? - Tüm hakları saklıdır.</p>
          <p className="text-xs">
            Bu araç bilgilendirme amaçlıdır. Yasal danışmanlık yerine geçmez.
          </p>
        </div>
      </footer>
    </div>
  );
}
