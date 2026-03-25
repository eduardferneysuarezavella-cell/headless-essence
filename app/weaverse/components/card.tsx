import { Link } from '@remix-run/react';
import { Image } from '@shopify/hydrogen';
import type {
    ComponentLoaderArgs,
    HydrogenComponentProps,
    HydrogenComponentSchema,
    WeaverseImage,
} from '@weaverse/hydrogen'
import { forwardRef } from 'react'
import ExpandableDescription from '~/components/ExpandableDescription';

type CardData = {
    title: string;
    image: WeaverseImage;
    rotation: number;
}

type CardProps = HydrogenComponentProps<
    Awaited<ReturnType<typeof loader>>
> &
    CardData

let Card = forwardRef<HTMLDivElement, CardProps>((props, ref) => {
    let { title, image, rotation, loaderData, ...rest } = props

    return (
        <div ref={ref} className='w-full flex justify-center items-center h-full py-16'>
            <div className='flex flex-col items-center w-max p-[15px] lg:p-8 bg-[#d8d8d8] shadow-md md:max-w-[500px] max-w-[70vw]' style={{ transform: `rotate(${rotation}deg)` }}>

                <div className='w-full aspect-square'>
                    {image && (
                        <Image
                            src={image.url}
                            alt={image.altText}
                            width={image.width}
                            height={image.height}
                            sizes="(min-width: 500px) 500px, 80vw"
                            className='w-full h-full aspect-square object-cover'
                        />
                    )}
                </div>

                {title && (
                    <h1
                        style={{ fontFamily: 'Waiting for the Sunrise' }}
                        className='font-heading text-2xl px-[15px] pt-6 lg:block hidden'
                    >
                        {title}
                    </h1>
                )}
            </div>
        </div>
    )
})

export let loader = async (args: ComponentLoaderArgs<CardData>) => {
}

export let schema: HydrogenComponentSchema = {
    type: 'card',
    title: 'Card',
    inspector: [
        {
            group: 'Konfiguration',
            inputs: [
                {
                    name: 'title',
                    type: 'text',
                    label: 'Title',
                    defaultValue: 'En titel här...',
                },
                {
                    name: 'image',
                    type: 'image',
                    label: 'Image',
                },
                {
                    name: 'rotation',
                    type: 'range',
                    label: 'Rotation',
                    configs: {
                        min: 0,
                        max: 360,
                        step: 1,
                        unit: '°',
                    },
                    defaultValue: 0,
                }
            ]
        },

    ]
}

export default Card;