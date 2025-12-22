"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
  baseSalaryForLeave: z.string().optional(),
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

  const { register, handleSubmit, formState: { errors }, watch } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      startDate: "2022-05-10",
      endDate: "2025-11-07",
      grossSalary: "99332",
      salaryDay: "30",
      foodAllowance: "7200",
      transportAllowance: "1050",
      healthInsurance: "535",
      fuelAllowance: "0",
      childAllowance: "0",
      annualBonus: "0",
      otherBenefits: "0",
      unusedLeaveDays: "27",
      baseSalaryForLeave: "",
      cumulativeTaxBase: "1061237",
    },
  });

  const watchedEndDate = watch("endDate");
  const watchedSalaryDay = watch("salaryDay");

  // Maaş günü uyarısı: Önceki ayın kaç gün çektiğini kontrol et
  const salaryDayWarning = (() => {
    if (!watchedEndDate || !watchedSalaryDay) return null;
    const endDate = new Date(watchedEndDate);
    if (isNaN(endDate.getTime())) return null;
    
    // Önceki ayın son günü
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

  const parseNumber = (value: string | undefined): number => {
    if (!value) return 0;
    return parseFloat(value.replace(/[.,]/g, "")) || 0;
  };

  const onSubmit = (data: FormData) => {
    setCalculatorInput({
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      grossSalary: parseNumber(data.grossSalary),
      benefits: {
        food: parseNumber(data.foodAllowance),
        transport: parseNumber(data.transportAllowance),
        healthInsurance: parseNumber(data.healthInsurance),
        fuel: parseNumber(data.fuelAllowance),
        childAllowance: parseNumber(data.childAllowance),
        annualBonus: parseNumber(data.annualBonus),
        other: parseNumber(data.otherBenefits),
      },
      unusedLeaveDays: parseInt(data.unusedLeaveDays || "0") || 0,
      salaryDay: parseInt(data.salaryDay || "1") || 1,
      baseSalaryForLeave: parseNumber(data.baseSalaryForLeave) || undefined,
      cumulativeTaxBase: parseNumber(data.cumulativeTaxBase),
    });
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            Hakkım Ne?
          </CardTitle>
          <CardDescription className="text-base">Kıdem ve İhbar Tazminatı Hesaplayıcı</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate" className="text-sm font-medium">İşe Başlama Tarihi</Label>
                <Input id="startDate" type="date" {...register("startDate")} className="h-11" />
                {errors.startDate && <p className="text-sm text-red-500">{errors.startDate.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate" className="text-sm font-medium">İşten Ayrılma Tarihi</Label>
                <Input id="endDate" type="date" {...register("endDate")} className="h-11" />
                {errors.endDate && <p className="text-sm text-red-500">{errors.endDate.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="grossSalary" className="text-sm font-medium">Brüt Maaş (₺)</Label>
                <Input id="grossSalary" type="number" placeholder="50000" {...register("grossSalary")} className="h-11" />
                {errors.grossSalary && <p className="text-sm text-red-500">{errors.grossSalary.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="salaryDay" className="text-sm font-medium">Maaş Günü</Label>
                <Input id="salaryDay" type="number" min="1" max="31" placeholder="1" {...register("salaryDay")} className="h-11" />
                {salaryDayWarning && (
                  <p className="text-sm text-amber-600 dark:text-amber-400 flex items-center gap-1">
                    <span>⚠️</span> {salaryDayWarning}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-medium flex items-center gap-2">
                <span className="text-emerald-600">💰</span> Aylık Yan Haklar (NET)
              </Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="foodAllowance" className="text-xs text-muted-foreground">Yemek</Label>
                  <Input id="foodAllowance" type="number" placeholder="0" {...register("foodAllowance")} className="h-10" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="transportAllowance" className="text-xs text-muted-foreground">Yol</Label>
                  <Input id="transportAllowance" type="number" placeholder="0" {...register("transportAllowance")} className="h-10" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="healthInsurance" className="text-xs text-muted-foreground">Sağlık Sig.</Label>
                  <Input id="healthInsurance" type="number" placeholder="0" {...register("healthInsurance")} className="h-10" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="fuelAllowance" className="text-xs text-muted-foreground">Yakacak</Label>
                  <Input id="fuelAllowance" type="number" placeholder="0" {...register("fuelAllowance")} className="h-10" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="childAllowance" className="text-xs text-muted-foreground">Çocuk Yrd.</Label>
                  <Input id="childAllowance" type="number" placeholder="0" {...register("childAllowance")} className="h-10" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="otherBenefits" className="text-xs text-muted-foreground">Diğer</Label>
                  <Input id="otherBenefits" type="number" placeholder="0" {...register("otherBenefits")} className="h-10" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="annualBonus" className="text-sm font-medium flex items-center gap-2">
                <span className="text-amber-500">🎁</span> Yıllık İkramiye (NET)
              </Label>
              <Input id="annualBonus" type="number" min="0" placeholder="0" {...register("annualBonus")} className="h-11 max-w-[300px]" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="unusedLeaveDays" className="text-sm font-medium flex items-center gap-2">
                <span className="text-blue-600">🏖️</span> Kullanılmayan İzin (Gün)
              </Label>
              <Input id="unusedLeaveDays" type="number" min="0" placeholder="0" {...register("unusedLeaveDays")} className="h-11 max-w-[200px]" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="baseSalaryForLeave" className="text-sm font-medium flex items-center gap-2">
                <span className="text-purple-600">💼</span> İzin Ücreti İçin Çıplak Brüt (₺)
              </Label>
              <Input id="baseSalaryForLeave" type="number" min="0" placeholder="Boş bırakılırsa otomatik" {...register("baseSalaryForLeave")} className="h-11 max-w-[300px]" />
              <p className="text-xs text-muted-foreground">Opsiyonel: SGK matrahınızdan hesaplayabilirsiniz. Boş bırakırsanız brüt maaş kullanılır.</p>
            </div>

            <div className="space-y-2 p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
              <Label htmlFor="cumulativeTaxBase" className="text-sm font-medium flex items-center gap-2">
                <span className="text-amber-600">📊</span> Kümülatif Gelir Vergisi Matrahı (₺)
              </Label>
              <Input id="cumulativeTaxBase" type="number" min="0" placeholder="0" {...register("cumulativeTaxBase")} className="h-11 max-w-[300px]" />
              <p className="text-xs text-muted-foreground">Bordrodan yıl içi toplam matrahı girin</p>
            </div>

            <Button type="submit" className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 shadow-lg hover:shadow-xl">
              Hesapla
            </Button>
          </form>
        </CardContent>
      </Card>

      {result && <ResultsCard result={result} />}
    </div>
  );
}

function ResultsCard({ result }: { result: SeveranceResult }) {
  return (
    <Card className="border-0 shadow-xl overflow-hidden">
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6 text-white text-center">
        <p className="text-sm font-medium opacity-90 mb-1">Net Ele Geçen Toplam</p>
        <p className="text-4xl font-bold">{formatCurrency(result.totalNet)}</p>
        <p className="text-sm opacity-75 mt-2">Brüt: {formatCurrency(result.totalGross)}</p>
      </div>

      <CardContent className="p-6 space-y-4">
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground bg-slate-100 dark:bg-slate-800 rounded-lg p-3">
          <span className="font-medium">Çalışma Süresi:</span>
          <span className="font-semibold text-foreground">
            {result.tenure.years} yıl, {result.tenure.months} ay, {result.tenure.days} gün
          </span>
        </div>

        <div className="text-sm text-center space-y-1 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-3">
          <div>
            <span className="text-muted-foreground">Giydirilmiş Brüt: </span>
            <span className="font-semibold text-emerald-700 dark:text-emerald-400">
              {formatCurrency(result.dressedGrossWage)}/ay
            </span>
          </div>
        </div>

        {/* Kıdem */}
        <PaymentCard
          title="Kıdem Tazminatı"
          badge={result.isCeilingApplied ? "Tavan Uygulandı" : undefined}
          badgeColor="amber"
          subtitle={!result.severanceEligible ? "1 yıldan az - hak yok" : undefined}
          items={[
            { label: "Brüt Tutar", value: result.severanceGross },
            { label: "Damga Vergisi", value: -result.severanceStampTax, isDeduction: true },
          ]}
          netAmount={result.severanceNet}
          note="SGK ve Gelir Vergisi yok"
        />

        {/* İhbar */}
        <PaymentCard
          title="İhbar Tazminatı"
          badge={`${result.noticeWeeks} Hafta (${result.noticeWeeks * 7} Gün)`}
          badgeColor="blue"
          items={[
            { label: "Brüt Tutar", value: result.noticeGross },
            { label: `Gelir Vergisi (%${result.noticeTaxRate.toFixed(0)})`, value: -result.noticeIncomeTax, isDeduction: true },
            { label: "Asgari Ücret İstisnası (GV)", value: result.noticeIncomeTaxExemption, isExemption: true },
            { label: "Damga Vergisi", value: -result.noticeStampTax, isDeduction: true },
          ]}
          netAmount={result.noticeNet}
          note="SGK'ya tabi değil"
        />

        {/* İzin */}
        {result.unusedLeaveGross > 0 && (
          <PaymentCard
            title="Kullanılmayan İzin Ücreti"
            icon="🏖️"
            items={[
              { label: "Brüt Tutar", value: result.unusedLeaveGross },
              { label: "SGK Primi (%14)", value: -result.unusedLeaveSgk, isDeduction: true },
              { label: "İşsizlik Sig. (%1)", value: -result.unusedLeaveUnemployment, isDeduction: true },
              { label: `Gelir Vergisi (%${result.unusedLeaveTaxRate.toFixed(0)})`, value: -result.unusedLeaveIncomeTax, isDeduction: true },
              { label: "Asgari Ücret İstisnası (GV)", value: result.unusedLeaveIncomeTaxExemption, isExemption: true },
              { label: "Damga Vergisi", value: -result.unusedLeaveStampTax, isDeduction: true },
            ]}
            netAmount={result.unusedLeaveNet}
            note={result.isLeaveApproximate ? "* Çıplak brüt girilmedi, yaklaşık değerdir" : undefined}
          />
        )}

        {/* Hak Edilen Maaş */}
        {result.proRatedDays > 0 && (
          <PaymentCard
            title="Hak Edilen Maaş"
            badge={`${result.proRatedDays} Gün`}
            badgeColor="purple"
            items={[
              { label: "Brüt Tutar", value: result.proRatedSalaryGross },
              { label: "SGK Primi (%14)", value: -result.proRatedSalarySgk, isDeduction: true },
              { label: "İşsizlik Sig. (%1)", value: -result.proRatedSalaryUnemployment, isDeduction: true },
              { label: `Gelir Vergisi (%${result.proRatedTaxRate.toFixed(0)})`, value: -result.proRatedSalaryIncomeTax, isDeduction: true },
              { label: "Asgari Ücret İstisnası (GV)", value: result.proRatedSalaryIncomeTaxExemption, isExemption: true },
              { label: "Damga Vergisi", value: -result.proRatedSalaryStampTax, isDeduction: true },
            ]}
            netAmount={result.proRatedSalaryNet}
          />
        )}

        {/* Özet */}
        <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4 space-y-2 text-sm">
          <h4 className="font-semibold">Yasal Kesintiler Özeti</h4>
          <div className="grid grid-cols-2 gap-2">
            <div>SGK Primi: <span className="font-medium">{formatCurrency(result.totalSgk)}</span></div>
            <div>İşsizlik Sig.: <span className="font-medium">{formatCurrency(result.totalUnemployment)}</span></div>
            <div>Gelir Vergisi: <span className="font-medium">{formatCurrency(result.totalIncomeTax)}</span></div>
            <div>Damga Vergisi: <span className="font-medium">{formatCurrency(result.totalStampTax)}</span></div>
          </div>
          <div className="pt-2 border-t">
            <span className="text-emerald-600 dark:text-emerald-400">Asgari Ücret İstisnası (Toplam): </span>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
              {formatCurrency(result.totalIncomeTaxExemption + result.totalStampTaxExemption)}
            </span>
          </div>
        </div>

        <p className="text-xs text-center text-muted-foreground pt-2">
          * Kıdem tavanı: ₺53.919,68 (2025 2. Yarıyıl) | Asgari ücret: ₺26.005,50
        </p>
      </CardContent>
    </Card>
  );
}

interface PaymentCardProps {
  title: string;
  badge?: string;
  badgeColor?: "amber" | "blue" | "purple" | "green";
  icon?: string;
  subtitle?: string;
  items: Array<{ label: string; value: number; isDeduction?: boolean; isExemption?: boolean }>;
  netAmount: number;
  note?: string;
}

function PaymentCard({ title, badge, badgeColor = "blue", icon, subtitle, items, netAmount, note }: PaymentCardProps) {
  const badgeColors = {
    amber: "bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300",
    blue: "bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300",
    purple: "bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300",
    green: "bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300",
  };

  return (
    <div className="rounded-xl border bg-slate-50 dark:bg-slate-800/50 p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-lg flex items-center gap-2">
            {icon && <span>{icon}</span>}
            {title}
          </h3>
          {subtitle && <p className="text-xs text-amber-600 dark:text-amber-400">{subtitle}</p>}
        </div>
        {badge && <span className={`text-xs px-2 py-1 rounded-full font-medium ${badgeColors[badgeColor]}`}>{badge}</span>}
      </div>

      <div className="space-y-2 text-sm">
        {items.map((item, index) => (
          <div
            key={index}
            className={`flex justify-between ${
              item.isDeduction ? "text-red-600 dark:text-red-400" : 
              item.isExemption ? "text-emerald-600 dark:text-emerald-400" : ""
            }`}
          >
            <span className={item.isDeduction || item.isExemption ? "" : "text-muted-foreground"}>{item.label}</span>
            <span>{item.isExemption ? `+${formatCurrency(item.value)}` : formatCurrency(item.value)}</span>
          </div>
        ))}
        <hr className="my-2" />
        <div className="flex justify-between font-semibold text-base">
          <span>Net Tutar</span>
          <span className="text-emerald-600 dark:text-emerald-400">{formatCurrency(netAmount)}</span>
        </div>
        {note && <p className="text-xs text-muted-foreground italic">{note}</p>}
      </div>
    </div>
  );
}
