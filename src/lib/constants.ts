export const CURRENT_YEAR = new Date().getFullYear();

// Kıdem tazminatı tavan bilgileri
export const SEVERANCE_CEILING = {
  2026: {
    firstHalf: {
      amount: "63.000,00", // PLACEHOLDER - awaiting official announcement
      period: "Ocak-Haziran",
      startDate: new Date("2026-01-01"),
      endDate: new Date("2026-06-30"),
    },
  },
  2025: {
    firstHalf: {
      amount: "46.655,43",
      period: "Ocak-Haziran",
      startDate: new Date("2025-01-01"),
      endDate: new Date("2025-06-30"),
    },
    secondHalf: {
      amount: "53.919,68",
      period: "Temmuz-Aralık",
      startDate: new Date("2025-07-01"),
      endDate: new Date("2025-12-31"),
    },
  },
} as const;

// Mevcut dönemi ve tavan tutarını otomatik belirle
export function getCurrentSeveranceCeiling() {
  const now = new Date();
  const year = now.getFullYear();
  
  if (year === 2026) {
    const currentYearData = SEVERANCE_CEILING[2026];
    
    if (now >= currentYearData.firstHalf.startDate && now <= currentYearData.firstHalf.endDate) {
      return currentYearData.firstHalf;
    }
    // Fall through to 2025 secondHalf for future 2026 H2 (not yet defined)
  }
  
  if (year === 2025) {
    const currentYearData = SEVERANCE_CEILING[2025];
    
    if (now >= currentYearData.firstHalf.startDate && now <= currentYearData.firstHalf.endDate) {
      return currentYearData.firstHalf;
    } else if (now >= currentYearData.secondHalf.startDate && now <= currentYearData.secondHalf.endDate) {
      return currentYearData.secondHalf;
    }
  }
  
  // Varsayılan olarak 2026 birinci yarı verilerini döndür (en güncel)
  return SEVERANCE_CEILING[2026].firstHalf;
}

