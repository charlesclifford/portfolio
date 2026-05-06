"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, X, Loader2, Save, Eye, EyeOff } from "lucide-react";
import { CreatePostDTO, IPost, PostStatus } from "@/interfaces/post.interface";
import RichTextEditor from "../rich-text-editor";
import ImageDropzone from "../image-dropzone";
import {
  useProjectImageUpload,
  useProjectImageDelete,
} from "@/hooks/projects.hook";

interface Props {
  initial?: IPost;
  onSubmit: (data: CreatePostDTO) => Promise<void>;
  submitting: boolean;
}

function TagInput({
  label,
  values,
  onChange,
  placeholder,
}: {
  label: string;
  values: string[];
  onChange: (v: string[]) => void;
  placeholder?: string;
}) {
  const [input, setInput] = useState("");
  const add = () => {
    const v = input.trim();
    if (!v || values.includes(v)) return;
    onChange([...values, v]);
    setInput("");
  };
  return (
    <div>
      <label className="block text-[11px] tracking-[0.08em] uppercase text-muted mb-2">
        {label}
      </label>
      <div className="flex gap-2 mb-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
          placeholder={placeholder}
          className="flex-1 px-3 py-2.5 bg-background border border-border rounded-xl text-sm text-foreground outline-none focus:border-accent transition-colors placeholder:text-muted/40"
        />
        <button
          type="button"
          onClick={add}
          className="px-3 py-2.5 bg-card border border-border rounded-xl text-muted hover:text-foreground transition-colors cursor-pointer"
        >
          <Plus size={15} />
        </button>
      </div>
      {values.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {values.map((v) => (
            <span
              key={v}
              className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-white/5 border border-border text-muted"
            >
              {v}
              <button
                type="button"
                onClick={() => onChange(values.filter((x) => x !== v))}
                className="text-muted hover:text-foreground bg-transparent border-0 cursor-pointer p-0 leading-none"
              >
                <X size={11} />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function Toggle({
  value,
  onChange,
  label,
  activeColor = "bg-accent",
}: {
  value: boolean;
  onChange: (v: boolean) => void;
  label: string;
  activeColor?: string;
}) {
  return (
    <label className="flex items-center gap-3 cursor-pointer select-none">
      <div
        role="switch"
        aria-checked={value}
        onClick={() => onChange(!value)}
        className={`w-11 h-6 rounded-full relative transition-colors cursor-pointer ${value ? activeColor : "bg-border"}`}
      >
        <div
          className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${value ? "translate-x-5" : "translate-x-0.5"}`}
        />
      </div>
      <span className="text-sm text-muted">{label}</span>
    </label>
  );
}

export default function PostForm({ initial, onSubmit, submitting }: Props) {
  const [form, setForm] = useState<CreatePostDTO>({
    title: initial?.title ?? "",
    excerpt: initial?.excerpt ?? "",
    content: initial?.content ?? "",
    coverImageId: initial?.coverImageId ?? null,
    tags: initial?.tags ?? [],
    categories: initial?.categories ?? [],
    status: initial?.status ?? "draft",
    featured: initial?.featured ?? false,
    readingTime: initial?.readingTime ?? 1,
    publishedAt: initial?.publishedAt ?? null,
  });

  const set = <K extends keyof CreatePostDTO>(
    key: K,
    value: CreatePostDTO[K],
  ) => setForm((prev) => ({ ...prev, [key]: value }));

  const { mutateAsync: uploadImg, isPending: uploading } =
    useProjectImageUpload();
  const { mutateAsync: deleteImg, isPending: removingImg } =
    useProjectImageDelete();

  const handleImageUpload = async (file: File) => {
    const uploaded = await uploadImg(file);
    set("coverImageId", uploaded.$id);
  };

  const handleImageRemove = async () => {
    if (form.coverImageId) await deleteImg(form.coverImageId);
    set("coverImageId", null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.content || form.content === "<p></p>") return;
    await onSubmit(form);
  };

  const inputCls =
    "w-full px-4 py-3 bg-background border border-border rounded-xl text-sm text-foreground outline-none focus:border-accent transition-colors placeholder:text-muted/40 font-light";
  const labelCls =
    "block text-[11px] tracking-[0.08em] uppercase text-muted mb-2";

  const isPublished = form.status === "published";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      {/* Title */}
      <div>
        <label className={labelCls}>Title *</label>
        <input
          required
          type="text"
          value={form.title}
          onChange={(e) => set("title", e.target.value)}
          placeholder="My blog post title"
          className={`${inputCls} text-lg`}
        />
      </div>

      {/* Excerpt */}
      <div>
        <label className={labelCls}>Excerpt *</label>
        <textarea
          required
          rows={2}
          value={form.excerpt}
          onChange={(e) => set("excerpt", e.target.value)}
          placeholder="A short summary shown on the blog index..."
          className={`${inputCls} resize-none`}
        />
        <p className="text-xs text-muted mt-1.5">
          Shown on blog cards and social share previews.
        </p>
      </div>

      {/* Cover Image */}
      <ImageDropzone
        imageId={form.coverImageId}
        onUpload={handleImageUpload}
        onRemove={form.coverImageId ? handleImageRemove : undefined}
        uploading={uploading || removingImg}
      />

      {/* Editor */}
      <div>
        <label className={labelCls}>Content *</label>
        <RichTextEditor
          content={form.content}
          onChange={(html) => set("content", html)}
          placeholder="Start writing your post..."
        />
        {(!form.content || form.content === "<p></p>") && (
          <p className="text-xs text-red-400 mt-1.5">Content is required.</p>
        )}
      </div>

      {/* Tags + Categories */}
      <TagInput
        label="Tags"
        values={form.tags}
        onChange={(v) => set("tags", v)}
        placeholder="react, nextjs, typescript..."
      />
      <TagInput
        label="Categories"
        values={form.categories}
        onChange={(v) => set("categories", v)}
        placeholder="Development, Design..."
      />

      {/* Publish settings */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 p-5 rounded-2xl bg-card border border-border">
        <div className="flex flex-col gap-4">
          <p className={`${labelCls} border-b border-border pb-2 mb-0`}>
            Publishing
          </p>

          {/* Status toggle */}
          <label className="flex items-center gap-3 cursor-pointer select-none">
            <div
              role="switch"
              aria-checked={isPublished}
              onClick={() => set("status", isPublished ? "draft" : "published")}
              className={`w-11 h-6 rounded-full relative transition-colors cursor-pointer ${isPublished ? "bg-accent" : "bg-border"}`}
            >
              <div
                className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${isPublished ? "translate-x-5" : "translate-x-0.5"}`}
              />
            </div>
            <div>
              <span className="text-sm text-foreground flex items-center gap-1.5">
                {isPublished ? (
                  <>
                    <Eye size={13} className="text-accent" /> Published
                  </>
                ) : (
                  <>
                    <EyeOff size={13} /> Draft
                  </>
                )}
              </span>
              <p className="text-xs text-muted">
                {isPublished
                  ? "Visible on the public blog"
                  : "Hidden from visitors"}
              </p>
            </div>
          </label>

          <Toggle
            value={form.featured ?? false}
            onChange={(v) => set("featured", v)}
            label="Featured post"
            activeColor="bg-amber-400"
          />
        </div>

        {/* Status badge preview */}
        <div className="flex flex-col justify-center items-center gap-2">
          <div
            className={`px-4 py-2 rounded-full text-sm border ${
              isPublished
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                : "bg-white/5 text-muted border-border"
            }`}
          >
            {isPublished ? "● Published" : "○ Draft"}
          </div>
          {form.featured && (
            <div className="px-4 py-2 rounded-full text-sm bg-amber-400/10 text-amber-400 border border-amber-400/20">
              ★ Featured
            </div>
          )}
        </div>
      </div>

      {/* Submit */}
      <div className="flex gap-3 pt-2">
        <motion.button
          type="submit"
          disabled={submitting || uploading}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className="flex items-center justify-center gap-2 px-8 py-3.5 bg-accent text-black rounded-xl text-sm font-medium cursor-pointer border-0 disabled:opacity-60 disabled:cursor-wait"
        >
          {submitting ? (
            <>
              <Loader2 size={15} className="animate-spin" /> Saving...
            </>
          ) : (
            <>
              <Save size={15} /> Save Post
            </>
          )}
        </motion.button>

        {/* Quick status switch */}
        <button
          type="button"
          onClick={() => set("status", isPublished ? "draft" : "published")}
          className="px-5 py-3.5 bg-card border border-border rounded-xl text-sm text-muted hover:text-foreground transition-colors cursor-pointer"
        >
          {isPublished ? "Save as Draft" : "Publish"}
        </button>
      </div>
    </form>
  );
}
