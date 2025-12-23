export interface FinancialPeriod {
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
  minGrossWage: number;
  severanceCeiling: number;
  taxBrackets: { limit: number; rate: number }[];
}

export const FINANCIAL_HISTORY: FinancialPeriod[] = [
  // --- 2025 ---
  {
    startDate: '2025-07-01', endDate: '2025-12-31',
    minGrossWage: 26005.50,
    severanceCeiling: 53919.68,
    taxBrackets: [
      { limit: 158000, rate: 0.15 }, { limit: 330000, rate: 0.20 },
      { limit: 800000, rate: 0.27 }, { limit: 4300000, rate: 0.35 }, { limit: Infinity, rate: 0.40 }
    ]
  },
  {
    startDate: '2025-01-01', endDate: '2025-06-30',
    minGrossWage: 26005.50,
    severanceCeiling: 46200.00,
    taxBrackets: [
      { limit: 158000, rate: 0.15 }, { limit: 330000, rate: 0.20 },
      { limit: 800000, rate: 0.27 }, { limit: 4300000, rate: 0.35 }, { limit: Infinity, rate: 0.40 }
    ]
  },
  // --- 2024 ---
  {
    startDate: '2024-07-01', endDate: '2024-12-31',
    minGrossWage: 20002.50,
    severanceCeiling: 41828.42,
    taxBrackets: [
      { limit: 110000, rate: 0.15 }, { limit: 230000, rate: 0.20 },
      { limit: 580000, rate: 0.27 }, { limit: 3000000, rate: 0.35 }, { limit: Infinity, rate: 0.40 }
    ]
  },
  {
    startDate: '2024-01-01', endDate: '2024-06-30',
    minGrossWage: 20002.50,
    severanceCeiling: 35058.58,
    taxBrackets: [
      { limit: 110000, rate: 0.15 }, { limit: 230000, rate: 0.20 },
      { limit: 580000, rate: 0.27 }, { limit: 3000000, rate: 0.35 }, { limit: Infinity, rate: 0.40 }
    ]
  },
  // --- 2023 ---
  {
    startDate: '2023-07-01', endDate: '2023-12-31',
    minGrossWage: 13414.50,
    severanceCeiling: 23489.83,
    taxBrackets: [
      { limit: 70000, rate: 0.15 }, { limit: 150000, rate: 0.20 },
      { limit: 370000, rate: 0.27 }, { limit: 1900000, rate: 0.35 }, { limit: Infinity, rate: 0.40 }
    ]
  },
  {
    startDate: '2023-01-01', endDate: '2023-06-30',
    minGrossWage: 10008.00,
    severanceCeiling: 19982.83,
    taxBrackets: [
      { limit: 70000, rate: 0.15 }, { limit: 150000, rate: 0.20 },
      { limit: 370000, rate: 0.27 }, { limit: 1900000, rate: 0.35 }, { limit: Infinity, rate: 0.40 }
    ]
  },
  // --- 2022 ---
  {
    startDate: '2022-07-01', endDate: '2022-12-31',
    minGrossWage: 6471.00,
    severanceCeiling: 15371.40,
    taxBrackets: [
      { limit: 32000, rate: 0.15 }, { limit: 70000, rate: 0.20 },
      { limit: 170000, rate: 0.27 }, { limit: 880000, rate: 0.35 }, { limit: Infinity, rate: 0.40 }
    ]
  },
  {
    startDate: '2022-01-01', endDate: '2022-06-30',
    minGrossWage: 5004.00,
    severanceCeiling: 10848.59,
    taxBrackets: [
      { limit: 32000, rate: 0.15 }, { limit: 70000, rate: 0.20 },
      { limit: 170000, rate: 0.27 }, { limit: 880000, rate: 0.35 }, { limit: Infinity, rate: 0.40 }
    ]
  },
  // --- 2021 ---
  {
    startDate: '2021-07-01', endDate: '2021-12-31',
    minGrossWage: 3577.50,
    severanceCeiling: 8284.51,
    taxBrackets: [{ limit: 24000, rate: 0.15 }, { limit: 53000, rate: 0.20 }, { limit: 130000, rate: 0.27 }, { limit: 650000, rate: 0.35 }, { limit: Infinity, rate: 0.40 }]
  },
  {
    startDate: '2021-01-01', endDate: '2021-06-30',
    minGrossWage: 3577.50,
    severanceCeiling: 7638.96,
    taxBrackets: [{ limit: 24000, rate: 0.15 }, { limit: 53000, rate: 0.20 }, { limit: 130000, rate: 0.27 }, { limit: 650000, rate: 0.35 }, { limit: Infinity, rate: 0.40 }]
  },
  // --- 2020 ---
  {
    startDate: '2020-07-01', endDate: '2020-12-31',
    minGrossWage: 2943.00,
    severanceCeiling: 7117.17,
    taxBrackets: [{ limit: 22000, rate: 0.15 }, { limit: 49000, rate: 0.20 }, { limit: 120000, rate: 0.27 }, { limit: 600000, rate: 0.35 }, { limit: Infinity, rate: 0.40 }]
  },
  {
    startDate: '2020-01-01', endDate: '2020-06-30',
    minGrossWage: 2943.00,
    severanceCeiling: 6730.15,
    taxBrackets: [{ limit: 22000, rate: 0.15 }, { limit: 49000, rate: 0.20 }, { limit: 120000, rate: 0.27 }, { limit: 600000, rate: 0.35 }, { limit: Infinity, rate: 0.40 }]
  },
  // --- 2019 ---
  {
    startDate: '2019-07-01', endDate: '2019-12-31',
    minGrossWage: 2558.40,
    severanceCeiling: 6379.86,
    taxBrackets: [{ limit: 18000, rate: 0.15 }, { limit: 40000, rate: 0.20 }, { limit: 98000, rate: 0.27 }, { limit: 500000, rate: 0.35 }, { limit: Infinity, rate: 0.40 }]
  },
  {
    startDate: '2019-01-01', endDate: '2019-06-30',
    minGrossWage: 2558.40,
    severanceCeiling: 6017.60,
    taxBrackets: [{ limit: 18000, rate: 0.15 }, { limit: 40000, rate: 0.20 }, { limit: 98000, rate: 0.27 }, { limit: 500000, rate: 0.35 }, { limit: Infinity, rate: 0.40 }]
  },
  // --- 2018 ---
  {
    startDate: '2018-07-01', endDate: '2018-12-31',
    minGrossWage: 2029.50,
    severanceCeiling: 5434.42,
    taxBrackets: [{ limit: 14800, rate: 0.15 }, { limit: 34000, rate: 0.20 }, { limit: 80000, rate: 0.27 }, { limit: Infinity, rate: 0.35 }]
  },
  {
    startDate: '2018-01-01', endDate: '2018-06-30',
    minGrossWage: 2029.50,
    severanceCeiling: 5001.76,
    taxBrackets: [{ limit: 14800, rate: 0.15 }, { limit: 34000, rate: 0.20 }, { limit: 80000, rate: 0.27 }, { limit: Infinity, rate: 0.35 }]
  },
  // --- 2017 ---
  {
    startDate: '2017-07-01', endDate: '2017-12-31',
    minGrossWage: 1777.50,
    severanceCeiling: 4732.48,
    taxBrackets: [{ limit: 13000, rate: 0.15 }, { limit: 30000, rate: 0.20 }, { limit: 70000, rate: 0.27 }, { limit: Infinity, rate: 0.35 }]
  },
  {
    startDate: '2017-01-01', endDate: '2017-06-30',
    minGrossWage: 1777.50,
    severanceCeiling: 4426.16,
    taxBrackets: [{ limit: 13000, rate: 0.15 }, { limit: 30000, rate: 0.20 }, { limit: 70000, rate: 0.27 }, { limit: Infinity, rate: 0.35 }]
  },
  // --- 2016 ---
  {
    startDate: '2016-07-01', endDate: '2016-12-31',
    minGrossWage: 1647.00,
    severanceCeiling: 4297.21,
    taxBrackets: [{ limit: 12600, rate: 0.15 }, { limit: 30000, rate: 0.20 }, { limit: 69000, rate: 0.27 }, { limit: Infinity, rate: 0.35 }]
  },
  {
    startDate: '2016-01-01', endDate: '2016-06-30',
    minGrossWage: 1647.00,
    severanceCeiling: 4092.53,
    taxBrackets: [{ limit: 12600, rate: 0.15 }, { limit: 30000, rate: 0.20 }, { limit: 69000, rate: 0.27 }, { limit: Infinity, rate: 0.35 }]
  },
  // --- 2015 ---
  {
    startDate: '2015-07-01', endDate: '2015-12-31',
    minGrossWage: 1273.50,
    severanceCeiling: 3709.98,
    taxBrackets: [{ limit: 12000, rate: 0.15 }, { limit: 29000, rate: 0.20 }, { limit: 66000, rate: 0.27 }, { limit: Infinity, rate: 0.35 }]
  },
  {
    startDate: '2015-01-01', endDate: '2015-06-30',
    minGrossWage: 1201.50,
    severanceCeiling: 3541.37,
    taxBrackets: [{ limit: 12000, rate: 0.15 }, { limit: 29000, rate: 0.20 }, { limit: 66000, rate: 0.27 }, { limit: Infinity, rate: 0.35 }]
  },
  // --- 2014 ---
  {
    startDate: '2014-07-01', endDate: '2014-12-31',
    minGrossWage: 1134.00,
    severanceCeiling: 3438.22,
    taxBrackets: [{ limit: 11000, rate: 0.15 }, { limit: 27000, rate: 0.20 }, { limit: 60000, rate: 0.27 }, { limit: Infinity, rate: 0.35 }]
  },
  {
    startDate: '2014-01-01', endDate: '2014-06-30',
    minGrossWage: 1071.00,
    severanceCeiling: 3254.44,
    taxBrackets: [{ limit: 11000, rate: 0.15 }, { limit: 27000, rate: 0.20 }, { limit: 60000, rate: 0.27 }, { limit: Infinity, rate: 0.35 }]
  },
  // --- 2013 ---
  {
    startDate: '2013-07-01', endDate: '2013-12-31',
    minGrossWage: 1021.50,
    severanceCeiling: 3129.25,
    taxBrackets: [{ limit: 10700, rate: 0.15 }, { limit: 26000, rate: 0.20 }, { limit: 60000, rate: 0.27 }, { limit: Infinity, rate: 0.35 }]
  },
  {
    startDate: '2013-01-01', endDate: '2013-06-30',
    minGrossWage: 978.60,
    severanceCeiling: 3033.98,
    taxBrackets: [{ limit: 10700, rate: 0.15 }, { limit: 26000, rate: 0.20 }, { limit: 60000, rate: 0.27 }, { limit: Infinity, rate: 0.35 }]
  },
  // --- 2012 ---
  {
    startDate: '2012-07-01', endDate: '2012-12-31',
    minGrossWage: 940.50,
    severanceCeiling: 3033.98,
    taxBrackets: [{ limit: 10000, rate: 0.15 }, { limit: 25000, rate: 0.20 }, { limit: 58000, rate: 0.27 }, { limit: Infinity, rate: 0.35 }]
  },
  {
    startDate: '2012-01-01', endDate: '2012-06-30',
    minGrossWage: 886.50,
    severanceCeiling: 2917.27,
    taxBrackets: [{ limit: 10000, rate: 0.15 }, { limit: 25000, rate: 0.20 }, { limit: 58000, rate: 0.27 }, { limit: Infinity, rate: 0.35 }]
  },
  // --- 2011 ---
  {
    startDate: '2011-07-01', endDate: '2011-12-31',
    minGrossWage: 837.00,
    severanceCeiling: 2731.85,
    taxBrackets: [{ limit: 9400, rate: 0.15 }, { limit: 23000, rate: 0.20 }, { limit: 53000, rate: 0.27 }, { limit: Infinity, rate: 0.35 }]
  },
  {
    startDate: '2011-01-01', endDate: '2011-06-30',
    minGrossWage: 796.50,
    severanceCeiling: 2623.23,
    taxBrackets: [{ limit: 9400, rate: 0.15 }, { limit: 23000, rate: 0.20 }, { limit: 53000, rate: 0.27 }, { limit: Infinity, rate: 0.35 }]
  },
  // --- 2010 ---
  {
    startDate: '2010-07-01', endDate: '2010-12-31',
    minGrossWage: 760.50,
    severanceCeiling: 2517.01,
    taxBrackets: [{ limit: 8800, rate: 0.15 }, { limit: 22000, rate: 0.20 }, { limit: 50000, rate: 0.27 }, { limit: Infinity, rate: 0.35 }]
  },
  {
    startDate: '2010-01-01', endDate: '2010-06-30',
    minGrossWage: 729.00,
    severanceCeiling: 2427.04,
    taxBrackets: [{ limit: 8800, rate: 0.15 }, { limit: 22000, rate: 0.20 }, { limit: 50000, rate: 0.27 }, { limit: Infinity, rate: 0.35 }]
  },
  // --- 2009 ---
  {
    startDate: '2009-07-01', endDate: '2009-12-31',
    minGrossWage: 693.00,
    severanceCeiling: 2365.16,
    taxBrackets: [{ limit: 8700, rate: 0.15 }, { limit: 22000, rate: 0.20 }, { limit: 50000, rate: 0.27 }, { limit: Infinity, rate: 0.35 }]
  },
  {
    startDate: '2009-01-01', endDate: '2009-06-30',
    minGrossWage: 666.00,
    severanceCeiling: 2260.05,
    taxBrackets: [{ limit: 8700, rate: 0.15 }, { limit: 22000, rate: 0.20 }, { limit: 50000, rate: 0.27 }, { limit: Infinity, rate: 0.35 }]
  },
  // --- 2008 ---
  {
    startDate: '2008-07-01', endDate: '2008-12-31',
    minGrossWage: 638.70,
    severanceCeiling: 2173.19,
    taxBrackets: [{ limit: 7800, rate: 0.15 }, { limit: 19800, rate: 0.20 }, { limit: 44700, rate: 0.27 }, { limit: Infinity, rate: 0.35 }]
  },
  {
    startDate: '2008-01-01', endDate: '2008-06-30',
    minGrossWage: 608.40,
    severanceCeiling: 2087.92,
    taxBrackets: [{ limit: 7800, rate: 0.15 }, { limit: 19800, rate: 0.20 }, { limit: 44700, rate: 0.27 }, { limit: Infinity, rate: 0.35 }]
  },
  // --- 2007 ---
  {
    startDate: '2007-07-01', endDate: '2007-12-31',
    minGrossWage: 585.00,
    severanceCeiling: 2030.19,
    taxBrackets: [{ limit: 7500, rate: 0.15 }, { limit: 19000, rate: 0.20 }, { limit: 43000, rate: 0.27 }, { limit: Infinity, rate: 0.35 }]
  },
  {
    startDate: '2007-01-01', endDate: '2007-06-30',
    minGrossWage: 562.50,
    severanceCeiling: 1960.69,
    taxBrackets: [{ limit: 7500, rate: 0.15 }, { limit: 19000, rate: 0.20 }, { limit: 43000, rate: 0.27 }, { limit: Infinity, rate: 0.35 }]
  },
  // --- 2006 ---
  {
    startDate: '2006-07-01', endDate: '2006-12-31',
    minGrossWage: 531.00,
    severanceCeiling: 1857.44,
    taxBrackets: [{ limit: 7000, rate: 0.15 }, { limit: 18000, rate: 0.20 }, { limit: 40000, rate: 0.27 }, { limit: Infinity, rate: 0.35 }]
  },
  {
    startDate: '2006-01-01', endDate: '2006-06-30',
    minGrossWage: 531.00,
    severanceCeiling: 1774.44,
    taxBrackets: [{ limit: 7000, rate: 0.15 }, { limit: 18000, rate: 0.20 }, { limit: 40000, rate: 0.27 }, { limit: Infinity, rate: 0.35 }]
  },
  // --- 2005 ---
  {
    startDate: '2005-01-01', endDate: '2005-12-31',
    minGrossWage: 488.70,
    severanceCeiling: 1727.15,
    taxBrackets: [{ limit: 6600, rate: 0.15 }, { limit: 15000, rate: 0.20 }, { limit: 30000, rate: 0.25 }, { limit: Infinity, rate: 0.30 }]
  }
];

/**
 * Get financial data for a specific date
 * @param date The date to look up financial data for
 * @returns The financial period data for that date
 */
export const getFinancialData = (date: Date): FinancialPeriod => {
  const targetDateStr = date.toISOString().split('T')[0];
  
  // Find period covering the date
  const period = FINANCIAL_HISTORY.find(p => 
    targetDateStr >= p.startDate && targetDateStr <= p.endDate
  );

  // Fallback 1: If date is in future, return latest (2025 H2)
  if (!period && targetDateStr > FINANCIAL_HISTORY[0].endDate) {
    return FINANCIAL_HISTORY[0];
  }

  // Fallback 2: If date is older than 2005, return oldest (2005)
  if (!period && targetDateStr < FINANCIAL_HISTORY[FINANCIAL_HISTORY.length - 1].startDate) {
    return FINANCIAL_HISTORY[FINANCIAL_HISTORY.length - 1];
  }

  return period!;
};

/**
 * Format period name in Turkish
 * @param period The financial period
 * @returns Formatted string like "2024 2. Yarıyıl"
 */
export const formatPeriodName = (period: FinancialPeriod): string => {
  const year = period.startDate.substring(0, 4);
  const isFirstHalf = period.startDate.includes('-01-01');
  return `${year} ${isFirstHalf ? '1.' : '2.'} Yarıyıl`;
};
