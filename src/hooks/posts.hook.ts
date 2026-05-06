import {
  IPost,
  CreatePostDTO,
  UpdatePostDTO,
} from "@/interfaces/post.interface";
import {
  getPosts,
  getPostBySlug,
  getAllPosts,
  getPostById,
  FilteredPostsResponse,
  getFilteredPosts,
  createPost,
  updatePost,
  deletePost,
} from "@/lib/api/posts.api";
import {
  useQuery,
  keepPreviousData,
  useQueryClient,
  useMutation,
} from "@tanstack/react-query";
import { toast } from "sonner";

export const postKeys = {
  all: ["posts"] as const,
  allAdmin: ["posts", "admin"] as const,
  filtered: (f: object) => ["posts", "filtered", f] as const,
  detail: (id: string) => ["post", id] as const,
  slug: (slug: string) => ["posts", "slug", slug] as const,
};

export const usePosts = () =>
  useQuery<IPost[]>({
    queryKey: postKeys.all,
    queryFn: getPosts,
    staleTime: 1000 * 60 * 5,
  });

export const usePost = (slug: string) =>
  useQuery<IPost>({
    queryKey: postKeys.slug(slug),
    queryFn: () => getPostBySlug(slug),
    enabled: !!slug,
    staleTime: 1000 * 60 * 5,
  });

export const useAllPosts = () =>
  useQuery<IPost[]>({
    queryKey: postKeys.allAdmin,
    queryFn: getAllPosts,
    staleTime: 1000 * 60 * 2,
  });

export const usePostById = (id: string) =>
  useQuery<IPost>({
    queryKey: postKeys.detail(id),
    queryFn: () => getPostById(id),
    enabled: !!id,
  });

export const useFilteredPosts = (filters: {
  page: number;
  limit?: number;
  searchQuery?: string;
  status?: "draft" | "published";
}) =>
  useQuery<FilteredPostsResponse>({
    queryKey: postKeys.filtered(filters),
    queryFn: () => getFilteredPosts(filters),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5,
  });

export const useCreatePost = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreatePostDTO) => createPost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: postKeys.all });
      qc.invalidateQueries({ queryKey: postKeys.allAdmin });
      toast.success("Post created");
    },
    onError: (err: Error) =>
      toast.error(err.message ?? "Failed to create post"),
  });
};

export const useUpdatePost = () => {
  const qc = useQueryClient();
  return useMutation<IPost, Error, { id: string; data: UpdatePostDTO }>({
    mutationFn: ({ id, data }) => updatePost(id, data),
    onSuccess: (updated) => {
      qc.invalidateQueries({ queryKey: postKeys.all });
      qc.invalidateQueries({ queryKey: postKeys.allAdmin });
      qc.invalidateQueries({ queryKey: postKeys.detail(updated.$id) });
      qc.invalidateQueries({ queryKey: postKeys.slug(updated.slug) });
      toast.success("Post updated");
    },
    onError: (err: Error) =>
      toast.error(err.message ?? "Failed to update post"),
  });
};

export const useDeletePost = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deletePost,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: postKeys.all });
      qc.invalidateQueries({ queryKey: postKeys.allAdmin });
      toast.success("Post deleted");
    },
    onError: (err: Error) =>
      toast.error(err.message ?? "Failed to delete post"),
  });
};
