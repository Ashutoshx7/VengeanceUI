"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Container from "./container";
import Heading from "./heading";
import SubHeading from "./subheading";
import { Button } from "./ui/button";
import { BorderBeam } from "./ui/border-beam";
import IsometricGrid from "./ui/isometric-grid";
import IsometricHeroBox from "./ui/isometric-hero-box";
import { GITHUB_REPO_URL } from "@/lib/github";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize } from "lucide-react";

export const VERCEL_OSS_PROGRAM_URL = "https://vercel.com/blog/vercel-open-source-program-winter-2026-cohort#vengenceui";

function CustomVideoPlayer() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const progressBarRef = useRef<HTMLDivElement>(null);

    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(true);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [progress, setProgress] = useState(0);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showControls, setShowControls] = useState(false);
    const [isDragging, setIsDragging] = useState(false);

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(document.fullscreenElement === containerRef.current);
        };
        document.addEventListener("fullscreenchange", handleFullscreenChange);
        return () => {
            document.removeEventListener("fullscreenchange", handleFullscreenChange);
        };
    }, []);

    useEffect(() => {
        const container = containerRef.current;
        const video = videoRef.current;
        if (!container || !video) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.intersectionRatio < 0.05 && !video.paused) {
                    video.pause();
                    setIsPlaying(false);
                }
            },
            { threshold: 0.05 },
        );

        observer.observe(container);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (!isDragging) return;

        const handleMouseMove = (e: MouseEvent) => {
            if (!progressBarRef.current || !videoRef.current || duration === 0) return;
            const rect = progressBarRef.current.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const width = rect.width;
            const newProgress = Math.max(0, Math.min(1, clickX / width));
            videoRef.current.currentTime = newProgress * duration;
            setProgress(newProgress * 100);
            setCurrentTime(newProgress * duration);
        };

        const handleMouseUp = () => {
            setIsDragging(false);
        };

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        };
    }, [isDragging, duration]);

    const togglePlay = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        if (!videoRef.current) return;
        if (isPlaying) {
            videoRef.current.pause();
            setIsPlaying(false);
        } else {
            videoRef.current.play().catch(() => {});
            setIsPlaying(true);
        }
    };

    const toggleMute = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        if (!videoRef.current) return;
        videoRef.current.muted = !isMuted;
        setIsMuted(!isMuted);
    };

    const toggleFullscreen = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        if (!containerRef.current) return;
        if (!isFullscreen) {
            containerRef.current.requestFullscreen().catch(() => {});
        } else {
            document.exitFullscreen().catch(() => {});
        }
    };

    const handleTimeUpdate = () => {
        if (!videoRef.current || isDragging) return;
        const current = videoRef.current.currentTime;
        const total = videoRef.current.duration || 0;
        setCurrentTime(current);
        setProgress(total > 0 ? (current / total) * 100 : 0);
    };

    const handleLoadedMetadata = () => {
        if (!videoRef.current) return;
        setDuration(videoRef.current.duration);
    };

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        setIsDragging(true);
        if (!progressBarRef.current || !videoRef.current || duration === 0) return;
        const rect = progressBarRef.current.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const width = rect.width;
        const newProgress = Math.max(0, Math.min(1, clickX / width));
        videoRef.current.currentTime = newProgress * duration;
        setProgress(newProgress * 100);
        setCurrentTime(newProgress * duration);
    };

    const formatTime = (time: number) => {
        if (isNaN(time)) return "0:00";
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    return (
        <div
            ref={containerRef}
            onMouseEnter={() => setShowControls(true)}
            onMouseLeave={() => setShowControls(false)}
            onClick={(e) => togglePlay(e)}
            className="video-player-container w-full aspect-video relative group bg-black/40 cursor-pointer select-none overflow-hidden"
        >
            <video
                ref={videoRef}
                src="/video/showcase.mp4"
                poster="/video/showcase-poster.webp"
                preload="none"
                loop
                muted={isMuted}
                playsInline
                className="w-full h-full object-cover pointer-events-none"
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
            />

            <BorderBeam
                size={120}
                duration={8}
                delay={0}
                borderWidth={1.5}
                colorFrom="rgba(255, 255, 255, 0.45)"
                colorTo="transparent"
                className="border-beam block dark:opacity-40 opacity-20 pointer-events-none z-10"
            />

            {/* Custom controls overlay */}
            <div
                className={`controls-overlay absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-4 pt-12 flex flex-col gap-3 transition-opacity duration-300 z-20 ${
                    showControls || !isPlaying || isDragging ? "opacity-100" : "opacity-0 pointer-events-none"
                }`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Custom timeline bar */}
                <div
                    ref={progressBarRef}
                    onMouseDown={handleMouseDown}
                    className="h-1.5 w-full bg-white/10 hover:bg-white/20 transition-all rounded-full cursor-pointer relative flex items-center group/timeline"
                >
                    <div
                        style={{ width: `${progress}%` }}
                        className="h-full bg-linear-to-r from-zinc-300 to-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.5)]"
                    />
                    <div
                        style={{ left: `${progress}%` }}
                        className="absolute w-3 h-3 rounded-full bg-white scale-0 group-hover/timeline:scale-100 transition-transform duration-150 -translate-x-1.5 pointer-events-none shadow-md"
                    />
                </div>

                {/* Control buttons row */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={(e) => togglePlay(e)}
                            className="w-8 h-8 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 active:scale-95 transition-all text-white border border-white/5 cursor-pointer"
                        >
                            {isPlaying ? (
                                <Pause className="w-3.5 h-3.5 fill-current" />
                            ) : (
                                <Play className="w-3.5 h-3.5 fill-current translate-x-0.5" />
                            )}
                        </button>

                        <div className="text-[11px] font-mono text-zinc-400 select-none">
                            {formatTime(currentTime)} <span className="text-zinc-600">/</span> {formatTime(duration)}
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={(e) => toggleMute(e)}
                            className="w-8 h-8 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 active:scale-95 transition-all text-white border border-white/5 cursor-pointer"
                        >
                            {isMuted ? (
                                <VolumeX className="w-3.5 h-3.5" />
                            ) : (
                                <Volume2 className="w-3.5 h-3.5" />
                            )}
                        </button>

                        <button
                            onClick={(e) => toggleFullscreen(e)}
                            className="w-8 h-8 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 active:scale-95 transition-all text-white border border-white/5 cursor-pointer"
                        >
                            {isFullscreen ? (
                                <Minimize className="w-3.5 h-3.5" />
                            ) : (
                                <Maximize className="w-3.5 h-3.5" />
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function Hero() {
    return <section id="hero" className="relative isolate">
        <Container>
            <div className="flex md:divide-x md:border-x border-b flex-col md:flex-row overflow-hidden">
                {/* Left Column */}
                <div className="flex flex-col flex-1 min-h-[55vh] md:min-h-[70vh]">
                    {/* Top Content Cell */}
                    <div className="flex flex-col gap-6 px-4 md:px-8 pt-12 pb-10 md:pt-24 md:pb-12">
                        <div className="w-fit relative rounded-md">
                            <VercelOSSProgramBadge />
                            <BorderBeam
                                size={40}
                                duration={3}
                                delay={0}
                                borderWidth={1.5}
                                colorFrom="rgba(255, 255, 255, 0.8)"
                                colorTo="transparent"
                                className="block dark:opacity-50 opacity-20"
                            />
                        </div>

                        <Heading variant="big" as="h1" className="text-start">
                            Next-Gen UI
                            <span className="dark:bg-linear-to-r dark:from-zinc-500 dark:via-zinc-300 dark:to-zinc-500 bg-linear-to-r from-zinc-700 via-zinc-900 to-zinc-700 bg-clip-text text-transparent"> Interactions</span>
                        </Heading>
                        <SubHeading variant="big" as="h2" className="">
                            Hover effects, animated tooltips, and scroll-driven layouts
                            designed for modern marketing websites.
                        </SubHeading>

                        <div className="flex items-center gap-4 mt-4">
                            <Button
                                asChild
                                variant={"default"}
                                size="lg"
                                className="rounded-md w-fit font-medium text-base">
                                <Link href="/components">
                                    Explore blocks
                                </Link>
                            </Button>

                            <Button
                                asChild
                                variant={"outline"}
                                size="lg"
                                className="rounded-md w-fit font-medium text-base shadow">
                                <Link href={GITHUB_REPO_URL}>
                                    View github
                                </Link>
                            </Button>
                        </div>
                    </div>

                    {/* Horizontal Divider Line */}
                    <div className="border-t w-full" />

                    {/* Bottom Custom Video Player Cell */}
                    <CustomVideoPlayer />
                </div>

                {/* Right Column */}
                <div className="flex flex-col items-center justify-center min-h-[75vh] md:min-h-full relative flex-1 px-4 md:px-8 pb-4 md:py-8 bg-muted dark:bg-[#0b0b0c] overflow-hidden" style={{ contain: 'content', transform: 'translateZ(0)' }}>
                    <div className="absolute inset-0 border m-4 border-neutral-400 dark:border-white/10" />
                    <div className="pointer-events-none absolute inset-0 hidden dark:block bg-[radial-gradient(circle_at_50%_34%,rgba(255,255,255,0.08),transparent_28%),radial-gradient(circle_at_50%_72%,rgba(255,255,255,0.06),transparent_30%)]" />
                    <div className="flex flex-col items-center justify-center h-full max-w-[90%] lg:max-w-[70%] w-full relative">
                        <IsometricHeroBox
                            bgClassName="text-neutral-400 dark:text-[#0a0a0b]"
                            stageClassName="text-zinc-200 dark:text-[#0a0a0b]"
                            strokeClassName="text-background stroke-foreground dark:text-[#0a0a0b] dark:stroke-zinc-200"
                            strokeClassName2="text-background stroke-foreground dark:text-[#060607] dark:stroke-zinc-200"
                            logoShadow="text-zinc-700 dark:text-zinc-600"
                            primaryClassName="text-zinc-800 dark:text-zinc-300"
                            size={400}
                            className="mb-0 sm:mb-8 md:mb-0"
                        />

                        <IsometricGrid className="z-0 scale-[2.65] mask-radial-from-0% opacity-50 dark:opacity-40" />

                        <Dialog>
                            <DialogTrigger asChild>
                                <button className="absolute bottom-4 z-30 group flex items-center gap-2.5 px-4 py-2 rounded-full bg-background/80 dark:bg-zinc-900/80 backdrop-blur-md border border-neutral-350 dark:border-zinc-800 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] dark:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.5)] hover:bg-background dark:hover:bg-zinc-900 hover:border-neutral-450 dark:hover:border-zinc-700 transition-all duration-300 cursor-pointer select-none">
                                    <div className="w-6 h-6 rounded-full bg-foreground text-background flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow">
                                        <Play className="w-3.5 h-3.5 fill-current translate-x-0.5" />
                                    </div>
                                    <span className="text-xs font-semibold tracking-wide text-foreground/90 pr-0.5">Watch Showcase</span>
                                </button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-4xl p-0 overflow-hidden border-zinc-800 bg-black/95 aspect-video rounded-xl shadow-2xl">
                                <DialogTitle className="sr-only">Vengeance UI Video Showcase</DialogTitle>
                                <DialogDescription className="sr-only">A video demonstrating Next-Gen UI interactions, animations, and features of Vengeance UI.</DialogDescription>
                                <video
                                    src="/video/showcase.mp4"
                                    poster="/video/showcase-poster.webp"
                                    preload="metadata"
                                    controls
                                    autoPlay
                                    className="w-full h-full aspect-video"
                                />
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
            </div>
        </Container>
    </section>
}

export const VercelOSSProgramBadge = () => {
    return (
        <a href={VERCEL_OSS_PROGRAM_URL} className="flex h-8 items-center gap-2 rounded-md bg-muted dark:bg-muted/60 border px-4 text-sm font-medium"><span className="text-muted-foreground">Backed by</span><span>▲ Vercel OSS Program</span></a>
    )
}
