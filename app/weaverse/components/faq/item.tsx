import type {
    HydrogenComponentProps,
    HydrogenComponentSchema,
} from '@weaverse/hydrogen';
import { forwardRef, useRef, useState } from 'react';
import React from 'react';
import clsx from 'clsx';
import { cn } from '~/lib/utils';

interface FAQItemProps extends HydrogenComponentProps {
    question: string;
    answer: string;
}

const FAQItem = forwardRef<HTMLDivElement, FAQItemProps>((props, ref) => {
    let {
        question,
        answer,
        ...rest
    } = props;

    const contentRef = useRef<HTMLDivElement>(null);
    const [open, setOpen] = useState<boolean>(false);

    return (
        <div
            ref={ref}
            {...rest}
            className={clsx('flex flex-col items-center w-full')}
        >
            <div
                className='flex items-center gap-4 px-4 py-2 border-x border-t border-black font-heading w-full cursor-pointer select-none'
                onClick={() => setOpen(!open)}
            >
                <span className={cn('text-xl transition-transform duration-300 origin-center', open ? 'rotate-90' : 'rotate-0')}>{">"}</span>

                <h3 className="text-xl uppercase font-heading">{question}</h3>
            </div>

            <div
                ref={contentRef}
                style={{
                    maxHeight: open ? contentRef.current?.scrollHeight : 0,
                }}
                className={cn('overflow-hidden transition-all duration-300 border border-black w-full')}
            >
                <p className='p-4 text-lg'>{answer}</p>
            </div>
        </div>
    );
});

export default FAQItem;

export let schema: HydrogenComponentSchema = {
    type: 'faq-item',
    title: 'FAQ Item',
    toolbar: ['general-settings', ['duplicate', 'delete']],
    inspector: [
        {
            group: 'FAQ Item',
            inputs: [
                {
                    type: 'text',
                    label: 'Fråga',
                    name: 'question',
                },
                {
                    type: 'textarea',
                    label: 'Svar',
                    name: 'answer',
                },
            ],
        },
    ],
};