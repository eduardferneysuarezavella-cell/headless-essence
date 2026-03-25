import type {
    HydrogenComponentProps,
    HydrogenComponentSchema,
} from '@weaverse/hydrogen';
import type { VariantProps } from 'class-variance-authority';
import { cva } from 'class-variance-authority';
import { clsx } from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import { forwardRef, useEffect, useRef, useState } from 'react';
import { useI18n } from '~/components/i18n-provider';
import { ArrowBackSVG } from '~/components/icons/ArrowBackSVG';
import { useTranslation } from '~/i18n/i18n';
import { cn } from '~/lib/utils';

export interface ParagraphProps
    extends VariantProps<typeof variants>,
    Partial<HydrogenComponentProps> {
    as?: 'p' | 'div';
    content: string;
    color?: string;
    cutoffHeight?: number;
}

let variants = cva('paragraph', {
    variants: {
        textSize: {
            xs: 'text-xs',
            sm: 'text-sm',
            base: '',
            lg: 'text-lg',
            xl: 'text-xl',
            '2xl': 'text-2xl',
            '3xl': 'text-3xl',
            '4xl': 'text-4xl',
            '5xl': 'text-5xl',
            '6xl': 'text-6xl',
            '7xl': 'text-7xl',
            '8xl': 'text-8xl',
            '9xl': 'text-9xl',
        },
        width: {
            full: 'w-full mx-auto',
            narrow: 'w-full md:w-1/2 lg:w-3/4 max-w-4xl mx-auto',
        },
        alignment: {
            left: 'text-left',
            center: 'text-center',
            right: 'text-right',
        },
    },
    defaultVariants: {
        width: 'full',
        textSize: 'base',
    },
});

let ExpandableDescription = forwardRef<
    HTMLParagraphElement | HTMLDivElement,
    ParagraphProps
>((props, ref) => {
    let {
        as: Tag = 'p',
        width,
        content,
        textSize,
        color,
        alignment,
        className,
        cutoffHeight,
        ...rest
    } = props;

    /**
     * < Tag
        ref = { ref }
        {...rest}
    style = {{ color }}
    className = { clsx(variants({ textSize, width, alignment, className }))}
    suppressHydrationWarning
    dangerouslySetInnerHTML = {{ __html: content }}
            />
     */

    const { t: _ } = useTranslation();
    const descriptionRef = useRef<HTMLDivElement>(null);
    const [expanded, setExpanded] = useState<boolean>(false);
    const [descriptionHeight, setDescriptionHeight] = useState<string>('100px');

    useEffect(() => {
        if (descriptionRef.current) {
            const scrollHeight = descriptionRef.current.scrollHeight;

            setDescriptionHeight(expanded ? `${scrollHeight}px` : `${cutoffHeight}px`);
        }
    }, [expanded, content]);

    const toggleDescription = () => {
        setExpanded(!expanded);
    };

    return (
        <div ref={ref} {...rest} className={cn('text-center', variants({ textSize, width, alignment, className }))}>
            <motion.div
                ref={descriptionRef}
                className="text-lg leading-6 overflow-hidden relative"
                initial={{ height: `${cutoffHeight}px` }}
                animate={{ height: descriptionHeight }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                onClick={() => {
                    if (expanded) {
                        setExpanded(false);
                    }
                }}
            >
                <p dangerouslySetInnerHTML={{ __html: content }} />

                <AnimatePresence initial={false}>
                    {!expanded && (
                        <motion.div
                            key="description-gradient"
                            className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-white to-transparent lg:hidden"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.6 }}
                        />
                    )}
                </AnimatePresence>
            </motion.div>

            <div className='flex flex-row justify-center items-center gap-2 cursor-pointer' onClick={toggleDescription}>
                <p className='mt-2 uppercase lg:hidden'>
                    {expanded ? _('expandable_description.readLess') : _('expandable_description.readMore')}
                </p>

                <ArrowBackSVG className={`mt-2 ${expanded ? 'rotate-90' : '-rotate-90'} transition-transform duration-300`} />
            </div>
        </div>
    )
});

export default ExpandableDescription;

export let schema: HydrogenComponentSchema = {
    type: 'expandable-description',
    title: 'Öppningsbar description',
    inspector: [
        {
            group: 'Paragraph',
            inputs: [
                {
                    type: 'richtext',
                    name: 'content',
                    label: 'Content',
                    defaultValue:
                        "Pair large text with an image or full-width video to showcase your brand's lifestyle to describe and showcase an important detail of your products that you can tag on your image.",
                    placeholder:
                        "Pair large text with an image or full-width video to showcase your brand's lifestyle to describe and showcase an important detail of your products that you can tag on your image.",
                },
                {
                    type: 'select',
                    name: 'as',
                    label: 'HTML tag',
                    configs: {
                        options: [
                            { value: 'p', label: '<p> (Paragraph)' },
                            { value: 'div', label: '<div> (Div)' },
                        ],
                    },
                    defaultValue: 'p',
                },
                {
                    type: 'range',
                    name: 'cutoffHeight',
                    label: 'Avskärningshöjd',
                    defaultValue: 100,
                    configs: {
                        min: 0,
                        max: 1000,
                        step: 10,
                        unit: 'px',
                    },
                },
                {
                    type: 'color',
                    name: 'color',
                    label: 'Text color',
                },
                {
                    type: 'select',
                    name: 'textSize',
                    label: 'Text size',
                    configs: {
                        options: [
                            { value: 'xs', label: 'Extra small (text-xs)' },
                            { value: 'sm', label: 'Small (text-sm)' },
                            { value: 'base', label: 'Base (text-base)' },
                            { value: 'lg', label: 'Large (text-lg)' },
                            { value: 'xl', label: 'Extra large (text-xl)' },
                            { value: '2xl', label: '2x large (text-2xl)' },
                            { value: '3xl', label: '3x large (text-3xl)' },
                            { value: '4xl', label: '4x large (text-4xl)' },
                            { value: '5xl', label: '5x large (text-5xl)' },
                            { value: '6xl', label: '6x large (text-6xl)' },
                            { value: '7xl', label: '7x large (text-7xl)' },
                            { value: '8xl', label: '8x large (text-8xl)' },
                            { value: '9xl', label: '9x large (text-9xl)' },
                        ],
                    },
                    defaultValue: 'base',
                },
                {
                    type: 'toggle-group',
                    name: 'width',
                    label: 'Width',
                    configs: {
                        options: [
                            { value: 'full', label: 'Full', icon: 'move-horizontal' },
                            {
                                value: 'narrow',
                                label: 'Narrow',
                                icon: 'fold-horizontal',
                            },
                        ],
                    },
                    defaultValue: 'narrow',
                },
                {
                    type: 'toggle-group',
                    name: 'alignment',
                    label: 'Alignment',
                    configs: {
                        options: [
                            { value: 'left', label: 'Left', icon: 'align-start-vertical' },
                            {
                                value: 'center',
                                label: 'Center',
                                icon: 'align-center-vertical',
                            },
                            { value: 'right', label: 'Right', icon: 'align-end-vertical' },
                        ],
                    },
                    defaultValue: 'center',
                },
            ],
        },
    ],
    toolbar: ['general-settings', ['duplicate', 'delete']],
};