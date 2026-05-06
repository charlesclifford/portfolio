import { AppwriteException } from "appwrite";
import { toast } from "sonner";

export const handleAppwriteError = (error: unknown) => {
  if (error instanceof AppwriteException) {
    switch (error.code) {
      case 401:
        toast.error("Unauthorised. Please sign in again.");
        break;
      case 404:
        toast.error("Resource not found.");
        break;
      case 409:
        toast.error("A project with this slug already exists.");
        break;
      case 429:
        toast.error("Too many requests. Please slow down.");
        break;
      case 500:
        toast.error("Server error. Please try again later.");
        break;
      default:
        toast.error(error.message ?? "An unexpected error occurred.");
    }
    return;
  }

  if (error instanceof Error) {
    console.error("Appwrite error:", error.message);
    toast.error(error.message);
    return error.message;
  }
  return "An unknown error occurred";
};
