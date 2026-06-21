"use client";

import { useCallback, useRef, useState } from "react";
import { Upload, CheckCircle2, AlertCircle, RefreshCw } from "lucide-react";
import type { MediaCategory, MediaImageFolder } from "@/lib/media/types";
import { MEDIA_CATEGORIES } from "@/lib/media/types";
import { MEDIA_CATEGORY_LABELS } from "@/lib/media/categories";
import { cn } from "@/lib/utils";

const FOLDERS: { id: MediaImageFolder; label: string }[] = [
  { id: "hero", label: "Hero" },
  { id: "weddings", label: "Weddings" },
  { id: "corporate", label: "Corporate" },
  { id: "destination", label: "Destination" },
  { id: "celebrity", label: "Celebrity" },
  { id: "venues", label: "Venues" },
  { id: "portfolio", label: "Portfolio" },
  { id: "stories", label: "Stories" },
  { id: "gallery", label: "Gallery" },
];

type UploadResult = {
  ok: boolean;
  message: string;
  asset?: { id: string; src: string; title: string };
};

export function MediaUploader({ className }: { className?: string }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [folder, setFolder] = useState<MediaImageFolder>("gallery");
  const [category, setCategory] = useState<MediaCategory>("wedding");
  const [title, setTitle] = useState("");
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [reindexing, setReindexing] = useState(false);
  const [results, setResults] = useState<UploadResult[]>([]);

  const uploadFiles = useCallback(
    async (files: FileList | File[]) => {
      const list = Array.from(files).filter((f) => f.type.startsWith("image/"));
      if (!list.length) return;

      setUploading(true);
      const batch: UploadResult[] = [];

      for (const file of list) {
        const form = new FormData();
        form.append("file", file);
        form.append("folder", folder);
        form.append("category", category);
        if (title.trim()) form.append("title", title.trim());

        try {
          const res = await fetch("/api/admin/media/upload", { method: "POST", body: form });
          const data = await res.json().catch(() => ({}));
          batch.push({
            ok: res.ok,
            message: res.ok ? `Uploaded ${file.name}` : data.error ?? "Upload failed",
            asset: data.asset,
          });
        } catch {
          batch.push({ ok: false, message: `Failed to upload ${file.name}` });
        }
      }

      setResults((prev) => [...batch, ...prev].slice(0, 12));
      setUploading(false);
      setTitle("");
    },
    [folder, category, title]
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      if (e.dataTransfer.files?.length) void uploadFiles(e.dataTransfer.files);
    },
    [uploadFiles]
  );

  const reindex = async () => {
    setReindexing(true);
    try {
      const res = await fetch("/api/admin/media/reindex", { method: "POST" });
      const data = await res.json().catch(() => ({}));
      setResults((prev) => [
        {
          ok: res.ok,
          message: res.ok
            ? `Reindexed ${data.count ?? 0} assets`
            : data.error ?? "Reindex failed",
        },
        ...prev,
      ].slice(0, 12));
    } finally {
      setReindexing(false);
    }
  };

  return (
    <div className={cn("space-y-6", className)}>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="mb-1.5 block font-medium text-muted">Destination folder</span>
          <select
            value={folder}
            onChange={(e) => setFolder(e.target.value as MediaImageFolder)}
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2.5 text-sm"
          >
            {FOLDERS.map((f) => (
              <option key={f.id} value={f.id}>
                {f.label}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm">
          <span className="mb-1.5 block font-medium text-muted">Category</span>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as MediaCategory)}
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2.5 text-sm"
          >
            {MEDIA_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {MEDIA_CATEGORY_LABELS[c]}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="block text-sm">
        <span className="mb-1.5 block font-medium text-muted">Title (optional)</span>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Royal Palace Reception"
          className="w-full rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2.5 text-sm"
        />
      </label>

      <div
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        className={cn(
          "flex min-h-[200px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-10 text-center transition-all",
          dragging
            ? "border-[var(--glitz-gold)] bg-[var(--glitz-gold)]/5"
            : "border-[var(--border)] hover:border-[var(--glitz-gold)]/50 hover:bg-[var(--card)]"
        )}
      >
        <Upload className="mb-3 h-8 w-8 text-[var(--glitz-gold)]" aria-hidden />
        <p className="text-sm font-semibold">Drag & drop images here</p>
        <p className="mt-1 text-xs text-muted">JPG, PNG, WebP — auto-converted to WebP with blur placeholders</p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="sr-only"
          onChange={(e) => {
            if (e.target.files?.length) void uploadFiles(e.target.files);
            e.target.value = "";
          }}
        />
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
          className="inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-[var(--glitz-gold)] px-5 py-2.5 text-sm font-semibold text-[#0A0A0A] disabled:opacity-60"
        >
          {uploading ? "Uploading…" : "Choose files"}
        </button>
        <button
          type="button"
          disabled={reindexing}
          onClick={() => void reindex()}
          className="inline-flex min-h-[44px] items-center gap-2 rounded-lg border border-[var(--border)] px-5 py-2.5 text-sm font-semibold"
        >
          <RefreshCw className={cn("h-4 w-4", reindexing && "animate-spin")} aria-hidden />
          Reindex library
        </button>
      </div>

      {results.length > 0 && (
        <ul className="space-y-2 rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 text-sm">
          {results.map((r, i) => (
            <li key={i} className="flex items-start gap-2">
              {r.ok ? (
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
              ) : (
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
              )}
              <span>{r.message}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
