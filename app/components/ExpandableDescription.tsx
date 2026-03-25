import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { ArrowBackSVG } from "./icons/ArrowBackSVG";
import { useI18n } from "./i18n-provider";
import { useTranslation } from "~/i18n/i18n";

export default function ExpandableDescription({ children, dangerouslySetInnerHTML, wrapperClassName }: { children?: React.ReactNode, dangerouslySetInnerHTML?: { __html: string }, wrapperClassName?: string }) {
    const { t: _ } = useTranslation();
    const descriptionRef = useRef<HTMLDivElement>(null);
    const [expanded, setExpanded] = useState<boolean>(false);
    const [descriptionHeight, setDescriptionHeight] = useState<string>('100px');

    useEffect(() => {
        if (descriptionRef.current) {
            const scrollHeight = descriptionRef.current.scrollHeight;
            setDescriptionHeight(expanded ? `${scrollHeight}px` : '100px');
        }
    }, [expanded, children]);

    const toggleDescription = () => {
        setExpanded(!expanded);
    };

    return (
        <div className={`text-center ${wrapperClassName ?? ''}`}>
            <p className='collection-description lg:block hidden text-lg leading-6' {...(dangerouslySetInnerHTML ? { dangerouslySetInnerHTML } : {})}>
                {children}
            </p>

            <motion.div
                ref={descriptionRef}
                className="collection-description text-lg leading-6 overflow-hidden relative lg:hidden"
                initial={{ height: '100px' }}
                animate={{ height: descriptionHeight }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                onClick={() => {
                    if (expanded) {
                        setExpanded(false);
                    }
                }}
            >
                {children}

                <AnimatePresence initial={false}>
                    {!expanded && (
                        <motion.div
                            key="description-gradient"
                            className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-white to-transparent lg:hidden"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.6 }}
                        />
                    )}
                </AnimatePresence>
            </motion.div>

            {children && (
                <div className='lg:hidden flex flex-row justify-center items-center gap-2 cursor-pointer' onClick={toggleDescription}>
                    <p className='mt-2 uppercase lg:hidden'>
                        {expanded ? _('expandable_description.read_less') : _('expandable_description.read_more')}
                    </p>
                    <ArrowBackSVG className={`mt-2 ${expanded ? 'rotate-90' : '-rotate-90'} transition-transform duration-300`} />
                </div>
            )}
        </div>
    )
}
