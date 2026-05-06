"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Plus,
  FolderOpen,
  Star,
  Eye,
  Lock,
  Globe,
  ArrowUpRight,
  FileEdit,
} from "lucide-react";
import { formatDate } from "@/utils/helpers";
import Image from "next/image";
import { useProjects } from "@/hooks/projects.hook";
import { colorMap } from "@/interfaces/project.interface";
import { useCurrentUser } from "@/hooks/user.hook";

export default function DashboardPage() {
  const { data: user } = useCurrentUser();
  const { data: projects, isPending } = useProjects();

  const total = projects?.length ?? 0;
  const featured = projects?.filter((p) => p.featured).length ?? 0;
  const published = projects?.filter((p) => p.isPublished).length ?? 0;
  const drafts = projects?.filter((p) => !p.isPublished).length ?? 0;
  const pub = projects?.filter((p) => p.projectType === "public").length ?? 0;
  const priv = projects?.filter((p) => p.projectType === "private").length ?? 0;

  const stats = [
    { label: "Total", value: total, icon: FolderOpen, color: "text-accent" },
    { label: "Featured", value: featured, icon: Star, color: "text-amber-400" },
    {
      label: "Published",
      value: published,
      icon: Eye,
      color: "text-emerald-400",
    },
    { label: "Drafts", value: drafts, icon: FileEdit, color: "text-muted" },
    { label: "Public", value: pub, icon: Globe, color: "text-sky-400" },
    { label: "Private", value: priv, icon: Lock, color: "text-violet-400" },
  ];

  return (
    <div className="px-4 md:px-8 py-6 md:py-10 max-w-[1100px]">
      {/* ── Header ──────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <p className="text-xs tracking-[0.1em] uppercase text-muted mb-1">
          Welcome back
        </p>
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <h1 className="text-2xl md:text-3xl font-light text-foreground">
            {user?.name ?? user?.email ?? "Admin"}
          </h1>
          <Link
            href="/admin/dashboard/projects/new"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-accent text-black rounded-xl text-sm font-medium no-underline"
          >
            <Plus size={14} /> New Project
          </Link>
        </div>
      </motion.div>

      {/* ── Stats grid ──────────────────────────────────────── */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-8">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className="bg-card border border-border rounded-2xl p-4 flex flex-col gap-2"
            >
              <Icon size={15} className={stat.color} />
              <div className="text-2xl font-light text-foreground">
                {isPending ? "—" : stat.value}
              </div>
              <div className="text-[10px] uppercase tracking-wide text-muted">
                {stat.label}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* ── Recent projects ─────────────────────────────────── */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-normal text-foreground tracking-wide uppercase text-muted">
          Recent Projects
        </h2>
        <Link
          href="/admin/dashboard/projects"
          className="inline-flex items-center gap-1 text-xs text-accent no-underline hover:opacity-80 transition-opacity"
        >
          View all <ArrowUpRight size={12} />
        </Link>
      </div>

      <div className="flex flex-col gap-2">
        {/* Skeletons */}
        {isPending &&
          Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-[68px] rounded-xl bg-card border border-border animate-pulse"
            />
          ))}

        {projects?.slice(0, 8).map((project, i) => {
          const { hex } = colorMap[project.color] ?? { hex: "#27272a" };
          return (
            <motion.div
              key={project.$id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: i * 0.04 }}
              className="flex items-center gap-3 p-3 md:p-4 bg-card border border-border rounded-xl hover:bg-white/[0.02] transition-colors"
            >
              {/* Thumbnail or color dot */}
              {project.imageUrl ? (
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg overflow-hidden shrink-0 relative border border-border">
                  <Image
                    src={project.imageUrl}
                    alt={project.title}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              ) : (
                <div
                  className="w-10 h-10 md:w-12 md:h-12 rounded-lg shrink-0"
                  style={{ backgroundColor: hex }}
                />
              )}

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-normal text-foreground truncate">
                  {project.title}
                </p>
                <p className="text-xs text-muted">
                  {formatDate(project.$createdAt)}
                </p>
              </div>

              {/* Badges */}
              <div className="flex items-center gap-1.5 shrink-0">
                {/* Type badge */}
                <span
                  className={`hidden sm:inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full border ${
                    project.projectType === "public"
                      ? "bg-sky-500/10 text-sky-400 border-sky-500/20"
                      : "bg-violet-500/10 text-violet-400 border-violet-500/20"
                  }`}
                >
                  {project.projectType === "public" ? (
                    <Globe size={9} />
                  ) : (
                    <Lock size={9} />
                  )}
                  {project.projectType}
                </span>

                {/* Published badge */}
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full border ${
                    project.isPublished
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                      : "bg-white/5 text-muted border-border"
                  }`}
                >
                  {project.isPublished ? "Published" : "Draft"}
                </span>

                {project.featured && (
                  <span className="hidden sm:inline text-[10px] px-2 py-0.5 rounded-full bg-amber-400/10 text-amber-400 border border-amber-400/20">
                    ★
                  </span>
                )}

                <Link
                  href={`/admin/dashboard/projects/${project.$id}`}
                  className="p-1.5 text-muted hover:text-foreground transition-colors"
                >
                  <ArrowUpRight size={14} />
                </Link>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
