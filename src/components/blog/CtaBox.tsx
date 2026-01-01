import Link from "next/link";
import { Calculator, Briefcase, Shield, Clock, Home, FileText, Calendar, DollarSign } from "lucide-react";

interface CtaBoxProps {
  ctaType: "SEVERANCE_CALC" | "UNEMPLOYMENT_CALC" | "NOTICE_PERIOD_CALC" | "AGI_CALC" | "MTV_CALC" | "BEDELLI_CALC" | "OVERTIME_CALC" | "RENT_CALC" | "RESIGNATION_LETTER" | "ANNUAL_LEAVE_CALC" | "ANNUAL_LEAVE_PAYMENT_CALC" | "NET_TO_GROSS_CALC" | "NONE";
}

const ctaConfig = {
  SEVERANCE_CALC: {
    title: "Kıdem Tazminatınızı Hesaplayın",
    description: "İşten ayrılırken hak ettiğiniz kıdem ve ihbar tazminatını saniyeler içinde öğrenin.",
    buttonText: "Hemen Hesapla",
    href: "/kidem-tazminati-hesaplama",
    icon: Calculator,
    gradient: "from-blue-600 to-blue-700",
  },
  UNEMPLOYMENT_CALC: {
    title: "İşsizlik Maaşınızı Hesaplayın",
    description: "İşsizlik sigortasından alacağınız maaşı ve süreyi öğrenin.",
    buttonText: "Hemen Hesapla",
    href: "/issizlik-maasi-hesaplama",
    icon: Briefcase,
    gradient: "from-green-600 to-green-700",
  },
  NOTICE_PERIOD_CALC: {
    title: "İhbar Sürenizi Hesaplayın",
    description: "İşten ayrılırken veya ayrılırken ihbar sürenizi ve ücretini hesaplayın.",
    buttonText: "Hemen Hesapla",
    href: "/ihbar-suresi-hesaplama",
    icon: Clock,
    gradient: "from-indigo-600 to-indigo-700",
  },
  AGI_CALC: {
    title: "Asgari Geçim İndirimi Hesaplayın",
    description: "Asgari geçim indirimi tutarınızı ve net maaş artışınızı hesaplayın.",
    buttonText: "Hemen Hesapla",
    href: "/agi-hesaplama",
    icon: Calculator,
    gradient: "from-cyan-600 to-cyan-700",
  },
  MTV_CALC: {
    title: "MTV Hesaplayın",
    description: "2026 yılı Motor Taşıtlar Vergisi tutarınızı ve taksit bilgilerinizi hesaplayın.",
    buttonText: "Hemen Hesapla",
    href: "/mtv-hesaplama",
    icon: Calculator,
    gradient: "from-slate-600 to-slate-700",
  },
  BEDELLI_CALC: {
    title: "Bedelli Askerlik Ücretini Hesaplayın",
    description: "2025 güncel bedelli askerlik ücreti ve yoklama kaçağı cezasını hesaplayın.",
    buttonText: "Hemen Hesapla",
    href: "/bedelli-askerlik-ucreti-hesaplama",
    icon: Shield,
    gradient: "from-amber-600 to-amber-700",
  },
  OVERTIME_CALC: {
    title: "Fazla Mesai Ücretinizi Hesaplayın",
    description: "Fazla mesai ve resmi tatil çalışmalarınızın karşılığını öğrenin.",
    buttonText: "Hemen Hesapla",
    href: "/fazla-mesai-ucreti-hesaplama",
    icon: Clock,
    gradient: "from-purple-600 to-purple-700",
  },
  RENT_CALC: {
    title: "Kira Artış Oranını Hesaplayın",
    description: "Yasal TÜFE oranına göre yeni kira bedelinizi hesaplayın.",
    buttonText: "Hemen Hesapla",
    href: "/kira-artis-orani-hesaplama",
    icon: Home,
    gradient: "from-teal-600 to-teal-700",
  },
  RESIGNATION_LETTER: {
    title: "İstifa Dilekçenizi Oluşturun",
    description: "Profesyonel istifa dilekçenizi saniyeler içinde hazırlayın ve yazdırın.",
    buttonText: "Dilekçe Oluştur",
    href: "/istifa-dilekcesi-olustur",
    icon: FileText,
    gradient: "from-rose-600 to-rose-700",
  },
  ANNUAL_LEAVE_CALC: {
    title: "Yıllık İzin Hakkınızı Hesaplayın",
    description: "Çalışma sürenize ve yaşınıza göre yıllık izin gün sayınızı öğrenin.",
    buttonText: "Hemen Hesapla",
    href: "/yillik-izin-hesaplama",
    icon: Calendar,
    gradient: "from-emerald-600 to-emerald-700",
  },
  ANNUAL_LEAVE_PAYMENT_CALC: {
    title: "Yıllık İzin Ücretinizi Hesaplayın",
    description: "Kullanılmayan yıllık izin günlerinizin ücretini hesaplayın.",
    buttonText: "Hemen Hesapla",
    href: "/yillik-izin-ucreti-hesaplama",
    icon: DollarSign,
    gradient: "from-green-600 to-green-700",
  },
  NET_TO_GROSS_CALC: {
    title: "Netten Brüte Hesaplama",
    description: "Net maaşınızdan brüt maaşınızı ve işverene maliyeti hesaplayın.",
    buttonText: "Hemen Hesapla",
    href: "/netten-brute-hesaplama",
    icon: Calculator,
    gradient: "from-indigo-600 to-indigo-700",
  },
  NONE: null,
};

export default function CtaBox({ ctaType }: CtaBoxProps) {
  const config = ctaConfig[ctaType];

  if (!config) return null;

  const Icon = config.icon;

  return (
    <div className={`rounded-xl bg-gradient-to-r ${config.gradient} p-4 text-white`}>
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-white/20 rounded-lg">
            <Icon className="h-4 w-4" />
          </div>
          <h3 className="text-sm font-semibold">{config.title}</h3>
        </div>
        <p className="text-white/90 text-xs">{config.description}</p>
        <Link
          href={config.href}
          className="inline-block w-full text-center px-4 py-2 bg-white text-gray-900 rounded-lg text-sm font-medium hover:bg-white/90 transition-colors"
        >
          {config.buttonText}
        </Link>
      </div>
    </div>
  );
}
