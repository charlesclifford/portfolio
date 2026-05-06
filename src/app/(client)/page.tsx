import CoreSection from "@/components/pages/home/core-section";
import CTASection from "@/components/pages/home/cta-section";
import FeatureSection from "@/components/pages/home/feature-section";
import HeroSection from "@/components/pages/home/hero-section";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* ── Hero ─────────────────────────────────────────── */}
      <HeroSection />

      {/* ── Core Disciplines ─────────────────────────────── */}
      <CoreSection />

      {/* ── Featured Projects ─────────────────────────────── */}
      <FeatureSection />

      {/* ── CTA ──────────────────────────────────────────── */}
      <CTASection />
    </div>
  );
}
