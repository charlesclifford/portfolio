"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface SectionTitleProps {
  eyebrow?: string;
  title: string;
  accent?: string;
  accentAfter?: boolean;
  as?: "h1" | "h2" | "h3";
  className?: string;
  eyebrowClassName?: string;
  titleClassName?: string;
  description?: string;
  descriptionClassName?: string;
  animated?: boolean;
}

export default function SectionTitle({
  eyebrow,
  title,
  accent,
  accentAfter = true,
  as = "h2",
  className,
  eyebrowClassName,
  titleClassName,
  description,
  descriptionClassName,
  animated = true,
}: SectionTitleProps) {
  const HeadingTag = as;

  const content = (
    <div className={className}>
      {eyebrow && (
        <p
          className={cn(
            "text-xs tracking-[0.12em] uppercase text-muted mb-4",
            eyebrowClassName,
          )}
        >
          {eyebrow}
        </p>
      )}

      <HeadingTag
        className={cn(
          "text-[clamp(28px,4vw,44px)] font-light tracking-[-0.02em] text-foreground",
          as === "h1" && "text-[clamp(40px,6vw,72px)]",
          titleClassName,
        )}
      >
        {accent && !accentAfter && (
          <>
            <em className="font-display font-normal italic text-accent">
              {accent}
            </em>{" "}
          </>
        )}

        {title}

        {accent && accentAfter && (
          <>
            {" "}
            <em className="font-display font-normal italic text-accent">
              {accent}
            </em>
          </>
        )}
      </HeadingTag>

      {description && (
        <p
          className={cn(
            "text-muted font-light mt-4 max-w-[480px]",
            descriptionClassName,
          )}
        >
          {description}
        </p>
      )}
    </div>
  );

  if (!animated) return content;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      animate={as === "h1" ? { opacity: 1, y: 0 } : undefined}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={cn(as === "h1" && "mb-20")}
    >
      {content}
    </motion.div>
  );
}
