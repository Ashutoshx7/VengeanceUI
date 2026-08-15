"use client";

import { LiquidText } from "@/components/ui/liquid-text";

export function LiquidTextDemo() {
    return (
        <div className="relative flex h-full w-full items-center justify-center overflow-hidden">
            <LiquidText text="Hover Me" fontSize={220} />
        </div>
    );
}

export function LiquidTextColorDemo() {
    return (
        <div className="relative flex h-full w-full items-center justify-center overflow-hidden">
            <LiquidText text="Colorful" color="#ff6b6b" fontSize={180} />
        </div>
    );
}

export function LiquidTextThemeDemo() {
    return (
        <div className="relative flex h-full w-full items-center justify-center overflow-hidden">
            <LiquidText text="Theme" lightColor="#1a1a1a" darkColor="#f5f5f5" fontSize={180} />
        </div>
    );
}

export function LiquidTextFontDemo() {
    return (
        <div className="relative flex h-full w-full items-center justify-center overflow-hidden">
            <LiquidText text="Fancy" font="Georgia, serif" fontSize={200} />
        </div>
    );
}
