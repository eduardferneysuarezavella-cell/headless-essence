import { Link } from "@remix-run/react";
import { defer, LoaderFunctionArgs } from "@remix-run/server-runtime";
import { Image } from "@shopify/hydrogen";
import { ScentFamilies } from "~/data/scent-families";
import { useTranslation } from "~/i18n/i18n";

export async function loader(args: LoaderFunctionArgs) {
    return defer({});
}

export default function ScentFamily() {
    const { t: _ } = useTranslation();

    return (
        <div className="blog ">
            <div className='flex flex-col justify-center items-center pb-8 lg:pb-20 pt-4'>
                <h1 className='font-heading lg:text-3xl text-2xl lg:text-[45px] uppercase pt-8 px-5 pb-4 lg:pb-8'>{_('scent_families.heading')}</h1>

                <div className="max-w-[400px] lg:max-w-[600px] lg:text-lg text-center">
                    <p>{_('scent_families.description')}</p>
                </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-16 max-w-[1440px] mx-auto lg:pb-20 pb-12 px-5">
                {ScentFamilies.map((family) => (
                    <Link key={family.handle} to={`/doftgrupper/${family.handle}`} className="flex flex-col items-center gap-2">
                        <Image
                            src={family.image}
                            alt={family.name}
                            width={200}
                            height={200}
                        />

                        <div className="flex flex-col gap-2">
                            <h3 className="font-heading text-lg lg:text-3xl uppercase font-heading text-center">{family.name}</h3>

                            <button className='uppercase border border-black lg:px-6 px-4 lg:h-[45px] h-[30px] w-[150px] lg:text-base text-sm font-medium font-heading hover:bg-black hover:text-white transition-colors shadow-md'>
                                {_('scent_families.readMore')}
                            </button>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}