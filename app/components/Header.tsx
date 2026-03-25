import { Suspense, useEffect, useState, useRef } from 'react';
import { Await, Form, Link, NavLink, useFetcher, useLocation, useMatches } from '@remix-run/react';
import { type CartViewPayload, Image, useAnalytics } from '@shopify/hydrogen';
import type { HeaderQuery, CartApiQueryFragment } from 'storefrontapi.generated';
import { useAside } from '~/components/Aside';
import { MenuIcon } from './icons/MenuIcon';
import { Locale, SupportedLanguage } from '~/data/countries';
import { AnimatePresence, motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { SearchToggle } from './header/SearchToggle';
import { useI18n } from './i18n-provider';
import { useLocale, useTranslation } from '~/i18n/i18n';

interface HeaderProps {
    header: HeaderQuery;
    cart: Promise<CartApiQueryFragment | null>;
    isLoggedIn: Promise<boolean>;
    publicStoreDomain: string;
}

type Viewport = 'desktop' | 'mobile';

export function Header({
    header,
    isLoggedIn,
    cart,
    publicStoreDomain,
}: HeaderProps) {
    const { open } = useAside();
    const { shop, menu } = header;

    return (
        <header className="relative w-full md:px-12 md:pt-8">
            <div className='md:flex items-center justify-end mx-auto relative h-[35px] min-h-8 hidden'>
                <div className='flex-auto p-2'>
                    <HeaderLocalization />
                </div>

                <Link to="/" className='p-2 absolute left-1/2 -translate-x-1/2 flex-auto'>
                    <Image
                        src={shop.brand?.logo?.image?.url}
                        alt={shop.name}
                        sizes='(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 1440px'
                        className='h-[35px] object-contain'
                    />
                </Link>

                <div className='cursor-pointer inline-block order-2 grow-0 flex-auto p-2'>
                    <div className="flex items-center gap-4">
                        {/* <div id="gmf-dropdown-profile"></div> */}
                        <SearchToggle />
                        <Suspense fallback={<CartBadge count={0} />}>
                            <Await resolve={cart}>
                                {(cart) => {
                                    return <CartBadge count={cart?.totalQuantity || 0} />;
                                }}
                            </Await>
                        </Suspense>
                    </div>
                </div>
            </div>
            <div className='mx-auto min-h-[78px] pt-4 text-center relative md:block hidden'>
                <div className='flex-auto'>
                    <div className='inline-block'>
                        <ul className='xl:flex hidden'>
                            {menu?.items.map((item) => {
                                if (!item.url) return null;

                                const url = new URL(item.url).pathname;

                                return (
                                    <li key={item.id} className='relative inline-block group text-sm'>
                                        <a href={url} className='inline-block uppercase pt-4 px-4 pb-8'>
                                            <span>{item.title}</span>

                                            {item.items.length > 0 && (
                                                <>
                                                    &nbsp;

                                                    <svg className="inline-block align-mdidle relative group-hover:rotate-180 transition-transform duration-300" width="10" height="6" viewBox="0 0 10 6" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M5 4.058 8.53.528l.707.707-3.53 3.53L5 5.472.763 1.235 1.47.528 5 4.058Z" fill="#000" fillRule="nonzero"></path>
                                                    </svg>
                                                </>
                                            )}
                                        </a>

                                        {item.items.length > 0 && (
                                            <div className='absolute group-hover:block hover:block hidden min-w-[150px] top-[90%] bg-white overflow-hidden -left-4 whitespace-nowrap z-10 text-left group-hover:opacity-100 opacity-0 transition-opacity duration-300'>
                                                <ul>
                                                    {item.items.map((subItem) => {
                                                        if (!subItem.url) return null;
                                                        const url = new URL(subItem.url).pathname;

                                                        return (
                                                            <li key={subItem.id} className='relative p-0.5 whitespace-nowrap'>
                                                                <a href={url} className='inline-block py-[14px] px-[30px] relative leading-[22px] uppercase'>{subItem.title}</a>
                                                            </li>
                                                        )
                                                    })}
                                                </ul>
                                            </div>
                                        )}
                                    </li>
                                )
                            })}
                        </ul>
                    </div>
                </div>
            </div>

            <div className='md:hidden flex justify-between items-center p-5'>
                <div className='w-1/2 shrink flex items-center'>
                    <button className='overflow-hidden fill-black p-4 -ml-4' onClick={() => open('mobile')}>
                        <MenuIcon />
                    </button>
                    {/* <div id="gmf-dropdown-profile"></div> */}
                    <SearchToggle />
                </div>

                <div className='shrink-0 max-w-[calc(100%-120px)] text-center'>
                    <Link to="/">
                        <img
                            src={shop.brand?.logo?.image?.url}
                            alt={shop.name}
                            sizes='(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 1440px'
                            className='w-[100px] h-auto'
                        />
                    </Link>
                </div>

                <div className='w-1/2 whitespace-nowrap shrink text-right flex justify-end items-center'>
                    <div className="flex items-center gap-4">
                        <Suspense fallback={<CartBadge count={0} />}>
                            <Await resolve={cart}>
                                {(cart) => {
                                    return <CartBadge count={cart?.totalQuantity || 0} />;
                                }}
                            </Await>
                        </Suspense>
                    </div>
                </div>
            </div>
            {/*<div
                className='grid w-full gap-4 items-center'
                style={{ gridTemplateColumns: '1fr auto 1fr' }}
            >
                <div className='flex items-center'>
                    <button className='overflow-hidden fill-black px-5' onClick={() => open('mobile')}>
                        <MenuIcon/>
                    </button>
                </div>

                <Link to="/" className='flex justify-center items-center flex-1 p-2'>
                    <Image
                        src={shop.brand?.logo?.image?.url}
                        alt={shop.name}
                        sizes='(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 1440px'
                        className='h-8'
                    />
                </Link>

                <div className='flex justify-end items-center'>

                </div>
            </div>*/}
        </header>
    );
}

export function HeaderLocalization() {
    const { locale } = useLocale();
    const { t: _ } = useTranslation();
    const { pathname, search } = useLocation();
    const dropdownRef = useRef<HTMLDivElement>(null);
    const fetcher = useFetcher<Record<string, Locale>>();

    const [open, setOpen] = useState<boolean>(false);
    const [countries, setCountries] = useState<Record<string, Locale>>({});

    useEffect(() => {
        if (!fetcher.data) {
            fetcher.load('/api/countries');
            return;
        }

        setCountries(fetcher.data);
    }, [fetcher.data, countries]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className='flex gap-8'>
            <div className='relative flex [flex-flow:row_wrap] select-none' ref={dropdownRef}>
                <div className='h-full w-full flex-[1_0_50%] relative'>
                    <button type='button' className='flex items-center justify-between w-full h-full cursor-pointer p-1 -ml-1 mr-1 gap-2' onClick={() => setOpen(!open)}>
                        <div>
                            <img
                                src={`https://cdn.shopify.com/static/images/flags/${locale.country.toLowerCase() === 'fr' ? 'us' : locale.country.toLowerCase()}.svg?width=26`}
                                alt={''}
                                className='h-fit w-[26px]'
                            />
                        </div>

                        <svg className="icon--root icon--chevron-down" width="10" height="6" viewBox="0 0 10 6" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5 4.058 8.53.528l.707.707-3.53 3.53L5 5.472.763 1.235 1.47.528 5 4.058Z" fill="#000" fillRule="nonzero"></path>
                        </svg>
                    </button>

                    <AnimatePresence>
                        {open && (
                            <motion.ul
                                className={`absolute overflow-y-auto max-h-[300px] max-w-[300px] bg-white border border-[#eaeaea] top-[36px] w-max z-10 ${open ? 'visible' : 'invisible'}`}
                                style={{ boxShadow: '0 0 10px #00000014' }}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ ease: 'easeInOut', duration: 0.2 }}
                            >
                                {countries && Object.entries(countries).map(([key, locale]) => {
                                    if (key === 'default') return null;
                                    const hrefLang = `${locale.language}-${locale.country}`;

                                    return (
                                        <a
                                            href={`${locale.host}${pathname}${search}`}
                                            key={hrefLang}
                                            className='inline-flex items-center justify-between gap-2 px-[15px] py-[9px] w-full whitespace-nowrap cursor-pointer hover:bg-neutral-100'
                                        >
                                            <span className='inline-flex items-center gap-2 whitespace-break-spaces pointer-events-none'>
                                                <img
                                                    src={`https://cdn.shopify.com/static/images/flags/${locale.country.toLowerCase() === 'fr' ? 'us' : locale.country.toLowerCase()}.svg?width=26`}
                                                    alt={''}
                                                    className='h-fit w-[26px]'
                                                />

                                                <span className='text-base'>{_(locale.translationKey)}</span>
                                            </span>

                                            <p className='text-base'>({locale.currency})</p>
                                        </a>
                                    )
                                })}
                            </motion.ul>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    )
}

export function HeaderMenu({
    menu,
    primaryDomainUrl,
    viewport,
    publicStoreDomain,
}: {
    menu: HeaderProps['header']['menu'];
    primaryDomainUrl: HeaderProps['header']['shop']['primaryDomain']['url'];
    viewport: Viewport;
    publicStoreDomain: HeaderProps['publicStoreDomain'];
}) {
    const { close } = useAside();
    const className = `header-menu-${viewport} pt-16 overflow-x-hidden h-full relative`;
    const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
    const { t: _ } = useTranslation();
    const { locale } = useLocale();
    const { pathname, search } = useLocation();
    const [openLocale, setOpenLocale] = useState<boolean>(false);
    const [countries, setCountries] = useState<Record<string, Locale>>({});
    const fetcher = useFetcher<Record<string, Locale>>();

    useEffect(() => {
        if (!fetcher.data) {
            fetcher.load('/api/countries');
            return;
        }

        setCountries(fetcher.data);
    }, [fetcher.data, countries]);

    return (
        <nav className={className} role="navigation">
            <NavLink
                className="relative header-menu-item px-5 py-4 border-b border-[#ebebeb] flex justify-between items-center border-t"
                prefetch="intent"
                to="/"
                onClick={close}
                end
            >
                {_('layout.home')}
            </NavLink>
            {(menu || FALLBACK_HEADER_MENU).items.map((item, index) => {
                if (!item.url) return null;

                // if the url is internal, we strip the domain
                const url = new URL(item.url).pathname;

                if (item.items.length > 0) {
                    return (
                        <div
                            key={item.id}
                            className={`relative header-menu-item px-5 py-4 border-b border-[#ebebeb] flex justify-between items-center`}
                            onClick={() => setOpenSubmenu(item.id)}
                        >
                            {item.title}

                            <svg className="icon--root icon--chevron-right--small" width="8" height="14" viewBox="0 0 8 14" xmlns="http://www.w3.org/2000/svg">
                                <path d="M6.274 7.202.408 1.336l.707-.707 6.573 6.573-.096.096-6.573 6.573-.707-.707 5.962-5.962Z" fill="#000" fillRule="nonzero"></path>
                            </svg>

                            <div className={`absolute top-0 bottom-0  left-full min-w-[150px] w-full z-10 h-full bg-white ${openSubmenu === item.id ? '-translate-x-full' : 'translate-x-0'} transition-transform duration-300`}>
                                <div className='flex items-center '>
                                    <div
                                        className='px-5 py-4'
                                        onClick={(event) => {
                                            event.stopPropagation();
                                            setOpenSubmenu(null);
                                        }}
                                    >
                                        <svg
                                            className="icon--root icon--chevron-right--small rotate-180"
                                            width="8"
                                            height="14"
                                            viewBox="0 0 8 14"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path d="M6.274 7.202.408 1.336l.707-.707 6.573 6.573-.096.096-6.573 6.573-.707-.707 5.962-5.962Z" fill="#000" fillRule="nonzero"></path>
                                        </svg>
                                    </div>

                                    <h3 className='header-menu-item py-4'>{item.title}</h3>
                                </div>

                                {item.items.map((subItem) => {
                                    if (!subItem.url) return null;
                                    const url = new URL(subItem.url).pathname;

                                    return (
                                        <NavLink
                                            className={`relative header-menu-item pr-5 pl-16 py-4 border-b border-[#ebebeb] flex justify-between items-center bg-white ${index === 0 ? 'border-t' : ''}`}
                                            key={subItem.id}
                                            prefetch="intent"
                                            to={url}
                                            onClick={close}
                                            end
                                        >
                                            {subItem.title}
                                        </NavLink>
                                    )
                                })}
                            </div>
                        </div>
                    )
                }

                return (
                    <NavLink
                        className={`relative header-menu-item px-5 py-4 border-b border-[#ebebeb] flex justify-between items-center ${index === 0 ? 'border-t' : ''}`}
                        key={item.id}
                        prefetch="intent"
                        to={url}
                        onClick={() => {
                            if (item.items.length > 0) {
                                setOpenSubmenu(item.id);
                            } else {
                                close();
                            }
                        }}
                        end
                    >
                        {item.title}
                    </NavLink>
                );
            })}

            {viewport === 'mobile' && (
                <>
                    <div className="mt-auto sticky bottom-0 bg-white border-t border-[#ebebeb]">
                        <div
                            className="relative header-menu-item px-2 py-4 flex justify-between items-center"
                            onClick={() => setOpenLocale(!openLocale)}
                        >
                            <div className="flex items-center gap-1">
                                <img
                                    src={`https://cdn.shopify.com/static/images/flags/${locale.country.toLowerCase() === 'fr' ? 'us' : locale.country.toLowerCase()}.svg?width=24`}
                                    alt=""
                                    className="h-4 w-4"
                                />
                                <span className="text-base">{_(locale.translationKey)}</span>
                            </div>

                            <svg
                                className={`icon--root icon--chevron-down transition-transform ${openLocale ? 'rotate-180' : ''}`}
                                width="10"
                                height="6"
                                viewBox="0 0 10 6"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M5 4.058 8.53.528l.707.707-3.53 3.53L5 5.472.763 1.235 1.47.528 5 4.058Z"
                                    fill="#000"
                                    fillRule="nonzero"
                                ></path>
                            </svg>
                        </div>

                        <AnimatePresence>
                            {openLocale && (
                                <motion.div
                                    className="absolute bottom-full left-0 right-0 bg-white border border-[#ebebeb] z-10"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 20 }}
                                    transition={{ duration: 0.15, ease: 'easeOut' }}
                                >
                                    {countries &&
                                        Object.entries(countries).map(([key, locale], index) => {
                                            if (key === 'default') return null;
                                            const hrefLang = `${locale.language}-${locale.country}`;

                                            return (
                                                <motion.a
                                                    href={`${locale.host}${pathname}${search}`}
                                                    key={hrefLang}
                                                    className="flex items-center justify-between gap-1 px-2 py-2 border-b last:border-b-0 hover:bg-neutral-100 border-[#ebebeb]"
                                                    onClick={close}
                                                    initial={{ opacity: 0, y: 5 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                >
                                                    <span className="flex items-center gap-1">
                                                        <img
                                                            src={`https://cdn.shopify.com/static/images/flags/${locale.country.toLowerCase() === 'fr' ? 'us' : locale.country.toLowerCase()}.svg?width=24`}
                                                            alt=""
                                                            className="h-4 w-4"
                                                        />
                                                        <span className="text-base">{_(locale.translationKey)}</span>
                                                    </span>
                                                    <span className="text-xs">({locale.currency})</span>
                                                </motion.a>
                                            );
                                        })}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </>
            )}
        </nav>
    );
}

function CartBadge({ count }: { count: number | null }) {
    const { open } = useAside();
    const { publish, shop, cart, prevCart } = useAnalytics();
    const { t: _ } = useTranslation();

    return (
        <a
            className='flex gap-2 items-center cursor-pointer'
            onClick={(e) => {
                e.preventDefault();
                open('cart');
                publish('cart_viewed', {
                    cart,
                    prevCart,
                    shop,
                    url: window.location.href || '',
                } as CartViewPayload);
            }}
            aria-label={_('layout.cart.heading')?.toString()}
        >
            <svg className="icon--root icon--bag" width="18" height="21" viewBox="0 0 18 21" xmlns="http://www.w3.org/2000/svg">
                <path d="M5.156 3.99A3.837 3.837 0 0 1 9 .3a3.837 3.837 0 0 1 3.844 3.69h4.49l.389 14.704a1.75 1.75 0 0 1-1.704 1.795H2.027a1.75 1.75 0 0 1-1.75-1.75l.001-.046L.674 3.99h4.482Zm1.502 0h4.684A2.337 2.337 0 0 0 9 1.8a2.337 2.337 0 0 0-2.342 2.19Zm-1.506 1.5H2.135l-.358 13.243v.007c0 .138.112.25.25.25h13.946a.251.251 0 0 0 .25-.257L15.874 5.49h-3.026v2.823h-1.5V5.49H6.652v2.823h-1.5V5.49Z" fill="#000" fillRule="nonzero" />
            </svg>

            <span>{count}</span>
        </a>
    );
}

function CartToggle({ cart }: Pick<HeaderProps, 'cart'>) {
    return (
        <Suspense fallback={<CartBadge count={null} />}>
            <Await resolve={cart}>
                {(cart) => {
                    if (!cart) return <CartBadge count={0} />;
                    return <CartBadge count={cart.totalQuantity || 0} />;
                }}
            </Await>
        </Suspense>
    );
}

const FALLBACK_HEADER_MENU = {
    id: 'gid://shopify/Menu/199655587896',
    items: [
        {
            id: 'gid://shopify/MenuItem/461609500728',
            resourceId: null,
            tags: [],
            title: 'Collections',
            type: 'HTTP',
            url: '/collections',
            items: [],
        },
        {
            id: 'gid://shopify/MenuItem/461609533496',
            resourceId: null,
            tags: [],
            title: 'Blog',
            type: 'HTTP',
            url: '/blogs/journal',
            items: [],
        },
        {
            id: 'gid://shopify/MenuItem/461609566264',
            resourceId: null,
            tags: [],
            title: 'Policies',
            type: 'HTTP',
            url: '/policies',
            items: [],
        },
        {
            id: 'gid://shopify/MenuItem/461609599032',
            resourceId: 'gid://shopify/Page/92591030328',
            tags: [],
            title: 'About',
            type: 'PAGE',
            url: '/pages/about',
            items: [],
        },
    ],
};

function activeLinkStyle({
    isActive,
    isPending,
}: {
    isActive: boolean;
    isPending: boolean;
}) {
    return {
        fontWeight: isActive ? 'bold' : undefined,
        color: isPending ? 'grey' : 'black',
    };
}
