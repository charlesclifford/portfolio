"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Send,
  Loader2,
  CheckCircle,
  AlertCircle,
  Mail,
  Github,
  Linkedin,
  Twitter,
  MapPin,
} from "lucide-react";
import { useProfile } from "@/hooks/user.hook";

type State = "idle" | "loading" | "success" | "error";

export default function ContactPage() {
  const { data: profile } = useProfile();

  const [state, setState] = useState<State>("idle");
  const [errMsg, setErrMsg] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const set = (key: keyof typeof form, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState("loading");
    setErrMsg("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrMsg(data.error ?? "Something went wrong.");
        setState("error");
        return;
      }

      setState("success");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch {
      setErrMsg("Network error. Check your connection and try again.");
      setState("error");
    }
  };

  const inputCls =
    "w-full px-4 py-3.5 bg-card border border-border rounded-xl text-sm text-foreground outline-none focus:border-accent transition-colors placeholder:text-muted/40 font-light";

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
    <div className="min-h-screen bg-background pt-[120px] pb-[120px]">
      <div className="max-w-[1280px] mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mb-20"
        >
          <p className="text-xs tracking-[0.12em] uppercase text-muted mb-4">
            Get in Touch
          </p>
          <h1 className="text-[clamp(40px,6vw,72px)] font-light tracking-[-0.02em] text-foreground">
            Let&apos;s{" "}
            <em className="font-display font-normal  italic text-accent">
              Talk
            </em>
          </h1>
        </motion.div>

        {/* Two columns */}
        <div className="grid grid-cols-[1fr_1.8fr] max-md:grid-cols-1 gap-[80px] items-start">
          {/* Left — info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-col gap-8"
          >
            <div>
              <p className="text-sm font-normal text-foreground mb-3">
                Available for
              </p>
              <div className="flex flex-col gap-2">
                {[
                  "Freelance projects",
                  "Contract work",
                  "Full-time roles",
                  "Technical consulting",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-2.5 text-sm text-muted font-light"
                  >
                    <span className="w-1 h-1 rounded-full bg-accent shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3">
              {profile?.location && (
                <div className="flex items-center gap-2.5 text-sm text-muted">
                  <MapPin size={15} className="shrink-0" />
                  {profile.location}
                </div>
              )}
              {profile?.email && (
                <a
                  href={`mailto:${profile.email}`}
                  className="flex items-center gap-2.5 text-sm text-muted no-underline hover:text-foreground transition-colors"
                >
                  <Mail size={15} className="shrink-0" />
                  {profile.email}
                </a>
              )}
            </div>

            {socials.length > 0 && (
              <div className="flex flex-col gap-3">
                <p className="text-xs tracking-[0.1em] uppercase text-muted">
                  Social
                </p>
                <div className="flex gap-3">
                  {socials.map(({ icon: Icon, label, href }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={label}
                      className="w-10 h-10 rounded-xl border border-border flex items-center justify-center text-muted hover:text-foreground hover:border-accent transition-colors no-underline"
                    >
                      <Icon size={16} />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Availability badge */}
            {profile?.isAvailable && (
              <div className="inline-flex items-center gap-2 px-4 py-2.5 bg-accent/10 border border-accent/25 rounded-xl w-fit">
                <motion.div
                  animate={{ scale: [1, 1.4, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-1.5 h-1.5 rounded-full bg-accent"
                />
                <span className="text-xs text-accent tracking-wide">
                  {profile.availabilityNote ?? "Available for freelance"}
                </span>
              </div>
            )}
          </motion.div>

          {/* Right — form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Success state */}
            {state === "success" ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col items-center justify-center gap-5 py-20 text-center"
              >
                <div className="w-16 h-16 rounded-full bg-accent/15 border border-accent/25 flex items-center justify-center">
                  <CheckCircle size={28} className="text-accent" />
                </div>
                <div>
                  <p className="text-xl font-light text-foreground mb-2">
                    Message sent!
                  </p>
                  <p className="text-sm text-muted font-light">
                    Thanks for reaching out. I&apos;ll get back to you soon.
                  </p>
                </div>
                <button
                  onClick={() => setState("idle")}
                  className="text-sm text-accent no-underline hover:opacity-80 transition-opacity cursor-pointer bg-transparent border-0"
                >
                  Send another message
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div className="grid grid-cols-2 max-sm:grid-cols-1 gap-5">
                  <div>
                    <label className="block text-[11px] tracking-[0.08em] uppercase text-muted mb-2">
                      Name *
                    </label>
                    <input
                      required
                      type="text"
                      value={form.name}
                      onChange={(e) => set("name", e.target.value)}
                      placeholder="John Doe"
                      className={inputCls}
                      disabled={state === "loading"}
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] tracking-[0.08em] uppercase text-muted mb-2">
                      Email *
                    </label>
                    <input
                      required
                      type="email"
                      value={form.email}
                      onChange={(e) => set("email", e.target.value)}
                      placeholder="you@example.com"
                      className={inputCls}
                      disabled={state === "loading"}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] tracking-[0.08em] uppercase text-muted mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={form.subject}
                    onChange={(e) => set("subject", e.target.value)}
                    placeholder="Project enquiry, collaboration..."
                    className={inputCls}
                    disabled={state === "loading"}
                  />
                </div>

                <div>
                  <label className="block text-[11px] tracking-[0.08em] uppercase text-muted mb-2">
                    Message *
                  </label>
                  <textarea
                    required
                    rows={6}
                    value={form.message}
                    onChange={(e) => set("message", e.target.value)}
                    placeholder="Tell me about your project..."
                    className={`${inputCls} resize-y`}
                    disabled={state === "loading"}
                  />
                </div>

                {/* Error */}
                {state === "error" && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
                  >
                    <AlertCircle size={15} className="shrink-0" />
                    {errMsg}
                  </motion.div>
                )}

                {/* Submit */}
                <motion.button
                  type="submit"
                  disabled={state === "loading"}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="self-start inline-flex items-center gap-2 px-7 py-3.5 bg-accent text-black rounded-full text-sm font-medium cursor-pointer border-0 disabled:opacity-60 disabled:cursor-wait"
                >
                  {state === "loading" ? (
                    <>
                      <Loader2 size={15} className="animate-spin" /> Sending...
                    </>
                  ) : (
                    <>
                      <Send size={15} /> Send Message
                    </>
                  )}
                </motion.button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
