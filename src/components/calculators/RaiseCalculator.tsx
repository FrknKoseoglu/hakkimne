"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, TrendingDown, Calculator, Percent, AlertTriangle, CheckCircle } from "lucide-react";

// 2025 annual inflation reference (TÜFE)
const ANNUAL_INFLATION = 30.89;

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function formatPercent(value: number): string {
  return `%${value.toFixed(2)}`;
}

export function RaiseCalculator() {
  // Mode A: Rate -> Amount
  const [modeASalary, setModeASalary] = useState<string>("");
  const [modeARate, setModeARate] = useState<string>("");
  const [modeAResult, setModeAResult] = useState<{
    oldSalary: number;
    raiseAmount: number;
    raiseRate: number;
    newSalary: number;
  } | null>(null);

  // Mode B: Amount -> Rate
  const [modeBOldSalary, setModeBOldSalary] = useState<string>("");
  const [modeBNewSalary, setModeBNewSalary] = useState<string>("");
  const [modeBResult, setModeBResult] = useState<{
    oldSalary: number;
    raiseAmount: number;
    raiseRate: number;
    newSalary: number;
  } | null>(null);

  const calculateModeA = () => {
    const currentSalary = parseFloat(modeASalary.replace(/[^\d.,]/g, "").replace(",", "."));
    const raiseRate = parseFloat(modeARate.replace(",", "."));

    if (isNaN(currentSalary) || isNaN(raiseRate) || currentSalary <= 0) {
      return;
    }

    const raiseAmount = currentSalary * (raiseRate / 100);
    const newSalary = currentSalary + raiseAmount;

    setModeAResult({
      oldSalary: currentSalary,
      raiseAmount,
      raiseRate,
      newSalary,
    });
  };

  const calculateModeB = () => {
    const oldSalary = parseFloat(modeBOldSalary.replace(/[^\d.,]/g, "").replace(",", "."));
    const newSalary = parseFloat(modeBNewSalary.replace(/[^\d.,]/g, "").replace(",", "."));

    if (isNaN(oldSalary) || isNaN(newSalary) || oldSalary <= 0) {
      return;
    }

    const raiseAmount = newSalary - oldSalary;
    const raiseRate = (raiseAmount / oldSalary) * 100;

    setModeBResult({
      oldSalary,
      raiseAmount,
      raiseRate,
      newSalary,
    });
  };

  const ResultCard = ({ result }: { result: typeof modeAResult }) => {
    if (!result) return null;

    const isAboveInflation = result.raiseRate >= ANNUAL_INFLATION;

    return (
      <div className="mt-6 p-6 rounded-2xl bg-[var(--card)] border border-[var(--border-light)] space-y-4">
        {/* Inflation Badge */}
        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${
          isAboveInflation 
            ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400" 
            : "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400"
        }`}>
          {isAboveInflation ? (
            <>
              <CheckCircle className="w-4 h-4" />
              Enflasyon üzeri artış
            </>
          ) : (
            <>
              <AlertTriangle className="w-4 h-4" />
              Bu zam oranı yıllık enflasyonun altında
            </>
          )}
        </div>

        {/* Result Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-[var(--muted)]">
            <p className="text-sm text-[var(--text-muted)] mb-1">Eski Maaş</p>
            <p className="text-lg font-semibold text-[var(--text-main)]">
              {formatCurrency(result.oldSalary)}
            </p>
          </div>
          <div className="p-4 rounded-xl bg-[var(--muted)]">
            <p className="text-sm text-[var(--text-muted)] mb-1">Yapılan Zam Tutarı</p>
            <p className={`text-lg font-semibold ${result.raiseAmount >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
              {result.raiseAmount >= 0 ? "+" : ""}{formatCurrency(result.raiseAmount)}
            </p>
          </div>
        </div>

        {/* Raise Rate */}
        <div className="p-4 rounded-xl bg-[var(--muted)] flex items-center justify-between">
          <div>
            <p className="text-sm text-[var(--text-muted)] mb-1">Zam Oranı</p>
            <p className={`text-xl font-bold ${result.raiseRate >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
              {result.raiseRate >= 0 ? "+" : ""}{formatPercent(result.raiseRate)}
            </p>
          </div>
          <div className="text-sm text-[var(--text-muted)]">
            Referans Enflasyon: {formatPercent(ANNUAL_INFLATION)}
          </div>
        </div>

        {/* New Salary - Highlighted */}
        <div className="p-6 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <p className="text-sm opacity-90 mb-1">YENİ MAAŞ</p>
          <p className="text-3xl font-bold">
            {formatCurrency(result.newSalary)}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-[var(--card)] rounded-2xl border border-[var(--border-light)] p-6 md:p-8">
      <Tabs defaultValue="rate-to-amount" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="rate-to-amount" className="gap-2">
            <TrendingUp className="w-4 h-4" />
            <span className="hidden sm:inline">Yeni Maaşı Hesapla</span>
            <span className="sm:hidden">Yeni Maaş</span>
          </TabsTrigger>
          <TabsTrigger value="amount-to-rate" className="gap-2">
            <Percent className="w-4 h-4" />
            <span className="hidden sm:inline">Zam Oranını Hesapla</span>
            <span className="sm:hidden">Zam Oranı</span>
          </TabsTrigger>
        </TabsList>

        {/* Mode A: Rate -> Amount */}
        <TabsContent value="rate-to-amount">
          <div className="space-y-4">
            <p className="text-sm text-[var(--text-muted)]">
              Mevcut maaşınızı ve zam oranını girerek yeni maaşınızı hesaplayın.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[var(--text-main)] mb-2">
                  Mevcut Maaş (₺)
                </label>
                <input
                  type="text"
                  inputMode="decimal"
                  value={modeASalary}
                  onChange={(e) => setModeASalary(e.target.value)}
                  placeholder="Örn: 25000"
                  className="w-full px-4 py-3 rounded-lg border border-[var(--border-light)] bg-[var(--background)] text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-main)] mb-2">
                  Zam Oranı (%)
                </label>
                <input
                  type="text"
                  inputMode="decimal"
                  value={modeARate}
                  onChange={(e) => setModeARate(e.target.value)}
                  placeholder="Örn: 35"
                  className="w-full px-4 py-3 rounded-lg border border-[var(--border-light)] bg-[var(--background)] text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                />
              </div>
            </div>

            <button
              onClick={calculateModeA}
              className="w-full py-3 px-6 bg-[var(--primary)] text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Calculator className="w-5 h-5" />
              Hesapla
            </button>

            <ResultCard result={modeAResult} />
          </div>
        </TabsContent>

        {/* Mode B: Amount -> Rate */}
        <TabsContent value="amount-to-rate">
          <div className="space-y-4">
            <p className="text-sm text-[var(--text-muted)]">
              Eski ve yeni maaşınızı girerek zam oranınızı hesaplayın.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[var(--text-main)] mb-2">
                  Eski Maaş (₺)
                </label>
                <input
                  type="text"
                  inputMode="decimal"
                  value={modeBOldSalary}
                  onChange={(e) => setModeBOldSalary(e.target.value)}
                  placeholder="Örn: 25000"
                  className="w-full px-4 py-3 rounded-lg border border-[var(--border-light)] bg-[var(--background)] text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-main)] mb-2">
                  Yeni Maaş (₺)
                </label>
                <input
                  type="text"
                  inputMode="decimal"
                  value={modeBNewSalary}
                  onChange={(e) => setModeBNewSalary(e.target.value)}
                  placeholder="Örn: 33750"
                  className="w-full px-4 py-3 rounded-lg border border-[var(--border-light)] bg-[var(--background)] text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                />
              </div>
            </div>

            <button
              onClick={calculateModeB}
              className="w-full py-3 px-6 bg-[var(--primary)] text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Calculator className="w-5 h-5" />
              Hesapla
            </button>

            <ResultCard result={modeBResult} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
