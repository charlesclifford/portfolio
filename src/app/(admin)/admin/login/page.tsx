"use client";

import { useCurrentUser, useLogin } from "@/hooks/user.hook";
import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminLoginPage() {
  const router = useRouter();
  const { data: user, isPending: checkingAuth } = useCurrentUser();
  const { mutate: login, isPending, isError, error } = useLogin();

  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);

  // Already logged in → go to dashboard
  useEffect(() => {
    if (user) router.replace("/admin/dashboard");
  }, [user, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    login({ email, password }, { onSuccess: () => router.push("/admin/dashboard") });
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 size={20} className="animate-spin text-muted" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      {/* Background orb */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[80px] opacity-20"
          style={{ background: "radial-gradient(circle, #10b981 0%, transparent 70%)" }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-[400px]"
      >
        {/* Logo */}
        <div className="flex items-center gap-2 mb-10">
          <div className="w-9 h-9 rounded-xl bg-accent/15 border border-accent/30 flex items-center justify-center">
            <Lock size={16} className="text-accent" />
          </div>
          <div>
            <span className="font-mono-logo text-accent text-[15px]">Ns</span>
            <span className="text-foreground text-[15px] font-medium">Cliff</span>
            <span className="text-muted text-[13px] ml-2">Admin</span>
          </div>
        </div>

        <h1 className="text-2xl font-light text-foreground mb-1">Sign in</h1>
        <p className="text-sm text-muted mb-8 font-light">
          Access the project dashboard.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-[11px] tracking-[0.08em] uppercase text-muted mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="hello@NsCliff.com"
              required
              className="w-full px-4 py-3 bg-card border border-border rounded-xl text-foreground text-sm font-light outline-none focus:border-accent transition-colors placeholder:text-muted/40"
            />
          </div>

          <div>
            <label className="block text-[11px] tracking-[0.08em] uppercase text-muted mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 pr-11 bg-card border border-border rounded-xl text-foreground text-sm font-light outline-none focus:border-accent transition-colors placeholder:text-muted/40"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground transition-colors bg-transparent border-0 cursor-pointer p-1"
              >
                {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {isError && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-3"
            >
              {(error as Error)?.message ?? "Invalid credentials. Please try again."}
            </motion.p>
          )}

          <motion.button
            type="submit"
            disabled={isPending}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="flex items-center justify-center gap-2 w-full py-3.5 bg-accent text-black rounded-xl text-sm font-medium tracking-wide mt-2 cursor-pointer border-0 disabled:opacity-60 disabled:cursor-wait"
          >
            {isPending ? (
              <>
                <Loader2 size={15} className="animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign in"
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
