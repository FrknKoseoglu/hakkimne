import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { calculateReadingTime } from "@/lib/blog/utils";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/admin/posts/[id] - Get single post
export async function GET(request: NextRequest, context: RouteParams) {
  const { id } = await context.params;
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        author: true,
      },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json({ post });
  } catch (error) {
    console.error("Failed to fetch post:", error);
    return NextResponse.json(
      { error: "Failed to fetch post" },
      { status: 500 }
    );
  }
}

// PUT /api/admin/posts/[id] - Update post
export async function PUT(request: NextRequest, context: RouteParams) {
  const { id } = await context.params;
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      title,
      slug,
      content,
      excerpt,
      coverImage,
      ctaType,
      authorId,
      published,
    } = body;

    // Check if post exists
    const existingPost = await prisma.post.findUnique({
      where: { id },
    });

    if (!existingPost) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Check if slug is taken by another post
    if (slug && slug !== existingPost.slug) {
      const slugExists = await prisma.post.findUnique({
        where: { slug },
      });

      if (slugExists) {
        return NextResponse.json(
          { error: "Bu slug zaten kullanılıyor" },
          { status: 400 }
        );
      }
    }

    // Calculate reading time if content changed
    const readingTime = content
      ? calculateReadingTime(content)
      : existingPost.readingTime;

    // Determine publishedAt
    let publishedAt = existingPost.publishedAt;
    if (published && !existingPost.published) {
      publishedAt = new Date();
    } else if (!published) {
      publishedAt = null;
    }

    // Update post
    const post = await prisma.post.update({
      where: { id },
      data: {
        title: title ?? existingPost.title,
        slug: slug ?? existingPost.slug,
        content: content ?? existingPost.content,
        excerpt: excerpt !== undefined ? excerpt : existingPost.excerpt,
        coverImage: coverImage !== undefined ? coverImage : existingPost.coverImage,
        ctaType: ctaType ?? existingPost.ctaType,
        authorId: authorId ?? existingPost.authorId,
        published: published ?? existingPost.published,
        publishedAt,
        readingTime,
      },
      include: {
        author: {
          select: { name: true },
        },
      },
    });

    return NextResponse.json({ post });
  } catch (error) {
    console.error("Failed to update post:", error);
    return NextResponse.json(
      { error: "Failed to update post" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/posts/[id] - Delete post
export async function DELETE(request: NextRequest, context: RouteParams) {
  const { id } = await context.params;
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const post = await prisma.post.findUnique({
      where: { id },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    await prisma.post.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete post:", error);
    return NextResponse.json(
      { error: "Failed to delete post" },
      { status: 500 }
    );
  }
}
