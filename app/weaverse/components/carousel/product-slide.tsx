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
import { ProductPrice } from '~/components/ProductPrice';
import { PRODUCT_QUERY } from '~/graphql/products/ProductQueries';
import { useTranslation } from '~/i18n/i18n';

type ProductSlideData = {
    title: string;
    image: WeaverseImage;
    description: string;
    product: WeaverseProduct;
    soldOut: string;
}

type ProductSlideProps = HydrogenComponentProps<
    Awaited<ReturnType<typeof loader>>
> &
    ProductSlideData

let ProductSlide = forwardRef<HTMLDivElement, ProductSlideProps>((props, ref) => {
    let { loaderData, title, description, image, loaderData: { product }, soldOut, ...rest } = props

    if (!product) return null;

    return (
        <div ref={ref} {...rest} className='flex flex-col items-center p-2 w-full'>
            <div className='w-full relative'>
                <Link to={`/products/${rest.product.handle}`} className="block">
                    {image && (
                        <Image
                            src={image.url}
                            alt={image.altText}
                            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                            className='w-full object-cover object-center aspect-square'
                        />
                    )}
                </Link>

                <div className='flex flex-col items-center gap-2 mt-4'>
                    <Link to={`/products/${rest.product.handle}`}>
                        <h3 className='font-heading text-base lg:text-lg font-medium text-center'>{title}</h3>
                    </Link>

                    {description && (
                        <p className='text-sm lg:text-base line-clamp-4 text-center'>
                            {description}
                        </p>
                    )}

                    <ProductPrice price={product.variants.nodes[0].price} className='text-base lg:text-lg text-center' />

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
                className='w-full max-w-[200px] py-2 px-4 border-black border hover:bg-black hover:text-white transition-all uppercase text-sm lg:text-base h-[40px] flex items-center justify-center disabled:opacity-50 disabled:pointer-events-none'
                disabled={fetcher.state !== 'idle' || !product.availableForSale}
            >
                {fetcher.state !== 'idle' ? <Loader2 className='size-4' /> : product.availableForSale ? t('product.card.purchase.addToCart') : t(soldOut)}
            </button>
        </>
    )
}

export let loader = async (args: ComponentLoaderArgs<ProductSlideData>) => {
    if (args.data.product) {
        return await args.weaverse.storefront.query(PRODUCT_QUERY, {
            variables: {
                handle: args.data.product.handle,
            },
        });

    }

    return { product: null };
}


export let schema: HydrogenComponentSchema = {
    type: 'product-slide',
    title: 'Produktvy',
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

export default ProductSlide;