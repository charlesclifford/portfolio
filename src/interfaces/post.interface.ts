import { Models } from "appwrite";

export type PostStatus = "draft" | "published";

export interface IPost extends Models.Document {
  title: string;
  slug: string;
  excerpt: string;         // short summary shown on cards
  content: string;         // HTML from Tiptap
  coverImageId: string | null;
  tags: string[];
  categories: string[];
  status: PostStatus;
  featured: boolean;
  readingTime: number;     // minutes, computed on save
  publishedAt: string | null;
}

export interface CreatePostDTO {
  title: string;
  excerpt: string;
  content: string;
  coverImageId?: string | null;
  tags: string[];
  categories: string[];
  status: PostStatus;
  featured?: boolean;
  readingTime?: number;
  publishedAt?: string | null;
}

export type UpdatePostDTO = Partial<CreatePostDTO>;
