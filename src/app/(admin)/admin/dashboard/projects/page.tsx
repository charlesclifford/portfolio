"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  Plus,
  Search,
  Trash2,
  Pencil,
  ArrowUpRight,
  Loader2,
  X,
  Globe,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";
import { formatDate } from "@/utils/helpers";
import { getImagePreview } from "@/lib/api/projects.api";
import {
  useProjectCategories,
  useDeleteProject,
  useAdminProjects,
} from "@/hooks/projects.hook";
import { colorMap } from "@/interfaces/project.interface";

export default function AdminProjectsPage() {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [projectType, setProjectType] = useState("");
  const [publishedFilter, setPublishedFilter] = useState<"" | "true" | "false">(
    "",
  );
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteTitle, setDeleteTitle] = useState("");

  const isPublishedParam =
    publishedFilter === "true"
      ? true
      : publishedFilter === "false"
        ? false
        : undefined;

  const { data, isPending } = useAdminProjects({
    page,
    limit: 8,
    searchQuery: search,
    category,
    projectType,
    isPublished: isPublishedParam,
  });
  const { data: categories } = useProjectCategories();
  const { mutate: deleteProject, isPending: deleting } = useDeleteProject();

  const hasFilters = search || category || projectType || publishedFilter;

  const clearFilters = () => {
    setSearch("");
    setSearchQuery("");
    setCategory("");
    setProjectType("");
    setPublishedFilter("");
    setPage(1);
  };
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchQuery);
    setPage(1);
  };
  const confirmDelete = (id: string, title: string) => {
    setDeleteId(id);
    setDeleteTitle(title);
  };
  const handleDelete = () => {
    if (!deleteId) return;
    deleteProject(deleteId, {
      onSuccess: () => {
        setDeleteId(null);
        setDeleteTitle("");
      },
    });
  };

  const FilterSelect = ({
    value,
    onChange,
    options,
    placeholder,
  }: {
    value: string;
    onChange: (v: string) => void;
    options: { value: string; label: string }[];
    placeholder: string;
  }) => (
    <select
      value={value}
      onChange={(e) => {
        onChange(e.target.value);
        setPage(1);
      }}
      className="px-3 py-2.5 bg-card border border-border rounded-xl text-sm text-foreground outline-none focus:border-accent transition-colors cursor-pointer"
    >
      <option value="">{placeholder}</option>
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );

  const desktopTableCols = "grid-cols-[minmax(0,2.8fr)_120px_140px_110px_96px]";

  return (
    <div className="px-4 md:px-8 py-6 md:py-10 max-w-[1100px]">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <p className="text-xs tracking-[0.1em] uppercase text-muted mb-1">
            Manage
          </p>
          <h1 className="text-2xl md:text-3xl font-light text-foreground">
            Projects
          </h1>
        </div>
        <Link
          href="/admin/dashboard/projects/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-accent text-black rounded-xl text-sm font-medium no-underline hover:opacity-90 transition-opacity"
        >
          <Plus size={15} /> New Project
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 mb-6">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search projects..."
              className="w-full pl-9 pr-4 py-2.5 bg-card border border-border rounded-xl text-sm text-foreground outline-none focus:border-accent transition-colors placeholder:text-muted/50"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2.5 bg-card border border-border rounded-xl text-sm text-muted hover:text-foreground transition-colors cursor-pointer shrink-0"
          >
            Search
          </button>
        </form>
        <div className="flex gap-2 flex-wrap">
          <FilterSelect
            value={projectType}
            onChange={setProjectType}
            placeholder="All Types"
            options={[
              { value: "public", label: "Public" },
              { value: "private", label: "Private" },
            ]}
          />
          <FilterSelect
            value={publishedFilter}
            onChange={(v) => setPublishedFilter(v as "" | "true" | "false")}
            placeholder="All Status"
            options={[
              { value: "true", label: "Published" },
              { value: "false", label: "Draft" },
            ]}
          />
          {categories && categories.length > 0 && (
            <FilterSelect
              value={category}
              onChange={setCategory}
              placeholder="All Categories"
              options={categories.map((c) => ({ value: c, label: c }))}
            />
          )}
          {hasFilters && (
            <button
              onClick={clearFilters}
              className="inline-flex items-center gap-1.5 px-3 py-2.5 bg-card border border-border rounded-xl text-sm text-muted hover:text-foreground transition-colors cursor-pointer"
            >
              <X size={13} /> Clear
            </button>
          )}
        </div>
      </div>

      {/* Desktop table */}
      <div className="hidden md:block bg-card border border-border rounded-2xl overflow-hidden mb-5">
        <div
          className={`grid ${desktopTableCols} gap-4 px-5 py-3 border-b border-border items-center`}
        >
          {["Project", "Type", "Status", "Date", ""].map((h) => (
            <span
              key={h}
              className="text-[11px] tracking-[0.08em] uppercase text-muted"
            >
              {h}
            </span>
          ))}
        </div>

        {isPending && (
          <div className="flex items-center justify-center py-16 gap-3 text-muted">
            <Loader2 size={18} className="animate-spin" />
            <span className="text-sm">Loading...</span>
          </div>
        )}

        {!isPending &&
          data?.projects.map((project, i) => {
            const { hex } = colorMap[project.color] ?? { hex: "#27272a" };
            const imageUrl = project.imageId
              ? getImagePreview(project.imageId)
              : null;
            return (
              <motion.div
                key={project.$id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.03 }}
                className={`grid ${desktopTableCols} gap-4 items-center px-5 py-3.5 border-b border-border last:border-b-0 hover:bg-white/[0.02] transition-colors`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  {imageUrl ? (
                    <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 relative border border-border">
                      <Image
                        src={imageUrl}
                        alt={project.title}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  ) : (
                    <div
                      className="w-10 h-10 rounded-lg shrink-0"
                      style={{ backgroundColor: hex }}
                    />
                  )}
                  <div className="min-w-0">
                    <p className="text-sm text-foreground truncate">
                      {project.title}
                    </p>
                    <p className="text-xs text-muted truncate">
                      {project.summary}
                    </p>
                  </div>
                </div>

                <span
                  className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full border w-fit ${project.projectType === "public" ? "bg-sky-500/10 text-sky-400 border-sky-500/20" : "bg-violet-500/10 text-violet-400 border-violet-500/20"}`}
                >
                  {project.projectType === "public" ? (
                    <Globe size={9} />
                  ) : (
                    <Lock size={9} />
                  )}
                  {project.projectType}
                </span>

                <div className="flex flex-col gap-1">
                  <span
                    className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full border w-fit ${project.isPublished ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-white/5 text-muted border-border"}`}
                  >
                    {project.isPublished ? (
                      <Eye size={9} />
                    ) : (
                      <EyeOff size={9} />
                    )}
                    {project.isPublished ? "Published" : "Draft"}
                  </span>
                  {project.featured && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-400/10 text-amber-400 border border-amber-400/20 w-fit">
                      Featured
                    </span>
                  )}
                </div>

                <span className="text-xs text-muted">
                  {formatDate(project.$createdAt)}
                </span>

                <div className="flex items-center gap-1">
                  {project.projectType === "public" && project.isPublished && (
                    <Link
                      href={`/work/${project.slug}`}
                      target="_blank"
                      className="p-1.5 rounded-lg text-muted hover:text-foreground hover:bg-white/5 transition-colors"
                      title="View live"
                    >
                      <ArrowUpRight size={14} />
                    </Link>
                  )}
                  <Link
                    href={`/admin/dashboard/projects/${project.$id}`}
                    className="p-1.5 rounded-lg text-muted hover:text-accent hover:bg-accent/5 transition-colors"
                    title="Edit"
                  >
                    <Pencil size={14} />
                  </Link>
                  <button
                    onClick={() => confirmDelete(project.$id, project.title)}
                    className="p-1.5 rounded-lg text-muted hover:text-red-400 hover:bg-red-400/5 transition-colors bg-transparent border-0 cursor-pointer"
                    title="Delete"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </motion.div>
            );
          })}

        {!isPending && data?.projects.length === 0 && (
          <div className="flex items-center justify-center py-16 text-muted">
            <p className="text-sm">No projects found.</p>
          </div>
        )}
      </div>

      {/* Mobile cards */}
      <div className="flex flex-col gap-3 md:hidden mb-5">
        {isPending &&
          Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-24 rounded-xl bg-card border border-border animate-pulse"
            />
          ))}
        {!isPending &&
          data?.projects.map((project, i) => {
            const { hex } = colorMap[project.color] ?? { hex: "#27272a" };
            const imageUrl = project.imageId
              ? getImagePreview(project.imageId)
              : null;
            return (
              <motion.div
                key={project.$id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="flex gap-3 p-4 bg-card border border-border rounded-xl"
              >
                {imageUrl ? (
                  <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 relative border border-border">
                    <Image
                      src={imageUrl}
                      alt={project.title}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                ) : (
                  <div
                    className="w-14 h-14 rounded-xl shrink-0"
                    style={{ backgroundColor: hex }}
                  />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p className="text-sm font-normal text-foreground truncate">
                      {project.title}
                    </p>
                    <div className="flex gap-1 shrink-0">
                      <Link
                        href={`/admin/dashboard/projects/${project.$id}`}
                        className="p-1 text-muted hover:text-accent transition-colors"
                      >
                        <Pencil size={13} />
                      </Link>
                      <button
                        onClick={() =>
                          confirmDelete(project.$id, project.title)
                        }
                        className="p-1 text-muted hover:text-red-400 transition-colors bg-transparent border-0 cursor-pointer"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-muted truncate mb-2">
                    {project.summary}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    <span
                      className={`inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-full border ${project.projectType === "public" ? "bg-sky-500/10 text-sky-400 border-sky-500/20" : "bg-violet-500/10 text-violet-400 border-violet-500/20"}`}
                    >
                      {project.projectType === "public" ? (
                        <Globe size={9} />
                      ) : (
                        <Lock size={9} />
                      )}
                      {project.projectType}
                    </span>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-full border ${project.isPublished ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-white/5 text-muted border-border"}`}
                    >
                      {project.isPublished ? "Published" : "Draft"}
                    </span>
                    {project.featured && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-400/10 text-amber-400 border border-amber-400/20">
                        ★ Featured
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        {!isPending && data?.projects.length === 0 && (
          <div className="flex items-center justify-center py-12 text-muted">
            <p className="text-sm">No projects found.</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {data && data.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted">
            Page {data.currentPage} of {data.totalPages} · {data.total} total
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-2 bg-card border border-border rounded-lg text-sm text-muted hover:text-foreground disabled:opacity-40 cursor-pointer transition-colors"
            >
              Prev
            </button>
            <button
              onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
              disabled={page === data.totalPages}
              className="px-3 py-2 bg-card border border-border rounded-lg text-sm text-muted hover:text-foreground disabled:opacity-40 cursor-pointer transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}

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
                Delete project?
              </h3>
              <p className="text-sm text-muted mb-1">
                <span className="text-foreground">
                  &ldquo;{deleteTitle}&rdquo;
                </span>
              </p>
              <p className="text-sm text-muted mb-7 leading-relaxed">
                This permanently deletes the project and its image. This cannot
                be undone.
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
