import Link from "next/link";
import { Calculator, Briefcase } from "lucide-react";

interface CtaBoxProps {
  ctaType: "SEVERANCE_CALC" | "UNEMPLOYMENT_CALC" | "NONE";
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
