"use client";

import ProjectCard from "@/components/pages/works/project-card";
import SectionTitle from "@/components/shared/section-title";
import { useProjects } from "@/hooks/projects.hook";

export default function WorkPage() {
  const { data: projects, isPending, isError } = useProjects();

  return (
    <div className="min-h-screen bg-background pt-[120px] pb-[120px]">
      <div className="max-w-[1280px] mx-auto px-6">
        {/* Header */}
        <SectionTitle
          eyebrow="Portfolio"
          title="Selected"
          accent="Works"
          as="h1"
        />

        {/* Loading skeleton */}
        {isPending && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="rounded-[20px] bg-card border border-border animate-pulse"
                style={{ height: "420px" }}
              />
            ))}
          </div>
        )}

        {/* Error */}
        {isError && (
          <div className="flex flex-col items-center justify-center min-h-[400px] gap-3 text-muted text-center">
            <p className="text-base text-foreground">Failed to load projects</p>
            <p className="text-sm">
              Check your Appwrite configuration and try again.
            </p>
          </div>
        )}

        {/* Grid */}
        {projects && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {projects.map((project, i) => {
              return <ProjectCard key={project.$id} project={project} i={i} />;
            })}
          </div>
        )}
      </div>
    </div>
  );
}
