"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { 
  Home, 
  Calculator, 
  TrendingUp,
  AlertTriangle,
  Gavel
} from "lucide-react";
import { RENT_RATES } from "@/lib/financial-data";

// Current month's rate (first item = most recent)
const CURRENT_RATE = RENT_RATES[0];

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

interface CalculationResult {
  rate: number;
  increaseAmount: number;
  newMonthlyRent: number;
  newYearlyRent: number;
  isOverLimit: boolean;
}

export function RentCalculator() {
  const [currentRent, setCurrentRent] = useState<string>("");
  const [rateType, setRateType] = useState<"tufe" | "custom">("tufe");
  const [customRate, setCustomRate] = useState<string>("");
  const [result, setResult] = useState<CalculationResult | null>(null);

  const handleRentChange = (value: string) => {
    const cleaned = value.replace(/[^\d.,]/g, "");
    setCurrentRent(cleaned);
  };

  const handleCalculate = () => {
    const rent = parseFloat(currentRent.replace(/\./g, "").replace(",", ".")) || 0;
    
    if (rent <= 0) {
      return;
    }

    const rate = rateType === "tufe" 
      ? CURRENT_RATE.rate 
      : parseFloat(customRate) || 0;

    const increaseAmount = rent * (rate / 100);
    const newMonthlyRent = rent + increaseAmount;
    const newYearlyRent = newMonthlyRent * 12;
    const isOverLimit = rate > CURRENT_RATE.rate;

    setResult({
      rate,
      increaseAmount,
      newMonthlyRent,
      newYearlyRent,
      isOverLimit,
    });
  };

  return (
    <div className="space-y-6">
      {/* Important Warning Alert */}
      <div className="flex items-start gap-3 p-4 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="text-sm text-amber-800 dark:text-amber-200">
          <p className="font-semibold mb-1">ÖNEMLİ BİLGİ:</p>
          <p className="text-xs leading-relaxed">
            Kira artışı hesaplamalarında yasaya uygun olarak TÜİK&apos;in açıkladığı TÜFE ve Yİ-ÜFE 
            verilerinin 12 aylık ortalamalara göre değişim oranı kullanılmaktadır. Halk arasında 
            sıklıkla karşılaşılan, aylık veya yıllık değişim oranları kullanılarak yapılan 
            hesaplamalar kanuna aykırıdır.
          </p>
        </div>
      </div>

      {/* Current Rate Info */}
      <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
        <p className="text-sm text-blue-800 dark:text-blue-200">
          <span className="font-semibold">{CURRENT_RATE.label}</span> ayı için yasal üst sınır: {" "}
          <span className="text-xl font-bold text-[var(--primary)]">%{CURRENT_RATE.rate.toLocaleString("tr-TR")}</span>
        </p>
      </div>

      {/* Calculator Card */}
      <Card className="border-[var(--border-light)] shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-xl text-[var(--text-main)]">
            <Home className="w-6 h-6 text-[var(--primary)]" />
            Kira Artış Oranı Hesaplama
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Current Rent */}
          <div className="space-y-2">
            <Label htmlFor="rent" className="text-sm font-medium text-[var(--text-main)]">
              Mevcut Kira Bedeli
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] font-medium">₺</span>
              <Input
                id="rent"
                type="text"
                inputMode="decimal"
                placeholder="15.000"
                value={currentRent}
                onChange={(e) => handleRentChange(e.target.value)}
                className="h-12 pl-9 pr-4 text-lg"
              />
            </div>
          </div>

          {/* Rate Type Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-[var(--text-main)]">
              Artış Oranı
            </Label>
            <RadioGroup
              value={rateType}
              onValueChange={(value) => setRateType(value as "tufe" | "custom")}
              className="space-y-3"
            >
              <div 
                className={`flex items-center space-x-3 p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                  rateType === "tufe" 
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-950/30" 
                    : "border-[var(--border-light)] hover:border-blue-300"
                }`}
                onClick={() => setRateType("tufe")}
              >
                <RadioGroupItem value="tufe" id="tufe" />
                <Label htmlFor="tufe" className="cursor-pointer flex-1">
                  <span className="font-medium">Yasal Üst Sınır (TÜFE)</span>
                  <span className="text-sm font-bold text-[var(--primary)] ml-2">%{CURRENT_RATE.rate.toLocaleString("tr-TR")}</span>
                </Label>
              </div>
              <div 
                className={`flex items-center space-x-3 p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                  rateType === "custom" 
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-950/30" 
                    : "border-[var(--border-light)] hover:border-blue-300"
                }`}
                onClick={() => setRateType("custom")}
              >
                <RadioGroupItem value="custom" id="custom" />
                <Label htmlFor="custom" className="cursor-pointer flex-1">
                  <span className="font-medium">Anlaşmalı Oran</span>
                  <span className="text-sm text-[var(--text-muted)] ml-2">(Kiracı ile anlaştığınız oran)</span>
                </Label>
              </div>
            </RadioGroup>

            {/* Custom Rate Input */}
            {rateType === "custom" && (
              <div className="space-y-2 pl-8">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] font-medium">%</span>
                  <Input
                    type="number"
                    min="0"
                    max="200"
                    step="0.01"
                    placeholder="25"
                    value={customRate}
                    onChange={(e) => setCustomRate(e.target.value)}
                    className="h-10 pl-8 w-40"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Calculate Button */}
          <Button
            onClick={handleCalculate}
            disabled={!currentRent || (rateType === "custom" && !customRate)}
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
              <TrendingUp className="w-6 h-6" />
              Hesaplama Sonucu
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            {/* Over Limit Warning */}
            {result.isOverLimit && (
              <div className="flex items-start gap-3 p-4 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 mb-6">
                <Gavel className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div className="text-sm text-red-800 dark:text-red-200">
                  <p className="font-semibold mb-1">Yasal Sınır Aşıldı!</p>
                  <p className="text-xs leading-relaxed">
                    Girdiğiniz oran (%{result.rate.toLocaleString("tr-TR")}) yasal üst sınırı (%{CURRENT_RATE.rate.toLocaleString("tr-TR")}) aşmaktadır. 
                    Bu oran yalnızca kiracı ile karşılıklı <strong>yazılı anlaşma</strong> yapılması durumunda geçerlidir. 
                    Anlaşma yoksa kiracı fazla ödediği tutarı geri almak için <strong>mahkemeye başvurabilir</strong>.
                  </p>
                </div>
              </div>
            )}

            {/* Results Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              {/* Applied Rate */}
              <div className="p-4 rounded-lg bg-[var(--muted)]">
                <p className="text-xs text-[var(--text-muted)] mb-1">Uygulanan Oran</p>
                <p className={`text-2xl font-bold ${result.isOverLimit ? "text-red-600" : "text-[var(--text-main)]"}`}>
                  %{result.rate.toLocaleString("tr-TR", { minimumFractionDigits: 2 })}
                </p>
              </div>

              {/* Increase Amount */}
              <div className="p-4 rounded-lg bg-orange-50 dark:bg-orange-950/30">
                <p className="text-xs text-orange-600 dark:text-orange-400 mb-1">Artış Tutarı</p>
                <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                  +{formatCurrency(result.increaseAmount)}
                </p>
              </div>
            </div>

            {/* New Monthly Rent - Highlighted */}
            <div className="p-5 rounded-xl bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/30 border-2 border-blue-200 dark:border-blue-800 mb-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Aylık Yeni Kira</p>
                </div>
                <p className="text-3xl font-extrabold text-[var(--primary)]">
                  {formatCurrency(result.newMonthlyRent)}
                </p>
              </div>
            </div>

            {/* Yearly Rent - Secondary */}
            <div className="flex justify-between items-center py-3 border-t border-[var(--border-light)]">
              <span className="text-[var(--text-muted)]">Yıllık Kira Toplamı (12 ay)</span>
              <span className="text-lg font-semibold text-[var(--text-main)]">
                {formatCurrency(result.newYearlyRent)}
              </span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
