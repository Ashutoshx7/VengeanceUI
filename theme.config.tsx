
import React from 'react'
import { DocsThemeConfig, useConfig } from 'nextra-theme-docs'
import { CommandMenu } from './src/components/command-menu'
import { ModeToggle } from './src/components/mode-toggle'
import { useRouter } from 'next/router'

const siteUrl = 'https://www.vengenceui.com'

const config: DocsThemeConfig = {
    logo: (
        <div className="flex items-center">
            <img src="/logo/bg-less.png" alt="Vengeance UI" width={55} height={55} className="rotate-180 dark:brightness-0 dark:invert" />
            <span className="font-extrabold text-xl tracking-tight hidden md:inline dark:text-white">Vengeance UI</span>
        </div>
    ),
    project: {
        link: 'https://github.com/Ashutoshx7/VengeanceUI',
    },
    chat: {
        link: 'https://discord.com',
    },
    docsRepositoryBase: 'https://github.com/Ashutoshx7/VengeanceUI/tree/main',
    sidebar: {
        defaultMenuCollapseLevel: 3,
        toggleButton: false,
    },
    navbar: {
        extraContent: (
            <div className="flex items-center gap-2">
                <CommandMenu />
                <ModeToggle />
            </div>
        )
    },
    themeSwitch: {
        component: null
    },
    navigation: {
        prev: true,
        next: true,
    },
    footer: {
        component: null,
    },
    // SEO Configuration
    head: function useHead() {
        const { asPath } = useRouter()
        const { frontMatter, title } = useConfig()
        const pageTitle = title ? `${title} – VengeanceUI` : 'VengeanceUI - Premium React Components'
        const description = frontMatter.description || 'Beautiful, modern, and customizable React components. Build stunning interfaces with VengeanceUI - a premium component library for React and Next.js.'
        const ogImage = `${siteUrl}/og-image.png`
        const url = `${siteUrl}${asPath}`

        return (
            <>
                {/* Page Title */}
                <title>{pageTitle}</title>

                {/* Basic Meta */}
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <meta name="description" content={description} />
                <meta name="keywords" content="React, Next.js, UI Components, Component Library, Tailwind CSS, Three.js, Animation, Web Development, Frontend, VengeanceUI" />
                <meta name="author" content="VengeanceUI" />
                <meta name="robots" content="index, follow" />
                <link rel="canonical" href={url} />

                {/* Favicon */}
                <link rel="icon" href="/logo/bg-less.png" type="image/png" />
                <link rel="apple-touch-icon" href="/logo/bg-less.png" />

                {/* Open Graph / Facebook */}
                <meta property="og:type" content="website" />
                <meta property="og:url" content={url} />
                <meta property="og:title" content={pageTitle} />
                <meta property="og:description" content={description} />
                <meta property="og:image" content={ogImage} />
                <meta property="og:image:width" content="1200" />
                <meta property="og:image:height" content="630" />
                <meta property="og:site_name" content="VengeanceUI" />
                <meta property="og:locale" content="en_US" />

                {/* Twitter Card */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:url" content={url} />
                <meta name="twitter:title" content={pageTitle} />
                <meta name="twitter:description" content={description} />
                <meta name="twitter:image" content={ogImage} />

                {/* Theme Color */}
                <meta name="theme-color" content="#F00589" />
                <meta name="msapplication-TileColor" content="#000000" />
            </>
        )
    },
}

export default config

