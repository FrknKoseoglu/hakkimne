"use client";

import { useMemo } from "react";
import { differenceInDays, differenceInMonths, differenceInYears } from "date-fns";
import Big from "big.js";

// Constants for Turkish Labor Law (2024 H2)
const SEVERANCE_CEILING = 41828.42; // Kıdem tazminatı tavanı
const STAMP_TAX_RATE = 0.00759; // Damga vergisi
const INCOME_TAX_RATE = 0.15; // Gelir vergisi (MVP simplified)

export interface SeveranceInput {
  startDate: Date | null;
  endDate: Date | null;
  grossSalary: number;
  sideBenefits: number;
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
  // Kıdem Tazminatı
  severanceGross: number;
  severanceStampTax: number;
  severanceNet: number;
  severanceBase: number;
  isCeilingApplied: boolean;
  // İhbar Tazminatı
  noticeWeeks: number;
  noticeGross: number;
  noticeIncomeTax: number;
  noticeStampTax: number;
  noticeNet: number;
  // Toplam
  totalNet: number;
}

/**
 * Calculate exact tenure breakdown in years, months, and remaining days
 */
function calculateTenure(startDate: Date, endDate: Date): TenureBreakdown {
  const years = differenceInYears(endDate, startDate);
  
  // Calculate remaining months after full years
  const dateAfterYears = new Date(startDate);
  dateAfterYears.setFullYear(dateAfterYears.getFullYear() + years);
  const months = differenceInMonths(endDate, dateAfterYears);
  
  // Calculate remaining days after full months
  const dateAfterMonths = new Date(dateAfterYears);
  dateAfterMonths.setMonth(dateAfterMonths.getMonth() + months);
  const days = differenceInDays(endDate, dateAfterMonths);
  
  const totalDays = differenceInDays(endDate, startDate);
  
  return { years, months, days, totalDays };
}

/**
 * Determine notice period weeks based on Turkish Labor Law
 * 0-6 months: 2 weeks
 * 6-18 months: 4 weeks
 * 18-36 months: 6 weeks
 * >36 months: 8 weeks
 */
function getNoticeWeeks(totalDays: number): number {
  const months = totalDays / 30; // Approximate months
  
  if (months < 6) return 2;
  if (months < 18) return 4;
  if (months < 36) return 6;
  return 8;
}

/**
 * Custom hook for Turkish Severance (Kıdem) and Notice (İhbar) Pay calculation
 */
export function useSeveranceCalculator(input: SeveranceInput): SeveranceResult | null {
  return useMemo(() => {
    const { startDate, endDate, grossSalary, sideBenefits } = input;
    
    // Validate inputs
    if (!startDate || !endDate || grossSalary <= 0) {
      return null;
    }
    
    if (endDate <= startDate) {
      return null;
    }
    
    // Calculate tenure
    const tenure = calculateTenure(startDate, endDate);
    
    // Calculate base salary for severance
    const rawBase = new Big(grossSalary).plus(sideBenefits);
    const isCeilingApplied = rawBase.gt(SEVERANCE_CEILING);
    const severanceBase = isCeilingApplied 
      ? new Big(SEVERANCE_CEILING) 
      : rawBase;
    
    // === SEVERANCE PAY (Kıdem Tazminatı) ===
    // Formula: (Years * Base) + (Months * Base / 12) + (Days * Base / 365)
    // Only eligible if tenure >= 1 year
    let severanceGross = new Big(0);
    
    if (tenure.years >= 1 || tenure.totalDays >= 365) {
      const yearsComponent = severanceBase.times(tenure.years);
      const monthsComponent = severanceBase.times(tenure.months).div(12);
      const daysComponent = severanceBase.times(tenure.days).div(365);
      
      severanceGross = yearsComponent.plus(monthsComponent).plus(daysComponent);
    }
    
    // Severance tax (only stamp tax)
    const severanceStampTax = severanceGross.times(STAMP_TAX_RATE);
    const severanceNet = severanceGross.minus(severanceStampTax);
    
    // === NOTICE PAY (İhbar Tazminatı) ===
    const noticeWeeks = getNoticeWeeks(tenure.totalDays);
    const dailyWage = new Big(grossSalary).div(30);
    const noticeGross = dailyWage.times(noticeWeeks).times(7);
    
    // Notice tax (income tax + stamp tax)
    const noticeIncomeTax = noticeGross.times(INCOME_TAX_RATE);
    const noticeStampTax = noticeGross.times(STAMP_TAX_RATE);
    const noticeNet = noticeGross.minus(noticeIncomeTax).minus(noticeStampTax);
    
    // Total net
    const totalNet = severanceNet.plus(noticeNet);
    
    return {
      tenure,
      // Severance
      severanceGross: severanceGross.round(2).toNumber(),
      severanceStampTax: severanceStampTax.round(2).toNumber(),
      severanceNet: severanceNet.round(2).toNumber(),
      severanceBase: severanceBase.round(2).toNumber(),
      isCeilingApplied,
      // Notice
      noticeWeeks,
      noticeGross: noticeGross.round(2).toNumber(),
      noticeIncomeTax: noticeIncomeTax.round(2).toNumber(),
      noticeStampTax: noticeStampTax.round(2).toNumber(),
      noticeNet: noticeNet.round(2).toNumber(),
      // Total
      totalNet: totalNet.round(2).toNumber(),
    };
  }, [input.startDate, input.endDate, input.grossSalary, input.sideBenefits]);
}
