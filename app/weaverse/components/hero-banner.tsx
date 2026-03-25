import { Link } from '@remix-run/react';
import { Image } from '@shopify/hydrogen';
import type {
    ComponentLoaderArgs,
    HydrogenComponentProps,
    HydrogenComponentSchema,
    WeaverseImage,
} from '@weaverse/hydrogen'
import { forwardRef } from 'react'

type MyComponentData = {
    image: WeaverseImage;
    imageMobile: WeaverseImage;
    link: string;
    showMobileButton: boolean;
    buttonText: string;
    // More type definitions...
}

type MyComponentProps = HydrogenComponentProps<
    Awaited<ReturnType<typeof loader>>
> &
    MyComponentData

let MyComponent = forwardRef<HTMLElement, MyComponentProps>((props, ref) => {
    let { image, imageMobile, link, showMobileButton, buttonText, loaderData, ...rest } = props

    const Component = link ? Link : 'div'

    return (
        <section ref={ref} {...rest} className='pb-2.5 relative max-w-[1440px] mx-auto'>
            <Component to={link}>
                {image && (
                    <Image
                        src={image.url}
                        alt={image.altText}
                        width={image.width}
                        height={image.height}
                        sizes='100vw'
                        className='md:block hidden'
                    />
                )}

                {imageMobile && (
                    <Image
                        src={imageMobile.url}
                        alt={imageMobile.altText}
                        width={imageMobile.width}
                        height={imageMobile.height}
                        sizes='100vw'
                        className='md:hidden object-cover'
                    />
                )}
            </Component>
            {showMobileButton && link && (
                <div className="absolute bottom-4 left-0 right-0 md:hidden">
                    <Link
                        to={link}
                        className="mx-auto block w-fit px-6 py-2 bg-white text-black font-medium transition-all leading-[24px] text-sm z-10 border-black border hover:bg-black hover:text-white"
                    >
                        {buttonText || 'Läs mer'}
                    </Link>
                   
                </div>
            )}
        </section>
    )
})

export let loader = async (args: ComponentLoaderArgs<MyComponentData>) => {
    // Data fetching logic, the code will be run on the server-side ...
}

export let schema: HydrogenComponentSchema = {
    type: 'hero',
    title: 'Hero',
    inspector: [
        {
            group: 'Konfiguration',
            inputs: [
                {
                    name: 'image',
                    type: 'image',
                    label: 'Huvudbild - dator'
                },
                {
                    name: 'imageMobile',
                    type: 'image',
                    label: 'Huvudbild - mobil'
                },
                {
                    name: 'link',
                    type: 'url',
                    label: 'Länk'
                },
                {
                    name: 'showMobileButton',
                    type: 'switch',
                    label: 'Visa knapp på mobil',
                    defaultValue: false
                },
                {
                    name: 'buttonText',
                    type: 'text',
                    label: 'Knapptext',
                    defaultValue: 'Läs mer',
                    condition: 'showMobileButton'
                }
            ]
        },
    ]
}

export default MyComponent;