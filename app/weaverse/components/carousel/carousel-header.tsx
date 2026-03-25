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
import { forwardRef } from 'react';


type CarouselHeaderData = {
    gap: number
}

type CarouselHeaderProps = HydrogenComponentProps<
    Awaited<ReturnType<typeof loader>>
> &
    CarouselHeaderData

let CarouselHeader = forwardRef<HTMLElement, CarouselHeaderProps>((props, ref) => {
    let { children, gap, loaderData, ...rest } = props

    return (
        <div className='w-full flex flex-col' {...rest} style={{ gap: `${gap}px` }}>
            {children}
        </div>
    )
})

export let loader = async (args: ComponentLoaderArgs<CarouselHeaderData>) => {
    // Data fetching logic, the code will be run on the server-side ...
}

export let schema: HydrogenComponentSchema = {
    type: 'carousel-header',
    title: 'Carousel Header',
    childTypes: ['description', ''],
    inspector: [
        {
            group: 'Konfiguration',
            inputs: [

            ]
        },
        {
            group: 'Styling',
            inputs: [
                {
                    type: "range",
                    name: "gap",
                    label: "Items spacing",
                    configs: {
                        min: 0,
                        max: 60,
                        step: 4,
                        unit: "px",
                    },
                    defaultValue: 20,
                },
            ]
        }
    ]
}

export default CarouselHeader;