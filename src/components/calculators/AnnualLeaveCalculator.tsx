"use client";

import { useState } from "react";
import { Calendar, Calculator, RotateCcw, Info } from "lucide-react";

type EmployeeType = "private" | "government";

function formatNumber(num: number): string {
  return num.toString();
}

function calculateYearsOfService(startDate: Date, currentDate: Date = new Date()): number {
  const years = currentDate.getFullYear() - startDate.getFullYear();
  const monthDiff = currentDate.getMonth() - startDate.getMonth();
  const dayDiff = currentDate.getDate() - startDate.getDate();
  
  // If haven't reached the anniversary month/day yet, subtract one year
  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    return years - 1;
  }
  
  return years;
}

function calculateAge(birthDate: Date, currentDate: Date = new Date()): number {
  const years = currentDate.getFullYear() - birthDate.getFullYear();
  const monthDiff = currentDate.getMonth() - birthDate.getMonth();
  const dayDiff = currentDate.getDate() - birthDate.getDate();
  
  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    return years - 1;
  }
  
  return years;
}

export function AnnualLeaveCalculator() {
  const [employeeType, setEmployeeType] = useState<EmployeeType>("private");
  const [birthDate, setBirthDate] = useState("");
  const [startDate, setStartDate] = useState("");
  const [isUnderground, setIsUnderground] = useState(false);
  
  const [result, setResult] = useState<{
    age: number;
    yearsOfService: number;
    baseDays: number;
    ageBonusDays: number;
    undergroundBonusDays: number;
    totalDays: number;
    explanation: string;
  } | null>(null);

  const calculateLeave = () => {
    if (!birthDate || !startDate) {
      return;
    }

    const birth = new Date(birthDate);
    const start = new Date(startDate);
    const now = new Date();

    const age = calculateAge(birth, now);
    const yearsOfService = calculateYearsOfService(start, now);

    let baseDays = 0;
    let ageBonusDays = 0;
    let undergroundBonusDays = 0;
    let explanation = "";

    if (employeeType === "private") {
      // Private sector (İş Kanunu 4857)
      if (yearsOfService < 1) {
        baseDays = 0;
        explanation = "En az 1 yıl çalışma süresi gereklidir.";
      } else if (yearsOfService >= 1 && yearsOfService <= 5) {
        baseDays = 14;
        explanation = "1-5 yıl arası çalışma süresi için 14 gün yıllık izin hakkı.";
      } else if (yearsOfService > 5 && yearsOfService < 15) {
        baseDays = 20;
        explanation = "5-15 yıl arası çalışma süresi için 20 gün yıllık izin hakkı.";
      } else {
        baseDays = 26;
        explanation = "15 yıl ve üzeri çalışma süresi için 26 gün yıllık izin hakkı.";
      }

      // Age-based minimum (18 and under or 50 and over)
      if (age <= 18 || age >= 50) {
        if (baseDays < 20) {
          ageBonusDays = 20 - baseDays;
          baseDays = 20;
          explanation += ` ${age <= 18 ? "18 yaş ve altı" : "50 yaş ve üzeri"} olduğunuz için minimum 20 gün izin hakkınız bulunmaktadır.`;
        }
      }

      // Underground work bonus
      if (isUnderground) {
        undergroundBonusDays = 4;
        explanation += " Yeraltı işlerinde çalıştığınız için 4 gün ek izin hakkınız var.";
      }
    } else {
      // Government employee (Devlet Memurları Kanunu 657)
      if (yearsOfService < 1) {
        baseDays = 0;
        explanation = "En az 1 yıl çalışma süresi gereklidir.";
      } else if (yearsOfService >= 1 && yearsOfService <= 10) {
        baseDays = 20;
        explanation = "1-10 yıl arası çalışma süresi için 20 gün yıllık izin hakkı.";
      } else {
        baseDays = 30;
        explanation = "10 yıldan fazla çalışma süresi için 30 gün yıllık izin hakkı.";
      }
    }

    const totalDays = baseDays + ageBonusDays + undergroundBonusDays;

    setResult({
      age,
      yearsOfService,
      baseDays: baseDays - ageBonusDays,
      ageBonusDays,
      undergroundBonusDays,
      totalDays,
      explanation,
    });
  };

  const handleReset = () => {
    setBirthDate("");
    setStartDate("");
    setIsUnderground(false);
    setResult(null);
  };

  return (
    <div className="bg-[var(--card)] rounded-2xl border border-[var(--border-light)] p-6 md:p-8">
      <div className="space-y-6">
        {/* Employee Type */}
        <div>
          <label className="block text-sm font-medium text-[var(--text-main)] mb-3">
            Çalışan Türü
          </label>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setEmployeeType("private")}
              className={`py-3 px-4 rounded-lg border-2 font-medium transition-colors cursor-pointer ${
                employeeType === "private"
                  ? "border-[var(--primary)] bg-blue-50 dark:bg-blue-900/20 text-[var(--primary)]"
                  : "border-[var(--border-light)] bg-[var(--background)] text-[var(--text-main)] hover:bg-[var(--muted)]"
              }`}
            >
              Özel Sektör
            </button>
            <button
              onClick={() => setEmployeeType("government")}
              className={`py-3 px-4 rounded-lg border-2 font-medium transition-colors cursor-pointer ${
                employeeType === "government"
                  ? "border-[var(--primary)] bg-blue-50 dark:bg-blue-900/20 text-[var(--primary)]"
                  : "border-[var(--border-light)] bg-[var(--background)] text-[var(--text-main)] hover:bg-[var(--muted)]"
              }`}
            >
              Devlet Memuru
            </button>
          </div>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[var(--text-main)] mb-2">
              Doğum Tarihi
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
              İşe Başlama Tarihi
              <span className="text-xs text-[var(--text-muted)] ml-2">(Deneme süresi dahil)</span>
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-[var(--border-light)] bg-[var(--background)] text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] cursor-pointer"
            />
          </div>
        </div>

        {/* Underground work checkbox - only for private sector */}
        {employeeType === "private" && (
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="underground"
              checked={isUnderground}
              onChange={(e) => setIsUnderground(e.target.checked)}
              className="w-4 h-4 cursor-pointer"
            />
            <label htmlFor="underground" className="text-sm text-[var(--text-main)] cursor-pointer">
              Yeraltı işlerinde çalışıyorum (+4 gün ek izin)
            </label>
          </div>
        )}

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
            onClick={calculateLeave}
            className="flex-1 py-3 px-6 bg-[var(--primary)] text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <Calculator className="w-5 h-5" />
            Hesapla
          </button>
        </div>

        {/* Results */}
        {result && (
          <div className="mt-8 space-y-4">
            <h3 className="text-xl font-bold text-[var(--text-main)] flex items-center gap-2">
              <Calendar className="w-6 h-6 text-green-600" />
              Hesaplama Sonucu
            </h3>

            {/* Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-[var(--muted)]">
                <p className="text-sm text-[var(--text-muted)] mb-1">Yaşınız</p>
                <p className="text-2xl font-bold text-[var(--text-main)]">{formatNumber(result.age)}</p>
              </div>
              <div className="p-4 rounded-xl bg-[var(--muted)]">
                <p className="text-sm text-[var(--text-muted)] mb-1">Çalışma Süresi</p>
                <p className="text-2xl font-bold text-[var(--text-main)]">{formatNumber(result.yearsOfService)} yıl</p>
              </div>
            </div>

            {/* Breakdown */}
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                <span className="text-sm text-[var(--text-main)]">Temel İzin Hakkı</span>
                <span className="font-semibold text-blue-600 dark:text-blue-400">{formatNumber(result.baseDays)} gün</span>
              </div>

              {result.ageBonusDays > 0 && (
                <div className="flex items-center justify-between p-4 rounded-lg bg-green-50 dark:bg-green-900/20">
                  <span className="text-sm text-[var(--text-main)]">Yaş Nedeniyle Eklenen</span>
                  <span className="font-semibold text-green-600 dark:text-green-400">+{formatNumber(result.ageBonusDays)} gün</span>
                </div>
              )}

              {result.undergroundBonusDays > 0 && (
                <div className="flex items-center justify-between p-4 rounded-lg bg-orange-50 dark:bg-orange-900/20">
                  <span className="text-sm text-[var(--text-main)]">Yeraltı İşi Ek İzni</span>
                  <span className="font-semibold text-orange-600 dark:text-orange-400">+{formatNumber(result.undergroundBonusDays)} gün</span>
                </div>
              )}
            </div>

            {/* Total */}
            <div className="p-6 rounded-xl bg-gradient-to-r from-green-500 to-green-600 text-white">
              <p className="text-sm opacity-90 mb-1">TOPLAM YILLIK İZİN HAKKINIZ</p>
              <p className="text-4xl font-bold">{formatNumber(result.totalDays)} gün</p>
            </div>

            {/* Explanation */}
            <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-blue-700 dark:text-blue-300">
                {result.explanation}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
