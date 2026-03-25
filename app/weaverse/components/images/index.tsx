import type {
    HydrogenComponentSchema,
} from '@weaverse/hydrogen';
import { forwardRef } from 'react';
import { Section, sectionInspector, SectionProps } from '../atoms/Section';

type HighlightsProps = SectionProps;

const Highlights = forwardRef<
    HTMLElement,
    HighlightsProps
>((props, ref) => {
    let {
        children,
        ...rest
    } = props;

    return (
        <Section ref={ref} {...rest}>
            {children}
        </Section>
    );
});

export default Highlights;

export let schema: HydrogenComponentSchema = {
    type: 'highlight',
    title: 'Highlights',
    toolbar: ['general-settings', ['duplicate', 'delete']],
    inspector: sectionInspector,
    childTypes: ['heading-other', 'highlight-content--item', 'description'],
    presets: {
        children: [
            {
                type: 'heading-other',
                content: 'Highlights',
            },
            {
                type: 'highlight-content--item',
            },
        ],
    },
};