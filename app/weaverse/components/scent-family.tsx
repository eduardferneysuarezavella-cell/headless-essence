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
    title: string;
    image: WeaverseImage;
    family: string;
    description: string;
    product: WeaverseProduct;
}

type ScentFamilyComponentProps = HydrogenComponentProps<
    Awaited<ReturnType<typeof loader>>
> &
    ScentFamilyComponentData

let ScentFamilyComponent = forwardRef<HTMLDivElement, ScentFamilyComponentProps>((props, ref) => {
    let { loaderData, title, description, image, family, ...rest } = props

    return (
        <div ref={ref} {...rest} className='flex flex-col max-w-none p-[15px] h-full'>
            <div className='w-full flex flex-col justify-between h-full'>
                <div className='flex flex-col'>
                    <div className='overflow-hidden aspect-square w-full h-auto mb-4'>
                        <Link to={`/doftgrupper/${family}`}>
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

                    <Link to={`/doftgrupper/${family}`}>
                        <h3 className='font-heading lg:text-3xl text-2xl font-semibold'>{title}</h3>
                    </Link>

                    <p className='text-lg mt-2 h-[150px] my-4'>{description}</p>
                </div>

                <Link to={`/doftgrupper/${family}`} className='py-2 lg:py-3 border border-black transition-all leading-[24px] z-10 hover:bg-black hover:text-white w-full flex justify-center items-center mt-4'>
                    LÄS MER
                </Link>
            </div>
        </div>
    )
})

export let loader = async (args: ComponentLoaderArgs<ScentFamilyComponentData>) => {

    return null;
}


export let schema: HydrogenComponentSchema = {
    type: 'scent-family',
    title: 'Doftfamilj',
    inspector: [
        {
            group: 'Konfiguration',
            inputs: [
                {
                    name: 'family',
                    type: 'select',
                    label: 'Doftfamilj',
                    configs: {
                        options: ScentFamilies.map((family) => ({
                            value: family.handle,
                            label: family.name,
                        }))
                    }
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
                }
            ]
        },

    ]
}

export default ScentFamilyComponent;