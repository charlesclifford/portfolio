"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, X, Loader2, Save } from "lucide-react";
import {
  CreateExperienceDTO,
  EmploymentType,
  IExperience,
} from "@/interfaces/experience.interface";

interface Props {
  initial?: IExperience;
  onSubmit: (data: CreateExperienceDTO) => Promise<void>;
  submitting: boolean;
}

const EMPLOYMENT_TYPES: EmploymentType[] = [
  "full-time",
  "part-time",
  "contract",
  "freelance",
  "internship",
];

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

export default function ExperienceForm({
  initial,
  onSubmit,
  submitting,
}: Props) {
  const [form, setForm] = useState<CreateExperienceDTO>({
    role: initial?.role ?? "",
    company: initial?.company ?? "",
    location: initial?.location ?? "",
    employmentType: initial?.employmentType ?? "full-time",
    startDate: initial?.startDate ?? "",
    endDate: initial?.endDate ?? "",
    isCurrent: initial?.isCurrent ?? false,
    description: initial?.description ?? "",
    highlights: initial?.highlights ?? [],
    technologies: initial?.technologies ?? [],
    companyUrl: initial?.companyUrl ?? "",
    order: initial?.order ?? 0,
  });

  const set = <K extends keyof CreateExperienceDTO>(
    key: K,
    value: CreateExperienceDTO[K],
  ) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({
      ...form,
      location: form.location || null,
      endDate: form.isCurrent ? null : form.endDate || null,
      companyUrl: form.companyUrl || null,
    });
  };

  const inputCls =
    "w-full px-4 py-3 bg-background border border-border rounded-xl text-sm text-foreground outline-none focus:border-accent transition-colors placeholder:text-muted/40 font-light";
  const labelCls =
    "block text-[11px] tracking-[0.08em] uppercase text-muted mb-2";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      {/* Role + Company */}
      <div className="grid grid-cols-2 max-sm:grid-cols-1 gap-5">
        <div>
          <label className={labelCls}>Role / Title *</label>
          <input
            required
            type="text"
            value={form.role}
            onChange={(e) => set("role", e.target.value)}
            placeholder="Full Stack Developer"
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls}>Company *</label>
          <input
            required
            type="text"
            value={form.company}
            onChange={(e) => set("company", e.target.value)}
            placeholder="Acme Corp"
            className={inputCls}
          />
        </div>
      </div>

      {/* Employment type + Location */}
      <div className="grid grid-cols-2 max-sm:grid-cols-1 gap-5">
        <div>
          <label className={labelCls}>Employment Type *</label>
          <select
            value={form.employmentType}
            onChange={(e) =>
              set("employmentType", e.target.value as EmploymentType)
            }
            className={`${inputCls} cursor-pointer`}
          >
            {EMPLOYMENT_TYPES.map((t) => (
              <option key={t} value={t}>
                {t.charAt(0).toUpperCase() + t.slice(1).replace("-", " ")}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelCls}>Location</label>
          <input
            type="text"
            value={form.location ?? ""}
            onChange={(e) => set("location", e.target.value)}
            placeholder="Port Harcourt, Nigeria · Remote"
            className={inputCls}
          />
        </div>
      </div>

      {/* Dates */}
      <div className="grid grid-cols-2 max-sm:grid-cols-1 gap-5">
        <div>
          <label className={labelCls}>Start Date *</label>
          <input
            required
            type="month"
            value={form.startDate}
            onChange={(e) => set("startDate", e.target.value)}
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls}>End Date</label>
          <input
            type="month"
            value={form.endDate ?? ""}
            onChange={(e) => set("endDate", e.target.value)}
            disabled={form.isCurrent}
            className={`${inputCls} disabled:opacity-40 disabled:cursor-not-allowed`}
          />
        </div>
      </div>

      {/* Current role toggle */}
      <label className="flex items-center gap-3 cursor-pointer select-none">
        <div
          role="switch"
          aria-checked={form.isCurrent}
          onClick={() => set("isCurrent", !form.isCurrent)}
          className={`w-11 h-6 rounded-full relative transition-colors cursor-pointer ${
            form.isCurrent ? "bg-accent" : "bg-border"
          }`}
        >
          <div
            className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${
              form.isCurrent ? "translate-x-5" : "translate-x-0.5"
            }`}
          />
        </div>
        <span className="text-sm text-muted">
          {form.isCurrent ? "Current role — shows as Present" : "Past role"}
        </span>
      </label>

      {/* Description */}
      <div>
        <label className={labelCls}>Description *</label>
        <textarea
          required
          rows={4}
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
          placeholder="Overview of your responsibilities and impact..."
          className={`${inputCls} resize-y`}
        />
      </div>

      {/* Highlights */}
      <TagInput
        label="Highlights / Achievements"
        values={form.highlights}
        onChange={(v) => set("highlights", v)}
        placeholder="Reduced load time by 40%..."
      />

      {/* Technologies */}
      <TagInput
        label="Technologies Used"
        values={form.technologies}
        onChange={(v) => set("technologies", v)}
        placeholder="React, Node.js, PostgreSQL..."
      />

      {/* Company URL + order */}
      <div className="grid grid-cols-2 max-sm:grid-cols-1 gap-5">
        <div>
          <label className={labelCls}>Company Website</label>
          <input
            type="url"
            value={form.companyUrl ?? ""}
            onChange={(e) => set("companyUrl", e.target.value || null)}
            placeholder="https://company.com"
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls}>Display Order</label>
          <input
            type="number"
            min={0}
            value={form.order}
            onChange={(e) => set("order", Number(e.target.value))}
            className={inputCls}
          />
          <p className="text-xs text-muted mt-1.5">Lower = appears first</p>
        </div>
      </div>

      {/* Submit */}
      <div className="flex gap-3 pt-2">
        <motion.button
          type="submit"
          disabled={submitting}
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
              <Save size={15} /> Save Experience
            </>
          )}
        </motion.button>
      </div>
    </form>
  );
}
