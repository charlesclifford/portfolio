"use client";

import Link from "next/link";
import { Github, Linkedin, Twitter, ArrowUpRight } from "lucide-react";
import { usePathname } from "next/navigation";
import { useProfile } from "@/hooks/user.hook";

const navLinks = [
  { href: "/work", label: "Work" },
  { href: "/blog", label: "Blog" },
  { href: "/expertise", label: "Expertise" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Footer() {
  const pathname = usePathname();
  const { data: profile } = useProfile();

  // Hide footer on admin routes
  if (pathname.startsWith("/admin")) return null;

  const year = new Date().getFullYear();

  const socials = [
    profile?.githubUrl && {
      icon: Github,
      label: "GitHub",
      href: profile.githubUrl,
    },
    profile?.linkedinUrl && {
      icon: Linkedin,
      label: "LinkedIn",
      href: profile.linkedinUrl,
    },
    profile?.twitterUrl && {
      icon: Twitter,
      label: "Twitter",
      href: profile.twitterUrl,
    },
  ].filter(Boolean) as {
    icon: React.ElementType;
    label: string;
    href: string;
  }[];

  return (
    <footer className="border-t border-border bg-background">
      <div className="max-w-[1280px] mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          {/* Logo + tagline */}
          <div>
            <Link
              href="/"
              className="no-underline inline-flex items-baseline mb-2"
            >
              <span className="font-mono-logo text-[18px] font-medium text-accent">
                Ns
              </span>
              <span className="text-[18px] font-medium text-foreground">
                Cliff
              </span>
            </Link>
            <p className="text-xs text-muted font-light">
              {profile?.title ?? "Full Stack Developer"} ·{" "}
              {profile?.location ?? "Port Harcourt, Nigeria"}
            </p>
          </div>

          {/* Nav links */}
          <nav className="flex flex-wrap gap-x-6 gap-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm no-underline transition-colors hover:text-foreground ${
                  pathname === link.href ? "text-accent" : "text-muted"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Socials */}
          {socials.length > 0 && (
            <div className="flex items-center gap-3">
              {socials.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={label}
                  className="w-9 h-9 rounded-xl border border-border flex items-center justify-center text-muted hover:text-foreground hover:border-accent/50 transition-colors no-underline"
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Bottom row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mt-10 pt-6 border-t border-border">
          <p className="text-xs text-muted">
            © {year} {profile?.name ?? "John Mason"}. All rights reserved.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-1 text-xs text-muted no-underline hover:text-accent transition-colors"
          >
            Available for freelance <ArrowUpRight size={11} />
          </Link>
        </div>
      </div>
    </footer>
  );
}
