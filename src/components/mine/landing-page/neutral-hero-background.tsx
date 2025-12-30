"use client";

import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";

export const NeutralHeroBackground = ({ className }: { className?: string }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { theme } = useTheme();

    // Determine colors based on theme
    // We can't purely rely on CSS variables inside the canvas logic easily without parsing,
    // so we'll check the theme string or body class.
    // However, for simplicity and performance in a client component, we can use a helper or hook.
    // Here we'll just check if the theme contains 'dark'.
    // A more robust way is to use system preference if theme is 'system'.
    // But let's assume standard 'dark' class presence on body for the canvas color.

    // Actually, getting computed style is safer for theme transitions.

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationFrameId: number;
        let particles: Particle[] = [];
        let particleCount = 0;

        const calculateParticleCount = () => {
            return Math.floor((window.innerWidth * window.innerHeight) / 6000);
        };

        class Particle {
            x: number = 0;
            y: number = 0;
            speed: number = 0;
            opacity: number = 1;
            fadeDelay: number = 0;
            fadeStart: number = 0;
            fadingOut: boolean = false;

            constructor() {
                this.reset();
                this.y = Math.random() * canvas!.height;
                this.fadeDelay = Math.random() * 600 + 100;
                this.fadeStart = Date.now() + this.fadeDelay;
                this.fadingOut = false;
            }

            reset() {
                this.x = Math.random() * canvas!.width;
                this.y = Math.random() * canvas!.height;
                this.speed = Math.random() / 5 + 0.1;
                this.opacity = 1;
                this.fadeDelay = Math.random() * 600 + 100;
                this.fadeStart = Date.now() + this.fadeDelay;
                this.fadingOut = false;
            }

            update() {
                this.y -= this.speed;
                if (this.y < 0) {
                    this.reset();
                }

                if (!this.fadingOut && Date.now() > this.fadeStart) {
                    this.fadingOut = true;
                }

                if (this.fadingOut) {
                    this.opacity -= 0.008;
                    if (this.opacity <= 0) {
                        this.reset();
                    }
                }
            }

            draw(isDark: boolean) {
                if (!ctx) return;

                let brightness;
                if (isDark) {
                    // White/Grey particles for Dark Mode
                    brightness = Math.random() * 100 + 155;
                    ctx.fillStyle = `rgba(${brightness}, ${brightness}, ${brightness}, ${this.opacity})`;
                } else {
                    // Grey/Black particles for Light Mode
                    brightness = Math.random() * 80;
                    ctx.fillStyle = `rgba(${brightness}, ${brightness}, ${brightness}, ${this.opacity})`;
                }

                ctx.fillRect(this.x, this.y, 0.4, Math.random() * 2 + 1);
            }
        }

        const initParticles = () => {
            particleCount = calculateParticleCount();
            particles = [];
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        };

        const animate = () => {
            // Check for dark mode via class on html or body
            const isDarkMode = document.documentElement.classList.contains("dark");

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach((particle) => {
                particle.update();
                particle.draw(isDarkMode);
            });
            animationFrameId = requestAnimationFrame(animate);
        };

        const onResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initParticles();
        };

        window.addEventListener("resize", onResize);

        // Initial setup
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        initParticles();
        animate();

        return () => {
            window.removeEventListener("resize", onResize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <div className={cn("absolute inset-0 overflow-hidden pointer-events-none select-none", className)}>
            <style jsx>{`
        .neutral-wrapper {
            --_factor: min(600px, 80vh);
            --_size: min(var(--_factor), 80vw);
        }
        
        /* Spotlight Effect */
        .spotlight {
            pointer-events: none;
            position: absolute; left: 0; right: 0; top: 0; margin: 0 auto;
            transition: filter 1s ease-in-out;
            height: 42em; width: 100%;
            overflow: hidden;
            z-index: 0;
        }
        .spotlight > div {
            border-radius: 0 0 50% 50%;
            position: absolute; left: 0; right: 0; margin: 0 auto; 
            top: 3em;
            width: 30em; height: max(42em, 86vh);
            
            /* Gradient adapts via CSS variables or utility classes? 
               We'll use standard CSS variables for light/dark adaptation if available, or just media queries manually.
               Since generic CSS vars are cleaner:
            */
            /* Default (Light Mode) Spotlight: Subtle Grey/Blue-ish */
            background-image: conic-gradient(from 0deg at 50% -5%, transparent 45%, rgba(100, 100, 100, .1) 49%, rgba(0, 0, 0, .1) 50%, rgba(100, 100, 100, .1) 51%, transparent 55%);
            
            transform-origin: 50% 0;
            filter: blur(15px) opacity(0.5);
            z-index: -1;
            animation: load 2s ease-in-out forwards, loadrot 2s ease-in-out forwards, spotlight 21s ease-in-out infinite reverse;
        }
        
        /* Dark Mode Override for Spotlight */
        :global(.dark) .spotlight > div {
            background-image: conic-gradient(from 0deg at 50% -5%, transparent 45%, rgba(200, 200, 200, .15) 49%, rgba(255, 255, 255, .2) 50%, rgba(200, 200, 200, .15) 51%, transparent 55%);
        }

        .spotlight > div:nth-child(1){ 
            rotate: 20deg;
            animation: load 2s ease-in-out forwards, loadrot 2s ease-in-out forwards, spotlight 17s ease-in-out infinite;
        }
        .spotlight > div:nth-child(2){ 
            rotate: -20deg;
            animation: load 2s ease-in-out forwards, loadrot 2s ease-in-out forwards, spotlight 14s ease-in-out infinite;
        }
        
        /* Accent Lines */
        .accent-lines {
            pointer-events: none;
            position: absolute; top: 0; left: 0; right: 0;
            width: 100%; height: 42em;
            z-index: -2;
            --accent-lines-clr: rgba(0, 0, 0, 0.1); 
        }
        
        :global(.dark) .accent-lines {
             --accent-lines-clr: rgba(255, 255, 255, .08);
        }

        .accent-lines > div {
            position: absolute; top: 0; right: 0; left: 0; margin: auto;
            height: 100%; width: 100%;
        }
        .accent-lines > div:nth-child(1) > div{
            position: absolute; top: 0; right: 0; left: 0; margin: auto;
            width: 100%; height: 1px;
            background: linear-gradient(90deg, transparent, var(--accent-lines-clr), transparent);
            opacity: 0; scale: 0;
            animation: accentload 2s ease-out 2.4s forwards;
        }
        .accent-lines > div:nth-child(1) > div:nth-child(1){ top: 6em; }
        .accent-lines > div:nth-child(1) > div:nth-child(2){ top: 11em; }
        .accent-lines > div:nth-child(1) > div:nth-child(3){ top: 16em; }
        .accent-lines > div:nth-child(1) > div:nth-child(4){ top: 24em; }
        .accent-lines > div:nth-child(1) > div:nth-child(5){ top: 29em; }
        
        .accent-lines > div:nth-child(2) > div{
            position: absolute; top: 0; right: 0; left: 0; margin: auto;
            width: 1px; height: 100%;
            background: var(--accent-lines-clr);
        }
        .accent-lines > div:nth-child(2) > div {
            opacity: 0; scale: 0;
            animation: accentload 2s ease-out 2s forwards;
        }
        .accent-lines > div:nth-child(2) > div:nth-child(1){ left: 24em; }
        .accent-lines > div:nth-child(2) > div:nth-child(2){ left: 34em; }
        .accent-lines > div:nth-child(2) > div:nth-child(3){ right: 24em; }
        .accent-lines > div:nth-child(2) > div:nth-child(4){ right: 34em; }

        /* Mountains */
        .mountains {
            position: absolute; left: 0; right: 0; top: 31em; margin: auto;
            width: 100%; height: 10em;
            pointer-events: none;
            z-index: 1;
        }
        .mountains::before {
            content: ''; display: block;
            width: 100%; height: 500%;
            position: absolute; top: 0%;
            /* Light mode gradient */
            background: linear-gradient(90deg, #ffffff 0%, transparent 50%);
            background: linear-gradient(0deg, #ffffff 80%, transparent 90%);
            z-index: 2;
        }
        :global(.dark) .mountains::before {
            background: linear-gradient(90deg, #000000 0%, transparent 50%);
            background: linear-gradient(0deg, #000000 80%, transparent 90%);
        }

        .mountains > div {
            /* Light mode shadows/bg */
            box-shadow: 
            -1em -0.2em 0.4em -1.1em #e5e7eb,
            inset 0em 0em 0em 2px #e5e7eb,
            inset 0.2em 0.3em 0.2em -0.2em #e5e7eb,
            inset 10.2em 10.3em 2em -10em rgba(0,0,0, 0.05);
            background: #ffffff;
            z-index: 1;
            filter: brightness(1);
            position: absolute; left: 0; right: 0; margin: auto;
            width: 20em; height: 20em;
            rotate: 45deg;
        }

        :global(.dark) .mountains > div {
            box-shadow: 
            -1em -0.2em 0.4em -1.1em #2a2a2a,
            inset 0em 0em 0em 2px #2a2a2a,
            inset 0.2em 0.3em 0.2em -0.2em #2a2a2a,
            inset 10.2em 10.3em 2em -10em rgba(40,40,40, 0.2);
            background: #000000;
            filter: brightness(0.8);
        }

        .mountains > div:nth-child(1) {
            bottom: -240%; 
            translate: -6em 2em;
            animation: mountainload1 2s ease-out 2.4s forwards;
        }
        .mountains > div:nth-child(2) {
            bottom: -240%;
            translate: -2em 0em;
            width: 14em; height: 20em;
            animation: mountainload2 2s ease-out 2.2s forwards;
        }
        .mountains > div:nth-child(3) {
            bottom: -240%; 
            translate: 6em 3em;
            animation: mountainload1 2s ease-out 2s forwards;
        }
        
        /* Animations */
        @keyframes load { 0% { opacity: 0; } 100% { opacity: 1; } }
        @keyframes loadrot { 0% { rotate: 0deg; scale: 0; } 100% { scale: 1; } }
        @keyframes spotlight {
            0% { transform: rotateZ(0deg) scale(1); filter: blur(15px) opacity(0.5); }
            20% { transform: rotateZ(-1deg) scale(1.2); filter: blur(16px) opacity(0.6); }    
            40% { transform: rotateZ(2deg) scale(1.3); filter: blur(14px) opacity(0.4); }    
            60% { transform: rotateZ(-2deg) scale(1.2); filter: blur(15px) opacity(0.6); }    
            80% { transform: rotateZ(1deg) scale(1.1); filter: blur(13px) opacity(0.4); }    
            100% { transform: rotateZ(0deg) scale(1); filter: blur(15px) opacity(0.5); }    
        }
        @keyframes accentload { 0% { opacity: 0; scale: 0; } 100% { opacity: 1; scale: 1; } }
        @keyframes mountainload1 { 0% { bottom: -240%; } 100% { bottom: -140%; } }
        @keyframes mountainload2 { 0% { bottom: -240%; } 100% { bottom: -108%; } }
      `}</style>

            {/* Background Colors */}
            <div className="absolute inset-0 bg-white dark:bg-black -z-10 transition-colors duration-300" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-100/50 via-white to-white dark:from-zinc-900/20 dark:via-black dark:to-black -z-10 transition-colors duration-300" />

            {/* Spotlight */}
            <div className="spotlight">
                <div></div>
                <div></div>
                <div></div>
            </div>

            {/* Accent Lines */}
            <div className="accent-lines">
                <div>
                    <div></div><div></div><div></div><div></div><div></div>
                </div>
                <div>
                    <div></div><div></div><div></div><div></div>
                </div>
            </div>

            {/* Mountains */}
            <div className="mountains">
                <div></div>
                <div></div>
                <div></div>
            </div>

            {/* Particles */}
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-10" />
        </div>
    );
};
