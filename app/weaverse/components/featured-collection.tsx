import { Link } from '@remix-run/react';
import { Image } from '@shopify/hydrogen';
import type {
    ComponentLoaderArgs,
    HydrogenComponentProps,
    HydrogenComponentSchema,
    WeaverseImage,
} from '@weaverse/hydrogen'
import { forwardRef } from 'react'

type FeaturedCollectionData = {
    buttonText: string;
    image: WeaverseImage;
    mobileImage: WeaverseImage;
    link: string;
}

type FeaturedCollectionProps = HydrogenComponentProps<
    Awaited<ReturnType<typeof loader>>
> &
    FeaturedCollectionData

let FeaturedCollection = forwardRef<HTMLElement, FeaturedCollectionProps>((props, ref) => {
    let { loaderData, buttonText, image, link, mobileImage, ...rest } = props

    return (
        <section className='mb-[30px] max-w-[1200px] mx-auto p-[15px]'>
            <Link to={link}>
                <Image
                    src={image.url}
                    alt={image.altText}
                    width={image.width}
                    height={image.height}
                    className='w-full object-cover object-center h-auto align-middle hidden md:block'
                    sizes="(min-width: 1024px) 1200px, 100vw"
                />

                {mobileImage && (
                    <Image
                        src={mobileImage.url}
                        alt={mobileImage.altText}
                        width={mobileImage.width}
                        height={mobileImage.height}
                        className='w-full object-cover object-center h-full align-middle block md:hidden'
                        sizes="100vw"
                    />
                )}


                <div className='flex justify-center items-center w-full mt-[30px]'>
                    <button className='bg-black text-white py-3 px-[30px]'>
                        {buttonText}
                    </button>
                </div>
            </Link>
        </section>
    )
})

export let loader = async (args: ComponentLoaderArgs<FeaturedCollectionData>) => {
    // Data fetching logic, the code will be run on the server-side ...
}

export let schema: HydrogenComponentSchema = {
    type: 'featured-collection',
    title: 'Featured',
    inspector: [
        {
            group: 'Bild',
            inputs: [
                {
                    name: 'image',
                    type: 'image',
                    label: 'Bild'
                },
                {
                    name: 'mobileImage',
                    type: 'image',
                    label: 'Mobilbild'
                }
            ]
        },
        {
            group: 'Konfiguration',
            inputs: [
                {
                    name: 'buttonText',
                    type: 'text',
                    label: 'Knapptext',
                },
                {
                    name: 'link',
                    type: 'url',
                    label: 'Länk'
                }
            ]
        },

    ]
}

export default FeaturedCollection;