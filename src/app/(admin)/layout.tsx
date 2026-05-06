import Navigation from "@/components/shared/navigation";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "iOnidev — Admin Dashboard",
  description: "Admin dashboard for managing iOnidev portfolio content.",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <div>{children}</div>
    </div>
  );
}
