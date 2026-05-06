"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Plus,
  Search,
  Trash2,
  Pencil,
  ArrowUpRight,
  Loader2,
  X,
  Eye,
  EyeOff,
  Clock,
} from "lucide-react";
import { formatDate } from "@/utils/helpers";
import { useDeletePost, useFilteredPosts } from "@/hooks/posts.hook";

export default function AdminBlogPage() {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"" | "draft" | "published">(
    "",
  );
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteTitle, setDeleteTitle] = useState("");

  const { data, isPending } = useFilteredPosts({
    page,
    limit: 10,
    searchQuery: search,
    status: statusFilter || undefined,
  });
  const { mutate: deletePost, isPending: deleting } = useDeletePost();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchQuery);
    setPage(1);
  };
  const handleDelete = () => {
    if (!deleteId) return;
    deletePost(deleteId, {
      onSuccess: () => {
        setDeleteId(null);
        setDeleteTitle("");
      },
    });
  };
  const hasFilters = search || statusFilter;

  const desktopTableCols = "grid-cols-[minmax(0,2.8fr)_120px_140px_110px_96px]";

  return (
    <div className="px-4 md:px-8 py-6 md:py-10 max-w-[1100px]">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <p className="text-xs tracking-[0.1em] uppercase text-muted mb-1">
            Manage
          </p>
          <h1 className="text-2xl md:text-3xl font-light text-foreground">
            Blog
          </h1>
        </div>
        <Link
          href="/admin/dashboard/blog/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-accent text-black rounded-xl text-sm font-medium no-underline hover:opacity-90 transition-opacity"
        >
          <Plus size={15} /> New Post
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
              placeholder="Search posts..."
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
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as "" | "draft" | "published");
              setPage(1);
            }}
            className="px-3 py-2.5 bg-card border border-border rounded-xl text-sm text-foreground outline-none focus:border-accent transition-colors cursor-pointer"
          >
            <option value="">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
          {hasFilters && (
            <button
              onClick={() => {
                setSearch("");
                setSearchQuery("");
                setStatusFilter("");
                setPage(1);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-2.5 bg-card border border-border rounded-xl text-sm text-muted hover:text-foreground transition-colors cursor-pointer"
            >
              <X size={13} /> Clear
            </button>
          )}
        </div>
      </div>

      {/* Table — desktop */}
      <div className="hidden md:block bg-card border border-border rounded-2xl overflow-hidden mb-5">
        <div
          className={`grid ${desktopTableCols} gap-4 px-5 py-3 border-b border-border items-center`}
        >
          {["Post", "Status", "Reading time", "Date", ""].map((h) => (
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
          data?.posts.map((post, i) => (
            <motion.div
              key={post.$id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.03 }}
              className={`grid ${desktopTableCols} gap-4 items-center px-5 py-3.5 border-b border-border last:border-b-0 hover:bg-white/[0.02] transition-colors`}
            >
              <div className="min-w-0">
                <p className="text-sm text-foreground truncate">{post.title}</p>
                <p className="text-xs text-muted truncate">{post.excerpt}</p>
              </div>
              <span
                className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full border w-fit ${
                  post.status === "published"
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                    : "bg-white/5 text-muted border-border"
                }`}
              >
                {post.status === "published" ? (
                  <Eye size={9} />
                ) : (
                  <EyeOff size={9} />
                )}
                {post.status}
              </span>
              <span className="flex items-center gap-1 text-xs text-muted">
                <Clock size={11} /> {post.readingTime} min
              </span>
              <span className="text-xs text-muted">
                {formatDate(post.$createdAt)}
              </span>
              <div className="flex items-center gap-1">
                {post.status === "published" && (
                  <Link
                    href={`/blog/${post.slug}`}
                    target="_blank"
                    className="p-1.5 rounded-lg text-muted hover:text-foreground hover:bg-white/5 transition-colors"
                    title="View live"
                  >
                    <ArrowUpRight size={14} />
                  </Link>
                )}
                <Link
                  href={`/admin/dashboard/blog/${post.$id}`}
                  className="p-1.5 rounded-lg text-muted hover:text-accent hover:bg-accent/5 transition-colors"
                  title="Edit"
                >
                  <Pencil size={14} />
                </Link>
                <button
                  onClick={() => {
                    setDeleteId(post.$id);
                    setDeleteTitle(post.title);
                  }}
                  className="p-1.5 rounded-lg text-muted hover:text-red-400 hover:bg-red-400/5 transition-colors bg-transparent border-0 cursor-pointer"
                  title="Delete"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </motion.div>
          ))}

        {!isPending && data?.posts.length === 0 && (
          <div className="flex items-center justify-center py-16 text-muted">
            <p className="text-sm">No posts found.</p>
          </div>
        )}
      </div>

      {/* Cards — mobile */}
      <div className="flex flex-col gap-3 md:hidden mb-5">
        {isPending &&
          Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-24 rounded-xl bg-card border border-border animate-pulse"
            />
          ))}
        {!isPending &&
          data?.posts.map((post, i) => (
            <motion.div
              key={post.$id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="flex gap-3 p-4 bg-card border border-border rounded-xl"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <p className="text-sm font-normal text-foreground truncate">
                    {post.title}
                  </p>
                  <div className="flex gap-1 shrink-0">
                    <Link
                      href={`/admin/dashboard/blog/${post.$id}`}
                      className="p-1 text-muted hover:text-accent transition-colors"
                    >
                      <Pencil size={13} />
                    </Link>
                    <button
                      onClick={() => {
                        setDeleteId(post.$id);
                        setDeleteTitle(post.title);
                      }}
                      className="p-1 text-muted hover:text-red-400 transition-colors bg-transparent border-0 cursor-pointer"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
                <p className="text-xs text-muted truncate mb-2">
                  {post.excerpt}
                </p>
                <div className="flex gap-2 flex-wrap">
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full border ${post.status === "published" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-white/5 text-muted border-border"}`}
                  >
                    {post.status}
                  </span>
                  <span className="text-[10px] text-muted flex items-center gap-1">
                    <Clock size={9} />
                    {post.readingTime} min
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        {!isPending && data?.posts.length === 0 && (
          <div className="flex items-center justify-center py-12 text-muted">
            <p className="text-sm">No posts found.</p>
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
                Delete post?
              </h3>
              <p className="text-sm text-foreground mb-1">
                &ldquo;{deleteTitle}&rdquo;
              </p>
              <p className="text-sm text-muted mb-7">This cannot be undone.</p>
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
