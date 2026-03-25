import { Link } from '@remix-run/react';
import { Image } from '@shopify/hydrogen';
import { Product } from '@shopify/hydrogen/storefront-api-types';
import type {
    ComponentLoaderArgs,
    HydrogenComponentProps,
    HydrogenComponentSchema,
    WeaverseImage,
    WeaverseProduct,
} from '@weaverse/hydrogen'
import { forwardRef, useRef, useState, useEffect } from 'react'
import { AddToCartButton } from '~/components/AddToCartButton';
import { useAside } from '~/components/Aside';
import { ArrowBackSVG } from '~/components/icons/ArrowBackSVG';
import { ProductPrice } from '~/components/ProductPrice';
import ScrollableList, { ScrollableGrid } from '~/components/ScrollableList';
import { MULTIPLE_PRODUCTS_BY_ID_QUERY } from '~/graphql/products/ProductQueries';
import { Section, sectionInspector, SectionProps } from './atoms/Section';
import { ProductItemFragment } from 'storefrontapi.generated';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '~/components/Carousel';
import { useTranslation } from '~/i18n/i18n';

type PopularComponentData = SectionProps & {
    title: string
    description: string
    buttonText: string
    buttonLink: string
    mobileAlignment: 'start' | 'center'
    desktopAlignment: 'start' | 'center'
    products: WeaverseProduct[]
}

type PopularComponentProps = HydrogenComponentProps<
    Awaited<ReturnType<typeof loader>>
> &
    PopularComponentData

let PopularComponent = forwardRef<HTMLElement, PopularComponentProps>((props, ref) => {
    let { title, description, buttonLink, buttonText, loaderData, mobileAlignment, desktopAlignment, ...rest } = props

    const { open } = useAside();
    const [isMobile, setMobile] = useState(false);
    const { t } = useTranslation();

    useEffect(() => {
        const handleResize = () => {
            setMobile(window.innerWidth < 768);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);


    return (
        <Section {...rest}>
            <div className='mx-auto max-w-[1200px] w-full px-4 sm:px-6 lg:px-8 py-4'>
                <div className='flex justify-between items-center'>
                    <h2 className='font-heading lg:text-[45px] text-3xl font-semibold leading-[54px]'>{title}</h2>

                    {buttonLink && buttonText && (
                        <Link to={buttonLink}>
                            <button className='bg-white border border-black text-black hover:bg-black hover:text-white w-full py-2 uppercase transition-all px-4'>
                                {buttonText}
                            </button>
                        </Link>
                    )}
                </div>

                {description && (
                    <p className='text-left text-lg my-4'>{description}</p>
                )}

                <Carousel className='w-full' opts={{ align: isMobile ? mobileAlignment : desktopAlignment }}>
                    <CarouselContent>
                        {loaderData?.products.map((product: any) => (
                            <CarouselItem key={product.id} className='basis-2/3 lg:basis-1/4'>
                                <Link to={`/products/${product.handle}`}>
                                    <Image
                                        src={product.featuredImage?.url ?? ''}
                                        alt={product.featuredImage?.altText ?? ''}
                                        width={product.featuredImage?.width ?? 0}
                                        height={product.featuredImage?.height ?? 0}
                                        sizes='100vw'
                                    />
                                </Link>

                                <div className="flex flex-col items-center gap-2 py-3 text-center ">
                                    <Link to={`/products/${product.handle}`}>
                                        <h3 className="font-heading text-lg lg:text-xl">{product.title}</h3>
                                    </Link>
                                    <ProductPrice price={product.priceRange.minVariantPrice} />
                                </div>

                                <AddToCartButton
                                    lines={[{ merchandiseId: product.variants.nodes[0].id, quantity: 1, selectedVariant: { ...product.variants.nodes[0], product: { handle: product.handle } } }]}
                                    onClick={() => open('cart')}
                                    buttonClassName='bg-white border border-black text-black hover:bg-black hover:text-white w-full py-2 uppercase transition-all disabled:bg-white disabled:opacity-50'
                                    disabled={!product.availableForSale}
                                >
                                    {product.availableForSale ? t('product.card.purchase.buy') : t('product.card.purchase.soldOut')}
                                </AddToCartButton>
                            </CarouselItem>
                        ))}
                    </CarouselContent>

                    <CarouselPrevious />
                    <CarouselNext />
                </Carousel>
            </div>
        </Section>
    )
})

export let loader = async (args: ComponentLoaderArgs<PopularComponentData>) => {
    const { products } = args.data

    if (!products) {
        return {
            products: []
        }
    }

    const ids = products?.map((product: any) => `gid://shopify/Product/${product.id}`)

    const data = await args.weaverse.storefront.query(MULTIPLE_PRODUCTS_BY_ID_QUERY, {
        variables: { ids }
    })


    return {
        products: data.nodes as ProductItemFragment[]
    }
}

export let schema: HydrogenComponentSchema = {
    type: 'popular-component',
    title: 'Popular Products',
    inspector: [
        ...sectionInspector,
        {
            group: 'Konfiguration',
            inputs: [
                {
                    name: 'title',
                    type: 'text',
                    label: 'Titel',
                },
                {
                    name: 'description',
                    type: 'richtext',
                    label: 'Beskrivning',
                },
                {
                    name: 'buttonText',
                    type: 'text',
                    label: 'Knapp text',
                },
                {
                    name: 'buttonLink',
                    type: 'url',
                    label: 'Knapp länk',
                },
                {
                    name: 'products',
                    type: 'product-list',
                    label: 'Produkter',
                },
                {
                    name: 'mobileAlignment',
                    type: 'select',
                    label: 'Mobil alignment',
                    defaultValue: 'start',
                    configs: {
                        options: [
                            { label: 'Start', value: 'start' },
                            { label: 'Center', value: 'center' },
                        ],
                    },
                },
                {
                    name: 'desktopAlignment',
                    type: 'select',
                    label: 'Desktop alignment',
                    defaultValue: 'start',
                    configs: {
                        options: [
                            { label: 'Start', value: 'start' },
                            { label: 'Center', value: 'center' },
                        ],
                    },
                },
            ]
        },

    ]
}

export default PopularComponent;