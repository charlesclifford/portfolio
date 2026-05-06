"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowLeft, ExternalLink, Github, ChevronDown } from "lucide-react";
import { colorMap, type IProject } from "@/interfaces/project.interface";
import { getImagePreview } from "@/lib/api/projects.api";

interface Props {
  project: IProject;
  prevProject: IProject | null;
  nextProject: IProject | null;
}

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
};

export default function ProjectDetailClient({
  project,
  prevProject,
  nextProject,
}: Props) {
  const { bg, hex } = colorMap[project.color] ?? {
    bg: "bg-card",
    hex: "#27272a",
  };
  const isLight = project.textColor === "black";
  const imageUrl = project.imageId ? getImagePreview(project.imageId) : null;

  const textCls = isLight ? "text-black" : "text-white";
  const mutedCls = isLight ? "text-black/60" : "text-white/60";
  const borderCls = isLight ? "border-black/15" : "border-white/15";
  const pillCls = isLight ? "bg-black/[0.08]" : "bg-white/10";

  return (
    <div className="bg-background">
      {/* ── Hero — full viewport, image behind colour overlay ── */}
      <section
        className={`${bg} relative min-h-screen flex flex-col px-6 overflow-hidden`}
      >
        {/* Project image as hero background */}
        {imageUrl && (
          <div className="absolute inset-0">
            <Image
              src={imageUrl}
              alt={project.title}
              fill
              className="object-cover"
              priority
            />
            {/* Colour-tinted overlay so text stays legible and on-brand */}
            <div
              className="absolute inset-0"
              style={{ backgroundColor: `${hex}cc` }} // 80% opacity brand colour
            />
          </div>
        )}

        {/* Subtle texture (no-image fallback) */}
        {!imageUrl && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.04) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.03) 0%, transparent 40%)",
            }}
          />
        )}

        {/* Back link */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="relative z-10 max-w-[1280px] w-full mx-auto pt-20"
        >
          <Link
            href="/work"
            className={`inline-flex items-center gap-2 no-underline text-sm tracking-wide ${mutedCls} hover:opacity-100 transition-opacity`}
          >
            <ArrowLeft size={16} /> Back to Projects
          </Link>
        </motion.div>

        {/* Centre content */}
        <div className="relative z-10 flex-1 flex flex-col items-start justify-center max-w-[1280px] w-full mx-auto pt-10 pb-20">
          <motion.span
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.2 }}
            className={`block text-[11px] tracking-[0.12em] uppercase ${mutedCls} mb-5`}
          >
            Case Study · {project.year}
          </motion.span>

          <motion.h1
            {...fadeUp}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className={`text-[clamp(48px,9vw,112px)] font-light leading-none tracking-[-0.03em] ${textCls} mb-12 max-w-[900px]`}
          >
            {project.title}
          </motion.h1>

          <motion.div
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="flex flex-wrap gap-3"
          >
            {project.liveLink && (
              <Link
                href={project.liveLink}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full border ${borderCls} ${pillCls} no-underline text-sm ${textCls}`}
              >
                <ExternalLink size={13} /> Live Site
              </Link>
            )}
            {project.githubLink && project.projectType !== "private" && (
              <Link
                href={project.githubLink}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full border ${borderCls} ${pillCls} no-underline text-sm ${textCls}`}
              >
                <Github size={13} /> GitHub
              </Link>
            )}
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className={`absolute bottom-10 left-1/2 -translate-x-1/2 z-10 ${mutedCls}`}
        >
          <ChevronDown size={24} />
        </motion.div>
      </section>

      {/* ── Case Study Content ── */}
      <section className="bg-background px-6 py-[100px]">
        <div className="max-w-[800px] mx-auto">
          {/* Overview */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-20"
          >
            <p className="text-xs tracking-[0.12em] uppercase text-muted mb-5">
              Overview
            </p>
            <p className="text-[clamp(18px,2.5vw,24px)] font-light leading-[1.7] text-foreground">
              {project.description}
            </p>
          </motion.div>

          {/* Problem / Solution */}
          {(project.problem || project.solution) && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="grid grid-cols-2 max-sm:grid-cols-1 gap-8 mb-20"
            >
              {project.problem && (
                <div className="p-8 rounded-2xl bg-card border border-border">
                  <p className="text-[11px] tracking-[0.12em] uppercase text-muted mb-4">
                    The Challenge
                  </p>
                  <p className="text-[15px] leading-[1.7] text-foreground font-light">
                    {project.problem}
                  </p>
                </div>
              )}
              {project.solution && (
                <div className="p-8 rounded-2xl bg-card border border-border">
                  <p className="text-[11px] tracking-[0.12em] uppercase text-muted mb-4">
                    The Approach
                  </p>
                  <p className="text-[15px] leading-[1.7] text-foreground font-light">
                    {project.solution}
                  </p>
                </div>
              )}
            </motion.div>
          )}

          {/* Tech Stack */}
          {project.tech?.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-20"
            >
              <p className="text-xs tracking-[0.12em] uppercase text-muted mb-5">
                Tech Stack
              </p>
              <div className="flex flex-wrap gap-2.5">
                {project.tech.map((t) => (
                  <span
                    key={t}
                    className="px-4 py-2 rounded-full border border-border bg-card text-[13px] text-foreground font-normal"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </motion.div>
          )}

          {/* Results */}
          {project.results?.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-20"
            >
              <p className="text-xs tracking-[0.12em] uppercase text-muted mb-5">
                Results
              </p>
              <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-4">
                {project.results.map((result, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    className="p-7 rounded-2xl bg-card border border-border"
                  >
                    <div
                      className="w-2 h-2 rounded-full mb-4"
                      style={{ backgroundColor: hex }}
                    />
                    <p className="text-sm leading-relaxed text-foreground font-light">
                      {result}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* ── Project navigation ── */}
      <section className="border-t border-border px-6 py-[60px]">
        <div className="max-w-[1280px] mx-auto flex justify-between items-center gap-6 flex-wrap">
          {prevProject ? (
            <Link
              href={`/work/${prevProject.slug}`}
              className="no-underline flex-1 min-w-[200px]"
            >
              <motion.div
                whileHover={{ x: -4 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col gap-1.5"
              >
                <span className="text-[11px] tracking-widest uppercase text-muted">
                  ← Previous
                </span>
                <span className="text-xl font-light text-foreground">
                  {prevProject.title}
                </span>
              </motion.div>
            </Link>
          ) : (
            <div />
          )}

          {nextProject ? (
            <Link
              href={`/work/${nextProject.slug}`}
              className="no-underline flex-1 min-w-[200px] text-right"
            >
              <motion.div
                whileHover={{ x: 4 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col gap-1.5 items-end"
              >
                <span className="text-[11px] tracking-widest uppercase text-muted">
                  Next →
                </span>
                <span className="text-xl font-light text-foreground">
                  {nextProject.title}
                </span>
              </motion.div>
            </Link>
          ) : (
            <div />
          )}
        </div>
      </section>
    </div>
  );
}
