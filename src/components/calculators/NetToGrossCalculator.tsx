"use client";

import { useState } from "react";
import { Calculator, RotateCcw, TrendingUp, Info } from "lucide-react";

// 2026 Tax brackets (for gross calculation)
const TAX_BRACKETS_2026 = [
  { limit: 110000, rate: 0.15 },
  { limit: 230000, rate: 0.20 },
  { limit: 870000, rate: 0.27 },
  { limit: 3000000, rate: 0.35 },
  { limit: Infinity, rate: 0.40 },
];

// Minimum Living Allowance (AGI) rates for 2026
const AGI_RATES_2026 = {
  single: 0.5,
  married_working: 0.1,
  married_notworking: 0.15,
  child_first: 0.07,
  child_second: 0.07,
  child_others: 0.05,
};

// SSK rates
const SSK_EMPLOYEE_RATE = 0.14;
const STAMP_TAX_RATE = 0.00759;

// Workplace risk levels (İSG premium rates - employer portion)
const WORKPLACE_RISK_RATES: { [key: number]: number } = {
  1: 0.015,
  2: 0.02,
  3: 0.035,
  4: 0.043,
  5: 0.06,
  6: 0.065,
};

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

interface MonthlyData {
  netSalary: number;
  workDays: number;
  grossSalary: number;
  employeeSSK: number;
  employeeUnemployment: number;
  stampTax: number;
  incomeTax: number;
  agi: number;
  employerSSK: number;
  employerUnemployment: number;
  employerCost: number;
}

type EmployeeType = "normal" | "retired" | "janitor_normal" | "janitor_retired";
type DisabilityStatus = "none" | "first" | "second" | "third";

export function NetToGrossCalculator() {
  const [period, setPeriod] = useState("2026");
  const [employeeType, setEmployeeType] = useState<EmployeeType>("normal");
  const [includeAgi, setIncludeAgi] = useState(true);
  const [maritalStatus, setMaritalStatus] = useState<"single" | "married">("single");
  const [spouseWorking, setSpouseWorking] = useState(false);
  const [childrenCount, setChildrenCount] = useState(0);
  const [disabilityStatus, setDisabilityStatus] = useState<DisabilityStatus>("none");
  const [workplaceRisk, setWorkplaceRisk] = useState(1);
  const [incentive5510_4, setIncentive5510_4] = useState(false);
  const [incentive5510_5, setIncentive5510_5] = useState(false);
  const [incentive6486, setIncentive6486] = useState(false);
  const [startMonth, setStartMonth] = useState(0); // 0 = January

  // Monthly net salaries
  const [monthlyNetSalaries, setMonthlyNetSalaries] = useState<string[]>(Array(12).fill(""));
  const [monthlyWorkDays, setMonthlyWorkDays] = useState<number[]>(Array(12).fill(30));

  const [results, setResults] = useState<MonthlyData[]>([]);

  const monthNames = [
    "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
    "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"
  ];

  const calculateAGIRate = (): number => {
    let agiRate = 0;
    
    if (maritalStatus === "single") {
      agiRate += AGI_RATES_2026.single;
    } else {
      agiRate += spouseWorking ? AGI_RATES_2026.married_working : AGI_RATES_2026.married_notworking;
    }

    // Add children rates
    if (childrenCount >= 1) agiRate += AGI_RATES_2026.child_first;
    if (childrenCount >= 2) agiRate += AGI_RATES_2026.child_second;
    if (childrenCount > 2) agiRate += AGI_RATES_2026.child_others * (childrenCount - 2);

    return agiRate;
  };

  const calculateGrossFromNet = (netSalary: number, cumulativeTax: number): MonthlyData => {
    // This is an iterative approximation since we need to work backwards from net to gross
    let grossEstimate = netSalary * 1.5; // Initial estimate
    let iterations = 0;
    const maxIterations = 50;
    const tolerance = 0.01;

    while (iterations < maxIterations) {
      // Calculate SSK
      const ssk = grossEstimate * SSK_EMPLOYEE_RATE;
      
      // Calculate stamp tax
      const stampTax = grossEstimate * STAMP_TAX_RATE;
      
      // Calculate taxable base
      const taxableBase = grossEstimate - ssk;
      
      // Calculate income tax
      let incomeTax = 0;
      let remainingIncome = taxableBase + cumulativeTax;
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
      
      // Subtract cumulative tax portion
      incomeTax = Math.max(0, incomeTax - cumulativeTax * (incomeTax / (taxableBase + cumulativeTax)));
      
      // Calculate AGI discount
      let agi = 0;
      if (includeAgi) {
        const agiRate = calculateAGIRate();
        agi = Math.min(incomeTax, grossEstimate * agiRate);
      }
      
      // Calculate net
      const calculatedNet = grossEstimate - ssk - stampTax - incomeTax + agi;
      
      // Check if we're close enough
      const difference = Math.abs(calculatedNet - netSalary);
      if (difference < tolerance) {
        // Calculate employee unemployment insurance
        const employeeUnemployment = grossEstimate * 0.01;
        
        // Calculate employer portions
        const employerSSK = grossEstimate * 0.205; // Base employer SSK rate
        const employerUnemployment = grossEstimate * 0.02;
        const isgPremium = grossEstimate * (WORKPLACE_RISK_RATES[workplaceRisk] || 0.015);
        
        let employerCost = grossEstimate + employerSSK + employerUnemployment + isgPremium;
        
        // Apply incentives
        if (incentive5510_4) employerCost -= grossEstimate * 0.04;
        if (incentive5510_5) employerCost -= grossEstimate * 0.05;
        if (incentive6486) employerCost -= grossEstimate * 0.06;
        
        return {
          netSalary,
          workDays: 30,
          grossSalary: grossEstimate,
          employeeSSK: ssk,
          employeeUnemployment,
          stampTax,
          incomeTax: incomeTax - agi,
          agi,
          employerSSK,
          employerUnemployment,
          employerCost,
        };
      }
      
      // Adjust estimate
      if (calculatedNet > netSalary) {
        grossEstimate *= 0.99;
      } else {
        grossEstimate *= 1.01;
      }
      
      iterations++;
    }

    // Fallback if iterations exceeded
    const ssk = grossEstimate * SSK_EMPLOYEE_RATE;
    const employeeUnemployment = grossEstimate * 0.01;
    const stampTax = grossEstimate * STAMP_TAX_RATE;
    const employerSSK = grossEstimate * 0.205;
    const employerUnemployment = grossEstimate * 0.02;
    const employerCost = grossEstimate * 1.3;
    
    return {
      netSalary,
      workDays: 30,
      grossSalary: grossEstimate,
      employeeSSK: ssk,
      employeeUnemployment,
      stampTax,
      incomeTax: 0,
      agi: 0,
      employerSSK,
      employerUnemployment,
      employerCost,
    };
  };

  const handleCalculate = () => {
    const monthlyResults: MonthlyData[] = [];
    let cumulativeTax = 0;

    for (let i = 0; i < 12; i++) {
      const netSalaryStr = monthlyNetSalaries[i];
      if (!netSalaryStr || parseNumber(netSalaryStr) === 0) {
        continue;
      }

      const netSalary = parseNumber(netSalaryStr);
      const monthData = calculateGrossFromNet(netSalary, cumulativeTax);
      monthData.workDays = monthlyWorkDays[i];
      
      monthlyResults.push(monthData);
      
      // Update cumulative tax base
      cumulativeTax += monthData.grossSalary - monthData.employeeSSK;
    }

    setResults(monthlyResults);
  };

  const handleReset = () => {
    setMonthlyNetSalaries(Array(12).fill(""));
    setMonthlyWorkDays(Array(12).fill(30));
    setResults([]);
  };

  const updateNetSalary = (index: number, value: string) => {
    const newSalaries = [...monthlyNetSalaries];
    
    // Fill current month and all subsequent months
    if (value) {
      for (let i = index; i < 12; i++) {
        newSalaries[i] = value;
      }
    } else {
      newSalaries[index] = value;
    }
    
    setMonthlyNetSalaries(newSalaries);
  };

  const updateWorkDays = (index: number, value: number) => {
    const newDays = [...monthlyWorkDays];
    newDays[index] = value;
    setMonthlyWorkDays(newDays);
  };

  return (
    <div className="bg-[var(--card)] rounded-2xl border border-[var(--border-light)] p-6 md:p-8">
      <div className="space-y-6">
        {/* Basic Settings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[var(--text-main)] mb-2">
              Dönem
            </label>
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-[var(--border-light)] bg-[var(--background)] text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] cursor-pointer"
            >
              {Array.from({ length: 21 }, (_, i) => 2026 - i).map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--text-main)] mb-2">
              Çalışan Tipi
            </label>
            <select
              value={employeeType}
              onChange={(e) => setEmployeeType(e.target.value as EmployeeType)}
              className="w-full px-4 py-3 rounded-lg border border-[var(--border-light)] bg-[var(--background)] text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] cursor-pointer"
            >
              <option value="normal">Normal</option>
              <option value="retired">Emekli</option>
              <option value="janitor_normal">Konut Kapıcı (Normal)</option>
              <option value="janitor_retired">Konut Kapıcı (Emekli)</option>
            </select>
          </div>
        </div>

        {/* Family Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[var(--text-main)] mb-2">
              Medeni Durum
            </label>
            <select
              value={maritalStatus === "single" ? "single" : (spouseWorking ? "married_working" : "married_notworking")}
              onChange={(e) => {
                if (e.target.value === "single") {
                  setMaritalStatus("single");
                } else {
                  setMaritalStatus("married");
                  setSpouseWorking(e.target.value === "married_working");
                }
              }}
              className="w-full px-4 py-3 rounded-lg border border-[var(--border-light)] bg-[var(--background)] text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] cursor-pointer"
            >
              <option value="single">Bekar</option>
              <option value="married_notworking">Evli (Eş Çalışmıyor)</option>
              <option value="married_working">Evli (Eş Çalışıyor)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--text-main)] mb-2">
              Çocuk Sayısı
            </label>
            <select
              value={childrenCount}
              onChange={(e) => setChildrenCount(parseInt(e.target.value))}
              className="w-full px-4 py-3 rounded-lg border border-[var(--border-light)] bg-[var(--background)] text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] cursor-pointer"
            >
              {[0, 1, 2, 3, 4, 5, 6].map(num => (
                <option key={num} value={num}>{num === 6 ? "6 ve üstü" : num}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Disability and Workplace Risk */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[var(--text-main)] mb-2">
              Sakatlık Durumu
            </label>
            <select
              value={disabilityStatus}
              onChange={(e) => setDisabilityStatus(e.target.value as DisabilityStatus)}
              className="w-full px-4 py-3 rounded-lg border border-[var(--border-light)] bg-[var(--background)] text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] cursor-pointer"
            >
              <option value="none">Engelli Değil</option>
              <option value="first">1. Derece Engelli</option>
              <option value="second">2. Derece Engelli</option>
              <option value="third">3. Derece Engelli</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--text-main)] mb-2">
              İşyeri Tehlike Derecesi
            </label>
            <select
              value={workplaceRisk}
              onChange={(e) => setWorkplaceRisk(parseInt(e.target.value))}
              className="w-full px-4 py-3 rounded-lg border border-[var(--border-light)] bg-[var(--background)] text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] cursor-pointer"
            >
              {[1, 2, 3, 4, 5, 6].map(level => (
                <option key={level} value={level}>{level}. derece</option>
              ))}
            </select>
          </div>
        </div>

        {/* Incentives and AGI */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-[var(--text-main)]">
            Teşvikler ve Diğer Seçenekler
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={incentive5510_4}
                  onChange={(e) => setIncentive5510_4(e.target.checked)}
                  className="cursor-pointer"
                />
                <span className="text-sm text-[var(--text-main)]">5510 Sayılı Kanun Teşviki (%4)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={incentive5510_5}
                  onChange={(e) => setIncentive5510_5(e.target.checked)}
                  className="cursor-pointer"
                />
                <span className="text-sm text-[var(--text-main)]">5510 Sayılı Kanun Teşviki (%5)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={incentive6486}
                  onChange={(e) => setIncentive6486(e.target.checked)}
                  className="cursor-pointer"
                />
                <span className="text-sm text-[var(--text-main)]">6486 Sayılı Kanun Teşviki (%6)</span>
              </label>
            </div>
            <div className="flex items-center">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  id="includeAgi"
                  checked={!includeAgi}
                  onChange={(e) => setIncludeAgi(!e.target.checked)}
                  className="w-4 h-4 cursor-pointer"
                />
                <span className="text-sm text-[var(--text-main)]">AGİ hariç net ücretleri girerek hesaplama yap</span>
              </label>
            </div>
          </div>
        </div>

        {/* Monthly Net Salaries */}
        <div>
          <h3 className="text-lg font-semibold text-[var(--text-main)] mb-4">
            Aylık Net Ücretler / Gün Sayıları
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {monthNames.map((month, index) => (
              <div key={index} className="space-y-2">
                <label className="block text-sm font-medium text-[var(--text-main)]">
                  {month}
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    inputMode="decimal"
                    value={monthlyNetSalaries[index]}
                    onChange={(e) => updateNetSalary(index, e.target.value)}
                    placeholder="₺"
                    className="flex-1 px-3 py-2 rounded-lg border border-[var(--border-light)] bg-[var(--background)] text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  />
                  <input
                    type="number"
                    min="1"
                    max="31"
                    value={monthlyWorkDays[index]}
                    onChange={(e) => updateWorkDays(index, parseInt(e.target.value) || 30)}
                    className="w-16 px-2 py-2 rounded-lg border border-[var(--border-light)] bg-[var(--background)] text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  />
                </div>
              </div>
            ))}
          </div>
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
            onClick={handleCalculate}
            className="flex-1 py-3 px-6 bg-[var(--primary)] text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <Calculator className="w-5 h-5" />
            Hesapla
          </button>
        </div>

        {/* Results */}
        {results.length > 0 && (
          <div className="mt-8 space-y-4">
            <h3 className="text-xl font-bold text-[var(--text-main)] flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-green-600" />
              Hesaplama Sonuçları
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[var(--muted)]">
                    <th className="px-4 py-3 text-left font-semibold text-[var(--text-main)]">Ay</th>
                    <th className="px-4 py-3 text-right font-semibold text-[var(--text-main)]">Net Maaş</th>
                    <th className="px-4 py-3 text-right font-semibold text-[var(--text-main)]">Brüt Maaş</th>
                    <th className="px-4 py-3 text-right font-semibold text-[var(--text-main)]">İşçi SGK</th>
                    <th className="px-4 py-3 text-right font-semibold text-[var(--text-main)]">İşçi İşsizlik</th>
                    <th className="px-4 py-3 text-right font-semibold text-[var(--text-main)]">Gelir Vergisi</th>
                    <th className="px-4 py-3 text-right font-semibold text-[var(--text-main)]">Damga Vergisi</th>
                    <th className="px-4 py-3 text-right font-semibold text-[var(--text-main)]">AGİ</th>
                    <th className="px-4 py-3 text-right font-semibold text-[var(--text-main)]">İşveren SGK</th>
                    <th className="px-4 py-3 text-right font-semibold text-[var(--text-main)]">İşveren İşsizlik</th>
                    <th className="px-4 py-3 text-right font-semibold text-[var(--text-main)]">İşverene Maliyet</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((result, index) => (
                    <tr key={index} className="border-t border-[var(--border-light)]">
                      <td className="px-4 py-3 text-[var(--text-main)]">{monthNames[index]}</td>
                      <td className="px-4 py-3 text-right text-[var(--text-main)]">{formatCurrency(result.netSalary)}</td>
                      <td className="px-4 py-3 text-right font-semibold text-green-600">{formatCurrency(result.grossSalary)}</td>
                      <td className="px-4 py-3 text-right text-red-600">{formatCurrency(result.employeeSSK)}</td>
                      <td className="px-4 py-3 text-right text-red-600">{formatCurrency(result.employeeUnemployment)}</td>
                      <td className="px-4 py-3 text-right text-red-600">{formatCurrency(result.incomeTax)}</td>
                      <td className="px-4 py-3 text-right text-red-600">{formatCurrency(result.stampTax)}</td>
                      <td className="px-4 py-3 text-right text-green-600">{formatCurrency(result.agi)}</td>
                      <td className="px-4 py-3 text-right text-orange-600">{formatCurrency(result.employerSSK)}</td>
                      <td className="px-4 py-3 text-right text-orange-600">{formatCurrency(result.employerUnemployment)}</td>
                      <td className="px-4 py-3 text-right font-semibold text-blue-600">{formatCurrency(result.employerCost)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Annual Total Employer Cost */}
            <div className="mt-6 p-6 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              <p className="text-sm opacity-90 mb-1">İŞVERENE YILLIK TOPLAM MALİYET</p>
              <p className="text-3xl font-bold">
                {formatCurrency(results.reduce((sum, r) => sum + r.employerCost, 0))}
              </p>
            </div>

            <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Tabloda gösterilen aylık brüt maaşlar, girdiğiniz net maaşlara göre hesaplanmıştır. 
                İşverene maliyet, SGK işveren payı ve diğer yasal yükümlülükleri içerir.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
