"use client";

import { useState, useMemo } from "react";
import { BEDELLI_ASKERLIK, calculateYearlyFines, YearlyFineBreakdown } from "@/lib/financial-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Calculator,
  Calendar,
  AlertTriangle,
  Shield,
  Info,
  ChevronRight,
} from "lucide-react";

// Turkish number formatting (e.g., 99.332,50)
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

// Calculate difference in days and payable months between two dates
// Uses "Ay ve Kesri" rule: any fraction of a month counts as a full month
function calculateDateDiff(startDate: Date, endDate: Date) {
  const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  // Calculate full completed months
  let fullMonths =
    (endDate.getFullYear() - startDate.getFullYear()) * 12 +
    (endDate.getMonth() - startDate.getMonth());

  // If end day is before start day, we haven't completed that month yet
  if (endDate.getDate() < startDate.getDate()) {
    fullMonths = Math.max(0, fullMonths - 1);
  }

  // Calculate payableMonths using "Ay ve Kesri" rule (round up)
  // Any remaining days after full months = +1 month
  const exactMonthEndDate = new Date(startDate);
  exactMonthEndDate.setMonth(exactMonthEndDate.getMonth() + fullMonths);
  
  // Check if there are any remaining days (fraction of a month)
  const hasFraction = endDate > exactMonthEndDate;
  const payableMonths = hasFraction ? fullMonths + 1 : fullMonths;

  return { days: diffDays, months: payableMonths };
}

type CaptureType = "kendiliginden" | "yakalanma";

interface CalculationResult {
  baseBedelli: number;
  ekBedel: number;
  idariParaCezasi: number;
  total: number;
  days: number;
  months: number;
  yearlyBreakdown?: YearlyFineBreakdown[];
}

export function MilitaryCalculator() {
  const [activeTab, setActiveTab] = useState<"standard" | "kacak">("standard");
  const [evasionStartDate, setEvasionStartDate] = useState<string>("");
  const [captureType, setCaptureType] = useState<CaptureType>("kendiliginden");
  const [wantsBedelli, setWantsBedelli] = useState<boolean>(true);
  const [result, setResult] = useState<CalculationResult | null>(null);

  // Calculate standard Bedelli fee
  const standardBedelliFee = useMemo(() => {
    return (
      BEDELLI_ASKERLIK.BEDELLI_GOSTERGE *
      BEDELLI_ASKERLIK.MEMUR_MAAS_KATSAYISI
    );
  }, []);

  const calculateEvaderCost = () => {
    if (!evasionStartDate) return;

    const startDate = new Date(evasionStartDate);
    const today = new Date();
    const { days, months } = calculateDateDiff(startDate, today);

    // Base Bedelli (if they want it)
    const baseBedelli = wantsBedelli ? standardBedelliFee : 0;

    // Ek Bedel (only if they want Bedelli)
    const ekBedel = wantsBedelli
      ? months *
        BEDELLI_ASKERLIK.EK_BEDEL_GOSTERGE *
        BEDELLI_ASKERLIK.MEMUR_MAAS_KATSAYISI
      : 0;

    // İdari Para Cezası - YEAR BY YEAR CALCULATION
    const fineResult = calculateYearlyFines(startDate, today, captureType);
    const idariParaCezasi = fineResult.total;
    const yearlyBreakdown = fineResult.breakdown;

    const total = baseBedelli + ekBedel + idariParaCezasi;

    setResult({
      baseBedelli,
      ekBedel,
      idariParaCezasi,
      total,
      days,
      months,
      yearlyBreakdown,
    });
  };

  const resetCalculator = () => {
    setEvasionStartDate("");
    setCaptureType("kendiliginden");
    setWantsBedelli(true);
    setResult(null);
  };

  return (
    <div className="space-y-6">
      {/* Tab Selector */}
      <div className="flex rounded-xl bg-[var(--muted)] p-1.5">
        <button
          onClick={() => {
            setActiveTab("standard");
            resetCalculator();
          }}
          className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all cursor-pointer ${
            activeTab === "standard"
              ? "bg-[var(--card)] text-[var(--primary)] shadow-sm"
              : "text-[var(--text-muted)] hover:text-[var(--text-main)]"
          }`}
        >
          <Shield className="w-4 h-4 inline-block mr-2" />
          Standart Bedelli
        </button>
        <button
          onClick={() => {
            setActiveTab("kacak");
            resetCalculator();
          }}
          className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all cursor-pointer ${
            activeTab === "kacak"
              ? "bg-[var(--card)] text-[var(--primary)] shadow-sm"
              : "text-[var(--text-muted)] hover:text-[var(--text-main)]"
          }`}
        >
          <AlertTriangle className="w-4 h-4 inline-block mr-2" />
          Yoklama Kaçağı / Bakaya
        </button>
      </div>

      {/* Standard Bedelli Tab */}
      {activeTab === "standard" && (
        <div className="bg-[var(--card)] rounded-2xl p-6 md:p-8 border border-[var(--border-light)] shadow-lg">
          <div className="text-center space-y-6">
            {/* Period Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium">
              <Calendar className="w-4 h-4" />
              01 Temmuz 2025 - 31 Aralık 2025
            </div>

            {/* Main Amount */}
            <div>
              <p className="text-sm text-[var(--text-muted)] mb-2">
                2025 Bedelli Askerlik Ücreti
              </p>
              <p className="text-4xl md:text-5xl font-bold text-[var(--primary)]">
                {formatCurrency(standardBedelliFee)}
              </p>
            </div>

            {/* Calculation Breakdown */}
            <div className="bg-[var(--muted)] rounded-xl p-4 text-sm text-[var(--text-muted)]">
              <div className="flex justify-between mb-2">
                <span>Bedelli Göstergesi</span>
                <span className="font-mono">
                  {BEDELLI_ASKERLIK.BEDELLI_GOSTERGE.toLocaleString("tr-TR")}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Memur Maaş Katsayısı</span>
                <span className="font-mono">
                  {BEDELLI_ASKERLIK.MEMUR_MAAS_KATSAYISI}
                </span>
              </div>
              <div className="border-t border-[var(--border-light)] mt-3 pt-3 flex justify-between font-medium text-[var(--text-main)]">
                <span>Toplam</span>
                <span>{formatCurrency(standardBedelliFee)}</span>
              </div>
            </div>

            {/* Info Note */}
            <div className="flex items-start gap-3 text-left bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
              <Info className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-amber-800 dark:text-amber-200">
                Bu tutar, yoklama kaçağı veya bakaya durumunda olmayan kişiler
                içindir. Kaçak durumundaysanız &quot;Yoklama Kaçağı / Bakaya&quot;
                sekmesini kullanın.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Evader Calculator Tab */}
      {activeTab === "kacak" && (
        <div className="space-y-6">
          {/* Warning Banner */}
          <div className="flex items-start gap-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
            <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-800 dark:text-red-200">
              <strong>Dikkat:</strong> Kaçak kaldığınız her ay için bedelli
              ücreti artmaktadır. Ayrıca idari para cezası uygulanır.
            </p>
          </div>

          {/* Input Form */}
          <div className="bg-[var(--card)] rounded-2xl p-6 border border-[var(--border-light)] shadow-lg space-y-6">
            {/* Evasion Start Date */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-[var(--text-main)]">
                Kaçak Durumuna Düştüğünüz Tarih
              </label>
              <Input
                type="date"
                value={evasionStartDate}
                onChange={(e) => setEvasionStartDate(e.target.value)}
                max={new Date().toISOString().split("T")[0]}
                className="w-full"
              />
              <p className="text-xs text-[var(--text-muted)]">
                Yoklama kaçağı veya bakaya durumuna düştüğünüz tarihi girin.
              </p>
            </div>

            {/* Capture Type */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-[var(--text-main)]">
                Durumunuz
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setCaptureType("kendiliginden")}
                  className={`p-4 rounded-xl border-2 text-left transition-all cursor-pointer ${
                    captureType === "kendiliginden"
                      ? "border-[var(--primary)] bg-blue-50 dark:bg-blue-900/20"
                      : "border-[var(--border-light)] hover:border-[var(--text-muted)]"
                  }`}
                >
                  <div className="font-medium text-[var(--text-main)]">
                    Kendiliğimden Gittim
                  </div>
                  <div className="text-xs text-[var(--text-muted)] mt-1">
                    Daha düşük idari para cezası
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setCaptureType("yakalanma")}
                  className={`p-4 rounded-xl border-2 text-left transition-all cursor-pointer ${
                    captureType === "yakalanma"
                      ? "border-[var(--primary)] bg-blue-50 dark:bg-blue-900/20"
                      : "border-[var(--border-light)] hover:border-[var(--text-muted)]"
                  }`}
                >
                  <div className="font-medium text-[var(--text-main)]">
                    Yakalandım
                  </div>
                  <div className="text-xs text-[var(--text-muted)] mt-1">
                    Daha yüksek idari para cezası
                  </div>
                </button>
              </div>
            </div>

            {/* Wants Bedelli Toggle */}
            <div className="flex items-center justify-between p-4 bg-[var(--muted)] rounded-xl">
              <div>
                <div className="font-medium text-[var(--text-main)]">
                  Bedelli Askerlik Yapmak İstiyorum
                </div>
                <div className="text-xs text-[var(--text-muted)] mt-1">
                  Kapatırsanız sadece idari para cezası hesaplanır
                </div>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={wantsBedelli}
                onClick={() => setWantsBedelli(!wantsBedelli)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                  wantsBedelli ? "bg-[var(--primary)]" : "bg-gray-300 dark:bg-gray-600"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    wantsBedelli ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {/* Calculate Button */}
            <Button
              onClick={calculateEvaderCost}
              disabled={!evasionStartDate}
              className="w-full py-6 text-lg font-semibold cursor-pointer"
            >
              <Calculator className="w-5 h-5 mr-2" />
              Hesapla
            </Button>
          </div>

          {/* Results */}
          {result && (
            <div className="bg-[var(--card)] rounded-2xl p-6 border border-[var(--border-light)] shadow-lg space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Duration Info */}
              <div className="flex items-center justify-center gap-4 text-sm">
                <div className="bg-[var(--muted)] px-4 py-2 rounded-lg">
                  <span className="text-[var(--text-muted)]">Toplam Süre:</span>{" "}
                  <span className="font-semibold text-[var(--text-main)]">
                    {result.days} gün ({result.months} ay)
                  </span>
                </div>
              </div>

              {/* Total Amount */}
              <div className="text-center py-4">
                <p className="text-sm text-[var(--text-muted)] mb-2">
                  Toplam Ödenecek Tutar
                </p>
                <p className="text-4xl md:text-5xl font-bold text-[var(--primary)]">
                  {formatCurrency(result.total)}
                </p>
              </div>

              {/* Breakdown */}
              <div className="space-y-3">
                {wantsBedelli && (
                  <>
                    <div className="flex justify-between items-center py-3 border-b border-[var(--border-light)]">
                      <div>
                        <div className="font-medium text-[var(--text-main)]">
                          Temel Bedelli Ücreti
                        </div>
                        <div className="text-xs text-[var(--text-muted)]">
                          Standart bedelli askerlik ücreti
                        </div>
                      </div>
                      <div className="font-semibold text-[var(--text-main)]">
                        {formatCurrency(result.baseBedelli)}
                      </div>
                    </div>

                    <div className="flex justify-between items-center py-3 border-b border-[var(--border-light)]">
                      <div>
                        <div className="font-medium text-red-600 dark:text-red-400">
                          Kaçak Süresi İçin Ek Ücret
                        </div>
                        <div className="text-xs text-[var(--text-muted)]">
                          {result.months} ay × {BEDELLI_ASKERLIK.EK_BEDEL_GOSTERGE.toLocaleString("tr-TR")} × {BEDELLI_ASKERLIK.MEMUR_MAAS_KATSAYISI}
                        </div>
                      </div>
                      <div className="font-semibold text-red-600 dark:text-red-400">
                        +{formatCurrency(result.ekBedel)}
                      </div>
                    </div>
                  </>
                )}

                <div className="py-3">
                  <div className="font-medium text-amber-600 dark:text-amber-400 mb-2">
                    İdari Para Cezası (Yıl Bazlı)
                  </div>
                  
                  {/* Year-by-year breakdown */}
                  {result.yearlyBreakdown && result.yearlyBreakdown.length > 1 && (
                    <div className="space-y-2">
                      {result.yearlyBreakdown.map((item) => (
                        <div key={item.year} className="flex justify-between text-xs text-[var(--text-muted)] bg-[var(--muted)] px-3 py-2 rounded">
                          <span>{item.year}: {item.days} gün × {item.dailyRate.toFixed(2)} TL</span>
                          <span className="font-mono">{formatCurrency(item.total)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Simple display for single year */}
                  {result.yearlyBreakdown && result.yearlyBreakdown.length === 1 && (
                    <div className="text-xs text-[var(--text-muted)] mb-2">
                      {result.days} gün × {result.yearlyBreakdown[0].dailyRate.toFixed(2)} TL
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center mt-3 pt-3 border-t border-[var(--border-light)]">
                    <div className="text-xs text-[var(--text-muted)]">
                      Toplam {result.days} gün (Vergi Dairesine ödenir)
                    </div>
                    <div className="font-semibold text-amber-600 dark:text-amber-400 text-lg">
                      +{formatCurrency(result.idariParaCezasi)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Info */}
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-800 dark:text-blue-200">
                    <p className="font-medium mb-1">Ödeme Bilgisi</p>
                    <ul className="space-y-1 text-xs">
                      {wantsBedelli && (
                        <li className="flex items-center gap-1">
                          <ChevronRight className="w-3 h-3" />
                          Bedelli ücreti + Ek bedel → Askerlik Şubesine
                        </li>
                      )}
                      <li className="flex items-center gap-1">
                        <ChevronRight className="w-3 h-3" />
                        İdari para cezası → Vergi Dairesine
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Reset Button */}
              <Button
                variant="outline"
                onClick={resetCalculator}
                className="w-full cursor-pointer"
              >
                Yeni Hesaplama
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
