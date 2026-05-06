"use client";
import { motion } from "framer-motion";
import { Code2, Smartphone, Palette, Server } from "lucide-react";
import React from "react";

const disciplines = [
  {
    icon: Code2,
    title: "Frontend",
    desc: "React, Next.js, TypeScript — interfaces that perform.",
    bg: "bg-project-emerald",
    light: false,
  },
  {
    icon: Server,
    title: "Backend",
    desc: "Node.js, APIs, databases — systems built to scale.",
    bg: "bg-project-slate",
    light: false,
  },
  {
    icon: Smartphone,
    title: "Mobile",
    desc: "Responsive-first. Works everywhere, always.",
    bg: "bg-project-amber",
    light: false,
  },
  {
    icon: Palette,
    title: "Design",
    desc: "Clean systems, clear hierarchy, refined UI.",
    bg: "bg-project-pink",
    light: true,
  },
];

const CoreSection = () => {
  return (
    <section className="px-6 pb-24">
      <div className="max-w-[1280px] mx-auto">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-xs tracking-[0.12em] uppercase text-muted mb-6"
        >
          Core Disciplines
        </motion.p>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-4">
          {disciplines.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.5,
                  delay: i * 0.1,
                  ease: [0.22, 1, 0.36, 1],
                }}
                whileHover={{ y: -8, scale: 1.02 }}
                className={`${item.bg} ${item.light ? "text-black" : "text-white"} rounded-[20px] p-8 cursor-default`}
              >
                <Icon size={28} className="mb-5 opacity-80" />
                <h3 className="text-[22px] font-normal mb-2.5">{item.title}</h3>
                <p className="text-sm opacity-75 leading-relaxed font-light">
                  {item.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CoreSection;
