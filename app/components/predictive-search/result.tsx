import { Link } from '@remix-run/react';
import { Image, Money, Pagination } from '@shopify/hydrogen';
import { NormalizedPredictiveSearchResultItem, NormalizedPredictiveSearchResults, SearchResultItemProps, SearchResultTypeProps } from './types';
import clsx from "clsx";

export function SearchResultItem({
    goToSearchResult,
    item,
}: SearchResultItemProps) {
    return (
        <Link
            to={item.url}
            onClick={goToSearchResult}
            data-type={item.__typename}
            prefetch="intent"
            className="group flex gap-4 items-start"
        >
            {item.image && (
                <div className="aspect-square w-24 h-24 flex-shrink-0">
                    <img
                        src={item.image.url}
                        alt={item.image.altText || item.title}
                        className="object-cover w-full h-full"
                    />
                </div>
            )}
            <div className="flex flex-col">
                <p className="text-base font-medium">{item.title}</p>
                {item.description && (
                    <p className="text-sm text-gray-600 line-clamp-2 mt-1">{item.description}</p>
                )}
            </div>
        </Link>
    );
}

export function PredictiveSearchResult({
    goToSearchResult,
    items,
    searchTerm,
    type,
}: SearchResultTypeProps) {
    const isSuggestions = type === 'queries';
    const categoryUrl = `/search?q=${searchTerm.current
        }&type=${pluralToSingularSearchType(type)}`;

    return (
        <div
            className="predictive-search-result flex gap-4 w-full"
            key={type}
        >
            <ul className={clsx("pt-5 flex flex-1")}>
                {items.map((item: NormalizedPredictiveSearchResultItem) => (
                    <SearchResultItem
                        goToSearchResult={goToSearchResult}
                        item={item}
                        key={item.id}
                    />
                ))}
            </ul>
        </div>
    );
}

/**
 * Converts a plural search type to a singular search type
 *
 * @example
 * ```js
 * pluralToSingularSearchType('articles'); // => 'ARTICLE'
 * pluralToSingularSearchType(['articles', 'products']); // => 'ARTICLE,PRODUCT'
 * ```
 */
function pluralToSingularSearchType(
    type:
        | NormalizedPredictiveSearchResults[number]['type']
        | Array<NormalizedPredictiveSearchResults[number]['type']>,
) {
    const plural = {
        articles: 'ARTICLE',
        collections: 'COLLECTION',
        pages: 'PAGE',
        products: 'PRODUCT',
        queries: 'QUERY',
    };

    if (typeof type === 'string') {
        return plural[type];
    }

    return type.map((t) => plural[t]).join(',');
}