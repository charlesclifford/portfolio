import { colorMap, IProject } from "@/interfaces/project.interface";
import { getImagePreview } from "@/lib/api/projects.api";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const ProjectCard = ({ project, i }: { project: IProject; i: number }) => {
  const { bg, hex } = colorMap[project.color] ?? {
    bg: "bg-card",
    hex: "#27272a",
  };
  const isLight = project.textColor === "black";
  const imageUrl = project.imageId ? getImagePreview(project.imageId) : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.6,
        delay: i * 0.08,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <Link href={`/work/${project.slug}`} className="no-underline block group">
        <motion.div
          whileHover={{ y: -8 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className={`${bg} rounded-[20px] overflow-hidden flex flex-col cursor-pointer relative`}
          style={{ minHeight: imageUrl ? "420px" : "320px" }}
        >
          {/* Image */}
          {imageUrl && (
            <div
              className="relative w-full overflow-hidden"
              style={{ height: "240px" }}
            >
              <Image
                src={imageUrl}
                alt={project.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                
              />
              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(to bottom, transparent 40%, ${hex} 100%)`,
                }}
              />
              
              <motion.div
                className={`absolute top-4 right-4 p-2 rounded-full backdrop-blur-sm border ${
                  isLight
                    ? "border-black/20 bg-black/10 text-black/60"
                    : "border-white/20 bg-black/20 text-white/60"
                }`}
              >
                <ArrowUpRight
                  size={16}
                  className="transition-transform duration-300 group-hover:rotate-45"
                />
              </motion.div>
            </div>
          )}

          {/* Content */}
          <div
            className={`flex flex-col flex-1 p-8 ${isLight ? "text-black" : "text-white"}`}
          >
            {!imageUrl && (
              <div className="flex items-center justify-end mb-auto">
                
                <ArrowUpRight
                  size={20}
                  className="opacity-60 transition-transform duration-300 group-hover:rotate-45"
                />
              </div>
            )}

            {project.featured && (
              <span
                className={`inline-flex items-center self-start text-[10px] tracking-wider uppercase px-2.5 py-1 rounded-full border mb-3 ${
                  isLight
                    ? "border-black/20 bg-black/10"
                    : "border-white/20 bg-white/10"
                }`}
              >
                ★ Featured
              </span>
            )}

            <h2
              className={`font-normal tracking-[-0.01em] leading-[1.15] mb-3 ${
                imageUrl
                  ? "text-[clamp(20px,2.5vw,28px)] mt-0"
                  : "text-[clamp(24px,3vw,36px)] mt-10"
              }`}
            >
              {project.title}
            </h2>

            <p
              className={`text-[15px] leading-relaxed font-light mb-5 ${isLight ? "text-black/70" : "text-white/70"}`}
            >
              {project.summary}
            </p>

            <div className="flex flex-wrap gap-2 mt-auto">
              {project.tags?.map((tag) => (
                <span
                  key={tag}
                  className={`text-[11px] tracking-wide px-3 py-1 rounded-full border ${
                    isLight
                      ? "bg-black/[0.08] border-black/20"
                      : "bg-white/10 border-white/20"
                  }`}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
};

export default ProjectCard;
