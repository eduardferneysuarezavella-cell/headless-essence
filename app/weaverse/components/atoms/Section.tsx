import type {
    HydrogenComponentProps,
    InspectorGroup,
} from "@weaverse/hydrogen";
import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";
import type { HTMLAttributes } from "react";
import type React from "react";
import { forwardRef } from "react";
import type { BackgroundImageProps } from "./BackgroundImage";
import { backgroundInputs } from "./BackgroundImage";
import type { OverlayProps } from "./Overlay";
import { overlayInputs } from "./Overlay";
import { OverlayAndBackground } from "./OverlayAndBackground";
import { cn } from "~/lib/utils";

export type BackgroundProps = BackgroundImageProps & {
    backgroundFor: "section" | "content";
    backgroundColor: string;
};

export interface SectionProps<T = any>
    extends Omit<VariantProps<typeof variants>, "padding">,
    Omit<HydrogenComponentProps<T>, "children">,
    Omit<HTMLAttributes<HTMLElement>, "children">,
    Partial<BackgroundProps>,
    OverlayProps {
    as: React.ElementType;
    elementId: string;
    borderRadius: number;
    align: "left" | "center" | "right";
    containerClassName: string;
    children: React.ReactNode;
}

let variants = cva("relative", {
    variants: {
        width: {
            full: "w-full h-full",
            "1440px": "w-full h-full max-w-[1440px] mx-auto",
            "1200px": "w-full h-full max-w-[1200px] mx-auto",
        },
        padding: {
            full: "",
            "1440px": "px-5 lg:px-8",
            "1200px": "px-5 lg:px-8",
        },
        verticalPadding: {
            none: "",
            small: "py-4 md:py-6 lg:py-8",
            medium: "py-8 md:py-12 lg:py-16",
            large: "py-12 md:py-24 lg:py-32",
        },
        horizontalPadding: {
            none: "",
            small: "px-5 lg:px-8",
            medium: "px-5 lg:px-8",
            large: "px-12 lg:px-32",
        },
        rowOrColumn: {
            row: "flex flex-row",
            column: "flex flex-col",
        },
        align: {
            left: "items-start",
            center: "items-center",
            right: "items-end",
        },
        gap: {
            0: "",
            4: "gap-1",
            8: "gap-2",
            12: "gap-3",
            16: "gap-4",
            20: "gap-5",
            24: "gap-3 lg:gap-6",
            28: "gap-3.5 lg:gap-7",
            32: "gap-4 lg:gap-8",
            36: "gap-4.5 lg:gap-9",
            40: "gap-5 lg:gap-10",
            44: "gap-5.5 lg:gap-11",
            48: "gap-6 lg:gap-12",
            52: "gap-6 lg:gap-[52px]",
            56: "gap-7 lg:gap-14",
            60: "gap-7 lg:gap-[60px]",
        },
        overflow: {
            unset: "",
            hidden: "overflow-hidden",
        },
    },
    defaultVariants: {
        overflow: "hidden",
    },
});

export let Section = forwardRef<HTMLElement, SectionProps>((props, ref) => {
    let {
        elementId,
        as: Component = "section",
        width,
        gap,
        overflow,
        verticalPadding,
        horizontalPadding,
        borderRadius,
        backgroundColor,
        backgroundFor,
        backgroundImage,
        backgroundFit,
        backgroundPosition,
        enableOverlay,
        overlayColor,
        overlayColorHover,
        overlayOpacity,
        className,
        children,
        rowOrColumn,
        containerClassName,
        style = {},
        ...rest
    } = props;

    style = {
        ...style,
        "--section-background-color": backgroundColor || undefined, // Changed from ??
        "--section-border-radius": `${borderRadius || 0}px`,
    } as React.CSSProperties;

    let isBgForContent = backgroundFor === "content";
    let hasBackground = backgroundColor || backgroundImage || borderRadius > 0;

    return (
        <Component
            ref={ref}
            {...rest}
            id={elementId}
            style={style}
            className={cn(
                variants({ overflow, className }),
                hasBackground && !isBgForContent && "has-background",
            )}
        >
            {!isBgForContent && <OverlayAndBackground {...props} />}
            <div
                className={cn(
                    variants({ gap, width, verticalPadding, horizontalPadding, overflow, rowOrColumn }),
                    hasBackground && isBgForContent && "has-background px-4 sm:px-8",
                    containerClassName,
                )}
            >
                {isBgForContent && <OverlayAndBackground {...props} />}
                {children}
            </div>
        </Component>
    );
});

export let layoutInputs: InspectorGroup["inputs"] = [
    {
        type: 'text',
        name: 'elementId',
        label: 'Element ID',
    },
    {
        type: "select",
        name: "width",
        label: "Content width",
        configs: {
            options: [
                { value: "full", label: "Hela sida" },
                { value: "1440px", label: "1440px" },
                { value: "1200px", label: "1200px" },
            ],
        },
        defaultValue: "fixed",
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
        type: "select",
        name: "verticalPadding",
        label: "Vertical padding",
        configs: {
            options: [
                { value: "none", label: "None" },
                { value: "small", label: "Small" },
                { value: "medium", label: "Medium" },
                { value: "large", label: "Large" },
            ],
        },
        defaultValue: "medium",
    },
    {
        type: "select",
        name: "horizontalPadding",
        label: "Horizontal padding",
        configs: {
            options: [
                { value: "none", label: "None" },
                { value: "small", label: "Small" },
                { value: "medium", label: "Medium" },
                { value: "large", label: "Large" },
            ],
        },
        defaultValue: "small",
    },
    {
        type: "toggle-group",
        name: "rowOrColumn",
        label: "Rad eller kolumn",
        configs: {
            options: [
                { value: "row", label: "Rad" },
                { value: "column", label: "Kolumn" },
            ],
        },
        defaultValue: "column",
    },
    {
        type: "toggle-group",
        name: "align",
        label: "Justera",
        configs: {
            options: [{ value: "left", label: "Vänster" }, { value: "center", label: "Centrera" }, { value: "right", label: "Höger" }],
        },
        defaultValue: "center",
    },
    {
        type: "range",
        name: "borderRadius",
        label: "Corner radius",
        configs: {
            min: 0,
            max: 40,
            step: 2,
            unit: "px",
        },
        defaultValue: 0,
    },
];

export let sectionInspector: InspectorGroup[] = [
    { group: "Layout", inputs: layoutInputs },
    { group: "Background", inputs: backgroundInputs },
    { group: "Overlay", inputs: overlayInputs },
];