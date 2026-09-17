"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Post } from "@/lib/posts";
import { getPostCoverImage } from "@/lib/images";

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// Client-side search + category filter over the already-fetched post list —
// structurally mirrors the SpanishRidingSchoolTour reference's BlogExplorer,
// in the site's own navy/coral/sand palette.
export default function BlogExplorer({ posts }: { posts: Post[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");

  const categories = useMemo(() => {
    const set = new Set(posts.map((p) => p.category || "Cruise Tips"));
    return ["All", ...Array.from(set)];
  }, [posts]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return posts.filter((post) => {
      const matchesCategory = category === "All" || (post.category || "Cruise Tips") === category;
      const matchesQuery =
        !q ||
        post.title.toLowerCase().includes(q) ||
        (post.excerpt || "").toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [posts, query, category]);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="font-display text-lg font-bold text-miami-navy">All Articles</h2>
        <span className="text-xs text-miami-gray">
          {filtered.length} {filtered.length === 1 ? "article" : "articles"}
        </span>
      </div>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search articles…"
          className="input sm:max-w-xs"
        />
        {categories.length > 2 && (
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCategory(c)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                  category === c
                    ? "bg-miami-navy text-white"
                    : "bg-miami-mist/60 text-miami-gray hover:bg-miami-mist"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        )}
      </div>

      {filtered.length === 0 ? (
        <p className="mt-6 rounded-2xl border border-dashed border-miami-mist p-8 text-center text-sm text-miami-gray">
          No articles match your search.
        </p>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group flex flex-col overflow-hidden rounded-2xl border border-miami-mist bg-white transition-shadow hover:shadow-lg"
            >
              <div className="relative h-40 w-full overflow-hidden">
                <Image
                  src={getPostCoverImage(post)}
                  alt={post.cover_image_alt || post.title}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold text-miami-navy">
                  {post.category || "Cruise Tips"}
                </span>
              </div>
              <div className="flex flex-1 flex-col p-5">
                <div className="text-xs text-miami-gray">{formatDate(post.created_at)}</div>
                <h3 className="mt-1 font-display text-base font-bold leading-snug text-miami-navy">
                  {post.title}
                </h3>
                <p className="mt-2 line-clamp-3 flex-1 text-sm text-miami-gray">{post.excerpt}</p>
                <span className="mt-3 text-sm font-semibold text-miami-navy group-hover:text-miami-gold">
                  Read More »
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
