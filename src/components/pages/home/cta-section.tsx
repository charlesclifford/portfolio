"use client";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import React from "react";

const CTASection = () => {
  return (
    <section className="py-20 md:py-32 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto text-center"
      >
        <h2 className="text-3xl md:text-5xl font-light text-foreground mb-6 tracking-[-0.02em]">
          Ready to build something{" "}
          <em className="font-display italic text-accent font-normal">
            amazing?
          </em>
        </h2>
        <p className="text-muted text-lg mb-8 max-w-xl mx-auto font-light">
          Let&apos;s collaborate on your next project. I&apos;m always open to
          discussing new opportunities.
        </p>
        <Link href="/contact" className="no-underline">
          <motion.span
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-2 px-8 py-4 bg-accent text-black rounded-full font-medium transition-all cursor-pointer text-sm hover:bg-accent/90"
          >
            Start a Conversation
            <ArrowRight size={16} />
          </motion.span>
        </Link>
      </motion.div>
    </section>
  );
};

export default CTASection;
