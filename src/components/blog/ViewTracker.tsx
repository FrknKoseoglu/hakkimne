"use client";

import { useEffect, useRef } from "react";

interface ViewTrackerProps {
  slug: string;
  published: boolean;
}

/**
 * Client-side component to track blog post views.
 * Fires once per page load for published posts.
 */
export function ViewTracker({ slug, published }: ViewTrackerProps) {
  const tracked = useRef(false);

  useEffect(() => {
    // Only track published posts, and only once per component mount
    if (!published || tracked.current) return;
    
    tracked.current = true;

    // Fire and forget - don't block rendering
    fetch(`/api/posts/${slug}/view`, {
      method: "POST",
    }).catch(() => {
      // Silently fail - view tracking is non-critical
    });
  }, [slug, published]);

  // This component renders nothing - it's just for side effects
  return null;
}
