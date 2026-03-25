import { Suspense, useEffect, useState } from 'react';
import { defer, redirect, type LoaderFunctionArgs } from '@shopify/remix-oxygen';
import { Await, Link, useLoaderData, useNavigate, useRoutes, type MetaFunction } from '@remix-run/react';
import type { BlogQuery, ProductFragment, ProductVariantFragment } from 'storefrontapi.generated';
import {
    getSelectedProductOptions,
    Analytics,
    useOptimisticVariant,
    CacheShort,
    CacheLong,
    Image,
    VariantSelector,
    getProductOptions,
    getAdjacentAndFirstAvailableVariants,
    useSelectedOptionInUrlParam,
} from '@shopify/hydrogen';
import type { Product, ProductVariant, SelectedOption } from '@shopify/hydrogen/storefront-api-types';
import { getVariantUrl } from '~/lib/variants';
import { ProductPrice, ProductPriceHeading } from '~/components/ProductPrice';
import { ProductImage } from '~/components/ProductImage';
import { ProductForm, ProductOptions } from '~/components/ProductForm';
import { ArrowBackSVG } from '~/components/icons/ArrowBackSVG';
import { Notes } from '~/components/Notes';
import { VariantForm } from '~/components/VariantForm';
import { PerfumeQuiz } from '~/components/product/PerfumeQuiz';
import { AboutUs } from '~/components/product/AboutUs';
import { Accordion } from '~/components/product/Accordion';
import ScrollableList, { ScrollableGrid } from '~/components/ScrollableList';
import { Guarantee } from '~/components/product/Guarantee';
import Reviews from '~/components/product/Reviews';
import { ProductItem } from './($locale).collections.$handle';
import { InnerProductForm } from '~/components/product/InnerProductForm';
import Blog from '~/components/product/Blog';
import { cn } from '~/lib/utils';
import { useI18n } from '../components/i18n-provider';
import { useTranslation } from '~/i18n/i18n';

export const meta: MetaFunction<typeof loader> = ({ data }) => {
    return [
        { title: data?.product.seo.title ?? '' },
        { description: data?.product.seo.description ?? '' },
        { property: 'og:title', content: data?.product.seo.title ?? '' },
        { property: 'og:description', content: data?.product.seo.description ?? '' },
        { property: 'og:image', content: data?.product.featuredImage?.url ?? '' },
        { property: 'og:type', content: 'product' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: data?.product.seo.title ?? '' },
        { name: 'twitter:description', content: data?.product.seo.description ?? '' },
        { name: 'twitter:image', content: data?.product.featuredImage?.url ?? '' }
    ];
};

export async function loader(args: LoaderFunctionArgs) {
    const deferredData = loadDeferredData(args);

    const criticalData = await loadCriticalData(args);

    return defer({ ...deferredData, ...criticalData });
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 */
async function loadCriticalData({
    context,
    params,
    request,
}: LoaderFunctionArgs) {
    const { colHandle, prodHandle } = params;
    const { storefront, sanity } = context;

    if (!colHandle || !prodHandle) {
        throw new Error('Expected product handle to be defined');
    }

    const [{ product }] = await Promise.all([
        storefront.query(PRODUCT_QUERY, {
            variables: { handle: prodHandle, selectedOptions: getSelectedProductOptions(request) },
        }),
    ]);

    if (!product?.id) {
        throw new Response(null, { status: 404 });
    }

    if (!product.collections.nodes.some((collection: { handle: string }) => collection.handle === colHandle)) {
        throw new Response(null, { status: 404 });
    }

    let additionalData: Record<string, Promise<any> | null> = {
        similarFamilies: null,
        christmasCalendar: null,
        testers: null,
        testkit: null,
    };

    const family = product.family ? JSON.parse(product.family?.value) as string[] : [];

    if (family.length > 0 && product.type?.value === 'Parfym') {
        additionalData.similarFamilies = storefront.query(SIMILAR_FAMILIES_QUERY, {
            variables: { family: family[0], handle: 'alla-parfymer', first: 4 },
        });
    }

    if (product.type?.value === 'Julkalender') {
        additionalData.christmasCalendar = storefront.query(FIND_COLLECTION_QUERY, {
            variables: { handle: 'julkalender', first: 4 },
        });
    }

    if (product.type?.value === 'Testers') {
        additionalData.testers = storefront.query(TESTERS_TRAVEL_SIZE_QUERY, {
            variables: { handle: '8ml' },
        });
    } else if (product.type?.value === 'Testkit' || product.type?.value === 'Parfymkit' || product.type?.value === 'Necessär') {
        additionalData.testers = storefront.query(TESTERS_TRAVEL_SIZE_QUERY, {
            variables: { handle: 'testers' },
        });
    }

    if (product.type?.value === 'Testers' || product.type?.value === 'Testkit') {
        additionalData.testkit = storefront.query(FIND_COLLECTION_QUERY, {
            variables: { handle: 'kits', first: 12 },
        });
    }

    const [similarFamilies, christmasCalendar, testers, testkit] = await Promise.all([
        additionalData.similarFamilies ?? Promise.resolve(null),
        additionalData.christmasCalendar ?? Promise.resolve(null),
        additionalData.testers ?? Promise.resolve(null),
        additionalData.testkit ?? Promise.resolve(null),
    ]);

    return {
        product: product,
        additionalData: {
            similarFamilies: similarFamilies,
            christmasCalendar: christmasCalendar,
            testers: testers,
            testkit: testkit,
        },
    };
}


function loadDeferredData({ context, params }: LoaderFunctionArgs) {
    const variants = context.storefront.query(VARIANTS_QUERY, {
        variables: { handle: params.prodHandle! },
    })
        .catch((error) => {
            console.error(error);
            return null;
        });

    const blog = context.storefront.query(BLOGS_QUERY, {
        variables: { blogHandle: 'essnce-journal', first: 4 },
    })
        .catch((error) => {
            console.error(error);
            return null;
        });

    return {
        variants,
        blog,
    };
}

export default function Product() {
    const { t: _ } = useTranslation();
    const { product, variants, additionalData, blog } = useLoaderData<typeof loader>();

    const [current8mlVariant, setCurrent8mlVariant] = useState<ProductVariantFragment | undefined>();
    const { title, topNotes, baseNotes, heartNotes, family } = product;

    const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);


    const truncateText = (text: string, maxLength: number) => {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + ' ';
    };

    const handleReviewsClick = () => {
        const reviewsElement = document.getElementById('reviews');
        if (reviewsElement) {
            reviewsElement.scrollIntoView({ behavior: 'smooth' });
        }
    }

    const selectedVariant = useOptimisticVariant(
        product.selectedOrFirstAvailableVariant,
        getAdjacentAndFirstAvailableVariants(product),
    );

    const productOptions = getProductOptions({
        ...product,
        selectedOrFirstAvailableVariant: selectedVariant,
    });

    const useSingleTitle = selectedVariant.title === 'Default Title' || selectedVariant.title === '';

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org/",
                        "@type": "Product",
                        "name": product.title,
                        "image": product.media.nodes.map((media: any) =>
                            media.image?.url || media.previewImage?.url
                        ).filter(Boolean),
                        "description": product.description,
                        "sku": selectedVariant.sku,
                        "brand": {
                            "@type": "Brand",
                            "name": "ESSNCE"
                        },
                        "offers": {
                            "@type": "Offer",
                            "url": `https://essnce.se${location.pathname}`,
                            "priceCurrency": selectedVariant.price.currencyCode,
                            "price": selectedVariant.price.amount,
                            "availability": selectedVariant.availableForSale
                                ? "https://schema.org/InStock"
                                : "https://schema.org/OutOfStock",
                            "name": selectedVariant.title === 'Default Title' ? product.title : `${selectedVariant.title} - ${product.title}`
                        }
                    })
                }}
            />

            <div className="product">
                <div className='max-w-[1440px] mx-auto lg:pb-12 pb-8'>
                    <div className='px-5 relative'>
                        {/*
                        // TODO: Add back button
                        <button className='absolute top-0 left-4 cursor-pointer' onClick={() => navigate(-1)}>
                            <ArrowBackSVG className='w-8' />
                        </button>
                        */}

                        <div className='flex flex-col justify-center items-center gap-1 col-span-3 min-h-[100px]'>
                            <h1 className='lg:text-[45px] text-3xl text-center w-3/4'>{title.toUpperCase()}</h1>

                            <div className="gmf-product-rating cursor-pointer" data-compact data-product-id={selectedVariant.id.split('/').pop()} onClick={handleReviewsClick}></div>
                        </div>
                    </div>

                    <div className='product-page pt-5'>
                        <ProductImage media={product.media.nodes as any} key={product.id} />

                        <div className="product-main lg:pt-16">
                            <span className='font-heading font-medium text-sm px-5'>{!useSingleTitle ? `${selectedVariant.title} - ` : ``}{selectedVariant.product.title.toUpperCase()}</span>

                            <div className='flex items-end gap-5 pt-1 px-5'>
                                <ProductForm
                                    product={product}
                                    selectedVariant={selectedVariant}
                                    productOptions={productOptions}
                                    price={selectedVariant.price}
                                />
                            </div>

                            {product.descriptionHtml && (
                                <div className='pt-5 px-5'>
                                    <div
                                        className={cn(
                                            'relative overflow-hidden transition-all duration-300',
                                            !isDescriptionExpanded && 'max-h-[100px]'
                                        )}
                                    >
                                        <div
                                            dangerouslySetInnerHTML={{
                                                __html: isDescriptionExpanded
                                                    ? product.descriptionHtml
                                                    : truncateText(product.descriptionHtml, 200) +
                                                    `<span class="text-sm underline cursor-pointer font-medium">... ${_('product.showMore')}</span>`
                                            }}
                                            onClick={(e) => {
                                                if ((e.target as HTMLElement).tagName === 'SPAN') {
                                                    setIsDescriptionExpanded(true);
                                                }
                                            }}
                                        />
                                    </div>

                                    {isDescriptionExpanded && (
                                        <span
                                            onClick={() => setIsDescriptionExpanded(false)}
                                            className="text-sm underline cursor-pointer font-medium block mt-2 text-center"
                                        >
                                            {_('product.showLess')}
                                        </span>
                                    )}
                                </div>
                            )}

                            {product.type?.value === 'Parfym' && (
                                <Notes
                                    topNotes={topNotes}
                                    baseNotes={baseNotes}
                                    heartNotes={heartNotes}
                                    family={family}
                                />
                            )}

                            {['Parfym', 'Testkit', 'Parfymkit', 'Testers'].includes(product.type?.value || '') && <Guarantee />}

                            {(product.question1 || product.question2 || product.question3) && (
                                <div className='py-6 px-5'>
                                    {product.question1 && product.question1_title && (
                                        <Accordion
                                            title={product.question1_title.value}
                                            rendered={product.question1.value}
                                        />
                                    )}

                                    {product.question2 && product.question2_title && (
                                        <Accordion
                                            title={product.question2_title.value}
                                            rendered={product.question2.value}
                                        />
                                    )}

                                    {product.question3 && product.question3_title && (
                                        <Accordion
                                            title={product.question3_title.value}
                                            rendered={product.question3.value}
                                        />
                                    )}
                                </div>
                            )}
                        </div>

                        <Analytics.ProductView
                            data={{
                                products: [
                                    {
                                        id: product.id,
                                        title: product.title,
                                        price: selectedVariant?.price.amount || '0',
                                        vendor: product.vendor,
                                        variantId: selectedVariant?.id || '',
                                        variantTitle: selectedVariant?.title || '',
                                        quantity: 1,
                                    },
                                ],
                            }}
                        />
                    </div>

                    <div className='flex flex-col gap-12 lg:gap-24 lg:py-16 pb-0 pt-8'>
                        {product.type?.value === 'Testers' && (
                            <div className='px-5'>
                                <div className='pb-6 '>
                                    <div className='flex justify-between items-center'>
                                        <h2 className='font-heading lg:text-3xl text-2xl font-semibold w-1/2'>{_('product.sections.seeAllKits.title.testkit')}</h2>

                                        <button className='uppercase border border-black lg:px-6 px-4 lg:h-[45px] h-[30px] lg:text-base text-sm font-medium font-heading hover:bg-black hover:text-white transition-colors shadow-md'>
                                            {_('product.sections.seeAllKits.cta')}
                                        </button>
                                    </div>

                                    <div className='py-4 lg:w-1/2'>
                                        {_('product.sections.seeAllKits.description')}
                                    </div>
                                </div>

                                <ScrollableGrid variants={additionalData.testkit?.collection?.products.nodes || []} />
                            </div>
                        )}

                        {(product.type?.value === 'Testkit' || product.type?.value === 'Parfymkit') && (
                            <div className=''>
                                <div className='flex justify-between items-center pb-6 px-5'>
                                    <h2 className='font-heading lg:text-3xl text-2xl font-semibold w-1/2'>{_('product.sections.addExtraTester.title')}</h2>

                                    <Link to={`/products/testers`}>
                                        <button className='uppercase border border-black lg:px-6 px-4 lg:h-[45px] h-[30px] lg:text-base text-sm font-medium font-heading hover:bg-black hover:text-white transition-colors shadow-md'>
                                            {_('product.sections.addExtraTester.cta')}
                                        </button>
                                    </Link>
                                </div>

                                <div className='flex lg:flex-row flex-col'>
                                    <div className='h-[142px] lg:h-[55vh] lg:min-w-1/2 w-full overflow-hidden object-cover'>
                                        <img
                                            src={'/22f3e52546f2bd8dceeb2a4ef282715a.png'}
                                            alt='Tester'
                                            className='w-full object-center h-full object-cover'
                                            loading="lazy"
                                        />
                                    </div>

                                    <div className='flex flex-col gap-2 pt-4 px-5 lg:p-16'>
                                        <h2 className='font-heading text-lg lg:text-3xl font-semibold lg:font-medium uppercase'>Testers 2ml</h2>

                                        <InnerProductForm
                                            product={additionalData.testers.product}
                                            variants={additionalData.testers?.product?.variants.nodes}
                                            price={additionalData.testers?.product?.variants.nodes[0].price}
                                            description={_('product.sections.addExtraTester.description')}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {product.type?.value === 'Necessär' && (
                            <div className=''>
                                <div className='flex justify-between items-center py-6 px-5'>
                                    <h2 className='font-heading text-[25px] lg:text-3xl font-semibold'>{_('product.sections.fillNecessaire.title')}</h2>

                                    <Link to={`/products/testers`} prefetch='intent'>
                                        <button className='uppercase border border-black lg:px-6 px-4 lg:h-[45px] h-[30px] lg:text-base text-sm font-medium font-heading hover:bg-black hover:text-white transition-colors shadow-md'>
                                            {_('product.sections.fillNecessaire.cta')}
                                        </button>
                                    </Link>
                                </div>

                                <div className='flex lg:flex-row flex-col'>
                                    <div className='h-[142px] lg:h-[55vh] lg:min-w-1/2 w-full overflow-hidden object-cover'>
                                        <img
                                            src={'/22f3e52546f2bd8dceeb2a4ef282715a.png'}
                                            alt='Tester'
                                            className='w-full object-center h-full object-cover'
                                            loading="lazy"
                                        />
                                    </div>

                                    <div className='flex flex-col gap-2 pt-4 px-5 lg:p-16'>
                                        <h2 className='font-heading text-lg lg:text-3xl font-semibold lg:font-medium uppercase'>Testers 2ml</h2>

                                        <InnerProductForm
                                            product={additionalData.testers.product}
                                            variants={additionalData.testers?.product?.variants.nodes}
                                            price={additionalData.testers?.product?.variants.nodes[0].price}
                                            description={_('product.sections.fillNecessaire.description')?.toString()}
                                        />

                                    </div>
                                </div>
                            </div>
                        )}

                        {product.type?.value === 'Testkit' && (
                            <div className='px-5'>
                                <div className='pb-6 '>
                                    <div className='flex justify-between items-center'>
                                        <h2 className='font-heading lg:text-3xl text-2xl font-semibold w-1/2'>{_('product.sections.seeAllKits.title.testkit')}</h2>

                                        <button className='uppercase border border-black lg:px-6 px-4 lg:h-[45px] h-[30px] lg:text-base text-sm font-medium font-heading hover:bg-black hover:text-white transition-colors shadow-md'>
                                            {_('product.sections.seeAllKits.cta')}
                                        </button>
                                    </div>

                                    <div className='py-4 lg:w-1/2'>
                                        {_('product.sections.seeAllKits.description')}
                                    </div>
                                </div>

                                <ScrollableGrid variants={additionalData.testkit?.collection?.products.nodes.filter((kit: any) => kit.id !== product.id) || []} />
                            </div>
                        )}

                        {product.type?.value === 'Julkalender' && (
                            <div className='px-5'>
                                <div className='pb-6 '>
                                    <div className='flex justify-between items-center'>
                                        <h2 className='font-heading lg:text-3xl text-2xl font-semibold w-1/2'>{_('product.sections.christmasCalendars.title')}</h2>

                                        <button className='uppercase border border-black lg:px-6 px-4 lg:h-[45px] h-[30px] lg:text-base text-sm font-medium font-heading hover:bg-black hover:text-white transition-colors shadow-md'>
                                            {_('product.sections.christmasCalendars.cta')}
                                        </button>
                                    </div>

                                    <div className='py-4 lg:w-1/2'>
                                        {_('product.sections.christmasCalendars.description')}
                                    </div>
                                </div>

                                <ScrollableGrid variants={additionalData.christmasCalendar?.collection?.products.nodes || []} />
                            </div>
                        )}

                        {product.related && product.related.references && product.related.references?.nodes.length > 0 && (
                            <div className=''>
                                <div className='pb-6 px-5'>
                                    <div className='flex justify-between items-center'>
                                        <h2 className='font-heading lg:text-3xl text-2xl font-semibold w-1/2'>{_('product.sections.moreOf.title', { productName: product.title })}</h2>

                                        <Link to="/collections/alla-parfymer">
                                            <button className='uppercase border border-black lg:px-6 px-4 lg:h-[45px] h-[30px] lg:text-base text-sm font-medium font-heading hover:bg-black hover:text-white transition-colors shadow-md'>
                                                {_('product.sections.moreOf.cta')}
                                            </button>
                                        </Link>
                                    </div>

                                    <div className='py-4 lg:w-1/2'>
                                        {_('product.sections.moreOf.description')}
                                    </div>
                                </div>

                                <ScrollableGrid variants={product.related.references.nodes} />
                            </div>
                        )}

                        {product.tester && product.tester.reference && (
                            <div className='py-8'>
                                <div className='flex justify-between items-center py-6 px-5'>
                                    <h2 className='font-heading lg:text-3xl text-2xl font-semibold'>{_('product.sections.tester.title')}</h2>

                                    <Link to={`/products/testers`} prefetch='intent'>
                                        <button className='uppercase border border-black lg:px-6 px-4 lg:h-[45px] h-[30px] lg:text-base text-sm font-medium font-heading hover:bg-black hover:text-white transition-colors shadow-md'>
                                            {_('product.sections.tester.cta')}
                                        </button>
                                    </Link>
                                </div>

                                <div className='flex lg:flex-row flex-col'>
                                    <div className='h-[142px] lg:h-[55vh] lg:min-w-1/2 w-full overflow-hidden object-cover'>
                                        <img
                                            src={'/22f3e52546f2bd8dceeb2a4ef282715a.png'}
                                            alt='Tester'
                                            className='w-full object-center h-full object-cover'
                                            loading="lazy"
                                        />
                                    </div>

                                    <div className='flex flex-col gap-2 pt-4 px-5 lg:p-16'>
                                        <h2 className='font-heading text-lg lg:text-3xl font-semibold lg:font-medium uppercase'>{product.tester?.reference?.selectedOptions[0].value} {product.tester?.reference?.selectedOptions[0].name}</h2>

                                        <p className='mb-2'>
                                            {_('product.sections.tester.description')}
                                        </p>

                                        <div className='flex items-center gap-5'>
                                            <VariantForm variant={product.tester?.reference} />

                                            <ProductPriceHeading price={product.tester?.reference?.price} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {product.family?.value && additionalData.similarFamilies && additionalData.similarFamilies.length > 0 && (
                            <div className='mb-4'>
                                <div className='pb-6 px-5'>
                                    <div className='flex justify-between items-center'>
                                        <h2 className='font-heading lg:text-3xl text-2xl font-semibold w-1/2'>{_('product.sections.family.title', { productName: product.title })}</h2>

                                        <button className='uppercase border border-black lg:px-6 px-4 lg:h-[45px] h-[30px] lg:text-base text-sm font-medium font-heading hover:bg-black hover:text-white transition-colors shadow-md'>
                                            {_('product.sections.family.cta')}
                                        </button>
                                    </div>

                                    <div className='py-4 lg:w-1/2'>
                                        {_('product.sections.family.description', { family: (JSON.parse(product.family.value) as string[])[0] })}
                                    </div>
                                </div>

                                <div className='lg:hidden'>
                                    <ScrollableGrid variants={additionalData.similarFamilies} />
                                </div>

                                <div className='hidden lg:grid grid-cols-4 gap-16'>
                                    {additionalData.similarFamilies && additionalData.similarFamilies.map((product: Partial<Product>) => (
                                        <div key={product.id}>
                                            {product.featuredImage && (
                                                <Image
                                                    alt={product.featuredImage.altText || 'Product Image'}
                                                    aspectRatio="1/1"
                                                    data={product.featuredImage}
                                                    key={product.featuredImage.id}
                                                    sizes="(min-width: 45em) 50vw, 100vw"
                                                    loading="lazy"
                                                />
                                            )}

                                            <div className="flex flex-col items-center gap-2">
                                                <div className="text-center">
                                                    <p className="mt-2 text-center">{product.title}</p>

                                                    <ProductPrice price={product.priceRange?.minVariantPrice} />
                                                </div>

                                                <button className='uppercase border border-black lg:px-6 px-4 lg:h-[45px] h-[30px] lg:text-base text-sm font-medium font-heading hover:bg-black hover:text-white transition-colors shadow-md'>
                                                    {_('product.card.purchase.buy')}
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <PerfumeQuiz />

                    {product.type?.value === 'Testers' && (
                        <div className='py-12 lg:py-24'>
                            <div className='flex justify-between items-center py-6 px-5'>
                                <h2 className='font-heading lg:text-3xl text-2xl font-semibold'>{_('product.sections.travelSize.title')}</h2>

                                <button className='uppercase border border-black lg:px-6 px-4 lg:h-[45px] h-[30px] lg:text-base text-sm font-medium font-heading hover:bg-black hover:text-white transition-colors shadow-md'>
                                    {_('product.sections.travelSize.cta')}
                                </button>
                            </div>

                            <div className='flex lg:flex-row flex-col'>
                                <div className='h-[142px] lg:h-[55vh] lg:min-w-1/2 w-full overflow-hidden object-cover'>
                                    <img
                                        src={'/22f3e52546f2bd8dceeb2a4ef282715a.png'}
                                        alt='Tester'
                                        className='w-full object-center h-full object-cover'
                                        loading="lazy"
                                    />
                                </div>

                                <div className='flex flex-col gap-2 pt-4 px-5 lg:p-16'>
                                    <h2 className='font-heading text-lg lg:text-3xl font-semibold lg:font-medium uppercase'>{current8mlVariant?.title ?? additionalData.testers.product.variants.nodes[0].title} 8ML</h2>

                                    <p className='mb-2'>
                                        {_('product.sections.travelSize.description')}
                                    </p>

                                    <InnerProductForm
                                        product={additionalData.testers.product}
                                        variants={additionalData.testers?.product?.variants.nodes}
                                        price={additionalData.testers?.product?.variants.nodes[0].price}
                                        onVariantChange={setCurrent8mlVariant}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {product.type?.value === 'Testers' && product.selectedOrFirstAvailableVariant?.fullSize?.reference && product.selectedOrFirstAvailableVariant.fullSize.reference.featuredImage && (
                        <div className='py-12 lg:py-24'>
                            <div className='flex justify-between items-center py-6 px-5'>
                                <h2 className='font-heading lg:text-3xl text-2xl font-semibold w-1/2'>{_('product.sections.fullSize.title')}</h2>

                                <button className='uppercase border border-black lg:px-6 px-4 lg:h-[45px] h-[30px] lg:text-base text-sm font-medium font-heading hover:bg-black hover:text-white transition-colors shadow-md '>
                                    {_('product.sections.fullSize.cta')}
                                </button>
                            </div>

                            <div className='flex lg:flex-row flex-col lg:items-center'>
                                <Image
                                    alt={product.selectedOrFirstAvailableVariant.fullSize.reference.featuredImage.altText || product.selectedOrFirstAvailableVariant.fullSize.reference.title}
                                    aspectRatio="1/1"
                                    data={product.selectedOrFirstAvailableVariant.fullSize.reference.featuredImage}
                                    sizes="(min-width: 45em) 400px, 100vw"
                                    className='lg:flex-1'
                                    loading="lazy"
                                />

                                <div className='flex flex-col items-center gap-2 lg:flex-1'>
                                    <p className="mt-2 text-center lg:text-lg">{product.selectedOrFirstAvailableVariant.fullSize.reference.title}</p>

                                    <ProductPrice price={product.selectedOrFirstAvailableVariant.fullSize.reference.priceRange?.minVariantPrice} />

                                    <button className='uppercase border border-black lg:px-8 px-6 lg:h-[45px] h-[30px] lg:text-base text-sm font-medium font-heading hover:bg-black hover:text-white transition-colors shadow-md '>
                                        {_('product.card.purchase.buy')}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    <AboutUs />

                    <Suspense>
                        <div className='hidden'> {/* //TODO: Add back */}
                            <Await resolve={blog}>
                                {(data) => data && <Blog blog={data.blog} />}
                            </Await>
                        </div>
                    </Suspense>

                    <section id="reviews" className="py-12 lg:py-24 px-5 flex flex-col items-center">
                        <div className="px-5 justify-center">
                            <h2 className='font-heading lg:text-3xl text-[25px] font-semibold'>{_('product.reviews')}</h2>
                        </div>
                        <div id="gmf-comment-section" data-product-id={selectedVariant.id.split('/').pop()} key={selectedVariant.id.split('/').pop()}></div>
                    </section>
                </div>
            </div >
        </>
    );
}

const PRODUCT_VARIANT_FRAGMENT = `#graphql
            fragment ProductVariant on ProductVariant {
                availableForSale
    compareAtPrice {
                amount
      currencyCode
    }
            id
            image {
                __typename
      id
            url
            altText
            width
            height
    }
            price {
                amount
      currencyCode
    }
            product {
                title
      handle
    }
            selectedOptions {
                name
      value
    }
            sku
            title
            unitPrice {
                amount
      currencyCode
    }
  }
            ` as const;

const PRODUCT_FRAGMENT = `#graphql
            fragment CollectionProduct on Product {
                id
                title
            vendor
            handle
            descriptionHtml
            description
            encodedVariantExistence
            encodedVariantAvailability
            options {
                name
                    optionValues {
                name
                        firstSelectableVariant {
                ...ProductVariant
            }
                    }
                }
            collections(first: 100) {
                nodes {
                title
                        handle
                    }
                }
            adjacentVariants (selectedOptions: $selectedOptions) {
                ...ProductVariant
            }
            selectedOrFirstAvailableVariant(selectedOptions: $selectedOptions, ignoreUnknownOptions: true, caseInsensitiveMatch: true) {
                ...ProductVariant
                    fullSize: metafield(namespace: "custom", key: "test_tester_fullsize") {
                value
                        reference {
                ...on Product {
                id
                                title
            handle
            priceRange {
                minVariantPrice {
                amount
                                    currencyCode
                                }
                            }
            variants(first: 1) {
                nodes {
                id
                                    selectedOptions {
                name
                                        value
                                    }
                                }
                            }
            featuredImage {
                __typename
                                id
            url
            altText
            width
            height
                            }
                        }
                    }
                }
            }
            variants(first: 1) {
                nodes {
                ...ProductVariant
            }
            }
            type: metafield(namespace: "custom", key: "test_produkttyp") {
                value
            }
            shortDescription: metafield(namespace: "custom", key: "test_kortbeskrivning") {
                value
            }
            topNotes: metafield(namespace: "custom", key: "test_toppnoter") {
                value
            }
            heartNotes: metafield(namespace: "custom", key: "test_hj_rtnoter") {
                value
            }
            baseNotes: metafield(namespace: "custom", key: "test_basnoter") {
                value
            }
            family: metafield(namespace: "custom", key: "test_doftgrupp") {
                value
            }
            relatedProducts: metafield(namespace: "custom", key: "test_related") {
                value
            }
            seo {
                description
                title
            }
        }
            ${PRODUCT_VARIANT_FRAGMENT}
            ` as const;

const TESTERS_TRAVEL_SIZE_QUERY = `#graphql
            query TestersTravelSize(
            $country: CountryCode,
            $language: LanguageCode,
            $handle: String!
            ) @inContext(country: $country, language: $language) {
                product(handle: $handle) {
                ...on Product {
                title
                handle
            variants(first: 20) {
                nodes {
                ...on ProductVariant {
                id
                            title
            price {
                amount
                                currencyCode
                            }
            product {
                title
                                handle
                            }
            availableForSale
            selectedOptions {
                name
                                value
                            }
                        }
                    }
                }
            options {
                name
                    values
                }
            }
        }
    }
            ` as const;

const FIND_COLLECTION_QUERY = `#graphql
            query ChristmasCalendar(
            $country: CountryCode,
            $language: LanguageCode,
            $first: Int = 10,
            $handle: String!
            ) @inContext(country: $country, language: $language) {
                collection(handle: $handle) {
                products(first: $first) {
                nodes {
                ...on Product {
                id
            title
            handle,
            priceRange {
                minVariantPrice {
                amount
                currencyCode
              }
            },
            featuredImage {
                __typename
              id
            url
            altText
            width
            height
            }
          }
        }
      }
    }
  }
            ` as const;

export const SIMILAR_FAMILIES_QUERY = `#graphql
            query CollectionByFamily(
            $country: CountryCode,
            $language: LanguageCode,
            $family: String!,
            $first: Int = 10,
            $handle: String!
            ) @inContext(country: $country, language: $language) {
                collection(handle: $handle) {
                id
                handle
            title
            description
            products(
            first: $first,
            filters: [
            {
                productMetafield: {
                namespace: "custom",
            key: "test_doftgrupp",
            value: $family
                        }
                    }
            ]
            ) {
                nodes {
                ...on Product {
                id
                title,
            handle,
            priceRange {
                minVariantPrice {
                amount
                    currencyCode
                  }
                },
            featuredImage {
                __typename
                    id
            url
            altText
            width
            height
                }
            }
        }
      }
    }
  }
            ` as const;

const PRODUCT_QUERY = `#graphql
            query CollectionProduct(
            $country: CountryCode
            $handle: String!
            $language: LanguageCode
            $selectedOptions: [SelectedOptionInput!]!
            ) @inContext(country: $country, language: $language) {
                product(handle: $handle) {
                ...CollectionProduct
      media(first: 6) {
                nodes {
                ...on MediaImage {
                id
            mediaContentType
            image {
                __typename
              id
            url
            altText
            width
            height
            originalSrc
            src
            transformedSrc
            }
          }
        }
      }
            tester: metafield(namespace: "custom", key: "test_tester") {
                value
        reference {
                ...ProductVariant
            }
      }
            related: metafield(namespace: "custom", key: "test_related") {
                value
        references(first: 10) {
                nodes {
                ...on ProductVariant {
                id
              product {
                title
                handle
              }
            price {
                amount
                currencyCode
              }
            image {
                __typename
                id
            url
            altText
            width
            height
              }
            }
          }
        }
      }
            question1: metafield(namespace: "custom", key: "test_accordion_question1") {
                value
            }
            question1_title: metafield(namespace: "custom", key: "test_accordion_question1_title") {
                value
            }
            question2: metafield(namespace: "custom", key: "test_accordion_notes") {
                value
            }
            question2_title: metafield(namespace: "custom", key: "test_accordion_question2_title") {
                value
            }
            question3: metafield(namespace: "custom", key: "test_accordation_description") {
                value
            }
            question3_title: metafield(namespace: "custom", key: "test_accordion_question3_title") {
                value
            }
    }
  }
            ${PRODUCT_FRAGMENT}
            ` as const;


const PRODUCT_VARIANTS_FRAGMENT = `#graphql
            fragment ProductVariants on Product {
                variants(first: 250) {
                nodes {
                ...ProductVariant
            }
    }
  }
            ${PRODUCT_VARIANT_FRAGMENT}
            ` as const;

const JUDGE_ME_QUERY = `/widgets/preview_badge?handle={{ handle }}` as const;

const BLOGS_QUERY = `#graphql
            query ProductPageBlog(
            $language: LanguageCode
            $blogHandle: String!
            $first: Int
            ) @inContext(language: $language) {
                blog(handle: $blogHandle) {
                id
      title
            seo {
                title
        description
      }
            articles(
            first: $first,
            ) {
                nodes {
                ...ArticleItem
            }
            pageInfo {
                hasPreviousPage
          hasNextPage
            hasNextPage
            endCursor
            startCursor
        }

      }
    }
  }
            fragment ArticleItem on Article {
                author: authorV2 {
                name
            }
            contentHtml
            excerpt
            handle
            id
            tags
            image {
                id
      altText
            url
            width
            height
    }
            publishedAt
            title
            blog {
                handle
            }
  }
            ` as const;


const VARIANTS_QUERY = `#graphql
            ${PRODUCT_VARIANTS_FRAGMENT}
            query ProductVariants(
            $country: CountryCode
            $language: LanguageCode
            $handle: String!
            ) @inContext(country: $country, language: $language) {
                product(handle: $handle) {
                ...ProductVariants
            }
  }
            ` as const;
