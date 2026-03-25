export function getFiltersFromParam(filters: string | null) {
}

export const CollectionFilters = [
    {
        code: 'scent_group',
        name: 'Doftgrupp',
        values: ['Vanilj', 'Fräsch', 'Orientalisk', 'Gourmand', 'Blommig', 'Träig', 'Söt', 'Fruktig'],
        metafield: { key: 'test_doftgrupp', namespace: 'custom' },
    },
    {
        code: 'scent_notes',
        name: 'Doftnoter',
        metafield: { key: 'test_doftnoter', namespace: 'custom' },
        values: []
    },
    {
        code: 'product_type',
        name: 'Produkttyp',
        metafield: { key: 'produktype', namespace: 'custom' },
        values: ['Parfym', 'Julkalender', 'Tester', 'Extra'],
    },
    {
        code: 'gender',
        name: 'Kön',
        metafield: { key: 'test_gender', namespace: 'custom' },
        values: ['Man', 'Kvinna', 'Unisex'],
    },
    {
        code: 'insensity',
        name: 'Intensitet',
        metafield: { key: 'test_intensitet', namespace: 'custom' },
        values: ['Subtil', 'Medel', 'Kraftfull'],
    },
];

export const SpecificCollectionFilter = (values: string[]) => ({
    code: 'collection',
    name: 'Kollektion',
    metafield: { key: 'collection', namespace: 'custom' },
    values: values,
});


export const buildQueryFromFilter = (filters: CollectionFilter) => {
    return Object.entries(filters)
        .filter(([key, value]) => value.length > 0)
        .map(([key, value]) => `${key}=${encodeURIComponent(value.join(','))}`).join('&');
}

export const buildFilterFromQuery = (query: string) => {
    return Object.fromEntries(
        Object.entries(Object.fromEntries(new URLSearchParams(query)))
            .map(([key, value]) => [key, value.split(',')])
    );
}

export const buildGraphQLFilter = (filters: CollectionFilter) => {
    return Object.entries(filters).flatMap(([key, values]) => 
        values.map(value => ({
            productMetafield: {
                namespace: CollectionFilters.find(filter => filter.code === key)?.metafield.namespace as string,
                key: CollectionFilters.find(filter => filter.code === key)?.metafield.key as string,
                value: value,
            }
        }))
    );
};

export interface CollectionFilter {
    [key: string]: string[];
}