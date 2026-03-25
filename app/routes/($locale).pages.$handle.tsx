import { defer, json, type LoaderFunctionArgs } from '@shopify/remix-oxygen';
import { useLoaderData, type MetaFunction } from '@remix-run/react';
import { WeaverseContent } from '~/weaverse';

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [{ title: `${data?.page?.title} | ESSNCE` }];
};

export async function loader(args: LoaderFunctionArgs) {
  if (!args.params.handle) {
    throw new Error('Missing page handle');
  }

  const [weaverseData, { page }] = await Promise.all([
    args.context.weaverse.loadPage({ type: 'PAGE' }),
    args.context.storefront.query(PAGE_QUERY, {
      variables: {
        handle: args.params.handle,
      }
    }),
  ]);

  if (!weaverseData?.page?.id) {
    throw new Response('Not Found - Weaverse', { status: 404 });
  }

  return json({
    weaverseData: weaverseData,
    page,
  });
}


export default function Page() {
  return (
    <div id='test' className='px-5 lg:px-8'>
      <WeaverseContent />
    </div>
  )
}

const PAGE_QUERY = `#graphql
  query Page(
    $language: LanguageCode,
    $country: CountryCode,
    $handle: String!
  )
  @inContext(language: $language, country: $country) {
    page(handle: $handle) {
      id
      title
      body
      seo {
        description
        title
      }
    }
  }
` as const;
