import { Image } from '@shopify/hydrogen';
import type {
    ComponentLoaderArgs,
    HydrogenComponentProps,
    HydrogenComponentSchema,
    WeaverseImage,
} from '@weaverse/hydrogen'
import clsx from 'clsx';
import React, { forwardRef } from 'react'

type HomeGridComponentData = {
    mobileColumns: number;
    tabletColumns: number;
    desktopColumns: number;
}

type HomeGridComponentProps = HydrogenComponentProps<
    Awaited<ReturnType<typeof loader>>
> &
    HomeGridComponentData


let HomeGridComponent = forwardRef<HTMLElement, HomeGridComponentProps>((props, ref) => {
    let { loaderData, children, mobileColumns = 2, tabletColumns = 3, desktopColumns = 5, ...rest } = props
    const visibleChildren = React.Children.count(children)

    let itemsPerRowClassesMobile: { [item: number]: string } = {
        1: 'grid-cols-1',
        2: 'grid-cols-2',
        3: 'grid-cols-3',
        4: 'grid-cols-4',
    };
    
    let itemsPerRowClassesTablet: { [item: number]: string } = {
        1: 'md:grid-cols-1',
        2: 'md:grid-cols-2',
        3: 'md:grid-cols-3',
        4: 'md:grid-cols-4',
        5: 'md:grid-cols-5',
    };
    
    let itemsPerRowClassesDesktop: { [item: number]: string } = {
        1: 'xl:grid-cols-1',
        2: 'xl:grid-cols-2',
        3: 'xl:grid-cols-3',
        4: 'xl:grid-cols-4',
        5: 'xl:grid-cols-5',
        6: 'xl:grid-cols-6',
    };

    return (
        <section
            ref={ref}
            {...rest}
            className={clsx(
                `grid max-w-[1200px] mx-auto`,
                'gap-0 pt-5 lg:pt-8 px-[7.5px] lg:px-0',
                itemsPerRowClassesMobile[mobileColumns],
                itemsPerRowClassesTablet[tabletColumns],
                itemsPerRowClassesDesktop[desktopColumns]
            )}
        >
            {children}
        </section>
    )
})

export let loader = async (args: ComponentLoaderArgs<HomeGridComponentData>) => {
    // Data fetching logic, the code will be run on the server-side ...
}

export let schema: HydrogenComponentSchema = {
    type: 'home-grid',
    title: 'Homepage - Grid',
    childTypes: ['home-grid-item'],
    inspector: [
        {
            group: 'Konfiguration',
            inputs: [
                {
                    type: 'range',
                    name: 'mobileColumns',
                    label: 'Kolumner på mobil',
                    configs: {
                        min: 1,
                        max: 4,
                        step: 1,
                        unit: ''
                    },
                    defaultValue: 2
                },
                {
                    type: 'range',
                    name: 'tabletColumns',
                    label: 'Kolumner på tablet',
                    configs: {
                        min: 2,
                        max: 5,
                        step: 1,
                        unit: ''
                    },
                    defaultValue: 3
                },
                {
                    type: 'range',
                    name: 'desktopColumns',
                    label: 'Kolumner på desktop',
                    configs: {
                        min: 3,
                        max: 6,
                        step: 1,
                        unit: ''
                    },
                    defaultValue: 5
                }
            ]
        }
    ]
}

export default HomeGridComponent;