import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface RouteParams {
  params: Promise<{ slug: string }>;
}

// POST /api/posts/[slug]/view - Increment view counter
export async function POST(request: NextRequest, context: RouteParams) {
  const { slug } = await context.params;

  try {
    await prisma.post.update({
      where: { slug },
      data: {
        views: { increment: 1 },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to increment views:", error);
    return NextResponse.json(
      { error: "Failed to increment views" },
      { status: 500 }
    );
  }
}
