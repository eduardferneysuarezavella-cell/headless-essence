import { Link } from '@remix-run/react';
import { Image } from '@shopify/hydrogen';
import type {
    ComponentLoaderArgs,
    HydrogenComponentProps,
    HydrogenComponentSchema,
    WeaverseImage,
} from '@weaverse/hydrogen'
import { forwardRef } from 'react'

type LinkSectionData = {
    title: string;
    description: string;
    image: WeaverseImage;
    buttonText: string;
    link: string;
}

type LinkSectionProps = HydrogenComponentProps<
    Awaited<ReturnType<typeof loader>>
> &
    LinkSectionData

let LinkSection = forwardRef<HTMLElement, LinkSectionProps>((props, ref) => {
    let { title, description, image, buttonText, link, loaderData, ...rest } = props

    return (
        <section ref={ref} {...rest} className='flex lg:flex-row flex-col max-w-[1200px] mx-auto pb-[20px] pt-[30px]'>
            <div className='lg:w-1/2 w-full overflow-hidden object-cover lg:p-[15px] py-[15px]'>
                {image && (
                    <Image
                        src={image.url}
                        alt={image.altText}
                        width={image.width}
                        height={image.height}
                        className='lg:h-auto h-[170px] object-cover'
                    />
                )}
            </div>

            <div className='flex flex-col justify-center lg:items-start items-center lg:w-1/2 p-[15px]'>
                <h2 className='font-heading text-2xl lg:text-[45px] font-semibold leading-snug'>{title}</h2>

                <p className='my-4 lg:mb-4 lg:mt-0 lg:text-lg text-center lg:text-left'>
                    {description}
                </p>

                <div className='flex items-center lg:justify-start justify-center gap-5 w-full'>
                    <Link to={link} className='lg:py-3 py-2 bg-white border border-black text-black hover:bg-black hover:text-white px-4 md:px-6 uppercase transition-all'>
                        {buttonText}
                    </Link>
                </div>
            </div>
        </section>
    )
})

export let loader = async (args: ComponentLoaderArgs<LinkSectionData>) => {
    // Data fetching logic, the code will be run on the server-side ...
}

export let schema: HydrogenComponentSchema = {
    type: 'link-section',
    title: 'Link Section',
    inspector: [
        {
            group: 'Konfiguration',
            inputs: [
                {
                    name: 'title',
                    type: 'text',
                    label: 'Titel',
                    defaultValue: 'En titel här...',
                },
                {
                    name: 'description',
                    type: 'richtext',
                    label: 'Beskrivning',
                    defaultValue: 'En beskrivning här...',
                },
                {
                    name: 'image',
                    type: 'image',
                    label: 'Bild',
                    defaultValue: '/22f3e52546f2bd8dceeb2a4ef282715a.png',
                },
                {
                    name: 'buttonText',
                    type: 'text',
                    label: 'Knapp text',
                    defaultValue: 'Denna knapp går att trycka på.',
                },
                {
                    name: 'link',
                    type: 'text',
                    label: 'Länk',
                    defaultValue: '/',
                },
            ]
        },

    ]
}

export default LinkSection;