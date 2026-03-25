import { Form, useFetcher } from "@remix-run/react";
import { ReactNode } from "react";

export const QuizWrapper = ({ children }: { children: ReactNode }) => {
    return (
        <div className="flex relative flex-col justify-center items-center md:px-6 w-full md:w-[80vw] pb-24 pt-2 max-w-[1080px]">
            {children}
        </div>
    )
};