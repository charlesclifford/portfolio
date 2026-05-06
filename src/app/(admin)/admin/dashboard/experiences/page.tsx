"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  Briefcase,
  MapPin,
  ExternalLink,
} from "lucide-react";
import { formatDate } from "@/utils/helpers";
import { useDeleteExperience, useExperiences } from "@/hooks/experience.hook";

function formatPeriod(
  startDate: string,
  endDate: string | null,
  isCurrent: boolean,
) {
  const fmt = (d: string) => {
    const [y, m] = d.split("-");
    const date = new Date(Number(y), Number(m) - 1);
    return date.toLocaleDateString("en-GB", {
      month: "short",
      year: "numeric",
    });
  };
  const start = fmt(startDate);
  const end = isCurrent ? "Present" : endDate ? fmt(endDate) : "Present";
  return `${start} – ${end}`;
}

export default function ExperiencePage() {
  const { data: experiences, isPending } = useExperiences();
  const { mutate: deleteExp, isPending: deleting } = useDeleteExperience();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteTitle, setDeleteTitle] = useState("");

  const handleDelete = () => {
    if (!deleteId) return;
    deleteExp(deleteId, {
      onSuccess: () => {
        setDeleteId(null);
        setDeleteTitle("");
      },
    });
  };

  return (
    <div className="px-4 md:px-8 py-6 md:py-10 max-w-[1100px]">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <p className="text-xs tracking-[0.1em] uppercase text-muted mb-1">
            Manage
          </p>
          <h1 className="text-2xl md:text-3xl font-light text-foreground">
            Experience
          </h1>
        </div>
        <Link
          href="/admin/dashboard/experiences/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-accent text-black rounded-xl text-sm font-medium no-underline hover:opacity-90 transition-opacity"
        >
          <Plus size={15} /> Add Experience
        </Link>
      </div>

      {/* Loading */}
      {isPending && (
        <div className="flex items-center justify-center py-20 gap-3 text-muted">
          <Loader2 size={18} className="animate-spin" />
          <span className="text-sm">Loading...</span>
        </div>
      )}

      {/* Empty */}
      {!isPending && experiences?.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-muted">
          <Briefcase size={32} className="opacity-30" />
          <p className="text-sm">No experience entries yet.</p>
          <Link
            href="/admin/dashboard/experiences/new"
            className="text-sm text-accent no-underline hover:opacity-80 transition-opacity"
          >
            Add your first entry
          </Link>
        </div>
      )}

      {/* List */}
      <div className="flex flex-col gap-3">
        {experiences?.map((exp, i) => (
          <motion.div
            key={exp.$id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: i * 0.05 }}
            className="bg-card border border-border rounded-2xl p-5 md:p-6"
          >
            <div className="flex items-start justify-between gap-4">
              {/* Left content */}
              <div className="flex-1 min-w-0">
                {/* Role + company */}
                <div className="flex items-start gap-3 mb-2 flex-wrap">
                  <div>
                    <h3 className="text-base font-normal text-foreground">
                      {exp.role}
                    </h3>
                    <div className="flex items-center gap-2 flex-wrap mt-0.5">
                      {exp.companyUrl ? (
                        <a
                          href={exp.companyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-accent no-underline hover:opacity-80 flex items-center gap-1 transition-opacity"
                        >
                          {exp.company}
                          <ExternalLink size={11} />
                        </a>
                      ) : (
                        <span className="text-sm text-accent">
                          {exp.company}
                        </span>
                      )}
                      <span className="text-[10px] px-2 py-0.5 rounded-full border border-border bg-white/5 text-muted capitalize">
                        {exp.employmentType.replace("-", " ")}
                      </span>
                      {exp.isCurrent && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-accent/10 text-accent border border-accent/20">
                          Current
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Period + location */}
                <div className="flex items-center gap-3 text-xs text-muted mb-3 flex-wrap">
                  <span>
                    {formatPeriod(exp.startDate, exp.endDate, exp.isCurrent)}
                  </span>
                  {exp.location && (
                    <>
                      <span className="opacity-40">·</span>
                      <span className="flex items-center gap-1">
                        <MapPin size={11} />
                        {exp.location}
                      </span>
                    </>
                  )}
                </div>

                {/* Description */}
                <p className="text-sm text-muted font-light leading-relaxed mb-3 line-clamp-2">
                  {exp.description}
                </p>

                {/* Technologies */}
                {exp.technologies?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {exp.technologies.slice(0, 6).map((t) => (
                      <span
                        key={t}
                        className="text-[10px] px-2 py-0.5 rounded-full border border-border bg-white/5 text-muted"
                      >
                        {t}
                      </span>
                    ))}
                    {exp.technologies.length > 6 && (
                      <span className="text-[10px] text-muted">
                        +{exp.technologies.length - 6} more
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 shrink-0">
                <Link
                  href={`/admin/dashboard/experiences/${exp.$id}`}
                  className="p-1.5 rounded-lg text-muted hover:text-accent hover:bg-accent/5 transition-colors"
                  title="Edit"
                >
                  <Pencil size={14} />
                </Link>
                <button
                  onClick={() => {
                    setDeleteId(exp.$id);
                    setDeleteTitle(exp.role);
                  }}
                  className="p-1.5 rounded-lg text-muted hover:text-red-400 hover:bg-red-400/5 transition-colors bg-transparent border-0 cursor-pointer"
                  title="Delete"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Delete modal */}
      <AnimatePresence>
        {deleteId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center px-4"
            onClick={() => setDeleteId(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card border border-border rounded-2xl p-7 max-w-[400px] w-full"
            >
              <h3 className="text-lg font-normal text-foreground mb-1">
                Delete experience?
              </h3>
              <p className="text-sm text-muted mb-1">
                <span className="text-foreground">
                  &ldquo;{deleteTitle}&rdquo;
                </span>
              </p>
              <p className="text-sm text-muted mb-7 leading-relaxed">
                This cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteId(null)}
                  className="flex-1 py-2.5 bg-transparent border border-border rounded-xl text-sm text-muted hover:text-foreground transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex-1 py-2.5 bg-red-500 text-white rounded-xl text-sm font-medium flex items-center justify-center gap-2 cursor-pointer border-0 hover:bg-red-600 transition-colors disabled:opacity-60"
                >
                  {deleting ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Trash2 size={14} />
                  )}
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
