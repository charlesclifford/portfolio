"use client";

import { useLogout } from "@/hooks/user.hook";
import { motion } from "framer-motion";
import {
  BookOpen,
  Briefcase,
  FolderOpen,
  LayoutDashboard,
  Loader2,
  LogOut,
  User,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const navItems = [
  { href: "/admin/dashboard", icon: LayoutDashboard, label: "Overview" },
  { href: "/admin/dashboard/projects", icon: FolderOpen, label: "Projects" },
  {
    href: "/admin/dashboard/experiences",
    icon: Briefcase,
    label: "Experiences",
  },
  { href: "/admin/dashboard/blog", icon: BookOpen, label: "Blog" },
  { href: "/admin/dashboard/profile", icon: User, label: "Profile" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { mutate: logout, isPending } = useLogout();

  const handleLogout = () =>
    logout(undefined, { onSuccess: () => router.push("/admin/login") });

  const isActive = (href: string) =>
    href === "/admin/dashboard" ? pathname === href : pathname.startsWith(href);

  return (
    <>
      {/* ── Desktop sidebar ─────────────────────────────────────── */}
      <aside className="fixed left-0 top-0 h-full w-[240px] bg-card border-r border-border flex flex-col z-40 hidden md:flex">
        {/* Logo */}
        <div className="px-6 py-5 border-b border-border shrink-0 flex items-center gap-1">
          <Link href="/" className="no-underline flex items-baseline">
            <span className="font-mono-logo text-accent text-base">Ns</span>
            <span className="text-foreground text-base font-medium">Cliff</span>
          </Link>
          <span className="ml-1.5 text-[10px] tracking-widest uppercase text-muted border border-border rounded px-1.5 py-0.5">
            Admin
          </span>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 flex flex-col gap-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link key={item.href} href={item.href} className="no-underline">
                <motion.div
                  whileHover={{ x: 2 }}
                  transition={{ duration: 0.15 }}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${
                    active
                      ? "bg-accent/10 text-accent"
                      : "text-muted hover:text-foreground hover:bg-white/5"
                  }`}
                >
                  <Icon size={16} />
                  {item.label}
                </motion.div>
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="px-3 py-4 border-t border-border shrink-0">
          <button
            onClick={handleLogout}
            disabled={isPending}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-muted hover:text-red-400 hover:bg-red-400/5 transition-colors w-full bg-transparent border-0 cursor-pointer disabled:opacity-50"
          >
            {isPending ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <LogOut size={16} />
            )}
            Sign out
          </button>
        </div>
      </aside>

      {/* ── Mobile top bar ──────────────────────────────────────── */}
      <header className="fixed top-0 left-0 right-0 h-14 bg-card border-b border-border flex items-center justify-between px-4 z-40 md:hidden">
        <Link href="/" className="no-underline flex items-center gap-1">
          <span className="font-mono-logo text-accent text-[15px]">i</span>
          <span className="text-foreground text-[15px] font-medium">
            Onidev
          </span>
          <span className="ml-1.5 text-[9px] tracking-widest uppercase text-muted border border-border rounded px-1 py-0.5">
            Admin
          </span>
        </Link>

        <button
          onClick={handleLogout}
          disabled={isPending}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-muted hover:text-red-400 transition-colors bg-transparent border-0 cursor-pointer"
        >
          {isPending ? (
            <Loader2 size={13} className="animate-spin" />
          ) : (
            <LogOut size={13} />
          )}
          Sign out
        </button>
      </header>

      {/* ── Mobile bottom tab bar ───────────────────────────────── */}
      <nav className="fixed bottom-0 left-0 right-0 h-16 bg-card border-t border-border flex items-center justify-around z-40 md:hidden">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className="no-underline flex flex-col items-center gap-1 flex-1 py-2"
            >
              <div
                className={`p-1.5 rounded-xl transition-colors ${
                  active ? "bg-accent/10" : ""
                }`}
              >
                <Icon
                  size={20}
                  className={active ? "text-accent" : "text-muted"}
                />
              </div>
              <span
                className={`text-[10px] tracking-wide ${
                  active ? "text-accent" : "text-muted"
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
