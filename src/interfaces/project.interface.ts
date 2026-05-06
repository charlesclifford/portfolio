import { Models } from "appwrite";

// ─── Core types ───────────────────────────────────────────────────────────────

export type ProjectColor =
  | "emerald"
  | "slate"
  | "amber"
  | "pink"
  | "violet"
  | "cyan";

export type ProjectType = "public" | "private";

export const colorMap: Record<ProjectColor, { bg: string; hex: string }> = {
  emerald: { bg: "bg-project-emerald", hex: "#065f46" },
  slate: { bg: "bg-project-slate", hex: "#475569" },
  amber: { bg: "bg-project-amber", hex: "#b45309" },
  pink: { bg: "bg-project-pink", hex: "#f9a8d4" },
  violet: { bg: "bg-project-violet", hex: "#6d28d9" },
  cyan: { bg: "bg-project-cyan", hex: "#0e7490" },
};

// ─── Main model ───────────────────────────────────────────────────────────────

export interface IProject extends Models.Document {
  // identity
  slug: string;
  title: string;
  year: string;

  // display
  color: ProjectColor;
  textColor: "white" | "black";
  summary: string;
  description: string;

  // case study
  problem: string;
  solution: string;
  results: string[];
  tech: string[];
  tags: string[];

  // media
  imageId: string | null;
  imageUrl: string | null;

  // links
  liveLink: string | null;
  githubLink: string | null;

  // meta
  categories: string[];
  featured: boolean;
  /** "public" = visible in portfolio, "private" = client / NDA work */
  projectType: ProjectType;
  /** true = live & indexed, false = draft */
  isPublished: boolean;
  order: number;
}

// ─── DTOs ─────────────────────────────────────────────────────────────────────

export interface CreateProjectDTO {
  title: string;
  year: string;
  color: ProjectColor;
  textColor: "white" | "black";
  summary: string;
  description: string;
  problem: string;
  solution: string;
  results: string[];
  tech: string[];
  tags: string[];
  imageId?: string | null;
  imageUrl?: string | null;
  liveLink?: string | null;
  githubLink?: string | null;
  categories: string[];
  featured?: boolean;
  projectType?: ProjectType;
  isPublished?: boolean;
  order?: number;
}

export type UpdateProjectDTO = Partial<CreateProjectDTO>;
