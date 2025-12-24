"use client";
import React from 'react';
import { AnimatedTabBar } from '@/components/ui/animated-tab-bar';

export function AnimatedTabBarDemo() {
    return (
        <div className="relative flex min-h-[500px] w-full flex-col items-center justify-center overflow-hidden rounded-lg border bg-background md:shadow-xl">
            <AnimatedTabBar />
        </div>
    );
}
