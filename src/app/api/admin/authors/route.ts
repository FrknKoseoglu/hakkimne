import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/admin/authors - List all authors
export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const authors = await prisma.author.findMany({
      orderBy: { name: "asc" },
    });

    return NextResponse.json({ authors });
  } catch (error) {
    console.error("Failed to fetch authors:", error);
    return NextResponse.json(
      { error: "Failed to fetch authors" },
      { status: 500 }
    );
  }
}

// POST /api/admin/authors - Create new author
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, bio, avatar, socialLinks } = body;

    if (!name) {
      return NextResponse.json(
        { error: "Name is required" },
        { status: 400 }
      );
    }

    const author = await prisma.author.create({
      data: {
        name,
        bio: bio || null,
        avatar: avatar || null,
        socialLinks: socialLinks || null,
      },
    });

    return NextResponse.json({ author }, { status: 201 });
  } catch (error) {
    console.error("Failed to create author:", error);
    return NextResponse.json(
      { error: "Failed to create author" },
      { status: 500 }
    );
  }
}
