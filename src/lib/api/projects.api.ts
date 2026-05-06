import {
  CreateProjectDTO,
  IProject,
  UpdateProjectDTO,
} from "@/interfaces/project.interface";
import { databases, storage } from "../appwrite/client";
import { BUCKET_ID, COLLECTION, DATABASE_ID } from "../appwrite/config";
import { ID, Models, Query } from "appwrite";
import { slugify } from "@/utils/helpers";

export type FilteredProjectsResponse = {
  projects: IProject[];
  total: number;
  currentPage: number;
  totalPages: number;
};

// ─── Queries ────────────────────────────────────────────────────────────────────────────────────

/** All unique categories across all projects */
export const getAllCategories = async (): Promise<string[]> => {
  const response = await databases.listDocuments<IProject>(
    DATABASE_ID,
    COLLECTION.PROJECTS,
    [Query.select(["categories"]), Query.limit(1000)],
  );

  const categorySet = new Set<string>();
  response.documents.forEach((project) => {
    project.categories?.forEach((cat) => categorySet.add(cat));
  });

  return Array.from(categorySet).sort();
};

/** All projects  */
export const getProjects = async (): Promise<IProject[]> => {
  const response = await databases.listDocuments<IProject>(
    DATABASE_ID,
    COLLECTION.PROJECTS,
    [
      Query.equal("isPublished", true),
      Query.limit(100),
      Query.orderDesc("$createdAt"),
    ],
  );
  return response.documents;
};

/** Paginated + filtered — used by admin list */
export const getFilteredProjects = async ({
  page = 1,
  limit = 10,
  searchQuery = "",
  category = "",
  projectType = "",
  isPublished,
}: {
  page?: number;
  limit?: number;
  searchQuery?: string;
  category?: string;
  projectType?: string;
  isPublished?: boolean;
}): Promise<FilteredProjectsResponse> => {
  const offset = (page - 1) * limit;
  const queries: string[] = [
    Query.limit(limit),
    Query.offset(offset),
    Query.orderDesc("$createdAt"),
  ];

  if (searchQuery) {
    queries.push(
      Query.or([
        Query.startsWith("title", searchQuery),
        Query.startsWith("description", searchQuery),
        Query.equal("title", searchQuery),
      ]),
    );
  }

  if (category) queries.push(Query.contains("categories", [category]));
  if (projectType) queries.push(Query.equal("projectType", projectType));
  if (isPublished !== undefined)
    queries.push(Query.equal("isPublished", isPublished));

  const res = await databases.listDocuments<IProject>(
    DATABASE_ID,
    COLLECTION.PROJECTS,
    queries,
  );

  return {
    projects: res.documents,
    total: res.total,
    currentPage: page,
    totalPages: Math.ceil(res.total / limit),
  };
};

/** Single project by Appwrite document $id */
export const getProjectById = async (id: string): Promise<IProject> => {
  return databases.getDocument<IProject>(DATABASE_ID, COLLECTION.PROJECTS, id);
};

/** Single project by slug — used by public detail pages */
export const getProjectBySlug = async (slug: string): Promise<IProject> => {
  const res = await databases.listDocuments<IProject>(
    DATABASE_ID,
    COLLECTION.PROJECTS,
    [Query.equal("slug", slug), Query.limit(1)],
  );
  if (res.documents.length === 0) throw new Error("Project not found");
  return res.documents[0];
};

// ─── Mutations ────────────────────────────────────────────────────────────────────────────────────

export const createProject = async (
  data: CreateProjectDTO,
): Promise<IProject> => {
  const slug = slugify(data.title);
  return databases.createDocument<IProject>(
    DATABASE_ID,
    COLLECTION.PROJECTS,
    ID.unique(),
    { ...data, slug },
  );
};

export const updateProject = async (
  id: string,
  data: UpdateProjectDTO,
): Promise<IProject> => {
  const updatedData = data.title
    ? { ...data, slug: slugify(data.title) }
    : data;
  return databases.updateDocument<IProject>(
    DATABASE_ID,
    COLLECTION.PROJECTS,
    id,
    updatedData,
  );
};

export const deleteProject = async (id: string): Promise<void> => {
  const project = await getProjectById(id);
  if (project.imageId) {
    await storage.deleteFile(BUCKET_ID, project.imageId);
  }
  await databases.deleteDocument(DATABASE_ID, COLLECTION.PROJECTS, id);
};

// ─── Storage ──────────────────────────────────────────────────────────────────

export const uploadImage = async (file: File): Promise<Models.File> => {
  return storage.createFile(BUCKET_ID, ID.unique(), file);
};

export const getImagePreview = (fileId: string): string => {
  return storage.getFileView(BUCKET_ID, fileId).toString();
};

export const deleteImage = async (fileId: string): Promise<void> => {
  await storage.deleteFile(BUCKET_ID, fileId);
};
