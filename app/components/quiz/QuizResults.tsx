import { Link } from "@remix-run/react"
import { Image } from "@shopify/hydrogen"
import { motion } from "framer-motion"
import { Answers, getProductsFromResults, Results } from "~/data/questions"
import { PersonalizedModal } from "./PersonalizedModal"
import { useTranslation } from "~/i18n/i18n"

interface QuizResultsProps {
    results: Results;
    answers: Answers;
}

export const QuizResults = ({ results, answers }: QuizResultsProps) => {
    const { t } = useTranslation();

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.8 } }}
            exit={{ opacity: 0, transition: { duration: 4 } }}
        >
            <div className="flex flex-col gap-2 items-center justify-center text-center">
                <h1 className="text-3xl">
                    {t('quiz.results.title', {
                        count: Math.min(getProductsFromResults(results).length, 6)
                    })}
                </h1>

                <hr className="w-80 text-[#eaeaea]" />

                <PersonalizedModal answers={answers} />

                {getProductsFromResults(results).length === 0 ? (
                    <div>
                        <h2>
                            {t('quiz.results.noResults')}
                        </h2>

                        <div className="flex flex-col gap-2 mt-4">
                            <Link to="/pages/parfymquiz" className="font-medium underline">
                                {t('quiz.results.tryAgain')}
                            </Link>
                            <span>
                                {t('quiz.results.or')}
                            </span>
                            <Link to="/collections/bestsellers" className="font-medium underline">
                                {t('quiz.results.seeBestSellers')}
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-2 justify-center pb-4">
                        {results
                            .filter((result) => result.result.length > 0)
                            .map((result) => (
                                <div key={result.type} className="flex flex-col gap-4 py-4 mb-8">
                                    {result.result.length !== 1 && (
                                        <>
                                            <hr style={{ color: '#eaeaea' }} />

                                            <h1 className="uppercase text-xl font-heading  ">
                                                <span className="font-semibold">{result.type}{result.result.length > 1 && !result.type.split('/').some((part) => ['Vanilj', 'Gourmand'].includes(part.trim())) ? 'a' : ''}</span>{" "}
                                                {result.result.length > 1 ? 'parfymer' : 'parfym'}
                                            </h1>

                                            <hr className="w-full text-[#eaeaea]" />
                                        </>
                                    )}

                                    {result.result.map((product, index) => (
                                        <div key={product.name} className="flex flex-col gap-2 items-center w-auto col-span-1">
                                            <Link
                                                to={product.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex relative gap-2"
                                            >
                                                <div className="w-full">
                                                    <div className="absolute top-[5%] flex flex-col text-white gap-1">
                                                        {product.scent_family
                                                            .flatMap((scentObject) =>
                                                                Object.keys(scentObject)
                                                            )
                                                            .map((scentName) => (
                                                                <div
                                                                    key={scentName}
                                                                    className="text-xs py-1 bg-black text-white rounded-xl uppercase px-4"
                                                                >
                                                                    {scentName}
                                                                </div>
                                                            ))}
                                                    </div>
                                                </div>
                                                <Image
                                                    src={`${product.image}?width=300`}
                                                    width={300}
                                                    height={300}
                                                    alt={product.name}
                                                    className="object-cover"
                                                />
                                            </Link>

                                            <h1 className="font-semibold text-xl pt-2 font-heading">{product.name}</h1>
                                            <p className="text-gray-700 p-5">{product.text}</p>

                                            <a
                                                href={product.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                <button
                                                    title={t('product.card.purchase.readMore') as string}
                                                    className='flex flex-col items-center justify-center px-4 py-2 cursor-pointer border border-black w-[100px] active:bg-black active:text-white md:hover:bg-black md:hover:text-white transition-all'
                                                >
                                                    {t('product.card.purchase.readMore')}
                                                </button>
                                            </a>

                                            {index !== result.result.length - 1 && <hr className="w-full my-8 text-[#eaeaea]" />}
                                        </div>
                                    ))}
                                </div>
                            ))}
                    </div>
                )}
            </div>
        </motion.div>
    )
}