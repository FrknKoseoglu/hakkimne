"use client";

import { useMemo } from "react";
import { differenceInDays, differenceInMonths, differenceInYears } from "date-fns";
import Big from "big.js";
import { getFinancialData, FinancialPeriod, formatPeriodName } from "@/lib/financial-data";

// ============================================
// CONSTANTS - Turkish Labor Law (Static Rates)
// ============================================
const STAMP_TAX_RATE = 0.00759;
const SGK_EMPLOYEE_RATE = 0.14;
const UNEMPLOYMENT_RATE = 0.01;

// ============================================
// DYNAMIC FINANCIAL DATA HELPER
// ============================================
function getCalculationConstants(endDate: Date) {
  const financialData = getFinancialData(endDate);
  
  const MINIMUM_WAGE_GROSS = financialData.minGrossWage;
  const SEVERANCE_CEILING = financialData.severanceCeiling;
  const INCOME_TAX_BRACKETS = financialData.taxBrackets;
  
  // Asgari ücret gelir vergisi istisnası (aylık)
  const MIN_WAGE_TAXABLE = MINIMUM_WAGE_GROSS * (1 - SGK_EMPLOYEE_RATE - UNEMPLOYMENT_RATE);
  const MONTHLY_INCOME_TAX_EXEMPTION = MIN_WAGE_TAXABLE * 0.15;
  const MONTHLY_STAMP_TAX_EXEMPTION = MINIMUM_WAGE_GROSS * STAMP_TAX_RATE;
  
  return {
    SEVERANCE_CEILING,
    MINIMUM_WAGE_GROSS,
    INCOME_TAX_BRACKETS,
    MONTHLY_INCOME_TAX_EXEMPTION,
    MONTHLY_STAMP_TAX_EXEMPTION,
    financialPeriod: financialData,
    periodName: formatPeriodName(financialData),
  };
}

// ============================================
// TYPE DEFINITIONS
// ============================================
export interface BenefitsBreakdown {
  food: number;
  transport: number;
  healthInsurance: number;
  fuel: number;
  childAllowance: number;
  annualBonus: number;
  other: number;
}

export interface SeveranceInput {
  startDate: Date | null;
  endDate: Date | null;
  grossSalary: number;
  baseSalaryForLeave?: number; // Opsiyonel: İzin ücreti için çıplak brüt maaş
  benefits: BenefitsBreakdown;
  unusedLeaveDays: number;
  salaryDay: number;
  cumulativeTaxBase: number;
  fireCode?: string;
}

export interface TenureBreakdown {
  years: number;
  months: number;
  days: number;
  totalDays: number;
}

export interface SeveranceResult {
  tenure: TenureBreakdown;
  dressedGrossWage: number;
  benefitsGrossTotal: number;
  // Kıdem
  severanceEligible: boolean;
  severanceBase: number;
  isCeilingApplied: boolean;
  severanceGross: number;
  severanceStampTax: number;
  severanceNet: number;
  // İhbar
  noticeWeeks: number;
  noticeBase: number;
  noticeGross: number;
  noticeSgk: number;
  noticeUnemployment: number;
  noticeIncomeTax: number;
  noticeIncomeTaxExemption: number;
  noticeStampTax: number;
  noticeStampTaxExemption: number;
  noticeNet: number;
  noticeTaxRate: number;
  // İzin
  unusedLeaveGross: number;
  unusedLeaveSgk: number;
  unusedLeaveUnemployment: number;
  unusedLeaveIncomeTax: number;
  unusedLeaveIncomeTaxExemption: number;
  unusedLeaveStampTax: number;
  unusedLeaveStampTaxExemption: number;
  unusedLeaveNet: number;
  unusedLeaveTaxRate: number;
  // Hak Edilen Maaş
  proRatedDays: number;
  proRatedSalaryGross: number;
  proRatedSalarySgk: number;
  proRatedSalaryUnemployment: number;
  proRatedSalaryIncomeTax: number;
  proRatedSalaryIncomeTaxExemption: number;
  proRatedSalaryStampTax: number;
  proRatedSalaryStampTaxExemption: number;
  proRatedSalaryNet: number;
  proRatedTaxRate: number;
  // Toplamlar
  totalSgk: number;
  totalUnemployment: number;
  totalIncomeTax: number;
  totalIncomeTaxExemption: number;
  totalStampTax: number;
  totalStampTaxExemption: number;
  totalGross: number;
  totalNet: number;
  newCumulativeTaxBase: number;
  // Flags
  isLeaveApproximate: boolean; // İzin ücreti yaklaşık hesaplandı mı?
  // Period Info
  periodName: string; // e.g., "2024 2. Yarıyıl"
  severanceCeiling: number;
  minGrossWage: number;
}

// ============================================
// HELPER FUNCTIONS
// ============================================

function netToGross(netAmount: number, taxRate: number = 0.15): number {
  if (netAmount <= 0) return 0;
  const effectiveRate = STAMP_TAX_RATE + taxRate;
  return netAmount / (1 - effectiveRate);
}

/**
 * Calculate Income Tax with cumulative base
 * Returns the tax rate that applies based on cumulative position
 */
function calculateIncomeTax(
  taxableAmount: number,
  cumulativeBase: number,
  taxBrackets: { limit: number; rate: number }[]
): { tax: Big; rate: number } {
  if (taxableAmount <= 0) {
    return { tax: new Big(0), rate: 0 };
  }

  const totalAmount = cumulativeBase + taxableAmount;
  let applicableRate = 0.15;

  for (const bracket of taxBrackets) {
    if (totalAmount <= bracket.limit) {
      applicableRate = bracket.rate;
      break;
    }
  }

  const tax = new Big(taxableAmount).times(applicableRate);
  return { tax, rate: applicableRate * 100 };
}

/**
 * Calculate exemption amount based on payment days
 * Asgari ücret istisnası gün sayısına göre oranlanır
 */
function calculateExemption(days: number, monthlyExemption: number): Big {
  // Aylık istisnayı gün sayısına göre oranla
  return new Big(monthlyExemption).times(days).div(30);
}

function calculateDressedGrossWage(
  grossSalary: number,
  benefits: BenefitsBreakdown
): { dressedWage: Big; benefitsGross: Big } {
  const foodGross = netToGross(benefits.food);
  const transportGross = netToGross(benefits.transport);
  const healthInsGross = netToGross(benefits.healthInsurance);
  const fuelGross = netToGross(benefits.fuel);
  const childGross = netToGross(benefits.childAllowance);
  const otherGross = netToGross(benefits.other);
  const bonusMonthlyGross = netToGross(benefits.annualBonus) / 12;

  const benefitsGross = new Big(foodGross)
    .plus(transportGross)
    .plus(healthInsGross)
    .plus(fuelGross)
    .plus(childGross)
    .plus(otherGross)
    .plus(bonusMonthlyGross);

  const dressedWage = new Big(grossSalary).plus(benefitsGross);
  return { dressedWage, benefitsGross };
}

function calculateTenure(startDate: Date, endDate: Date): TenureBreakdown {
  const years = differenceInYears(endDate, startDate);
  const dateAfterYears = new Date(startDate);
  dateAfterYears.setFullYear(dateAfterYears.getFullYear() + years);
  const months = differenceInMonths(endDate, dateAfterYears);
  const dateAfterMonths = new Date(dateAfterYears);
  dateAfterMonths.setMonth(dateAfterMonths.getMonth() + months);
  const days = differenceInDays(endDate, dateAfterMonths);
  const totalDays = differenceInDays(endDate, startDate);
  return { years, months, days, totalDays };
}

function calculateRemainingDaysForSeverance(tenure: TenureBreakdown): number {
  return (tenure.months * 30) + tenure.days;
}

function getNoticeWeeks(totalDays: number): number {
  const months = totalDays / 30;
  if (months < 6) return 2;
  if (months < 18) return 4;
  if (months < 36) return 6;
  return 8;
}

function calculateProRatedDays(endDate: Date, salaryDay: number): number {
  const endDay = endDate.getDate();
  if (endDay > salaryDay) {
    return endDay - salaryDay;
  } else if (endDay < salaryDay) {
    const lastDayPrevMonth = new Date(endDate.getFullYear(), endDate.getMonth(), 0).getDate();
    return (lastDayPrevMonth - salaryDay) + endDay;
  }
  return 0;
}

// ============================================
// MAIN CALCULATOR HOOK
// ============================================
export function useSeveranceCalculator(input: SeveranceInput): SeveranceResult | null {
  return useMemo(() => {
    const { startDate, endDate, grossSalary, baseSalaryForLeave, benefits, unusedLeaveDays, salaryDay, cumulativeTaxBase } = input;

    if (!startDate || !endDate || grossSalary <= 0) return null;
    if (endDate <= startDate) return null;

    // Get dynamic constants based on exit date
    const {
      SEVERANCE_CEILING,
      INCOME_TAX_BRACKETS,
      MONTHLY_INCOME_TAX_EXEMPTION,
      MONTHLY_STAMP_TAX_EXEMPTION,
      periodName,
    } = getCalculationConstants(endDate);

    const tenure = calculateTenure(startDate, endDate);
    const { dressedWage, benefitsGross } = calculateDressedGrossWage(grossSalary, benefits);

    let runningCumulativeBase = new Big(cumulativeTaxBase);

    // ========================================
    // KIDEM TAZMİNATI - SGK ve Gelir Vergisi YOK
    // ========================================
    const severanceEligible = tenure.totalDays >= 365;
    const isCeilingApplied = dressedWage.gt(SEVERANCE_CEILING);
    const severanceBase = isCeilingApplied ? new Big(SEVERANCE_CEILING) : dressedWage;

    let severanceGross = new Big(0);
    if (severanceEligible) {
      const yearlyComponent = severanceBase.times(tenure.years);
      const remainingDays = calculateRemainingDaysForSeverance(tenure);
      const dailyComponent = severanceBase.div(365).times(remainingDays);
      severanceGross = yearlyComponent.plus(dailyComponent);
    }

    const severanceStampTax = severanceGross.times(STAMP_TAX_RATE);
    const severanceNet = severanceGross.minus(severanceStampTax);

    // ========================================
    // İHBAR TAZMİNATI
    // SGK'YA TABİ DEĞİL - Sadece Gelir Vergisi ve Damga Vergisi
    // ========================================
    const noticeWeeks = getNoticeWeeks(tenure.totalDays);
    const noticeDays = noticeWeeks * 7;
    const dailyNoticeWage = dressedWage.div(30);
    const noticeGross = dailyNoticeWage.times(noticeDays);

    // İhbar tazminatı SGK'ya tabi DEĞİL
    const noticeSgk = new Big(0);
    const noticeUnemployment = new Big(0);
    
    // Gelir vergisi matrahı = Brüt tutar (SGK kesintisi yok)
    const noticeTaxableAmount = noticeGross;
    
    const noticeTax = calculateIncomeTax(noticeTaxableAmount.toNumber(), runningCumulativeBase.toNumber(), INCOME_TAX_BRACKETS);
    const noticeIncomeTaxBeforeExemption = noticeTax.tax;
    const noticeTaxRate = noticeTax.rate;

    // Asgari ücret istisnası (gün bazlı oranlama)
    const noticeIncomeTaxExemption = calculateExemption(noticeDays, MONTHLY_INCOME_TAX_EXEMPTION);
    const noticeIncomeTaxDiff = noticeIncomeTaxBeforeExemption.minus(noticeIncomeTaxExemption);
    const noticeIncomeTax = noticeIncomeTaxDiff.lt(0) ? new Big(0) : noticeIncomeTaxDiff;

    const noticeStampTaxBeforeExemption = noticeGross.times(STAMP_TAX_RATE);
    const noticeStampTaxExemption = calculateExemption(noticeDays, MONTHLY_STAMP_TAX_EXEMPTION);
    const noticeStampTaxDiff = noticeStampTaxBeforeExemption.minus(noticeStampTaxExemption);
    const noticeStampTax = noticeStampTaxDiff.lt(0) ? new Big(0) : noticeStampTaxDiff;

    const noticeNet = noticeGross
      .minus(noticeIncomeTax)
      .minus(noticeStampTax);

    runningCumulativeBase = runningCumulativeBase.plus(noticeTaxableAmount);

    // ========================================
    // YILLIK İZİN ÜCRETİ
    // Çıplak brüt maaş / 30 × izin günü
    // ========================================
    // Eğer baseSalaryForLeave girilmişse onu kullan, yoksa grossSalary kullan
    const leaveBaseSalary = baseSalaryForLeave && baseSalaryForLeave > 0 ? baseSalaryForLeave : grossSalary;
    const isLeaveApproximate = !baseSalaryForLeave || baseSalaryForLeave <= 0;
    const dailyBaseSalary = new Big(leaveBaseSalary).div(30);
    const unusedLeaveGross = dailyBaseSalary.times(unusedLeaveDays);

    const unusedLeaveSgk = unusedLeaveGross.times(SGK_EMPLOYEE_RATE);
    const unusedLeaveUnemployment = unusedLeaveGross.times(UNEMPLOYMENT_RATE);
    const unusedLeaveTaxableAmount = unusedLeaveGross.minus(unusedLeaveSgk).minus(unusedLeaveUnemployment);

    const unusedLeaveTax = calculateIncomeTax(unusedLeaveTaxableAmount.toNumber(), runningCumulativeBase.toNumber(), INCOME_TAX_BRACKETS);
    const unusedLeaveIncomeTaxBeforeExemption = unusedLeaveTax.tax;
    const unusedLeaveTaxRate = unusedLeaveTax.rate;

    const unusedLeaveIncomeTaxExemption = calculateExemption(unusedLeaveDays, MONTHLY_INCOME_TAX_EXEMPTION);
    const unusedLeaveIncomeTaxDiff = unusedLeaveIncomeTaxBeforeExemption.minus(unusedLeaveIncomeTaxExemption);
    const unusedLeaveIncomeTax = unusedLeaveIncomeTaxDiff.lt(0) ? new Big(0) : unusedLeaveIncomeTaxDiff;

    const unusedLeaveStampTaxBeforeExemption = unusedLeaveGross.times(STAMP_TAX_RATE);
    const unusedLeaveStampTaxExemption = calculateExemption(unusedLeaveDays, MONTHLY_STAMP_TAX_EXEMPTION);
    const unusedLeaveStampTaxDiff = unusedLeaveStampTaxBeforeExemption.minus(unusedLeaveStampTaxExemption);
    const unusedLeaveStampTax = unusedLeaveStampTaxDiff.lt(0) ? new Big(0) : unusedLeaveStampTaxDiff;

    const unusedLeaveNet = unusedLeaveGross
      .minus(unusedLeaveSgk)
      .minus(unusedLeaveUnemployment)
      .minus(unusedLeaveIncomeTax)
      .minus(unusedLeaveStampTax);

    runningCumulativeBase = runningCumulativeBase.plus(unusedLeaveTaxableAmount);

    // ========================================
    // HAK EDİLEN MAAŞ
    // ========================================
    const proRatedDays = salaryDay > 0 ? calculateProRatedDays(endDate, salaryDay) : 0;
    const dailyDressedWage = dressedWage.div(30);
    const proRatedSalaryGross = dailyDressedWage.times(proRatedDays);

    const proRatedSalarySgk = proRatedSalaryGross.times(SGK_EMPLOYEE_RATE);
    const proRatedSalaryUnemployment = proRatedSalaryGross.times(UNEMPLOYMENT_RATE);
    const proRatedTaxableAmount = proRatedSalaryGross.minus(proRatedSalarySgk).minus(proRatedSalaryUnemployment);

    const proRatedTax = calculateIncomeTax(proRatedTaxableAmount.toNumber(), runningCumulativeBase.toNumber(), INCOME_TAX_BRACKETS);
    const proRatedSalaryIncomeTaxBeforeExemption = proRatedTax.tax;
    const proRatedTaxRate = proRatedTax.rate;

    const proRatedSalaryIncomeTaxExemption = calculateExemption(proRatedDays, MONTHLY_INCOME_TAX_EXEMPTION);
    const proRatedSalaryIncomeTaxDiff = proRatedSalaryIncomeTaxBeforeExemption.minus(proRatedSalaryIncomeTaxExemption);
    const proRatedSalaryIncomeTax = proRatedSalaryIncomeTaxDiff.lt(0) ? new Big(0) : proRatedSalaryIncomeTaxDiff;

    const proRatedSalaryStampTaxBeforeExemption = proRatedSalaryGross.times(STAMP_TAX_RATE);
    const proRatedSalaryStampTaxExemption = calculateExemption(proRatedDays, MONTHLY_STAMP_TAX_EXEMPTION);
    const proRatedSalaryStampTaxDiff = proRatedSalaryStampTaxBeforeExemption.minus(proRatedSalaryStampTaxExemption);
    const proRatedSalaryStampTax = proRatedSalaryStampTaxDiff.lt(0) ? new Big(0) : proRatedSalaryStampTaxDiff;

    const proRatedSalaryNet = proRatedSalaryGross
      .minus(proRatedSalarySgk)
      .minus(proRatedSalaryUnemployment)
      .minus(proRatedSalaryIncomeTax)
      .minus(proRatedSalaryStampTax);

    runningCumulativeBase = runningCumulativeBase.plus(proRatedTaxableAmount);

    // ========================================
    // TOPLAMLAR
    // ========================================
    const totalSgk = noticeSgk.plus(unusedLeaveSgk).plus(proRatedSalarySgk);
    const totalUnemployment = noticeUnemployment.plus(unusedLeaveUnemployment).plus(proRatedSalaryUnemployment);
    const totalIncomeTax = noticeIncomeTax.plus(unusedLeaveIncomeTax).plus(proRatedSalaryIncomeTax);
    const totalIncomeTaxExemption = noticeIncomeTaxExemption.plus(unusedLeaveIncomeTaxExemption).plus(proRatedSalaryIncomeTaxExemption);
    const totalStampTax = severanceStampTax.plus(noticeStampTax).plus(unusedLeaveStampTax).plus(proRatedSalaryStampTax);
    const totalStampTaxExemption = noticeStampTaxExemption.plus(unusedLeaveStampTaxExemption).plus(proRatedSalaryStampTaxExemption);

    const totalGross = severanceGross.plus(noticeGross).plus(unusedLeaveGross).plus(proRatedSalaryGross);
    const totalNet = severanceNet.plus(noticeNet).plus(unusedLeaveNet).plus(proRatedSalaryNet);

    return {
      tenure,
      dressedGrossWage: dressedWage.round(2).toNumber(),
      benefitsGrossTotal: benefitsGross.round(2).toNumber(),
      // Severance
      severanceEligible,
      severanceBase: severanceBase.round(2).toNumber(),
      isCeilingApplied,
      severanceGross: severanceGross.round(2).toNumber(),
      severanceStampTax: severanceStampTax.round(2).toNumber(),
      severanceNet: severanceNet.round(2).toNumber(),
      // Notice
      noticeWeeks,
      noticeBase: dressedWage.round(2).toNumber(),
      noticeGross: noticeGross.round(2).toNumber(),
      noticeSgk: noticeSgk.round(2).toNumber(),
      noticeUnemployment: noticeUnemployment.round(2).toNumber(),
      noticeIncomeTax: noticeIncomeTax.round(2).toNumber(),
      noticeIncomeTaxExemption: noticeIncomeTaxExemption.round(2).toNumber(),
      noticeStampTax: noticeStampTax.round(2).toNumber(),
      noticeStampTaxExemption: noticeStampTaxExemption.round(2).toNumber(),
      noticeNet: noticeNet.round(2).toNumber(),
      noticeTaxRate,
      // Unused Leave
      unusedLeaveGross: unusedLeaveGross.round(2).toNumber(),
      unusedLeaveSgk: unusedLeaveSgk.round(2).toNumber(),
      unusedLeaveUnemployment: unusedLeaveUnemployment.round(2).toNumber(),
      unusedLeaveIncomeTax: unusedLeaveIncomeTax.round(2).toNumber(),
      unusedLeaveIncomeTaxExemption: unusedLeaveIncomeTaxExemption.round(2).toNumber(),
      unusedLeaveStampTax: unusedLeaveStampTax.round(2).toNumber(),
      unusedLeaveStampTaxExemption: unusedLeaveStampTaxExemption.round(2).toNumber(),
      unusedLeaveNet: unusedLeaveNet.round(2).toNumber(),
      unusedLeaveTaxRate,
      // Pro-rated Salary
      proRatedDays,
      proRatedSalaryGross: proRatedSalaryGross.round(2).toNumber(),
      proRatedSalarySgk: proRatedSalarySgk.round(2).toNumber(),
      proRatedSalaryUnemployment: proRatedSalaryUnemployment.round(2).toNumber(),
      proRatedSalaryIncomeTax: proRatedSalaryIncomeTax.round(2).toNumber(),
      proRatedSalaryIncomeTaxExemption: proRatedSalaryIncomeTaxExemption.round(2).toNumber(),
      proRatedSalaryStampTax: proRatedSalaryStampTax.round(2).toNumber(),
      proRatedSalaryStampTaxExemption: proRatedSalaryStampTaxExemption.round(2).toNumber(),
      proRatedSalaryNet: proRatedSalaryNet.round(2).toNumber(),
      proRatedTaxRate,
      // Totals
      totalSgk: totalSgk.round(2).toNumber(),
      totalUnemployment: totalUnemployment.round(2).toNumber(),
      totalIncomeTax: totalIncomeTax.round(2).toNumber(),
      totalIncomeTaxExemption: totalIncomeTaxExemption.round(2).toNumber(),
      totalStampTax: totalStampTax.round(2).toNumber(),
      totalStampTaxExemption: totalStampTaxExemption.round(2).toNumber(),
      totalGross: totalGross.round(2).toNumber(),
      totalNet: totalNet.round(2).toNumber(),
      newCumulativeTaxBase: runningCumulativeBase.round(2).toNumber(),
      // Flags
      isLeaveApproximate,
      // Period Info
      periodName,
      severanceCeiling: SEVERANCE_CEILING,
      minGrossWage: getCalculationConstants(endDate).MINIMUM_WAGE_GROSS,
    };
  }, [input]);
}
