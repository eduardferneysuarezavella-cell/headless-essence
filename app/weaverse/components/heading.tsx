import { Link } from '@remix-run/react';
import { Image } from '@shopify/hydrogen';
import type {
    ComponentLoaderArgs,
    HydrogenComponentProps,
    HydrogenComponentSchema,
    WeaverseImage,
} from '@weaverse/hydrogen'
import { AlignLeft } from 'lucide-react';
import { forwardRef } from 'react'
import ExpandableDescription from '~/components/ExpandableDescription';

type HeadingData = {
    title: string;
    subtitle: string;
    text: string;
    justifyContent: string;
}

type HeadingProps = HydrogenComponentProps<
    Awaited<ReturnType<typeof loader>>
> &
    HeadingData

let Heading = forwardRef<HTMLElement, HeadingProps>((props, ref) => {
    let { title, subtitle, text, justifyContent, loaderData, ...rest } = props

    return (
        <div className='flex flex-col items-center w-full p-[15px]' style={{ justifyContent: justifyContent }}>
            {title && <h1 className='font-heading lg:text-3xl text-2xl lg:text-[40px] pt-8 px-5 pb-4'>{title}</h1>}

            <div className='flex md:flex-col flex-col-reverse'>
                {subtitle && <h2 className='font-heading font-medium text-2xl pt-8 px-5 pb-4 md:text-left text-center'>{subtitle}</h2>}

                {text && <div className='px-5 py-3 text-lg' dangerouslySetInnerHTML={{ __html: text }} />}
            </div>
        </div>
    )
})

export let loader = async (args: ComponentLoaderArgs<HeadingData>) => {
    // Data fetching logic, the code will be run on the server-side ...
}

export let schema: HydrogenComponentSchema = {
    type: 'heading',
    title: 'Heading',
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
                    name: 'subtitle',
                    type: 'textarea',
                    label: 'Subtitle',
                    defaultValue: 'En beskrivning här...',
                },
                {
                    name: 'text',
                    type: 'richtext',
                    label: 'Text',
                },
            ]
        },

        {
            group: 'Element',
            inputs: [
                {
                    name: 'justifyContent',
                    type: 'toggle-group',
                    label: 'Placera Element',
                    configs: {
                        options: [
                            { value: 'flex-start', label: 'Start' },
                            { value: 'center', label: 'Mitten' },
                            { value: 'flex-end', label: 'Slut' }
                        ]
                    },
                    defaultValue: 'flex-start',
                },
            ]
        }
    ]
}

export default Heading;