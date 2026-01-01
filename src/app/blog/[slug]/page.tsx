import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatDate, parseHeadings } from "@/lib/blog/utils";
import BlogContent from "@/components/blog/BlogContent";
import TableOfContents from "@/components/blog/TableOfContents";
import CtaBox from "@/components/blog/CtaBox";
import AuthorBox from "@/components/blog/AuthorBox";
import MostReadSidebar from "@/components/blog/MostReadSidebar";
import { ViewTracker } from "@/components/blog/ViewTracker";
import { Navbar } from "@/components/Navbar";
import { Clock, ArrowLeft, Eye } from "lucide-react";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ preview?: string }>;
}

async function getPost(slug: string, preview: boolean = false) {
  const post = await prisma.post.findUnique({
    where: { 
      slug,
      ...(preview ? {} : { published: true }),
    },
    include: {
      author: true,
    },
  });

  return post;
}

async function getMostRead() {
  return prisma.post.findMany({
    where: { published: true },
    orderBy: { views: "desc" },
    take: 5,
    select: {
      id: true,
      title: true,
      slug: true,
      views: true,
    },
  });
}

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const { preview } = await searchParams;
  const post = await getPost(slug, preview === 'true');

  if (!post) {
    return { title: "Yazı Bulunamadı" };
  }

  return {
    title: post.title,
    description: post.excerpt || `${post.title} - Hakkım Ne Blog`,
    openGraph: {
      title: post.title,
      description: post.excerpt || undefined,
      type: "article",
      publishedTime: post.publishedAt?.toISOString(),
      images: post.coverImage ? [post.coverImage] : undefined,
    },
  };
}

export default async function BlogPostPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const { preview } = await searchParams;
  const isPreview = preview === 'true';
  
  const [post, mostRead] = await Promise.all([
    getPost(slug, isPreview),
    getMostRead(),
  ]);

  if (!post) {
    notFound();
  }

  const headings = parseHeadings(post.content);

  return (
    <div className="min-h-screen bg-[var(--background-light)]">
      {/* Client-side view tracking */}
      <ViewTracker slug={slug} published={post.published} />
      
      <Navbar />
      
      {/* Preview Banner */}
      {isPreview && !post.published && (
        <div className="bg-yellow-500 text-yellow-900 py-2 px-4 text-center text-sm font-medium">
          📝 Bu yazı henüz yayınlanmadı. Önizleme modundasınız.
        </div>
      )}
      
      {/* Hero */}
      <section className="bg-gradient-to-br from-[var(--primary)] to-blue-700 text-white py-8">
        <div className="max-w-7xl mx-auto px-4">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Blog&apos;a Dön
          </Link>

          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 max-w-4xl">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-white/80">
            {/* Author */}
            <div className="flex items-center gap-2">
              {post.author.avatar ? (
                <img
                  src={post.author.avatar}
                  alt={post.author.name}
                  className="w-8 h-8 rounded-full"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-sm font-medium">
                  {post.author.name.charAt(0)}
                </div>
              )}
              <span>{post.author.name}</span>
            </div>

            <span className="hidden sm:inline">•</span>

            {/* Date */}
            {post.publishedAt && (
              <span>{formatDate(post.publishedAt)}</span>
            )}

            <span className="hidden sm:inline">•</span>

            {/* Reading Time */}
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {post.readingTime} dk okuma
            </span>

            <span className="hidden sm:inline">•</span>

            {/* Views */}
            <span className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              {post.views.toLocaleString("tr-TR")} görüntülenme
            </span>
          </div>
        </div>
      </section>

      {/* Cover Image */}
      {post.coverImage && (
        <div className="container mx-auto px-4 -mt-6">
          <div className="max-w-4xl mx-auto">
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full aspect-video object-cover rounded-xl shadow-lg"
            />
          </div>
        </div>
      )}

      {/* Content Area */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-7xl mx-auto">
          {/* Table of Contents - Sidebar Left (Desktop) */}
          {headings.length > 2 && (
            <aside className="hidden lg:block lg:col-span-2">
              <div className="sticky top-20">
                <TableOfContents headings={headings} />
              </div>
            </aside>
          )}

          {/* Main Content - Wider */}
          <main className={`${headings.length > 2 ? "lg:col-span-8" : "lg:col-span-10"}`}>
            {/* Table of Contents - Mobile */}
            {headings.length > 2 && (
              <div className="lg:hidden mb-8">
                <TableOfContents headings={headings} />
              </div>
            )}

            {/* Article Content */}
            <article className="bg-[var(--card)] rounded-xl p-6 md:p-8 shadow-sm border border-[var(--border-light)]">
              <BlogContent content={post.content} />

              {/* CTA Box */}
              {post.ctaType !== "NONE" && (
                <div className="mt-8 pt-8 border-t border-[var(--border-light)]">
                  <CtaBox ctaType={post.ctaType} />
                </div>
              )}
            </article>

            {/* Author Box */}
            <div className="mt-8">
              <AuthorBox author={post.author} />
            </div>
          </main>

          {/* Sidebar Right */}
          <aside className="hidden lg:block lg:col-span-2">
            <div className="sticky top-20 space-y-6">
              <MostReadSidebar posts={mostRead} currentSlug={slug} />

              {/* CTA Sidebar */}
              {post.ctaType === "NONE" && (
                <CtaBox ctaType="SEVERANCE_CALC" />
              )}
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
