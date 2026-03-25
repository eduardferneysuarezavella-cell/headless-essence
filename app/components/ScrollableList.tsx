import { Image } from "@shopify/hydrogen";
import { Product, ProductVariant } from "@shopify/hydrogen/storefront-api-types";
import { ArrowBackSVG } from "./icons/ArrowBackSVG";
import { useEffect, useRef, useState } from "react";
import { ProductPrice } from "./ProductPrice";
import { Link } from "@remix-run/react";
import { useI18n } from "./i18n-provider";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from './Carousel';
import { useTranslation } from "~/i18n/i18n";

interface ScrollableListProps<T extends Array<any>> {
    items: T;
    perPage: {
        desktop: number;
        mobile: number;
    };
    createLink?: (item: T[number]) => string;
    children: (item: T[number]) => React.ReactNode;
}

export default function ScrollableList<T extends Array<any>>({ items, perPage = { desktop: 4, mobile: 2 }, createLink, children }: ScrollableListProps<T>) {
    const [isMobile, setMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setMobile(window.innerWidth < 768);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="relative">
            <Carousel className="w-full" opts={{
                align: isMobile ? 'start' : 'start',
                dragFree: true,
                containScroll: 'trimSnaps',
                loop: false,
                skipSnaps: false,
                watchDrag: true,
            }}>
                <CarouselContent>
                    {items.map((item, index) => (
                        <CarouselItem key={index} className="basis-[85%] md:basis-1/2 lg:basis-1/3">
                            {createLink ? (
                                <Link to={createLink(item)}>
                                    {children(item)}
                                </Link>
                            ) : (
                                children(item)
                            )}
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
            </Carousel>
        </div>
    );
}

interface ItemsPerPage {
    desktop: number;
    mobile: number;
}

export function ScrollableGrid({ variants, perPage = { desktop: 4, mobile: 2 } }: { variants: Partial<ProductVariant | Product>[], perPage?: ItemsPerPage }) {
    const [itemsPerPage, setItemsPerPage] = useState<number>(perPage.mobile);
    const containerRef = useRef<HTMLDivElement>(null);
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const { t: _ } = useTranslation();

    useEffect(() => {
        const updateItemsPerPage = () => {
            const newItemsPerPage = window.innerWidth >= 1024 ? perPage.desktop : perPage.mobile;
            setItemsPerPage(newItemsPerPage);
        };

        updateItemsPerPage();
        window.addEventListener('resize', updateItemsPerPage);

        return () => window.removeEventListener('resize', updateItemsPerPage);
    }, [perPage]);

    const isVariant = (variant: Partial<ProductVariant | Product>): variant is Partial<ProductVariant> => {
        return 'product' in variant;
    }

    const handleScroll = () => {
        if (containerRef.current) {
            const scrollLeft = containerRef.current.scrollLeft;
            const itemWidth = containerRef.current.clientWidth / itemsPerPage;
            const newIndex = Math.round(scrollLeft / itemWidth);
            setCurrentIndex(newIndex);
        }
    };

    const scrollToIndex = (index: number) => {
        if (containerRef.current) {
            const itemWidth = containerRef.current.clientWidth / itemsPerPage;
            containerRef.current.scrollTo({
                left: index * itemWidth,
                behavior: 'smooth',
            });
        }
    };

    return (
        <div className="relative no-scrollbar" >
            <div
                ref={containerRef}
                className="flex overflow-x-auto scroll-smooth snap-x snap-mandatory no-scrollbar"
                style={{ scrollSnapType: 'x mandatory' }}
                onScroll={handleScroll}
            >
                {variants.map((variant, index) => (
                    <Link
                        key={variant.id}
                        to={`/products/${isVariant(variant) ? variant.product?.handle : variant.handle}`}
                        className={`flex-shrink-0 px-2 lg:basis-1/4 snap-start`}
                        style={{ minWidth: `${100 / itemsPerPage}%` }}
                    >
                        <Image
                            src={isVariant(variant) ? variant.image?.url : variant.featuredImage?.url}
                            alt={isVariant(variant) ? variant.product?.title || '' : variant.title || ''}
                            width={isVariant(variant) ? variant.image?.width || 0 : variant.featuredImage?.width || 0}
                            height={isVariant(variant) ? variant.image?.height || 0 : variant.featuredImage?.height || 0}
                            className="w-full h-auto"
                        />
                        
                        <div className="flex flex-col items-center gap-2">
                            <div className="text-center lg:text-lg">
                                <p className="mt-2 lg:mt-4">{isVariant(variant) ? variant.product?.title || '' : variant.title || ''}</p>
                                <ProductPrice price={isVariant(variant) ? variant.price : variant.priceRange?.minVariantPrice} />
                            </div>
                            <button className='uppercase border border-black lg:px-4 px-4 lg:h-[50px] h-[30px] lg:text-xl text-sm font-medium font-heading hover:bg-black hover:text-white transition-colors'>
                                {_('product.card.purchase.buy')}
                            </button>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Navigation Buttons */}
            <div className="absolute top-1/2 -translate-y-1/2 left-2 right-2 flex items-center justify-between no-scrollbar">
                {currentIndex > 0 ? (
                    <button
                        className="text-primary"
                        onClick={() => scrollToIndex(currentIndex - 1)}
                    >
                        <ArrowBackSVG />
                    </button>
                ) : <span/>}

                {currentIndex + itemsPerPage < variants.length && (
                    <button
                        className="text-primary"
                        onClick={() => scrollToIndex(currentIndex + 1)}
                    >
                        <ArrowBackSVG className="rotate-180" />
                    </button>
                )}
            </div>
        </div>
    );
}