import { Link } from '@remix-run/react';
import { Image } from '@shopify/hydrogen';
import type {
    ComponentLoaderArgs,
    HydrogenComponentProps,
    HydrogenComponentSchema,
    WeaverseImage,
} from '@weaverse/hydrogen'
import { forwardRef } from 'react'
import { Section, sectionInspector, SectionProps } from '../atoms/Section';

type NewsComponentsData = SectionProps & {

}

type NewsComponentsProps = HydrogenComponentProps<
    Awaited<ReturnType<typeof loader>>
> &
    NewsComponentsData

let NewsComponents = forwardRef<HTMLElement, NewsComponentsProps>((props, ref) => {
    let { loaderData, children, ...rest } = props

    return (
        <Section ref={ref} {...rest}>
            {children}
        </Section>
    )
})

export let loader = async (args: ComponentLoaderArgs<NewsComponentsData>) => {
    // Data fetching logic, the code will be run on the server-side ...
}

export let schema: HydrogenComponentSchema = {
    type: 'carousel',
    title: 'Carousel',
    childTypes: ['carousel-header'],
    inspector: sectionInspector
}

export default NewsComponents;