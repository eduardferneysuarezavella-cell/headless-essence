import type { ProductCollectionSortKeys } from '@shopify/hydrogen/storefront-api-types';

export function getSortValuesFromParam(sort: string | null): {
    sortKey: ProductCollectionSortKeys;
    reverse: boolean;
} {
    switch (sort) {
        case 'price-low-high':
            return {
                sortKey: 'PRICE',
                reverse: false,
            };
        case 'price-high-low':
            return {
                sortKey: 'PRICE',
                reverse: true,
            };
        case 'best-selling':
            return {
                sortKey: 'BEST_SELLING',
                reverse: false,
            };
        case 'newest':
            return {
                sortKey: 'CREATED',
                reverse: true,
            };
        case 'featured':
            return {
                sortKey: 'MANUAL',
                reverse: false,
            };
        case 'alphabetical':
            return {
                sortKey: 'TITLE',
                reverse: false,
            };
        case 'alphabetical-reverse':
            return {
                sortKey: 'TITLE',
                reverse: true,
            };
        default:
            return {
                sortKey: 'RELEVANCE',
                reverse: false,
            };
    }
}
