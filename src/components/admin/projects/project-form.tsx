"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, X, Loader2, Save, Globe, Lock } from "lucide-react";
import {
  CreateProjectDTO,
  IProject,
  ProjectColor,
  ProjectType,
} from "@/interfaces/project.interface";
import ImageDropzone from "../image-dropzone";
import {
  useProjectImageUpload,
  useProjectImageDelete,
} from "@/hooks/projects.hook";

interface Props {
  initial?: IProject;
  onSubmit: (data: CreateProjectDTO) => Promise<void>;
  submitting: boolean;
}

const COLOR_OPTIONS: ProjectColor[] = [
  "emerald",
  "slate",
  "amber",
  "pink",
  "violet",
  "cyan",
];

const COLOR_PREVIEW: Record<ProjectColor, string> = {
  emerald: "#065f46",
  slate: "#475569",
  amber: "#b45309",
  pink: "#f9a8d4",
  violet: "#6d28d9",
  cyan: "#0e7490",
};

// ─── Toggle ───────────────────────────────────────────────────────────────────
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

// ─── TagInput ─────────────────────────────────────────────────────────────────
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
          placeholder={placeholder ?? `Add ${label.toLowerCase()}...`}
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

// ─── Main form ────────────────────────────────────────────────────────────────
export default function ProjectForm({ initial, onSubmit, submitting }: Props) {
  const [form, setForm] = useState<CreateProjectDTO>({
    title: initial?.title ?? "",
    year: initial?.year ?? String(new Date().getFullYear()),
    color: initial?.color ?? "emerald",
    textColor: initial?.textColor ?? "white",
    summary: initial?.summary ?? "",
    description: initial?.description ?? "",
    problem: initial?.problem ?? "",
    solution: initial?.solution ?? "",
    results: initial?.results ?? [],
    tech: initial?.tech ?? [],
    tags: initial?.tags ?? [],
    imageId: initial?.imageId ?? null,
    liveLink: initial?.liveLink ?? "",
    githubLink: initial?.githubLink ?? "",
    categories: initial?.categories ?? [],
    featured: initial?.featured ?? false,
    projectType: initial?.projectType ?? "public",
    isPublished: initial?.isPublished ?? false,
  });

  const { mutateAsync: uploadImg, isPending: uploading } =
    useProjectImageUpload();
  const { mutateAsync: deleteImg, isPending: removingImg } =
    useProjectImageDelete();

  const set = <K extends keyof CreateProjectDTO>(
    key: K,
    value: CreateProjectDTO[K],
  ) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleImageUpload = async (file: File) => {
    const uploaded = await uploadImg(file);
    set("imageId", uploaded.$id);
  };

  const handleImageRemove = async () => {
    if (form.imageId) await deleteImg(form.imageId);
    set("imageId", null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(form);
  };

  const inputCls =
    "w-full px-4 py-3 bg-background border border-border rounded-xl text-sm text-foreground outline-none focus:border-accent transition-colors placeholder:text-muted/40 font-light";
  const labelCls =
    "block text-[11px] tracking-[0.08em] uppercase text-muted mb-2";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      {/* Image */}
      <ImageDropzone
        imageId={form.imageId}
        onUpload={handleImageUpload}
        onRemove={form.imageId ? handleImageRemove : undefined}
        uploading={uploading || removingImg}
      />

      {/* Basic info */}
      <div className="grid grid-cols-2 max-sm:grid-cols-1 gap-5">
        <div>
          <label className={labelCls}>Title *</label>
          <input
            required
            type="text"
            value={form.title}
            onChange={(e) => set("title", e.target.value)}
            placeholder="E-Commerce Platform"
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls}>Year *</label>
          <input
            required
            type="text"
            value={form.year}
            onChange={(e) => set("year", e.target.value)}
            placeholder="2024"
            className={inputCls}
          />
        </div>
      </div>

      <div>
        <label className={labelCls}>Summary *</label>
        <input
          required
          type="text"
          value={form.summary}
          onChange={(e) => set("summary", e.target.value)}
          placeholder="One-line card description"
          className={inputCls}
        />
      </div>

      <div>
        <label className={labelCls}>Description *</label>
        <textarea
          required
          rows={3}
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
          placeholder="Full project overview paragraph..."
          className={`${inputCls} resize-y`}
        />
      </div>

      {/* Case study */}
      <div className="grid grid-cols-2 max-sm:grid-cols-1 gap-5">
        <div>
          <label className={labelCls}>The Challenge</label>
          <textarea
            rows={4}
            value={form.problem}
            onChange={(e) => set("problem", e.target.value)}
            placeholder="What problem needed solving?"
            className={`${inputCls} resize-y`}
          />
        </div>
        <div>
          <label className={labelCls}>The Approach</label>
          <textarea
            rows={4}
            value={form.solution}
            onChange={(e) => set("solution", e.target.value)}
            placeholder="How did you solve it?"
            className={`${inputCls} resize-y`}
          />
        </div>
      </div>

      <TagInput
        label="Results"
        values={form.results}
        onChange={(v) => set("results", v)}
        placeholder="Improved performance by 20%..."
      />
      <TagInput
        label="Tech Stack"
        values={form.tech}
        onChange={(v) => set("tech", v)}
        placeholder="React, Node.js, Docker..."
      />
      <TagInput
        label="Tags"
        values={form.tags}
        onChange={(v) => set("tags", v)}
        placeholder="React, TypeScript..."
      />
      <TagInput
        label="Categories"
        values={form.categories}
        onChange={(v) => set("categories", v)}
        placeholder="Frontend, SaaS..."
      />

      {/* Links */}
      <div
        className={`grid gap-5 ${form.projectType === "private" ? "grid-cols-1" : "grid-cols-2 max-sm:grid-cols-1"}`}
      >
        <div>
          <label className={labelCls}>Live Link</label>
          <input
            type="url"
            value={form.liveLink ?? ""}
            onChange={(e) => set("liveLink", e.target.value || null)}
            placeholder="https://demo.ionidev.com"
            className={inputCls}
          />
        </div>
        {form.projectType !== "private" && (
          <div>
            <label className={labelCls}>GitHub Link</label>
            <input
              type="url"
              value={form.githubLink ?? ""}
              onChange={(e) => set("githubLink", e.target.value || null)}
              placeholder="https://github.com/simkidd/..."
              className={inputCls}
            />
          </div>
        )}
      </div>

      {/* Colour */}
      <div>
        <label className={labelCls}>Card Color</label>
        <div className="flex gap-3 flex-wrap mt-1">
          {COLOR_OPTIONS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => {
                set("color", c);
                set("textColor", c === "pink" ? "black" : "white");
              }}
              title={c}
              className={`w-10 h-10 rounded-xl border-2 transition-all cursor-pointer ${form.color === c ? "border-foreground scale-110" : "border-transparent scale-100 opacity-70 hover:opacity-100"}`}
              style={{ backgroundColor: COLOR_PREVIEW[c] }}
            />
          ))}
        </div>
        <p className="text-xs text-muted mt-2">
          Selected:{" "}
          <span className="text-foreground capitalize">{form.color}</span> ·
          Text: <span className="text-foreground">{form.textColor}</span>
        </p>
      </div>

      {/* Visibility & Status */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 p-5 rounded-2xl bg-card border border-border">
        <div className="sm:col-span-1">
          <p className={labelCls}>Project Type</p>
          <div className="flex flex-col gap-2 mt-1">
            {(["public", "private"] as ProjectType[]).map((type) => (
              <label
                key={type}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border cursor-pointer transition-colors ${form.projectType === type ? "border-accent bg-accent/5 text-foreground" : "border-border text-muted hover:border-border/80"}`}
              >
                <input
                  type="radio"
                  name="projectType"
                  value={type}
                  checked={form.projectType === type}
                  onChange={() => {
                    set("projectType", type);
                    if (type === "private") set("githubLink", null);
                  }}
                  className="sr-only"
                />
                {type === "public" ? (
                  <Globe
                    size={14}
                    className={
                      form.projectType === type ? "text-accent" : "text-muted"
                    }
                  />
                ) : (
                  <Lock
                    size={14}
                    className={
                      form.projectType === type ? "text-accent" : "text-muted"
                    }
                  />
                )}
                <span className="text-sm capitalize">{type}</span>
                <span className="text-[10px] text-muted ml-auto">
                  {type === "public" ? "In portfolio" : "NDA / client"}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="sm:col-span-2 flex flex-col justify-center gap-4 sm:pl-5 sm:border-l sm:border-border">
          <Toggle
            value={form.isPublished ?? false}
            onChange={(v) => set("isPublished", v)}
            label="Published"
            activeColor="bg-accent"
          />
          <p className="text-xs text-muted -mt-2 ml-14">
            {form.isPublished
              ? "Live — visible to visitors"
              : "Draft — hidden from portfolio"}
          </p>
          <Toggle
            value={form.featured ?? false}
            onChange={(v) => set("featured", v)}
            label="Featured"
            activeColor="bg-amber-400"
          />
          <p className="text-xs text-muted -mt-2 ml-14">
            {form.featured ? "Highlighted on homepage" : "Standard listing"}
          </p>
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
              <Save size={15} /> Save Project
            </>
          )}
        </motion.button>
      </div>
    </form>
  );
}
