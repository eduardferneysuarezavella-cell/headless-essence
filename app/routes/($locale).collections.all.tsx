import { defer, type LoaderFunctionArgs } from '@shopify/remix-oxygen';
import { useLoaderData, Link, type MetaFunction, Await } from '@remix-run/react';
import { Analytics, getPaginationVariables, Image, Money } from '@shopify/hydrogen';
import type { ProductItemFragment } from 'storefrontapi.generated';
import { useVariantUrl } from '~/lib/variants';
import { PaginatedResourceSection } from '~/components/PaginatedResourceSection';
import { CollectionFilter, CollectionFilterWrapper, CollectionSort } from '~/components/CollectionFilter';
import ExpandableDescription from '~/components/ExpandableDescription';
import { ProductItem } from './($locale).collections.$handle';
import { buildFilterFromQuery, buildGraphQLFilter, CollectionFilters, SpecificCollectionFilter } from '~/lib/filter';
import { getSortValuesFromParam } from '~/lib/sorting';
import { useI18n } from '~/components/i18n-provider';
import { useTranslation } from '~/i18n/i18n';

export const meta: MetaFunction<typeof loader> = () => {
    return [{ title: `Alla produkter - dofter inspirerade av kända parfymer till ett bra pris` }];
};

export async function loader(args: LoaderFunctionArgs) {
    const deferredData = loadDeferredData(args);

    const criticalData = await loadCriticalData(args);

    return defer({ ...deferredData, ...criticalData });
}

async function loadCriticalData({ context, request }: LoaderFunctionArgs) {
    const searchParams = new URLSearchParams(request.url);
    const page = Number(searchParams.get('page')) || 1;

    const { storefront } = context;
    const paginationVariables = getPaginationVariables(request, {
        pageBy: 24,
    });

    const [{ products }] = await Promise.all([
        storefront.query(CATALOG_QUERY, {
            variables: {
                ...paginationVariables,
            },
        }),
    ]);
    return { products, page };
}

function loadDeferredData({ context }: LoaderFunctionArgs) {
    const collections = context.storefront.query(COLLECTIONS_QUERY, {
        variables: {},
    });

    return { collections };
}

export default function Collection() {
    const { t: _ } = useTranslation();
    const { products, collections, page } = useLoaderData<typeof loader>();

    return (
        <div className="collection max-w-[1440px] mx-auto">
            <div className='flex flex-col justify-center items-center'>
                <h1 className='font-heading font-medium text-3xl lg:text-[45px] uppercase pt-8 px-5 pb-4'>{_('collections.allProducts')}</h1>

                <ExpandableDescription wrapperClassName="px-5 py-6">
                    {_('collections.allProductsDescription')}
                </ExpandableDescription>
            </div>

            <CollectionFilterWrapper className='px-5 sticky lg:static top-0 py-4 bg-white select-none'>
                {({ activeFilters, setActiveFilters, onFilterUpdate }) => (
                    <>
                        <div className='flex justify-between z-10'>
                            <Await resolve={collections}>
                                {({ collections }) => (
                                    <CollectionFilter
                                        filters={[...CollectionFilters, SpecificCollectionFilter(collections.nodes.map((collection: any) => collection.handle))]}
                                        activeFilters={activeFilters}
                                        setActiveFilters={setActiveFilters}
                                    />
                                )}
                            </Await>

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
                                                className='flex-shrink-0 flex gap-2 px-3 py-[3px] rounded-full bg-black text-white text-xs font-[200]'
                                            >
                                                <p className='uppercase'>{filter}</p>
                                                <span>{_('collections.filters.clear')}</span>
                                            </div>
                                        ))
                                    })}

                                    <button
                                        className='flex-shrink-0 flex gap-2 px-3 py-[3px] rounded-full border border-black text-black text-xs font-[400]'
                                        onClick={() => onFilterUpdate({})}
                                    >
                                        <span>{_('collections.filters.clear')}</span>
                                        <p className='uppercase'>{_('collections.filters.clearAll')}</p>
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </CollectionFilterWrapper>

            <PaginatedResourceSection
                page={1}
                connection={products}
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
        </div>
    );
}

const PRODUCT_ITEM_FRAGMENT = `#graphql
  fragment MoneyProductItem on MoneyV2 {
    amount
    currencyCode
  }
  fragment AllProductItem on Product {
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
    variants(first: 1) {
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

// NOTE: https://shopify.dev/docs/api/storefront/2024-01/objects/product
const CATALOG_QUERY = `#graphql
  query Catalog(
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
  ) @inContext(country: $country, language: $language) {
    products(first: $first, last: $last, before: $startCursor, after: $endCursor) {
      nodes {
        ...AllProductItem
      }
      pageInfo {
        hasPreviousPage
        hasNextPage
        startCursor
        endCursor
      }
    }
  }
  ${PRODUCT_ITEM_FRAGMENT}
` as const;

const COLLECTIONS_QUERY = `#graphql
  query Collections {
    collections(first: 100) {
      nodes {
        id
        title
        handle
      }
    }
  }
` as const;
