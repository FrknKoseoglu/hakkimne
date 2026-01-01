"use client";

import { useState } from "react";
import { Calculator, RotateCcw, DollarSign, Info } from "lucide-react";

// Helper functions from other calculators
function calculateYearsOfService(startDate: Date, endDate: Date): number {
  const years = endDate.getFullYear() - startDate.getFullYear();
  const monthDiff = endDate.getMonth() - startDate.getMonth();
  const dayDiff = endDate.getDate() - startDate.getDate();
  
  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    return years - 1;
  }
  
  return years;
}

function calculateAge(birthDate: Date, currentDate: Date): number {
  const years = currentDate.getFullYear() - birthDate.getFullYear();
  const monthDiff = currentDate.getMonth() - birthDate.getMonth();
  const dayDiff = currentDate.getDate() - birthDate.getDate();
  
  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    return years - 1;
  }
  
  return years;
}

// Annual leave entitlement calculation
function calculateAnnualLeaveEntitlement(yearsOfService: number, age: number): number {
  // Private sector rules (İş Kanunu 4857)
  let baseDays = 0;
  
  if (yearsOfService < 1) {
    return 0;
  } else if (yearsOfService >= 1 && yearsOfService <= 5) {
    baseDays = 14;
  } else if (yearsOfService > 5 && yearsOfService < 15) {
    baseDays = 20;
  } else {
    baseDays = 26;
  }

  // Age-based minimum (18 and under or 50 and over get minimum 20 days)
  if (age <= 18 || age >= 50) {
    if (baseDays < 20) {
      baseDays = 20;
    }
  }

  return baseDays;
}

// 2026 Tax brackets
const TAX_BRACKETS_2026 = [
  { limit: 110000, rate: 0.15 },
  { limit: 230000, rate: 0.20 },
  { limit: 870000, rate: 0.27 },
  { limit: 3000000, rate: 0.35 },
  { limit: Infinity, rate: 0.40 },
];

const SSK_EMPLOYEE_RATE = 0.14;
const UNEMPLOYMENT_RATE = 0.01;
const STAMP_TAX_RATE = 0.00759;

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

function parseNumber(value: string): number {
  return parseFloat(value.replace(/[^0-9.,]/g, "").replace(",", ".")) || 0;
}

// Net to Gross conversion (approximate)
function netToGross(netSalary: number): number {
  // Iterative approximation
  let grossEstimate = netSalary * 1.5;
  const maxIterations = 50;
  const tolerance = 0.01;

  for (let i = 0; i < maxIterations; i++) {
    const ssk = grossEstimate * SSK_EMPLOYEE_RATE;
    const unemployment = grossEstimate * UNEMPLOYMENT_RATE;
    const stampTax = grossEstimate * STAMP_TAX_RATE;
    const taxableBase = grossEstimate - ssk;

    let incomeTax = 0;
    let remainingIncome = taxableBase;
    let previousLimit = 0;

    for (const bracket of TAX_BRACKETS_2026) {
      if (remainingIncome > bracket.limit) {
        incomeTax += (bracket.limit - previousLimit) * bracket.rate;
        previousLimit = bracket.limit;
      } else {
        incomeTax += (remainingIncome - previousLimit) * bracket.rate;
        break;
      }
    }

    const calculatedNet = grossEstimate - ssk - unemployment - stampTax - incomeTax;

    if (Math.abs(calculatedNet - netSalary) < tolerance) {
      return grossEstimate;
    }

    grossEstimate *= (calculatedNet > netSalary) ? 0.99 : 1.01;
  }

  return grossEstimate;
}

export function AnnualLeavePaymentCalculator() {
  const [birthDate, setBirthDate] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [usedLeaveDays, setUsedLeaveDays] = useState("0");
  const [calculationType, setCalculationType] = useState<"net" | "gross">("gross");
  const [salaryInput, setSalaryInput] = useState("");

  const [result, setResult] = useState<{
    age: number;
    yearsOfService: number;
    totalEntitlement: number;
    usedDays: number;
    unusedDays: number;
    dailyGrossWage: number;
    grossLeavePayment: number;
    sskDeduction: number;
    unemploymentDeduction: number;
    incomeTax: number;
    stampTax: number;
    totalDeductions: number;
    netLeavePayment: number;
  } | null>(null);

  const calculateLeavePayment = () => {
    if (!birthDate || !startDate || !endDate || !salaryInput) {
      return;
    }

    const birth = new Date(birthDate);
    const start = new Date(startDate);
    const end = new Date(endDate);

    const age = calculateAge(birth, end);
    const yearsOfService = calculateYearsOfService(start, end);
    const totalEntitlement = calculateAnnualLeaveEntitlement(yearsOfService, age);
    const usedDays = parseNumber(usedLeaveDays);
    const unusedDays = Math.max(0, totalEntitlement - usedDays);

    if (unusedDays === 0) {
      return;
    }

    // Get gross salary
    const inputSalary = parseNumber(salaryInput);
    const grossSalary = calculationType === "net" ? netToGross(inputSalary) : inputSalary;

    // Calculate daily gross wage
    const dailyGrossWage = grossSalary / 30;

    // Calculate gross leave payment
    const grossLeavePayment = dailyGrossWage * unusedDays;

    // Calculate SSK deduction (14%)
    const sskDeduction = grossLeavePayment * SSK_EMPLOYEE_RATE;

    // Calculate unemployment insurance (1%)
    const unemploymentDeduction = grossLeavePayment * UNEMPLOYMENT_RATE;

    // Calculate taxable base (gross - SSK)
    const taxableBase = grossLeavePayment - sskDeduction;

    // Calculate income tax using progressive brackets
    let incomeTax = 0;
    let remainingIncome = taxableBase;
    let previousLimit = 0;

    for (const bracket of TAX_BRACKETS_2026) {
      if (remainingIncome > bracket.limit) {
        incomeTax += (bracket.limit - previousLimit) * bracket.rate;
        previousLimit = bracket.limit;
      } else {
        incomeTax += (remainingIncome - previousLimit) * bracket.rate;
        break;
      }
    }

    // Calculate stamp tax (0.759%)
    const stampTax = grossLeavePayment * STAMP_TAX_RATE;

    // Calculate total deductions
    const totalDeductions = sskDeduction + unemploymentDeduction + incomeTax + stampTax;

    // Calculate net leave payment
    const netLeavePayment = grossLeavePayment - totalDeductions;

    setResult({
      age,
      yearsOfService,
      totalEntitlement,
      usedDays,
      unusedDays,
      dailyGrossWage,
      grossLeavePayment,
      sskDeduction,
      unemploymentDeduction,
      incomeTax,
      stampTax,
      totalDeductions,
      netLeavePayment,
    });
  };

  const handleReset = () => {
    setBirthDate("");
    setStartDate("");
    setEndDate("");
    setUsedLeaveDays("0");
    setSalaryInput("");
    setResult(null);
  };

  return (
    <div className="bg-[var(--card)] rounded-2xl border border-[var(--border-light)] p-6 md:p-8">
      <div className="space-y-6">
        {/* Date Fields */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-[var(--text-main)] mb-2">
              Doğum Tarihi *
            </label>
            <input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-[var(--border-light)] bg-[var(--background)] text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--text-main)] mb-2">
              İşe Başlama Tarihi *
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-[var(--border-light)] bg-[var(--background)] text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] cursor-pointer"
            />
            <p className="text-xs text-[var(--text-muted)] mt-1">(Deneme süresi dahil)</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--text-main)] mb-2">
              İşten Ayrılma Tarihi *
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-[var(--border-light)] bg-[var(--background)] text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] cursor-pointer"
            />
          </div>
        </div>

        {/* Used Leave Days */}
        <div>
          <label className="block text-sm font-medium text-[var(--text-main)] mb-2">
            Kullanılan İzin Süresi *
            <span className="text-xs text-[var(--text-muted)] block">(Son çalışma yılında kullanılan ücretli izin günü sayısı)</span>
          </label>
          <select
            value={usedLeaveDays}
            onChange={(e) => setUsedLeaveDays(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-[var(--border-light)] bg-[var(--background)] text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] cursor-pointer"
          >
            {Array.from({ length: 27 }, (_, i) => (
              <option key={i} value={i}>{i} gün</option>
            ))}
          </select>
        </div>

        {/* Calculation Type */}
        <div>
          <label className="block text-sm font-medium text-[var(--text-main)] mb-3">
            Hesaplama Şekli *
          </label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                checked={calculationType === "net"}
                onChange={() => setCalculationType("net")}
                className="cursor-pointer"
              />
              <span className="text-sm text-[var(--text-main)]">Net maaş ile hesapla</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                checked={calculationType === "gross"}
                onChange={() => setCalculationType("gross")}
                className="cursor-pointer"
              />
              <span className="text-sm text-[var(--text-main)]">Brüt maaş ile hesapla</span>
            </label>
          </div>
        </div>

        {/* Salary Input */}
        <div>
          <label className="block text-sm font-medium text-[var(--text-main)] mb-2">
            {calculationType === "net" ? "Aylık Net Maaş *" : "Aylık Brüt Maaş *"}
          </label>
          <input
            type="text"
            inputMode="decimal"
            value={salaryInput}
            onChange={(e) => setSalaryInput(e.target.value)}
            placeholder={calculationType === "net" ? "Örn: 36250,75" : "Örn: 42000"}
            className="w-full px-4 py-3 rounded-lg border border-[var(--border-light)] bg-[var(--background)] text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
          />
          <p className="text-xs text-[var(--text-muted)] mt-1">
            Son çalışma ayındaki aylık {calculationType === "net" ? "net" : "brüt"} maaş
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={handleReset}
            className="px-6 py-3 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-5 h-5" />
            Sıfırla
          </button>
          <button
            onClick={calculateLeavePayment}
            className="flex-1 py-3 px-6 bg-[var(--primary)] text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <Calculator className="w-5 h-5" />
            Hesapla
          </button>
        </div>

        {/* Results */}
        {result && result.unusedDays > 0 && (
          <div className="mt-8 space-y-4">
            <h3 className="text-xl font-bold text-[var(--text-main)] flex items-center gap-2">
              <DollarSign className="w-6 h-6 text-green-600" />
              Hesaplama Sonucu
            </h3>

            {/* Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-[var(--muted)]">
                <p className="text-sm text-[var(--text-muted)] mb-1">Yaşınız</p>
                <p className="text-xl font-bold text-[var(--text-main)]">{result.age}</p>
              </div>
              <div className="p-4 rounded-xl bg-[var(--muted)]">
                <p className="text-sm text-[var(--text-muted)] mb-1">Çalışma Süresi</p>
                <p className="text-xl font-bold text-[var(--text-main)]">{result.yearsOfService} yıl</p>
              </div>
              <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20">
                <p className="text-sm text-[var(--text-muted)] mb-1">Yıllık İzin Hakkınız</p>
                <p className="text-xl font-bold text-blue-600 dark:text-blue-400">{result.totalEntitlement} gün</p>
              </div>
              <div className="p-4 rounded-xl bg-green-50 dark:bg-green-900/20">
                <p className="text-sm text-[var(--text-muted)] mb-1">Kullanılmayan İzin</p>
                <p className="text-xl font-bold text-green-600 dark:text-green-400">{result.unusedDays} gün</p>
              </div>
            </div>

            {/* Daily Wage Info */}
            <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-[var(--text-muted)] mb-1">Günlük Brüt Ücret</p>
              <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
                {formatCurrency(result.dailyGrossWage)}
              </p>
            </div>

            {/* Gross Payment */}
            <div className="p-4 rounded-xl bg-[var(--muted)]">
              <p className="text-sm text-[var(--text-muted)] mb-1">Brüt İzin Ücreti</p>
              <p className="text-2xl font-bold text-[var(--text-main)]">
                {formatCurrency(result.grossLeavePayment)}
              </p>
            </div>

            {/* Deductions Breakdown */}
            <div className="space-y-2">
              <p className="text-sm font-semibold text-[var(--text-main)]">Kesintiler:</p>
              
              <div className="flex items-center justify-between p-3 rounded-lg bg-red-50 dark:bg-red-900/20">
                <span className="text-sm text-[var(--text-main)]">SGK İşçi Payı (%14)</span>
                <span className="font-semibold text-red-600 dark:text-red-400">
                  -{formatCurrency(result.sskDeduction)}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-red-50 dark:bg-red-900/20">
                <span className="text-sm text-[var(--text-main)]">İşsizlik Sigortası (%1)</span>
                <span className="font-semibold text-red-600 dark:text-red-400">
                  -{formatCurrency(result.unemploymentDeduction)}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-red-50 dark:bg-red-900/20">
                <span className="text-sm text-[var(--text-main)]">Gelir Vergisi</span>
                <span className="font-semibold text-red-600 dark:text-red-400">
                  -{formatCurrency(result.incomeTax)}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-red-50 dark:bg-red-900/20">
                <span className="text-sm text-[var(--text-main)]">Damga Vergisi (%0.759)</span>
                <span className="font-semibold text-red-600 dark:text-red-400">
                  -{formatCurrency(result.stampTax)}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-orange-50 dark:bg-orange-900/20 border-t-2 border-orange-300 dark:border-orange-700">
                <span className="text-sm font-semibold text-[var(--text-main)]">Toplam Kesinti</span>
                <span className="font-bold text-orange-600 dark:text-orange-400">
                  -{formatCurrency(result.totalDeductions)}
                </span>
              </div>
            </div>

            {/* Net Payment - Highlighted */}
            <div className="p-6 rounded-xl bg-gradient-to-r from-green-500 to-green-600 text-white">
              <p className="text-sm opacity-90 mb-1">NET ÖDENECEK İZİN ÜCRETİ</p>
              <p className="text-4xl font-bold">{formatCurrency(result.netLeavePayment)}</p>
            </div>

            {/* Explanation */}
            <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-blue-700 dark:text-blue-300">
                {result.yearsOfService} yıllık çalışma süresi ve {result.age} yaşınız ile {result.totalEntitlement} gün yıllık izin hakkınız vardır. 
                {result.usedDays > 0 && ` ${result.usedDays} gün kullanılmış, `}
                {result.unusedDays} gün kullanılmamış izniniz için yukarıdaki tutar ödenecektir.
              </p>
            </div>
          </div>
        )}

        {result && result.unusedDays === 0 && (
          <div className="mt-8 p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
            <p className="text-sm text-amber-700 dark:text-amber-400">
              Kullanılmayan yıllık izin günü bulunmamaktadır. Tüm izin haklarınızı kullanmışsınız.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
