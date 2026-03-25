import { Link } from "@remix-run/react";
import { useTranslation } from "~/i18n/i18n";

export function PerfumeQuiz() {
    const { t } = useTranslation();

    return (
        <section className="py-8">
            <Link to='/parfymguide'>
                <img
                    src={'https://cdn.shopify.com/s/files/1/0551/4611/9308/files/Parfymguide.webp?v=1739886535'}
                    alt='Tester'
                    width={1000}
                    height={1000}
                    className='object-cover w-full object-center lg:h-[70vh] h-[40vh]'
                    style={{ objectPosition: '50% 90%' }}
                />
            </Link>

            <div className='flex flex-col items-center gap-4 px-5 py-6 lg:pt-16'>
                <h2 className='font-heading lg:text-3xl text-[25px] font-semibold'>{t('quiz.title')}</h2>

                <p className='mb-2 text-center w-4/5 lg:w-[500px] lg:text-xl'>
                    {t('quiz.description2')}
                </p>

                <Link to='/parfymguide'>
                    <button className="text-sm lg:text-base font-semibold uppercase border border-black px-6 lg:h-[58px] h-[40px] lg:min-w-[500px] min-w-none hover:bg-black hover:text-white transition-colors cursor-pointer">
                        {t('quiz.startButton2')}
                    </button>
                </Link>
            </div>
        </section>
    );
}