import { defer, type LoaderFunctionArgs } from '@shopify/remix-oxygen';
import { Link, useLoaderData, type MetaFunction } from '@remix-run/react';
import { Image } from '@shopify/hydrogen';
import { useI18n } from '~/components/i18n-provider';
import { useTranslation } from '~/i18n/i18n';

export const meta: MetaFunction<typeof loader> = ({ data }) => {
    return [{ title: `${data?.article.title ?? ''} | ESSNCE` }];
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
async function loadCriticalData({ context, params }: LoaderFunctionArgs) {
    const { blogHandle, articleHandle } = params;

    if (!articleHandle || !blogHandle) {
        throw new Response('Not found', { status: 404 });
    }

    const [{ blog }] = await Promise.all([
        context.storefront.query(ARTICLE_QUERY, {
            variables: { blogHandle, articleHandle },
        }),
        // Add other queries here, so that they are loaded in parallel
    ]);

    if (!blog?.articleByHandle) {
        throw new Response(null, { status: 404 });
    }

    const article = blog.articleByHandle;

    return { article, blogHandle };
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({ context }: LoaderFunctionArgs) {
    return {};
}

export default function Article() {
    const { t: _ } = useTranslation();
    const { article, blogHandle } = useLoaderData<typeof loader>();
    const { title, image, contentHtml, author } = article;

    const publishedDate = new Date(article.publishedAt).toLocaleDateString('en-US', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    }).replace(/(\d+)\s+([A-Za-z]+)\s+(\d+)/, '$1 $2 $3').toUpperCase();

    const nowReadingFull = _('blog.nowReading', { title: title });
    const nowReadingTruncated = _('blog.nowReading', { title: title.substring(0, 16) + (title.length > 16 ? '...' : '') });

    return (
        <div className="">
            <div className='sticky top-0 bg-black md:px-12 px-5 font-heading '>
                <div className='flex justify-between items-center gap-2 h-[33px] translate-y-px'>
                    <p className='text-white uppercase lg:block hidden'>{nowReadingFull}</p>
                    <p className='text-white uppercase lg:hidden text-sm'>{nowReadingTruncated}</p>
                    <p className='text-white uppercase lg:text-base text-sm'>
                        <Link to={`/blogs/${blogHandle}`}>{_('blog.allPosts')}</Link> &gt; {article.tags?.join(', ')}
                    </p>
                </div>
            </div>

            <div className='px-5 lg:px-12 pb-4 lg:pb-6 pt-1'>
                <h3 className='uppercase font-heading'>
                    <Link to={`/blogs/${blogHandle}`}>{_('blog.allPosts')}</Link> &gt; {article.tags?.join(', ')}
                </h3>
            </div>

            {image && <Image data={image} sizes="90vw" loading="eager" className='h-[20vh] lg:h-[45vh] w-full object-cover' />}

            <div className='flex flex-col lg:items-center gap-2 font-heading lg:py-16 p-4 lg:text-center'>
                <h2 className='uopercase text-sm lg:text-xl'>
                    <span className='lg:hidden'>{_('blog.journal')} &gt; </span>
                    {article.tags.join(", ")}
                </h2>

                <h1 className='text-3xl font-medium'>{title}</h1>

                <span className='lg:text-sm uppercase'>{publishedDate}</span>
            </div>

            <div className='flex flex-col justify-center items-center px-4 lg:px-8'>
                <div
                    dangerouslySetInnerHTML={{ __html: contentHtml }}
                    className="article text-lg"
                />
            </div>
        </div>
    );
}

// NOTE: https://shopify.dev/docs/api/storefront/latest/objects/blog#field-blog-articlebyhandle
const ARTICLE_QUERY = `#graphql
  query Article(
    $articleHandle: String!
    $blogHandle: String!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(language: $language, country: $country) {
    blog(handle: $blogHandle) {
      articleByHandle(handle: $articleHandle) {
        title
        contentHtml
        publishedAt
        author: authorV2 {
          name
        }
        tags
        image {
          id
          altText
          url
          width
          height
        }
        seo {
          description
          title
        }
      }
    }
  }
` as const;
