import type { NextConfig } from "next";

const legacyComponentRedirects = [
    ["animated-button", "/components/my-animated-button"],
    ["animated-hero", "/components/animated-rays"],
    ["creepy-button", "/components/creepy-button"],
    ["expandable-bento-grid", "/components/expandable-bento-grid"],
    ["flip-fade-text", "/components/flip-fade-text"],
    ["flip-text", "/components/flip-text"],
    ["folder-preview", "/components/folder-preview"],
    ["glass-dock", "/components/glass-dock"],
    ["glow-border-card", "/components/glow-border-card"],
    ["interactive-book", "/components/interactive-book"],
    ["light-lines", "/components/light-lines"],
    ["line-hover-link", "/components/line-hover-link"],
    ["liquid-metal", "/components/liquid-metal"],
    ["liquid-ocean", "/components/liquid-ocean"],
    ["liquid-text", "/components/liquid-text"],
    ["logo-slider", "/components/logo-slider"],
    ["masked-avatars", "/components/masked-avatars"],
    ["perspective-grid", "/components/perspective-grid"],
    ["pixelated-image-trail", "/components/pixelated-image-trail"],
    ["social-flip-button", "/components/social-flip-button"],
    ["spotlight-navbar", "/components/spotlight-navbar"],
    ["stacked-logos", "/components/stacked-logos"],
    ["staggered-grid", "/components/staggered-grid"],
    ["testimonials-card", "/components/testimonials-card"],
] as const;

const nextConfig: NextConfig = {
    images: {
        formats: ['image/avif', 'image/webp'],
        minimumCacheTTL: 2678400,
        remotePatterns: [
            { protocol: 'https', hostname: 'unavatar.io' },
            { protocol: 'https', hostname: 'i.pravatar.cc' },
            { protocol: 'https', hostname: 'images.unsplash.com' },
            { protocol: 'https', hostname: 'pbs.twimg.com' },
            { protocol: 'https', hostname: 'res.cloudinary.com' },
            { protocol: 'https', hostname: 'ik.imagekit.io' },
            { protocol: 'https', hostname: 'www.vengenceui.com' },
            { protocol: 'https', hostname: 'vengeance-ui-v2.vercel.app' },
        ],
    },
    reactStrictMode: true,
    poweredByHeader: false,
    compress: true,
    productionBrowserSourceMaps: false,
    turbopack: {
        root: process.cwd(),
    },
    async redirects() {
        return [
            {
                source: '/:path*',
                has: [{ type: 'host', value: 'vengeance-ui-v2.vercel.app' }],
                destination: 'https://www.vengenceui.com/:path*',
                permanent: true,
            },
            {
                source: '/docs/components-overview',
                destination: '/components',
                permanent: true,
            },
            {
                source: '/docs/installation',
                destination: '/docs/install-nextjs',
                permanent: true,
            },
            {
                source: '/demo/staggered-grid',
                destination: '/components/staggered-grid',
                permanent: true,
            },
            {
                source: '/playground',
                destination: '/components',
                permanent: true,
            },
            {
                source: '/test',
                destination: '/components',
                permanent: true,
            },
            {
                source: '/components/dummy-component-:id',
                destination: '/components',
                permanent: true,
            },
            ...legacyComponentRedirects.map(([slug, destination]) => ({
                source: `/docs/${slug}`,
                destination,
                permanent: true,
            })),
        ];
    },
    async headers() {
        return [
            {
                source: '/:path*',
                headers: [
                    { key: 'X-Content-Type-Options', value: 'nosniff' },
                    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
                    { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
                ],
            },
            {
                source: '/r/:path*',
                headers: [
                    { key: 'Access-Control-Allow-Origin', value: '*' },
                    { key: 'Cache-Control', value: 'public, max-age=300, s-maxage=86400, stale-while-revalidate=604800' },
                ],
            },
            {
                source: '/video/:path*',
                headers: [
                    { key: 'Cache-Control', value: 'public, max-age=86400, s-maxage=86400, must-revalidate' },
                ],
            },
            ...['books-showcase', 'circular-gallery', 'interactive-particles'].map((directory) => ({
                source: `/${directory}/:path*`,
                headers: [
                    { key: 'Cache-Control', value: 'public, max-age=86400, s-maxage=86400, must-revalidate' },
                ],
            })),
        ];
    },
    experimental: {
        // Tree-shake barrel-export packages for faster builds & smaller bundles
        optimizePackageImports: [
            'framer-motion',
            'lucide-react',
            'gsap',
            '@gsap/react',
            'lenis',
            '@phosphor-icons/react',
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-context-menu',
            '@radix-ui/react-menubar',
            '@radix-ui/react-navigation-menu',
            '@radix-ui/react-select',
            '@radix-ui/react-tooltip',
            '@radix-ui/react-popover',
            '@radix-ui/react-hover-card',
            'class-variance-authority',
            'prism-react-renderer',
            'react-icons',
        ],
    },
};

export default nextConfig;
