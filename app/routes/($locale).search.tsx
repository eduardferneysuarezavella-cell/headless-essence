import {
    json,
    type LoaderFunctionArgs,
    type ActionFunctionArgs,
    defer,
} from '@shopify/remix-oxygen';
import { useLoaderData, useSearchParams, type MetaFunction } from '@remix-run/react';
import { getPaginationVariables, Analytics } from '@shopify/hydrogen';
import { SearchForm } from '~/components/SearchForm';
import { getSortValuesFromParam } from '~/lib/sorting';
import { ProductItem } from './($locale).collections.$handle';
import { useEffect, useRef, useState } from 'react';
import { PredictiveSearchResult, SearchResultItem } from '~/components/predictive-search/result';
import { PredictiveSearchForm } from '~/components/predictive-search/search-form';
import { usePredictiveSearch } from '~/components/predictive-search/usePredictiveSearch';
import { normalizePredictiveSearchResults, PREDICTIVE_SEARCH_QUERY } from './($locale).api.predictive-search';
import { useI18n } from '~/components/i18n-provider';
import { useTranslation } from '~/i18n/i18n';
export const meta: MetaFunction = ({ data }: any) => {
    return [{ title: `Sökning: ${data?.results?.totalCount} resultat hittades för "${data?.searchTerm}" | ESSNCE` }];
};

export async function loader({ request, context }: LoaderFunctionArgs) {
    const { storefront } = context;
    const searchParams = new URL(request.url).searchParams;
    const searchTerm = searchParams.get('q')! || '';

    const data = await context.storefront.query(PREDICTIVE_SEARCH_QUERY, {
        variables: {
            limit: 10,
            limitScope: 'EACH',
            searchTerm,
            types: ['PRODUCT', 'COLLECTION', 'PAGE', 'ARTICLE'],
        },
    });

    if (!data) {
        throw new Error('No data returned from Shopify API');
    }

    const searchResults = normalizePredictiveSearchResults(
        data.predictiveSearch,
        storefront.i18n.language,
    );

    return defer({
        searchTerm: searchTerm,
        results: searchResults,
    })
}

/**
 * Renders the /search route
 */
export default function SearchPage() {
    const { searchTerm, results } = useLoaderData<typeof loader>();
    const { t: _ } = useTranslation();

    const [inputValue, setInputValue] = useState(searchTerm ?? '')
    const [searchParams, setSearchParams] = useSearchParams();

    return (
        <div className="search max-w-[1440px] mx-auto px-5 lg:px-8">
            <PredictiveSearchForm>
                {({ fetchResults, inputRef }) => (
                    <div className="relative">
                        <input
                            name="q"
                            value={inputValue}
                            onChange={(e) => {
                                setInputValue(e.target.value);
                                fetchResults(e);
                                setSearchParams({ q: e.target.value }, { preventScrollReset: true });
                            }}
                            placeholder={_('layout.search.placeholder')?.toString()}
                            ref={inputRef}
                            className="rounded outline-none border-none py-2 pl-10 pr-4 bg-neutral-100 w-full"
                            autoFocus={true}
                        />
                        <svg
                            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                        {!inputValue && (
                            <img
                                src="https://cdn.shopify.com/s/files/1/0551/4611/9308/files/Carashmellow_Frilagd.png?v=1724691421&width=100&height=100&crop=center"
                                alt="Carashmellow"
                                className="absolute right-3 top-1/2 -translate-y-1/2 h-6 w-auto block md:hidden"
                            />
                        )}
                    </div>
                )}
            </PredictiveSearchForm>

            <SearchResults
                initialResults={results}
                initialSearchTerm={searchTerm}
            />
        </div>
    );
}

function SearchResults({ initialResults, initialSearchTerm }: { initialResults: any, initialSearchTerm: string }) {
    const { results, totalResults, searchTerm, searchInputRef } = usePredictiveSearch();
    const { t: _ } = useTranslation();

    let totalResultsCount = totalResults || initialResults?.totalResults || 0;

    function goToSearchResult(event: React.MouseEvent<HTMLAnchorElement>) {
        let type = event.currentTarget.dataset.type;
        if (!searchInputRef.current) return;
        if (type === 'SearchQuerySuggestion') {
            searchInputRef.current.value = event.currentTarget.innerText;
            // dispatch event onchange for the search
            searchInputRef.current.focus();
        } else {
            searchInputRef.current.blur();
            searchInputRef.current.value = '';
            // close the aside
            window.location.href = event.currentTarget.href;
        }
    }

    if (!totalResultsCount && (initialSearchTerm || searchTerm.current)) {
        return (
            <div className="relative flex items-center justify-center bg-white">
                <div className="grid custom-scroll md:max-h-[81vh] md:min-h-auto w-screen grid-cols-1 gap-6 overflow-y-auto p-6 max-w-[1440px]">
                    <NoPredictiveSearchResults searchTerm={searchTerm} />
                </div>
            </div>
        );
    }

    if (!totalResultsCount) {
        return null;
    }

    const actualResults = totalResults > 0 ? results : initialResults.results as any;

    const products = actualResults.find((result: any) => result.type === 'products')?.items || [];
    const articles = actualResults.find((result: any) => result.type === 'articles')?.items || [];
    const pages = actualResults.find((result: any) => result.type === 'pages')?.items || [];
    const collections = actualResults.find((result: any) => result.type === 'collections')?.items || [];

    return (
        <div className='flex flex-col gap-12 px-5 py-8'>
            <div>
                <h1 className='text-2xl font-heading font-medium uppercase mb-4'>{_('layout.search.results.productsAndCollections')}</h1>

                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
                    {[...products, ...collections].map((item) => (
                        <SearchResultItem
                            key={item.id}
                            goToSearchResult={goToSearchResult}
                            item={item}
                        />
                    ))}
                </div>
            </div>

            <div className=''>
                <h1 className='text-2xl font-heading font-medium uppercase mb-4'>{_('layout.search.results.articlesAndPages')}</h1>

                <div className='flex flex-col gap-1'>
                    {[...pages, ...articles].map((item) => (
                        <SearchResultItem
                            key={item.id}
                            goToSearchResult={goToSearchResult}
                            item={item}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}

function NoPredictiveSearchResults({ searchTerm }: { searchTerm: React.MutableRefObject<string> }) {
    const { t: _ } = useTranslation();

    if (!searchTerm.current) {
        return null;
    }

    return (
        <div className="w-full">
            <h2 className='md:pb-6'>{_('search.noResults', { query: searchTerm.current })}</h2>
        </div>
    );
}

const SEARCH_QUERY = `#graphql
  query PaginatedSearch(
    $country: CountryCode
    $language: LanguageCode
    $endCursor: String
    $first: Int
    $last: Int
    $searchTerm: String!
    $startCursor: String
  ) @inContext(country: $country, language: $language) {
    search(
      first: $first,
      last: $last,
      before: $startCursor,
      after: $endCursor,
      query: $searchTerm
      types: [PRODUCT]
    ) {
      nodes {
        ... on Product {
            __typename
            id
            title
            handle
            featuredImage {
                url
                altText
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
                    amount
                    currencyCode
                }
                maxVariantPrice {
                    amount
                    currencyCode
                }
            }
            variants(first: 1) {
                nodes {
                    id
                    availableForSale
                    image {
                        url
                        altText
                        width
                        height
                    }
                    price {
                        amount
                        currencyCode
                    }
                    selectedOptions {
                        name
                        value
                    }
                }
            }
        }
      }
      pageInfo {
        startCursor
        endCursor
        hasNextPage
        hasPreviousPage
      }
      totalCount
    }
  }
` as const;
