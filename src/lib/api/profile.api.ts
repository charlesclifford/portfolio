import { IProfile, UpdateProfileDTO } from "@/interfaces/profile.interface";
import { databases } from "../appwrite/client";
import { COLLECTION, DATABASE_ID } from "../appwrite/config";

// The profile is a singleton — one document with a fixed ID.
// We use listDocuments (limit 1) for reading so the collection
// doesn't need the document ID hard-coded on the client.

export const getProfile = async (): Promise<IProfile | null> => {
  const res = await databases.listDocuments<IProfile>(
    DATABASE_ID,
    COLLECTION.PROFILE,
    [],
  );
  if (res.documents.length === 0) return null;
  return res.documents[0];
};

export const updateProfile = async (
  id: string,
  data: UpdateProfileDTO,
): Promise<IProfile> =>
  databases.updateDocument<IProfile>(DATABASE_ID, COLLECTION.PROFILE, id, data);
