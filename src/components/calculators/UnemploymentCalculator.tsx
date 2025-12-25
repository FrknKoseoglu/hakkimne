"use client";

import { useState, useMemo, useCallback } from "react";
import { getFinancialData } from "@/lib/financial-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calculator,
  Wallet,
  Clock,
  AlertTriangle,
  Info,
  Briefcase,
  CheckCircle,
  RotateCcw,
} from "lucide-react";
import { CURRENT_YEAR } from "@/lib/constants";

// Constants
const STAMP_TAX_RATE = 0.00759; // Damga Vergisi

// Premium day options with corresponding benefit duration
const PREMIUM_DAY_OPTIONS = [
  { value: "600-899", label: "600 - 899 gün", months: 6 },
  { value: "900-1079", label: "900 - 1079 gün", months: 8 },
  { value: "1080+", label: "1080 gün ve üzeri", months: 10 },
];

interface CalculationResult {
  grossBenefit: number;
  stampTax: number;
  netBenefit: number;
  durationMonths: number;
  totalNetBenefit: number;
  isCapped: boolean;
  ceiling: number;
}

// Turkish number formatting (e.g., 99.332,50)
function formatTurkishNumber(value: string): string {
  let cleaned = value.replace(/[^\d,]/g, "");
  const parts = cleaned.split(",");
  let integerPart = parts[0] || "";
  const decimalPart = parts.length > 1 ? parts[1].slice(0, 2) : "";
  integerPart = integerPart.replace(/^0+/, "") || "0";
  integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  if (parts.length > 1) {
    return `${integerPart},${decimalPart}`;
  }
  return integerPart === "0" ? "" : integerPart;
}

// Parse Turkish formatted number to raw number
function parseTurkishNumber(value: string): number {
  if (!value) return 0;
  const normalized = value.replace(/\./g, "").replace(",", ".");
  return parseFloat(normalized) || 0;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

interface CurrencyInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  id?: string;
}

function CurrencyInput({ value, onChange, placeholder, className, id }: CurrencyInputProps) {
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatTurkishNumber(e.target.value);
    onChange(formatted);
  }, [onChange]);

  return (
    <Input
      id={id}
      type="text"
      inputMode="decimal"
      placeholder={placeholder}
      value={value}
      onChange={handleChange}
      className={className}
    />
  );
}

export function UnemploymentCalculator() {
  const [grossSalary, setGrossSalary] = useState<string>("");
  const [premiumDays, setPremiumDays] = useState<string>("");
  const [result, setResult] = useState<CalculationResult | null>(null);

  // Get current minimum wage
  const currentMinWage = useMemo(() => {
    const today = new Date();
    const financialData = getFinancialData(today);
    return financialData.minGrossWage;
  }, []);

  const calculateBenefit = () => {
    const salary = parseTurkishNumber(grossSalary);
    
    if (salary <= 0 || !premiumDays) {
      return;
    }

    // Find duration based on premium days
    const selectedOption = PREMIUM_DAY_OPTIONS.find(
      (opt) => opt.value === premiumDays
    );
    const durationMonths = selectedOption?.months || 6;

    // Step A: Calculate 40% of gross salary
    const calculatedBenefit = salary * 0.4;

    // Step B: Apply ceiling (80% of minimum wage)
    const ceiling = currentMinWage * 0.8;
    const isCapped = calculatedBenefit > ceiling;
    const grossBenefit = Math.min(calculatedBenefit, ceiling);

    // Step C: Deduct stamp tax
    const stampTax = grossBenefit * STAMP_TAX_RATE;
    const netBenefit = grossBenefit - stampTax;

    // Total benefit over the period
    const totalNetBenefit = netBenefit * durationMonths;

    setResult({
      grossBenefit,
      stampTax,
      netBenefit,
      durationMonths,
      totalNetBenefit,
      isCapped,
      ceiling,
    });
  };

  const resetCalculator = () => {
    setGrossSalary("");
    setPremiumDays("");
    setResult(null);
  };

  return (
    <div className="w-full space-y-8">
      {/* Form Card */}
      <div className="bg-[var(--card)] rounded-xl shadow-sm border border-[var(--border-light)] overflow-hidden">
        <div className="px-6 pt-8 pb-4 border-b border-[var(--border-light)]">
          <h2 className="text-2xl font-bold text-[var(--text-main)] leading-tight">
            İşsizlik Maaşı Hesaplama {CURRENT_YEAR}
          </h2>
          <p className="text-[var(--text-muted)] mt-2 text-base">
            Son 4 aylık brüt maaş ortalamanızı ve prim gün sayınızı girerek işsizlik maaşınızı hesaplayın.
          </p>
        </div>

        <div className="p-6 md:p-8 space-y-8">
          {/* Temel Bilgiler Section */}
          <div>
            <h3 className="text-lg font-semibold text-[var(--text-main)] mb-4 flex items-center gap-2">
              <Briefcase className="text-[var(--primary)] w-5 h-5" />
              Temel Bilgiler <span className="text-sm font-normal text-[var(--text-muted)]">(Zorunlu)</span>
            </h3>
            <div className="flex flex-col md:flex-row gap-4">
              {/* Son 4 Aylık Ortalama Brüt Maaş - 60% */}
              <div className="w-full md:w-[60%] space-y-2">
                <Label htmlFor="grossSalary" className="text-sm font-medium text-[var(--text-main)]">
                  Son 4 Aylık Ortalama Brüt Maaşınız
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] font-medium text-lg">
                    ₺
                  </span>
                  <CurrencyInput
                    id="grossSalary"
                    value={grossSalary}
                    onChange={setGrossSalary}
                    placeholder="Örn: 30.000"
                    className="h-12 pl-9 pr-4 w-full rounded-lg border border-[var(--border-light)] bg-[var(--background-light)] focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                  />
                </div>
                <p className="text-xs text-[var(--text-muted)]">
                  İşyerinizden aldığınız son 4 ayın brüt maaş ortalamasını girin.
                </p>
              </div>

              {/* Prim Gün Sayısı - 40% */}
              <div className="w-full md:w-[40%] space-y-2">
                <Label htmlFor="premiumDays" className="text-sm font-medium text-[var(--text-main)]">
                  Son 3 Yıl İçindeki Prim Gün Sayısı
                </Label>
                <Select value={premiumDays} onValueChange={setPremiumDays}>
                  <SelectTrigger className="!h-12 w-full rounded-lg border border-[var(--border-light)] bg-[var(--background-light)] focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all">
                    <SelectValue placeholder="Prim gün sayınızı seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    {PREMIUM_DAY_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-[var(--text-muted)]">
                  SGK hizmet dökümünüzden kontrol edebilirsiniz.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-[var(--border-light)]">
            <Button
              type="button"
              onClick={resetCalculator}
              className="h-14 px-6 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl shadow-lg shadow-red-500/30 flex items-center justify-center gap-2 text-lg transition-transform active:scale-[0.98] cursor-pointer"
            >
              <RotateCcw className="w-5 h-5" />
              Sıfırla
            </Button>
            <Button
              onClick={calculateBenefit}
              disabled={!grossSalary || !premiumDays}
              className="flex-1 h-14 bg-[#2463eb] hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 text-lg transition-transform active:scale-[0.98] cursor-pointer disabled:opacity-50"
            >
              <Calculator className="w-5 h-5" />
              HESAPLA
            </Button>
          </div>
        </div>
      </div>

      {/* Results Card */}
      {result && (
        <div className="bg-[var(--card)] rounded-xl shadow-sm border border-[var(--border-light)] overflow-hidden">
          <div className="px-6 pt-6 pb-4 border-b border-[var(--border-light)] bg-green-50 dark:bg-green-900/20">
            <h3 className="text-xl font-bold text-green-700 dark:text-green-400 flex items-center gap-2">
              <CheckCircle className="h-6 w-6" />
              Hesaplama Sonucu
            </h3>
          </div>

          <div className="p-6 md:p-8 space-y-6">
            {/* Capped Warning */}
            {result.isCapped && (
              <div className="flex items-start gap-3 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-yellow-800 dark:text-yellow-300">
                    Tavan Ücret Uygulandı
                  </p>
                  <p className="text-sm text-yellow-700 dark:text-yellow-400">
                    Hesaplanan tutar, yasa gereği Asgari Ücretin %80&apos;ini ({formatCurrency(result.ceiling)}) geçemez.
                  </p>
                </div>
              </div>
            )}

            {/* Main Result */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Net Monthly Benefit */}
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 text-center border border-blue-100 dark:border-blue-800">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Wallet className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                    Aylık Alınacak Maaş (Net)
                  </span>
                </div>
                <p className="text-3xl md:text-4xl font-bold text-blue-700 dark:text-blue-300">
                  {formatCurrency(result.netBenefit)}
                </p>
              </div>

              {/* Duration */}
              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-6 text-center border border-purple-100 dark:border-purple-800">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Clock className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
                    Maaş Süresi
                  </span>
                </div>
                <p className="text-3xl md:text-4xl font-bold text-purple-700 dark:text-purple-300">
                  {result.durationMonths} Ay
                </p>
              </div>
            </div>

            {/* Details */}
            <div className="bg-[var(--muted)] rounded-xl p-5">
              <h4 className="font-semibold text-[var(--text-main)] mb-3 flex items-center gap-2">
                <Info className="h-4 w-4" />
                Detaylı Hesaplama
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-[var(--text-muted)]">Brüt İşsizlik Maaşı:</span>
                  <span className="font-medium">{formatCurrency(result.grossBenefit)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--text-muted)]">Damga Vergisi (%0,759):</span>
                  <span className="font-medium text-red-600 dark:text-red-400">-{formatCurrency(result.stampTax)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--text-muted)]">Net Aylık Maaş:</span>
                  <span className="font-medium">{formatCurrency(result.netBenefit)}</span>
                </div>
                <div className="border-t border-[var(--border-light)] my-3"></div>
                <div className="flex justify-between text-base">
                  <span className="text-[var(--text-muted)]">Toplam Alınacak ({result.durationMonths} Ay):</span>
                  <span className="font-bold text-green-600 dark:text-green-400">{formatCurrency(result.totalNetBenefit)}</span>
                </div>
              </div>
            </div>

            {/* Info Box */}
            <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg">
              <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-700 dark:text-blue-300">
                <p className="font-medium mb-1">Önemli Bilgi</p>
                <p>
                  İşsizlik maaşı almaya hak kazanmak için son 3 yıl içinde en az 600
                  gün prim ödemiş olmanız ve son 120 günün kesintisiz çalışılmış olması
                  gerekmektedir.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Current Minimum Wage Info */}
      <div className="bg-[var(--muted)] rounded-xl p-4 border border-[var(--border-light)]">
        <div className="flex items-center justify-between text-sm">
          <span className="text-[var(--text-muted)]">
            {CURRENT_YEAR} Asgari Ücret (Brüt):
          </span>
          <span className="font-medium">{formatCurrency(currentMinWage)}</span>
        </div>
        <div className="flex items-center justify-between text-sm mt-1">
          <span className="text-[var(--text-muted)]">
            İşsizlik Maaşı Tavanı (%80):
          </span>
          <span className="font-medium">
            {formatCurrency(currentMinWage * 0.8)}
          </span>
        </div>
      </div>
    </div>
  );
}
