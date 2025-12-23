import { SeveranceCalculator } from "@/components/SeveranceCalculator";
import { Navbar } from "@/components/Navbar";

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--background-light)]">
      <Navbar />

      {/* Main Content */}
      <main className="mx-auto max-w-[960px] px-4 py-8">
        <SeveranceCalculator />
      </main>

      {/* SEO Content Section */}
      <section className="mx-auto max-w-[960px] px-4 pb-12">
        <div className="border-t border-[var(--border-light)] pt-8">
          <h2 className="text-2xl font-bold text-[var(--text-main)] mb-4">
            Kıdem ve İhbar Tazminatı Nasıl Hesaplanır?
          </h2>
          <div className="prose prose-slate max-w-none text-[var(--text-muted)]">
            <p className="mb-4">
              Kıdem tazminatı, işçinin çeşitli sebeplerle işyerinden ayrılırken
              işveren tarafından ödenmesi gereken bir tazminat türüdür. Kendi
              isteğiyle işten ayrılan (istifa eden) işçi kıdem tazminatı alamaz.
              Ancak, evlilik, askerlik veya emeklilik gibi yasal haklı sebeplerle
              ayrılma durumunda tazminat hakkı doğar.
            </p>
            <p className="mb-4">
              2024 yılı itibarıyla geçerli olan kıdem tazminatı tavanı,
              hesaplamalarda önemli bir rol oynar. Hesaplama yapılırken brüt
              maaşınızın yanı sıra, size düzenli olarak sağlanan yol, yemek ve prim
              gibi yan haklar da &ldquo;giydirilmiş brüt ücret&rdquo; hesabına dahil edilir.
            </p>
            <ul className="list-disc pl-5 space-y-2 mb-4">
              <li>
                <strong>Kıdem Tazminatı:</strong> Her tam yıl için 30 günlük brüt
                ücret tutarında ödeme yapılır.
              </li>
              <li>
                <strong>İhbar Tazminatı:</strong> İşçinin çalışma süresine göre
                belirlenen bildirim sürelerine uyulmaması durumunda ödenir.
              </li>
              <li>
                <strong>Yıllık İzin Ücreti:</strong> İşten ayrılırken kullanılmamış
                yıllık izinlerin ücreti son brüt maaş üzerinden ödenir.
              </li>
            </ul>
            <p>
              Hesaplama aracımız, güncel vergi dilimleri ve damga vergisi oranlarını
              dikkate alarak size en doğru tahmini sonucu sunmak için tasarlanmıştır.
              Yasal süreçlerinizde bir avukattan destek almanız tavsiye edilir.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 text-center text-sm text-[var(--text-muted)] border-t border-[var(--border-light)] bg-[var(--card)]/50">
        <div className="mx-auto max-w-[960px] px-4">
          <p className="mb-1">© 2024 Hakkım Ne? - Tüm hakları saklıdır.</p>
          <p className="text-xs">
            Bu araç bilgilendirme amaçlıdır. Kesin hesaplamalar için bir iş hukuku
            uzmanına danışın.
          </p>
        </div>
      </footer>
    </div>
  );
}
