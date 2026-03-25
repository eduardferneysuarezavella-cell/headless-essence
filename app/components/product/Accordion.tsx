import { RichText } from "@shopify/hydrogen"
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

export const Accordion = ({ title, rendered }: { title: string, rendered: string }) => {
    const [open, setOpen] = useState<boolean>(false);

    return (
        <div >
            <div
                className="flex justify-between items-center cursor-pointer py-1"
                onClick={() => setOpen(!open)}
            >
                <h3 className="text-xl font-heading font-[500]">{title}</h3>

                <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg" className={`transition-transform duration-300 ${open ? 'rotate-180' : 'rotate-0'}`}>
                    <path d="M1 1.5L6 6.5L11 1.5" stroke="#1E1E1E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </div>

            <AnimatePresence>
                {open && (
                    <motion.div
                        className="overflow-hidden"
                        initial={{ height: 0 }}
                        animate={{ height: 'auto' }}
                        exit={{ height: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <RichText data={rendered} />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}