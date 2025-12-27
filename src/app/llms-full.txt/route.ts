import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sgkCodes } from "@/lib/sgk-codes";

export const dynamic = "force-dynamic";
export const revalidate = 3600; // Revalidate every hour

export async function GET() {
  // Static content: Calculation methodologies and data sources
  const staticContent = `# Hakkım Ne? - Full Context & Documentation

## 1. Calculation Methodologies (Hesaplama Mantığı)

### A. Severance Pay (Kıdem Tazminatı)
- **Basis:** Gross Salary (Brüt Maaş) + Regular Cash/Non-Cash Benefits (Yol, Yemek, Prim).
- **Formula:** (Service Years * Gross Salary).
- **Ceiling (Tavan):** Capped at the official semi-annual ceiling (e.g., 2025 Jan-Jun).
- **Tax:** Only Stamp Tax (Damga Vergisi) is deducted. No Income Tax.

### B. Unemployment Benefits (İşsizlik Maaşı)
- **Eligibility:** 
  1. Terminated not by own fault (SGK codes matter).
  2. Last 120 days continuous service.
  3. Min 600 days premium in last 3 years.
- **Limits:** Min 40% of Gross Minimum Wage, Max 80% of Gross Minimum Wage.

### C. Paid Military Service (Bedelli Askerlik)
- **Base Fee:** 240,000 Indicator * Civil Servant Coefficient (Memur Maaş Katsayısı).
- **Penalty (Yoklama Kaçağı):** Additional monthly fee based on evasion duration.
- **Rule:** "Month or fraction thereof" (Ay ve kesri) rule applies. 1 day late counts as 1 month penalty.

### D. Overtime Pay (Fazla Mesai Ücreti)
- **Hourly Rate:** Monthly Salary / 225 hours.
- **Overtime Rate:** Hourly Rate × 1.5 (50% increase for hours over 45/week).
- **Holiday Rate:** Monthly Salary / 30 (1 extra day's wage for national holidays).
- **Yearly Limit:** Maximum 270 hours of overtime per year requires written consent.

`;

  // Dynamic content: Fetch latest blog posts
  let blogContent = "## 2. Latest Blog Posts & Guides\n\n";

  try {
    const posts = await prisma.post.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
      take: 20,
      select: {
        title: true,
        slug: true,
        excerpt: true,
      },
    });

    if (posts.length > 0) {
      for (const post of posts) {
        const excerpt = post.excerpt ? `: ${post.excerpt}` : "";
        blogContent += `- [${post.title}](https://www.hakkimne.com/blog/${post.slug})${excerpt}\n`;
      }
    } else {
      blogContent += "No blog posts available yet.\n";
    }
  } catch (error) {
    console.error("Failed to fetch blog posts for llms-full.txt:", error);
    blogContent += "Blog posts temporarily unavailable.\n";
  }

  blogContent += "\n";

  // Data sources section
  const dataSourcesContent = `## 3. Data Sources & Legal References
- 4857 Sayılı İş Kanunu (Turkish Labor Law)
- 4447 Sayılı İşsizlik Sigortası Kanunu (Unemployment Insurance Law)
- 7179 Sayılı Askeralma Kanunu (Military Service Law)
- SGK (Social Security Institution) Official Circulars
- Official Gazette (Resmi Gazete)
- Ministry of Treasury and Finance Coefficients

`;

  // SGK Codes section - concise format with links
  let sgkCodesContent = "## 4. SGK Termination Codes Reference\n\n";
  
  for (const code of sgkCodes) {
    const severance = code.severancePay ? "VAR" : "YOK";
    const notice = code.noticePay ? "VAR" : "YOK";
    
    sgkCodesContent += `- [Kod ${code.code}] ${code.title} | Kıdem: ${severance} | İhbar: ${notice} | Detay: https://www.hakkimne.com/sgk-cikis-kodlari/${code.slug}\n`;
  }

  sgkCodesContent += "\n";

  // Footer
  const footer = `*Last Updated: ${new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}*\n`;

  const fullContent = staticContent + blogContent + dataSourcesContent + sgkCodesContent + footer;

  return new NextResponse(fullContent, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
