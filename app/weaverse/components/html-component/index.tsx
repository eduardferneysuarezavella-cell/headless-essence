import type {
    HydrogenComponentSchema,
} from '@weaverse/hydrogen';
import { forwardRef, useEffect, useRef } from 'react';
import { Section, sectionInspector, SectionProps } from '../atoms/Section';

type HTMLComponentProps = SectionProps &{
    content: string;
};

const HTMLComponent = forwardRef<
    HTMLElement,
    HTMLComponentProps
>((props, ref) => {
    let {
        content,
        ...rest
    } = props;

    const appendedRef = useRef<boolean>(false);

    useEffect(() => {
        const scriptEl = document.createRange().createContextualFragment(content);
        if (ref && 'current' in ref && !appendedRef.current) {
            ref.current?.append(scriptEl);

            appendedRef.current = true;
        }
    }, [content, ref, appendedRef])

    return (
        <Section ref={ref} {...rest} />
    );
});

export default HTMLComponent;

export let schema: HydrogenComponentSchema = {
    type: 'html-component',
    title: 'HTML component',
    toolbar: ['general-settings', ['duplicate', 'delete']],
    inspector: [
        ...sectionInspector,
        {
            group: 'Content',
            inputs: [
                {
                    name: 'content',
                    type: 'textarea',
                },
            ],
        },
    ],
    childTypes: ['heading-other', 'description'],
};