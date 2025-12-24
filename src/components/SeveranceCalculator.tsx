"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useSeveranceCalculator, SeveranceInput, SeveranceResult } from "@/hooks/useSeveranceCalculator";
import { getFinancialData, formatPeriodName } from "@/lib/financial-data";
import { 
  Calendar, 
  CalendarDays, 
  AlertTriangle, 
  Info, 
  Calculator, 
  PlusCircle, 
  Sliders, 
  Palmtree, 
  Briefcase, 
  Wallet, 
  Receipt, 
  Clock, 
  TrendingUp, 
  TrendingDown, 
  Check, 
  AlertCircle,
  Share2,
  MessageCircle,
  Twitter,
  Link,
  RotateCcw
} from "lucide-react";
import { toast } from "sonner";
import { CURRENT_YEAR } from "@/lib/constants";

const formSchema = z.object({
  startDate: z.string().min(1, "Başlangıç tarihi gerekli"),
  endDate: z.string().min(1, "Bitiş tarihi gerekli"),
  grossSalary: z.string().optional(),
  salaryDay: z.string().min(1, "Maaş günü gerekli"),
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

// Generate shareable URL with all form data
function generateShareUrl(values: FormData): string {
  const params = new URLSearchParams();
  
  if (values.startDate) params.set('start', values.startDate);
  if (values.endDate) params.set('end', values.endDate);
  if (values.grossSalary) params.set('salary', values.grossSalary);
  if (values.salaryDay) params.set('salaryDay', values.salaryDay);
  if (values.foodAllowance) params.set('food', values.foodAllowance);
  if (values.transportAllowance) params.set('transport', values.transportAllowance);
  if (values.healthInsurance) params.set('health', values.healthInsurance);
  if (values.fuelAllowance) params.set('fuel', values.fuelAllowance);
  if (values.childAllowance) params.set('child', values.childAllowance);
  if (values.otherBenefits) params.set('other', values.otherBenefits);
  if (values.annualBonus) params.set('bonus', values.annualBonus);
  if (values.unusedLeaveDays) params.set('leave', values.unusedLeaveDays);
  if (values.cumulativeTaxBase) params.set('taxBase', values.cumulativeTaxBase);
  
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://hakkimne.com';
  return `${baseUrl}/?${params.toString()}`;
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

const STORAGE_KEY = "severance-calculator-form";

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

  const { register, handleSubmit, formState: { errors }, watch, control, setValue } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      startDate: "",
      endDate: "",
      grossSalary: "",
      salaryDay: "1",
      foodAllowance: "",
      transportAllowance: "",
      healthInsurance: "",
      fuelAllowance: "",
      childAllowance: "",
      annualBonus: "",
      otherBenefits: "",
      unusedLeaveDays: "",
      cumulativeTaxBase: "",
    },
  });

  // Watch fields for salary calculation
  const watchedEndDate = watch("endDate");
  const watchedSalaryDay = watch("salaryDay");
  const watchedGrossSalary = watch("grossSalary");

  const grossSalaryValue = parseTurkishNumber(watchedGrossSalary || "");
  
  // Get dynamic minimum wage based on exit date (default to current date if not set)
  const exitDate = watchedEndDate ? new Date(watchedEndDate) : new Date();
  const financialData = getFinancialData(exitDate);
  const dynamicMinWage = financialData.minGrossWage;
  const showMinimumWageWarning = grossSalaryValue > 0 && grossSalaryValue < dynamicMinWage;

  
  const [isHydrated, setIsHydrated] = useState(false);
  const searchParams = useSearchParams();
  const hasTriggeredAutoCalc = useRef(false);

  // Load from localStorage AFTER hydration (client-side only)
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const data = JSON.parse(saved);
        // Set form values
        if (data.startDate) setValue("startDate", data.startDate);
        if (data.endDate) setValue("endDate", data.endDate);
        if (data.grossSalary) setValue("grossSalary", data.grossSalary);
        if (data.salaryDay) setValue("salaryDay", data.salaryDay);
        if (data.foodAllowance) setValue("foodAllowance", data.foodAllowance);
        if (data.transportAllowance) setValue("transportAllowance", data.transportAllowance);
        if (data.healthInsurance) setValue("healthInsurance", data.healthInsurance);
        if (data.fuelAllowance) setValue("fuelAllowance", data.fuelAllowance);
        if (data.childAllowance) setValue("childAllowance", data.childAllowance);
        if (data.annualBonus) setValue("annualBonus", data.annualBonus);
        if (data.otherBenefits) setValue("otherBenefits", data.otherBenefits);
        if (data.unusedLeaveDays) setValue("unusedLeaveDays", data.unusedLeaveDays);
        if (data.cumulativeTaxBase) setValue("cumulativeTaxBase", data.cumulativeTaxBase);
      }
    } catch (e) {
      console.error("Failed to load saved form data", e);
    }
    setIsHydrated(true);
  }, [setValue]);

  // URL Hydration: Read query params and auto-fill form
  useEffect(() => {
    if (!isHydrated || !searchParams) return;
    
    const start = searchParams.get('start');
    const end = searchParams.get('end');
    const salary = searchParams.get('salary');
    const salaryDay = searchParams.get('salaryDay');
    const food = searchParams.get('food');
    const transport = searchParams.get('transport');
    const health = searchParams.get('health');
    const fuel = searchParams.get('fuel');
    const child = searchParams.get('child');
    const other = searchParams.get('other');
    const bonus = searchParams.get('bonus');
    const leave = searchParams.get('leave');
    const taxBase = searchParams.get('taxBase');
    
    // Check if we have any params
    const hasParams = start || end || salary;
    
    if (hasParams) {
      // Populate form with URL params
      if (start) setValue("startDate", start);
      if (end) setValue("endDate", end);
      if (salary) setValue("grossSalary", salary);
      if (salaryDay) setValue("salaryDay", salaryDay);
      if (food) setValue("foodAllowance", food);
      if (transport) setValue("transportAllowance", transport);
      if (health) setValue("healthInsurance", health);
      if (fuel) setValue("fuelAllowance", fuel);
      if (child) setValue("childAllowance", child);
      if (other) setValue("otherBenefits", other);
      if (bonus) setValue("annualBonus", bonus);
      if (leave) setValue("unusedLeaveDays", leave);
      if (taxBase) setValue("cumulativeTaxBase", taxBase);
      
      // Auto-trigger calculation after a short delay
      if (!hasTriggeredAutoCalc.current) {
        hasTriggeredAutoCalc.current = true;
        setTimeout(() => {
          handleSubmit(onSubmit)();
        }, 100);
      }
    }
  }, [isHydrated, searchParams, setValue, handleSubmit]);

  // Save form data to localStorage on every change (only after hydration)
  const watchAllFields = watch();
  useEffect(() => {
    if (!isHydrated) return;
    const dataToSave = {
      ...watchAllFields,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
  }, [watchAllFields, isHydrated]);


  // Get gross salary from form
  const effectiveGrossSalary = parseTurkishNumber(watchedGrossSalary || "");


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

  // Custom validation error for salary fields
  const [salaryError, setSalaryError] = useState<string | null>(null);
  // Custom validation error for date fields
  const [dateError, setDateError] = useState<string | null>(null);
  // Reset confirmation dialog
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
  // Track last calculated form values to detect changes
  const [lastCalculatedValues, setLastCalculatedValues] = useState<FormData | null>(null);
  // Track if form has been modified since last calculation
  const [formModifiedSinceCalc, setFormModifiedSinceCalc] = useState(false);

  const handleReset = () => {
    // Reset all form values
    setValue("startDate", "");
    setValue("endDate", "");
    setValue("grossSalary", "");
    setValue("salaryDay", "1");
    setValue("foodAllowance", "");
    setValue("transportAllowance", "");
    setValue("healthInsurance", "");
    setValue("fuelAllowance", "");
    setValue("childAllowance", "");
    setValue("annualBonus", "");
    setValue("otherBenefits", "");
    setValue("unusedLeaveDays", "");
    setValue("cumulativeTaxBase", "");
    
    // Clear localStorage
    localStorage.removeItem(STORAGE_KEY);
    
    // Clear results
    setCalculatorInput({
      startDate: null,
      endDate: null,
      grossSalary: 0,
      benefits: { food: 0, transport: 0, healthInsurance: 0, fuel: 0, childAllowance: 0, annualBonus: 0, other: 0 },
      unusedLeaveDays: 0,
      salaryDay: 1,
      cumulativeTaxBase: 0,
    });
    
    // Clear errors
    setSalaryError(null);
    setDateError(null);
    
    // Close dialog
    setIsResetDialogOpen(false);
    
    // Clear modified flag
    setFormModifiedSinceCalc(false);
    setLastCalculatedValues(null);
    
    toast.success("Tüm değerler sıfırlandı!");
  };

  const onSubmit = (data: FormData) => {
    // Clear previous errors
    setSalaryError(null);
    setDateError(null);

    // Date validation
    const startDate = new Date(data.startDate);
    const endDate = new Date(data.endDate);
    
    if (startDate.getTime() === endDate.getTime()) {
      setDateError("İşe giriş ve çıkış tarihi aynı olamaz");
      return;
    }
    
    if (startDate > endDate) {
      setDateError("İşe giriş tarihi, çıkış tarihinden büyük olamaz");
      return;
    }

    // Validate grossSalary
    const grossSalaryValue = parseTurkishNumber(data.grossSalary || "");
    if (grossSalaryValue <= 0) {
      setSalaryError("Aylık brüt maaş giriniz");
      return;
    }

    setCalculatorInput({
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      grossSalary: effectiveGrossSalary,
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
    
    // Store the calculated form values and reset modified flag
    setLastCalculatedValues({ ...data });
    setFormModifiedSinceCalc(false);
  };

  // Detect form changes after calculation
  useEffect(() => {
    if (!lastCalculatedValues || !isHydrated) return;
    
    const currentValues = watchAllFields;
    const hasChanged = 
      currentValues.startDate !== lastCalculatedValues.startDate ||
      currentValues.endDate !== lastCalculatedValues.endDate ||
      currentValues.grossSalary !== lastCalculatedValues.grossSalary ||
      currentValues.salaryDay !== lastCalculatedValues.salaryDay ||
      currentValues.foodAllowance !== lastCalculatedValues.foodAllowance ||
      currentValues.transportAllowance !== lastCalculatedValues.transportAllowance ||
      currentValues.healthInsurance !== lastCalculatedValues.healthInsurance ||
      currentValues.fuelAllowance !== lastCalculatedValues.fuelAllowance ||
      currentValues.childAllowance !== lastCalculatedValues.childAllowance ||
      currentValues.annualBonus !== lastCalculatedValues.annualBonus ||
      currentValues.otherBenefits !== lastCalculatedValues.otherBenefits ||
      currentValues.unusedLeaveDays !== lastCalculatedValues.unusedLeaveDays ||
      currentValues.cumulativeTaxBase !== lastCalculatedValues.cumulativeTaxBase;
    
    setFormModifiedSinceCalc(hasChanged);
  }, [watchAllFields, lastCalculatedValues, isHydrated]);

  return (
    <div className="w-full space-y-8">
      {/* Form Card */}
      <div className="bg-[var(--card)] rounded-xl shadow-sm border border-[var(--border-light)] overflow-hidden">
        <div className="px-6 pt-8 pb-4 border-b border-[var(--border-light)]">
          <h2 className="text-2xl font-bold text-[var(--text-main)] leading-tight">
            Kıdem ve İhbar Tazminatı Hesaplama {CURRENT_YEAR}
          </h2>
          <p className="text-[var(--text-muted)] mt-2 text-base">
            İşe giriş çıkış tarihlerinizi ve maaş bilgilerinizi girerek yasal haklarınızı hemen öğrenin.
          </p>
        </div>
        
        <div className="p-6 md:p-8 space-y-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Temel Bilgiler Section */}
            <div>
              <h3 className="text-lg font-semibold text-[var(--text-main)] mb-4 flex items-center gap-2">
                <Briefcase className="text-[var(--primary)] w-5 h-5" />
                Temel Bilgiler <span className="text-sm font-normal text-[var(--text-muted)]">(Zorunlu)</span>
              </h3>
              <div className="flex flex-col md:flex-row gap-4">
                {/* İşe Giriş Tarihi - 25% */}
                <div className="w-full md:w-[25%] space-y-2">
                  <Label htmlFor="startDate" className="text-sm font-medium text-[var(--text-main)]">
                    İşe Giriş Tarihi
                  </Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] w-5 h-5" />
                  <Input
                    id="startDate"
                    type="date"
                    max="9999-12-31"
                    {...register("startDate")}
                    className="h-12 pl-11 pr-4 w-full rounded-lg border border-[var(--border-light)] bg-[var(--background-light)] focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                  />
                </div>
                  {errors.startDate && <p className="text-sm text-red-500">{errors.startDate.message}</p>}
                </div>
                
                {/* İşten Çıkış Tarihi - 25% */}
                <div className="w-full md:w-[25%] space-y-2">
                  <Label htmlFor="endDate" className="text-sm font-medium text-[var(--text-main)]">
                    İşten Çıkış Tarihi
                  </Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] w-5 h-5" />
                  <Input
                    id="endDate"
                    type="date"
                    max="9999-12-31"
                    {...register("endDate")}
                    className="h-12 pl-11 pr-4 w-full rounded-lg border border-[var(--border-light)] bg-[var(--background-light)] focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                  />
                  </div>
                  {errors.endDate && <p className="text-sm text-red-500">{errors.endDate.message}</p>}
                </div>

                {/* Aylık Brüt Maaş - 35% */}
                <div className="w-full md:w-[35%] space-y-2">
                  <Label htmlFor="grossSalary" className="text-sm font-medium text-[var(--text-main)]">
                    Aylık Brüt Maaş
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
                        value={field.value || ""}
                        onChange={field.onChange}
                        placeholder="Aylık brüt maaş"
                        className="h-12 pl-9 pr-4 w-full rounded-lg border border-[var(--border-light)] bg-[var(--background-light)] focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                      />
                    )}
                  />
                  </div>
                  {errors.grossSalary && <p className="text-sm text-red-500">{errors.grossSalary.message}</p>}
                </div>

                {/* Maaş Günü - 15% */}
                <div className="w-full md:w-[15%] space-y-2">
                  <Label htmlFor="salaryDay" className="text-sm font-medium text-[var(--text-main)]">
                    Maaş Günü
                  </Label>
                <div className="relative">
                  <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] w-5 h-5" />
                  <Input
                    id="salaryDay"
                    type="number"
                    min="1"
                    max="31"
                    placeholder="1"
                    {...register("salaryDay")}
                    onFocus={(e) => {
                      if (e.target.value === "1") {
                        setValue("salaryDay", "");
                      }
                    }}
                    onBlur={(e) => {
                      const value = parseInt(e.target.value);
                      if (value < 1 || isNaN(value) || e.target.value === "") {
                        setValue("salaryDay", "1");
                      } else if (value > 31) {
                        setValue("salaryDay", "31");
                      }
                    }}
                    className="h-12 pl-11 pr-4 w-full rounded-lg border border-[var(--border-light)] bg-[var(--background-light)] focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                    />
                  </div>
                  {salaryDayWarning && (
                    <p className="text-sm text-amber-600 flex items-center gap-1">
                      <AlertTriangle className="w-4 h-4" />
                      {salaryDayWarning}
                    </p>
                  )}
                  {errors.salaryDay && <p className="text-sm text-red-500">{errors.salaryDay.message}</p>}
                </div>
              </div>
            </div>
            
            {showMinimumWageWarning && (
              <p className="text-sm text-amber-600 flex items-center gap-2 mt-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>
                  Girdiğiniz tutar {formatPeriodName(financialData)} Asgari Ücretin ({formatCurrency(dynamicMinWage)}) altındadır. 
                  Tam zamanlı çalışıyorsanız lütfen kontrol ediniz. 
                  (Part-time çalışanlar bu uyarıyı dikkate almayabilir.)
                </span>
              </p>
            )}

            {/* Validation errors */}
            {dateError && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {dateError}
              </p>
            )}
            {salaryError && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {salaryError}
              </p>
            )}


            {/* Yan Haklar Section */}
            <div className="pt-4 border-t border-[var(--border-light)]">
              <h3 className="text-lg font-semibold text-[var(--text-main)] mb-4 flex items-center gap-2">
                <PlusCircle className="text-[var(--primary)] w-5 h-5" />
                Aylık Düzenli Yan Haklar (Net) <span className="text-sm font-normal text-[var(--text-muted)]">(Opsiyonel)</span>
              </h3>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="transportAllowance" className="text-xs font-medium text-[var(--text-muted)]">
                    Yol Ücreti
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] font-medium text-sm">₺</span>
                    <Controller
                      name="transportAllowance"
                      control={control}
                      render={({ field }) => (
                        <CurrencyInput
                          id="transportAllowance"
                          value={field.value || ""}
                          onChange={field.onChange}
                          placeholder="0"
                          className="h-10 pl-7 pr-3 rounded-lg border border-[var(--border-light)] bg-[var(--background-light)] text-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all w-full"
                        />
                      )}
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="foodAllowance" className="text-xs font-medium text-[var(--text-muted)]">
                    Yemek Ücreti
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] font-medium text-sm">₺</span>
                    <Controller
                      name="foodAllowance"
                      control={control}
                      render={({ field }) => (
                        <CurrencyInput
                          id="foodAllowance"
                          value={field.value || ""}
                          onChange={field.onChange}
                          placeholder="0"
                          className="h-10 pl-7 pr-3 rounded-lg border border-[var(--border-light)] bg-[var(--background-light)] text-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all w-full"
                        />
                      )}
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="fuelAllowance" className="text-xs font-medium text-[var(--text-muted)]">
                    Yakıt Desteği
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] font-medium text-sm">₺</span>
                    <Controller
                      name="fuelAllowance"
                      control={control}
                      render={({ field }) => (
                        <CurrencyInput
                          id="fuelAllowance"
                          value={field.value || ""}
                          onChange={field.onChange}
                          placeholder="0"
                          className="h-10 pl-7 pr-3 rounded-lg border border-[var(--border-light)] bg-[var(--background-light)] text-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all w-full"
                        />
                      )}
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="healthInsurance" className="text-xs font-medium text-[var(--text-muted)]">
                    Sağlık Sig.
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] font-medium text-sm">₺</span>
                    <Controller
                      name="healthInsurance"
                      control={control}
                      render={({ field }) => (
                        <CurrencyInput
                          id="healthInsurance"
                          value={field.value || ""}
                          onChange={field.onChange}
                          placeholder="0"
                          className="h-10 pl-7 pr-3 rounded-lg border border-[var(--border-light)] bg-[var(--background-light)] text-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all w-full"
                        />
                      )}
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="childAllowance" className="text-xs font-medium text-[var(--text-muted)]">
                    Çocuk Yardımı
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] font-medium text-sm">₺</span>
                    <Controller
                      name="childAllowance"
                      control={control}
                      render={({ field }) => (
                        <CurrencyInput
                          id="childAllowance"
                          value={field.value || ""}
                          onChange={field.onChange}
                          placeholder="0"
                          className="h-10 pl-7 pr-3 rounded-lg border border-[var(--border-light)] bg-[var(--background-light)] text-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all w-full"
                        />
                      )}
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="otherBenefits" className="text-xs font-medium text-[var(--text-muted)]">
                    Diğer
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] font-medium text-sm">₺</span>
                    <Controller
                      name="otherBenefits"
                      control={control}
                      render={({ field }) => (
                        <CurrencyInput
                          id="otherBenefits"
                          value={field.value || ""}
                          onChange={field.onChange}
                          placeholder="0"
                          className="h-10 pl-7 pr-3 rounded-lg border border-[var(--border-light)] bg-[var(--background-light)] text-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all w-full"
                        />
                      )}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Advanced Settings */}
            <div className="pt-4 border-t border-[var(--border-light)]">
              <h3 className="text-lg font-semibold text-[var(--text-main)] mb-4 flex items-center gap-2">
                <Sliders className="text-[var(--primary)] w-5 h-5" />
                Gelişmiş Ayarlar <span className="text-sm font-normal text-[var(--text-muted)]">(Opsiyonel)</span>
              </h3>
              <div className="flex flex-col md:flex-row gap-4">
                {/* Kümülatif Gelir Vergisi Matrahı - 45% */}
                <div className="w-full md:w-[45%] space-y-2">
                  <Label htmlFor="cumulativeTaxBase" className="text-sm font-medium text-[var(--text-main)] flex items-center gap-1.5">
                    Kümülatif Gelir Vergisi Matrahı
                    <span className="relative group">
                      <Info className="w-4 h-4 text-blue-500 cursor-help" />
                      <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-72 px-3 py-2 text-xs font-normal text-white bg-gray-800 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
                        E-Devlet &gt; SGK Tescil ve Hizmet Dökümü &gt; Prim Gün ve Kazanç Bilgileri sayfasından {watchedEndDate ? new Date(watchedEndDate).getFullYear() : "ilgili"} yılının &quot;Genel Toplam&quot; tutarını giriniz. Opsiyoneldir, yalnızca İhbar Tazminatı hesaplamasında kullanılır.
                      </span>
                    </span>
                  </Label>
                  <div className="relative">
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
                          className="h-12 pl-9 pr-4 w-full rounded-lg border border-[var(--border-light)] bg-[var(--background-light)] focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                        />
                      )}
                    />
                  </div>
                </div>

                {/* Yıllık İkramiye - 27.5% */}
                <div className="w-full md:w-[27.5%] space-y-2">
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
                          className="h-12 pl-9 pr-4 w-full rounded-lg border border-[var(--border-light)] bg-[var(--background-light)] focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                        />
                      )}
                    />
                  </div>
                </div>
                
                {/* Kullanılmayan İzin Günü - 27.5% */}
                <div className="w-full md:w-[27.5%] space-y-2">
                  <Label htmlFor="unusedLeaveDays" className="text-sm font-medium text-[var(--text-main)]">
                    Kullanılmayan İzin Günü
                  </Label>
                  <div className="relative">
                    <Palmtree className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] w-5 h-5" />
                    <Input
                      id="unusedLeaveDays"
                      type="number"
                      min="0"
                      placeholder="0"
                      {...register("unusedLeaveDays")}
                      className="h-12 pl-11 pr-14 w-full rounded-lg border border-[var(--border-light)] bg-[var(--background-light)] focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] font-medium">Gün</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                type="button"
                onClick={() => setIsResetDialogOpen(true)}
                className="h-14 px-6 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl shadow-lg shadow-red-500/30 flex items-center justify-center gap-2 text-lg transition-transform active:scale-[0.98] cursor-pointer"
              >
                <RotateCcw className="w-5 h-5" />
                Sıfırla
              </Button>
              <Button
                type="submit"
                className="flex-1 h-14 bg-[#2463eb] hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 text-lg transition-transform active:scale-[0.98] cursor-pointer"
              >
                <Calculator className="w-5 h-5" />
                HESAPLA
              </Button>
            </div>

            {/* Reset Confirmation Dialog */}
            <Dialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-red-600">Sıfırla</DialogTitle>
                  <DialogDescription>
                    Tüm değerler sıfırlanacaktır. Emin misiniz?
                  </DialogDescription>
                </DialogHeader>
                <div className="flex gap-3 mt-4">
                  <Button
                    type="button"
                    onClick={() => setIsResetDialogOpen(false)}
                    className="flex-1 h-12 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg cursor-pointer"
                  >
                    Hayır
                  </Button>
                  <Button
                    type="button"
                    onClick={handleReset}
                    className="flex-1 h-12 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg cursor-pointer"
                  >
                    Evet, Sıfırla
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </form>
        </div>
      </div>


      {result && <ResultsCard result={result} formValues={watchAllFields} formModifiedSinceCalc={formModifiedSinceCalc} onRecalculate={handleSubmit(onSubmit)} />}
    </div>
  );
}

function ResultsCard({ result, formValues, formModifiedSinceCalc, onRecalculate }: { result: SeveranceResult; formValues: FormData; formModifiedSinceCalc: boolean; onRecalculate: () => void }) {
  // State for selected payments
  const [selectedPayments, setSelectedPayments] = useState({
    severance: true,
    notice: true,
    unusedLeave: result.unusedLeaveGross > 0,
    proRated: result.proRatedDays > 0,
  });

  // Calculate dynamic total based on selections
  // Calculate dynamic totals based on selections
  const { dynamicTotal, dynamicGrossTotal, dynamicSgk, dynamicUnemployment, dynamicIncomeTax, dynamicStampTax, dynamicExemption } = (() => {
    let net = 0;
    let gross = 0;
    let sgk = 0;
    let unemployment = 0;
    let incomeTax = 0;
    let stampTax = 0;
    let exemption = 0;

    if (selectedPayments.severance && result.severanceEligible) {
      net += result.severanceNet;
      gross += result.severanceGross;
      stampTax += result.severanceStampTax;
    }
    if (selectedPayments.notice) {
      net += result.noticeNet;
      gross += result.noticeGross;
      incomeTax += result.noticeIncomeTax;
      stampTax += result.noticeStampTax;
      exemption += result.noticeIncomeTaxExemption + result.noticeStampTaxExemption;
    }
    if (selectedPayments.unusedLeave && result.unusedLeaveGross > 0) {
      net += result.unusedLeaveNet;
      gross += result.unusedLeaveGross;
      sgk += result.unusedLeaveSgk;
      unemployment += result.unusedLeaveUnemployment;
      incomeTax += result.unusedLeaveIncomeTax;
      stampTax += result.unusedLeaveStampTax;
      exemption += result.unusedLeaveIncomeTaxExemption + result.unusedLeaveStampTaxExemption;
    }
    if (selectedPayments.proRated && result.proRatedDays > 0) {
      net += result.proRatedSalaryNet;
      gross += result.proRatedSalaryGross;
      sgk += result.proRatedSalarySgk;
      unemployment += result.proRatedSalaryUnemployment;
      incomeTax += result.proRatedSalaryIncomeTax;
      stampTax += result.proRatedSalaryStampTax;
      exemption += result.proRatedSalaryIncomeTaxExemption + result.proRatedSalaryStampTaxExemption;
    }
    return { 
      dynamicTotal: net, 
      dynamicGrossTotal: gross,
      dynamicSgk: sgk,
      dynamicUnemployment: unemployment,
      dynamicIncomeTax: incomeTax,
      dynamicStampTax: stampTax,
      dynamicExemption: exemption
    };
  })();

  // Track previous total for animation
  const prevTotalRef = useRef(dynamicTotal);
  const prevGrossTotalRef = useRef(dynamicGrossTotal);
  const [priceChange, setPriceChange] = useState<'up' | 'down' | null>(null);
  const [displayedTotal, setDisplayedTotal] = useState(dynamicTotal);
  const [displayedGrossTotal, setDisplayedGrossTotal] = useState(dynamicGrossTotal);

  useEffect(() => {
    if (prevTotalRef.current !== dynamicTotal || prevGrossTotalRef.current !== dynamicGrossTotal) {
      const startValue = prevTotalRef.current;
      const endValue = dynamicTotal;
      const diff = endValue - startValue;

      const startGross = prevGrossTotalRef.current;
      const endGross = dynamicGrossTotal;
      const diffGross = endGross - startGross;
      
      // Set direction for color
      if (diff > 0) {
        setPriceChange('up');
      } else if (diff < 0) {
        setPriceChange('down');
      }
      
      // Animate the numbers
      const duration = 400; // ms
      const steps = 20;
      const stepDuration = duration / steps;
      let currentStep = 0;
      
      const interval = setInterval(() => {
        currentStep++;
        const progress = currentStep / steps;
        // Easing function for smooth end
        const easeOut = 1 - Math.pow(1 - progress, 3);
        
        const currentValue = startValue + (diff * easeOut);
        setDisplayedTotal(currentValue);

        const currentGrossValue = startGross + (diffGross * easeOut);
        setDisplayedGrossTotal(currentGrossValue);
        
        if (currentStep >= steps) {
          clearInterval(interval);
          setDisplayedTotal(endValue);
          setDisplayedGrossTotal(endGross);
        }
      }, stepDuration);
      
      prevTotalRef.current = dynamicTotal;
      prevGrossTotalRef.current = dynamicGrossTotal;
      
      // Reset color after animation + delay
      const timer = setTimeout(() => setPriceChange(null), duration + 200);
      return () => {
        clearInterval(interval);
        clearTimeout(timer);
      };
    }
  }, [dynamicTotal, dynamicGrossTotal]);

  const togglePayment = (key: keyof typeof selectedPayments) => {
    setSelectedPayments(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);

  const handleShare = async () => {
    const shareUrl = generateShareUrl(formValues);
    const shareText = `🎯 Hakkım Ne? - Tazminat Hesabı\n\n💰 Net Ele Geçen: ${formatCurrency(displayedTotal)}\n📊 Toplam Brüt: ${formatCurrency(displayedGrossTotal)}\n⏱️ Çalışma Süresi: ${result.tenure.years} Yıl, ${result.tenure.months} Ay, ${result.tenure.days} Gün\n\nDetaylar: ${shareUrl}`;

    // Detect if mobile device
    const isMobile = typeof window !== 'undefined' && (window.navigator.maxTouchPoints > 0 || window.innerWidth < 768);
    
    try {
      if (navigator.share && isMobile) {
        // Mobile: Use native share
        await navigator.share({
          title: 'Hakkım Ne? - Tazminat Hesabı',
          text: shareText,
        });
      } else {
        // Desktop: Open custom dialog
        setIsShareDialogOpen(true);
      }
    } catch (error) {
      // User cancelled or error occurred
      if (error instanceof Error && error.name !== 'AbortError') {
        toast.error("Paylaşım sırasında bir hata oluştu");
      }
    }
  };

  const handleCopyLink = async () => {
    try {
      const shareUrl = generateShareUrl(formValues);
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Link panoya kopyalandı!");
      setIsShareDialogOpen(false);
    } catch (error) {
      toast.error("Link kopyalanamadı");
    }
  };

  const shareUrl = generateShareUrl(formValues);
  const shareMessage = `🎯 Hakkım Ne? - Tazminat Hesabı\n💰 Net Ele Geçen: ${formatCurrency(displayedTotal)}\n📊 Toplam Brüt: ${formatCurrency(displayedGrossTotal)}\n⏱️ Çalışma Süresi: ${result.tenure.years} Yıl\n\nDetaylar:`;
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareMessage + ' ' + shareUrl)}`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent('Kıdem tazminatımı hesapladım! 💰')}&url=${encodeURIComponent(shareUrl)}`;

  return (
    <div className="space-y-6">
      {/* Form Modified Warning */}
      {formModifiedSinceCalc && (
        <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl p-4 flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-500 shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
              Form verileri değiştirildi. Güncel sonuçları görmek için lütfen tekrar hesaplayın.
            </p>
          </div>
          <Button
            type="button"
            onClick={onRecalculate}
            className="h-8 px-4 bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium rounded-lg cursor-pointer shrink-0"
          >
            Tekrar Hesapla
          </Button>
        </div>
      )}

      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-[var(--card)] to-blue-50 dark:to-blue-950/30 border border-blue-100 dark:border-blue-900/50 rounded-xl p-6 pb-16 md:p-8 md:pb-8 relative overflow-hidden">
        {/* Decorative blur circle */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-200/50 dark:bg-blue-500/20 blur-3xl rounded-full pointer-events-none" />
        
        {/* Share Button */}
        <button
          onClick={handleShare}
          className="absolute bottom-4 right-4 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#2463eb] hover:bg-blue-700 text-white text-sm font-medium transition-colors cursor-pointer shadow-lg shadow-blue-500/30"
        >
          <Share2 size={16} />
          Paylaş
        </button>
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div className="flex flex-col gap-1 text-center md:text-left">
            <span className="text-sm font-semibold uppercase tracking-wider text-[var(--text-muted)]">
              Seçili Ödemelerin Toplamı
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-[var(--text-main)]">
              Net Ele Geçen Toplam
            </h2>
          </div>
          <div className="flex flex-col items-center md:items-end">
            <div className="flex items-center gap-1.5 text-xs font-medium text-[var(--text-muted)] mb-1">
              <span>Toplam Brüt:</span>
              <span className="text-[var(--text-main)]">{formatCurrency(displayedGrossTotal)}</span>
            </div>
            <div className="flex items-center gap-2">
              {/* Price change indicator */}
              {priceChange && (
                <span 
                  className={`flex items-center gap-1 text-sm font-bold animate-pulse ${
                    priceChange === 'up' ? 'text-emerald-500' : 'text-red-500'
                  }`}
                >
                  {priceChange === 'up' ? <TrendingUp className="text-xl" /> : <TrendingDown className="text-xl" />}
                </span>
              )}
              <span 
                className={`text-4xl md:text-5xl font-extrabold tracking-tight transition-colors duration-300 ${
                  priceChange === 'up' 
                    ? 'text-emerald-500' 
                    : priceChange === 'down' 
                      ? 'text-red-500' 
                      : 'text-[#2463eb]'
                }`}
              >
                {formatCurrency(displayedTotal)}
              </span>
            </div>
          </div>
        </div>

        {/* Tenure Info */}
        <div className="flex items-center justify-center gap-2 text-sm text-[var(--text-muted)] mt-6 pt-4 border-t border-blue-100 dark:border-blue-900/50">
          <Clock className="text-lg w-5 h-5" />
          <span>Çalışma Süresi:</span>
          <span className="font-semibold text-[var(--text-main)]">
            {result.tenure.years} yıl, {result.tenure.months} ay, {result.tenure.days} gün
          </span>
        </div>
        
        {/* Period Indicator */}
        <div className="flex items-center justify-center gap-2 text-xs text-[var(--text-muted)] mt-2">
          <Info className="w-3 h-3" />
          <span>Hesaplama {result.periodName} verileriyle yapılmıştır.</span>
        </div>
      </div>

      {/* Selection Instruction */}
      <div className="flex justify-center px-1">
        <span className="text-sm font-medium text-[var(--text-main)]">
          Hesaplamaya dahil edilecek ödemeleri aşağıdan seçebilirsiniz
        </span>
      </div>

      {/* Breakdown Grid with Selectable Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Kıdem Tazminatı */}
        <SelectablePaymentCard
          selected={selectedPayments.severance}
          onToggle={() => togglePayment('severance')}
          disabled={!result.severanceEligible}
          icon={<Briefcase className="text-xl" />}
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
        />

        {/* İhbar Tazminatı */}
        <SelectablePaymentCard
          selected={selectedPayments.notice}
          onToggle={() => togglePayment('notice')}
          icon={<AlertTriangle className="text-xl" />}
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
          note={!formValues.cumulativeTaxBase ? "⚠️ Kümülatif Gelir Vergisi Matrahı girilmedi, hesaplama hatalı olabilir." : undefined}
        />

        {/* Yıllık İzin */}
        {result.unusedLeaveGross > 0 && (
          <SelectablePaymentCard
            selected={selectedPayments.unusedLeave}
            onToggle={() => togglePayment('unusedLeave')}
            icon={<Palmtree className="text-xl" />}
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
          />
        )}

        {/* Hak Edilen Maaş */}
        {result.proRatedDays > 0 && (
          <SelectablePaymentCard
            selected={selectedPayments.proRated}
            onToggle={() => togglePayment('proRated')}
            icon={<Wallet className="text-xl" />}
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
      <div className="bg-[var(--card)] rounded-xl border border-[var(--border-light)] p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[var(--border-light)]">
          <div className="p-2 bg-[var(--muted)] rounded-lg text-[var(--text-muted)]">
            <Receipt className="text-xl w-6 h-6" />
          </div>
          <h3 className="font-bold text-lg text-[var(--text-main)]">Yasal Kesintiler Özeti</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 text-sm">
          <div className="space-y-1">
            <span className="text-[var(--text-muted)]">Toplam Brüt</span>
            <p className="font-semibold text-[var(--text-main)] text-base">{formatCurrency(dynamicGrossTotal)}</p>
          </div>
          <div className="space-y-1">
            <span className="text-[var(--text-muted)]">SGK (İşçi + İşsizlik)</span>
            <p className="font-semibold text-red-500">{formatCurrency(dynamicSgk + dynamicUnemployment)}</p>
          </div>
          <div className="space-y-1">
            <span className="text-[var(--text-muted)]">Gelir Vergisi</span>
            <p className="font-semibold text-red-500">{formatCurrency(dynamicIncomeTax)}</p>
          </div>
          <div className="space-y-1">
            <span className="text-[var(--text-muted)]">Damga Vergisi</span>
            <p className="font-semibold text-red-500">{formatCurrency(dynamicStampTax)}</p>
          </div>
          <div className="space-y-1">
            <span className="text-[var(--text-muted)]">Vergi İstisnası</span>
            <p className="font-semibold text-emerald-600">+{formatCurrency(dynamicExemption)}</p>
          </div>
        </div>
        <div className="mt-4 pt-3 border-t border-dashed border-[var(--border-light)] flex justify-between items-center text-sm font-medium">
          <span className="text-[var(--text-main)]">Net Ele Geçen Toplam</span>
          <span className="font-bold text-[#2463eb] text-lg">
            {formatCurrency(dynamicTotal)}
          </span>
        </div>
      </div>

      {/* Footer Note */}
      <p className="text-xs text-center text-[var(--text-muted)]">
        * Kıdem tavanı: ₺53.919,68 (2025 2. Yarıyıl) | Asgari ücret: ₺26.005,50
      </p>

      {/* Share Dialog for Desktop */}
      <Dialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Hesaplamanı Paylaş</DialogTitle>
            <DialogDescription>
              Hesaplama sonuçlarını sosyal medyada paylaş veya linki kopyala
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3 mt-4">
            {/* WhatsApp */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-4 py-3 rounded-lg border border-[var(--border-light)] bg-[var(--background-light)] hover:bg-green-50 dark:hover:bg-green-950/20 hover:border-green-500 transition-colors group cursor-pointer"
            >
              <MessageCircle className="w-5 h-5 text-green-600 group-hover:scale-110 transition-transform" />
              <span className="font-medium text-[var(--text-main)]">WhatsApp</span>
            </a>

            {/* X (Twitter) */}
            <a
              href={twitterUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-4 py-3 rounded-lg border border-[var(--border-light)] bg-[var(--background-light)] hover:bg-gray-50 dark:hover:bg-gray-900/20 hover:border-gray-500 transition-colors group cursor-pointer"
            >
              <Twitter className="w-5 h-5 text-gray-800 dark:text-gray-200 group-hover:scale-110 transition-transform" />
              <span className="font-medium text-[var(--text-main)]">X (Twitter)</span>
            </a>

            {/* Copy Link */}
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-3 px-4 py-3 rounded-lg border border-[var(--border-light)] bg-[var(--background-light)] hover:bg-blue-50 dark:hover:bg-blue-950/20 hover:border-blue-500 transition-colors group cursor-pointer"
            >
              <Link className="w-5 h-5 text-blue-600 group-hover:scale-110 transition-transform" />
              <span className="font-medium text-[var(--text-main)]">Linki Kopyala</span>
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

interface PaymentCardProps {
  icon: React.ReactNode;
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
    <div className="bg-[var(--card)] rounded-lg border border-[var(--border-light)] p-5 shadow-sm hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4 pb-3 border-b border-[var(--border-light)]">
        <div className={`p-2 rounded-lg ${iconBgColor} ${iconTextColor}`}>
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-lg text-[var(--text-main)]">{title}</h3>
          {subtitle && <p className="text-xs text-amber-600">{subtitle}</p>}
        </div>
        {badge && (
          <span className="text-xs px-2 py-1 rounded-full bg-[var(--muted)] text-[var(--text-muted)] font-medium">
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
    </div>
  );
}

// Selectable version of PaymentCard
interface SelectablePaymentCardProps {
  selected: boolean;
  onToggle: () => void;
  disabled?: boolean;
  icon: React.ReactNode;
  iconBgColor: string;
  iconTextColor: string;
  title: string;
  badge?: string;
  subtitle?: string;
  items: Array<{ label: string; value: number; isDeduction?: boolean; isExemption?: boolean }>;
  netAmount: number;
  note?: string;
}

function SelectablePaymentCard({ 
  selected,
  onToggle,
  disabled,
  icon, 
  iconBgColor, 
  iconTextColor, 
  title, 
  badge, 
  subtitle, 
  items, 
  netAmount,
  note
}: SelectablePaymentCardProps) {
  return (
    <div 
      className={`relative bg-[var(--card)] rounded-lg border-2 p-5 shadow-sm transition-all cursor-pointer ${
        disabled 
          ? "opacity-50 cursor-not-allowed border-[var(--border-light)]" 
          : selected 
            ? "border-blue-400 ring-2 ring-blue-100 dark:ring-blue-900/50" 
            : "border-[var(--border-light)] hover:border-blue-300 dark:hover:border-blue-700"
      }`}
      onClick={() => !disabled && onToggle()}
    >
      {/* Circular Checkbox - Top Right */}
      <div 
        className={`absolute top-3 right-3 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all cursor-pointer ${
          disabled 
            ? "border-[var(--border-light)] bg-[var(--muted)]" 
            : selected 
              ? "border-blue-500 bg-blue-500" 
              : "border-[var(--border-light)] bg-[var(--card)] hover:border-blue-400"
        }`}
        onClick={(e) => {
          e.stopPropagation();
          !disabled && onToggle();
        }}
      >
        {selected && !disabled && (
          <Check className="text-white w-4 h-4" strokeWidth={3} />
        )}
      </div>
      
      {/* Header */}
      <div className="flex items-center gap-3 mb-4 pb-3 border-b border-[var(--border-light)]">
        <div className={`p-2 rounded-lg ${iconBgColor} ${iconTextColor}`}>
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-lg text-[var(--text-main)]">{title}</h3>
          {subtitle && <p className="text-xs text-amber-600">{subtitle}</p>}
        </div>
        {badge && (
          <span className="text-xs px-2 py-1 rounded-full bg-[var(--muted)] text-[var(--text-muted)] font-medium mr-6">
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
        <span className={`font-bold text-lg ${selected && !disabled ? "text-[#2463eb]" : "text-slate-400"}`}>
          {formatCurrency(netAmount)}
        </span>
      </div>

      {/* Warning Note */}
      {note && (
        <p className="text-xs text-amber-600 mt-2">
          {note}
        </p>
      )}
    </div>
  );
}
