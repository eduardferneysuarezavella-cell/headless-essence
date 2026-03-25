import { useLoaderData } from "@remix-run/react";
import { defer, LoaderFunctionArgs } from "@shopify/remix-oxygen";
import { ScentFamilies } from "~/data/scent-families";
import { Image } from "@shopify/hydrogen";
import ExpandableDescription from "~/components/ExpandableDescription";
import { SIMILAR_FAMILIES_QUERY } from "./($locale).products.$handle";
import { ScrollableGrid } from "~/components/ScrollableList";
import { ProductItem } from "./($locale).collections.$handle";
import { ProductFragment, ProductItemFragment } from "storefrontapi.generated";
import { WeaverseContent } from "~/weaverse";

export async function loader(args: LoaderFunctionArgs) {
    // Start fetching non-critical data without blocking time to first byte
    const deferredData = loadDeferredData(args);

    // Await the critical data required to render initial state of the page
    const criticalData = await loadCriticalData(args);

    return defer({ ...deferredData, ...criticalData });
}

async function loadCriticalData({
    context,
    params,
    request,
}: LoaderFunctionArgs) {
    const url = new URL(request.url);
    const scentFamily = ScentFamilies.find((family) => family.handle === params.type);

    if (!scentFamily) {
        throw new Response(null, { status: 404 });
    }

    const [page] = await Promise.all([
        context.weaverse.loadPage({ type: 'CUSTOM' }),
    ]);

    return { weaverseData: page, scentFamily };
}

function loadDeferredData({ params }: LoaderFunctionArgs) {

    return {};
}

export default function ScentFamily() {
    const data = useLoaderData<typeof loader>();

    return (
        <div className="xl:py-12">
            <WeaverseContent />
        </div>
    )
}
/***
 *<div className="flex xl:flex-row flex-col-reverse">
                <div className="flex flex-col justify-between xl:flex-1 xl:px-32">
                    <div className="flex flex-col gap-4 xl:p-0 p-6">
                        <h1 className="text-[40px] font-heading uppercase text-center xl:text-left">{data.scentFamily.name}</h1>

                        <ExpandableDescription wrapperClassName="xl:text-lg xl:text-left px-5 xl:px-0">
                            {data.data?.data?.information.Default}
                        </ExpandableDescription> 
                        </div>

                        <div className="px-5 xl:px-0 py-6">
                            <h1 className="xl:text-3xl text-2xl font-heading font-medium text-center xl:text-left">Bästsäljande inom {data.scentFamily.name}</h1>
    
                            {data.bestsellers.collection?.products.nodes && (
                                <ScrollableGrid
                                    variants={data.bestsellers.collection?.products.nodes}
                                        perPage={{ desktop: 3, mobile: 2 }}
                                />
                            )}
                        </div>
                    </div>
                    <div className="xl:basis-[45%]">
                        <Image
                            src={data.data?.data?.image}
                            alt={data.data?.data?.name}
                            width={2000}
                            height={2000}
                            className="object-cover w-full h-full xl:max-h-full max-h-[250px]"
                        />
                    </div>
                </div>
 */