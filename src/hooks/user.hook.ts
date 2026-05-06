import { IProfile, UpdateProfileDTO } from "@/interfaces/profile.interface";
import { getCurrentUser, login, logout } from "@/lib/api/auth.api";
import { getProfile, updateProfile } from "@/lib/api/profile.api";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export const profileKey = ["profile"] as const;

export const useCurrentUser = () =>
  useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
    retry: false,
    staleTime: 1000 * 60 * 10,
  });

export const useLogin = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      login(email, password),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["currentUser"] });
    },
    onError: (err: Error) => {
      toast.error(err.message ?? "Login failed. Check your credentials.");
    },
  });
};

export const useLogout = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      qc.clear();
      toast.success("Signed out");
    },
  });
};

export const useProfile = () =>
  useQuery<IProfile | null>({
    queryKey: profileKey,
    queryFn: getProfile,
    staleTime: 1000 * 60 * 10,
  });

export const useUpdateProfile = () => {
  const qc = useQueryClient();
  return useMutation<IProfile, Error, { id: string; data: UpdateProfileDTO }>({
    mutationFn: ({ id, data }) => updateProfile(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: profileKey });
      toast.success("Profile saved");
    },
    onError: (err: Error) =>
      toast.error(err.message ?? "Failed to save profile"),
  });
};
