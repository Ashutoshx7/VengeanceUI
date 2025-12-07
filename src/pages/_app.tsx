import '@/app/globals.css'
import type { AppProps } from 'next/app'
import { SidebarHoverIndicator } from '@/components/docs/sidebar-hover-indicator'

export default function MyApp({ Component, pageProps }: AppProps) {
    return (
        <>
            <SidebarHoverIndicator />
            <Component {...pageProps} />
        </>
    )
}

