import { useNavigate, useNavigation, useSearchParams } from "@remix-run/react";
import { AnimatePresence, motion } from "framer-motion";
import { act, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ScentFamilies } from "~/data/scent-families";
import { buildFilterFromQuery, buildQueryFromFilter, CollectionFilter as TCollectionFilter, CollectionFilters } from "~/lib/filter";
import { useI18n } from "~/components/i18n-provider";
import { useTranslation } from "~/i18n/i18n";

interface CollectionFilterWrapperProps {
    className?: string;
    children: ({
        activeFilters,
        setActiveFilters,
        onFilterUpdate
    }: {
        activeFilters: TCollectionFilter,
        setActiveFilters: (filters: TCollectionFilter) => void,
        onFilterUpdate: (filters: TCollectionFilter) => void,
    }) => React.ReactNode;
}

export const CollectionTypeFilter = () => {
    const [active, setActive] = useState<string | null>(null);
    const [searchParams, setSearchParams] = useSearchParams();

    const handleFilterUpdate = (family: string) => {
        setActive(family);

        setSearchParams((prev) => {
            const newParams = new URLSearchParams(prev);

            newParams.set('family', family);

            return newParams;
        }, { preventScrollReset: true });
    }

    const handleFilterClear = () => {
        setActive(null);

        setSearchParams((prev) => {
            const newParams = new URLSearchParams(prev);
            newParams.delete('family');
            return newParams;
        });
    }

    return (
        <div className="overflow-hidden w-screen pt-[10px] pb-[20px]">
            <div className="flex gap-2 items-center lg:justify-center overflow-x-auto max-w-screen snap-x snap-mandatory scrollbar-hide px-5">
                {ScentFamilies.map((family) => (
                    <button
                        key={family.name}
                        className={`px-5 uppercase py-1 rounded-full border border-neutral-300 text-sm text-neutral-800 snap-center shrink-0 ${active === family.name ? 'bg-black text-white border-black' : ''}`}
                        onClick={() => {
                            if (active === family.name) {
                                handleFilterClear();
                            } else {
                                handleFilterUpdate(family.name);
                            }
                        }}
                    >
                        {family.name}
                    </button>
                ))}
            </div>
        </div>
    )
}

export function CollectionFilterWrapper({ className, children }: CollectionFilterWrapperProps) {
    const [searchParams, setSearchParams] = useSearchParams();
    const [filters, setFilters] = useState<TCollectionFilter>(buildFilterFromQuery(searchParams.get('filters') ?? ''));

    const handleFilterUpdate = (filters: TCollectionFilter) => {
        setFilters(filters);

        setSearchParams((prev) => {
            const newParams = new URLSearchParams(prev);

            const filterString = buildQueryFromFilter(filters);
            if (filterString) {
                newParams.set('filters', filterString);
            } else {
                newParams.delete('filters');
            }
            return newParams;
        }, { preventScrollReset: true });
    }

    return (
        <div className={className}>
            {children({ activeFilters: filters, setActiveFilters: setFilters, onFilterUpdate: handleFilterUpdate })}
        </div>
    )
}

interface CollectionFilterProps {
    filters?: typeof CollectionFilters;
    activeFilters: TCollectionFilter;
    setActiveFilters: (filters: TCollectionFilter) => void;
}

export function CollectionFilter({ filters = CollectionFilters, activeFilters, setActiveFilters }: CollectionFilterProps) {
    const navigate = useNavigate();
    const { t: _ } = useTranslation();
    const [open, setOpen] = useState<boolean>(false);
    const [searchParams, setSearchParams] = useSearchParams();
    const [mounted, setMounted] = useState<boolean>(false);
    const [mobile, setMobile] = useState<boolean | undefined>(false);

    const handleFilterView = () => {
        setSearchParams((prev) => {
            const newParams = new URLSearchParams(prev);

            if (activeFilters['collection']) {
                newParams.delete('collection');

                navigate('/collections/');
            }

            const filterString = buildQueryFromFilter(activeFilters);
            if (filterString) {
                newParams.set('filters', filterString);
            } else {
                newParams.delete('filters');
            }

            return newParams;
        }, { preventScrollReset: true });

        setOpen(false);
    }

    const handleFilterClear = () => {
        setActiveFilters({});

        setSearchParams((prev) => {
            const newParams = new URLSearchParams(prev);

            newParams.delete('filters');

            return newParams;
        }, { preventScrollReset: true });

        setOpen(false);
    }

    useEffect(() => {
        setActiveFilters(buildFilterFromQuery(searchParams.get('filters') ?? ''));
    }, [searchParams]);

    useEffect(() => {
        setMounted(true);

        const onResize = () => {
            setMobile(window.innerWidth < 1024);
        }

        onResize();
        window.addEventListener('resize', onResize);

        return () => window.removeEventListener('resize', onResize);
    }, []);

    useEffect(() => {
        if (open) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    }, [open]);

    const onFilterToggle = () => setOpen(!open);

    return (
        <div className="relative">
            <div className="flex items-center gap-2 cursor-pointer" onClick={onFilterToggle}>
                <svg width="10" height="5" viewBox="0 0 10 5" fill="none" xmlns="http://www.w3.org/2000/svg" className="-translate-y-0.5">
                    <path d="M5 5L0 0H10L5 5Z" fill="#1D1B20" />
                </svg>

                <span className="uppercase font-heading">{_('collections.filters.title')}</span>
            </div>

            {mounted && createPortal(
                <AnimatePresence mode="wait" initial={false}>
                    {open && (
                        <motion.div
                            key="filter-overlay"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: !mobile ? 0.3 : 0.1, ease: 'easeInOut' }}
                            className="flex justify-end z-20 fixed w-full h-full select-none lg:bg-black/30"
                        >
                            <button className="absolute top-0 right-0 w-full h-full" onClick={onFilterToggle} aria-label={_('collections.filters.close')?.toString()}></button>

                            <motion.div
                                initial={{ translateX: !mobile ? '100%' : '0%' }}
                                animate={{ translateX: '0%' }}
                                exit={{ translateX: !mobile ? '100%' : '0%' }}
                                transition={{ duration: 0.3, ease: 'easeInOut' }}
                                className={`bg-white lg:w-[508px] z-30 w-full h-screen ${open ? 'block' : 'hidden'} flex flex-col`}
                            >
                                <div className="py-0 relative flex-1 overflow-y-auto">
                                    <div className="flex justify-between items-center p-8">
                                        <h3 className="font-heading lg:text-3xl text-2xl uppercase font-medium">{_('collections.filters.title')}</h3>

                                        <button className="uppercase font-heading font-medium text-3xl" onClick={onFilterToggle}>
                                            {_('collections.filters.clear')}
                                        </button>
                                    </div>

                                    <div className="lg:px-8">
                                        {filters.map((attribute, index) => (
                                            <FilterableAttribute
                                                key={attribute.name}
                                                attribute={attribute}
                                                last={index === filters.length - 1}
                                                initialValues={activeFilters[attribute.code] ?? []}
                                                onFilter={(filter) => setActiveFilters({ ...activeFilters, [attribute.code]: filter })}
                                            />
                                        ))}
                                    </div>
                                </div>

                                <div className="flex flex-col lg:flex-row gap-4 p-8 bg-white shadow-[0_-10px_12px_-1px_rgba(0,0,0,0.1)]">
                                    <button
                                        className="uppercase font-heading font-medium text-lg w-full bg-black text-white py-3"
                                        onClick={handleFilterView}
                                    >
                                        {_('collections.filters.seeProducts')}
                                    </button>

                                    <button
                                        className="uppercase font-heading font-semibold text-lg w-full border border-black text-black py-3"
                                        onClick={handleFilterClear}
                                    >
                                        {_('collections.filters.clearAll')}
                                    </button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>,
                document.body
            )}
        </div>
    )
}

interface FilterableAttributeProps {
    last: boolean;
    attribute: {
        name: string;
        values: string[],
    };
    initialValues?: string[];
    onFilter: (values: string[]) => void;
}

const FilterableAttribute = ({ last, attribute, initialValues = [], onFilter }: FilterableAttributeProps) => {
    const contentRef = useRef<HTMLDivElement>(null);

    const [expanded, setExpanded] = useState<boolean>(false);
    const [height, setHeight] = useState<number | undefined>(undefined);
    const [values, setValues] = useState<string[]>(initialValues);

    useEffect(() => {
        setHeight(expanded ? contentRef.current?.scrollHeight : 0);
    }, [expanded]);

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>, value: string) => {
        setValues((previous) => {
            const newFilterValues = previous.includes(value) ? previous.filter((v) => v !== value) : [...previous, value];

            onFilter(newFilterValues);

            return newFilterValues;
        });
    }

    return (
        <div className={`w-full border border-black px-8 ${!last ? 'border-b-0' : ''}`}>
            <div className="flex justify-between items-center cursor-pointer py-6" onClick={() => setExpanded(!expanded)}>
                <h4 className="font-heading text-lg uppercase font-medium">{attribute.name}</h4>

                <button>
                    <svg width="10" height="5" viewBox="0 0 10 5" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 5L0 0H10L5 5Z" fill="#1D1B20" />
                    </svg>
                </button>
            </div>

            <div
                className="overflow-hidden transition-[height] duration-300 ease-in-out"
                style={{ height: height !== undefined ? `${height}px` : 'auto' }}
            >
                <div ref={contentRef} className="grid grid-cols-2 gap-4 pb-8">
                    {attribute.values.map((value) => (
                        <div key={value} className="flex items-center font-heading cursor-pointer">
                            <input
                                type="checkbox"
                                id={value}
                                className="w-4 h-4 appearance-none checked:bg-black cursor-pointer"
                                checked={values.includes(value)}
                                onChange={(e) => handleFilterChange(e, value)}
                            />

                            <label htmlFor={value} className="pl-2 text-lg translate-y-0.5 cursor-pointer">{value}</label>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export function CollectionSort() {
    const triggerRef = useRef<HTMLDivElement>(null);
    const [open, setOpen] = useState<boolean>(false);
    const [searchParams, setSearchParams] = useSearchParams();
    const [scrollY, setScrollY] = useState<number>(0);
    const [mounted, setMounted] = useState(false);
    const { t: _ } = useTranslation();

    const getDropdownPosition = () => {
        const rect = triggerRef.current?.getBoundingClientRect();
        return {
            top: `${rect?.bottom ?? 0}px`,
            right: `${window.innerWidth - (rect?.right ?? 0)}px`
        };
    };

    useEffect(() => {
        setMounted(true);

        const onScroll = () => {
            setScrollY(window.scrollY);
        }

        onScroll();
        window.addEventListener('scroll', onScroll);

        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const handleFilterActive = (sort: string) => {
        setSearchParams((prev) => {
            const newParams = new URLSearchParams(prev);

            newParams.set('sort', sort);

            return newParams;
        }, { preventScrollReset: true });

        setOpen(false);
    }

    const handleFilterClear = () => {
        setSearchParams((prev) => {
            const newParams = new URLSearchParams(prev);

            newParams.delete('sort');

            return newParams;
        }, { preventScrollReset: true });

        setOpen(false);
    }

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (open && !(e.target as Element).closest('.sort-dropdown')) {
                setOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [open]);

    return (
        <div className="relative">
            <div ref={triggerRef} className="flex items-center gap-2 uppercase cursor-pointer font-heading" onClick={() => setOpen(!open)}>
                {_(getSortOptionName(searchParams.get('sort')))}

                <svg width="10" height="5" viewBox="0 0 10 5" fill="none" xmlns="http://www.w3.org/2000/svg" className="-translate-y-0.5">
                    <path d="M5 5L0 0H10L5 5Z" fill="#1D1B20" />
                </svg>

            </div>

            {mounted && createPortal(
                <div className={`fixed z-[100] ${open ? 'block' : 'hidden'}`} style={{ top: `0`, left: '0', right: '0', bottom: '0', pointerEvents: open ? 'auto' : 'none', zIndex: 99 }}>
                    <div
                        className="sort-dropdown absolute bg-white border border-black min-w-[170px] p-2 z-20"
                        style={getDropdownPosition()}
                    >
                        {SortParamaters.map((sort) => (
                            <button
                                key={sort.value}
                                onClick={() => searchParams.get('sort') === sort.value ? handleFilterClear() : handleFilterActive(sort.value)}
                                className={`${searchParams.get('sort') === sort.value ? 'font-medium' : ''} uppercase text-sm block w-full text-right py-1`}
                            >
                                {_(sort.label)}
                            </button>
                        ))}
                    </div>
                </div>,
                document.body
            )}
        </div>
    )
}

const SortParamaters = [{
    value: 'price-low-high',
    name: 'Pris, Lågt till högt',
    label: 'collections.filters.sort.priceLowHigh',
}, {
    value: 'price-high-low',
    name: 'Pris, Högt till lågt',
    label: 'collections.filters.sort.priceHighLow',
}, {
    value: 'best-selling',
    name: 'Bästsäljare',
    label: 'collections.filters.sort.bestSelling',
}, {
    value: 'alphabetical',
    name: 'Alfabetiskt, A-Ö',
    label: 'collections.filters.sort.alphabetical',
}, {
    value: 'alphabetical-reverse',
    name: 'Alfabetiskt, Ö-A',
    label: 'collections.filters.sort.alphabeticalReverse',
}];

const getSortOptionName = (sort: string | null) => {
    switch (sort) {
        case 'price-low-high':
            return 'collections.filters.sort.priceLowHigh'
        case 'price-high-low':
            return 'collections.filters.sort.priceHighLow';
        case 'best-selling':
            return 'collections.filters.sort.bestSelling';
        case 'newest':
            return 'collections.filters.sort.newest';
        case 'featured':
            return 'collections.filters.sort.featured';
        case 'alphabetical':
            return 'collections.filters.sort.alphabetical';
        case 'alphabetical-reverse':
            return 'collections.filters.sort.alphabeticalReverse';
        default:
            return 'collections.filters.sort.title';
    }
}
