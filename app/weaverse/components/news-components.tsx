import { Link } from '@remix-run/react';
import { Image } from '@shopify/hydrogen';
import type {
    ComponentLoaderArgs,
    HydrogenComponentProps,
    HydrogenComponentSchema,
    WeaverseImage,
} from '@weaverse/hydrogen'
import { forwardRef } from 'react'

type NewsComponentsData = {
    title: string;
    buttonText: string;
    buttonLink: string;
}

type NewsComponentsProps = HydrogenComponentProps<
    Awaited<ReturnType<typeof loader>>
> &
    NewsComponentsData

let NewsComponents = forwardRef<HTMLElement, NewsComponentsProps>((props, ref) => {
    let { loaderData, title, buttonText, buttonLink, children } = props

    return (
        <section ref={ref} className='relative'>
            <div className='mx-auto max-w-[1200px] w-full'>
                <div className='flex justify-between items-center p-[15px]'>
                    <h2 className='font-heading lg:text-[45px] text-3xl font-semibold leading-[54px]'>{title}</h2>

                    {buttonText && buttonLink && (
                        <Link to={buttonLink} className='flex justify-center items-center bg-white border border-black text-black hover:bg-black hover:text-white px-4 md:px-6 py-2 uppercase transition-all'>
                            {buttonText}
                        </Link>
                    )}
                </div>

                <div>
                    <div className='flex flex-nowrap overflow-x-auto overflow-y-hidden scroll-smooth w-full' style={{ scrollSnapType: 'x mandatory', scrollPaddingLeft: '0px', scrollbarWidth: 'none' }}>
                        {children}
                    </div>
                </div>
            </div>
        </section>
    )
})

export let loader = async (args: ComponentLoaderArgs<NewsComponentsData>) => {
    // Data fetching logic, the code will be run on the server-side ...
}

export let schema: HydrogenComponentSchema = {
    type: 'news-components',
    title: 'New Products',
    childTypes: ['new-item'],
    inspector: [
        {
            group: 'Konfiguration',
            inputs: [
                {
                    name: 'title',
                    type: 'text',
                    label: 'Titel',
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
                }
            ]
        },

    ]
}

export default NewsComponents;