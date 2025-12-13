"use client";

import * as React from "react";
import { FolderPreview, FolderVariant } from "@/components/ui/folder-preview";

// ============================================
// Demo: All Variants Grid
// ============================================

const variants: { variant: FolderVariant; label: string }[] = [
    { variant: "devi", label: "Devi" },
    { variant: "rudras", label: "Rudras" },
    { variant: "ardra", label: "Ardra" },
    { variant: "shakti", label: "Shakti" },
    { variant: "kubera", label: "Kubera" },
    { variant: "hari", label: "Hari" },
    { variant: "ravi", label: "Ravi" },
    { variant: "durga", label: "Durga" },
    { variant: "nandi", label: "Nandi" },
];

export function FolderPreviewDemo() {
    return (
        <div className="grid grid-cols-3 gap-8 p-8 bg-white dark:bg-black rounded-xl border border-neutral-200 dark:border-neutral-800">
            {variants.map(({ variant, label }) => (
                <div
                    key={variant}
                    className="flex items-center justify-center min-h-[200px] rounded-xl p-8"
                >
                    <FolderPreview variant={variant} label={label} size="lg" />
                </div>
            ))}
        </div>
    );
}

// ============================================
// Demo: Single Interactive Folder
// ============================================

export function FolderPreviewSingle() {
    return (
        <div className="flex items-center justify-center min-h-[350px] bg-white dark:bg-black rounded-xl p-16 overflow-visible border border-neutral-200 dark:border-neutral-800">
            <FolderPreview
                variant="devi"
                label="Shared Files"
                size="lg"
                images={[
                    "/folder-preview/user1.svg",
                    "/folder-preview/user2.svg",
                    "/folder-preview/user3.svg",
                    "/folder-preview/user4.svg",
                    "/folder-preview/user5.svg",
                ]}
            />
        </div>
    );
}

// ============================================
// Demo: Custom Images
// ============================================

export function FolderPreviewCustom() {
    return (
        <div className="flex items-center justify-center gap-16 min-h-[300px] bg-white dark:bg-black rounded-xl p-12 border border-neutral-200 dark:border-neutral-800">
            <FolderPreview
                variant="ardra"
                label="Photos"
                size="lg"
                images={[
                    "/folder-preview/photo1.png",
                    "/folder-preview/photo2.png",
                    "/folder-preview/photo3.png",
                    "/folder-preview/photo4.png",
                    "/folder-preview/photo5.png",
                    "/folder-preview/photo6.png",
                    "/folder-preview/photo7.png",
                    "/folder-preview/photo8.png",
                ]}
            />

            <FolderPreview
                variant="ravi"
                label="Gallery"
                size="lg"
                images={[
                    "/folder-preview/photo13.png",
                    "/folder-preview/photo14.png",
                    "/folder-preview/photo15.png",
                ]}
            />
        </div>
    );
}

// ============================================
// Demo: File List Folders
// ============================================

export function FolderPreviewFiles() {
    return (
        <div className="flex items-center justify-center gap-16 min-h-[350px] bg-white dark:bg-black rounded-xl p-12 border border-neutral-200 dark:border-neutral-800">
            <FolderPreview
                variant="durga"
                label="Project"
                size="lg"
                files={[
                    { name: "docs" },
                    { name: "template" },
                    { name: "readme.md", type: "txt" },
                    { name: "app.js", type: "txt" },
                    { name: "test.sh", type: "txt" },
                    { name: "package.json", type: "txt" },
                    { name: "logo.svg" },
                    { name: "..." },
                ]}
            />

            <FolderPreview
                variant="nandi"
                label="Downloads"
                size="lg"
                files={[
                    { name: "qa.txt", type: "txt" },
                    { name: "cats.mp3", type: "mp3" },
                    { name: "funny.gif", type: "gif" },
                    { name: "hoho.gif", type: "gif" },
                    { name: "letter.txt", type: "txt" },
                    { name: "boss.gif", type: "gif" },
                    { name: "ufo.txt", type: "txt" },
                    { name: "howl.mp3", type: "mp3" },
                    { name: "•••" },
                ]}
            />
        </div>
    );
}

// ============================================
// Demo: Size Variations
// ============================================

export function FolderPreviewSizes() {
    return (
        <div className="flex items-end justify-center gap-12 min-h-[300px] bg-white dark:bg-black rounded-xl p-12 border border-neutral-200 dark:border-neutral-800">
            <FolderPreview variant="devi" label="Small" size="sm" />
            <FolderPreview variant="devi" label="Medium" size="md" />
            <FolderPreview variant="devi" label="Large" size="lg" />
        </div>
    );
}

// ============================================
// Default Export
// ============================================

export default FolderPreviewDemo;
