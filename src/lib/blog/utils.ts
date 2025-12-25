/**
 * Blog utility functions
 */

// Turkish character mapping for slugification
const turkishCharMap: Record<string, string> = {
  ı: "i",
  İ: "i",
  ş: "s",
  Ş: "s",
  ğ: "g",
  Ğ: "g",
  ü: "u",
  Ü: "u",
  ö: "o",
  Ö: "o",
  ç: "c",
  Ç: "c",
};

/**
 * Converts text to URL-friendly slug with Turkish character support
 * @example slugify("Kıdem Tazminatı Nedir?") => "kidem-tazminati-nedir"
 */
export function slugify(text: string): string {
  let result = text.toLowerCase().trim();

  // Replace Turkish characters
  for (const [turkishChar, latinChar] of Object.entries(turkishCharMap)) {
    result = result.replace(new RegExp(turkishChar, "g"), latinChar);
  }

  return result
    .normalize("NFD") // Normalize unicode characters
    .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
    .replace(/[^a-z0-9\s-]/g, "") // Remove non-alphanumeric characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
}

/**
 * Calculates estimated reading time based on word count
 * Average reading speed: 200 words per minute (Turkish)
 * @returns Reading time in minutes (minimum 1)
 */
export function calculateReadingTime(text: string): number {
  const wordsPerMinute = 200;
  const wordCount = text.trim().split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / wordsPerMinute);
  return Math.max(1, readingTime);
}

/**
 * Parses H2 and H3 headers from markdown content for Table of Contents
 * @returns Array of { id, text, level } objects
 */
export function parseHeadings(
  content: string
): Array<{ id: string; text: string; level: number }> {
  const headingRegex = /^(#{2,3})\s+(.+)$/gm;
  const headings: Array<{ id: string; text: string; level: number }> = [];

  let match;
  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length;
    const text = match[2].trim();
    const id = slugify(text);

    headings.push({ id, text, level });
  }

  return headings;
}

/**
 * Formats a date for display in Turkish
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("tr-TR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Generates a date-based path for image storage
 * @example getDatePath() => "2025/12/25"
 */
export function getDatePath(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}/${month}/${day}`;
}
