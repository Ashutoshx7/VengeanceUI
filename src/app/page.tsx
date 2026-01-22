"use client";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import Navbar from "@/components/mine/landing-page/navbar";
import { SmoothScroll } from "@/components/ui/smooth-scroll";

// Critical component - load immediately
import { HeroSection } from "@/components/mine/landing-page/herosection";
import { TestimonialSection } from "@/components/mine/landing-page/testimonial-section";

// Heavy components - lazy load for better initial load
const LandingPageGrid = dynamic(
  () => import("@/components/mine/landing-page/landing-page-grid").then(mod => mod.LandingPageGrid),
  {
    ssr: false,
    loading: () => <GridSkeleton />
  }
);

const Sec1 = dynamic(
  () => import("@/components/mine/landing-page/sec1").then(mod => mod.Sec1),
  { ssr: false }
);



// Skeleton loaders
function GridSkeleton() {
  return (
    <div className="w-full py-20 px-4 md:px-20">
      <div className="text-center mb-12">
        <div className="h-8 w-48 bg-neutral-200 dark:bg-neutral-800 rounded-lg mx-auto animate-pulse" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="aspect-square rounded-xl bg-neutral-100 dark:bg-neutral-900 animate-pulse"
          />
        ))}
      </div>
    </div>
  );
}

const Page = () => {
  return (
    <SmoothScroll>
      <div className="overflow-hidden noScrollbar">
        <Navbar />
        <HeroSection />

        {/* Component Preview Grid Section - Lazy loaded */}
        <LandingPageGrid
          centerText="Components"
          className="mt-[-5vh]"
        />

        <div className="px-4 md:px-20">
          <Sec1 />
        </div>

        <div className="px-4 md:px-20">
          <TestimonialSection/>
        </div>


      </div>
    </SmoothScroll>
  );
};

export default Page;
