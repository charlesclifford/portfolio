"use client";
import { useProfile } from "@/hooks/user.hook";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import React from "react";

const HeroSection = () => {
  const { data: profile } = useProfile();

  const heroBadge = profile?.heroBadge ?? null;
  const tagline =
    profile?.tagline ??
    "Full Stack Developer crafting scalable solutions with modern technologies. Based in Port Harcourt, Nigeria.";
  const location = profile?.location ?? "Port Harcourt, Nigeria";
  const title = profile?.title ?? "Full Stack Developer";

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ x: [0, 100, 0], y: [0, -50, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{ x: [0, -100, 0], y: [0, 50, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-[120px]"
        />
      </div>

      {/* Hero content — centered */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 md:text-center">
        {/* badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="inline-flex items-center gap-2 mb-8 px-4 py-1.5 border border-border rounded-full text-xs tracking-widest uppercase text-muted"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-accent inline-block" />
          {heroBadge ?? `${title} · ${location}`}
        </motion.div>

        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <h1 className="text-[clamp(48px,8vw,96px)] font-light leading-[1.05] tracking-[-0.02em] text-foreground mb-8">
            Ship less.
            <br />
            Engineer{" "}
            <em className="font-display italic text-accent font-normal">
              more.
            </em>
          </h1>
        </motion.div>

        {/* Sub-copy */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="text-lg text-muted max-w-2xl md:mx-auto leading-relaxed mb-12 font-light"
        >
          {tagline}
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-wrap md:justify-center gap-4"
        >
          <Link href="/work" className="no-underline">
            <motion.span
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-accent text-black rounded-full text-sm font-medium tracking-wide cursor-pointer"
            >
              View Projects <ArrowUpRight size={16} />
            </motion.span>
          </Link>
          <Link href="/contact" className="no-underline">
            <motion.span
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-transparent text-foreground border border-border rounded-full text-sm font-normal tracking-wide cursor-pointer"
            >
              Get in Touch
            </motion.span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
