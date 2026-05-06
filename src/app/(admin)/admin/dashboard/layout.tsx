import AdminSidebar from "@/components/admin/admin-sidebar";
import AdminGuard from "@/guards/admin.guard";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminGuard>
      <div className="min-h-screen bg-background flex">
        <AdminSidebar />
        {/*
          Desktop: offset left by sidebar width (240px)
          Mobile: offset top by header (56px) + bottom by tab bar (64px)
        */}
        <main className="flex-1 md:ml-[240px] mt-14 md:mt-0 mb-16 md:mb-0 min-w-0">
          {children}
        </main>
      </div>
    </AdminGuard>
  );
}
