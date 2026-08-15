import { cn } from "@/lib/utils";
import * as React from "react";

export function Container({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto max-w-7xl px-4 md:px-8 lg:px-16", className)}>
      {children}
    </div>
  );
}

export default Container;
