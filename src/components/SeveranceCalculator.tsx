"use client";

import { useState, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSeveranceCalculator, SeveranceInput, SeveranceResult } from "@/hooks/useSeveranceCalculator";

const formSchema = z.object({
  startDate: z.string().min(1, "Başlangıç tarihi gerekli"),
  endDate: z.string().min(1, "Bitiş tarihi gerekli"),
  grossSalary: z.string().min(1, "Brüt maaş gerekli"),
  salaryDay: z.string().optional(),
  foodAllowance: z.string().optional(),
  transportAllowance: z.string().optional(),
  healthInsurance: z.string().optional(),
  fuelAllowance: z.string().optional(),
  childAllowance: z.string().optional(),
  annualBonus: z.string().optional(),
  otherBenefits: z.string().optional(),
  unusedLeaveDays: z.string().optional(),
  cumulativeTaxBase: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

// Turkish number formatting (e.g., 99.332,50)
function formatTurkishNumber(value: string): string {
  // Remove all non-digit and non-comma characters
  let cleaned = value.replace(/[^\d,]/g, "");
  
  // Handle comma (decimal separator)
  const parts = cleaned.split(",");
  let integerPart = parts[0] || "";
  let decimalPart = parts.length > 1 ? parts[1].slice(0, 2) : "";
  
  // Remove leading zeros except for single zero
  integerPart = integerPart.replace(/^0+/, "") || "0";
  
  // Add thousand separators (dots)
  integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  
  if (parts.length > 1) {
    return `${integerPart},${decimalPart}`;
  }
  return integerPart === "0" ? "" : integerPart;
}

// Parse Turkish formatted number to raw number
function parseTurkishNumber(value: string): number {
  if (!value) return 0;
  // Remove dots (thousand separator) and replace comma with dot for parsing
  const normalized = value.replace(/\./g, "").replace(",", ".");
  return parseFloat(normalized) || 0;
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

export function SeveranceCalculator() {
  const [calculatorInput, setCalculatorInput] = useState<SeveranceInput>({
    startDate: null,
    endDate: null,
    grossSalary: 0,
    benefits: { food: 0, transport: 0, healthInsurance: 0, fuel: 0, childAllowance: 0, annualBonus: 0, other: 0 },
    unusedLeaveDays: 0,
    salaryDay: 1,
    cumulativeTaxBase: 0,
  });

  const result = useSeveranceCalculator(calculatorInput);

  const { register, handleSubmit, formState: { errors }, watch, control } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      startDate: "2022-05-10",
      endDate: "2025-11-07",
      grossSalary: "99.332",
      salaryDay: "30",
      foodAllowance: "7.200",
      transportAllowance: "1.050",
      healthInsurance: "535",
      fuelAllowance: "0",
      childAllowance: "0",
      annualBonus: "0",
      otherBenefits: "0",
      unusedLeaveDays: "27",
      cumulativeTaxBase: "1.061.237",
    },
  });

  const watchedEndDate = watch("endDate");
  const watchedSalaryDay = watch("salaryDay");

  const salaryDayWarning = (() => {
    if (!watchedEndDate || !watchedSalaryDay) return null;
    const endDate = new Date(watchedEndDate);
    if (isNaN(endDate.getTime())) return null;
    
    const prevMonthLastDay = new Date(endDate.getFullYear(), endDate.getMonth(), 0).getDate();
    const enteredDay = parseInt(watchedSalaryDay);
    
    if (enteredDay === 30 && prevMonthLastDay === 31) {
      const prevMonthName = new Date(endDate.getFullYear(), endDate.getMonth() - 1, 1)
        .toLocaleString("tr-TR", { month: "long", year: "numeric" });
      return `${prevMonthName} ayı 31 gün çekiyor, maaş günü olarak 31 girmeniz gerekebilir.`;
    }
    
    if (enteredDay === 31 && prevMonthLastDay < 31) {
      const prevMonthName = new Date(endDate.getFullYear(), endDate.getMonth() - 1, 1)
        .toLocaleString("tr-TR", { month: "long", year: "numeric" });
      return `${prevMonthName} ayı ${prevMonthLastDay} gün çekiyor.`;
    }
    
    return null;
  })();

  const onSubmit = (data: FormData) => {
    setCalculatorInput({
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      grossSalary: parseTurkishNumber(data.grossSalary),
      benefits: {
        food: parseTurkishNumber(data.foodAllowance || ""),
        transport: parseTurkishNumber(data.transportAllowance || ""),
        healthInsurance: parseTurkishNumber(data.healthInsurance || ""),
        fuel: parseTurkishNumber(data.fuelAllowance || ""),
        childAllowance: parseTurkishNumber(data.childAllowance || ""),
        annualBonus: parseTurkishNumber(data.annualBonus || ""),
        other: parseTurkishNumber(data.otherBenefits || ""),
      },
      unusedLeaveDays: parseInt(data.unusedLeaveDays || "0") || 0,
      salaryDay: parseInt(data.salaryDay || "1") || 1,
      cumulativeTaxBase: parseTurkishNumber(data.cumulativeTaxBase || ""),
    });
  };

  return (
    <div className="w-full space-y-8">
      {/* Form Card */}
      <div className="bg-white rounded-xl shadow-sm border border-[var(--border-light)] overflow-hidden">
        <div className="px-6 pt-8 pb-4 border-b border-[var(--border-light)]">
          <h2 className="text-2xl font-bold text-[var(--text-main)] leading-tight">
            Kıdem Tazminatı Hesaplama
          </h2>
          <p className="text-[var(--text-muted)] mt-2 text-base">
            İşe giriş çıkış tarihlerinizi ve maaş bilgilerinizi girerek yasal haklarınızı hemen öğrenin.
          </p>
        </div>
        
        <div className="p-6 md:p-8 space-y-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Dates & Salary Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="startDate" className="text-sm font-medium text-[var(--text-main)]">
                  İşe Giriş Tarihi
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] material-symbols-outlined text-xl">
                    calendar_month
                  </span>
                  <Input
                    id="startDate"
                    type="date"
                    {...register("startDate")}
                    className="h-12 pl-11 pr-4 rounded-lg border border-slate-200 bg-[var(--background-light)] focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                  />
                </div>
                {errors.startDate && <p className="text-sm text-red-500">{errors.startDate.message}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="endDate" className="text-sm font-medium text-[var(--text-main)]">
                  İşten Çıkış Tarihi
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] material-symbols-outlined text-xl">
                    calendar_month
                  </span>
                  <Input
                    id="endDate"
                    type="date"
                    {...register("endDate")}
                    className="h-12 pl-11 pr-4 rounded-lg border border-slate-200 bg-[var(--background-light)] focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                  />
                </div>
                {errors.endDate && <p className="text-sm text-red-500">{errors.endDate.message}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="grossSalary" className="text-sm font-medium text-[var(--text-main)]">
                  Brüt Maaş (Aylık)
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] font-medium text-lg">
                    ₺
                  </span>
                  <Controller
                    name="grossSalary"
                    control={control}
                    render={({ field }) => (
                      <CurrencyInput
                        id="grossSalary"
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="0"
                        className="h-12 pl-9 pr-4 rounded-lg border border-slate-200 bg-[var(--background-light)] focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                      />
                    )}
                  />
                </div>
                {errors.grossSalary && <p className="text-sm text-red-500">{errors.grossSalary.message}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="salaryDay" className="text-sm font-medium text-[var(--text-main)]">
                  Maaş Günü
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] material-symbols-outlined text-xl">
                    today
                  </span>
                  <Input
                    id="salaryDay"
                    type="number"
                    min="1"
                    max="31"
                    placeholder="1"
                    {...register("salaryDay")}
                    className="h-12 pl-11 pr-4 rounded-lg border border-slate-200 bg-[var(--background-light)] focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                  />
                </div>
                {salaryDayWarning && (
                  <p className="text-sm text-amber-600 flex items-center gap-1">
                    <span className="material-symbols-outlined text-base">warning</span>
                    {salaryDayWarning}
                  </p>
                )}
              </div>
            </div>

            {/* Annual Bonus & Leave Days */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="annualBonus" className="text-sm font-medium text-[var(--text-main)]">
                  Yıllık İkramiye (Net)
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] font-medium text-lg">
                    ₺
                  </span>
                  <Controller
                    name="annualBonus"
                    control={control}
                    render={({ field }) => (
                      <CurrencyInput
                        id="annualBonus"
                        value={field.value || ""}
                        onChange={field.onChange}
                        placeholder="0"
                        className="h-12 pl-9 pr-4 rounded-lg border border-slate-200 bg-[var(--background-light)] focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                      />
                    )}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="unusedLeaveDays" className="text-sm font-medium text-[var(--text-main)]">
                  Kullanılmayan İzin Günü
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] material-symbols-outlined text-xl">
                    beach_access
                  </span>
                  <Input
                    id="unusedLeaveDays"
                    type="number"
                    min="0"
                    placeholder="0"
                    {...register("unusedLeaveDays")}
                    className="h-12 pl-11 pr-14 rounded-lg border border-slate-200 bg-[var(--background-light)] focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] font-medium">Gün</span>
                </div>
              </div>
            </div>

            {/* Yan Haklar Section */}
            <div className="pt-4 border-t border-[var(--border-light)]">
              <h3 className="text-lg font-semibold text-[var(--text-main)] mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-[var(--primary)]">add_circle</span>
                Aylık Düzenli Yan Haklar (Net)
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="transportAllowance" className="text-xs font-medium text-[var(--text-muted)]">
                    Yol Yardımı
                  </Label>
                  <Controller
                    name="transportAllowance"
                    control={control}
                    render={({ field }) => (
                      <CurrencyInput
                        id="transportAllowance"
                        value={field.value || ""}
                        onChange={field.onChange}
                        placeholder="0 ₺"
                        className="h-10 px-3 rounded-lg border border-slate-200 bg-[var(--background-light)] text-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                      />
                    )}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="foodAllowance" className="text-xs font-medium text-[var(--text-muted)]">
                    Yemek Yardımı
                  </Label>
                  <Controller
                    name="foodAllowance"
                    control={control}
                    render={({ field }) => (
                      <CurrencyInput
                        id="foodAllowance"
                        value={field.value || ""}
                        onChange={field.onChange}
                        placeholder="0 ₺"
                        className="h-10 px-3 rounded-lg border border-slate-200 bg-[var(--background-light)] text-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                      />
                    )}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="fuelAllowance" className="text-xs font-medium text-[var(--text-muted)]">
                    Yakıt Desteği
                  </Label>
                  <Controller
                    name="fuelAllowance"
                    control={control}
                    render={({ field }) => (
                      <CurrencyInput
                        id="fuelAllowance"
                        value={field.value || ""}
                        onChange={field.onChange}
                        placeholder="0 ₺"
                        className="h-10 px-3 rounded-lg border border-slate-200 bg-[var(--background-light)] text-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                      />
                    )}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="healthInsurance" className="text-xs font-medium text-[var(--text-muted)]">
                    Sağlık Sig.
                  </Label>
                  <Controller
                    name="healthInsurance"
                    control={control}
                    render={({ field }) => (
                      <CurrencyInput
                        id="healthInsurance"
                        value={field.value || ""}
                        onChange={field.onChange}
                        placeholder="0 ₺"
                        className="h-10 px-3 rounded-lg border border-slate-200 bg-[var(--background-light)] text-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                      />
                    )}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="childAllowance" className="text-xs font-medium text-[var(--text-muted)]">
                    Çocuk Yardımı
                  </Label>
                  <Controller
                    name="childAllowance"
                    control={control}
                    render={({ field }) => (
                      <CurrencyInput
                        id="childAllowance"
                        value={field.value || ""}
                        onChange={field.onChange}
                        placeholder="0 ₺"
                        className="h-10 px-3 rounded-lg border border-slate-200 bg-[var(--background-light)] text-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                      />
                    )}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="otherBenefits" className="text-xs font-medium text-[var(--text-muted)]">
                    Diğer
                  </Label>
                  <Controller
                    name="otherBenefits"
                    control={control}
                    render={({ field }) => (
                      <CurrencyInput
                        id="otherBenefits"
                        value={field.value || ""}
                        onChange={field.onChange}
                        placeholder="0 ₺"
                        className="h-10 px-3 rounded-lg border border-slate-200 bg-[var(--background-light)] text-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                      />
                    )}
                  />
                </div>
              </div>
            </div>

            {/* Advanced Settings */}
            <div className="pt-4 border-t border-[var(--border-light)]">
              <h3 className="text-lg font-semibold text-[var(--text-main)] mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-[var(--primary)]">tune</span>
                Gelişmiş Ayarlar
              </h3>
              <div className="space-y-2">
                <Label htmlFor="cumulativeTaxBase" className="text-sm font-medium text-[var(--text-main)]">
                  Kümülatif Gelir Vergisi Matrahı
                </Label>
                <div className="relative max-w-md">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] font-medium text-lg">
                    ₺
                  </span>
                  <Controller
                    name="cumulativeTaxBase"
                    control={control}
                    render={({ field }) => (
                      <CurrencyInput
                        id="cumulativeTaxBase"
                        value={field.value || ""}
                        onChange={field.onChange}
                        placeholder="0"
                        className="h-12 pl-9 pr-4 rounded-lg border border-slate-200 bg-[var(--background-light)] focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                      />
                    )}
                  />
                </div>
                <p className="text-xs text-[var(--text-muted)]">
                  Bordrodan yıl içi toplam matrahı girin.
                </p>
              </div>
            </div>

            {/* Calculate Button */}
            <Button
              type="submit"
              className="w-full h-14 bg-[#2463eb] hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 text-lg transition-transform active:scale-[0.98]"
            >
              <span className="material-symbols-outlined">calculate</span>
              HESAPLA
            </Button>
          </form>
        </div>
      </div>

      {result && <ResultsCard result={result} />}
    </div>
  );
}

function ResultsCard({ result }: { result: SeveranceResult }) {
  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-white to-blue-50 border border-blue-100 rounded-xl p-6 md:p-8 relative overflow-hidden">
        {/* Decorative blur circle */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-200/50 blur-3xl rounded-full pointer-events-none" />
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div className="flex flex-col gap-1 text-center md:text-left">
            <span className="text-sm font-semibold uppercase tracking-wider text-[var(--text-muted)]">
              Hesaplanan Toplam Tutar
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-[var(--text-main)]">
              Net Ele Geçen Toplam
            </h2>
          </div>
          <div className="flex flex-col items-center md:items-end">
            <span className="text-4xl md:text-5xl font-extrabold text-[#2463eb] tracking-tight">
              {formatCurrency(result.totalNet)}
            </span>
            <span className="text-sm text-[var(--text-muted)] mt-2 font-medium">
              Brüt: {formatCurrency(result.totalGross)}
            </span>
          </div>
        </div>

        {/* Tenure Info */}
        <div className="flex items-center justify-center gap-2 text-sm text-[var(--text-muted)] mt-6 pt-4 border-t border-blue-100">
          <span className="material-symbols-outlined text-lg">schedule</span>
          <span>Çalışma Süresi:</span>
          <span className="font-semibold text-[var(--text-main)]">
            {result.tenure.years} yıl, {result.tenure.months} ay, {result.tenure.days} gün
          </span>
        </div>
      </div>

      {/* Breakdown Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Kıdem Tazminatı */}
        <PaymentCard
          icon="work_history"
          iconBgColor="bg-blue-50"
          iconTextColor="text-blue-600"
          title="Kıdem Tazminatı"
          badge={result.isCeilingApplied ? "Tavan Uygulandı" : undefined}
          subtitle={!result.severanceEligible ? "1 yıldan az - hak yok" : undefined}
          items={[
            { label: "Brüt Tutar", value: result.severanceGross },
            { label: "Damga Vergisi", value: -result.severanceStampTax, isDeduction: true },
          ]}
          netAmount={result.severanceNet}
          note="SGK ve Gelir Vergisi yok"
        />

        {/* İhbar Tazminatı */}
        <PaymentCard
          icon="warning"
          iconBgColor="bg-orange-50"
          iconTextColor="text-orange-600"
          title="İhbar Tazminatı"
          badge={`${result.noticeWeeks} Hafta`}
          items={[
            { label: "Brüt Tutar", value: result.noticeGross },
            { label: `Gelir Vergisi (%${result.noticeTaxRate.toFixed(0)})`, value: -result.noticeIncomeTax, isDeduction: true },
            { label: "Asgari Ücret İstisnası", value: result.noticeIncomeTaxExemption, isExemption: true },
            { label: "Damga Vergisi", value: -result.noticeStampTax, isDeduction: true },
          ]}
          netAmount={result.noticeNet}
          note="SGK'ya tabi değil"
        />

        {/* Yıllık İzin */}
        {result.unusedLeaveGross > 0 && (
          <PaymentCard
            icon="beach_access"
            iconBgColor="bg-emerald-50"
            iconTextColor="text-emerald-600"
            title="Yıllık İzin Ücreti"
            items={[
              { label: "Brüt Tutar", value: result.unusedLeaveGross },
              { label: "SGK Primi (%14)", value: -result.unusedLeaveSgk, isDeduction: true },
              { label: "İşsizlik Sig. (%1)", value: -result.unusedLeaveUnemployment, isDeduction: true },
              { label: `Gelir Vergisi (%${result.unusedLeaveTaxRate.toFixed(0)})`, value: -result.unusedLeaveIncomeTax, isDeduction: true },
              { label: "Asgari Ücret İstisnası", value: result.unusedLeaveIncomeTaxExemption, isExemption: true },
              { label: "Damga Vergisi", value: -result.unusedLeaveStampTax, isDeduction: true },
            ]}
            netAmount={result.unusedLeaveNet}
            note={result.isLeaveApproximate ? "Çıplak brüt girilmedi, yaklaşık değer" : undefined}
          />
        )}

        {/* Hak Edilen Maaş */}
        {result.proRatedDays > 0 && (
          <PaymentCard
            icon="account_balance_wallet"
            iconBgColor="bg-purple-50"
            iconTextColor="text-purple-600"
            title="Hak Edilen Maaş"
            badge={`${result.proRatedDays} Gün`}
            items={[
              { label: "Brüt Tutar", value: result.proRatedSalaryGross },
              { label: "SGK Primi (%14)", value: -result.proRatedSalarySgk, isDeduction: true },
              { label: "İşsizlik Sig. (%1)", value: -result.proRatedSalaryUnemployment, isDeduction: true },
              { label: `Gelir Vergisi (%${result.proRatedTaxRate.toFixed(0)})`, value: -result.proRatedSalaryIncomeTax, isDeduction: true },
              { label: "Asgari Ücret İstisnası", value: result.proRatedSalaryIncomeTaxExemption, isExemption: true },
              { label: "Damga Vergisi", value: -result.proRatedSalaryStampTax, isDeduction: true },
            ]}
            netAmount={result.proRatedSalaryNet}
          />
        )}
      </div>

      {/* Özet Card */}
      <div className="bg-white rounded-xl border border-[var(--border-light)] p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[var(--border-light)]">
          <div className="p-2 bg-slate-100 rounded-lg text-slate-600">
            <span className="material-symbols-outlined text-xl">receipt_long</span>
          </div>
          <h3 className="font-bold text-lg text-[var(--text-main)]">Yasal Kesintiler Özeti</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="space-y-1">
            <span className="text-[var(--text-muted)]">SGK Primi</span>
            <p className="font-semibold text-[var(--text-main)]">{formatCurrency(result.totalSgk)}</p>
          </div>
          <div className="space-y-1">
            <span className="text-[var(--text-muted)]">İşsizlik Sig.</span>
            <p className="font-semibold text-[var(--text-main)]">{formatCurrency(result.totalUnemployment)}</p>
          </div>
          <div className="space-y-1">
            <span className="text-[var(--text-muted)]">Gelir Vergisi</span>
            <p className="font-semibold text-[var(--text-main)]">{formatCurrency(result.totalIncomeTax)}</p>
          </div>
          <div className="space-y-1">
            <span className="text-[var(--text-muted)]">Damga Vergisi</span>
            <p className="font-semibold text-[var(--text-main)]">{formatCurrency(result.totalStampTax)}</p>
          </div>
        </div>
        <div className="mt-4 pt-3 border-t border-dashed border-[var(--border-light)] flex justify-between items-center">
          <span className="text-[var(--text-muted)] text-sm">Asgari Ücret İstisnası (Toplam)</span>
          <span className="font-bold text-emerald-600">
            +{formatCurrency(result.totalIncomeTaxExemption + result.totalStampTaxExemption)}
          </span>
        </div>
      </div>

      {/* Footer Note */}
      <p className="text-xs text-center text-[var(--text-muted)]">
        * Kıdem tavanı: ₺53.919,68 (2025 2. Yarıyıl) | Asgari ücret: ₺26.005,50
      </p>
    </div>
  );
}

interface PaymentCardProps {
  icon: string;
  iconBgColor: string;
  iconTextColor: string;
  title: string;
  badge?: string;
  subtitle?: string;
  items: Array<{ label: string; value: number; isDeduction?: boolean; isExemption?: boolean }>;
  netAmount: number;
  note?: string;
}

function PaymentCard({ 
  icon, 
  iconBgColor, 
  iconTextColor, 
  title, 
  badge, 
  subtitle, 
  items, 
  netAmount, 
  note 
}: PaymentCardProps) {
  return (
    <div className="bg-white rounded-lg border border-[var(--border-light)] p-5 shadow-sm hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4 pb-3 border-b border-[var(--border-light)]">
        <div className={`p-2 rounded-lg ${iconBgColor} ${iconTextColor}`}>
          <span className="material-symbols-outlined text-xl">{icon}</span>
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-lg text-[var(--text-main)]">{title}</h3>
          {subtitle && <p className="text-xs text-amber-600">{subtitle}</p>}
        </div>
        {badge && (
          <span className="text-xs px-2 py-1 rounded-full bg-slate-100 text-slate-700 font-medium">
            {badge}
          </span>
        )}
      </div>

      {/* Items */}
      <div className="space-y-2 text-sm">
        {items.map((item, index) => (
          <div
            key={index}
            className={`flex justify-between ${
              item.isDeduction ? "text-red-500" : 
              item.isExemption ? "text-emerald-600" : ""
            }`}
          >
            <span className={item.isDeduction || item.isExemption ? "" : "text-[var(--text-muted)]"}>
              {item.label}
            </span>
            <span className="font-medium">
              {item.isExemption ? `+${formatCurrency(item.value)}` : formatCurrency(item.value)}
            </span>
          </div>
        ))}
      </div>

      {/* Net Footer */}
      <div className="flex justify-between items-center pt-3 mt-3 border-t border-dashed border-[var(--border-light)]">
        <span className="font-semibold text-[var(--text-main)]">Net Ödeme</span>
        <span className="font-bold text-lg text-[#2463eb]">{formatCurrency(netAmount)}</span>
      </div>

      {note && (
        <p className="text-xs text-[var(--text-muted)] mt-2 italic">{note}</p>
      )}
    </div>
  );
}
