import { Link } from '@remix-run/react';
import { Image } from '@shopify/hydrogen';
import type {
    ComponentLoaderArgs,
    HydrogenComponentProps,
    HydrogenComponentSchema,
    WeaverseImage,
} from '@weaverse/hydrogen'
import { forwardRef } from 'react'
import { cn } from '~/lib/utils';

type HomeGridComponentData = {
    title: string;
    image: WeaverseImage;
    link: string;
    titleUnderImage: boolean;
    hideOnMobile: boolean;
    hideOnTablet: boolean;
    hideOnDesktop: boolean;
    // More type definitions...
}

type HomeGridComponentProps = HydrogenComponentProps<
    Awaited<ReturnType<typeof loader>>
> &
    HomeGridComponentData

let HomeGridComponent = forwardRef<HTMLDivElement, HomeGridComponentProps>((props, ref) => {
    let {
        loaderData,
        title,
        image,
        link,
        titleUnderImage,
        hideOnMobile,
        hideOnTablet,
        hideOnDesktop,
        ...rest
    } = props

    const responsiveClasses = cn(
        'p-[7.5px]! md:p-[15px] flex relative w-full',
        {
            'hidden md:flex': hideOnMobile,
            'md:hidden xl:flex': hideOnTablet,
            'xl:hidden': hideOnDesktop
        }
    );

    return (
        <div
            ref={ref}
            {...rest}
            className={responsiveClasses}
        >
            <div className='w-full relative'>
                <div className='aspect-square overflow-hidden object-center '>
                    {image && (
                        <Link to={link}>
                            <Image
                                src={image.url}
                                alt={image.altText}
                                width={image.width}
                                height={image.height}
                                loading='eager'
                                className='w-full object-cover overflow-hidden aspect-square object-[50%_50%] h-full'
                            />
                        </Link>
                    )}
                </div>

                {titleUnderImage ? (
                    <h2 className='text-center lg:text-xl px-5 py-2 uppercase'>{title}</h2>
                ) : (
                    <div className='absolute bottom-0 left-0 w-full flex justify-center items-center'>
                        <Link to={link} className='table bg-white mx-auto w-auto mt-[-75px] pt-2 pb-2 px-[10px] md:px-[20px] xl:px-[30px] transition-all leading-[24px] text-sm z-10 border-black border hover:bg-black hover:text-white'>
                            {title}
                        </Link>
                    </div>
                )}
            </div>
        </div>
    )
})

export let loader = async (args: ComponentLoaderArgs<HomeGridComponentData>) => {
    // Data fetching logic, the code will be run on the server-side ...
}

export let schema: HydrogenComponentSchema = {
    type: 'home-grid-item',
    title: 'Grid Object',
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
                    name: 'image',
                    type: 'image',
                    label: 'Bild',
                },
                {
                    name: 'link',
                    type: 'url',
                    label: 'Länk',
                },
                {
                    name: 'titleUnderImage',
                    type: 'switch',
                    label: 'Titel under bild',
                    defaultValue: false,
                }
            ]
        },
        {
            group: 'Responsive',
            inputs: [
                {
                    name: 'hideOnMobile',
                    type: 'switch',
                    label: 'Dölj på mobil',
                    defaultValue: false,
                },
                {
                    name: 'hideOnTablet',
                    type: 'switch',
                    label: 'Dölj på tablet',
                    defaultValue: false,
                },
                {
                    name: 'hideOnDesktop',
                    type: 'switch',
                    label: 'Dölj på desktop',
                    defaultValue: false,
                }
            ]
        }
    ]
}

export default HomeGridComponent;