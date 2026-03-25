import { HTMLAttributes, SVGProps } from "react";

interface ArrowProps extends HTMLAttributes<SVGElement> {}

const BaseArrowIcon = (props: ArrowProps) => {
    return (
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <path d="M2 16L30 16M30 16L16 2M30 16L16 30" stroke="#1E1E1E" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    )
};

export const ArrowIconRight = ({ className, ...rest }: ArrowProps) => {
    return <BaseArrowIcon className={className} {...rest} />
};

export const ArrowIconLeft = ({ className, ...rest }: ArrowProps) => {
    return <BaseArrowIcon className={`${className} rotate-180`} {...rest} />
};

export const ArrowIconUp = ({ className, ...rest }: ArrowProps) => {
    return <BaseArrowIcon className={`${className} rotate-90`} {...rest} />
};

export const ArrowIconDown = ({ className, ...rest }: ArrowProps) => {
    return <BaseArrowIcon className={`${className} -rotate-90`} {...rest} />
};
