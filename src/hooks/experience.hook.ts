import {
  IExperience,
  CreateExperienceDTO,
  UpdateExperienceDTO,
} from "@/interfaces/experience.interface";
import {
  getExperiences,
  getExperienceById,
  createExperience,
  updateExperience,
  deleteExperience,
} from "@/lib/api/experience.api";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export const experienceKeys = {
  all: ["experiences"] as const,
  detail: (id: string) => ["experience", id] as const,
};

export const useExperiences = () =>
  useQuery<IExperience[]>({
    queryKey: experienceKeys.all,
    queryFn: getExperiences,
    staleTime: 1000 * 60 * 5,
  });

export const useExperienceById = (id: string) =>
  useQuery<IExperience>({
    queryKey: experienceKeys.detail(id),
    queryFn: () => getExperienceById(id),
    enabled: !!id,
  });

export const useCreateExperience = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateExperienceDTO) => createExperience(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: experienceKeys.all });
      toast.success("Experience added");
    },
    onError: (err: Error) =>
      toast.error(err.message ?? "Failed to add experience"),
  });
};

export const useUpdateExperience = () => {
  const qc = useQueryClient();
  return useMutation<
    IExperience,
    Error,
    { id: string; data: UpdateExperienceDTO }
  >({
    mutationFn: ({ id, data }) => updateExperience(id, data),
    onSuccess: (updated) => {
      qc.invalidateQueries({ queryKey: experienceKeys.all });
      qc.invalidateQueries({ queryKey: experienceKeys.detail(updated.$id) });
      toast.success("Experience updated");
    },
    onError: (err: Error) =>
      toast.error(err.message ?? "Failed to update experience"),
  });
};

export const useDeleteExperience = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteExperience,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: experienceKeys.all });
      toast.success("Experience deleted");
    },
    onError: (err: Error) =>
      toast.error(err.message ?? "Failed to delete experience"),
  });
};
