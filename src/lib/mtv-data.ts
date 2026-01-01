// 2026 MTV Veri Modülü - Enhanced with Matrah Thresholds
// Artış oranı: %18.95 (Cumhurbaşkanı Kararı)

export const MTV_YEAR = 2026;

// Helper functions
export function getAgeLabel(age: number): string {
  if (age <= 3) return "1-3 yaş";
  if (age <= 6) return "4-6 yaş";
  if (age <= 11) return "7-11 yaş";
  if (age <= 15) return "12-15 yaş";
  return "16 yaş ve üstü";
}

export function getAgeIndex(age: number): number {
  if (age <= 3) return 0;
  if (age <= 6) return 1;
  if (age <= 11) return 2;
  if (age <= 15) return 3;
  return 4;
}

// Matrah threshold ranges by engine size (2026, based on 2025 * 1.1895)
export const MATRAH_THRESHOLDS = {
  "0-1300": [
    { label: "≤309.159 TL (Düşük)", max: 309159, rates: [6066, 4247, 2426, 1819, 667] },
    { label: "309.160 - 541.584 TL (Orta)", max: 541584, rates: [6667, 4668, 2665, 1999, 733] },
    { label: ">541.584 TL (Yüksek)", max: Infinity, rates: [7282, 5096, 2911, 2182, 800] },
  ],
  "1301-1600": [
    { label: "≤309.159 TL (Düşük)", max: 309159, rates: [10567, 7926, 4545, 3283, 1262] },
    { label: "309.160 - 541.584 TL (Orta)", max: 541584, rates: [11629, 8721, 5001, 3613, 1389] },
    { label: ">541.584 TL (Yüksek)", max: Infinity, rates: [12689, 9517, 5456, 3942, 1515] },
  ],
  "1601-1800": [
    { label: "≤972.860 TL (Standart)", max: 972860, rates: [20542, 16064, 9451, 5744, 2221] },
    { label: ">972.860 TL (Lüks)", max: Infinity, rates: [22409, 17525, 10309, 6265, 2424] },
  ],
  "1801-2000": [
    { label: "≤1.220.540 TL (Standart)", max: 1220540, rates: [32355, 24937, 14699, 8719, 3441] },
    { label: ">1.220.540 TL (Lüks)", max: Infinity, rates: [35296, 27205, 16035, 9511, 3753] },
  ],
  "2001-2500": [
    { label: "≤1.220.540 TL (Standart)", max: 1220540, rates: [48532, 35218, 22002, 13243, 5243] },
    { label: ">1.220.540 TL (Lüks)", max: Infinity, rates: [52945, 38420, 24003, 14447, 5720] },
  ],
  "2501+": [
    { label: "Tüm Araçlar", max: Infinity, rates: [58210, 50632, 31317, 16805, 6157] },
  ],
} as const;

// Pre-2018 Tariff (matrah yok)
export const CAR_PRE_2018_TARIFF = {
  "0-1300": [5750, 4025, 2299, 1724, 632],
  "1301-1600": [10005, 7502, 4305, 3110, 1195],
  "1601-1800": [17683, 13837, 8146, 4945, 1913],
  "1801-2000": [27824, 21453, 12648, 7502, 2962],
  "2001-2500": [41740, 30303, 18931, 11394, 4509],
  "2501-3000": [58210, 50632, 31317, 16805, 6157],
  "3001-3500": [88657, 79731, 47851, 23880, 8719],
  "3501-4000": [139396, 120295, 70830, 31317, 12513],
  "4001+": [228143, 171106, 101321, 45362, 17926],
} as const;

// Motorcycle Tariff
export const MOTORCYCLE_TARIFF = {
  "0-100": [0, 0, 0],
  "101-250": [813, 608, 335],
  "251-650": [1679, 1262, 813],
  "651-1200": [4339, 2736, 1262],
  "1201+": [10515, 6940, 4339],
} as const;

// Minibüs (Age: 1-6, 7-15, 16+)
export const MINIBUS_TARIFF = [2532, 1679, 813];

// Panelvan
export const PANELVAN_TARIFF = {
  "0-1900": [3377, 2109, 1262],
  "1901+": [5091, 3377, 2109],
} as const;

// Otobüs (seats based)
export const BUS_TARIFF = {
  "0-25": [6407, 3833, 2532],
  "26-35": [7687, 6407, 3833],
  "36-45": [8550, 7258, 4261],
  "46+": [10260, 8550, 6407],
} as const;

// Kamyonet (weight based)
export const TRUCK_TARIFF = {
  "0-1500": [2279, 1515, 755],
  "1501-3500": [4598, 2697, 1515],
  "3501-5000": [6903, 5742, 3441],
  "5001-10000": [7665, 6512, 4598],
  "10001-20000": [9205, 7665, 5742],
  "20001+": [11511, 9205, 6903],
} as const;

// Helper to get engine category key
export function getEngineCategoryKey(cc: number): string {
  if (cc <= 1300) return "0-1300";
  if (cc <= 1600) return "1301-1600";
  if (cc <= 1800) return "1601-1800";
  if (cc <= 2000) return "1801-2000";
  if (cc <= 2500) return "2001-2500";
  if (cc <= 3000) return "2501-3000";
  if (cc <= 3500) return "3001-3500";
  if (cc <= 4000) return "3501-4000";
  return "4001+";
}

// Get matrah options for a given engine size
export function getMatrahOptions(cc: number) {
  if (cc <= 1300) return MATRAH_THRESHOLDS["0-1300"];
  if (cc <= 1600) return MATRAH_THRESHOLDS["1301-1600"];
  if (cc <= 1800) return MATRAH_THRESHOLDS["1601-1800"];
  if (cc <= 2000) return MATRAH_THRESHOLDS["1801-2000"];
  if (cc <= 2500) return MATRAH_THRESHOLDS["2001-2500"];
  return MATRAH_THRESHOLDS["2501+"];
}

// Taksit bilgileri
export const MTV_INSTALLMENTS = {
  first: { period: "1. Taksit", months: "Ocak", deadline: "31 Ocak 2026" },
  second: { period: "2. Taksit", months: "Temmuz", deadline: "31 Temmuz 2026" },
} as const;

export const BANK_CAMPAIGNS = [
  { bank: "Garanti BBVA", card: "Bonus", installments: 3, period: "1-31 Ocak 2026" },
  { bank: "İş Bankası", card: "Maximum", installments: 3, period: "1-31 Ocak 2026" },
  { bank: "Halkbank", card: "Bankkart", installments: 4, period: "1 Ocak - 6 Şubat 2026" },
  { bank: "QNB Finansbank", card: "CardFinans", installments: 3, period: "Ocak 2026" },
] as const;

export const PAYMENT_CHANNELS = [
  { name: "GİB Dijital Vergi Dairesi", url: "https://dijital.gib.gov.tr" },
  { name: "e-Devlet", url: "https://www.turkiye.gov.tr" },
  { name: "Banka ATM'leri", url: null },
  { name: "Banka Mobil Uygulamaları", url: null },
  { name: "Vergi Dairesi", url: null },
] as const;

export const MTV_INFO = {
  lateFeeRate: 1.4,
  exemptions: [
    "0-100 cc arası motorlardan MTV alınmaz",
    "Çalınan araçların tescil kayıtları silindiğinde muafiyet uygulanır",
    "Elektrikli araçlar benzinli araçların 1/4'ü kadar MTV öder",
  ],
  importantNotes: [
    "MTV borcu olan araçlar satılamaz",
    "Ödeme yapılmadan araç muayenesi yaptırılamaz",
  ],
} as const;
