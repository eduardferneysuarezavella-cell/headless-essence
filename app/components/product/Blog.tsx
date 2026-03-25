import { BlogQuery } from "storefrontapi.generated";
import ScrollableList, { ScrollableGrid } from "../ScrollableList";
import { Image } from "@shopify/hydrogen";
import { Link } from "@remix-run/react";

export default function Blog({ blog }: { blog: BlogQuery["blog"] }) {
    return (
        <div className="">
            <div className='pb-6 px-5'>
                <div className='flex justify-between items-center'>
                    <Link to="/blogs/essnce-journal" className="w-1/2">
                        <h2 className='font-heading lg:text-3xl text-2xl font-semibold'>ESSENTIAL JOURNAL</h2>
                    </Link>

                    <Link to="/blogs/essnce-journal" className="flex justify-center items-center uppercase border border-black lg:px-6 px-4 lg:h-[45px] h-[30px] lg:text-base text-sm font-medium font-heading hover:bg-black hover:text-white transition-colors shadow-md">
                        Besök vår blogg
                    </Link>
                </div>
            </div>

            <ScrollableList
                items={blog?.articles.nodes ?? []}
                perPage={{ desktop: 4, mobile: 2 }}
                createLink={(article) => `/blogs/essnce-journal/${article.handle}`}
            >
                {(article) => (
                    <div className="flex flex-col justify-between h-full px-5">
                        <div className="flex flex-col gap-2">
                            <Image
                                src={article.image?.url}
                                alt={article.title}
                                width={500}
                                height={500}
                                className="w-full h-auto"
                            />

                            <div className="flex flex-col gap-2 py-3">
                                <h3 className="font-heading text-xl font-medium text-left lg:text-2xl">{article.title}</h3>
                                <p className="text-sm lg:text-base">{article.excerpt}</p>
                            </div>
                        </div>

                        <button className='uppercase border border-black lg:px-8 px-6 lg:h-[45px] h-[30px] lg:text-base text-sm font-medium font-heading hover:bg-black hover:text-white transition-colors shadow-md'>
                            Läs mer
                        </button>
                    </div>
                )}
            </ScrollableList>
        </div>
    )
}
