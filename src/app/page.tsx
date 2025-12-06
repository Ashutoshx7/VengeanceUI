import { HeroSection } from "@/components/mine/landing-page/herosection";
import Navbar from "@/components/mine/landing-page/navbar";
import { Sec1 } from "@/components/mine/landing-page/sec1";

const page = () => {
  return (
    <div className="px-20 overflow-hidden noScrollbar">
      <Navbar />
      <HeroSection />
      <Sec1 />
    </div>
  );
};

export default page;
