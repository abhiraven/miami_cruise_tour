"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import RichTextEditor from "./RichTextEditor";
import MediaLibraryPicker from "./MediaLibraryPicker";
import { contentToHtml } from "@/lib/post-content";
import type { Post } from "@/lib/posts";

const COVER_COLORS = ["navy", "indigo", "gold", "pearl"];

export interface PostFormProps {
  initialPost?: Post | null;
  postId?: number | string | null;
}

export default function PostForm({ initialPost = null, postId = null }: PostFormProps) {
  const router = useRouter();
  const isEdit = Boolean(postId);

  const [title, setTitle] = useState(initialPost?.title || "");
  const [slug, setSlug] = useState(initialPost?.slug || "");
  const [excerpt, setExcerpt] = useState(initialPost?.excerpt || "");
  const [content, setContent] = useState(contentToHtml(initialPost?.content) || "");
  const [coverColor, setCoverColor] = useState(initialPost?.cover_color || "navy");
  const [category, setCategory] = useState(initialPost?.category || "Cruise Tips");
  const [featured, setFeatured] = useState(Boolean(initialPost?.featured));
  const [seoTitle, setSeoTitle] = useState(initialPost?.seo_title || "");
  const [metaDescription, setMetaDescription] = useState(initialPost?.meta_description || "");
  const [coverImage, setCoverImage] = useState(initialPost?.cover_image || "");
  const [coverImageAlt, setCoverImageAlt] = useState(initialPost?.cover_image_alt || "");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [published, setPublished] = useState(
    initialPost ? Boolean(initialPost.published) : true
  );
  const [noindex, setNoindex] = useState(Boolean(initialPost?.noindex));
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handlePhotoChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setUploading(true);
    setUploadError("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", "posts");
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) {
        setUploadError(data.error || "Upload failed.");
        return;
      }
      setCoverImage(data.url);
    } catch {
      setUploadError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  function isContentEmpty(html: unknown) {
    return !String(html || "").replace(/<[^>]*>/g, "").trim();
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setMessage("");

    if (isContentEmpty(content)) {
      setError("Content can't be empty.");
      return;
    }

    setLoading(true);

    const payload = {
      title,
      slug,
      excerpt,
      content,
      cover_color: coverColor,
      cover_image: coverImage,
      cover_image_alt: coverImageAlt,
      category,
      featured,
      seo_title: seoTitle,
      meta_description: metaDescription,
      published,
      noindex,
    };

    try {
      const res = await fetch(isEdit ? `/api/admin/posts/${postId}` : "/api/admin/posts", {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to save post.");
        return;
      }

      if (isEdit) {
        setMessage("Saved! Your changes are live.");
        router.refresh();
      } else {
        setMessage("Post created!");
        router.replace(`/admin/posts/${data.post.id}/edit`);
        router.refresh();
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="sticky top-0 z-20 -mx-4 sm:-mx-6 px-4 sm:px-6 py-3 bg-miami-pearl/95 backdrop-blur border-b border-miami-mist flex items-center justify-between gap-3">
        <span className={`text-xs ${error ? "text-red-600" : "text-miami-navy/50"}`}>
          {error || message || "Edit any field below, then save."}
        </span>
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center rounded-full bg-miami-navy px-6 py-2.5 text-sm font-bold text-white hover:bg-miami-gold hover:text-miami-navy transition disabled:opacity-60"
          >
            {loading ? "Saving…" : isEdit ? "Save Changes" : "Create Post"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/admin/posts")}
            className="text-sm font-semibold text-miami-navy/60 hover:text-miami-navy"
          >
            Cancel
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-miami-mist bg-miami-pearl/40 p-4 space-y-4">
        <div className="text-xs font-bold uppercase tracking-wide text-miami-navy/50">
          SEO &amp; Search Preview
        </div>

        <div>
          <label className="block text-sm font-medium text-miami-navy mb-1">
            SEO Title{" "}
            <span className="text-miami-navy/40 font-normal">
              (shown in Google &amp; browser tabs — leave blank to use the post title, ~50–60 characters recommended)
            </span>
          </label>
          <input
            type="text"
            value={seoTitle}
            onChange={(e) => setSeoTitle(e.target.value)}
            placeholder={title || "Defaults to the post title"}
            className="w-full rounded-lg border border-miami-mist bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-miami-navy"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-miami-navy mb-1">
            Meta Description{" "}
            <span className="text-miami-navy/40 font-normal">
              (shown under the title in search results — leave blank to use the excerpt, ~150–160 characters recommended)
            </span>
          </label>
          <textarea
            value={metaDescription}
            onChange={(e) => setMetaDescription(e.target.value)}
            rows={2}
            placeholder={excerpt || "Defaults to the excerpt"}
            className="w-full rounded-lg border border-miami-mist bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-miami-navy"
          />
        </div>

        <label className="flex items-start gap-2.5 text-sm font-medium text-miami-navy cursor-pointer">
          <input
            type="checkbox"
            checked={noindex}
            onChange={(e) => {
              const next = e.target.checked;
              const msg = next
                ? "Hide this post from search engines? It will be set to noindex, nofollow."
                : "Make this post visible to search engines again? It will be set to index, follow.";
              if (!window.confirm(msg)) return;
              setNoindex(next);
            }}
            className="mt-0.5 h-4 w-4 rounded border-miami-mist text-miami-navy focus:ring-miami-navy"
          />
          <span>
            Hide this post from search engines (noindex, nofollow)
            <span className="block text-xs font-normal text-miami-navy/40">
              Leave unchecked so Google can index and follow links on this post. Check it to keep it out of search results.
            </span>
          </span>
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium text-miami-navy mb-1">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full rounded-lg border border-miami-mist px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-miami-navy"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-miami-navy mb-1">
          Slug <span className="text-miami-navy/40 font-normal">(leave blank to auto-generate)</span>
        </label>
        <input
          type="text"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          placeholder="miami-sunset-cruise-prices-2026"
          className="w-full rounded-lg border border-miami-mist px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-miami-navy"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-miami-navy mb-1">Excerpt</label>
        <textarea
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          rows={2}
          className="w-full rounded-lg border border-miami-mist px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-miami-navy"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-miami-navy mb-1">Content</label>
        <RichTextEditor value={content} onChange={setContent} uploadType="posts" />
      </div>

      <div>
        <label className="block text-sm font-medium text-miami-navy mb-1">
          Category <span className="text-miami-navy/40 font-normal">(shown as a filter tag on the blog page)</span>
        </label>
        <input
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Cruise Tips"
          className="w-full sm:w-80 rounded-lg border border-miami-mist px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-miami-navy"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-miami-navy mb-1">
          Cover Photo{" "}
          <span className="text-miami-navy/40 font-normal">
            (JPG, PNG, WEBP, or GIF — max 5MB. Falls back to the cover color below if none is uploaded.)
          </span>
        </label>

        {coverImage ? (
          <div className="flex items-start gap-4">
            <img
              src={coverImage}
              alt="Cover preview"
              className="h-28 w-44 rounded-lg border border-miami-mist object-cover"
            />
            <div className="flex flex-col gap-2">
              <label className="inline-flex w-fit cursor-pointer items-center rounded-full border border-miami-mist px-4 py-2 text-xs font-semibold text-miami-navy hover:bg-miami-mist/20 transition">
                {uploading ? "Uploading…" : "Replace Photo"}
                <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={handlePhotoChange} disabled={uploading} className="hidden" />
              </label>
              <button
                type="button"
                onClick={() => setLibraryOpen(true)}
                className="inline-flex w-fit items-center rounded-full border border-miami-mist px-4 py-2 text-xs font-semibold text-miami-navy hover:bg-miami-mist/20 transition"
              >
                Choose from Library
              </button>
              <button
                type="button"
                onClick={() => setCoverImage("")}
                className="text-xs font-semibold text-red-500 hover:text-red-700 text-left"
              >
                Remove Photo
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-start gap-3">
            <label className="flex h-28 w-44 cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-miami-mist text-center text-xs text-miami-navy/50 hover:bg-miami-mist/20 transition">
              {uploading ? (
                "Uploading…"
              ) : (
                <>
                  <span className="text-lg">📷</span>
                  Upload Photo
                </>
              )}
              <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={handlePhotoChange} disabled={uploading} className="hidden" />
            </label>
            <button
              type="button"
              onClick={() => setLibraryOpen(true)}
              className="inline-flex items-center rounded-full border border-miami-mist px-4 py-2 text-xs font-semibold text-miami-navy hover:bg-miami-mist/20 transition"
            >
              Choose from Library
            </button>
          </div>
        )}

        {uploadError && <p className="mt-2 text-sm text-red-600">{uploadError}</p>}

        {libraryOpen && (
          <MediaLibraryPicker
            folder="posts"
            onSelect={(url: string) => setCoverImage(url)}
            onClose={() => setLibraryOpen(false)}
          />
        )}

        {coverImage && (
          <div className="mt-3">
            <label className="block text-sm font-medium text-miami-navy mb-1">
              Cover Photo Alt Text{" "}
              <span className="text-miami-navy/40 font-normal">(for accessibility &amp; SEO)</span>
            </label>
            <input
              type="text"
              value={coverImageAlt}
              onChange={(e) => setCoverImageAlt(e.target.value)}
              placeholder={title || "Defaults to the post title"}
              className="w-full sm:w-96 rounded-lg border border-miami-mist px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-miami-navy"
            />
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-6">
        <div>
          <label className="block text-sm font-medium text-miami-navy mb-1">
            Cover Color <span className="text-miami-navy/40 font-normal">(fallback only)</span>
          </label>
          <select
            value={coverColor}
            onChange={(e) => setCoverColor(e.target.value)}
            className="rounded-lg border border-miami-mist px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-miami-navy"
          >
            {COVER_COLORS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <label className="flex items-center gap-2 text-sm font-medium text-miami-navy mt-6">
          <input
            type="checkbox"
            checked={featured}
            onChange={(e) => setFeatured(e.target.checked)}
            className="h-4 w-4 rounded border-miami-mist text-miami-navy focus:ring-miami-navy"
          />
          Featured on blog page
        </label>

        <label className="flex items-center gap-2 text-sm font-medium text-miami-navy mt-6">
          <input
            type="checkbox"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
            className="h-4 w-4 rounded border-miami-mist text-miami-navy focus:ring-miami-navy"
          />
          Published
        </label>
      </div>
    </form>
  );
}
