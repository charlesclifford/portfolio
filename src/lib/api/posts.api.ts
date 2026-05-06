import {
  CreatePostDTO,
  IPost,
  PostStatus,
  UpdatePostDTO,
} from "@/interfaces/post.interface";
import { Query } from "appwrite";
import { ID, databases } from "../appwrite/client";
import { slugify } from "@/utils/helpers";
import { DATABASE_ID, COLLECTION } from "../appwrite/config";

// ─── Types ────────────────────────────────────────────────────────────────────

export type FilteredPostsResponse = {
  posts: IPost[];
  total: number;
  currentPage: number;
  totalPages: number;
};

/** Estimate reading time from HTML content (~200 wpm) */
function calcReadingTime(html: string): number {
  const text = html.replace(/<[^>]+>/g, " ");
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

// ─── Queries ──────────────────────────────────────────────────────────────────

/** Public: only published posts */
export const getPosts = async (): Promise<IPost[]> => {
  const res = await databases.listDocuments<IPost>(
    DATABASE_ID,
    COLLECTION.BLOG,
    [
      Query.equal("status", "published"),
      Query.orderDesc("publishedAt"),
      Query.limit(100),
    ],
  );
  return res.documents;
};

/** Admin: all posts */
export const getAllPosts = async (): Promise<IPost[]> => {
  const res = await databases.listDocuments<IPost>(
    DATABASE_ID,
    COLLECTION.BLOG,
    [Query.orderDesc("$createdAt"), Query.limit(100)],
  );
  return res.documents;
};

export const getFilteredPosts = async ({
  page = 1,
  limit = 10,
  searchQuery = "",
  status,
}: {
  page?: number;
  limit?: number;
  searchQuery?: string;
  status?: PostStatus;
}): Promise<FilteredPostsResponse> => {
  const offset = (page - 1) * limit;
  const queries = [
    Query.limit(limit),
    Query.offset(offset),
    Query.orderDesc("$createdAt"),
  ];
  if (searchQuery) queries.push(Query.startsWith("title", searchQuery));
  if (status) queries.push(Query.equal("status", status));

  const res = await databases.listDocuments<IPost>(
    DATABASE_ID,
    COLLECTION.BLOG,
    queries,
  );
  return {
    posts: res.documents,
    total: res.total,
    currentPage: page,
    totalPages: Math.ceil(res.total / limit),
  };
};

export const getPostBySlug = async (slug: string): Promise<IPost> => {
  const res = await databases.listDocuments<IPost>(
    DATABASE_ID,
    COLLECTION.BLOG,
    [Query.equal("slug", slug), Query.limit(1)],
  );
  if (res.documents.length === 0) throw new Error("Post not found");
  return res.documents[0];
};

export const getPostById = async (id: string): Promise<IPost> =>
  databases.getDocument<IPost>(DATABASE_ID, COLLECTION.BLOG, id);

// ─── Mutations ────────────────────────────────────────────────────────────────

export const createPost = async (data: CreatePostDTO): Promise<IPost> => {
  const slug = slugify(data.title);
  const readingTime = calcReadingTime(data.content);
  const publishedAt =
    data.status === "published"
      ? (data.publishedAt ?? new Date().toISOString())
      : null;

  return databases.createDocument<IPost>(
    DATABASE_ID,
    COLLECTION.BLOG,
    ID.unique(),
    { ...data, slug, readingTime, publishedAt },
  );
};

export const updatePost = async (
  id: string,
  data: UpdatePostDTO,
): Promise<IPost> => {
  const payload: Record<string, unknown> = { ...data };

  if (data.title) payload.slug = slugify(data.title);
  if (data.content) payload.readingTime = calcReadingTime(data.content);
  if (data.status === "published" && !data.publishedAt)
    payload.publishedAt = new Date().toISOString();

  return databases.updateDocument<IPost>(
    DATABASE_ID,
    COLLECTION.BLOG,
    id,
    payload,
  );
};

export const deletePost = async (id: string): Promise<void> => {
  databases.deleteDocument(DATABASE_ID, COLLECTION.BLOG, id);
};
