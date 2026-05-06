import { Models } from "appwrite";

export interface IProfile extends Models.Document {
  name: string;
  title: string; // e.g. "Full Stack Developer"
  heroBadge: string | null;
  tagline: string; // hero sub-copy
  bio: string; // about page paragraph(s)
  location: string;
  email: string;
  githubUrl: string | null;
  linkedinUrl: string | null;
  twitterUrl: string | null;
  websiteUrl: string | null;
  isAvailable: boolean; // "Available for freelance" pulse badge
  availabilityNote: string | null; // e.g. "Available from Jan 2025"
  // Stats shown on about page
  yearsExperience: string; // "3+"
  projectsShipped: string; // "15+"
  happyClients: string; // "8+"
}

export interface UpdateProfileDTO {
  name?: string;
  title?: string;
  heroBadge?: string | null;
  tagline?: string;
  bio?: string;
  location?: string;
  email?: string;
  githubUrl?: string | null;
  linkedinUrl?: string | null;
  twitterUrl?: string | null;
  websiteUrl?: string | null;
  isAvailable?: boolean;
  availabilityNote?: string | null;
  yearsExperience?: string;
  projectsShipped?: string;
  happyClients?: string;
}
