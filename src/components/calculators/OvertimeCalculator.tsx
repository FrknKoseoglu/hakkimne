"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { 
  Clock, 
  Calculator, 
  Wallet, 
  AlertTriangle,
  CalendarDays,
  TrendingUp,
  Info
} from "lucide-react";

const MONTHLY_HOURS = 225; // Standard Labor Law constant

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

interface CalculationResult {
  hourlyRate: number;
  overtimeRate: number;
  dailyRate: number;
  totalOvertimePay: number;
  totalHolidayPay: number;
  grandTotal: number;
}

export function OvertimeCalculator() {
  const [salaryType, setSalaryType] = useState<"net" | "brut">("net");
  const [salaryAmount, setSalaryAmount] = useState<string>("");
  const [overtimeHours, setOvertimeHours] = useState<string>("");
  const [holidayDays, setHolidayDays] = useState<string>("");
  const [result, setResult] = useState<CalculationResult | null>(null);

  const handleCalculate = () => {
    const salary = parseFloat(salaryAmount.replace(/\./g, "").replace(",", ".")) || 0;
    const hours = parseFloat(overtimeHours) || 0;
    const days = parseFloat(holidayDays) || 0;

    if (salary <= 0) {
      return;
    }

    const hourlyRate = salary / MONTHLY_HOURS;
    const overtimeRate = hourlyRate * 1.5;
    const dailyRate = salary / 30;

    const totalOvertimePay = hours * overtimeRate;
    const totalHolidayPay = days * dailyRate;
    const grandTotal = totalOvertimePay + totalHolidayPay;

    setResult({
      hourlyRate,
      overtimeRate,
      dailyRate,
      totalOvertimePay,
      totalHolidayPay,
      grandTotal,
    });
  };

  const handleSalaryChange = (value: string) => {
    // Allow only numbers, dots, and commas
    const cleaned = value.replace(/[^\d.,]/g, "");
    setSalaryAmount(cleaned);
  };

  return (
    <div className="space-y-6">
      {/* Calculator Card */}
      <Card className="border-[var(--border-light)] shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-xl text-[var(--text-main)]">
            <Clock className="w-6 h-6 text-[var(--primary)]" />
            Fazla Mesai Ücreti Hesaplama
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Salary Type Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-[var(--text-main)]">
              Maaş Türü
            </Label>
            <RadioGroup
              value={salaryType}
              onValueChange={(value) => setSalaryType(value as "net" | "brut")}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="net" id="net" />
                <Label htmlFor="net" className="cursor-pointer">Net Maaş</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="brut" id="brut" />
                <Label htmlFor="brut" className="cursor-pointer">Brüt Maaş</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Salary Amount */}
          <div className="space-y-2">
            <Label htmlFor="salary" className="text-sm font-medium text-[var(--text-main)]">
              {salaryType === "net" ? "Net" : "Brüt"} Maaş Tutarı
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] font-medium">₺</span>
              <Input
                id="salary"
                type="text"
                inputMode="decimal"
                placeholder="26.005"
                value={salaryAmount}
                onChange={(e) => handleSalaryChange(e.target.value)}
                className="h-12 pl-9 pr-4 text-lg"
              />
            </div>
          </div>

          {/* Overtime Hours & Holiday Days Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Overtime Hours */}
            <div className="space-y-2">
              <Label htmlFor="overtime" className="text-sm font-medium text-[var(--text-main)] flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-orange-500" />
                Fazla Mesai Saati
              </Label>
              <div className="relative">
                <Input
                  id="overtime"
                  type="number"
                  min="0"
                  placeholder="10"
                  value={overtimeHours}
                  onChange={(e) => setOvertimeHours(e.target.value)}
                  className="h-12 pr-14"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] font-medium">Saat</span>
              </div>
              <p className="text-xs text-[var(--text-muted)]">Haftalık 45 saat üzeri çalışma</p>
            </div>

            {/* Holiday Days */}
            <div className="space-y-2">
              <Label htmlFor="holiday" className="text-sm font-medium text-[var(--text-main)] flex items-center gap-1.5">
                <CalendarDays className="w-4 h-4 text-red-500" />
                Resmi Tatil Çalışması
              </Label>
              <div className="relative">
                <Input
                  id="holiday"
                  type="number"
                  min="0"
                  placeholder="1"
                  value={holidayDays}
                  onChange={(e) => setHolidayDays(e.target.value)}
                  className="h-12 pr-12"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] font-medium">Gün</span>
              </div>
              <p className="text-xs text-[var(--text-muted)]">Bayram, yılbaşı vb. çalışma</p>
            </div>
          </div>

          {/* Info Alert */}
          <div className="flex items-start gap-3 p-4 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-sm text-amber-800 dark:text-amber-200">
              Hesaplama İş Kanunu&apos;na göre yapılmıştır: Fazla mesai %50 zamlı (1.5x), 
              resmi tatilde çalışma için ek 1 günlük ücret. Sözleşmenizde farklı oranlar olabilir.
            </p>
          </div>

          {/* Calculate Button */}
          <Button
            onClick={handleCalculate}
            disabled={!salaryAmount}
            className="w-full h-14 bg-[var(--primary)] hover:bg-blue-700 text-white font-bold text-lg rounded-xl shadow-lg shadow-blue-500/30 cursor-pointer"
          >
            <Calculator className="w-5 h-5 mr-2" />
            HESAPLA
          </Button>
        </CardContent>
      </Card>

      {/* Results Card */}
      {result && (
        <Card className="border-[var(--border-light)] shadow-lg overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white pb-4">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Wallet className="w-6 h-6" />
              Hesaplama Sonucu
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            {/* Hourly Rates */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-[var(--muted)]">
                <div className="flex items-center gap-2 text-sm text-[var(--text-muted)] mb-1">
                  <Clock className="w-4 h-4" />
                  Saatlik Normal Ücret
                </div>
                <p className="text-xl font-bold text-[var(--text-main)]">
                  {formatCurrency(result.hourlyRate)}
                </p>
              </div>
              <div className="p-4 rounded-lg bg-orange-50 dark:bg-orange-950/30">
                <div className="flex items-center gap-2 text-sm text-orange-600 dark:text-orange-400 mb-1">
                  <TrendingUp className="w-4 h-4" />
                  Mesai Ücreti (1.5x)
                </div>
                <p className="text-xl font-bold text-orange-600 dark:text-orange-400">
                  {formatCurrency(result.overtimeRate)}
                </p>
              </div>
            </div>

            {/* Breakdown */}
            <div className="space-y-3 pt-4 border-t border-[var(--border-light)]">
              {/* Overtime Pay */}
              {result.totalOvertimePay > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-[var(--text-muted)]">
                    Fazla Mesai Kazancı ({overtimeHours} saat × {formatCurrency(result.overtimeRate)})
                  </span>
                  <span className="font-bold text-[var(--text-main)]">
                    {formatCurrency(result.totalOvertimePay)}
                  </span>
                </div>
              )}

              {/* Holiday Pay */}
              {result.totalHolidayPay > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-[var(--text-muted)]">
                    Resmi Tatil Kazancı ({holidayDays} gün × {formatCurrency(result.dailyRate)})
                  </span>
                  <span className="font-bold text-[var(--text-main)]">
                    {formatCurrency(result.totalHolidayPay)}
                  </span>
                </div>
              )}
            </div>

            {/* Grand Total */}
            <div className="mt-4 pt-4 border-t-2 border-dashed border-[var(--border-light)]">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-[var(--text-main)]">
                  TOPLAM EKSTRA KAZANÇ
                </span>
                <span className="text-2xl font-extrabold text-[var(--primary)]">
                  {formatCurrency(result.grandTotal)}
                </span>
              </div>
            </div>

            {/* Note */}
            <div className="flex items-start gap-2 mt-4 p-3 rounded-lg bg-blue-50 dark:bg-blue-950/30">
              <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <p className="text-xs text-blue-800 dark:text-blue-200">
                Bu tutar {salaryType === "net" ? "net" : "brüt"} maaşınız üzerinden hesaplanmıştır. 
                {salaryType === "brut" && " Net tutarlar vergi kesintilerine göre değişebilir."}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
