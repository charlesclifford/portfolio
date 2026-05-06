"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import ExperienceForm from "@/components/admin/experiences/experience-form";
import { CreateExperienceDTO } from "@/interfaces/experience.interface";
import {
  useExperienceById,
  useUpdateExperience,
} from "@/hooks/experience.hook";

interface Props {
  params: Promise<{ id: string }>;
}

export default function EditExperiencePage({ params }: Props) {
  const { id } = use(params);
  const router = useRouter();
  const { data: experience, isPending: loading } = useExperienceById(id);
  const { mutateAsync: updateExperience, isPending: saving } =
    useUpdateExperience();

  const handleSubmit = async (data: CreateExperienceDTO) => {
    await updateExperience({ id, data });
    router.push("/admin/dashboard/experiences");
  };

  return (
    <div className="px-4 md:px-8 py-6 md:py-10 max-w-[780px]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <Link
          href="/admin/dashboard/experience"
          className="inline-flex items-center gap-1.5 text-xs text-muted no-underline hover:text-foreground transition-colors mb-5"
        >
          <ArrowLeft size={13} /> Back to Experience
        </Link>
        <p className="text-xs tracking-[0.1em] uppercase text-muted mb-1">
          Edit
        </p>
        <h1 className="text-3xl font-light text-foreground">
          {loading ? "Loading..." : experience?.role}
        </h1>
      </motion.div>

      {loading && (
        <div className="flex items-center gap-3 text-muted">
          <Loader2 size={16} className="animate-spin" />
          <span className="text-sm">Loading experience...</span>
        </div>
      )}

      {experience && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <ExperienceForm
            initial={experience}
            onSubmit={handleSubmit}
            submitting={saving}
          />
        </motion.div>
      )}
    </div>
  );
}
