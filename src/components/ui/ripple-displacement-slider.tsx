"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { cn } from "@/lib/utils";

export interface RippleSlide {
  title: string;
  description: string;
  image: string;
}

export interface RippleDisplacementSliderProps {
  className?: string;
  slides?: RippleSlide[];
}

const IMAGE_BASE_URL =
  "https://raw.githubusercontent.com/Ashutoshx7/VengeanceUI/main/public";

const DEFAULT_SLIDES: RippleSlide[] = [
  {
    title: "Goku",
    description: "The Earth's greatest defender. Constantly pushing past his limits to achieve new heights like Ultra Instinct.",
    image: `${IMAGE_BASE_URL}/goku.png`,
  },
  {
    title: "Luffy",
    description: "Captain of the Straw Hat Pirates. The Sun God Nika who brings smiles and liberates the seas with Gear 5.",
    image: `${IMAGE_BASE_URL}/luffy.png`,
  },
  {
    title: "Naruto",
    description: "The Hero of the Hidden Leaf. Wielding the massive power of the Nine-Tails and Six Paths Sage Mode.",
    image: `${IMAGE_BASE_URL}/naruto.png`,
  },
  {
    title: "Ichigo",
    description: "The Substitute Soul Reaper. Combining Hollow, Quincy, and Soul Reaper powers for an unstoppable True Bankai.",
    image: `${IMAGE_BASE_URL}/ichigo.png`,
  },
  {
    title: "Zoro",
    description: "The King of Hell. Master of the Three Sword Style, cutting through anything with terrifying conqueror's haki.",
    image: `${IMAGE_BASE_URL}/zoro.png`,
  },
  {
    title: "Aizen",
    description: "The ultimate mastermind. Standing at the pinnacle of power with his terrifying spiritual pressure and illusions.",
    image: `${IMAGE_BASE_URL}/aizen.png`,
  },
  {
    title: "Vegeta",
    description: "The proud Prince of all Saiyans. Fueled by his rivalry with Goku and his unyielding royal pride.",
    image: `${IMAGE_BASE_URL}/vegeta.png`,
  },
  {
    title: "Gohan",
    description: "Possesses hidden potential that surpasses even his father. When pushed to the edge, the Beast awakens.",
    image: `${IMAGE_BASE_URL}/gohan.png`,
  },
  {
    title: "Broly",
    description: "A mutant Saiyan of pure, unstoppable rage. His legendary power grows continuously during combat.",
    image: `${IMAGE_BASE_URL}/broly.png`,
  },
  {
    title: "Frieza",
    description: "The tyrannical emperor of Universe 7. A ruthless conqueror who always returns with a new, terrifying form.",
    image: `${IMAGE_BASE_URL}/frieza.png`,
  }
];

export const vertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export const fragmentShader = `
uniform sampler2D uTexCurrent;
uniform sampler2D uTexNext;
uniform float uProgress;
uniform vec2 uResolution;
uniform vec2 uImageRes;
uniform float uWaveFreq;
uniform float uWavePow;
uniform float uWaveWidth;
uniform float uFalloff;
uniform float uBoostStrength;
uniform float uCrossfadeWidth;
uniform float uMobile;

varying vec2 vUv;

vec2 getImageUv(vec2 uv, vec2 screenRes, vec2 imgRes, vec2 boxMin, vec2 boxMax) {
  vec2 boxUv = (uv - boxMin) / (boxMax - boxMin);
  vec2 boxSize = (boxMax - boxMin) * screenRes;
  float boxAspect = boxSize.x / boxSize.y;
  float imgAspect = imgRes.x / imgRes.y;
  vec2 scale = vec2(1.0);
  if (boxAspect > imgAspect) {
    scale.y = imgAspect / boxAspect;
  } else {
    scale.x = boxAspect / imgAspect;
  }
  return (boxUv - 0.5) * scale + 0.5;
}

bool isInsideBox(vec2 uv, vec2 boxMin, vec2 boxMax) {
  return uv.x >= boxMin.x && uv.x <= boxMax.x && uv.y >= boxMin.y && uv.y <= boxMax.y;
}

void main() {
  vec2 boxMin = mix(vec2(0.25, 0.175), vec2(0.0), uMobile);
  vec2 boxMax = mix(vec2(0.75, 0.825), vec2(1.0), uMobile);

  float aspectRatio = uResolution.y / uResolution.x;
  vec2 coord = vec2(vUv.x, vUv.y * aspectRatio);
  vec2 center = vec2(0.5, 0.5 * aspectRatio);
  
  float dist = distance(coord, center);
  float time = uProgress;

  vec2 displaced = coord;
  float brightness = 0.0;
  float blend = 0.0;

  if (time > 0.001) {
    float trailing = dist - time;
    if (trailing < uWaveWidth && trailing < 0.0) {
      float age = -trailing;
      float decay = exp(-age * uFalloff);
      float wave = sin(age * uWaveFreq) * decay;
      vec2 direction = normalize(coord - center);
      displaced += direction * wave * uWavePow;
      brightness = abs(wave) * uBoostStrength * decay;
    }
    blend = smoothstep(0.0, uCrossfadeWidth, -trailing);
  }
  
  vec2 finalUv = vec2(displaced.x, displaced.y / aspectRatio);
  vec2 imageUv = getImageUv(finalUv, uResolution, uImageRes, boxMin, boxMax);
  
  vec4 currentColor = texture2D(uTexCurrent, imageUv);
  vec4 nextColor = texture2D(uTexNext, imageUv);

  vec4 color = mix(currentColor, nextColor, blend);
  color.rgb += color.rgb * brightness;

  if (!isInsideBox(finalUv, boxMin, boxMax)) {
    color = vec4(0.0);
  }

  gl_FragColor = color;
}
`;

const rippleConfig = {
  waveFreq: 25.0,
  wavePow: 0.035,
  waveWidth: 0.5,
  falloff: 10.0,
  boostStrength: 0.5,
  crossfadeWidth: 0.05,
  duration: 1.2,
  endValue: 1.0,
  ease: "power2.inOut",
};

export function RippleDisplacementSlider({ 
  className,
  slides = DEFAULT_SLIDES
}: RippleDisplacementSliderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loadedSlides, setLoadedSlides] = useState<RippleSlide[] | null>(null);
  const texturesLoaded = loadedSlides === slides;
  
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);
  const texturesRef = useRef<THREE.Texture[]>([]);
  const isTransitioning = useRef(false);

  // Free alternative to SplitText
  const renderSplitTitle = (title: string) => {
    return title.split("").map((char, i) => (
      <span key={i} className="inline-block overflow-hidden relative">
        <span className="char inline-block will-change-transform relative">{char === " " ? "\u00A0" : char}</span>
      </span>
    ));
  };

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current || slides.length === 0) return;

    let isActive = true;
    let resize: (() => void) | undefined;
    let renderFrame: (() => void) | undefined;
    let geometry: THREE.PlaneGeometry | undefined;
    let material: THREE.ShaderMaterial | undefined;
    let ctx: gsap.Context | undefined;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-0.5, 0.5, 0.5, -0.5, 0.01, 10);
    camera.position.z = 1;

    const renderer = new THREE.WebGLRenderer({ 
      canvas: canvasRef.current,
      antialias: true, 
      alpha: true 
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);

    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin("anonymous");
    
    // OPTIMIZATION: Only await the FIRST texture so it renders immediately.
    const loadFirstTexture = new Promise<THREE.Texture>((resolve) => {
      loader.load(
        slides[0].image, 
        (texture) => {
          texture.minFilter = THREE.LinearFilter;
          texture.magFilter = THREE.LinearFilter;
          texture.wrapS = THREE.ClampToEdgeWrapping;
          texture.wrapT = THREE.ClampToEdgeWrapping;
          resolve(texture);
        },
        undefined,
        (err) => {
          console.error("Failed to load first texture", err);
          resolve(new THREE.Texture()); // Resolve anyway so it doesn't hang
        }
      );
    });

    loadFirstTexture.then((firstTex) => {
      if (!isActive || !containerRef.current) {
        firstTex.dispose();
        return;
      }

      // Background load the rest seamlessly
      const allTextures = slides.map((slide, idx) => {
        if (idx === 0) return firstTex;
        const tex = loader.load(slide.image);
        tex.minFilter = THREE.LinearFilter;
        tex.magFilter = THREE.LinearFilter;
        tex.wrapS = THREE.ClampToEdgeWrapping;
        tex.wrapT = THREE.ClampToEdgeWrapping;
        return tex;
      });
      
      texturesRef.current = allTextures;
      
      const width = containerRef.current!.clientWidth;
      const height = containerRef.current!.clientHeight;
      const isMobile = width < 1000;

      const image = firstTex.image as { width?: number; height?: number } | undefined;
      const imgWidth = image?.width || 1920;
      const imgHeight = image?.height || 1080;

      const nextMaterial = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {
          uTexCurrent: { value: allTextures[0] },
          uTexNext: { value: allTextures[1 % slides.length] },
          uProgress: { value: 0 },
          uResolution: { value: new THREE.Vector2(width, height) },
          uImageRes: { value: new THREE.Vector2(imgWidth, imgHeight) },
          uWaveFreq: { value: rippleConfig.waveFreq },
          uWavePow: { value: rippleConfig.wavePow },
          uWaveWidth: { value: rippleConfig.waveWidth },
          uFalloff: { value: rippleConfig.falloff },
          uBoostStrength: { value: rippleConfig.boostStrength },
          uCrossfadeWidth: { value: rippleConfig.crossfadeWidth },
          uMobile: { value: isMobile ? 1.0 : 0.0 },
        },
        transparent: true,
      });
      material = nextMaterial;
      materialRef.current = nextMaterial;

      const nextGeometry = new THREE.PlaneGeometry(1, 1);
      geometry = nextGeometry;
      const mesh = new THREE.Mesh(nextGeometry, nextMaterial);
      scene.add(mesh);

      resize = () => {
        if (!containerRef.current) return;
        const w = containerRef.current.clientWidth;
        const h = containerRef.current.clientHeight;
        renderer.setSize(w, h);
        nextMaterial.uniforms.uResolution.value.set(w, h);
        nextMaterial.uniforms.uMobile.value = w < 1000 ? 1.0 : 0.0;

        // Ensure the wave expands fully beyond the screen corners
        const ratio = h / w;
        const cx = 0.5;
        const cy = 0.5 * ratio;
        const maxDist = Math.sqrt(cx * cx + cy * cy);
        
        rippleConfig.endValue = maxDist + rippleConfig.waveWidth;
        rippleConfig.duration = w <= 1000 ? 0.9 : 1.2;
      };
      resize();
      window.addEventListener("resize", resize);

      renderFrame = () => {
        renderer.render(scene, camera);
      };
      gsap.ticker.add(renderFrame);

      setLoadedSlides(slides);

      // Trigger initial text in based on Screenshot 3
      ctx = gsap.context(() => {
        const chars = contentRef.current?.querySelectorAll(".char") ?? [];
        
        gsap.fromTo(
          chars,
          { y: "100%" },
          { y: "0%", duration: 0.8, stagger: 0.025, ease: "power2.out" }
        );
      }, contentRef);

    });

    return () => {
      isActive = false;

      if (resize) window.removeEventListener("resize", resize);
      if (renderFrame) gsap.ticker.remove(renderFrame);
      ctx?.revert();

      texturesRef.current.forEach((texture) => texture.dispose());
      texturesRef.current = [];
      materialRef.current = null;
      isTransitioning.current = false;
      if (material) gsap.killTweensOf(material.uniforms.uProgress);
      geometry?.dispose();
      material?.dispose();
      renderer.dispose();
    };
  }, [slides]);

  const handleNextSlide = useCallback(() => {
    if (slides.length === 0 || isTransitioning.current || !materialRef.current || !texturesRef.current.length) return;
    isTransitioning.current = true;

    const nextIndex = (currentIndex + 1) % slides.length;
    
    // Animate text out
    const chars = contentRef.current?.querySelectorAll(".char");
      
    const tl = gsap.timeline({
      onComplete: () => {
        setCurrentIndex(nextIndex);
        
        // Wait for React to render new text, then animate in
        setTimeout(() => {
          const newChars = contentRef.current?.querySelectorAll(".char");
          if (!newChars) return;
          
          gsap.set(newChars, { y: "100%" });
          
          gsap.to(newChars, {
            y: "0%",
            duration: 0.5,
            stagger: 0.015,
            ease: "power3.out",
          });
        }, 50);
      }
    });
      
    tl.to(chars || [], {
      y: "-100%",
      duration: 0.3,
      stagger: 0.01,
      ease: "power2.in",
    });

    // Animate shader
    const material = materialRef.current;
    material.uniforms.uTexNext.value = texturesRef.current[nextIndex];
    
    gsap.to(material.uniforms.uProgress, {
      value: rippleConfig.endValue,
      duration: rippleConfig.duration,
      ease: rippleConfig.ease,
      onComplete: () => {
        material.uniforms.uTexCurrent.value = texturesRef.current[nextIndex];
        material.uniforms.uProgress.value = 0;
        isTransitioning.current = false;
      }
    });
  }, [currentIndex, slides.length]);

  // Autoplay loop
  useEffect(() => {
    if (!texturesLoaded || slides.length === 0) return;
    const timer = setTimeout(() => {
      handleNextSlide();
    }, 5000);
    return () => clearTimeout(timer);
  }, [handleNextSlide, slides.length, texturesLoaded]);

  const activeSlide = slides[currentIndex] ?? slides[0];

  if (!activeSlide) {
    return (
      <div
        className={cn(
          "flex min-h-[600px] w-full items-center justify-center bg-[#e0ddcf] text-sm text-neutral-600 dark:bg-black dark:text-neutral-400",
          className
        )}
      >
        No slides to display.
      </div>
    );
  }

  return (
    <div 
      ref={containerRef} 
      className={cn("slider relative w-full h-full min-h-[600px] overflow-hidden bg-[#e0ddcf] dark:bg-black cursor-pointer", className)}
      onClick={handleNextSlide}
    >
      <canvas ref={canvasRef} className="block w-full h-full absolute inset-0 z-0" />
      
      <div 
        ref={contentRef}
        className="slide-content absolute inset-0 w-full h-full mix-blend-difference select-none pointer-events-none z-[2]"
        style={{ opacity: texturesLoaded ? 1 : 0, transition: "opacity 0.5s ease" }}
      >
        <div className="slide-title absolute top-1/2 left-12 -translate-y-1/2 w-max text-white max-[1000px]:top-1/2 max-[1000px]:left-1/2 max-[1000px]:-translate-x-1/2 max-[1000px]:-translate-y-1/2">
          <h1 className="text-[clamp(2rem,4vw,6rem)] font-medium tracking-[-0.02em] leading-tight">
            {renderSplitTitle(activeSlide.title)}
          </h1>
        </div>
      </div>
    </div>
  );
}

export default RippleDisplacementSlider;
