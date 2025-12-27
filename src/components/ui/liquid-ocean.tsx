"use client";

import React, { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { RectAreaLightUniformsLib } from "three/examples/jsm/lights/RectAreaLightUniformsLib.js";
import * as THREE from "three";
import { cn } from "@/lib/utils";

// Initialize RectAreaLight uniforms
if (typeof window !== "undefined") {
    RectAreaLightUniformsLib.init();
}

// =============================================================================
// DEFAULT THEME (Original "Little Boxes" Style - DO NOT CHANGE)
// =============================================================================
const DEFAULT_THEME = {
    background: 0x000000,
    gridColor: 0x333333,
    accentColor: 0xF00589, // The original pinkish color
};

// =============================================================================
// OCEAN MESH COMPONENT
// =============================================================================
interface OceanMeshProps {
    geoSize: number;
    geoFragments: number;
    waveAmplitude: number;
    waveSpeed: number;
    accentColor: number;
    showWireframe: boolean;
    opacity: number;
}

function OceanMesh({
    geoSize,
    geoFragments,
    waveAmplitude,
    waveSpeed,
    accentColor,
    showWireframe,
    opacity,
}: OceanMeshProps) {
    const meshRef = useRef<THREE.Mesh>(null);
    const wireRef = useRef<THREE.Mesh>(null);

    const { geometry, waves } = useMemo(() => {
        const geo = new THREE.PlaneGeometry(geoSize, geoSize, geoFragments, geoFragments);
        const positionAttribute = geo.getAttribute("position");
        const waveData: Array<{
            x: number;
            y: number;
            z: number;
            ang: number;
            amp: number;
            speed: number;
        }> = [];

        for (let i = 0; i < positionAttribute.count; i++) {
            waveData.push({
                x: positionAttribute.getX(i),
                y: positionAttribute.getY(i),
                z: positionAttribute.getZ(i),
                ang: Math.PI * 2,
                amp: Math.random() * waveAmplitude,
                speed: 0.03 + Math.random() * waveSpeed,
            });
        }

        return { geometry: geo, waves: waveData };
    }, [geoSize, geoFragments, waveAmplitude, waveSpeed]);

    useFrame(() => {
        if (!meshRef.current) return;

        const positionAttribute = meshRef.current.geometry.getAttribute("position");

        for (let i = 0; i < positionAttribute.count; i++) {
            const wave = waves[i];
            positionAttribute.setX(i, wave.x + Math.cos(wave.ang) * wave.amp);
            positionAttribute.setY(i, wave.y + Math.sin(wave.ang / 2) * wave.amp);
            positionAttribute.setZ(i, wave.z + Math.cos(wave.ang / 3) * wave.amp);
            wave.ang += wave.speed;
        }

        positionAttribute.needsUpdate = true;
    });

    const wireframeMaterial = useMemo(
        () =>
            new THREE.MeshPhysicalMaterial({
                color: accentColor,
                wireframe: true,
                transparent: false,
                opacity: 1,
            }),
        [accentColor]
    );

    const surfaceMaterial = useMemo(
        () =>
            new THREE.MeshPhysicalMaterial({
                color: accentColor,
                transparent: true,
                opacity: opacity,
                wireframe: false,
            }),
        [accentColor, opacity]
    );

    return (
        <group rotation={[-90 * Math.PI / 180, 0, 0]}>
            <mesh ref={meshRef} geometry={geometry} material={surfaceMaterial} receiveShadow />
            {showWireframe && (
                <mesh ref={wireRef} geometry={geometry} material={wireframeMaterial} />
            )}
        </group>
    );
}

// =============================================================================
// BOAT / FLOATING BOXES COMPONENT
// =============================================================================
interface BoatData {
    position: [number, number, number];
    scale: [number, number, number];
    rotationY: number;
    vel: number;
    amp: number;
    pos: number;
}

function Boat({ data, color }: { data: BoatData; color: number }) {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame(({ clock }) => {
        if (!meshRef.current) return;
        const time = clock.getElapsedTime() * 3;

        meshRef.current.rotation.z = (Math.sin(time / data.vel) * data.amp * Math.PI) / 180;
        meshRef.current.rotation.x = (Math.cos(time) * data.vel * Math.PI) / 180;
        meshRef.current.position.y = Math.sin(time / data.vel) * data.pos;
    });

    return (
        <mesh
            ref={meshRef}
            position={data.position}
            rotation={[0, data.rotationY, 0]}
            scale={data.scale}
            castShadow
        >
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color={color} />
        </mesh>
    );
}

function BoatGroup({ count, spreadRange, color }: { count: number; spreadRange: number; color: number }) {
    const boats = useMemo(() => {
        const items: BoatData[] = [];
        for (let i = 0; i < count; i++) {
            const x = -Math.random() * spreadRange + Math.random() * spreadRange;
            const z = -Math.random() * spreadRange + Math.random() * spreadRange;
            const sX = Math.random();
            const sY = 0.5 + Math.random() * 2;

            items.push({
                position: [x, 0, z],
                scale: [sX, sY, sX],
                rotationY: (Math.random() * 360 * Math.PI) / 180,
                vel: 1 + Math.random() * 4,
                amp: 1 + Math.random() * 6,
                pos: Math.random() * 0.2,
            });
        }
        return items;
    }, [count, spreadRange]);

    return (
        <group>
            {boats.map((boat, i) => (
                <Boat key={i} data={boat} color={color} />
            ))}
        </group>
    );
}

// =============================================================================
// SCENE CONTENT
// =============================================================================
interface SceneContentProps {
    backgroundColor: number;
    gridColor: number;
    accentColor: number;
    rotationSpeed: number;
    showGrid: boolean;
    showBoats: boolean;
    boatCount: number;
    boatSpread: number;
    oceanSize: number;
    oceanFragments: number;
    waveAmplitude: number;
    waveSpeed: number;
    showWireframe: boolean;
    oceanOpacity: number;
}

function SceneContent({
    backgroundColor,
    gridColor,
    accentColor,
    rotationSpeed,
    showGrid,
    showBoats,
    boatCount,
    boatSpread,
    oceanSize,
    oceanFragments,
    waveAmplitude,
    waveSpeed,
    showWireframe,
    oceanOpacity,
}: SceneContentProps) {
    const { scene, camera } = useThree();
    const rectLightRef = useRef<THREE.RectAreaLight>(null);
    const groupRef = useRef<THREE.Group>(null);

    useEffect(() => {
        scene.fog = new THREE.Fog(backgroundColor, 5, 20);
        scene.background = new THREE.Color(backgroundColor);
    }, [scene, backgroundColor]);

    useFrame(() => {
        camera.lookAt(0, 0, 0);
        if (rectLightRef.current) {
            rectLightRef.current.lookAt(0, 0, 0);
        }
        if (groupRef.current) {
            groupRef.current.rotation.y += rotationSpeed;
        }
    });

    return (
        <>
            {/* Lighting - Original setup */}
            <hemisphereLight args={[0xFFD3D3, accentColor, 2]} />
            <pointLight args={[accentColor, 1]} position={[-5, -20, -20]} />
            <rectAreaLight
                ref={rectLightRef}
                args={[accentColor, 20, 3, 3]}
                position={[2, 2, -20]}
            />
            <pointLight args={[accentColor, 0.1]} position={[0, 2, -2]} />

            {/* Rotating Group */}
            <group ref={groupRef}>
                {showGrid && <gridHelper args={[20, 20]} position={[0, -1, 0]} />}
                {showBoats && <BoatGroup count={boatCount} spreadRange={boatSpread} color={accentColor} />}
                <OceanMesh
                    geoSize={oceanSize}
                    geoFragments={oceanFragments}
                    waveAmplitude={waveAmplitude}
                    waveSpeed={waveSpeed}
                    accentColor={accentColor}
                    showWireframe={showWireframe}
                    opacity={oceanOpacity}
                />
            </group>
        </>
    );
}

// =============================================================================
// MAIN COMPONENT - Props for reusability, defaults match original exactly
// =============================================================================
export interface LiquidOceanProps {
    /** Additional CSS classes */
    className?: string;
    /** Background color as hex number (default: 0x000000 - black) */
    backgroundColor?: number;
    /** Grid line color as hex number (default: 0x333333) */
    gridColor?: number;
    /** Accent color for ocean, boats, lights as hex number (default: 0xF00589 - pink) */
    accentColor?: number;
    /** Camera field of view (default: 20) */
    fov?: number;
    /** Scene rotation speed per frame (default: 0.001) */
    rotationSpeed?: number;
    /** Show grid helper (default: true) */
    showGrid?: boolean;
    /** Show floating boxes/boats (default: true) */
    showBoats?: boolean;
    /** Number of floating boxes (default: 5) */
    boatCount?: number;
    /** Spread range for floating boxes (default: 5) */
    boatSpread?: number;
    /** Ocean plane size (default: 25) */
    oceanSize?: number;
    /** Ocean geometry fragments/subdivisions (default: 25) */
    oceanFragments?: number;
    /** Maximum wave amplitude (default: 0.2) */
    waveAmplitude?: number;
    /** Wave animation speed multiplier (default: 0.05) */
    waveSpeed?: number;
    /** Show wireframe overlay on ocean (default: true) */
    showWireframe?: boolean;
    /** Ocean surface opacity (default: 0.85) */
    oceanOpacity?: number;
    /** Overlay content (e.g., title text) */
    children?: React.ReactNode;
}

export function LiquidOcean({
    className,
    // Original colors - DO NOT CHANGE DEFAULTS
    backgroundColor = DEFAULT_THEME.background,
    gridColor = DEFAULT_THEME.gridColor,
    accentColor = DEFAULT_THEME.accentColor,
    // Original settings - DO NOT CHANGE DEFAULTS
    fov = 20,
    rotationSpeed = 0.001,
    showGrid = true,
    showBoats = true,
    boatCount = 5,
    boatSpread = 5,
    oceanSize = 25,
    oceanFragments = 25,
    waveAmplitude = 0.2,
    waveSpeed = 0.05,
    showWireframe = true,
    oceanOpacity = 0.85,
    children,
}: LiquidOceanProps) {
    return (
        <div className={cn("relative w-full h-full min-h-[400px] overflow-hidden bg-black cursor-crosshair", className)}>
            <Canvas
                shadows
                camera={{ position: [0, 2, 10], fov }}
                gl={{ antialias: true, alpha: false }}
                style={{ position: "absolute", inset: 0 }}
            >
                <SceneContent
                    backgroundColor={backgroundColor}
                    gridColor={gridColor}
                    accentColor={accentColor}
                    rotationSpeed={rotationSpeed}
                    showGrid={showGrid}
                    showBoats={showBoats}
                    boatCount={boatCount}
                    boatSpread={boatSpread}
                    oceanSize={oceanSize}
                    oceanFragments={oceanFragments}
                    waveAmplitude={waveAmplitude}
                    waveSpeed={waveSpeed}
                    showWireframe={showWireframe}
                    oceanOpacity={oceanOpacity}
                />
            </Canvas>

            {/* Overlay Content */}
            {children && (
                <div className="absolute inset-0 pointer-events-none select-none">
                    {children}
                </div>
            )}
        </div>
    );
}

export default LiquidOcean;
