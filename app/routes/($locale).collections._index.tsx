import { useLoaderData, Link } from '@remix-run/react';
import { defer, type LoaderFunctionArgs } from '@shopify/remix-oxygen';
import { getPaginationVariables, Image } from '@shopify/hydrogen';
import type { CollectionFragment } from 'storefrontapi.generated';
import { PaginatedResourceSection } from '~/components/PaginatedResourceSection';
import ExpandableDescription from '~/components/ExpandableDescription';
import { useI18n } from '~/components/i18n-provider';
import { useTranslation } from '~/i18n/i18n';

export async function loader(args: LoaderFunctionArgs) {
    // Await the critical data required to render initial state of the page
    const criticalData = await loadCriticalData(args);

    return { ...criticalData }
}

async function loadCriticalData({ context, request }: LoaderFunctionArgs) {
    const paginationVariables = getPaginationVariables(request, {
        pageBy: 8,
    });

    const [{ collections }] = await Promise.all([
        context.storefront.query(COLLECTIONS_QUERY, {
            variables: paginationVariables,
        }),
    ]);

    return { collections };
}


export default function Collections() {
    const { t: _ } = useTranslation();
    const { collections } = useLoaderData<typeof loader>();

    return (
        <div className="collections max-w-[1440px] mx-auto">
            <div className='flex flex-col justify-center items-center'>
                <h1 className='font-heading font-medium text-3xl lg:text-[45px] uppercase pt-8 px-5 pb-4'>{_('collections.collections')}</h1>

                <p className='px-5 pb-6 text-lg text-center lg:max-w-[800px] max-w-full'>
                    {_('collections.collectionsDescription')}
                </p>
            </div>

            <PaginatedResourceSection
                page={1}
                connection={collections}
                resourcesClassName="grid gap-8 grid-cols-2 lg:grid-cols-4 px-5"
            >
                {({ node: collection, index }) => (
                    <CollectionItem
                        key={collection.id}
                        collection={collection}
                        index={index}
                    />
                )}
            </PaginatedResourceSection>
        </div>
    );
}

function CollectionItem({
    collection,
    index,
}: {
    collection: CollectionFragment;
    index: number;
}) {
    return (
        <Link
            className="collection-item"
            key={collection.id}
            to={`/collections/${collection.handle}`}
            prefetch="intent"
        >
            {collection?.image ? (
                <Image
                    alt={collection.image.altText || collection.title}
                    aspectRatio="1/1"
                    data={collection.image}
                    loading={index < 3 ? 'eager' : undefined}
                />
            ) : (
                <div className='w-full aspect-square bg-neutral-100' />
            )}

            <h5 className='font-heading text-lg uppercase mt-2'>{collection.title}</h5>
        </Link>
    );
}

const COLLECTIONS_QUERY = `#graphql
  fragment Collection on Collection {
    id
    title
    handle
    image {
      id
      url
      altText
      width
      height
    }
  }
  query StoreCollections(
    $country: CountryCode
    $endCursor: String
    $first: Int
    $language: LanguageCode
    $last: Int
    $startCursor: String
  ) @inContext(country: $country, language: $language) {
    collections(
      first: $first,
      last: $last,
      before: $startCursor,
      after: $endCursor
    ) {
      nodes {
        ...Collection
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
` as const;
