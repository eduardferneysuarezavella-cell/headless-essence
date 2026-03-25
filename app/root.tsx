import { useNonce, getShopAnalytics, Analytics, Image, Script } from '@shopify/hydrogen';
import { defer, type LoaderFunctionArgs } from '@shopify/remix-oxygen';
import {
    Outlet,
    Scripts,
    useRouteError,
    useRouteLoaderData,
    ScrollRestoration,
    isRouteErrorResponse,
    type ShouldRevalidateFunction,
    Link,
    Links,
    Meta,
} from '@remix-run/react';
import favicon from '~/assets/favicon.jpg';
import resetStyles from '~/styles/reset.css?url';
import appStyles from '~/styles/app.css?url';
import tailwindCss from './styles/tailwind.css?url';
import { PageLayout } from '~/components/PageLayout';
import { ANNOUNCEMENT_QUERY, FOOTER_QUERY, HEADER_QUERY, LOCALE_QUERY } from '~/lib/fragments';
import { getLocaleFromRequest } from './lib/i18n';
import { withWeaverse } from '@weaverse/hydrogen';
import GmfScript from './weaverse/components/gmf-main-script';
import { I18nProvider, useI18n } from './components/i18n-provider';
import { GeoLocationPrompt } from './components/GeoLocationPrompt';
import { useTranslation } from './i18n/i18n';
import { GoogleGTM } from '~/components/GoogleGTM';
import { GoogleTagManager } from './components/GoogleTagManager';

export type RootLoader = typeof loader;

/**
 * This is important to avoid re-fetching root queries on sub-navigations
 */
export const shouldRevalidate: ShouldRevalidateFunction = ({
    formMethod,
    currentUrl,
    nextUrl,
    defaultShouldRevalidate,
}) => {
    // revalidate when a mutation is performed e.g add to cart, login...
    if (formMethod && formMethod !== 'GET') return true;

    // revalidate when manually revalidating via useRevalidator
    if (currentUrl.toString() === nextUrl.toString()) return true;

    return defaultShouldRevalidate;
};

export function links() {
    return [
        { rel: 'stylesheet', href: tailwindCss },
        { rel: 'stylesheet', href: resetStyles },
        { rel: 'stylesheet', href: appStyles },
        {
            rel: 'preconnect',
            href: 'https://cdn.shopify.com',
        },
        {
            rel: 'preconnect',
            href: 'https://shop.app',
        },
        { rel: 'icon', type: 'image/svg+xml', href: favicon },
    ];
}

export function meta() {
    return [
        { title: 'ESSNCE | Inspirerade av dyra märkesparfymer men till ett bättre pris' },
        { description: 'Dofterna är inspirerade av marknadens bästsäljande parfymer men för bara en bråkdel av priset. ESSNCE är ett alternativ istället för din dyra märkesparfym. Samma höga kvalité, 100% veganskt & cruelty free men ett mycket bättre pris.' },
        { property: 'og:title', content: 'ESSNCE | Inspirerade av dyra märkesparfymer men till ett bättre pris' },
        { property: 'og:description', content: 'Dofterna är inspirerade av marknadens bästsäljande parfymer men för bara en bråkdel av priset. ESSNCE är ett alternativ istället för din dyra märkesparfym. Samma höga kvalité, 100% veganskt & cruelty free men ett mycket bättre pris.' },
        { property: 'og:image', content: 'https://cdn.shopify.com/s/files/1/0551/4611/9308/files/0L0A0445_kopia_4eeb7f97-7ee4-4b34-bc34-ab0a417c0fbb.jpg?v=1648972463' },
        { property: 'og:url', content: 'https://essnce.com' },
        { property: 'og:type', content: 'website' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'ESSNCE | Inspirerade av dyra märkesparfymer men till ett bättre pris' },
        { name: 'twitter:description', content: 'Dofterna är inspirerade av marknadens bästsäljande parfymer men för bara en bråkdel av priset. ESSNCE är ett alternativ istället för din dyra märkesparfym. Samma höga kvalité, 100% veganskt & cruelty free men ett mycket bättre pris.' },
        { name: 'twitter:image', content: 'https://cdn.shopify.com/s/files/1/0551/4611/9308/files/0L0A0445_kopia_4eeb7f97-7ee4-4b34-bc34-ab0a417c0fbb.jpg?v=1648972463' },
    ];
}

export async function loader(args: LoaderFunctionArgs) {
    const { storefront, env } = args.context;

    // Start fetching non-critical data without blocking time to first byte
    const deferredData = loadDeferredData(args);

    // Await the critical data required to render initial state of the page
    const criticalData = await loadCriticalData(args);

    return defer({
        ...deferredData,
        ...criticalData,
        publicStoreDomain: env.PUBLIC_STORE_DOMAIN,
        googleGtmId: env.PUBLIC_GOOGLE_GTM_ID,
        shop: getShopAnalytics({
            storefront,
            publicStorefrontId: env.PUBLIC_STOREFRONT_ID,
        }),
        i18n: args.context.i18n,
        detectedCountry: args.context.detectedCountry,
        selectedLocale: criticalData.locale,
        consent: {
            checkoutDomain: env.PUBLIC_CHECKOUT_DOMAIN,
            storefrontAccessToken: env.PUBLIC_STOREFRONT_API_TOKEN,
            withPrivacyBanner: true,
            country: criticalData.locale.country,
            language: criticalData.locale.language,
            firstPartyMarketingPrefs: true,
            thirdPartyMarketingPrefs: true,
            analyticsPrefs: true,
        },
    });
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 */
async function loadCriticalData({ context, request }: LoaderFunctionArgs) {
    const { storefront } = context;

    const locale = getLocaleFromRequest({
        request,
    });

    const [header, announcement] = await Promise.all([
        storefront.query(HEADER_QUERY, {
            cache: storefront.CacheLong(),
            variables: {
                headerMenuHandle: 'main-menu', // Adjust to your header menu handle
            },
        }),
        storefront.query(ANNOUNCEMENT_QUERY, {
            cache: storefront.CacheLong(),
        })
    ]);

    return { header, locale, announcement };
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({ context }: LoaderFunctionArgs) {
    const { storefront, customerAccount, cart, session } = context;

    const footer = storefront
        .query(FOOTER_QUERY, {
            cache: storefront.CacheLong(),
            variables: {
                footerMenuHandle: 'footer',
                footerPagesHandle: 'footer-meny',
            },
        })
        .catch((error) => {
            console.error(error);
            return null;
        });

    return {
        cart: cart.get(),
        isLoggedIn: customerAccount.isLoggedIn(),
        gamifieraToken: session.get('gamifieraToken') as string | null,
        footer,
    };
}

export function Layout({ children }: { children?: React.ReactNode }) {
    const nonce = useNonce();
    const data = useRouteLoaderData<RootLoader>('root');

    return (
        <html lang="en">
            <head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width,initial-scale=1" />
                <Links />
                <Meta />
                <Script dangerouslySetInnerHTML={{
                    __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-PP5RDPH');`,
                }}></Script>
            </head>

            <body>
                <noscript>
                    <iframe
                        src="https://www.googletagmanager.com/ns.html?id=GTM-PP5RDPH"
                        height="0"
                        width="0"
                        style={{
                            display: 'none',
                            visibility: 'hidden'
                        }}
                    ></iframe>
                </noscript>
                <I18nProvider locale={data?.locale.language ?? 'sv'} initialData={data?.locale}>
                    {data ? (
                        <Analytics.Provider
                            cart={data.cart}
                            shop={data.shop}
                            consent={data.consent}
                        >
                            <GeoLocationPrompt detectedCountry={data.detectedCountry} />
                            <PageLayout {...data}>{children}</PageLayout>
                            <GmfScript token={data.gamifieraToken} />
                            <GoogleTagManager />
                        </Analytics.Provider>
                    ) : (
                        children
                    )}
                </I18nProvider>

                <ScrollRestoration nonce={nonce} />
                <Scripts nonce={nonce} />
            </body>
        </html>
    );
}

function App() {
    return <Outlet />;
}

export default withWeaverse(App);

export function ErrorBoundary() {
    const error = useRouteError();
    let errorMessage = 'Unknown error';
    let errorStatus = 500;

    const { t: _ } = useTranslation();

    if (isRouteErrorResponse(error)) {
        errorMessage = error?.data?.message ?? error.data;
        errorStatus = error.status;
    } else if (error instanceof Error) {
        errorMessage = error.message;
    }

    if (errorStatus === 404) {
        return (
            <div className='max-w-[1200px] mx-auto flex flex-col items-center py-16'>
                <div className='w-[70%] md:w-auto px-4'>
                    <Image
                        src='/404.png'
                        alt='404'
                        className='object-cover h-auto'
                        sizes='(max-width: 768px) 50vw, 100vw'
                    />
                </div>

                <div className='flex flex-col items-center gap-4'>
                    <h1 className='lg:text-[40px] text-2xl font-medium text-center font-heading py-2'>{_('notFound.title')}</h1>

                    <p className='text-center text-lg w-[70%] md:w-auto'>
                        {_('notFound.description')}
                    </p>

                    <Link to='/' className='lg:py-3 py-2 border border-black px-10 transition-all leading-[24px] z-10 hover:bg-black hover:text-white text-center mt-4'>
                        {_('notFound.cta')}
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="route-error">
            <h1>Oops</h1>
            <h2>{errorStatus}</h2>
            {errorMessage && (
                <fieldset>
                    <pre>{errorMessage}</pre>
                </fieldset>
            )}
        </div>
    );
}
