import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from "~/lib/utils";
import { Link } from '@remix-run/react';
import { HydrogenComponentSchema } from '@weaverse/hydrogen';

const buttonVariants = cva(
    'flex flex-col',
    {
        variants: {
            align: {
                left: 'items-start',
                center: 'items-center',
                right: 'items-end',
            },
            justify: {
                default: 'justify-start',
                center: 'justify-center',
                end: 'justify-end',
            },
        },
        defaultVariants: {
            align: 'left',
            justify: 'default',
        },
    },
);

export interface ButtonProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof buttonVariants> {
    classNameContainer?: string;
    gap?: number;
    align?: 'left' | 'center' | 'right';
    justify?: 'default' | 'center' | 'end';
}

const Column = React.forwardRef<HTMLDivElement, ButtonProps>(
    (
        {
            className,
            align = 'left',
            justify = 'default',
            classNameContainer,
            children,
            gap,
            ...props
        },
        ref,
    ) => {
        return (
            <div
                className={cn(
                    buttonVariants({ align, justify, className }),
                )}
                style={{ gap: gap }}
                ref={ref}
                {...props}
            >
                {children}
            </div>
        );
    },
);
Column.displayName = 'Column';

export let schema: HydrogenComponentSchema = {
    type: 'column',
    title: 'Column',
    inspector: [
        {
            group: 'Column',
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
                    type: 'toggle-group',
                    name: 'align',
                    label: 'Align',
                    configs: {
                        options: [
                            { value: 'left', label: 'Left' },
                            { value: 'center', label: 'Center' },
                            { value: 'right', label: 'Right' },
                        ],
                    },
                    defaultValue: 'left',
                },
                {
                    type: 'toggle-group',
                    name: 'justify',
                    label: 'Justify',
                    configs: {
                        options: [
                            { value: 'default', label: 'Default' },
                            { value: 'center', label: 'Center' },
                            { value: 'end', label: 'End' },
                        ],
                    },
                    defaultValue: 'default',
                },
                {
                    type: "range",
                    name: "gap",
                    label: "Items spacing",
                    configs: {
                        min: 0,
                        max: 60,
                        step: 4,
                        unit: "px",
                    },
                    defaultValue: 20,
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
    childTypes: ['heading-other', 'description', 'image', 'expandable-description', 'product-slide', 'button'],
};

export default Column;
