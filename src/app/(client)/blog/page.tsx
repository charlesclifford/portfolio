"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Clock, ArrowRight, Loader2 } from "lucide-react";
import { formatDate } from "@/utils/helpers";
import { usePosts } from "@/hooks/posts.hook";
import SectionTitle from "@/components/shared/section-title";
import Image from "next/image";
import { getImagePreview } from "@/lib/api/projects.api";

export default function BlogPage() {
  const { data: posts, isPending, isError } = usePosts();

  const featured = posts?.filter((p) => p.featured) ?? [];
  const rest = posts?.filter((p) => !p.featured) ?? [];

  return (
    <div className="min-h-screen bg-background pt-[120px] pb-[120px]">
      <div className="max-w-[1280px] mx-auto px-6">
        {/* Header */}
        <SectionTitle
          eyebrow="Writing"
          title="The"
          accent="Blog"
          description="Thoughts on engineering, design, and building for the web."
          as="h1"
        />

        {/* Loading */}
        {isPending && (
          <div className="flex items-center justify-center min-h-[300px] gap-3 text-muted">
            <Loader2 size={20} className="animate-spin" />
            <span className="text-sm">Loading posts...</span>
          </div>
        )}

        {/* Error */}
        {isError && (
          <div className="flex items-center justify-center min-h-[300px] text-muted">
            <p className="text-sm">Failed to load posts. Try again later.</p>
          </div>
        )}

        {/* Empty */}
        {!isPending && posts?.length === 0 && (
          <div className="flex items-center justify-center min-h-[300px] text-muted">
            <p className="text-sm">No posts yet — check back soon.</p>
          </div>
        )}

        {/* ── Featured post ─────────────────────────────── */}
        {featured.length > 0 &&
          (() => {
            const post = featured[0];
            const imageUrl = post.coverImageId
              ? getImagePreview(post.coverImageId)
              : null;
            return (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mb-16"
              >
                <Link
                  href={`/blog/${post.slug}`}
                  className="no-underline block group"
                >
                  <motion.div
                    whileHover={{ y: -4 }}
                    transition={{ duration: 0.3 }}
                    className="bg-card border border-border rounded-[20px] overflow-hidden"
                  >
                    {/* Cover image */}
                    {imageUrl && (
                      <div className="relative w-full h-[320px] md:h-[420px] overflow-hidden">
                        <Image
                          src={imageUrl}
                          alt={post.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                          unoptimized
                        />
                        {/* Gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />
                      </div>
                    )}

                    <div
                      className={`p-8 md:p-12 ${imageUrl ? "-mt-16 relative z-10" : ""}`}
                    >
                      <div className="flex items-center gap-3 mb-5 flex-wrap">
                        <span className="text-[10px] tracking-widest uppercase px-2.5 py-1 rounded-full bg-amber-400/10 text-amber-400 border border-amber-400/20">
                          ★ Featured
                        </span>
                        <span className="flex items-center gap-1 text-xs text-muted">
                          <Clock size={11} /> {post.readingTime} min read
                        </span>
                        <span className="text-xs text-muted">
                          {formatDate(post.$createdAt)}
                        </span>
                      </div>

                      <h2 className="text-[clamp(22px,4vw,40px)] font-light tracking-[-0.02em] text-foreground mb-4 leading-[1.15] group-hover:text-accent transition-colors">
                        {post.title}
                      </h2>

                      <p className="text-muted font-light leading-relaxed mb-6 max-w-[600px]">
                        {post.excerpt}
                      </p>

                      <div className="flex items-center gap-4 flex-wrap">
                        <span className="inline-flex items-center gap-1.5 text-sm text-accent">
                          Read post{" "}
                          <ArrowRight
                            size={14}
                            className="transition-transform group-hover:translate-x-1"
                          />
                        </span>
                        {post.tags?.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="text-[11px] px-2.5 py-1 rounded-full border border-border text-muted"
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
          })()}

        {/* ── Post grid ─────────────────────────────────── */}
        {rest.length > 0 && (
          <>
            {featured.length > 0 && (
              <p className="text-xs tracking-[0.12em] uppercase text-muted mb-6">
                More Posts
              </p>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {rest.map((post, i) => {
                const imageUrl = post.coverImageId
                  ? getImagePreview(post.coverImageId)
                  : null;
                return (
                  <motion.div
                    key={post.$id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: i * 0.07 }}
                  >
                    <Link
                      href={`/blog/${post.slug}`}
                      className="no-underline block group h-full"
                    >
                      <motion.div
                        whileHover={{ y: -4 }}
                        transition={{ duration: 0.3 }}
                        className="bg-card border border-border rounded-[20px] overflow-hidden h-full flex flex-col"
                      >
                        {/* Cover image */}
                        {imageUrl ? (
                          <div className="relative w-full h-48 overflow-hidden shrink-0">
                            <Image
                              src={imageUrl}
                              alt={post.title}
                              fill
                              className="object-cover transition-transform duration-700 group-hover:scale-105"
                              unoptimized
                            />
                          </div>
                        ) : (
                          /* Accent strip when no image */
                          <div className="h-1 w-full bg-gradient-to-r from-accent/60 to-accent/20" />
                        )}

                        <div className="p-6 flex flex-col flex-1">
                          <div className="flex items-center gap-2 mb-4">
                            <span className="flex items-center gap-1 text-xs text-muted">
                              <Clock size={10} /> {post.readingTime} min
                            </span>
                            <span className="text-xs text-muted opacity-40">
                              ·
                            </span>
                            <span className="text-xs text-muted">
                              {formatDate(post.$createdAt)}
                            </span>
                          </div>

                          <h3 className="text-lg font-normal text-foreground mb-3 leading-snug group-hover:text-accent transition-colors">
                            {post.title}
                          </h3>

                          <p className="text-sm text-muted font-light leading-relaxed mb-4 flex-1 line-clamp-3">
                            {post.excerpt}
                          </p>

                          <div className="flex flex-wrap gap-1.5 mt-auto">
                            {post.tags?.slice(0, 3).map((tag) => (
                              <span
                                key={tag}
                                className="text-[10px] px-2 py-0.5 rounded-full border border-border text-muted"
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
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
