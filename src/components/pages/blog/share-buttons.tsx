"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Share2,
  Link as LinkIcon,
  Twitter,
  Linkedin,
  Check,
} from "lucide-react";

interface Props {
  url: string;
  title: string;
  excerpt: string;
}

export default function ShareButtons({ url, title, excerpt }: Props) {
  const [copied, setCopied] = useState(false);

  const absoluteUrl = url.startsWith("http")
    ? url
    : `https://NsCliff.com${url}`;

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, text: excerpt, url: absoluteUrl });
      } catch {
        // User dismissed — no-op
      }
      return;
    }
    // Fallback: copy link
    handleCopy();
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(absoluteUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard not available
    }
  };

  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(absoluteUrl)}`;
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(absoluteUrl)}`;

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-xs tracking-[0.08em] uppercase text-muted">
        Share
      </span>

      {/* Native share / copy */}
      <motion.button
        onClick={handleNativeShare}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border bg-card text-muted hover:text-foreground hover:border-accent transition-colors text-xs cursor-pointer bg-transparent"
        title="Share"
      >
        <Share2 size={13} /> Share
      </motion.button>

      {/* Copy link */}
      <motion.button
        onClick={handleCopy}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-colors text-xs cursor-pointer bg-transparent ${
          copied
            ? "border-accent bg-accent/10 text-accent"
            : "border-border bg-card text-muted hover:text-foreground hover:border-accent"
        }`}
        title="Copy link"
      >
        {copied ? <Check size={13} /> : <LinkIcon size={13} />}
        {copied ? "Copied!" : "Copy link"}
      </motion.button>

      {/* Twitter / X */}
      <motion.a
        href={twitterUrl}
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border bg-card text-muted hover:text-foreground hover:border-accent transition-colors text-xs no-underline"
        title="Share on Twitter"
      >
        <Twitter size={13} /> Twitter
      </motion.a>

      {/* LinkedIn */}
      <motion.a
        href={linkedinUrl}
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border bg-card text-muted hover:text-foreground hover:border-accent transition-colors text-xs no-underline"
        title="Share on LinkedIn"
      >
        <Linkedin size={13} /> LinkedIn
      </motion.a>
    </div>
  );
}
