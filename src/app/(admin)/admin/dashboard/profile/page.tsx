"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Loader2, Save, User } from "lucide-react";
import { UpdateProfileDTO } from "@/interfaces/profile.interface";
import { useProfile, useUpdateProfile } from "@/hooks/user.hook";

export default function ProfilePage() {
  const { data: profile, isPending } = useProfile();
  const { mutateAsync: updateProfile, isPending: saving } = useUpdateProfile();

  const [form, setForm] = useState<UpdateProfileDTO>({});
  const [ready, setReady] = useState(false);

  // Populate form once profile loads
  useEffect(() => {
    if (profile && !ready) {
      setForm({
        name: profile.name,
        title: profile.title,
        heroBadge: profile.heroBadge,
        tagline: profile.tagline,
        bio: profile.bio,
        location: profile.location,
        email: profile.email,
        githubUrl: profile.githubUrl,
        linkedinUrl: profile.linkedinUrl,
        twitterUrl: profile.twitterUrl,
        websiteUrl: profile.websiteUrl,
        isAvailable: profile.isAvailable,
        availabilityNote: profile.availabilityNote,
        yearsExperience: profile.yearsExperience,
        projectsShipped: profile.projectsShipped,
        happyClients: profile.happyClients,
      });
      setReady(true);
    }
  }, [profile, ready]);

  const set = <K extends keyof UpdateProfileDTO>(
    key: K,
    value: UpdateProfileDTO[K],
  ) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    await updateProfile({ id: profile.$id, data: form });
  };

  const inputCls =
    "w-full px-4 py-3 bg-background border border-border rounded-xl text-sm text-foreground outline-none focus:border-accent transition-colors placeholder:text-muted/40 font-light";
  const labelCls =
    "block text-[11px] tracking-[0.08em] uppercase text-muted mb-2";

  if (isPending) {
    return (
      <div className="flex items-center justify-center min-h-[400px] gap-3 text-muted">
        <Loader2 size={18} className="animate-spin" />
        <span className="text-sm">Loading profile...</span>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="px-4 md:px-8 py-6 md:py-10 max-w-[780px]">
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-muted">
          <User size={32} className="opacity-30" />
          <p className="text-sm">No profile document found.</p>
          <p className="text-xs text-center max-w-[300px]">
            Create a document in the{" "}
            <code className="text-accent">profile</code> collection in Appwrite,
            then refresh.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 md:px-8 py-6 md:py-10 max-w-[780px]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <p className="text-xs tracking-[0.1em] uppercase text-muted mb-1">
          Settings
        </p>
        <h1 className="text-2xl md:text-3xl font-light text-foreground">
          Profile
        </h1>
        <p className="text-sm text-muted mt-1">
          Changes here reflect on the homepage, about page, and contact details.
        </p>
      </motion.div>

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        onSubmit={handleSubmit}
        className="flex flex-col gap-8"
      >
        {/* ── Identity ── */}
        <section className="flex flex-col gap-5">
          <p className={`${labelCls} border-b border-border pb-3`}>Identity</p>
          <div className="grid grid-cols-2 max-sm:grid-cols-1 gap-5">
            <div>
              <label className={labelCls}>Full Name *</label>
              <input
                required
                type="text"
                value={form.name ?? ""}
                onChange={(e) => set("name", e.target.value)}
                placeholder="John Doe"
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Job Title *</label>
              <input
                required
                type="text"
                value={form.title ?? ""}
                onChange={(e) => set("title", e.target.value)}
                placeholder="Full Stack Developer"
                className={inputCls}
              />
            </div>
          </div>
          <div>
            <label className={labelCls}>Location *</label>
            <input
              required
              type="text"
              value={form.location ?? ""}
              onChange={(e) => set("location", e.target.value)}
              placeholder="Port Harcourt, Nigeria"
              className={inputCls}
            />
          </div>
        </section>

        {/* ── Hero ── */}
        <section className="flex flex-col gap-5">
          <p className={`${labelCls} border-b border-border pb-3`}>
            Hero Section
          </p>

          <div>
            <label className={labelCls}>Badge Text</label>
            <input
              type="text"
              value={form.heroBadge ?? ""}
              onChange={(e) => set("heroBadge", e.target.value || null)}
              placeholder={`${form.title ?? "Full Stack Developer"} · ${form.location ?? "Port Harcourt, Nigeria"}`}
              className={inputCls}
            />
            <p className="text-xs text-muted mt-1.5">
              The small pill above the headline. Leave empty to auto-generate
              from Job Title · Location.
            </p>
          </div>

          <div>
            <label className={labelCls}>Tagline *</label>
            <input
              required
              type="text"
              value={form.tagline ?? ""}
              onChange={(e) => set("tagline", e.target.value)}
              placeholder="Full Stack Developer crafting scalable solutions..."
              className={inputCls}
            />
            <p className="text-xs text-muted mt-1.5">
              Shown below the headline on the homepage.
            </p>
          </div>
        </section>

        {/* ── About ── */}
        <section className="flex flex-col gap-5">
          <p className={`${labelCls} border-b border-border pb-3`}>About</p>
          <div>
            <label className={labelCls}>Bio *</label>
            <textarea
              required
              rows={5}
              value={form.bio ?? ""}
              onChange={(e) => set("bio", e.target.value)}
              placeholder="I'm a full-stack developer with a focus on..."
              className={`${inputCls} resize-y`}
            />
            <p className="text-xs text-muted mt-1.5">
              Shown on the About page. Supports line breaks.
            </p>
          </div>
        </section>

        {/* ── Contact & Links ── */}
        <section className="flex flex-col gap-5">
          <p className={`${labelCls} border-b border-border pb-3`}>
            Contact & Links
          </p>
          <div className="grid grid-cols-2 max-sm:grid-cols-1 gap-5">
            <div>
              <label className={labelCls}>Email *</label>
              <input
                required
                type="email"
                value={form.email ?? ""}
                onChange={(e) => set("email", e.target.value)}
                placeholder="hello@domain.com"
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>GitHub URL</label>
              <input
                type="url"
                value={form.githubUrl ?? ""}
                onChange={(e) => set("githubUrl", e.target.value || null)}
                placeholder="https://github.com/username"
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>LinkedIn URL</label>
              <input
                type="url"
                value={form.linkedinUrl ?? ""}
                onChange={(e) => set("linkedinUrl", e.target.value || null)}
                placeholder="https://linkedin.com/in/username"
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Twitter / X URL</label>
              <input
                type="url"
                value={form.twitterUrl ?? ""}
                onChange={(e) => set("twitterUrl", e.target.value || null)}
                placeholder="https://x.com/yourhandle"
                className={inputCls}
              />
            </div>
          </div>
        </section>

        {/* ── Availability ── */}
        <section className="flex flex-col gap-5">
          <p className={`${labelCls} border-b border-border pb-3`}>
            Availability
          </p>
          <label className="flex items-center gap-3 cursor-pointer select-none">
            <div
              role="switch"
              aria-checked={form.isAvailable}
              onClick={() => set("isAvailable", !form.isAvailable)}
              className={`w-11 h-6 rounded-full relative transition-colors cursor-pointer ${form.isAvailable ? "bg-accent" : "bg-border"}`}
            >
              <div
                className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${form.isAvailable ? "translate-x-5" : "translate-x-0.5"}`}
              />
            </div>
            <div>
              <span className="text-sm text-foreground">
                {form.isAvailable ? "Available for freelance" : "Not available"}
              </span>
              <p className="text-xs text-muted">
                Shows the pulsing green badge on the About page.
              </p>
            </div>
          </label>
          {form.isAvailable && (
            <div>
              <label className={labelCls}>Availability Note</label>
              <input
                type="text"
                value={form.availabilityNote ?? ""}
                onChange={(e) =>
                  set("availabilityNote", e.target.value || null)
                }
                placeholder="Available for new projects"
                className={inputCls}
              />
            </div>
          )}
        </section>

        {/* ── Stats ── */}
        <section className="flex flex-col gap-5">
          <p className={`${labelCls} border-b border-border pb-3`}>Stats</p>
          <p className="text-xs text-muted -mt-2">
            Displayed in the stat row on the About page.
          </p>
          <div className="grid grid-cols-3 max-sm:grid-cols-1 gap-5">
            <div>
              <label className={labelCls}>Years Experience</label>
              <input
                type="text"
                value={form.yearsExperience ?? ""}
                onChange={(e) => set("yearsExperience", e.target.value)}
                placeholder="5+"
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Projects Shipped</label>
              <input
                type="text"
                value={form.projectsShipped ?? ""}
                onChange={(e) => set("projectsShipped", e.target.value)}
                placeholder="15+"
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Happy Clients</label>
              <input
                type="text"
                value={form.happyClients ?? ""}
                onChange={(e) => set("happyClients", e.target.value)}
                placeholder="10+"
                className={inputCls}
              />
            </div>
          </div>
        </section>

        {/* Submit */}
        <div className="flex gap-3 pt-2">
          <motion.button
            type="submit"
            disabled={saving}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="flex items-center justify-center gap-2 px-8 py-3.5 bg-accent text-black rounded-xl text-sm font-medium cursor-pointer border-0 disabled:opacity-60 disabled:cursor-wait"
          >
            {saving ? (
              <>
                <Loader2 size={15} className="animate-spin" /> Saving...
              </>
            ) : (
              <>
                <Save size={15} /> Save Profile
              </>
            )}
          </motion.button>
        </div>
      </motion.form>
    </div>
  );
}
