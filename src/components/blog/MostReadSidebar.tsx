import Link from "next/link";
import { TrendingUp, Eye } from "lucide-react";

interface Post {
  id: string;
  title: string;
  slug: string;
  views: number;
}

interface MostReadSidebarProps {
  posts: Post[];
  currentSlug?: string;
}

export default function MostReadSidebar({ posts, currentSlug }: MostReadSidebarProps) {
  // Filter out current post
  const filteredPosts = posts.filter((post) => post.slug !== currentSlug);

  if (filteredPosts.length === 0) return null;

  return (
    <div className="bg-[var(--card)] rounded-xl p-5 shadow-sm border border-[var(--border-light)]">
      <h3 className="font-semibold mb-4 flex items-center gap-2 text-sm uppercase tracking-wide text-[var(--text-muted)]">
        <TrendingUp className="h-4 w-4" />
        En Çok Okunanlar
      </h3>
      <ul className="space-y-3">
        {filteredPosts.map((post, index) => (
          <li key={post.id}>
            <Link
              href={`/blog/${post.slug}`}
              className="group flex items-start gap-3"
            >
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--muted)] text-[var(--text-muted)] text-sm font-medium flex items-center justify-center group-hover:bg-[var(--primary)] group-hover:text-white transition-colors">
                {index + 1}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium line-clamp-2 group-hover:text-[var(--primary)] transition-colors">
                  {post.title}
                </p>
                <span className="text-xs text-[var(--text-muted)] flex items-center gap-1 mt-1">
                  <Eye className="h-3 w-3" />
                  {post.views.toLocaleString("tr-TR")}
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
