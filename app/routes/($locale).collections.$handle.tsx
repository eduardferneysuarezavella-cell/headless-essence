import { defer, redirect, type LoaderFunctionArgs } from '@shopify/remix-oxygen';
import { useLoaderData, Link, type MetaFunction, FetcherWithComponents } from '@remix-run/react';
import {
    getPaginationVariables,
    Image,
    Money,
    Analytics,
    CartForm,
} from '@shopify/hydrogen';
import type { ProductItemFragment } from 'storefrontapi.generated';
import { useVariantUrl } from '~/lib/variants';
import { PaginatedResourceSection } from '~/components/PaginatedResourceSection';
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowBackSVG } from '~/components/icons/ArrowBackSVG';
import ExpandableDescription from '~/components/ExpandableDescription';
import { getSortValuesFromParam } from '~/lib/sorting';
import { CollectionFilter, CollectionFilterWrapper, CollectionSort, CollectionTypeFilter } from '~/components/CollectionFilter';
import { buildFilterFromQuery, buildGraphQLFilter } from '~/lib/filter';
import { ProductPrice } from '~/components/ProductPrice';
import { AddToCartIcon } from '~/components/icons/AddToCart';
import { useAside } from '~/components/Aside';
import { BellIcon, BellPlusIcon, Loader2 } from 'lucide-react';
import MonitorDialog from '~/components/MonitorDialog';
import { useI18n } from '~/components/i18n-provider';
import { useTranslation } from '~/i18n/i18n';

export const meta: MetaFunction<typeof loader> = ({ data }) => {
    return [{ title: data?.collection.seo?.title ?? data?.collection.title }];
};

export async function loader(args: LoaderFunctionArgs) {
    // Start fetching non-critical data without blocking time to first byte
    const deferredData = loadDeferredData(args);

    // Await the critical data required to render initial state of the page
    const criticalData = await loadCriticalData(args);

    return defer({ ...deferredData, ...criticalData });
}

async function loadCriticalData({
    context,
    params,
    request,
}: LoaderFunctionArgs) {
    const { handle } = params;
    const { storefront } = context;

    const searchParams = new URL(request.url).searchParams;
    const paginationVariables = getPaginationVariables(request, {
        pageBy: 16,
    });

    if (!handle) {
        throw redirect('/collections');
    }

    const [{ collection }] = await Promise.all([
        storefront.query(COLLECTION_QUERY, {
            variables: {
                handle,
                ...paginationVariables,
                ...getSortValuesFromParam(searchParams.get('sort')),
                filters: [
                    ...buildGraphQLFilter(buildFilterFromQuery(searchParams.get('filters') ?? '')),
                    ...(searchParams.get('family') ? [{
                        productMetafield: {
                            namespace: 'custom',
                            key: 'test_doftgrupp',
                            value: searchParams.get('family') ?? '',
                        }
                    }] : [])
                ]
            },
        }),
    ]);

    if (!collection) {
        throw new Response(`Collection ${handle} not found`, {
            status: 404,
        });
    }

    return {
        collection,
    };
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({ context }: LoaderFunctionArgs) {
    return {};
}

export default function Collection() {
    const { collection } = useLoaderData<typeof loader>();

    return (
        <div className="collection max-w-[1440px] mx-auto">
            <div className='flex flex-col justify-center items-center'>
                <h1 className='font-heading font-medium text-3xl lg:text-[45px] uppercase pt-8 px-5 pb-4'>{collection.title}</h1>

                <ExpandableDescription wrapperClassName="px-5 py-6">
                    {collection.description}
                </ExpandableDescription>

                <CollectionTypeFilter />
            </div>

            <CollectionFilterWrapper className='px-5 sticky lg:static top-0 py-4 bg-white select-none z-10 transform-gpu'>
                {({ activeFilters, setActiveFilters, onFilterUpdate }) => (
                    <>
                        <div className='flex justify-between z-10'>
                            <CollectionFilter
                                activeFilters={activeFilters}
                                setActiveFilters={setActiveFilters}
                            />

                            <CollectionSort />
                        </div>

                        {Object.entries(activeFilters).flatMap(([_, value]) => value).length > 0 && (
                            <div className='flex gap-1 mt-1 overflow-x-auto whitespace-nowrap pb-2'>
                                <div className='inline-flex gap-1'>
                                    {Object.entries(activeFilters).map(([key, value]) => {
                                        return value.map((filter) => (
                                            <div
                                                key={filter}
                                                onClick={() => onFilterUpdate({ ...activeFilters, [key]: value.filter((value) => value !== filter) })}
                                                className='flex-shrink-0 flex gap-2 px-3 py-[2px] rounded-full bg-black text-white text-sm font-heading'
                                            >
                                                <p className='uppercase translate-y-0.5'>{filter}</p>
                                                <span className='translate-y-0.5'>X</span>
                                            </div>
                                        ))
                                    })}

                                    <button
                                        className='flex-shrink-0 flex gap-2 px-3 py-[2px] rounded-full border border-black text-black text-sm font-heading'
                                        onClick={() => onFilterUpdate({})}
                                    >
                                        <span className='translate-y-0.5'>X</span>
                                        <p className='uppercase translate-y-0.5'>Rensa alla</p>
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </CollectionFilterWrapper>

            <PaginatedResourceSection
                page={1}
                connection={collection.products}
                resourcesClassName="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 px-5 gap-4"
            >
                {({ node: product, index }: { node: ProductItemFragment, index: number }) => (
                    <ProductItem
                        key={product.id}
                        product={product}
                        loading={index < 8 ? 'eager' : undefined}
                    />
                )}
            </PaginatedResourceSection>
            <Analytics.CollectionView
                data={{
                    collection: {
                        id: collection.id,
                        handle: collection.handle,
                    },
                }}
            />
        </div>
    );
}

type SortParameter = 'price-low-high' | 'price-high-low' | 'best-selling' | 'a-z' | 'z-a';

export function ProductItem({
    product,
    loading,
}: {
    product: ProductItemFragment;
    loading?: 'eager' | 'lazy';
}) {
    const { t: _ } = useTranslation();
    const variant = product.variants.nodes[0];
    const variantUrl = useVariantUrl(product.handle, variant.selectedOptions);

    const collectionTags = product.collections.nodes.map((collection) => collection.metafield?.value)
        .filter((value) => value !== undefined)
        .flatMap((value) => JSON.parse(value) as string[])

    const productTags = product.metafield?.value ? JSON.parse(product.metafield.value) as string[] : [];
    const availableTag = product.variants.nodes.length === 1 &&
        !product.variants.nodes[0].availableForSale &&
        !productTags.some(tag => tag.toLowerCase() === _('collections.upcoming')?.toString().toLowerCase()) &&
        !collectionTags.some(tag => tag.toLowerCase() === _('collections.upcoming')?.toString().toLowerCase())
        ? [_('collections.soldOut')]
        : [];

    return (
        <Link
            className="product-item font-heading "
            key={product.id}
            prefetch="intent"
            to={variantUrl}
        >
            <div className='relative'>
                <div className='absolute top-4 left-4 flex flex-col gap-1'>
                    {[...productTags, ...collectionTags, ...availableTag].map((tag, index) => (
                        <p key={index} className='text-sm px-3 py-0.5 bg-black rounded-full text-white w-max'>
                            {tag}
                        </p>
                    ))}
                </div>

                {product.featuredImage && (
                    <Image
                        alt={product.featuredImage.altText || product.title}
                        aspectRatio="1/1"
                        data={product.featuredImage}
                        loading={loading}
                        sizes="(min-width: 45em) 400px, 100vw"
                    />
                )}

                {product.variants.nodes.length === 1 && (product.variants.nodes[0].availableForSale ? (
                    <CartForm route="/cart" inputs={{ lines: [{ merchandiseId: variant.id, quantity: 1, selectedVariant: { ...variant, product: { handle: product.handle } } }] }} action={CartForm.ACTIONS.LinesAdd}>
                        {(fetcher: FetcherWithComponents<any>) => (
                            <AddToCartButton fetcher={fetcher} />
                        )}
                    </CartForm>
                ) : (
                    <MonitorDialog
                        className='absolute bottom-0 right-0 p-2 z-10'
                        product={{
                            title: product.title,
                            selectedVariant: {
                                id: variant.id,
                            },
                        }}
                    >
                        <BellPlusIcon />
                    </MonitorDialog>
                ))}
            </div>
            <div className='flex flex-col gap-1.5 mt-3 px-2'>
                <h4 className='text-lg'>{product.title}</h4>
                <span className='text-base'>
                    <ProductPrice price={product.priceRange.minVariantPrice} />
                </span>
            </div>
        </Link>
    );
}

const AddToCartButton = ({ fetcher }: { fetcher: FetcherWithComponents<any> }) => {
    const { open } = useAside();

    useEffect(() => {
        if (fetcher.state === 'idle' && fetcher.data) {
            open('cart');
        }
    }, [fetcher.state]);

    return (
        <>
            <input
                name="analytics"
                type="hidden"
                value={JSON.stringify(undefined)}
            />

            <button
                type='submit'
                disabled={fetcher.state !== 'idle'}
                className='absolute bottom-0 right-0 p-2 z-10'
                onClick={(event) => {
                    event.stopPropagation();
                }}
            >
                {fetcher.state !== 'idle' ? (
                    <Loader2 className='animate-spin' size={24} />
                ) : (
                    <AddToCartIcon />
                )}
            </button>
        </>
    );
}

const PRODUCT_ITEM_FRAGMENT = `#graphql
  fragment MoneyProductItem on MoneyV2 {
    amount
    currencyCode
  }
  fragment ProductItem on Product {
    id
    handle
    title
    featuredImage {
      id
      altText
      url
      width
      height
    }
    collections(first: 25) {
      nodes {
        title
        metafield(namespace: "custom", key: "test_tags") {
          value
        }
      }
    }
    priceRange {
      minVariantPrice {
        ...MoneyProductItem
      }
      maxVariantPrice {
        ...MoneyProductItem
      }
    }
    metafield(namespace: "custom", key: "test_tags") {
      value
    }
    variants(first: 2) {
      nodes {
        id
        availableForSale
        selectedOptions {
          name
          value
        }
      }
    }
  }
` as const;

// NOTE: https://shopify.dev/docs/api/storefront/2022-04/objects/collection
const COLLECTION_QUERY = `#graphql
  ${PRODUCT_ITEM_FRAGMENT}
  query Collection(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String,
    $sortKey: ProductCollectionSortKeys,
    $reverse: Boolean,
    $filters: [ProductFilter!]
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      id
      handle
      title
      description
      products(
        first: $first,
        last: $last,
        before: $startCursor,
        after: $endCursor,
        sortKey: $sortKey,
        reverse: $reverse,
        filters: $filters
      ) {
        nodes {
          ...ProductItem
        }
        pageInfo {
          hasPreviousPage
          hasNextPage
          endCursor
          startCursor
        }
      }
    }
  }
` as const;
