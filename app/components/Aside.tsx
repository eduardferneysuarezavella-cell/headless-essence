import { AnimatePresence, motion } from 'framer-motion';
import { createContext, type ReactNode, useContext, useEffect, useState } from 'react';

type AsideType = 'search' | 'cart' | 'mobile' | 'closed';
type AsideContextValue = {
    type: AsideType;
    open: (mode: AsideType) => void;
    close: () => void;
};

/**
 * A side bar component with Overlay
 * @example
 * ```jsx
 * <Aside type="search" heading="SEARCH">
 *  <input type="search" />
 *  ...
 * </Aside>
 * ```
 */
export function Aside({
    children,
    heading,
    type,
}: {
    children?: React.ReactNode;
    type: AsideType;
    heading: React.ReactNode;
}) {
    const { type: activeType, close } = useAside();
    const expanded = type === activeType;
    const direction = type === 'cart' ? 'right' : 'left';

    useEffect(() => {
        if (expanded) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    }, [expanded]);

    return (
        <AnimatePresence mode="wait" initial={false}>
            {expanded && (
                <motion.div
                    aria-modal
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className={`fixed top-0 left-0 right-0 bottom-0 visible z-20 bg-black/30`}
                    role="dialog"
                >
                    <button className="w-full h-full absolute top-0 left-0" onClick={close} aria-label="Close" />
                    <motion.aside
                        className={direction === 'right' ? 'aside-right' : ''}
                        initial={{ translateX: direction === 'right' ? '100%' : '-100%' }}
                        animate={{ translateX: '0%' }}
                        exit={{ translateX: direction === 'right' ? '100%' : '-100%' }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                    >
                        <button className={`absolute 
                            top-5 text-5xl ${direction === 'right' ? '-left-12' : '-right-12'}`} onClick={close}>
                            <svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path d="M10 8.727 17.944.783l1.273 1.273L11.273 10l7.944 7.944-1.273 1.273L10 11.273l-7.944 7.944-1.273-1.273L8.727 10 .783 2.056 2.056.783 10 8.727Z" fill="#fff" fillRule="nonzero"></path>
                            </svg>
                        </button>

                        <main className='h-dvh'>{children}</main> 
                    </motion.aside>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

const AsideContext = createContext<AsideContextValue | null>(null);

Aside.Provider = function AsideProvider({ children }: { children: ReactNode }) {
    const [type, setType] = useState<AsideType>('closed');

    return (
        <AsideContext.Provider
            value={{
                type,
                open: setType,
                close: () => setType('closed'),
            }}
        >
            {children}
        </AsideContext.Provider>
    );
};

export function useAside() {
    const aside = useContext(AsideContext);
    if (!aside) {
        throw new Error('useAside must be used within an AsideProvider');
    }
    return aside;
}
