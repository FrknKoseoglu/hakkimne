import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { sgkCodes } from "@/lib/sgk-codes";
import { 
  CheckCircle, 
  XCircle, 
  ArrowLeft, 
  Calculator, 
  AlertTriangle,
  Briefcase,
  Wallet,
  Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CURRENT_YEAR } from "@/lib/constants";

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Generate static params for all codes
export function generateStaticParams() {
  return sgkCodes.map((code) => ({
    slug: code.slug,
  }));
}

// Generate dynamic metadata
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const code = sgkCodes.find((c) => c.slug === slug);
  
  if (!code) {
    return {
      title: "Kod Bulunamadı | Hakkım Ne?",
    };
  }

  return {
    title: `SGK ${code.code} Kodu: Tazminat ve İşsizlik Maaşı Alınır mı? | Hakkım Ne?`,
    description: `SGK ${code.code} kodu nedir? ${code.title}. Kıdem tazminatı ${code.severancePay ? "alınır" : "alınmaz"}, işsizlik maaşı ${code.unemploymentPay ? "alınır" : "alınmaz"}.`,
    keywords: [
      `SGK ${code.code} kodu`,
      `${code.code} çıkış kodu`,
      "SGK işten çıkış kodu",
      "kıdem tazminatı",
      "işsizlik maaşı",
    ],
  };
}

export default async function SgkCodeDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const code = sgkCodes.find((c) => c.slug === slug);

  if (!code) {
    notFound();
  }

  const statusCards = [
    {
      title: "Kıdem Tazminatı",
      status: code.severancePay,
      icon: Briefcase,
      colorTrue: "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 border-green-200 dark:border-green-700",
      colorFalse: "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 border-red-200 dark:border-red-700",
    },
    {
      title: "İhbar Tazminatı",
      status: code.noticePay,
      icon: Clock,
      colorTrue: "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 border-green-200 dark:border-green-700",
      colorFalse: "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 border-red-200 dark:border-red-700",
    },
    {
      title: "İşsizlik Maaşı",
      status: code.unemploymentPay,
      icon: Wallet,
      colorTrue: "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 border-green-200 dark:border-green-700",
      colorFalse: "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 border-red-200 dark:border-red-700",
    },
  ];

  const whoTerminatedLabels = {
    Employer: "İşveren",
    Employee: "İşçi",
    Mutual: "Karşılıklı Anlaşma",
    Other: "Diğer",
  };

  return (
    <div className="min-h-screen bg-[var(--background-light)]">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[var(--primary)] to-blue-700 text-white py-8">
        <div className="max-w-7xl mx-auto px-4">
          <Link
            href="/sgk-cikis-kodlari"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Tüm Kodlara Dön
          </Link>

          <div className="flex items-center gap-4 mb-4">
            <span className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-white/20 text-white font-bold text-2xl">
              {code.code}
            </span>
            <div>
              <p className="text-sm opacity-80">SGK Çıkış Kodu</p>
              <h1 className="text-xl md:text-2xl font-bold">KOD {code.code}</h1>
            </div>
          </div>

          <p className="text-lg md:text-xl opacity-90 max-w-3xl">
            {code.title}
          </p>
        </div>
      </section>

      {/* Status Cards */}
      <section className="py-8">
        <div className="max-w-[960px] mx-auto px-4">
          <div className="grid grid-cols-3 gap-2 md:gap-4">
            {statusCards.map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.title}
                  className={`rounded-xl border p-3 md:p-6 text-center ${
                    card.status ? card.colorTrue : card.colorFalse
                  }`}
                >
                  <Icon className="w-6 h-6 md:w-8 md:h-8 mx-auto mb-2 md:mb-3" />
                  <h3 className="font-semibold text-xs md:text-lg mb-1 md:mb-2">{card.title}</h3>
                  <div className="flex items-center justify-center gap-1 md:gap-2">
                    {card.status ? (
                      <>
                        <CheckCircle className="w-4 h-4 md:w-5 md:h-5" />
                        <span className="font-bold text-xs md:text-base">ALINIR</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4 md:w-5 md:h-5" />
                        <span className="font-bold text-xs md:text-base">ALINMAZ</span>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Who Terminated Badge */}
          <div className="mt-6 flex items-center gap-2 text-sm text-[var(--text-muted)]">
            <span>Fesheden Taraf:</span>
            <span className="px-3 py-1 rounded-full bg-[var(--muted)] font-medium">
              {whoTerminatedLabels[code.whoTerminated]}
            </span>
          </div>
        </div>
      </section>

      {/* Description */}
      <section className="py-8 bg-[var(--muted)]">
        <div className="max-w-[960px] mx-auto px-4">
          <h2 className="text-xl font-bold text-[var(--text-main)] mb-4">
            Bu Kod Ne Anlama Geliyor?
          </h2>
          <p className="text-[var(--text-muted)] leading-relaxed">
            {code.description}
          </p>
        </div>
      </section>

      {/* Smart CTAs */}
      <section className="py-8">
        <div className="max-w-[960px] mx-auto px-4 space-y-4">
          {code.severancePay ? (
            <Link href="/kidem-tazminati-hesaplama" className="block">
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-xl p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-800 flex items-center justify-center">
                      <Briefcase className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-bold text-blue-800 dark:text-blue-300">
                        Kıdem Tazminatınızı Hesaplayın
                      </h3>
                      <p className="text-sm text-blue-700 dark:text-blue-400">
                        Bu kod ile çıkışta kıdem tazminatı hakkınız var
                      </p>
                    </div>
                  </div>
                  <Calculator className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </Link>
          ) : (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <AlertTriangle className="w-6 h-6 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-yellow-800 dark:text-yellow-300">
                    Bu Kod İle Kıdem Tazminatı Alınmaz
                  </h3>
                  <p className="text-sm text-yellow-700 dark:text-yellow-400 mt-1">
                    Bu çıkış koduyla tazminat hakkı doğmaz. Ancak işverenin haksız bir kod kullandığını düşünüyorsanız, 
                    e-Devlet üzerinden SGK çıkış kodunuzu kontrol edin ve gerekirse İş Mahkemesi&apos;nde dava açın.
                  </p>
                </div>
              </div>
            </div>
          )}

          {code.unemploymentPay && (
            <Link href="/issizlik-maasi-hesaplama" className="block">
              <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700 rounded-xl p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-800 flex items-center justify-center">
                      <Wallet className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <h3 className="font-bold text-purple-800 dark:text-purple-300">
                        İşsizlik Maaşınızı Hesaplayın
                      </h3>
                      <p className="text-sm text-purple-700 dark:text-purple-400">
                        Bu kod ile çıkışta işsizlik maaşı hakkınız var
                      </p>
                    </div>
                  </div>
                  <Calculator className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </Link>
          )}
        </div>
      </section>

      {/* Other Codes */}
      <section className="py-8 bg-[var(--muted)]">
        <div className="max-w-[960px] mx-auto px-4">
          <h2 className="text-xl font-bold text-[var(--text-main)] mb-4">
            Diğer SGK Çıkış Kodları
          </h2>
          <div className="flex flex-wrap gap-2">
            {sgkCodes
              .filter((c) => c.code !== code.code)
              .slice(0, 10)
              .map((c) => (
                <Link
                  key={c.code}
                  href={`/sgk-cikis-kodlari/${c.slug}`}
                  className="px-4 py-2 rounded-lg bg-[var(--card)] border border-[var(--border-light)] text-sm hover:border-[var(--primary)] transition-colors"
                >
                  Kod {c.code}
                </Link>
              ))}
            <Link
              href="/sgk-cikis-kodlari"
              className="px-4 py-2 rounded-lg bg-[var(--primary)] text-white text-sm hover:bg-blue-700 transition-colors"
            >
              Tümünü Gör
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-sm text-[var(--text-muted)] border-t border-[var(--border-light)] bg-[var(--card)]/50">
        <div className="mx-auto max-w-[960px] px-4">
          <p className="mb-2">© {CURRENT_YEAR} Hakkım Ne? - Tüm hakları saklıdır.</p>
          <p className="text-xs">
            Bu bilgiler genel bilgilendirme amaçlıdır. Kesin sonuçlar için bir iş hukuku uzmanına danışın.
          </p>
        </div>
      </footer>
    </div>
  );
}
