import { useLoaderData } from "@remix-run/react";
import { json, LoaderFunctionArgs } from "@remix-run/server-runtime";
import { WeaverseContent } from "~/weaverse";

export default function Pages() {
    const {weaverseData} = useLoaderData<typeof loader>();

    return (
        <div className=''>
            <WeaverseContent/>
        </div>
    )
}

export async function loader({context}: LoaderFunctionArgs) {
    const weaverseData = await context.weaverse.loadPage({ type: 'PAGE' });

    return json({weaverseData});
}
