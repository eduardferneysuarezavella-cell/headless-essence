import { defer, type LoaderFunctionArgs } from '@shopify/remix-oxygen';
import { useLoaderData } from '@remix-run/react';
import { WeaverseContent } from '~/weaverse';

export async function loader(args: LoaderFunctionArgs) {
  const criticalData = await loadCriticalData(args);

  return defer({ ...criticalData });
}

async function loadCriticalData({ context, request, params }: LoaderFunctionArgs) {
  const url = new URL(request.url);

  const [page, { collection }] = await Promise.all([
    context.weaverse.loadPage({ type: 'INDEX' }),
    context.storefront.query(FEATURED_COLLECTION_QUERY),
  ]);

  return {
    weaverseData: page,
    bestsellers: collection,
    env: context.weaverse
  };
}

export default function Homepage() {
  const data = useLoaderData<typeof loader>();

  return (
    <div className=''>
      <WeaverseContent />
    </div>
  )
}

const FEATURED_COLLECTION_QUERY = `#graphql
  fragment FeaturedCollection on Collection {
    id
    title
    image {
      id
      url
      altText
      width
      height
    }
    handle
    products(first: 4) {
      nodes {
        ...RecommendedProduct
      }
    }
  }
  fragment RecommendedProduct on Product {
    id
    title
    handle
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    images(first: 1) {
      nodes {
        id
        url
        altText
        width
        height
      }
    }
  }
  query FeaturedCollection($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    collection(handle: "bestsellers") {
      ...FeaturedCollection
    }
  }
` as const;

