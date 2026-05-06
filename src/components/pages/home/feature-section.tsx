"use client";
import SectionTitle from "@/components/shared/section-title";
import { useProjects } from "@/hooks/projects.hook";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import ProjectCard from "../works/project-card";

const FeatureSection = () => {
  const { data: projects } = useProjects();
  const featured = projects?.filter((p) => p.featured) ?? [];

  if (featured.length === 0) {
    return null;
  }

  return (
    <section className="px-6 pb-[120px]">
      <div className="max-w-[1280px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex items-end justify-between mb-8"
        >
          <SectionTitle
            eyebrow="Selected Work"
            title="Featured"
            accent="Projects"
            as="h2"
          />

          <Link
            href="/work"
            className="hidden sm:inline-flex items-center gap-1.5 text-sm text-muted no-underline hover:text-foreground transition-colors"
          >
            View all <ArrowUpRight size={14} />
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {featured.map((project, i) => {
            return <ProjectCard key={project.$id} project={project} i={i} />;
          })}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex justify-center mt-8 sm:hidden"
        >
          <Link
            href="/work"
            className="inline-flex items-center gap-1.5 text-sm text-muted no-underline hover:text-foreground transition-colors"
          >
            View all projects <ArrowUpRight size={14} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default FeatureSection;
