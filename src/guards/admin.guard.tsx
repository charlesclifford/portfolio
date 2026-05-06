"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useCurrentUser } from "@/hooks/user.hook";

export default function AdminGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: user, isPending, isError } = useCurrentUser();
  const router = useRouter();

  useEffect(() => {
    if (!isPending && (isError || !user)) {
      router.replace("/admin/login");
    }
  }, [isPending, isError, user, router]);

  if (isPending) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center gap-3 text-muted">
          <Loader2 size={18} className="animate-spin" />
          <span className="text-sm tracking-wide">Authenticating...</span>
        </div>
      </div>
    );
  }

  if (isError || !user) return null;

  return <>{children}</>;
}
