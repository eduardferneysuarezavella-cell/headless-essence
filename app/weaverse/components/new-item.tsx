import { FetcherWithComponents, Link } from '@remix-run/react';
import { CartForm, Image } from '@shopify/hydrogen';
import { Product } from '@shopify/hydrogen/storefront-api-types';
import type {
    ComponentLoaderArgs,
    HydrogenComponentProps,
    HydrogenComponentSchema,
    WeaverseImage,
    WeaverseProduct,
} from '@weaverse/hydrogen'
import { Loader2 } from 'lucide-react';
import { forwardRef, useEffect } from 'react'
import { useAside } from '~/components/Aside';
import { PRODUCT_QUERY } from '~/graphql/products/ProductQueries';
import { useTranslation } from '~/i18n/i18n';
type HomeGridComponentData = {
    title: string;
    image: WeaverseImage;
    description: string;
    product: WeaverseProduct;
    soldOut: string;
}

type HomeGridComponentProps = HydrogenComponentProps<
    Awaited<ReturnType<typeof loader>>
> &
    HomeGridComponentData

let HomeGridComponent = forwardRef<HTMLDivElement, HomeGridComponentProps>((props, ref) => {
    let { loaderData, title, description, image, loaderData: { product }, soldOut, ...rest } = props

    return (
        <div ref={ref} {...rest} className='flex flex-col max-w-none items-center p-[15px] w-[85%] md:w-1/2 lg:w-1/3 shrink-0' style={{ scrollSnapStop: 'always', scrollSnapAlign: 'start' }}>
            <div className='w-full relative'>
                <Link to={`/products/${rest.product.handle}`}>
                    {image && (
                        <Image
                            src={image.url}
                            alt={image.altText}
                            sizes="(max-width: 768px) 80vw, (max-width: 1024px) 50vw, 33vw"
                            className='w-full object-cover object-center aspect-square h-auto align-middle inline-block overflow-hidden'
                        />
                    )}
                </Link>

                <div>
                    <Link to={`/products/${rest.product.handle}`}>
                        <h3 className='pt-4 pb-2 font-heading lg:text-3xl text-2xl font-medium'>{title}</h3>
                    </Link>

                    <p className='lg:text-lg text-base h-[80px]'>
                        {description}
                    </p>

                    <CartForm
                        route="/cart"
                        inputs={{ lines: [{ merchandiseId: product.variants.nodes[0].id, quantity: 1, selectedVariant: { ...product.variants.nodes[0], product: { handle: product.handle } } }] }}
                        action={CartForm.ACTIONS.LinesAdd}
                    >
                        {(fetcher: FetcherWithComponents<any>) => (
                            <AddToCartButton fetcher={fetcher} product={product} soldOut={soldOut} />
                        )}
                    </CartForm>
                </div>
            </div>
        </div>
    )
})

const AddToCartButton = ({ fetcher, product, soldOut = 'product.card.purchase.soldOut' }: { fetcher: FetcherWithComponents<any>, product: Product, soldOut: string }) => {
    const { open } = useAside();
    const { t } = useTranslation();
    useEffect(() => {
        if (fetcher.state === 'idle' && fetcher.data) {
            open('cart');
        }
    }, [fetcher.state]);

    return (
        <>
            <input
                name="analytics"
                type="hidden"
                value={JSON.stringify(undefined)}
            />

            <button
                type='submit'
                className='w-full py-2 border-black border hover:bg-black hover:text-white transition-all uppercase mt-4 h-[50px] flex items-center justify-center disabled:opacity-50 disabled:pointer-events-none'
                disabled={fetcher.state !== 'idle' || !product.availableForSale}
            >
                {fetcher.state !== 'idle' ? <Loader2 className='size-5 animate-spin' /> : product.availableForSale ? t('product.card.purchase.addToCart') : t(soldOut)}
            </button>
        </>
    )
}

export let loader = async (args: ComponentLoaderArgs<HomeGridComponentData>) => {
    if (args.data.product) {
        return await args.weaverse.storefront.query(PRODUCT_QUERY, {
            variables: {
                handle: args.data.product.handle,
            },
        });

    }

    return null;
}


export let schema: HydrogenComponentSchema = {
    type: 'new-item',
    title: 'Nyhet',
    inspector: [
        {
            group: 'Konfiguration',
            inputs: [
                {
                    name: 'product',
                    type: 'product',
                    label: 'Produkt',
                },
                {
                    name: 'image',
                    type: 'image',
                    label: 'Bild',
                },
                {
                    name: 'title',
                    type: 'text',
                    label: 'Titel',
                },
                {
                    name: 'description',
                    type: 'text',
                    label: 'Beskrivning',
                },
                {
                    name: 'soldOut',
                    helpText: 'När produkten inte är tillänglig att köpa, ifall om "slutsåld" eller "kommer snart" ska visas',
                    type: 'select',
                    configs: {
                        options: [
                            {
                                label: 'Slutsåld',
                                value: 'product.card.purchase.soldOut',
                            },
                            {
                                label: 'Kommer snart',
                                value: 'collections.upcoming',
                            }
                        ]
                    },
                    label: 'Slutsåld / Kommer snart',
                }
            ]
        },

    ]
}

export default HomeGridComponent;