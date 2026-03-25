// NOTE: https://shopify.dev/docs/api/customer/latest/objects/Customer
export const CUSTOMER_FRAGMENT = `#graphql
  fragment Customer on Customer {
    id
    firstName
    lastName
    emailAddress {
      emailAddress
    } 
    defaultAddress {
      ...Address
    }
    addresses(first: 6) {
      nodes {
        ...Address
      }
    }
    orders(first: 6) {
      nodes {
        ...CustomerOrder
      }
    }
  }
  fragment Address on CustomerAddress {
    id
    formatted
    firstName
    lastName
    company
    address1
    address2
    territoryCode
    zoneCode
    city
    zip
    phoneNumber
  }
  fragment CustomerOrder on Order {
    id
    confirmationNumber
    processedAt
    fulfillments(first: 6) {
      nodes {
        id
        createdAt
        status
      }
    }
    totalPrice {
      amount
      currencyCode
    }
  }
` as const;

// NOTE: https://shopify.dev/docs/api/customer/latest/queries/customer
export const CUSTOMER_DETAILS_QUERY = `#graphql
  query CustomerDetails {
    customer {
      ...Customer
    }
  }
  ${CUSTOMER_FRAGMENT}
` as const;
