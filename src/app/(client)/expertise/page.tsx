"use client";

import SectionTitle from "@/components/shared/section-title";
import { motion } from "framer-motion";
import {
  Code2,
  Server,
  Container,
  Palette,
  Search,
  Lightbulb,
  Hammer,
  Rocket,
} from "lucide-react";

const disciplines = [
  {
    icon: Code2,
    title: "Frontend",
    description:
      "Pixel-perfect interfaces with a focus on performance and accessibility.",
    tech: [
      "React",
      "Next.js",
      "Vue",
      "Nuxt",
      "TypeScript",
      "Tailwind CSS",
      "Framer Motion",
      "Redux",
      "Zustand",
    ],
    bg: "bg-project-emerald",
    light: false,
  },
  {
    icon: Server,
    title: "Backend",
    description:
      "Scalable APIs, efficient databases, and reliable server architecture.",
    tech: [
      "Node.js",
      "Express",
      "NestJS",
      "PostgreSQL",
      "MongoDB",
      "Prisma",
      "REST API",
    ],
    bg: "bg-project-slate",
    light: false,
  },
  {
    icon: Container,
    title: "DevOps",
    description:
      "Containerised deployments, CI/CD pipelines, and infrastructure as code.",
    tech: ["Docker", "GitHub Actions", "Redis", "Nginx", "Vercel", "AWS"],
    bg: "bg-project-amber",
    light: false,
  },
  {
    icon: Palette,
    title: "Design",
    description:
      "Component libraries, design systems, and user-centred UI patterns.",
    tech: [
      "Figma",
      "Storybook",
      "Radix UI",
      "shadcn/ui",
      "WCAG",
      "Responsive Design",
    ],
    bg: "bg-project-pink",
    light: true,
  },
];

const techStack = [
  {
    category: "Frontend",
    color: "#065f46",
    items: [
      { name: "React", icon: "⚛" },
      { name: "Next.js", icon: "▲" },
      { name: "TypeScript", icon: "TS" },
      { name: "Tailwind CSS", icon: "🌊" },
      { name: "Framer Motion", icon: "◎" },
      { name: "Redux", icon: "⬡" },
      { name: "Zustand", icon: "🐻" },
      { name: "Vue.js", icon: "💚" },
      { name: "Nuxt", icon: "🌿" },
    ],
  },
  {
    category: "Backend",
    color: "#475569",
    items: [
      { name: "Node.js", icon: "⬡" },
      { name: "Express", icon: "⚡" },
      { name: "NestJS", icon: "🐱" },
      { name: "PostgreSQL", icon: "🐘" },
      { name: "MongoDB", icon: "🍃" },
      { name: "Prisma", icon: "◆" },
      { name: "Redis", icon: "⬤" },
    ],
  },
  {
    category: "DevOps & Tools",
    color: "#b45309",
    items: [
      { name: "Docker", icon: "🐳" },
      { name: "GitHub Actions", icon: "⚙" },
      { name: "Vercel", icon: "▲" },
      { name: "Appwrite", icon: "✦" },
      { name: "Git", icon: "⌥" },
      { name: "Figma", icon: "◈" },
      { name: "Postman", icon: "📮" },
    ],
  },
];

const processSteps = [
  {
    icon: Search,
    step: "01",
    title: "Discovery",
    description:
      "Understand the problem, constraints, and goals before writing a single line of code.",
  },
  {
    icon: Lightbulb,
    step: "02",
    title: "Design",
    description:
      "Architecture decisions, data modeling, and interface planning that inform the build.",
  },
  {
    icon: Hammer,
    step: "03",
    title: "Development",
    description:
      "Clean, typed, tested code. Regular check-ins and iterative delivery.",
  },
  {
    icon: Rocket,
    step: "04",
    title: "Deployment",
    description:
      "Optimized builds, CI/CD pipelines, monitoring, and post-launch support.",
  },
];

export default function ExpertisePage() {
  return (
    <div className="min-h-screen bg-background pt-[120px] pb-[120px]">
      <div className="max-w-[1280px] mx-auto px-6">
        {/* Header */}
        <SectionTitle
          eyebrow="Skills"
          title="Core"
          accent="Expertise"
          as="h1"
          className="mb-20"
        />

        {/* ── Core Disciplines ─────────────────────────────── */}
        <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-5 mb-[100px]">
          {disciplines.map((disc, i) => {
            const Icon = disc.icon;
            return (
              <motion.div
                key={disc.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.5,
                  delay: i * 0.1,
                  ease: [0.22, 1, 0.36, 1],
                }}
                whileHover={{ y: -6, scale: 1.01 }}
                className={`${disc.bg} ${disc.light ? "text-black" : "text-white"} rounded-[20px] p-9`}
              >
                <Icon size={28} className="mb-5 opacity-80" />
                <h3 className="text-2xl font-normal mb-3">{disc.title}</h3>
                <p className="text-sm opacity-75 leading-relaxed font-light mb-6">
                  {disc.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {disc.tech.map((t) => (
                    <span
                      key={t}
                      className={`text-[11px] px-2.5 py-1 rounded-full border ${
                        disc.light
                          ? "bg-black/[0.07] border-black/20"
                          : "bg-white/10 border-white/20"
                      }`}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* ── Technologies I Use ───────────────────────────── */}
        <SectionTitle
          eyebrow="Stack"
          title="Technologies I"
          accent="use"
          as="h2"
          className="mb-10"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-[100px]">
          {techStack.map((group, gi) => (
            <motion.div
              key={group.category}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.5,
                delay: gi * 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="bg-card border border-border rounded-2xl p-6 flex flex-col gap-4"
            >
              <div className="flex items-center gap-2.5">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: group.color }}
                />
                <p className="text-xs tracking-[0.1em] uppercase text-muted">
                  {group.category}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {group.items.map((tech, ti) => (
                  <motion.span
                    key={tech.name}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: gi * 0.1 + ti * 0.04 }}
                    whileHover={{ y: -2, scale: 1.05 }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-background text-sm text-foreground font-light cursor-default select-none"
                  >
                    <span className="text-[13px] leading-none">
                      {tech.icon}
                    </span>
                    {tech.name}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* ── The Process ──────────────────────────────────── */}
        <SectionTitle
          eyebrow="How I work"
          title="The Process"
          as="h2"
          className="mb-12"
        />

        <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-4">
          {processSteps.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="p-8 rounded-2xl bg-card border border-border"
              >
                <div className="flex items-center justify-between mb-5">
                  <Icon size={20} className="text-muted" />
                  <span className="text-[11px] tracking-widest text-muted">
                    {step.step}
                  </span>
                </div>
                <h3 className="text-lg font-normal text-foreground mb-2.5">
                  {step.title}
                </h3>
                <p className="text-sm text-muted leading-relaxed font-light">
                  {step.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
