import { Link } from '@remix-run/react';
import { Image } from '@shopify/hydrogen';
import type {
    ComponentLoaderArgs,
    HydrogenComponentProps,
    HydrogenComponentSchema,
    WeaverseImage,
} from '@weaverse/hydrogen'
import React from 'react';
import { forwardRef, useState, useEffect } from 'react'
import ScrollableList from '~/components/ScrollableList';

type GridComponentData = {
    title: string;
    buttonText: string;
    buttonLink: string;
}

type GridComponentProps = HydrogenComponentProps<
    Awaited<ReturnType<typeof loader>>
> &
    GridComponentData

let GridComponent = forwardRef<HTMLElement, GridComponentProps>((props, ref) => {
    let { loaderData, title, buttonText, buttonLink, children } = props

    const [columns, setColumns] = useState(4)

    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth
            if (width >= 1280) setColumns(4)      // xl breakpoint
            else if (width >= 1024) setColumns(3)  // lg breakpoint
            else if (width >= 768) setColumns(2)   // md breakpoint
            else setColumns(4)                     // mobile full width
        }

        handleResize()
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    const childrenArray = React.Children.toArray(children)
    const limitedChildren = childrenArray.slice(0, columns)

    return (
        <section ref={ref} className='py-5 relative pt-[30px]'>
            <div className='mx-auto max-w-[1200px] w-full'>
                <div className='flex justify-between items-center p-[15px]'>
                    <Link to={buttonLink}>
                        <h2 className='font-heading lg:text-[45px] text-3xl font-semibold leading-[54px]'>{title}</h2>
                    </Link>

                    {buttonText && buttonLink && (
                        <Link to={buttonLink} className='bg-white border border-black text-black hover:bg-black hover:text-white py-2 uppercase transition-all px-4 inline-block'>
                            {buttonText}
                        </Link>
                    )}
                </div>

                <div className='hidden md:grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2'>
                    {limitedChildren}
                </div>

                <div className='md:hidden'>
                    <ScrollableList items={limitedChildren} perPage={{ desktop: 4, mobile: 2 }}>
                        {(item) => (
                            <div className='w-full'>
                                {item}
                            </div>
                        )}
                    </ScrollableList>
                </div>
            </div>
        </section>
    )
})

export let loader = async (args: ComponentLoaderArgs<GridComponentData>) => {
    // Data fetching logic, the code will be run on the server-side ...
}

export let schema: HydrogenComponentSchema = {
    type: 'grid',
    title: 'Grid',
    childTypes: ['new-item', 'scent-family', 'team-recommendation'],
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

export default GridComponent;