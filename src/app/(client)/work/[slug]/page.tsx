"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import { Loader2 } from "lucide-react";
import ProjectDetailClient from "../../../../components/pages/works/project-detail-client";
import { useProject, useProjects } from "@/hooks/projects.hook";

interface Props {
  params: Promise<{ slug: string }>;
}

export default function ProjectDetailPage({ params }: Props) {
  const { slug } = use(params);
  const { data: project, isPending, isError } = useProject(slug);
  const { data: allProjects } = useProjects();

  if (isPending) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center gap-3 text-muted">
        <Loader2 size={22} className="animate-spin" />
        <span className="text-sm tracking-wide">Loading project...</span>
      </div>
    );
  }

  if (isError || !project) notFound();

  const currentIndex = allProjects?.findIndex((p) => p.slug === slug) ?? -1;
  const prevProject =
    currentIndex > 0 ? (allProjects?.[currentIndex - 1] ?? null) : null;
  const nextProject =
    currentIndex !== -1 && currentIndex < (allProjects?.length ?? 0) - 1
      ? (allProjects?.[currentIndex + 1] ?? null)
      : null;

  return (
    <ProjectDetailClient
      project={project}
      prevProject={prevProject}
      nextProject={nextProject}
    />
  );
}
