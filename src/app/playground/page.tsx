"use client";
import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Navbar from "@/components/mine/landing-page/navbar";
import Button1 from "../../../registry/new-york/button/button";
import { Navbar1 } from "../../../registry/new-york/navbars/navbar1"; // Keep for registry list but not as main nav
import { SmoothScroll } from "@/components/ui/smooth-scroll";

// Component registry data
const components = [
  {
    id: "navbar1",
    title: "Navbar 1",
    description: "Animated navbar with scroll effects and responsive design",
    category: "Navigation",
    component: Navbar1,
  },
  {
    id: "button1",
    title: "Button 1",
    description: "Custom styled button component",
    category: "Buttons",
    component: Button1,
  },
];

const ComponentCard = ({ component }: { component: typeof components[0] }) => {
  const Component = component.component;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className="group relative overflow-hidden rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm shadow-sm hover:shadow-md transition-all"
    >
      {/* Preview Container */}
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-muted/30 to-muted/10 p-6 flex items-center justify-center">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] opacity-50" />
        <div className="relative z-10 w-full flex items-center justify-center scale-75">
          <Component />
        </div>
      </div>

      {/* Info Section */}
      <div className="p-6 space-y-3">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
              {component.title}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              {component.description}
            </p>
          </div>
          <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-primary/10 text-primary shrink-0">
            {component.category}
          </span>
        </div>

        <div className="flex items-center gap-2 pt-2">
          <button className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors">
            View Details
            <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const Page = () => {
  return (
    <SmoothScroll>
      <div className="min-h-screen bg-background overflow-hidden noScrollbar">
        <Navbar />

        <div className="px-4 md:px-20 pt-32 pb-20">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mb-16"
          >
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Component Registry
            </h1>
            <p className="text-lg text-muted-foreground">
              Browse our collection of beautifully crafted, production-ready components.
              Copy, customize, and use them in your projects.
            </p>
          </motion.div>

          {/* Components Section */}
          <div className="mb-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <h2 className="text-2xl font-semibold text-foreground mb-2">
                Components
              </h2>
              <div className="h-1 w-20 bg-gradient-to-r from-primary to-primary/50 rounded-full" />
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {components.map((component) => (
                <ComponentCard key={component.id} component={component} />
              ))}
            </div>
          </div>

          {/* Empty State */}
          {components.length === 0 && (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">
                No components available yet. Check back soon!
              </p>
            </div>
          )}
        </div>
      </div>
    </SmoothScroll>
  );
};

export default Page;
