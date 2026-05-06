"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import ProjectForm from "@/components/admin/projects/project-form";
import { CreateProjectDTO } from "@/interfaces/project.interface";
import { useCreateProject } from "@/hooks/projects.hook";

export default function NewProjectPage() {
  const router = useRouter();
  const { mutateAsync: createProject, isPending } = useCreateProject();

  const handleSubmit = async (data: CreateProjectDTO) => {
    await createProject(data);
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
          Create
        </p>
        <h1 className="text-3xl font-light text-foreground">New Project</h1>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <ProjectForm onSubmit={handleSubmit} submitting={isPending} />
      </motion.div>
    </div>
  );
}
