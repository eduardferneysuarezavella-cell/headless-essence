import { HTMLAttributes } from "react";

interface ArrowBackSVGProps extends HTMLAttributes<SVGElement> { }

export const ArrowBackSVG = (props: ArrowBackSVGProps) => {
    return (
        <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <path d="M19.7917 12.5001L5.20837 12.5001M5.20837 12.5001L12.5 19.7917M5.20837 12.5001L12.5 5.20842" stroke="#1E1E1E" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>

    )
};