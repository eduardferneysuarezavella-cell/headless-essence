import { Await, Link } from '@remix-run/react';
import { Suspense } from 'react';
import type {
    AnnouncementBarQuery,
    CartApiQueryFragment,
    FooterQuery,
    HeaderQuery,
} from 'storefrontapi.generated';
import { Aside } from '~/components/Aside';
import { Footer } from '~/components/Footer';
import { Header, HeaderMenu } from '~/components/Header';
import { CartMain } from '~/components/CartMain';
import { AnnouncementBar } from './AnnouncementBar';
import { GDPRConsent } from './Consent';

interface PageLayoutProps {
    cart: Promise<CartApiQueryFragment | null>;
    footer: Promise<FooterQuery | null>;
    header: HeaderQuery;
    announcement: AnnouncementBarQuery;
    isLoggedIn: Promise<boolean>;
    publicStoreDomain: string;
    children?: React.ReactNode;
}

export function PageLayout({
    cart,
    children = null,
    footer,
    header,
    isLoggedIn,
    publicStoreDomain,
    announcement,
}: PageLayoutProps) {
    return (
        <div className='flex flex-col min-h-screen'>
            <Aside.Provider>
                <CartAside cart={cart} />
                <MobileMenuAside header={header} publicStoreDomain={publicStoreDomain} />

                {announcement && (
                    <AnnouncementBar metaobject={announcement.metaobject} />
                )}

               {/* <GDPRConsent/> */}

                {header && (
                    <Header
                        header={header}
                        cart={cart}
                        isLoggedIn={isLoggedIn}
                        publicStoreDomain={publicStoreDomain}
                    />
                )}

                <main className='w-full flex-1'>
                    {children}
                </main>

                <Footer
                    footer={footer}
                    header={header}
                    publicStoreDomain={publicStoreDomain}
                />
            </Aside.Provider>
        </div>
    );
}

function CartAside({ cart }: { cart: PageLayoutProps['cart'] }) {
    return (
        <Aside type="cart" heading="CART">
            <Suspense fallback={<p>Loading cart ...</p>}>
                <Await resolve={cart}>
                    {(cart) => {
                        return <CartMain cart={cart} layout="aside" />;
                    }}
                </Await>
            </Suspense>
        </Aside>
    );
}

function MobileMenuAside({
    header,
    publicStoreDomain,
}: {
    header: PageLayoutProps['header'];
    publicStoreDomain: PageLayoutProps['publicStoreDomain'];
}) {
    return (
        header.menu &&
        header.shop.primaryDomain?.url && (
            <Aside type="mobile" heading="MENU">
                <HeaderMenu
                    menu={header.menu}
                    viewport="mobile"
                    primaryDomainUrl={header.shop.primaryDomain.url}
                    publicStoreDomain={publicStoreDomain}
                />
            </Aside>
        )
    );
}
