import type { HydrogenComponentSchema } from "@weaverse/hydrogen";
import { forwardRef } from "react";
import { layoutInputs, Section, SectionProps } from "../atoms/Section";
import { backgroundInputs } from "../atoms/BackgroundImage";

type ImageWithTextProps = SectionProps & {
    elementId: string;
};

let ImageWithText = forwardRef<HTMLElement, ImageWithTextProps>(
    (props, ref) => {
        let { children, elementId, ...rest } = props;

        return (
            <Section
                ref={ref}
                {...rest}
                id={elementId}
                containerClassName="flex flex-col md:flex-row md:justify-between px-0 sm:px-0"
            >
                {children}
            </Section>
        );
    },
);

export default ImageWithText;

export let schema: HydrogenComponentSchema = {
    type: "image-with-text",
    title: "Image with text",
    inspector: [
        {
            group: 'Element',
            inputs: [
                {
                    type: 'text',
                    label: 'ID',
                    name: 'elementId',
                },
            ],
        },
        {
            group: "Layout",
            inputs: layoutInputs.filter(({ name }) => name !== "gap"),
        },
        { group: "Background", inputs: backgroundInputs },
    ],
    childTypes: ["image-with-text--content", "image"],
    presets: {
        verticalPadding: "none",
        children: [
            { type: "image" },
            { type: "image-with-text--content" },
        ],
    },
};