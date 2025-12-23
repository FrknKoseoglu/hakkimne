import { SeveranceCalculator } from "@/components/SeveranceCalculator";

function Navbar() {
  return (
    <nav className="sticky top-0 z-50 h-16 border-b border-[var(--border-light)] bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-full max-w-[960px] items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center size-9 rounded-lg bg-blue-100 text-[var(--primary)]">
            <span className="material-symbols-outlined text-xl">calculate</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-[var(--text-main)]">
            Hakkım Ne?
          </h1>
        </div>
        <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700 ring-1 ring-inset ring-blue-200">
          2024 Güncel
        </span>
      </div>
    </nav>
  );
}

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
      <footer className="py-6 text-center text-sm text-[var(--text-muted)] border-t border-[var(--border-light)] bg-white/50">
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
