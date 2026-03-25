import { FetcherWithComponents, Link } from '@remix-run/react';
import { CartForm, Image } from '@shopify/hydrogen';
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
import { ScentFamilies } from '~/data/scent-families';
import { PRODUCT_QUERY } from '~/graphql/products/ProductQueries';

type ScentFamilyComponentData = {
    name: string;
    image: WeaverseImage;
    product: WeaverseProduct;
    description: string;
}

type ScentFamilyComponentProps = HydrogenComponentProps<
    Awaited<ReturnType<typeof loader>>
> &
    ScentFamilyComponentData

let ScentFamilyComponent = forwardRef<HTMLDivElement, ScentFamilyComponentProps>((props, ref) => {
    let { loaderData, name, description, image, product, ...rest } = props

    return (
        <div ref={ref} {...rest} className='flex flex-col max-w-none items-center p-[15px]'>
            <div className='w-full relative'>
                <div className='overflow-hidden aspect-square w-full h-auto'>
                    <Link to={`/products/${product.handle}`} className=''>
                        {image && (
                            <div className="aspect-square relative">
                                <Image
                                    src={image.url}
                                    alt={image.altText}
                                    width={image.width}
                                    height={image.height}
                                    className='absolute inset-0 w-full h-full object-cover object-center'
                                />
                            </div>
                        )}
                    </Link>
                </div>

                <div className='w-full'>
                    <h3 className='pt-4 pb-2 font-heading lg:text-3xl text-2xl font-semibold'>{name}</h3>

                    <p className='text-lg lg:h-[200px] h-[180px]'>
                        {description}
                    </p>

                    <Link to={`/products/${product.handle}`} className='py-2 lg:py-3 border border-black transition-all leading-[24px] z-10 hover:bg-black hover:text-white w-full flex justify-center items-center'>
                        LÄS MER
                    </Link>
                </div>
            </div>
        </div>
    )
})

export let loader = async (args: ComponentLoaderArgs<ScentFamilyComponentData>) => {
    const product = await args.weaverse.storefront.query(PRODUCT_QUERY, {
        variables: {
            handle: args.data.product.handle
        }
    })
    return null;
}


export let schema: HydrogenComponentSchema = {
    type: 'team-recommendation',
    title: 'Teamrekommendation',
    inspector: [
        {
            group: 'Konfiguration',
            inputs: [
                {
                    name: 'image',
                    type: 'image',
                    label: 'Bild',
                },
                {
                    name: 'name',
                    type: 'text',
                    label: 'Namn',
                },
                {
                    name: 'product',
                    type: 'product',
                    label: 'Produkt',
                },
                {
                    name: 'description',
                    type: 'text',
                    label: 'Beskrivning',
                }
            ]
        },

    ]
}

export default ScentFamilyComponent;