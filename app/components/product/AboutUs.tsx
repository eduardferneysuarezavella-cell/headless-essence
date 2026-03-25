import { Link } from "@remix-run/react";
import { useTranslation } from '~/i18n/i18n';

export function AboutUs() {
    const { t: _ } = useTranslation();

    return (
        <section className="py-8">
            <img
                src='/781936844e840c073005470c76dfe9da.png'
                alt={_('aboutUs.imageAlt')?.toString()}
                className='object-cover w-full object-center lg:h-[70vh] h-[40vh]'
                style={{ objectPosition: '50% 30%' }}
            />

            <div className='flex flex-col items-center gap-4 px-5 py-6 lg:pt-16'>
                <h2 className='font-heading lg:text-3xl text-[25px] font-semibold'>{_('aboutUs.heading')}</h2>

                <p className='mb-2 text-center w-4/5 lg:w-[500px] lg:text-xl'>
                    {_('aboutUs.description')}
                    <br /><br />
                    {_('aboutUs.founder')}
                </p>

                <Link to={`/pages/our-story`} prefetch='intent'>
                    <button className="text-sm lg:text-base font-semibold uppercase border border-black px-6 lg:h-[58px] h-[40px] lg:min-w-[500px] min-w-none hover:bg-black hover:text-white transition-colors cursor-pointer">
                        {_('aboutUs.cta')}
                    </button>
                </Link>
            </div>
        </section>
    );
}