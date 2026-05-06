"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import ThemeToggle from "./theme-toggle";

const navLinks = [
  { href: "/work", label: "Work", num: "01" },
  { href: "/blog", label: "Blog", num: "02" },
  { href: "/expertise", label: "Expertise", num: "03" },
  { href: "/about", label: "About", num: "04" },
  { href: "/contact", label: "Contact", num: "05" },
];

export default function Navigation() {
  const pathname = usePathname();
  const { resolvedTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Lock body scroll when menu open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const isDark = resolvedTheme === "dark";

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "border-b border-border backdrop-blur-[16px] " +
              (isDark ? "bg-black/85" : "bg-white/85")
            : "border-b border-transparent bg-transparent"
        }`}
      >
        <div className="max-w-[1280px] mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="no-underline flex items-center gap-px z-50 relative"
          >
            <span className="font-mono-logo text-[18px] font-medium text-accent">
              Ns
            </span>
            <span className="text-[18px] font-medium text-foreground">
              Cliff
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm tracking-[0.05em] no-underline transition-colors duration-200 hover:text-foreground ${
                  pathname === link.href ? "text-accent" : "text-muted"
                }`}
              >
                {link.label}
              </Link>
            ))}

            <ThemeToggle />
          </div>

          {/* Mobile controls */}
          <div className="flex md:hidden items-center gap-2 z-[60] relative">
            <ThemeToggle />

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="w-9 h-9 flex items-center justify-center bg-transparent border-0 cursor-pointer text-foreground"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
            >
              <AnimatePresence mode="wait" initial={false}>
                {menuOpen ? (
                  <motion.span
                    key="x"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <X size={20} />
                  </motion.span>
                ) : (
                  <motion.span
                    key="menu"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Menu size={20} />
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </nav>

      {/* ── Full-screen mobile menu overlay ──────────────── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className={`fixed inset-0 z-[55] flex flex-col h-[100dvh] md:hidden ${
              isDark
                ? "bg-[#080808]/95 backdrop-blur-xl"
                : "bg-white/95 backdrop-blur-xl"
            }`}
          >
            {/* Top bar inside menu */}
            <div className="flex items-center justify-between px-6 h-16 border-b border-border shrink-0">
              <Link
                href="/"
                className="no-underline flex items-center gap-px"
                onClick={() => setMenuOpen(false)}
              >
                <span className="font-mono-logo text-[18px] font-medium text-accent">
                  i
                </span>
                <span className="text-[18px] font-medium text-foreground">
                  Onidev
                </span>
              </Link>
              <button
                onClick={() => setMenuOpen(false)}
                className="w-9 h-9 flex items-center justify-center bg-transparent border-0 cursor-pointer text-muted hover:text-foreground transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Nav links — large, centered feel */}
            <div className="flex-1 flex flex-col justify-center px-8 py-10 overflow-y-auto">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 12 }}
                  transition={{
                    delay: i * 0.07,
                    duration: 0.4,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className={`flex items-center justify-between py-5 border-b border-border/50 no-underline group ${
                      pathname === link.href ? "text-accent" : "text-foreground"
                    }`}
                  >
                    <div className="flex items-baseline gap-5">
                      <span className="text-[11px] tracking-widest text-muted tabular-nums">
                        {link.num}
                      </span>
                      <span className="text-[32px] font-light tracking-[-0.02em] leading-none">
                        {link.label}
                      </span>
                    </div>
                    <ArrowUpRight
                      size={20}
                      className={`transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 ${
                        pathname === link.href ? "text-accent" : "text-muted"
                      }`}
                    />
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Bottom CTA */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.4 }}
              className="px-8 py-8 border-t border-border shrink-0"
            >
              <p className="text-xs text-muted mb-4 tracking-wide">
                Available for freelance work
              </p>
              <Link
                href="/contact"
                onClick={() => setMenuOpen(false)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-black rounded-full text-sm font-medium no-underline hover:opacity-90 transition-opacity"
              >
                Get in Touch <ArrowUpRight size={14} />
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
