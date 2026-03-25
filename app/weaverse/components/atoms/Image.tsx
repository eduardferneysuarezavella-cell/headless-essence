import { Image } from '@shopify/hydrogen';
import {
    IMAGES_PLACEHOLDERS,
    type HydrogenComponentProps,
    type HydrogenComponentSchema,
    type WeaverseImage,
} from '@weaverse/hydrogen';
import type { VariantProps } from 'class-variance-authority';
import { cva } from 'class-variance-authority';
import { forwardRef } from 'react';
import { cn } from '~/lib/utils';

let variants = cva('w-full h-auto basis-full', {
    variants: {
        width: {
            small: 'w-full',
            medium: 'w-full',
            large: 'w-full flex justify-center items-center',
        },
        height: {
            auto: 'h-auto',
            full: 'h-full',
            product: 'h-[400px]',
        },
        objectFit: {
            cover: 'object-cover',
            contain: 'object-contain',
        },
        borderRadius: {
            0: '',
            2: 'rounded-sm',
            4: 'rounded',
            6: 'rounded-md',
            8: 'rounded-lg',
            10: 'rounded-[10px]',
            12: 'rounded-xl',
            14: 'rounded-[14px]',
            16: 'rounded-2xl',
            18: 'rounded-[18px]',
            20: 'rounded-[20px]',
            22: 'rounded-[22px]',
            24: 'rounded-3xl',
            26: 'rounded-[26px]',
            28: 'rounded-[28px]',
            30: 'rounded-[30px]',
            32: 'rounded-[32px]',
            34: 'rounded-[34px]',
            36: 'rounded-[36px]',
            38: 'rounded-[38px]',
            40: 'rounded-[40px]',
        },
    },
});

interface ImageWithTextImageProps
    extends VariantProps<typeof variants>,
    HydrogenComponentProps {
    image: WeaverseImage | string;
    aspectRatio: 'adapt' | '1/1' | '4/3' | '3/4' | '16/9';
    height: 'auto' | 'full' | 'product';
}

let ImageWithTextImage = forwardRef<HTMLDivElement, ImageWithTextImageProps>(
    (props, ref) => {
        let {
            image = IMAGES_PLACEHOLDERS.image,
            width,
            aspectRatio,
            borderRadius,
            objectFit,
            height,
            ...rest
        } = props;
        let imageData: Partial<WeaverseImage> =
            typeof image === 'string' ? { url: image, altText: 'Placeholder' } : image;
        let aspRt: string | undefined;
        if (aspectRatio === 'adapt') {
            if (imageData.width && imageData.height) {
                aspRt = `${imageData.width}/${imageData.height}`;
            }
        } else {
            aspRt = aspectRatio;
        }

        return (
            <div ref={ref} {...rest} className={cn(variants({ width }))}>
                <Image
                    data={imageData}
                    sizes="auto"
                    aspectRatio={aspRt}
                    className={cn(variants({ objectFit, borderRadius, height }))}
                />
            </div>
        );
    },
);

export default ImageWithTextImage;

export let schema: HydrogenComponentSchema = {
    type: 'image',
    title: 'Bild',
    inspector: [
        {
            group: 'Image',
            inputs: [
                {
                    type: 'image',
                    name: 'image',
                    label: 'Image',
                },
                {
                    type: 'toggle-group',
                    name: 'height',
                    label: 'Height',
                    configs: {
                        options: [{ value: 'auto', label: 'Auto' }, { value: 'full', label: 'Full' }, { value: 'product', label: 'Product' }],
                    },
                    defaultValue: 'auto',
                },
                {
                    type: 'select',
                    name: 'aspectRatio',
                    label: 'Aspect ratio',
                    defaultValue: 'adapt',
                    configs: {
                        options: [
                            { value: 'adapt', label: 'Adapt to image' },
                            { value: '1/1', label: '1/1' },
                            { value: '4/3', label: '4/3' },
                            { value: '3/4', label: '3/4' },
                            { value: '16/9', label: '16/9' },
                        ],
                    },
                    helpText:
                        'Learn more about image <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/aspect-ratio" target="_blank" rel="noopener noreferrer">aspect ratio</a> property.',
                },
                {
                    type: 'select',
                    name: 'width',
                    label: 'Width',
                    defaultValue: 'medium',
                    configs: {
                        options: [
                            { value: 'small', label: 'Small' },
                            { value: 'medium', label: 'Medium' },
                            { value: 'large', label: 'Large' },
                        ],
                    },
                },
                {
                    type: 'range',
                    name: 'borderRadius',
                    label: 'Border radius',
                    configs: {
                        min: 0,
                        max: 40,
                        step: 2,
                        unit: 'px',
                    },
                    defaultValue: 0,
                },
                {
                    type: 'select',
                    name: 'objectFit',
                    label: 'Object fit',
                    defaultValue: 'cover',
                    configs: {
                        options: [
                            { value: 'cover', label: 'Cover' },
                            { value: 'contain', label: 'Contain' },
                        ],
                    },
                },
            ],
        },
    ],
};