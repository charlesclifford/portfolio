"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import ProjectForm from "@/components/admin/projects/project-form";
import { CreateProjectDTO } from "@/interfaces/project.interface";
import { useProjectById, useUpdateProject } from "@/hooks/projects.hook";

interface Props {
  params: Promise<{ id: string }>;
}

export default function EditProjectPage({ params }: Props) {
  const { id } = use(params);
  const router = useRouter();

  const { data: project, isPending: loading } = useProjectById(id);
  const { mutateAsync: updateProject, isPending: saving } = useUpdateProject();

  const handleSubmit = async (data: CreateProjectDTO) => {
    await updateProject({ id, data });
    router.push("/admin/dashboard/projects");
  };

  return (
    <div className="px-8 py-10 max-w-[780px]">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <Link
          href="/admin/dashboard/projects"
          className="inline-flex items-center gap-1.5 text-xs text-muted no-underline hover:text-foreground transition-colors mb-5"
        >
          <ArrowLeft size={13} /> Back to Projects
        </Link>
        <p className="text-xs tracking-[0.1em] uppercase text-muted mb-1">
          Edit
        </p>
        <h1 className="text-3xl font-light text-foreground">
          {loading ? "Loading..." : project?.title}
        </h1>
      </motion.div>

      {loading && (
        <div className="flex items-center gap-3 text-muted">
          <Loader2 size={16} className="animate-spin" />
          <span className="text-sm">Loading project...</span>
        </div>
      )}

      {project && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <ProjectForm
            initial={project}
            onSubmit={handleSubmit}
            submitting={saving}
          />
        </motion.div>
      )}
    </div>
  );
}
