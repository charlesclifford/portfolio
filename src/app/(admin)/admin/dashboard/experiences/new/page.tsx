"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ExperienceForm from "@/components/admin/experiences/experience-form";
import { CreateExperienceDTO } from "@/interfaces/experience.interface";
import { useCreateExperience } from "@/hooks/experience.hook";

export default function NewExperiencePage() {
  const router = useRouter();
  const { mutateAsync: createExperience, isPending } = useCreateExperience();

  const handleSubmit = async (data: CreateExperienceDTO) => {
    await createExperience(data);
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
          href="/admin/dashboard/experiences"
          className="inline-flex items-center gap-1.5 text-xs text-muted no-underline hover:text-foreground transition-colors mb-5"
        >
          <ArrowLeft size={13} /> Back to Experience
        </Link>
        <p className="text-xs tracking-[0.1em] uppercase text-muted mb-1">
          Add
        </p>
        <h1 className="text-3xl font-light text-foreground">New Experience</h1>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <ExperienceForm onSubmit={handleSubmit} submitting={isPending} />
      </motion.div>
    </div>
  );
}
