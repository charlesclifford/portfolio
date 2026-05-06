import { Models } from "appwrite";

export type EmploymentType =
  | "full-time"
  | "part-time"
  | "contract"
  | "freelance"
  | "internship";

export interface IExperience extends Models.Document {
  role: string;
  company: string;
  location: string | null;
  employmentType: EmploymentType;
  startDate: string;   // ISO date string "YYYY-MM-DD"
  endDate: string | null;   // null = current/present
  isCurrent: boolean;
  description: string;
  highlights: string[];  // bullet achievements
  technologies: string[];
  companyUrl: string | null;
  order: number;         // display order, lower = first
}

export interface CreateExperienceDTO {
  role: string;
  company: string;
  location?: string | null;
  employmentType: EmploymentType;
  startDate: string;
  endDate?: string | null;
  isCurrent: boolean;
  description: string;
  highlights: string[];
  technologies: string[];
  companyUrl?: string | null;
  order?: number;
}

export type UpdateExperienceDTO = Partial<CreateExperienceDTO>;
