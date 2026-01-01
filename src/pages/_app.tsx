import '@/app/globals.css'
import type { AppProps } from 'next/app'
import { SidebarHoverIndicator } from '@/components/docs/sidebar-hover-indicator'

import { Analytics } from "@vercel/analytics/react"

export default function MyApp({ Component, pageProps }: AppProps) {
    return (
        <>
            <SidebarHoverIndicator />
            <Component {...pageProps} />
            <Analytics />
        </>
    )
}

