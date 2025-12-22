import { SeveranceCalculator } from "@/components/SeveranceCalculator";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-emerald-50 dark:from-slate-950 dark:via-slate-900 dark:to-emerald-950">
      {/* Header */}
      <header className="pt-8 pb-4 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-sm font-medium mb-4">
          <span>🇹🇷</span>
          <span>Türk İş Kanunu&apos;na Uygun</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 pb-16">
        <SeveranceCalculator />
      </main>

      {/* Footer */}
      <footer className="py-8 text-center text-sm text-muted-foreground border-t bg-white/50 dark:bg-slate-900/50">
        <div className="container mx-auto px-4">
          <p className="mb-2">
            © 2024 Hakkım Ne? - Tüm hakları saklıdır.
          </p>
          <p className="text-xs">
            Bu araç bilgilendirme amaçlıdır. Kesin hesaplamalar için bir iş hukuku uzmanına danışın.
          </p>
        </div>
      </footer>
    </div>
  );
}
