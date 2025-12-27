"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Calendar, Calculator, FileText, Info, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

// Notice period rules based on Labor Law 4857/17
function calculateNoticePeriod(tenureMonths: number): { weeks: number; days: number; description: string } {
  if (tenureMonths < 6) {
    return { weeks: 2, days: 14, description: "0-6 ay arası çalışma" };
  } else if (tenureMonths < 18) {
    return { weeks: 4, days: 28, description: "6-18 ay arası çalışma" };
  } else if (tenureMonths < 36) {
    return { weeks: 6, days: 42, description: "18 ay - 3 yıl arası çalışma" };
  } else {
    return { weeks: 8, days: 56, description: "3 yıl üzeri çalışma" };
  }
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("tr-TR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function calculateTenureMonths(startDate: Date, endDate: Date): number {
  const years = endDate.getFullYear() - startDate.getFullYear();
  const months = endDate.getMonth() - startDate.getMonth();
  return years * 12 + months;
}

function formatTenure(startDate: Date, endDate: Date): string {
  const totalMonths = calculateTenureMonths(startDate, endDate);
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;
  
  if (years === 0) {
    return `${months} ay`;
  } else if (months === 0) {
    return `${years} yıl`;
  } else {
    return `${years} yıl ${months} ay`;
  }
}

export function NoticeCalculator() {
  const today = new Date().toISOString().split("T")[0];
  
  const [startDate, setStartDate] = useState<string>("");
  const [resignDate, setResignDate] = useState<string>(today);
  const [jobType, setJobType] = useState<"employee" | "employer">("employee");
  const [result, setResult] = useState<{
    tenureMonths: number;
    tenureText: string;
    noticePeriod: { weeks: number; days: number; description: string };
    lastWorkDay: Date;
  } | null>(null);

  const calculate = () => {
    if (!startDate || !resignDate) return;

    const start = new Date(startDate);
    const resign = new Date(resignDate);
    
    if (start >= resign) return;

    const tenureMonths = calculateTenureMonths(start, resign);
    const tenureText = formatTenure(start, resign);
    const noticePeriod = calculateNoticePeriod(tenureMonths);
    const lastWorkDay = addDays(resign, noticePeriod.days);

    setResult({
      tenureMonths,
      tenureText,
      noticePeriod,
      lastWorkDay,
    });
  };

  const contextText = useMemo(() => {
    if (jobType === "employee") {
      return {
        title: "İşçi Tarafından Fesih (İstifa)",
        description: "İstifa ettiğinizde, ihbar süresince çalışmaya devam etmeniz veya ihbar tazminatı ödemeniz gerekir.",
      };
    }
    return {
      title: "İşveren Tarafından Fesih",
      description: "İşveren sizi çıkardığında, ihbar süresince çalışmanız veya ihbar tazminatı almanız gerekir.",
    };
  }, [jobType]);

  return (
    <div className="space-y-6">
      {/* Form Card */}
      <div className="bg-[var(--card)] rounded-xl shadow-sm border border-[var(--border-light)] p-6 md:p-8">
        <div className="space-y-6">
          {/* Job Type Selection */}
          <div>
            <Label className="text-sm font-medium text-[var(--text-main)] mb-3 block">
              Fesih Türü
            </Label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setJobType("employee")}
                className={`p-4 rounded-lg border text-center transition-all cursor-pointer ${
                  jobType === "employee"
                    ? "border-[var(--primary)] bg-blue-50 dark:bg-blue-900/20 text-[var(--primary)]"
                    : "border-[var(--border-light)] bg-[var(--background-light)] text-[var(--text-muted)] hover:border-[var(--primary)]"
                }`}
              >
                <span className="text-sm font-medium">İşçi Tarafından</span>
                <p className="text-xs mt-1 opacity-70">İstifa</p>
              </button>
              <button
                type="button"
                onClick={() => setJobType("employer")}
                className={`p-4 rounded-lg border text-center transition-all cursor-pointer ${
                  jobType === "employer"
                    ? "border-[var(--primary)] bg-blue-50 dark:bg-blue-900/20 text-[var(--primary)]"
                    : "border-[var(--border-light)] bg-[var(--background-light)] text-[var(--text-muted)] hover:border-[var(--primary)]"
                }`}
              >
                <span className="text-sm font-medium">İşveren Tarafından</span>
                <p className="text-xs mt-1 opacity-70">Çıkarılma</p>
              </button>
            </div>
          </div>

          {/* Date Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate" className="text-sm font-medium text-[var(--text-main)]">
                İşe Giriş Tarihi
              </Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
                <input
                  type="date"
                  id="startDate"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full h-12 pl-11 pr-4 rounded-lg border border-[var(--border-light)] bg-[var(--background-light)] text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="resignDate" className="text-sm font-medium text-[var(--text-main)]">
                {jobType === "employee" ? "İstifa Tarihi" : "Fesih Bildirimi Tarihi"}
              </Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
                <input
                  type="date"
                  id="resignDate"
                  value={resignDate}
                  onChange={(e) => setResignDate(e.target.value)}
                  className="w-full h-12 pl-11 pr-4 rounded-lg border border-[var(--border-light)] bg-[var(--background-light)] text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Calculate Button */}
          <Button
            onClick={calculate}
            disabled={!startDate || !resignDate}
            className="w-full h-14 bg-[var(--primary)] hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 text-lg transition-transform active:scale-[0.98] cursor-pointer disabled:opacity-50"
          >
            <Calculator className="w-5 h-5" />
            HESAPLA
          </Button>
        </div>
      </div>

      {/* Result Card */}
      {result && (
        <div className="bg-[var(--card)] rounded-xl shadow-sm border border-[var(--border-light)] overflow-hidden">
          <div className="px-6 pt-6 pb-4 border-b border-[var(--border-light)] bg-blue-50 dark:bg-blue-900/20">
            <h3 className="text-xl font-bold text-blue-700 dark:text-blue-400 flex items-center gap-2">
              <Clock className="h-6 w-6" />
              {contextText.title}
            </h3>
            <p className="text-sm text-blue-600 dark:text-blue-300 mt-1">
              {contextText.description}
            </p>
          </div>

          <div className="p-6 md:p-8 space-y-6">
            {/* Tenure Info */}
            <div className="p-4 rounded-xl bg-[var(--muted)]">
              <p className="text-sm text-[var(--text-muted)]">Çalışma Süreniz</p>
              <p className="text-xl font-bold text-[var(--text-main)]">{result.tenureText}</p>
              <p className="text-xs text-[var(--text-muted)] mt-1">{result.noticePeriod.description}</p>
            </div>

            {/* Notice Period */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800 text-center">
                <p className="text-sm font-medium text-purple-600 dark:text-purple-400">İhbar Süresi</p>
                <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                  {result.noticePeriod.weeks} Hafta
                </p>
                <p className="text-sm text-purple-600 dark:text-purple-400">
                  ({result.noticePeriod.days} gün)
                </p>
              </div>

              <div className="p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800 text-center">
                <p className="text-sm font-medium text-green-600 dark:text-green-400">Son İş Günü</p>
                <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                  {formatDate(result.lastWorkDay)}
                </p>
                <p className="text-sm text-green-600 dark:text-green-400">
                  (Tahmini)
                </p>
              </div>
            </div>

            {/* CTA Button - Different for employee vs employer */}
            {jobType === "employee" ? (
              <Link
                href="/istifa-dilekcesi-olustur"
                className="flex items-center justify-center gap-2 w-full py-4 px-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg"
              >
                <FileText className="w-5 h-5" />
                İstifa Dilekçesi Oluştur
              </Link>
            ) : (
              <Link
                href="/kidem-tazminati-hesaplama"
                className="flex items-center justify-center gap-2 w-full py-4 px-6 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg"
              >
                <Calculator className="w-5 h-5" />
                Kıdem ve İhbar Tazminatı Hesapla
              </Link>
            )}

            {/* Info Box */}
            <div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-lg">
              <Info className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-amber-700 dark:text-amber-300">
                <p className="font-medium mb-1">Önemli</p>
                <p>
                  İhbar süresine uymak istemezseniz, karşı tarafa ihbar tazminatı ödemeniz gerekir. 
                  İhbar tazminatı, ihbar süresine denk gelen brüt ücret kadardır.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
