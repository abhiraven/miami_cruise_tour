"use client";

import { useEffect, useState } from "react";

interface MediaItem {
  url: string;
  pathname: string;
  uploadedAt: string;
  size: number;
}

interface MediaListResponse {
  media?: MediaItem[];
  cursor?: string;
  hasMore?: boolean;
  error?: string;
}

interface MediaLibraryPickerProps {
  folder?: string;
  onSelect: (url: string) => void;
  onClose: () => void;
}

function formatSize(bytes?: number) {
  if (!bytes) return "";
  const kb = bytes / 1024;
  if (kb < 1024) return `${Math.round(kb)} KB`;
  return `${(kb / 1024).toFixed(1)} MB`;
}

export default function MediaLibraryPicker({ folder, onSelect, onClose }: MediaLibraryPickerProps) {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");

  async function loadPage(nextCursor?: string): Promise<MediaListResponse> {
    const params = new URLSearchParams();
    if (folder) params.set("folder", folder);
    if (nextCursor) params.set("cursor", nextCursor);

    const res = await fetch(`/api/admin/media?${params.toString()}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to load the media library.");
    return data;
  }

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");
    loadPage()
      .then((data) => {
        if (cancelled) return;
        setMedia(data.media || []);
        setCursor(data.cursor);
        setHasMore(Boolean(data.hasMore));
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || "Failed to load the media library.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [folder]);

  async function handleLoadMore() {
    setLoadingMore(true);
    try {
      const data = await loadPage(cursor);
      setMedia((prev) => [...prev, ...(data.media || [])]);
      setCursor(data.cursor);
      setHasMore(Boolean(data.hasMore));
    } catch (err: any) {
      setError(err.message || "Failed to load more photos.");
    } finally {
      setLoadingMore(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative flex max-h-[85vh] w-full max-w-3xl flex-col rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-miami-mist px-5 py-4">
          <div>
            <h2 className="font-display text-lg font-bold text-miami-navy">Media Library</h2>
            <p className="text-xs text-miami-navy/50">Reuse a photo you've already uploaded.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-xl leading-none text-miami-navy/50 hover:text-miami-navy"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {loading ? (
            <p className="text-sm text-miami-navy/50">Loading photos…</p>
          ) : error ? (
            <p className="text-sm text-red-600">{error}</p>
          ) : media.length === 0 ? (
            <p className="text-sm text-miami-navy/50">
              No photos uploaded here yet. Upload one first, then it'll show up here to reuse.
            </p>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {media.map((item) => (
                  <button
                    key={item.pathname}
                    type="button"
                    onClick={() => {
                      onSelect(item.url);
                      onClose();
                    }}
                    title={item.pathname}
                    className="group relative aspect-square overflow-hidden rounded-lg border border-miami-mist hover:ring-2 hover:ring-miami-navy transition"
                  >
                    <img src={item.url} alt="" className="h-full w-full object-cover" />
                    <span className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition" />
                    {item.size && (
                      <span className="absolute bottom-1 right-1 rounded bg-black/60 px-1.5 py-0.5 text-[10px] font-semibold text-white opacity-0 group-hover:opacity-100 transition">
                        {formatSize(item.size)}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {hasMore && (
                <div className="mt-4 flex justify-center">
                  <button
                    type="button"
                    onClick={handleLoadMore}
                    disabled={loadingMore}
                    className="rounded-full border border-miami-mist px-4 py-2 text-xs font-semibold text-miami-navy hover:bg-miami-mist/20 transition disabled:opacity-60"
                  >
                    {loadingMore ? "Loading…" : "Load More"}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
