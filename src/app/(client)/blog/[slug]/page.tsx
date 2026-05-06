"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Clock, Calendar, Loader2 } from "lucide-react";
import { formatDate } from "@/utils/helpers";
import ShareButtons from "@/components/pages/blog/share-buttons";
import { usePost } from "@/hooks/posts.hook";
import Image from "next/image";
import { getImagePreview } from "@/lib/api/projects.api";

interface Props {
  params: Promise<{ slug: string }>;
}

export default function BlogPostPage({ params }: Props) {
  const { slug } = use(params);
  const { data: post, isPending, isError } = usePost(slug);

  if (isPending) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center gap-3 text-muted">
        <Loader2 size={20} className="animate-spin" />
        <span className="text-sm tracking-wide">Loading post...</span>
      </div>
    );
  }

  if (isError || !post) notFound();

  const imageUrl = post.coverImageId
    ? getImagePreview(post.coverImageId)
    : null;
  const postUrl = `/blog/${post.slug}`;

  return (
    <div className="min-h-screen bg-background">
      {/* ── Cover image hero ─────────────────────────────── */}
      {imageUrl && (
        <div className="relative w-full h-[50vh] md:h-[60vh] overflow-hidden">
          <Image
            src={imageUrl}
            alt={post.title}
            fill
            className="object-cover"
            unoptimized
            priority
          />
          {/* Gradient fade to background */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
        </div>
      )}

      {/* ── Header ───────────────────────────────────────── */}
      <div
        className={`px-6 ${imageUrl ? "-mt-32 relative z-10" : "pt-[120px]"} pb-12 border-b border-border`}
      >
        <div className="max-w-[720px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 text-xs text-muted no-underline hover:text-foreground transition-colors mb-8"
            >
              <ArrowLeft size={13} /> Back to Blog
            </Link>

            {/* Tags */}
            {post.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-5">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] px-3 py-1 rounded-full border border-border text-muted"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Title */}
            <h1 className="text-[clamp(28px,5vw,52px)] font-light tracking-[-0.02em] text-foreground leading-[1.1] mb-5">
              {post.title}
            </h1>

            {/* Excerpt */}
            <p className="text-lg text-muted font-light leading-relaxed mb-7">
              {post.excerpt}
            </p>

            {/* Meta */}
            <div className="flex items-center gap-4 flex-wrap text-xs text-muted">
              <span className="flex items-center gap-1.5">
                <Calendar size={12} />
                {formatDate(post.publishedAt ?? post.$createdAt)}
              </span>
              <span className="opacity-40">·</span>
              <span className="flex items-center gap-1.5">
                <Clock size={12} />
                {post.readingTime} min read
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── Content ──────────────────────────────────────── */}
      <div className="px-6 py-16">
        <div className="max-w-[720px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <div
              className="blog-content"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </motion.div>
        </div>
      </div>

      {/* ── Share footer ─────────────────────────────────── */}
      <div className="px-6 py-12 border-t border-border">
        <div className="max-w-[720px] mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
          >
            <div>
              <p className="text-sm font-normal text-foreground mb-1">
                Enjoyed this post?
              </p>
              <p className="text-xs text-muted">
                Share it with someone who&apos;d find it useful.
              </p>
            </div>
            <ShareButtons
              url={postUrl}
              title={post.title}
              excerpt={post.excerpt}
            />
          </motion.div>

          <div className="mt-12 pt-8 border-t border-border">
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 text-sm text-muted no-underline hover:text-foreground transition-colors"
            >
              <ArrowLeft size={14} /> All posts
            </Link>
          </div>
        </div>
      </div>

      {/* Prose styles */}
      <style>{`
        .blog-content { color: var(--foreground); }
        .blog-content h1 { font-size: 2rem; font-weight: 300; margin-top: 2rem; margin-bottom: 1rem; line-height: 1.2; letter-spacing: -0.02em; }
        .blog-content h2 { font-size: 1.5rem; font-weight: 300; margin-top: 1.75rem; margin-bottom: 0.75rem; line-height: 1.3; }
        .blog-content h3 { font-size: 1.25rem; font-weight: 400; margin-top: 1.5rem; margin-bottom: 0.5rem; }
        .blog-content p { font-weight: 300; line-height: 1.8; margin-bottom: 1rem; font-size: 1.0625rem; }
        .blog-content ul, .blog-content ol { padding-left: 1.5rem; margin-bottom: 1rem; }
        .blog-content ul { list-style-type: disc; }
        .blog-content ol { list-style-type: decimal; }
        .blog-content li { margin-bottom: 0.375rem; font-weight: 300; line-height: 1.75; font-size: 1.0625rem; }
        .blog-content blockquote { border-left: 3px solid var(--accent); padding-left: 1.25rem; margin: 1.5rem 0; color: var(--muted); font-style: italic; }
        .blog-content pre { background: var(--card); border: 1px solid var(--border); border-radius: 0.75rem; padding: 1.25rem; overflow-x: auto; margin: 1.5rem 0; }
        .blog-content code { font-family: 'JetBrains Mono', monospace; font-size: 0.875rem; color: var(--accent); }
        .blog-content pre code { color: var(--foreground); }
        .blog-content hr { border: none; border-top: 1px solid var(--border); margin: 2rem 0; }
        .blog-content a { color: var(--accent); text-decoration: underline; text-underline-offset: 3px; }
        .blog-content a:hover { opacity: 0.8; }
        .blog-content strong { font-weight: 600; }
        .blog-content em { font-style: italic; }
        .blog-content s { text-decoration: line-through; color: var(--muted); }
        .blog-content mark { background-color: rgba(16,185,129,0.2); padding: 0 3px; border-radius: 2px; }
      `}</style>
    </div>
  );
}
