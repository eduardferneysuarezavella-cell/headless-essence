import { Link } from '@remix-run/react';
import { Image, Video } from '@shopify/hydrogen';
import type {
    ComponentLoaderArgs,
    HydrogenComponentProps,
    HydrogenComponentSchema,
    WeaverseImage,
    WeaverseVideo,
} from '@weaverse/hydrogen'
import { forwardRef } from 'react'

type LinkSectionVideoData = {
    title: string;
    description: string;
    video: WeaverseVideo;
    buttonText: string;
    link: string;
}

type LinkSectionProps = HydrogenComponentProps<
    Awaited<ReturnType<typeof loader>>
> &
    LinkSectionVideoData

let LinkSectionVideo = forwardRef<HTMLElement, LinkSectionProps>((props, ref) => {
    let { title, description, video, buttonText, link, loaderData, ...rest } = props

    return (
        <section ref={ref} {...rest} className='flex lg:flex-row flex-col max-w-[1200px] mx-auto pt-[50px] pb-[30px] relative'>
            <div className='h-auto lg:w-1/2 w-full overflow-hidden object-cover lg:p-[15px] relative'>
                {video && video.url && (
                    <Link to={link}>
                        <video
                            src={video.url}
                            loop
                            muted
                            autoPlay
                            playsInline
                            className="w-full h-full object-cover"
                        >
                            Din webbläsare stödjer inte videor tyvärr.
                        </video>
                    </Link>
                )}
            </div>

            <div className='lg:hidden block'>
                <Link to={link} className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white border border-black text-black hover:bg-black hover:text-white px-6 py-2 uppercase transition-all'>
                    {buttonText}
                </Link>
            </div>

            <div className='hidden lg:flex flex-col justify-center w-1/2 p-[15px] '>
                <Link to={link}>
                    <h2 className='font-heading text-[44px] font-semibold leading-snug'>{title}</h2>
                </Link>

                <p className='mb-4 lg:text-lg'>
                    {description}
                </p>

                <div className='flex items-center gap-5'>
                    <Link to={link} className='py-3 bg-white border border-black text-black hover:bg-black hover:text-white px-4 md:px-6 transition-all uppercase'>
                        {buttonText}
                    </Link>
                </div>
            </div>
        </section>
    )
})

export let loader = async (args: ComponentLoaderArgs<LinkSectionVideoData>) => {
    // Data fetching logic, the code will be run on the server-side ...
}

export let schema: HydrogenComponentSchema = {
    type: 'link-section-video',
    title: 'Video Link Section',
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
                    type: 'text',
                    label: 'Beskrivning',
                    defaultValue: 'En beskrivning här...',
                },
                {
                    name: 'video',
                    type: 'video',
                    label: 'Video',
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

export default LinkSectionVideo;