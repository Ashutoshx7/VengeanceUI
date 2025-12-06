'use client'

import React from 'react'
import { motion, type MotionProps } from 'framer-motion'

type AnimatedButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & MotionProps & {
    children?: React.ReactNode
}

/**
 * AnimatedButton
 * - theme-aware: uses Tailwind `dark:` classes so it works in both light and dark mode
 * - accepts all native button props (onClick, className, type, etc.)
 */
const AnimatedButton: React.FC<AnimatedButtonProps> = ({
    children = 'Browse Components',
    className = '',
    whileTap = { scale: 0.97 },
    transition = {
        stiffness: 20,
        damping: 15,
        mass: 2,
        scale: {
            type: 'spring',
            stiffness: 10,
            damping: 5,
            mass: 0.1,
        },
    },
    ...rest
}) => {
    return (
        <motion.button
            {...rest}
            whileTap={whileTap}
            transition={transition}
            // Set a CSS variable `--shine` that we override for dark mode via Tailwind.
            // Tailwind JIT allows arbitrary properties like `dark:[--shine:...]` if enabled.
            className={
                `px-6 py-2 rounded-md relative overflow-hidden bg-neutral-50 dark:bg-black border border-neutral-300 dark:border-neutral-800 ` +
                `text-neutral-900 dark:text-neutral-100 ${className} [--shine:rgba(0,0,0,.66)] dark:[--shine:rgba(255,255,255,.66)]`
            }
        >
            {/* Text with shine mask */}
            <motion.span
                className="tracking-wide font-light h-full w-full flex items-center justify-center relative z-10"
                style={{
                    WebkitMaskImage:
                        'linear-gradient(-75deg, white calc(var(--mask-x) + 20%), transparent calc(var(--mask-x) + 30%), white calc(var(--mask-x) + 100%))',
                    maskImage:
                        'linear-gradient(-75deg, white calc(var(--mask-x) + 20%), transparent calc(var(--mask-x) + 30%), white calc(var(--mask-x) + 100%))',
                }}
                initial={{ ['--mask-x' as any]: '100%' } as any}
                animate={{ ['--mask-x' as any]: '-100%' } as any}
                transition={{ repeat: Infinity, duration: 1, ease: 'linear', repeatDelay: 1 }}
            >
                {children}
            </motion.span>

            {/* Border shine effect uses the --shine variable so it adapts to theme */}
            <motion.span
                className="block absolute inset-0 rounded-md p-px"
                style={{
                    background: 'linear-gradient(-75deg, transparent 30%, var(--shine) 50%, transparent 70%)',
                    backgroundSize: '200% 100%',
                    mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                    maskComposite: 'exclude',
                    WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                    WebkitMaskComposite: 'xor',
                }}
                initial={{ backgroundPosition: '100% 0', opacity: 0 }}
                animate={{ backgroundPosition: ['100% 0', '0% 0'], opacity: [0, 1, 0] }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear', repeatDelay: 1 }}
            />
        </motion.button>
    )
}

export default AnimatedButton
