import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Rate limiting simple in-memory store (for basic spam protection)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX = 3; // Max 3 submissions per minute per IP

// Validation schema with strict rules
const contactSchema = z.object({
  name: z
    .string()
    .min(2, "İsim en az 2 karakter olmalı")
    .max(100, "İsim çok uzun")
    .regex(/^[a-zA-ZğüşıöçĞÜŞİÖÇ\s]+$/, "İsim sadece harf içermeli"),
  email: z
    .string()
    .email("Geçerli bir e-posta girin")
    .max(255, "E-posta çok uzun"),
  messageType: z.enum(["COMPLAINT", "SUGGESTION", "OTHER"]),
  feature: z.enum([
    "SEVERANCE_CALC",
    "UNEMPLOYMENT_CALC",
    "BEDELLI_CALC",
    "OVERTIME_CALC",
    "SGK_CODES",
    "BLOG",
    "OTHER",
  ]),
  message: z
    .string()
    .min(10, "Mesaj en az 10 karakter olmalı")
    .max(2000, "Mesaj çok uzun"),
  // Honeypot field - should be empty
  website: z.string().max(0).optional(),
  // Timestamp for timing check
  formLoadTime: z.number(),
});

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0].trim() : "unknown";
  return ip;
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitStore.get(ip);

  if (!record || now > record.resetTime) {
    rateLimitStore.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return false;
  }

  if (record.count >= RATE_LIMIT_MAX) {
    return true;
  }

  record.count++;
  return false;
}

export async function POST(request: NextRequest) {
  try {
    const clientIp = getClientIp(request);
    const userAgent = request.headers.get("user-agent") || "";

    // Rate limiting check
    if (isRateLimited(clientIp)) {
      return NextResponse.json(
        { error: "Çok fazla istek gönderdiniz. Lütfen bekleyin." },
        { status: 429 }
      );
    }

    const body = await request.json();

    // Validate with Zod
    const result = contactSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Geçersiz form verisi", details: result.error.flatten() },
        { status: 400 }
      );
    }

    const { name, email, messageType, feature, message, website, formLoadTime } =
      result.data;

    // Honeypot check - if website field is filled, it's a bot
    if (website && website.length > 0) {
      // Silently accept but don't save (deceive bots)
      return NextResponse.json({ success: true });
    }

    // Timing check - form must be open for at least 2 seconds
    const now = Date.now();
    if (now - formLoadTime < 2000) {
      return NextResponse.json(
        { error: "Form çok hızlı gönderildi. Lütfen tekrar deneyin." },
        { status: 400 }
      );
    }

    // Save to database
    await prisma.contactMessage.create({
      data: {
        name,
        email,
        messageType,
        feature,
        message,
        ipAddress: clientIp,
        userAgent: userAgent.slice(0, 500), // Limit user agent length
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Bir hata oluştu. Lütfen tekrar deneyin." },
      { status: 500 }
    );
  }
}
