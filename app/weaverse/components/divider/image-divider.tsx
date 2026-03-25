import { Image } from "@shopify/hydrogen";
import type {
    HydrogenComponentProps,
    HydrogenComponentSchema,
    WeaverseImage,
} from "@weaverse/hydrogen";
import { forwardRef } from "react";

type ImageDividerProps = HydrogenComponentProps & {
    image: WeaverseImage;
    mobileImage: WeaverseImage;
};

let ImageDivider = forwardRef<HTMLDivElement, ImageDividerProps>((props, ref) => {
    let {
        image,
        mobileImage,
        ...rest
    } = props;
    return (
        <div
            ref={ref}
            {...rest}
            className="w-full flex items-center justify-center mt-8 mb-5"
        >
            {image && (
                <Image
                    src={image.url}
                    alt={image.altText}
                    width={734}
                    height={228}
                    sizes="(max-width: 768px) 100vw, 734px"
                    className="md:block hidden"
                />
            )}

            {mobileImage && (
                <Image
                    src={mobileImage.url}
                    alt={mobileImage.altText}
                    width={734}
                    height={228}
                    sizes="100vw"
                    className="md:hidden block"
                />
            )}
        </div>
    );
});

export default ImageDivider;

export let schema: HydrogenComponentSchema = {
    type: "image-divider",
    title: "Image Spacer",
    inspector: [
        {
            group: "Image Spacer",
            inputs: [
                {
                    type: "image",
                    label: "Image",
                    name: "image",
                },
                {
                    type: "image",
                    label: "Mobile Image",
                    name: "mobileImage",
                },
            ],
        },
    ],
};