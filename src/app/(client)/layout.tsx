import Footer from "@/components/shared/footer";
import Navigation from "@/components/shared/navigation";
import type { Metadata } from "next";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Navigation />
      <div>{children}</div>
      <Footer />
    </div>
  );
}
