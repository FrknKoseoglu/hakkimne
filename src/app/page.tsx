import { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { 
  Calculator, 
  Briefcase, 
  FileText, 
  ArrowRight,
  ShieldCheck,
  Users,
  Clock,
  CheckCircle,
  Wallet,
  Shield,
  Home as HomeIcon,
  Percent,
  TrendingUp
} from "lucide-react";
import { CURRENT_YEAR } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Hakkım Ne? | ${CURRENT_YEAR} Tazminat ve İşçi Hakları Hesaplama`,
  description: `${CURRENT_YEAR} güncel kıdem tazminatı, ihbar tazminatı ve işsizlik maaşı hesaplama. Yasal haklarınızı ücretsiz olarak hemen öğrenin.`,
  keywords: [
    "hakkım ne",
    "kıdem tazminatı hesaplama",
    "ihbar tazminatı",
    "işsizlik maaşı hesaplama",
    "işçi hakları",
    `${CURRENT_YEAR} tazminat hesaplama`,
  ],
  openGraph: {
    title: `Hakkım Ne? | Tazminat ve İşçi Hakları Hesaplama`,
    description: `${CURRENT_YEAR} güncel tazminat hesaplama araçları. Yasal haklarınızı ücretsiz öğrenin.`,
    type: "website",
  },
};

// Section 1: İşten Ayrılma Süreci
const istenAyrilmaTools = [
  {
    title: "Kıdem & İhbar Tazminatı",
    description: "İşten ayrılırken alacağınız kıdem ve ihbar tazminatını güncel vergi dilimleri ile hesaplayın.",
    icon: Briefcase,
    href: "/kidem-tazminati-hesaplama",
    color: "blue",
  },
  {
    title: "İşsizlik Maaşı",
    description: "İşsiz kaldığınızda ne kadar ve kaç ay işsizlik maaşı alacağınızı öğrenin.",
    icon: Wallet,
    href: "/issizlik-maasi-hesaplama",
    color: "purple",
  },
  {
    title: "İstifa Dilekçesi Oluştur",
    description: "Profesyonel istifa dilekçesi şablonları ile kolayca dilekçenizi hazırlayın.",
    icon: FileText,
    href: "/istifa-dilekcesi-olustur",
    color: "green",
  },
  {
    title: "İhbar Süresi Hesaplama",
    description: "İstifa ettikten sonra kaç hafta çalışmanız gerektiğini öğrenin.",
    icon: Clock,
    href: "/ihbar-suresi-hesaplama",
    color: "indigo",
  },
];

// Section 2: Günlük Finans & Haklar
const finansHaklarTools = [
  {
    title: "Bedelli Askerlik",
    description: "Bedelli askerlik ücreti ve taksit seçeneklerini güncel rakamlarla hesaplayın.",
    icon: Shield,
    href: "/bedelli-askerlik-ucreti-hesaplama",
    color: "indigo",
  },
  {
    title: "Fazla Mesai Ücreti",
    description: "Fazla mesai çalışma saatlerinize göre hak ettiğiniz ücreti hesaplayın.",
    icon: Clock,
    href: "/fazla-mesai-ucreti-hesaplama",
    color: "orange",
  },
  {
    title: "Kira Artış Oranı",
    description: "Yasal sınırlar dahilinde maksimum kira artış oranınızı öğrenin.",
    icon: HomeIcon,
    href: "/kira-artis-orani-hesaplama",
    color: "teal",
  },
  {
    title: "Maaş Zammı Hesaplama",
    description: "Zam oranınızı veya yeni maaşınızı enflasyon karşılaştırmalı hesaplayın.",
    icon: TrendingUp,
    href: "/maas-zammi-hesaplama",
    color: "green",
  },
];

const stats = [
  { value: "100+", label: "Hesaplama Yapıldı" },
  { value: "%100", label: "Ücretsiz" },
  { value: "7/24", label: "Erişilebilir" },
];

// Color mapping for tool cards
const colorClasses: Record<string, { bg: string; icon: string; hover: string }> = {
  blue: {
    bg: "bg-blue-100 dark:bg-blue-900/30",
    icon: "text-blue-600 dark:text-blue-400",
    hover: "group-hover:bg-blue-600 group-hover:text-white",
  },
  purple: {
    bg: "bg-purple-100 dark:bg-purple-900/30",
    icon: "text-purple-600 dark:text-purple-400",
    hover: "group-hover:bg-purple-600 group-hover:text-white",
  },
  green: {
    bg: "bg-green-100 dark:bg-green-900/30",
    icon: "text-green-600 dark:text-green-400",
    hover: "group-hover:bg-green-600 group-hover:text-white",
  },
  indigo: {
    bg: "bg-indigo-100 dark:bg-indigo-900/30",
    icon: "text-indigo-600 dark:text-indigo-400",
    hover: "group-hover:bg-indigo-600 group-hover:text-white",
  },
  orange: {
    bg: "bg-orange-100 dark:bg-orange-900/30",
    icon: "text-orange-600 dark:text-orange-400",
    hover: "group-hover:bg-orange-600 group-hover:text-white",
  },
  teal: {
    bg: "bg-teal-100 dark:bg-teal-900/30",
    icon: "text-teal-600 dark:text-teal-400",
    hover: "group-hover:bg-teal-600 group-hover:text-white",
  },
};

// Reusable Tool Card Component
function ToolCard({ tool }: { tool: typeof istenAyrilmaTools[0] }) {
  const Icon = tool.icon;
  const colors = colorClasses[tool.color];

  return (
    <Link
      href={tool.href}
      className="group flex flex-col h-full bg-[var(--card)] rounded-2xl p-6 border border-[var(--border-light)] hover:shadow-xl hover:border-[var(--primary)] transition-all duration-300"
    >
      <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 transition-colors ${colors.bg} ${colors.icon} ${colors.hover}`}>
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="text-xl font-bold text-[var(--text-main)] mb-2 group-hover:text-[var(--primary)] transition-colors">
        {tool.title}
      </h3>
      <p className="text-[var(--text-muted)] text-sm flex-grow">
        {tool.description}
      </p>
      <div className="mt-4 flex items-center gap-2 text-[var(--primary)] font-medium group-hover:gap-3 transition-all">
        Hesaplamaya Git
        <ArrowRight className="w-4 h-4" />
      </div>
    </Link>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--background-light)]">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[var(--primary)] to-blue-700 text-white py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
            Yasal Haklarınızı <span className="text-yellow-300">Hemen</span> Öğrenin
          </h1>
          <p className="text-base md:text-lg opacity-90 max-w-2xl mx-auto mb-6">
            {CURRENT_YEAR} güncel verileriyle kıdem tazminatı, ihbar tazminatı ve işsizlik maaşı hesaplayın. 
            <strong> Tamamen ücretsiz</strong>, verileriniz güvende.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/kidem-tazminati-hesaplama"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition-colors shadow-lg"
            >
              <Briefcase className="w-5 h-5" />
              Tazminat Hesapla
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/issizlik-maasi-hesaplama"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 transition-colors border border-white/30"
            >
              <Calculator className="w-5 h-5" />
              İşsizlik Maaşı Hesapla
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-8 bg-[var(--card)] border-b border-[var(--border-light)]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <p className="text-2xl md:text-3xl font-bold text-[var(--primary)]">{stat.value}</p>
                <p className="text-sm text-[var(--text-muted)]">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 1: İşten Ayrılma Süreci */}
      <section className="py-16 md:py-20 bg-[var(--background-light)]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-main)] mb-4">
              İşten Ayrılma Süreci
            </h2>
            <p className="text-lg text-[var(--text-muted)] max-w-2xl mx-auto">
              İşten çıkarken haklarınızı öğrenin ve sürecinizi yönetin.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {istenAyrilmaTools.map((tool, index) => (
              <ToolCard key={index} tool={tool} />
            ))}
          </div>
        </div>
      </section>

      {/* Section 2: Günlük Finans & Haklar */}
      <section className="py-16 md:py-20 bg-[var(--muted)]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-main)] mb-4">
              Günlük Finans & Haklar
            </h2>
            <p className="text-lg text-[var(--text-muted)] max-w-2xl mx-auto">
              Maaşınız, kiranız ve askerlik süreciniz için pratik hesaplamalar.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {finansHaklarTools.map((tool, index) => (
              <ToolCard key={index} tool={tool} />
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-[var(--background-light)]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-main)] mb-4">
              Neden Hakkım Ne?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <ShieldCheck className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-[var(--text-main)] mb-2">%100 Gizlilik</h3>
              <p className="text-sm text-[var(--text-muted)]">
                Tüm hesaplamalar tarayıcınızda yapılır. Verileriniz sunucularımıza gönderilmez.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <Clock className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-[var(--text-main)] mb-2">Güncel Veriler</h3>
              <p className="text-sm text-[var(--text-muted)]">
                {CURRENT_YEAR} yılı vergi dilimleri, asgari ücret ve tavan tutarları ile hesaplama.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <Users className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-[var(--text-main)] mb-2">Kolay Kullanım</h3>
              <p className="text-sm text-[var(--text-muted)]">
                Basit form arayüzü ile saniyeler içinde sonucunuzu öğrenin.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-[var(--muted)]">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-[var(--text-main)] mb-4">
            Haklarınızı Öğrenmeye Hazır mısınız?
          </h2>
          <p className="text-[var(--text-muted)] mb-8">
            Hemen ücretsiz hesaplama yapın ve yasal haklarınızı öğrenin.
          </p>
          <Link
            href="/kidem-tazminati-hesaplama"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[var(--primary)] text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-lg"
          >
            <Calculator className="w-5 h-5" />
            Hesaplamaya Başla
            <ArrowRight className="w-5 h-5" />
          </Link>
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
