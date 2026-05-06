"use client";

import SectionTitle from "@/components/shared/section-title";
import { useExperiences } from "@/hooks/experience.hook";
import { useProfile } from "@/hooks/user.hook";
import { motion } from "framer-motion";
import {
  MapPin,
  Mail,
  Github,
  Linkedin,
  ExternalLink,
  Loader2,
  Twitter,
} from "lucide-react";

/** "2023-04" → "Apr 2023" */
function fmtMonth(iso: string) {
  const [y, m] = iso.split("-");
  return new Date(Number(y), Number(m) - 1).toLocaleDateString("en-GB", {
    month: "short",
    year: "numeric",
  });
}

function Period({
  startDate,
  endDate,
  isCurrent,
}: {
  startDate: string;
  endDate: string | null;
  isCurrent: boolean;
}) {
  const start = fmtMonth(startDate);
  const end = isCurrent ? "Present" : endDate ? fmtMonth(endDate) : "Present";
  return (
    <span className="text-xs text-muted tracking-wide whitespace-nowrap">
      {start} – {end}
    </span>
  );
}

export default function AboutPage() {
  const { data: profile, isPending: loadingProfile } = useProfile();
  const { data: experiences, isPending: loadingExp } = useExperiences();

  const stats = [
    { value: profile?.yearsExperience ?? "3+", label: "Years Experience" },
    { value: profile?.projectsShipped ?? "15+", label: "Projects Shipped" },
    { value: profile?.happyClients ?? "8+", label: "Happy Clients" },
    { value: "6", label: "Languages / Frameworks" },
  ];

  const contactLinks = [
    profile?.location && { icon: MapPin, text: profile.location, href: null },
    profile?.email && {
      icon: Mail,
      text: profile.email,
      href: `mailto:${profile.email}`,
    },
    profile?.githubUrl && {
      icon: Github,
      text: profile.githubUrl.replace("https://", ""),
      href: profile.githubUrl,
    },
    profile?.linkedinUrl && {
      icon: Linkedin,
      text: profile.linkedinUrl.replace("https://", ""),
      href: profile.linkedinUrl,
    },
    profile?.twitterUrl && {
      icon: Twitter,
      text: profile.twitterUrl.replace("https://", ""),
      href: profile.twitterUrl,
    },
  ].filter(Boolean) as {
    icon: React.ElementType;
    text: string;
    href: string | null;
  }[];

  return (
    <div className="min-h-screen bg-background pt-[120px] pb-[120px]">
      <div className="max-w-[1280px] mx-auto px-6">
        {/* Header */}
        <SectionTitle eyebrow="The Person" title="About" accent="Me" as="h1" />
        {/* Two columns */}
        <div className="grid grid-cols-[1fr_1.6fr] max-md:grid-cols-1 gap-[60px] mb-20 items-start">
          {/* Left — avatar + contact */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="aspect-square rounded-[20px] bg-card border border-border flex items-center justify-center relative overflow-hidden max-w-[400px]">
              <span className="text-[72px] font-light text-muted font-display italic">
                {profile?.name
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("") ?? "JM"}
              </span>

              {/* Availability badge */}
              {(profile?.isAvailable ?? true) && (
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 bg-accent/15 border border-accent/30 rounded-full whitespace-nowrap">
                  <motion.div
                    animate={{ scale: [1, 1.4, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-1.5 h-1.5 rounded-full bg-accent"
                  />
                  <span className="text-xs text-accent tracking-wide">
                    {profile?.availabilityNote ?? "Available for freelance"}
                  </span>
                </div>
              )}
            </div>

            {/* Contact links */}
            {loadingProfile ? (
              <div className="mt-6 flex items-center gap-2 text-muted">
                <Loader2 size={14} className="animate-spin" />
                <span className="text-sm">Loading...</span>
              </div>
            ) : (
              <div className="mt-6 flex flex-col gap-2.5">
                {contactLinks.map(({ icon: Icon, text, href }) => (
                  <div key={text} className="flex items-center gap-2.5">
                    <Icon size={15} className="text-muted shrink-0" />
                    {href ? (
                      <a
                        href={href}
                        target={
                          href.startsWith("mailto") ? undefined : "_blank"
                        }
                        rel="noopener noreferrer"
                        className="text-sm text-muted no-underline hover:text-foreground transition-colors"
                      >
                        {text}
                      </a>
                    ) : (
                      <span className="text-sm text-muted">{text}</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Right — bio + timeline */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Bio */}
            {loadingProfile ? (
              <div className="flex items-center gap-2 text-muted mb-12">
                <Loader2 size={14} className="animate-spin" />
                <span className="text-sm">Loading...</span>
              </div>
            ) : (
              <div className="text-[clamp(16px,2vw,20px)] font-light leading-[1.8] text-foreground mb-12 whitespace-pre-line">
                {profile?.bio ??
                  "Full-stack developer focused on building clean, performant web products."}
              </div>
            )}

            <p className="text-xs tracking-[0.12em] uppercase text-muted mb-6">
              Experience
            </p>

            {/* Loading */}
            {loadingExp && (
              <div className="flex items-center gap-2 text-muted">
                <Loader2 size={14} className="animate-spin" />
                <span className="text-sm">Loading experience...</span>
              </div>
            )}

            {/* Timeline */}
            {!loadingExp && experiences && experiences.length > 0 && (
              <div className="flex flex-col">
                {experiences.map((exp, i) => (
                  <motion.div
                    key={exp.$id}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.08 }}
                    className="flex gap-6 pb-10 relative"
                  >
                    {/* Timeline dot + line */}
                    <div className="flex flex-col items-center shrink-0">
                      <div
                        className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${exp.isCurrent ? "bg-accent" : "bg-border"}`}
                      />
                      {i < experiences.length - 1 && (
                        <div className="w-px flex-1 bg-border mt-2" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start flex-wrap gap-1 mb-1">
                        <span className="text-base font-normal text-foreground">
                          {exp.role}
                        </span>
                        <Period
                          startDate={exp.startDate}
                          endDate={exp.endDate}
                          isCurrent={exp.isCurrent}
                        />
                      </div>

                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        {exp.companyUrl ? (
                          <a
                            href={exp.companyUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-accent no-underline hover:opacity-80 flex items-center gap-1 transition-opacity"
                          >
                            {exp.company} <ExternalLink size={11} />
                          </a>
                        ) : (
                          <span className="text-sm text-accent">
                            {exp.company}
                          </span>
                        )}
                        <span className="text-[10px] px-2 py-0.5 rounded-full border border-border bg-card text-muted capitalize">
                          {exp.employmentType.replace("-", " ")}
                        </span>
                        {exp.location && (
                          <span className="text-xs text-muted flex items-center gap-1">
                            <MapPin size={10} /> {exp.location}
                          </span>
                        )}
                      </div>

                      <p className="text-sm text-muted leading-relaxed font-light mb-3">
                        {exp.description}
                      </p>

                      {exp.highlights?.length > 0 && (
                        <ul className="flex flex-col gap-1 mb-3">
                          {exp.highlights.map((h, j) => (
                            <li
                              key={j}
                              className="flex items-start gap-2 text-sm text-muted font-light"
                            >
                              <span className="mt-1.5 w-1 h-1 rounded-full bg-accent shrink-0" />
                              {h}
                            </li>
                          ))}
                        </ul>
                      )}

                      {exp.technologies?.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {exp.technologies.map((t) => (
                            <span
                              key={t}
                              className="text-[11px] px-2.5 py-0.5 rounded-full border border-border bg-card text-muted"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {!loadingExp && (!experiences || experiences.length === 0) && (
              <p className="text-sm text-muted font-light">
                No experience entries yet.
              </p>
            )}
          </motion.div>
        </div>
        {/* Stats */}
        <div className="grid grid-cols-4 max-md:grid-cols-2 gap-4 border-t border-border pt-[60px]">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="p-7 rounded-2xl bg-card border border-border text-center"
            >
              <div className="text-[clamp(28px,4vw,44px)] font-light text-foreground tracking-[-0.02em] mb-1.5 font-display italic">
                {stat.value}
              </div>
              <div className="text-[13px] text-muted tracking-wide">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
