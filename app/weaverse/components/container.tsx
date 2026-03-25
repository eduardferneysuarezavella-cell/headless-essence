import { Image } from '@shopify/hydrogen';
import type {
    ComponentLoaderArgs,
    HydrogenComponentProps,
    HydrogenComponentSchema,
    WeaverseImage,
} from '@weaverse/hydrogen'
import clsx from 'clsx';
import React, { forwardRef } from 'react'

type ContainerComponentData = {
    maxWidth: 'full' | '1440px' | '1200px';
    reverseOnMobile: boolean;
    // More type definitions...
}

type ContainerComponentProps = HydrogenComponentProps<
    Awaited<ReturnType<typeof loader>>
> &
    ContainerComponentData

let ContainerComponent = forwardRef<HTMLElement, ContainerComponentProps>((props, ref) => {
    let { loaderData, children, maxWidth, reverseOnMobile, ...rest } = props

    return (
        <section
            ref={ref}
            {...rest}
            className={clsx(
                'flex lg:flex-row flex-col mx-auto w-full *:flex-1 gap-4 lg:gap-16 py-4 lg:py-16',
                reverseOnMobile ? 'lg:flex-row flex-col-reverse' : 'lg:flex-row flex-col',
                maxWidth === 'full' ? 'w-full' : maxWidth === '1440px' ? 'max-w-[1440px]' : 'max-w-[1200px]'
            )}
        >
            {children}
        </section>
    )
})

export let loader = async (args: ComponentLoaderArgs<ContainerComponentData>) => {
    // Data fetching logic, the code will be run on the server-side ...
}

export let schema: HydrogenComponentSchema = {
    type: 'container',
    title: 'Container',
    childTypes: ['video', 'image', 'heading', 'card', 'newsletter'],
    inspector: [
        {
            group: 'Konfiguration',
            inputs: [
                {
                    type: 'select',
                    label: 'Maximal bredd',
                    name: 'maxWidth',
                    configs: {
                        options: [
                            { label: 'Full bredd', value: 'full' },
                            { label: '1440px', value: '1440px' },
                            { label: '1200px', value: '1200px' },
                        ]
                    },
                    defaultValue: 'full'
                }
            ]
        },
        {
            group: 'Element',
            inputs: [
                {
                    name: 'reverseOnMobile',
                    type: 'switch',
                    label: 'Omvänd ordning på mobil',
                    defaultValue: false,
                }
            ]
        }

    ]
}

export default ContainerComponent;