import { defer, type LoaderFunctionArgs } from '@shopify/remix-oxygen';
import { Link, useLoaderData, type MetaFunction } from '@remix-run/react';
import { Image, getPaginationVariables } from '@shopify/hydrogen';
import type { ArticleItemFragment } from 'storefrontapi.generated';
import { PaginatedResourceSection } from '~/components/PaginatedResourceSection';
import ExpandableDescription from '~/components/ExpandableDescription';
import { useI18n } from '~/components/i18n-provider';
import { useTranslation } from '~/i18n/i18n';

export const meta: MetaFunction<typeof loader> = ({ data }) => {
    return [{ title: `${data?.blog.title ?? ''} | ESSNCE` }];
};

export async function loader(args: LoaderFunctionArgs) {
    // Start fetching non-critical data without blocking time to first byte
    const deferredData = loadDeferredData(args);

    // Await the critical data required to render initial state of the page
    const criticalData = await loadCriticalData(args);

    return defer({ ...deferredData, ...criticalData });
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 */
async function loadCriticalData({
    context,
    request,
    params,
}: LoaderFunctionArgs) {
    const paginationVariables = getPaginationVariables(request, {
        pageBy: 4,
    });

    if (!params.blogHandle) {
        throw new Response(`blog not found`, { status: 404 });
    }

    const [{ blog }] = await Promise.all([
        context.storefront.query(BLOGS_QUERY, {
            variables: {
                blogHandle: params.blogHandle,
                ...paginationVariables,
            },
        }),
    ]);

    if (!blog?.articles) {
        throw new Response('Not found', { status: 404 });
    }


    return { blog };
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({ context }: LoaderFunctionArgs) {
    return {};
}

export default function Blog() {
    const { blog } = useLoaderData<typeof loader>();
    const { articles } = blog;

    return (
        <div className="blog">
            <div className='flex flex-col justify-center items-center pb-8 lg:pb-20 pt-4'>
                <h1 className='font-heading lg:text-3xl text-2xl lg:text-[45px] uppercase pt-8 px-5 pb-4 lg:pb-8'>{blog.title}</h1>

                <ExpandableDescription wrapperClassName="px-5 py-6">
                    {blog.seo?.description}
                </ExpandableDescription>
            </div>

            <div className="max-w-[1440px] mx-auto lg:px-5">
                <PaginatedResourceSection connection={articles} resourcesClassName='grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-16' page={1}>
                    {({ node: article, index }) => (
                        <ArticleItem
                            article={article}
                            key={article.id}
                            loading={index < 2 ? 'eager' : 'lazy'}
                            large={index === 0}
                        />
                    )}
                </PaginatedResourceSection>
            </div>
        </div>
    );
}

function ArticleItem({
    article,
    loading,
    large
}: {
    article: ArticleItemFragment;
    loading?: HTMLImageElement['loading'];
    large?: boolean
}) {
    const { t: _ } = useTranslation();
    
    return (
        <div className={`article-blog ${large ? 'lg:col-span-3' : ''}`} key={article.id}>
            <Link to={`/blogs/${article.blog.handle}/${article.handle}`}>
                {article.image && (
                    <div className={`blog-article-image h-[20vh] lg:h-[25vh] w-full ${large ? 'lg:h-[40vh] w-full' : ''}`}>
                        <Image
                            alt={article.image.altText || article.title}
                            aspectRatio="3/2"
                            data={article.image}
                            loading={loading}
                            className={`object-cover h-[18vh]`}
                            sizes="(min-width: 768px) 33vw, 100vw"
                        />
                    </div>
                )}

                <div className='flex flex-col p-5 lg:px-0 lg:py-2'>
                    <div className={`lg:pt-2 pb-4 ${large ? 'lg:flex flex-col items-center' : ''}`}>
                        <div className={`font-heading ${large ? 'lg:text-center lg:w-full' : ''}`}>
                            <span className={`text-sm uppercase ${large ? 'lg:text-center lg:text-lg lg:py-2  ' : ''}`}>{article.tags?.length >= 1 ? article.tags.join(", ") : <br />}</span>
                            <h3 className={`text-xl font-medium ${large ? 'lg:text-3xl lg:text-center' : ''}`}>{article.title}</h3>
                        </div>

                        <p className={`text-sm mt-2 ${large ? 'lg:text-lg lg:text-center max-w-[500px]' : ''}`}>{article.excerpt}</p>
                    </div>

                    <button className='uppercase border border-black lg:px-12 px-6 h-[45px]  lg:text-base text-sm font-medium font-heading hover:bg-black hover:text-white transition-colors shadow-md mx-auto'>
                        {_('blog.readMore')}
                    </button>
                </div>
            </Link>
        </div>
    );
}

// NOTE: https://shopify.dev/docs/api/storefront/latest/objects/blog
const BLOGS_QUERY = `#graphql
  query Blog(
    $language: LanguageCode
    $blogHandle: String!
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
  ) @inContext(language: $language) {
    blog(handle: $blogHandle) {
      id
      title
      seo {
        title
        description
      }
      articles(
        first: $first,
        last: $last,
        before: $startCursor,
        after: $endCursor
      ) {
        nodes {
          ...ArticleItem
        }
        pageInfo {
          hasPreviousPage
          hasNextPage
          hasNextPage
          endCursor
          startCursor
        }

      }
    }
  }
  fragment ArticleItem on Article {
    author: authorV2 {
      name
    }
    contentHtml
    excerpt
    handle
    id
    tags
    image {
      id
      altText
      url
      width
      height
    }
    publishedAt
    title
    blog {
      handle
    }
  }
` as const;
