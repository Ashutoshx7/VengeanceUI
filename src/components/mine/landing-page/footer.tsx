import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";
import {
  FileText,
  Github,
  Instagram,
  LinkedinIcon,
  Twitter,
} from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";

const Footer = () => {
  return (
    <div className=" flex justify-center relative ">
      <section className=" w-7xl mx-4 ">
        <div className="  grid md:grid-cols-[350px_1fr]  grid-cols-1 gap-3">
          <img
            className=" rounded-xl border object-cover h-full w-full  shadow z-30"
            src="https://res.cloudinary.com/dz12pywzs/image/upload/v1762336185/Gemini_Generated_Image_qxos2hqxos2hqxos_rlosmn.png"
            alt="Vansh Nagar"
          />
          <Card className=" h-full  bg-background flex justify-between relative  z-30">
            <CardHeader>
              {" "}
              <div className=" text-4xl font-medium"> Vansh Nagar</div>
              <div className="text-muted-foreground text-sm mt-2 text-justify">
                Take your imagination to real production web & app with me.
                Full-Stack/App Dev || DevOps & Deployment ||  Production AI
                Agent || UI/UX || Creative Engineer || Blender || 2D/3D
                Experiences (Three.js/R3F , GSAP) ✨
              </div>
            </CardHeader>
            <CardContent className=" flex flex-wrap justify-center mt-6">
              {[
                {
                  icon: Instagram,
                  link: "https://www.instagram.com/epitome0.0/",
                },
                {
                  icon: LinkedinIcon,
                  link: "https://www.linkedin.com/in/vansh-nagar-469648346/",
                },
                { icon: Twitter, link: "#" },
                { icon: Github, link: "https://github.com/vansh-nagar" },
                { icon: FileText, link: "https://vanshnagar.me/resume" },
              ].map((item, index) => (
                <div
                  key={index}
                  className="group border-0 shadow-none cursor-pointer"
                >
                  <Link href={item.link} target="_blank">
                    <CardDecorator>
                      <item.icon className="size-6" aria-hidden />
                    </CardDecorator>
                  </Link>
                </div>
              ))}
            </CardContent>
            <CardFooter className=" flex justify-end">
              <Link href="https://vanshnagar.me" target="_blank">
                <InteractiveHoverButton>Portfolio</InteractiveHoverButton>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Footer;

const CardDecorator = ({ children }: { children: ReactNode }) => (
  <div className="mask-radial-from-40% mask-radial-to-60% relative mx-auto size-36 duration-200 [--color-border:color-mix(in_oklab,var(--color-zinc-950)10%,transparent)] group-hover:text-primary dark:[--color-border:color-mix(in_oklab,var(--color-white)15%,transparent)] dark:group-hover:[--color-border:color-mix(in_oklab,var(--color-white)20%,transparent)]">
    <div
      aria-hidden
      className="absolute inset-0 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] bg-[size:24px_24px] dark:opacity-50"
    />

    <div className="bg-background absolute inset-0 m-auto flex size-12 items-center justify-center border-l border-t">
      {children}
    </div>
  </div>
);
