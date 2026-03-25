export const PRODUCT_QUERY = `#graphql
    query Product($handle: String!) {
        product(handle: $handle) {
            id
            title
            handle
            availableForSale
            variants(first: 1) {
                nodes {
                    id
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
            metafield(namespace: "custom", key: "test_tags") {
                value
            }
        }
    }
`

export const MULTIPLE_PRODUCTS_BY_ID_QUERY = `#graphql
    query MultipleProductsById(
        $ids: [ID!]!,
        $country: CountryCode,
        $language: LanguageCode
    ) @inContext(country: $country, language: $language) {
        nodes(ids: $ids) {
            ... on Product {
                id
                title
                handle
                availableForSale
                variants(first: 1) {
                    nodes {
                        id
                        availableForSale
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
                }
                featuredImage {
                    url
                }
            }
        }
    }
`



export const FAMILY_QUERY = `#graphql
        query ProductsByFamily(
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
                        metafield(namespace: "custom", key: "test_tags") {
                            value
                        }
                        priceRange {
                            minVariantPrice {
                                amount
                                currencyCode
                            }
                        },
                        collections(first: 25) {
                            nodes {
                                title
                                metafield(namespace: "custom", key: "test_tags") {
                                    value
                                }
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