import { IProject, UpdateProjectDTO } from "@/interfaces/project.interface";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { Models } from "appwrite";
import { toast } from "sonner";

import { handleAppwriteError } from "@/utils/errorHandling";
import {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  uploadImage,
  deleteImage,
  getAllCategories,
  FilteredProjectsResponse,
  getFilteredProjects,
  getImagePreview,
  getProjectBySlug,
} from "@/lib/api/projects.api";
import { getCurrentUser, login, logout } from "@/lib/api/auth.api";

// ─── Query keys ───────────────────────────────────────────────────────────────

export const projectKeys = {
  all: ["projects"] as const,
  filtered: (f: object) => ["projects", "filtered", f] as const,
  detail: (id: string) => ["project", id] as const,
  slug: (slug: string) => ["projects", "slug", slug] as const,
  categories: ["projectCategories"] as const,
  preview: (fileId: string) => ["filePreview", fileId] as const,
};

// ─── Public hooks ──────────────────────────────────────────────────────────────────────

/** Public list —  sorted by order */
export const useProjects = () => {
  return useQuery<IProject[]>({
    queryKey: projectKeys.all,
    queryFn: () => getProjects(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

/** Public single project by slug */
export const useProject = (slug: string) =>
  useQuery<IProject>({
    queryKey: projectKeys.slug(slug),
    queryFn: () => getProjectBySlug(slug),
    enabled: !!slug,
    staleTime: 1000 * 60 * 5,
  });

// ─── Admin hooks ──────────────────────────────────────────────────────────────────
export const useProjectById = (id: string) => {
  return useQuery<IProject>({
    queryKey: projectKeys.detail(id),
    queryFn: () => getProjectById(id),
    enabled: !!id,
  });
};

/** Paginated + filtered list — admin project table */
export const useAdminProjects = (filters: {
  page: number;
  limit?: number;
  searchQuery?: string;
  category?: string;
  projectType?: string;
  isPublished?: boolean;
}) =>
  useQuery<FilteredProjectsResponse>({
    queryKey: projectKeys.filtered(filters),
    queryFn: () => getFilteredProjects(filters),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5,
  });

export const useProjectCategories = () =>
  useQuery<string[]>({
    queryKey: projectKeys.categories,
    queryFn: getAllCategories,
    staleTime: 1000 * 60 * 5,
  });

export const useFilePreview = (fileId: string | null) =>
  useQuery<string | null>({
    queryKey: projectKeys.preview(fileId ?? ""),
    queryFn: () => (fileId ? getImagePreview(fileId) : null),
    enabled: !!fileId,
    staleTime: Infinity,
  });

// ─── Mutation hooks ────────────────────────────────────────────────────────────────────

export const useCreateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.all });
      queryClient.invalidateQueries({ queryKey: projectKeys.categories });
      toast.success("Project created successfully");
    },
    onError: (error: Error) => {
      handleAppwriteError(error);
    },
  });
};

export const useUpdateProject = () => {
  const queryClient = useQueryClient();

  return useMutation<IProject, Error, { id: string; data: UpdateProjectDTO }>({
    mutationFn: ({ id, data }) => updateProject(id, data),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: projectKeys.all });
      queryClient.invalidateQueries({
        queryKey: projectKeys.detail(updated.$id),
      });
      queryClient.invalidateQueries({
        queryKey: projectKeys.slug(updated.slug),
      });
      queryClient.invalidateQueries({ queryKey: projectKeys.categories });
      toast.success("Project updated successfully");
    },
    onError: (error: Error) => {
      handleAppwriteError(error);
    },
  });
};

export const useDeleteProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.all });
      queryClient.invalidateQueries({ queryKey: projectKeys.filtered({}) });
      queryClient.invalidateQueries({ queryKey: projectKeys.categories });
    },
    onError: (error: Error) => {
      handleAppwriteError(error);
    },
  });
};

export const useProjectImageUpload = () =>
  useMutation<Models.File, Error, File>({
    mutationFn: uploadImage,
    onError: (err: Error) => {
      toast.error(err.message ?? "Image upload failed");
    },
  });

export const useProjectImageDelete = () =>
  useMutation<void, Error, string>({
    mutationFn: deleteImage,
    onError: (err: Error) => {
      toast.error(err.message ?? "Failed to remove image");
    },
  });
