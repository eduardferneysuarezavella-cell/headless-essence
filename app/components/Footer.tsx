import { Suspense } from 'react';
import { Await, Link, NavLink, useFetcher, useLocation } from '@remix-run/react';
import type { FooterQuery, HeaderQuery } from 'storefrontapi.generated';
import { InstagramIcon } from './icons/Instagram';
import { TikTokIcon } from './icons/TikTok';
import { Image } from '@shopify/hydrogen';
import { action } from '../routes/($locale).klavyio.submit';
import { Loader2 } from 'lucide-react';
import { useI18n } from './i18n-provider';
import { useTranslation } from '~/i18n/i18n';

interface FooterProps {
    footer: Promise<FooterQuery | null>;
    header: HeaderQuery;
    publicStoreDomain: string;
}

export function Footer({
    footer: footerPromise,
    header,
    publicStoreDomain,
}: FooterProps) {
    const fetcher = useFetcher<typeof action>();
    const { t: _ } = useTranslation();
    const location = useLocation();
    const isProductPage = location.pathname.includes('/products/');

    return (
        <footer className={`${isProductPage ? 'pb-[60px]' : ''}`}>
            <nav className="pt-[50px] relative" role="navigation">
                <div className='max-w-[1440px] px-5 mx-auto flex justify-between flex-wrap'>
                    <div className='flex flex-auto flex-col border-b lg:border-none border-black items-start text-center lg:w-[30%] pr-5  p-0'>
                        <div className='max-w-[500px] lg:max-w-full mx-auto lg:mx-0 text-left'>
                            <div className='max-w-full'>
                                <div className='pb-5 font-semibold text-3xl font-heading -my-[.25em] md:hidden'>
                                    {_('layout.footer.title')}
                                </div>

                                <div className='md:block hidden'>
                                    <Link to="/" className=''>
                                        <img
                                            src={'https://essnce.se/cdn/shop/files/Logotype_Black.svg?v=1699455633'}
                                            alt={publicStoreDomain}
                                            sizes='(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 1440px'
                                            className='w-[150px] mb-5'
                                        />
                                    </Link>
                                </div>

                                <div>
                                    <div>
                                        <div className='text-base md:text-lg'>
                                            <p className='mb-8 leading-5'>{_('layout.footer.newsletter.description')}</p>
                                        </div>

                                        {fetcher && fetcher.data && 'success' in fetcher.data ? (
                                            <div className='mt-2.5 mb-5'>
                                                {fetcher.data.success ? (
                                                    <span className='font-heading uppercase text-2xl'>{_('layout.footer.newsletter.success')}</span>
                                                ) : (
                                                    <span className='font-heading uppercase text-2xl'>{_('layout.footer.newsletter.error')}</span>
                                                )}
                                            </div>
                                        ) : (
                                            <fetcher.Form method='POST' action='/klavyio/submit' className='mt-2.5 mb-5'>
                                                <div className='flex max-w-full gap-2'>
                                                    <input
                                                        type='hidden'
                                                        name='list_id'
                                                        id='list_id'
                                                        value='XbzKUk'
                                                    />

                                                    <input
                                                        type='hidden'
                                                        name='type'
                                                        value='NEWSLETTER'
                                                    />

                                                    <input
                                                        type='email'
                                                        name='email'
                                                        className='border border-black max-w-full w-full h-[45px] m-0 px-4 leading-[45px] text-sm outline-none'
                                                        placeholder={_('layout.footer.newsletter.placeholder') as string}
                                                    />

                                                    <div className='w-auto shrink-0'>
                                                        <button
                                                            type='submit'
                                                            disabled={fetcher.state !== 'idle'}
                                                            className='bg-white text-black border-black border hover:bg-black hover:text-white transition-colors duration-300 text-sm w-auto h-[45px] px-4'
                                                        >
                                                            {fetcher.state !== 'idle' ? <Loader2 className='animate-spin' /> : _('layout.footer.newsletter.button')}
                                                        </button>
                                                    </div>
                                                </div>
                                            </fetcher.Form>
                                        )}

                                        <div>
                                            <p className='mb-[30px] text-sm'>
                                                {_('layout.footer.newsletter.privacy', {
                                                    link: (value) => <a key="privacy-link" href="/policies/terms-of-service" target="_blank" title="Terms of Service">{value}</a>,
                                                    b: (value) => <strong key="privacy-bold" className='font-semibold'>{value}</strong>
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <Suspense>
                        <Await resolve={footerPromise}>
                            {(footer) => (
                                <>
                                    {footer?.menu2 && header.shop.primaryDomain?.url && (
                                        <FooterMenu
                                            title={_('layout.footer.menus.pages') as string}
                                            menu={footer.menu2}
                                            primaryDomainUrl={header.shop.primaryDomain.url}
                                            publicStoreDomain={publicStoreDomain}
                                            className='pl-[15px] lg:pl-[45px]'
                                        />
                                    )}

                                    {footer?.menu1 && header.shop.primaryDomain?.url && (
                                        <FooterMenu
                                            title={_('layout.footer.menus.support') as string}
                                            menu={footer.menu1}
                                            primaryDomainUrl={header.shop.primaryDomain.url}
                                            publicStoreDomain={publicStoreDomain}
                                        />
                                    )}
                                </>
                            )}
                        </Await>
                    </Suspense>

                    <div className='lg:flex hidden flex-auto w-[42%] p-0 pr-[5px]'>
                        <div>
                            <div className='pb-2'>
                                <Link to="/pages/our-story" className='text-xl font-semibold'>{_('layout.footer.about.title')}</Link>
                            </div>

                            <div className='pb-4'>
                                <span>
                                    {_('layout.footer.about.description', {
                                        contact: (value) => <a key="contact-link" href="/pages/contact" className="underline">{value}</a>,
                                        instagram: (value) => <a key="instagram-link" href="https://www.instagram.com/essnce.edp/" target="_blank" rel="noopener noreferrer" className="underline">{value}</a>
                                    })}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='border-t py-5 border-black'>
                    <div className='mx-auto max-w-[1440px] px-5 flex flex-row justify-between items-center'>
                        <div className='text-sm md:text-lg'>
                            <small className='block md:inline'>{_('layout.footer.copyright', { year: new Date().getFullYear() })}. {_('layout.footer.rights')}</small>
                        </div>

                        <div className='shrink-0'>
                            <div className='flex flex-wrap'>
                                <div className='inline-flex justify-end flex-wrap items-center -m-2'>
                                    <a href='https://www.instagram.com/essnce.edp/' aria-label={_('layout.footer.social.instagram') as string} className='p-2 md:p-3'>
                                        <InstagramIcon />
                                    </a>

                                    <a href='https://www.tiktok.com/@essnce.edp' aria-label={_('layout.footer.social.tiktok') as string} className='p-2 md:p-3'>
                                        <TikTokIcon />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        </footer>
    );
}

function FooterMenu({
    menu,
    title,
    primaryDomainUrl,
    publicStoreDomain,
    className
}: {
    menu: FooterQuery['menu1'] | FooterQuery['menu2'];
    title: string;
    primaryDomainUrl: FooterProps['header']['shop']['primaryDomain']['url'];
    publicStoreDomain: string;
    className?: string;
}) {
    return (
        <div className={`flex flex-col flex-auto items-start lg:w-[14%] w-1/2 pb-[30px] pt-[30px] md:pr-[15px] lg:py-0 ${className}`}>
            <div className='max-w-[500px] lg:max-w-none text-left text-lg'>
                <div className='pb-1 text-xl font-semibold'>{title}</div>

                <div>
                    <ul>
                        {(menu || FALLBACK_FOOTER_MENU).items.map((item, index) => {
                            if (!item.url) return null;

                            const url = item.url.includes('myshopify.com') ||
                                item.url.includes('essncestore.com') ||
                                item.url.includes(publicStoreDomain) ||
                                item.url.includes(primaryDomainUrl)
                                ? new URL(item.url).pathname
                                : item.url;

                            return (
                                <li key={item.id} className='py-px'>
                                    <a href={url} title={item.title} className='text-lg'>{item.title}</a>
                                </li>
                            )
                        })}
                    </ul>
                </div>
            </div>
        </div>
    );
}

const FALLBACK_FOOTER_MENU = {
    id: 'gid://shopify/Menu/199655620664',
    items: [
        {
            id: 'gid://shopify/MenuItem/461633060920',
            resourceId: 'gid://shopify/ShopPolicy/23358046264',
            tags: [],
            title: 'Privacy Policy',
            type: 'SHOP_POLICY',
            url: '/policies/privacy-policy',
            items: [],
        },
        {
            id: 'gid://shopify/MenuItem/461633093688',
            resourceId: 'gid://shopify/ShopPolicy/23358013496',
            tags: [],
            title: 'Refund Policy',
            type: 'SHOP_POLICY',
            url: '/policies/refund-policy',
            items: [],
        },
        {
            id: 'gid://shopify/MenuItem/461633126456',
            resourceId: 'gid://shopify/ShopPolicy/23358111800',
            tags: [],
            title: 'Shipping Policy',
            type: 'SHOP_POLICY',
            url: '/policies/shipping-policy',
            items: [],
        },
        {
            id: 'gid://shopify/MenuItem/461633159224',
            resourceId: 'gid://shopify/ShopPolicy/23358079032',
            tags: [],
            title: 'Terms of Service',
            type: 'SHOP_POLICY',
            url: '/policies/terms-of-service',
            items: [],
        },
    ],
};
