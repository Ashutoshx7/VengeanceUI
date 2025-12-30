"use client";
import { HeroSection } from "@/components/mine/landing-page/herosection";
import Navbar from "@/components/mine/landing-page/navbar";
import { Sec1 } from "@/components/mine/landing-page/sec1";
import { LandingPageGrid } from "@/components/mine/landing-page/landing-page-grid";
import { SmoothScroll } from "@/components/ui/smooth-scroll";

const Page = () => {
  return (
    <SmoothScroll>
      <div className="overflow-hidden noScrollbar">
        <Navbar />
        <HeroSection />

        {/* Component Preview Grid Section - Shows actual UI components */}
        <LandingPageGrid
          centerText="Components"
          className="mt-[-5vh]"
        />

        <div className="px-4 md:px-20">
          <Sec1 />
        </div>
      </div>
    </SmoothScroll>
  );
};

export default Page;
