"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useSeveranceCalculator, SeveranceInput, SeveranceResult } from "@/hooks/useSeveranceCalculator";

// Form validation schema
const formSchema = z.object({
  startDate: z.string().min(1, "Başlangıç tarihi gerekli"),
  endDate: z.string().min(1, "Bitiş tarihi gerekli"),
  grossSalary: z.string().min(1, "Brüt maaş gerekli"),
  sideBenefits: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

// Currency formatter for Turkish Lira
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function SeveranceCalculator() {
  const [calculatorInput, setCalculatorInput] = useState<SeveranceInput>({
    startDate: null,
    endDate: null,
    grossSalary: 0,
    sideBenefits: 0,
  });

  const result = useSeveranceCalculator(calculatorInput);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      startDate: "",
      endDate: "",
      grossSalary: "",
      sideBenefits: "0",
    },
  });

  const onSubmit = (data: FormData) => {
    setCalculatorInput({
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      grossSalary: parseFloat(data.grossSalary.replace(/[.,]/g, "")) || 0,
      sideBenefits: parseFloat(data.sideBenefits?.replace(/[.,]/g, "") || "0") || 0,
    });
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Calculator Form */}
      <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            Hakkım Ne?
          </CardTitle>
          <CardDescription className="text-base">
            Kıdem ve İhbar Tazminatı Hesaplayıcı
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Date Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate" className="text-sm font-medium">
                  İşe Başlama Tarihi
                </Label>
                <Input
                  id="startDate"
                  type="date"
                  {...register("startDate")}
                  className="h-11"
                />
                {errors.startDate && (
                  <p className="text-sm text-red-500">{errors.startDate.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate" className="text-sm font-medium">
                  İşten Ayrılma Tarihi
                </Label>
                <Input
                  id="endDate"
                  type="date"
                  {...register("endDate")}
                  className="h-11"
                />
                {errors.endDate && (
                  <p className="text-sm text-red-500">{errors.endDate.message}</p>
                )}
              </div>
            </div>

            {/* Salary Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="grossSalary" className="text-sm font-medium">
                  Brüt Maaş (₺)
                </Label>
                <Input
                  id="grossSalary"
                  type="number"
                  placeholder="50000"
                  {...register("grossSalary")}
                  className="h-11"
                />
                {errors.grossSalary && (
                  <p className="text-sm text-red-500">{errors.grossSalary.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="sideBenefits" className="text-sm font-medium">
                  Yan Haklar (₺/Ay)
                </Label>
                <Input
                  id="sideBenefits"
                  type="number"
                  placeholder="5000"
                  {...register("sideBenefits")}
                  className="h-11"
                />
                <p className="text-xs text-muted-foreground">
                  Yemek, yol, ikramiye ortalaması vb.
                </p>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Hesapla
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Results */}
      {result && <ResultsCard result={result} />}
    </div>
  );
}

function ResultsCard({ result }: { result: SeveranceResult }) {
  return (
    <Card className="border-0 shadow-xl overflow-hidden">
      {/* Total Net - Hero Section */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6 text-white text-center">
        <p className="text-sm font-medium opacity-90 mb-1">Net Ele Geçen Toplam</p>
        <p className="text-4xl font-bold">{formatCurrency(result.totalNet)}</p>
      </div>

      <CardContent className="p-6 space-y-6">
        {/* Tenure Info */}
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <span className="font-medium">Çalışma Süresi:</span>
          <span>
            {result.tenure.years} yıl, {result.tenure.months} ay, {result.tenure.days} gün
          </span>
        </div>

        {/* Severance Pay Card */}
        <div className="rounded-xl border bg-slate-50 dark:bg-slate-800/50 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg">Kıdem Tazminatı</h3>
            {result.isCeilingApplied && (
              <span className="text-xs bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 px-2 py-1 rounded-full font-medium">
                Tavan Uygulandı
              </span>
            )}
          </div>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Hesaplama Tabanı</span>
              <span>{formatCurrency(result.severanceBase)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Brüt Tutar</span>
              <span>{formatCurrency(result.severanceGross)}</span>
            </div>
            <div className="flex justify-between text-red-600 dark:text-red-400">
              <span>Damga Vergisi (%0.759)</span>
              <span>-{formatCurrency(result.severanceStampTax)}</span>
            </div>
            <hr className="my-2" />
            <div className="flex justify-between font-semibold text-base">
              <span>Net Kıdem</span>
              <span className="text-emerald-600 dark:text-emerald-400">
                {formatCurrency(result.severanceNet)}
              </span>
            </div>
          </div>
        </div>

        {/* Notice Pay Card */}
        <div className="rounded-xl border bg-slate-50 dark:bg-slate-800/50 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg">İhbar Tazminatı</h3>
            <span className="text-xs bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full font-medium">
              {result.noticeWeeks} Hafta
            </span>
          </div>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Brüt Tutar</span>
              <span>{formatCurrency(result.noticeGross)}</span>
            </div>
            <div className="flex justify-between text-red-600 dark:text-red-400">
              <span>Gelir Vergisi (%15)</span>
              <span>-{formatCurrency(result.noticeIncomeTax)}</span>
            </div>
            <div className="flex justify-between text-red-600 dark:text-red-400">
              <span>Damga Vergisi (%0.759)</span>
              <span>-{formatCurrency(result.noticeStampTax)}</span>
            </div>
            <hr className="my-2" />
            <div className="flex justify-between font-semibold text-base">
              <span>Net İhbar</span>
              <span className="text-emerald-600 dark:text-emerald-400">
                {formatCurrency(result.noticeNet)}
              </span>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <p className="text-xs text-center text-muted-foreground">
          * Bu hesaplama yaklaşık bir değerdir. Kesin tutar işvereniniz tarafından belirlenir.
          <br />
          Kıdem tazminatı tavanı: ₺41.828,42 (2024 2. Yarıyıl)
        </p>
      </CardContent>
    </Card>
  );
}
