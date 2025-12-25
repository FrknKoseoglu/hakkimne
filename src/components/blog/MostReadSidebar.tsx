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
    <div className="bg-[var(--card)] rounded-xl p-4 shadow-sm border border-[var(--border-light)]">
      <h3 className="font-semibold mb-3 flex items-center gap-2 text-xs uppercase tracking-wide text-[var(--text-muted)]">
        <TrendingUp className="h-3 w-3" />
        En Çok Okunanlar
      </h3>
      <ul className="space-y-2">
        {filteredPosts.map((post, index) => (
          <li key={post.id}>
            <Link
              href={`/blog/${post.slug}`}
              className="group flex items-start gap-2"
            >
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[var(--muted)] text-[var(--text-muted)] text-xs font-medium flex items-center justify-center group-hover:bg-[var(--primary)] group-hover:text-white transition-colors">
                {index + 1}
              </span>
              <p className="text-xs font-medium line-clamp-2 group-hover:text-[var(--primary)] transition-colors leading-tight">
                {post.title}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
