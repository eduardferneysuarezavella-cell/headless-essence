import { useState } from "react";

export const MyFunComponent = (props: { text: string, image: any }) => {

    return (
        <div>
            <img 
                src={props.image} 
                alt={props.text}
                width={100}
                height={100}
            />

            <h3>{props.text.toUpperCase()}</h3>
        </div>
    );
};