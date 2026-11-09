import { cn } from "@/lib/utils"
import { AnimatePresence, motion } from "framer-motion"
import { Puzzle } from "lucide-react"
import * as React from 'react'



interface MoriphingDisclosureItem {
    title: string,
    description?: string
}


interface MoriphingDisclosureProps {
    title: string,
    description?: string
    defaultOpen?: boolean,
    className?: string,
    icon?: React.ReactNode,
    id: any
}

function MoriphingDisclosure({
    title, description,
    className,
    defaultOpen = false,
    icon,
    id
}: MoriphingDisclosureProps) {

    const [open, setOpen] = React.useState(defaultOpen)
    return (



        <motion.div
            layout
            className={cn("details max-w-80 overflow-hidden border border-gray-500 px-4 py-2", className,
                open && 'ring-1 rounded-md my-2 transform-3d', id == 0 && 'rounded-t-md', id == 3 && 'rounded-b-md',
                
            )}
            transition={{
                type: "spring", stiffness: 500, damping: 40
            }}
        >

            <motion.div
                onClick={() => setOpen((prev) => !prev)}
                className="cursor-pointer flex justify-between py-1 items-center  "
            >

                <motion.h4>
                    {
                        icon ? icon : <Puzzle size={16} />
                    }


                </motion.h4>

                <p>{title}</p>

                <motion.span
                    animate={{ rotate: open ? 180 : 0 }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                >
                    +
                </motion.span>

            </motion.div>

            <AnimatePresence initial={false} mode="popLayout">
                {
                    open && (
                        <motion.div
                            key='panel'
                            layout
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}

                        >
                            <motion.div
                                layout
                            >
                                <motion.p
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, delay: 0.6, ease: [0.23, 1, 0.32, 1] }}
                                    className="text-lg md:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed  font-light"
                                >
                                    {description}
                                </motion.p>
                            </motion.div>
                        </motion.div>
                    )
                }

            </AnimatePresence>



        </motion.div>



    )
}

export { MoriphingDisclosure }