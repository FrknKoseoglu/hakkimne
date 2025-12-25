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
    href: "/",
    icon: Calculator,
    gradient: "from-blue-600 to-blue-700",
  },
  UNEMPLOYMENT_CALC: {
    title: "İşsizlik Maaşınızı Hesaplayın",
    description: "İşsizlik sigortasından alacağınız maaşı ve süreyi öğrenin.",
    buttonText: "Hemen Hesapla",
    href: "/issizlik-maasi",
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
    <div className={`rounded-xl bg-gradient-to-r ${config.gradient} p-6 text-white`}>
      <div className="flex items-start gap-4">
        <div className="p-3 bg-white/20 rounded-lg">
          <Icon className="h-6 w-6" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-2">{config.title}</h3>
          <p className="text-white/90 text-sm mb-4">{config.description}</p>
          <Link
            href={config.href}
            className="inline-block px-5 py-2.5 bg-white text-gray-900 rounded-lg font-medium hover:bg-white/90 transition-colors"
          >
            {config.buttonText}
          </Link>
        </div>
      </div>
    </div>
  );
}
