import { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/blog/utils";
import { Navbar } from "@/components/Navbar";
import { Clock, ChevronRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Blog",
  description: "Kıdem tazminatı, ihbar tazminatı, işçi hakları ve iş hukuku hakkında bilgilendirici yazılar.",
};

async function getPosts() {
  return prisma.post.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      coverImage: true,
      publishedAt: true,
      readingTime: true,
      author: {
        select: {
          name: true,
          avatar: true,
        },
      },
    },
  });
}

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <div className="min-h-screen bg-[var(--background-light)]">
      <Navbar />
      {/* Hero */}
      <section className="bg-gradient-to-br from-[var(--primary)] to-blue-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Blog</h1>
          <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto">
            İş hukuku, çalışan hakları ve tazminat hesaplamaları hakkında güncel ve bilgilendirici içerikler.
          </p>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="container mx-auto px-4 py-12">
        {posts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-[var(--text-muted)] text-lg">
              Henüz yayınlanmış yazı bulunmuyor.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <article
                key={post.id}
                className="group bg-[var(--card)] rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-[var(--border-light)]"
              >
                <Link href={`/blog/${post.slug}`}>
                  {/* Cover Image */}
                  {post.coverImage ? (
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={post.coverImage}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ) : (
                    <div className="aspect-video bg-gradient-to-br from-[var(--primary)] to-blue-700 flex items-center justify-center">
                      <span className="text-white/30 text-6xl font-bold">
                        {post.title.charAt(0)}
                      </span>
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-6">
                    <h2 className="text-xl font-semibold mb-2 group-hover:text-[var(--primary)] transition-colors line-clamp-2">
                      {post.title}
                    </h2>
                    
                    {post.excerpt && (
                      <p className="text-[var(--text-muted)] text-sm mb-4 line-clamp-2">
                        {post.excerpt}
                      </p>
                    )}

                    {/* Meta */}
                    <div className="flex items-center justify-between text-sm text-[var(--text-muted)]">
                      <div className="flex items-center gap-2">
                        {post.author.avatar ? (
                          <img
                            src={post.author.avatar}
                            alt={post.author.name}
                            className="w-6 h-6 rounded-full"
                          />
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-[var(--primary)] text-white flex items-center justify-center text-xs font-medium">
                            {post.author.name.charAt(0)}
                          </div>
                        )}
                        <span>{post.author.name}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          {post.readingTime} dk
                        </span>
                        {post.publishedAt && (
                          <span>{formatDate(post.publishedAt)}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Back to Home */}
      <section className="container mx-auto px-4 pb-12">
        <div className="text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[var(--primary)] hover:underline"
          >
            Tazminat Hesaplamaya Git
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
