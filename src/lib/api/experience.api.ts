import {
  CreateExperienceDTO,
  IExperience,
  UpdateExperienceDTO,
} from "@/interfaces/experience.interface";
import { ID, Query } from "appwrite";
import { COLLECTION, DATABASE_ID } from "../appwrite/config";
import { databases } from "../appwrite/client";

// ─── Queries ──────────────────────────────────────────────────────────────────

/** All experience entries, sorted by order then startDate desc */
export const getExperiences = async (): Promise<IExperience[]> => {
  const res = await databases.listDocuments<IExperience>(
    DATABASE_ID,
    COLLECTION.EXPERIENCE,
    [Query.orderAsc("order"), Query.orderDesc("startDate"), Query.limit(100)],
  );
  return res.documents;
};

export const getExperienceById = async (id: string): Promise<IExperience> =>
  databases.getDocument<IExperience>(DATABASE_ID, COLLECTION.EXPERIENCE, id);

// ─── Mutations ────────────────────────────────────────────────────────────────

export const createExperience = async (
  data: CreateExperienceDTO,
): Promise<IExperience> =>
  databases.createDocument<IExperience>(
    DATABASE_ID,
    COLLECTION.EXPERIENCE,
    ID.unique(),
    data,
  );

export const updateExperience = async (
  id: string,
  data: UpdateExperienceDTO,
): Promise<IExperience> =>
  databases.updateDocument<IExperience>(
    DATABASE_ID,
    COLLECTION.EXPERIENCE,
    id,
    data,
  );

export const deleteExperience = async (id: string): Promise<void> => {
  await databases.deleteDocument(DATABASE_ID, COLLECTION.EXPERIENCE, id);
};
