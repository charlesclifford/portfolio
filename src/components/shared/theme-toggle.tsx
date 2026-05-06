"use client";

import { motion } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

interface ThemeToggleProps {
  className?: string;
}

export default function ThemeToggle({ className = "" }: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = resolvedTheme === "dark";

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <motion.button
      type="button"
      onClick={toggleTheme}
      whileHover={{ rotate: 180 }}
      transition={{ duration: 0.3 }}
      aria-label="Toggle theme"
      className={`w-9 h-9 rounded-full border border-border flex items-center justify-center bg-transparent text-muted cursor-pointer hover:text-foreground transition-colors ${className}`}
    >
      {!mounted ? (
        <Sun size={14} />
      ) : isDark ? (
        <Sun size={14} />
      ) : (
        <Moon size={14} />
      )}
    </motion.button>
  );
}