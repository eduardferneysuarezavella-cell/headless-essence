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

type TitleData = {
    title: string;
    description: string;
    expandable: boolean;
}

type TitleProps = HydrogenComponentProps<
    Awaited<ReturnType<typeof loader>>
> &
    TitleData

let Title = forwardRef<HTMLElement, TitleProps>((props, ref) => {
    let { title, description, expandable, loaderData, ...rest } = props

    return (
        <div className='flex flex-col justify-center items-center'>
            <h1 className='font-heading font-medium text-3xl lg:text-[40px] uppercase pt-8 px-5 pb-4'>{title}</h1>

            <div className='px-5 py-3 max-w-[700px] text-center'>
                {description && (expandable ? (
                    <ExpandableDescription>
                        {description}
                    </ExpandableDescription>
                ) : (
                    <p className='text-lg'>
                        {description}
                    </p>
                ))}
            </div>
        </div>
    )
})

export let loader = async (args: ComponentLoaderArgs<TitleData>) => {
    // Data fetching logic, the code will be run on the server-side ...
}

export let schema: HydrogenComponentSchema = {
    type: 'title',
    title: 'Title',
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
                    name: 'description',
                    type: 'textarea',
                    label: 'Description',
                    defaultValue: 'En beskrivning här...',
                },
                {
                    name: 'expandable',
                    type: 'switch',
                    label: 'Beskrivning expanderbar',
                    defaultValue: false,
                },
            ]
        },

    ]
}

export default Title;