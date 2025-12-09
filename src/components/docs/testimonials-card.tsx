"use client";

import { TestimonialsCard } from "@/components/ui/testimonials-card";

const demoItems = [
    {
        id: 1,
        title: "Mountain Landscape",
        description: "Beautiful mountain scenery with snow-capped peaks.",
        image: "/Avatar11.jpg",
    },
    {
        id: 2,
        title: "Abstract Art",
        description: "A stunning piece of modern abstract artwork.",
        image: "/Avatar6.jpg",
    },
    {
        id: 3,
        title: "Nature Photography",
        description: "Capturing the essence of natural beauty.",
        image: "/186330c41b3d12d96bdaa03e0c0db30d.jpg",
    },
    {
        id: 4,
        title: "Digital Creation",
        description: "Innovative digital art and design concepts.",
        image: "/f318d62afa39731a0a371388d400a773.jpg",
    },
];

export function TestimonialsCardDemo() {
    return (
        <div className="relative flex min-h-[500px] w-full items-center justify-center overflow-hidden rounded-lg border bg-background">
            <TestimonialsCard items={demoItems} />
        </div>
    );
}
