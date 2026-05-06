"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { CreatePostDTO } from "@/interfaces/post.interface";
import { useCreatePost } from "@/hooks/posts.hook";
import PostForm from "@/components/admin/blog/post-form";

export default function NewPostPage() {
  const router = useRouter();
  const { mutateAsync: createPost, isPending } = useCreatePost();

  const handleSubmit = async (data: CreatePostDTO) => {
    await createPost(data);
    router.push("/admin/dashboard/blog");
  };

  return (
    <div className="px-4 md:px-8 py-6 md:py-10 max-w-[900px]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <Link
          href="/admin/dashboard/blog"
          className="inline-flex items-center gap-1.5 text-xs text-muted no-underline hover:text-foreground transition-colors mb-5"
        >
          <ArrowLeft size={13} /> Back to Blog
        </Link>
        <p className="text-xs tracking-[0.1em] uppercase text-muted mb-1">
          Create
        </p>
        <h1 className="text-3xl font-light text-foreground">New Post</h1>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <PostForm onSubmit={handleSubmit} submitting={isPending} />
      </motion.div>
    </div>
  );
}
