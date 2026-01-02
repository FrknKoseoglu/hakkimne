import { unstable_cache } from 'next/cache';

/**
 * Exchange rates interface
 */
export interface ExchangeRates {
  EUR: number;
  USD: number;
  date: string;
  source: 'TCMB' | 'FALLBACK';
}

/**
 * Fallback rates when TCMB API is unavailable
 */
const FALLBACK_RATES: ExchangeRates = {
  EUR: 38.5,
  USD: 36.5,
  date: new Date().toISOString(),
  source: 'FALLBACK',
};

/**
 * Fetch exchange rates from TCMB XML endpoint
 * @returns Exchange rates for EUR and USD
 */
async function fetchTCMBRates(): Promise<ExchangeRates> {
  try {
    const response = await fetch('https://www.tcmb.gov.tr/kurlar/today.xml', {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      throw new Error(`TCMB API returned ${response.status}`);
    }

    const xmlText = await response.text();

    // Extract date from XML
    const dateMatch = xmlText.match(/Date="(\d{2}\/\d{2}\/\d{4})"/);
    const date = dateMatch ? dateMatch[1] : new Date().toLocaleDateString('en-GB');

    // Extract USD ForexSelling rate
    const usdMatch = xmlText.match(/<Currency[^>]*Code="USD"[^>]*>[\s\S]*?<ForexSelling>([\d.]+)<\/ForexSelling>/);
    const usdRate = usdMatch ? parseFloat(usdMatch[1]) : null;

    // Extract EUR ForexSelling rate
    const eurMatch = xmlText.match(/<Currency[^>]*Code="EUR"[^>]*>[\s\S]*?<ForexSelling>([\d.]+)<\/ForexSelling>/);
    const eurRate = eurMatch ? parseFloat(eurMatch[1]) : null;

    if (!usdRate || !eurRate) {
      throw new Error('Failed to parse USD or EUR rates from TCMB XML');
    }

    return {
      EUR: eurRate,
      USD: usdRate,
      date,
      source: 'TCMB',
    };
  } catch (error) {
    console.error('Error fetching TCMB rates:', error);
    console.warn('Using fallback exchange rates');
    return FALLBACK_RATES;
  }
}

/**
 * Get cached exchange rates from TCMB
 * Cached for 1 hour to minimize API calls
 */
export const getCachedExchangeRates = unstable_cache(
  async () => fetchTCMBRates(),
  ['tcmb-exchange-rates'],
  {
    revalidate: 3600, // 1 hour in seconds
    tags: ['currency', 'tcmb'],
  }
);
