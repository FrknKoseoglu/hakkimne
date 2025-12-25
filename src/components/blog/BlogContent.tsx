"use client";

import ReactMarkdown from "react-markdown";
import { useEffect } from "react";
import { slugify } from "@/lib/blog/utils";

interface BlogContentProps {
  content: string;
}

export default function BlogContent({ content }: BlogContentProps) {
  // Add IDs to headings for anchor links
  useEffect(() => {
    const article = document.querySelector("article");
    if (!article) return;

    const headings = article.querySelectorAll("h2, h3");
    headings.forEach((heading) => {
      const text = heading.textContent || "";
      const id = slugify(text);
      heading.id = id;
    });
  }, [content]);

  return (
    <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:scroll-mt-20 prose-a:text-[var(--primary)] prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl prose-pre:bg-[var(--muted)] prose-pre:text-[var(--foreground)]">
      <ReactMarkdown
        components={{
          h2: ({ children, ...props }) => (
            <h2 {...props} className="text-2xl font-bold mt-8 mb-4 pb-2 border-b border-[var(--border-light)]">
              {children}
            </h2>
          ),
          h3: ({ children, ...props }) => (
            <h3 {...props} className="text-xl font-semibold mt-6 mb-3">
              {children}
            </h3>
          ),
          p: ({ children, ...props }) => (
            <p {...props} className="leading-relaxed mb-4 text-[var(--foreground)]">
              {children}
            </p>
          ),
          ul: ({ children, ...props }) => (
            <ul {...props} className="list-disc list-inside mb-4 space-y-2">
              {children}
            </ul>
          ),
          ol: ({ children, ...props }) => (
            <ol {...props} className="list-decimal list-inside mb-4 space-y-2">
              {children}
            </ol>
          ),
          blockquote: ({ children, ...props }) => (
            <blockquote {...props} className="border-l-4 border-[var(--primary)] pl-4 italic my-4 text-[var(--text-muted)]">
              {children}
            </blockquote>
          ),
          code: ({ children, className, ...props }) => {
            const isInline = !className;
            if (isInline) {
              return (
                <code {...props} className="bg-[var(--muted)] px-1.5 py-0.5 rounded text-sm font-mono">
                  {children}
                </code>
              );
            }
            return (
              <code {...props} className={className}>
                {children}
              </code>
            );
          },
          img: ({ src, alt, ...props }) => (
            <img
              src={src}
              alt={alt || ""}
              {...props}
              className="rounded-xl shadow-sm my-6"
              loading="lazy"
            />
          ),
          table: ({ children, ...props }) => (
            <div className="overflow-x-auto my-4">
              <table {...props} className="w-full border-collapse border border-[var(--border-light)]">
                {children}
              </table>
            </div>
          ),
          th: ({ children, ...props }) => (
            <th {...props} className="border border-[var(--border-light)] bg-[var(--muted)] px-4 py-2 text-left font-semibold">
              {children}
            </th>
          ),
          td: ({ children, ...props }) => (
            <td {...props} className="border border-[var(--border-light)] px-4 py-2">
              {children}
            </td>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
