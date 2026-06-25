import { Hero } from "@/components/landing/Hero";
import { DetectionModules } from "@/components/landing/DetectionModules";
import { Timeline } from "@/components/landing/Timeline";
import { DeploymentGrid } from "@/components/landing/DeploymentGrid";
import { WhyChoose } from "@/components/landing/WhyChoose";
import { CTASection } from "@/components/landing/CTASection";
import { AppLogo } from "@/components/common/AppLogo";

export function LandingPage() {
  return (
    <div className="bg-[#020817]">
      <Hero />
      <DetectionModules />
      <Timeline />
      <DeploymentGrid />
      <WhyChoose />
      <CTASection />
      <footer className="border-t border-borderSubtle px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <AppLogo linked />
          <p>Enterprise vision AI for safer operations.</p>
        </div>
      </footer>
    </div>
  );
}
