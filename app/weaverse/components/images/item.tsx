import type {
    HydrogenComponentProps,
    HydrogenComponentSchema,
} from '@weaverse/hydrogen';
import { forwardRef } from 'react';
import React from 'react';
import clsx from 'clsx';
import {Link} from '@remix-run/react';

interface HightlightProps extends HydrogenComponentProps {
    visibleOnMobile: boolean;
    scrollTo: string;
    link: string;
    behavior: 'scroll' | 'link';
}

const HighlightItem = forwardRef<HTMLElement, HightlightProps>((props, ref) => {
    let {
        visibleOnMobile,
        children,
        scrollTo,
        link,
        behavior,
        ...rest
    } = props;

    const scrollToPosition = () => {
        const element = document.getElementById(scrollTo);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    }

    const content = (
        <div
            {...rest}
            className={clsx('flex flex-col gap-4 items-center w-full cursor-pointer',
                !visibleOnMobile && 'hidden sm:flex',
            )}
        >
            {children}
        </div>
    );

    if (behavior === 'link' && link) {
        return (
            <Link to={link} ref={ref as React.Ref<HTMLAnchorElement>}>
                {content}
            </Link>
        );
    }

    return (
        <div ref={ref as React.Ref<HTMLDivElement>} onClick={scrollToPosition}>
            {content}
        </div>
    );
});

export default HighlightItem;

export let schema: HydrogenComponentSchema = {
    type: 'highlight--item',
    title: 'Highlight',
    limit: 8,
    toolbar: ['general-settings', ['duplicate', 'delete']],
    inspector: [
        {
            group: 'Highlight',
            inputs: [
                {
                    type: 'switch',
                    label: 'Visible on Mobile',
                    name: 'visibleOnMobile',
                    defaultValue: true,
                },
                {
                    type: 'select',
                    label: 'Behavior',
                    name: 'behavior',
                    defaultValue: 'scroll',
                    configs: {
                        options: [
                            { value: 'scroll', label: 'Skrolla till' },
                            { value: 'link', label: 'Länk till sida' }
                        ]
                    }
                },
                {
                    type: 'text',
                    label: 'Skrolla till sektion',
                    name: 'scrollTo',
                    placeholder: 'sektion-id',
                    condition: 'behavior.eq.scroll'
                },
                {
                    type: 'text',
                    label: 'Länk till sida',
                    placeholder: 'https://www.essence.se',
                    name: 'link',
                    condition: 'behavior.eq.link'
                }
            ],
        },
    ],
    childTypes: ['heading-other', 'image'],
};