import { Link } from '@remix-run/react';
import { usePredictiveSearch } from '../usePredictiveSearch';
import { PredictiveSearchResult, SearchResultItem } from '../result';
import { useTranslation } from '~/i18n/i18n';
export function SearchTypeDrawerResults() {
    const { results, totalResults, searchTerm, searchInputRef } = usePredictiveSearch();
    const { t } = useTranslation();

    let totalResultsCount = totalResults || 0;

    function goToSearchResult(event: React.MouseEvent<HTMLAnchorElement>) {
        let type = event.currentTarget.dataset.type;
        if (!searchInputRef.current) return;
        if (type === 'SearchQuerySuggestion') {
            searchInputRef.current.value = event.currentTarget.innerText;
            searchInputRef.current.focus();
        } else {
            searchInputRef.current.blur();
            searchInputRef.current.value = '';
        }
    }

    if (!totalResults && searchTerm.current) {
        return (
            <div className="relative flex items-center justify-center bg-white">
                <div className="grid custom-scroll md:max-h-[81vh] md:min-h-auto w-screen grid-cols-1 gap-6 overflow-y-auto p-6 max-w-[1440px]">
                    <NoPredictiveSearchResults searchTerm={searchTerm} />
                </div>
            </div>
        );
    }

    if (!totalResults) {
        return null;
    }

    const products = results.find((result) => result.type === 'products')?.items || [];
    const articles = results.find((result) => result.type === 'articles')?.items || [];
    const pages = results.find((result) => result.type === 'pages')?.items || [];
    const collections = results.find((result) => result.type === 'collections')?.items || [];

    return (
        <div className="relative flex items-center justify-center bg-white">
            <div className="grid custom-scroll min-h-[50vh] md:max-h-[81vh] md:min-h-auto w-screen grid-cols-1 gap-6 overflow-y-auto p-6 max-w-[1440px]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[...products, ...collections].slice(0, 4).map((item) => (
                        <SearchResultItem
                            key={item.id}
                            goToSearchResult={goToSearchResult}
                            item={item}
                        />
                    ))}
                </div>

                {(articles.length > 0 || pages.length > 0) && (
                    <div className='flex flex-col gap-y-4'>
                        <p className='text-lg font-heading uppercase my-2'>{t('layout.search.results.articlesAndPages')}</p>

                        {[...articles, ...pages].slice(0, 4).map((item) => (
                            <SearchResultItem
                                key={item.id}
                                goToSearchResult={goToSearchResult}
                                item={item}
                            />
                        ))}
                    </div>
                )}

                <div className='h-[50px] mt-2' />

                {searchTerm.current && (
                    <Link
                        prefetch="intent"
                        to={`/search?q=${searchTerm.current}`}
                        className="flex justify-center absolute bottom-0 p-6 bg-background-subtle-1 left-0 right-0"
                    >
                        <p className="flex justify-center items-center bg-black text-white text-lg font-heading uppercase h-[45px] px-8 disabled:bg-black/50 font-medium cursor-pointer">
                            {t('layout.search.viewAll', { count: `(${totalResultsCount})` })}
                        </p>
                    </Link>
                )}
            </div>
        </div>
    );
}

function NoPredictiveSearchResults({ searchTerm }: { searchTerm: React.MutableRefObject<string> }) {
    const { t } = useTranslation();

    if (!searchTerm.current) {
        return null;
    }

    return (
        <div className="w-full">
            <h2 className='md:pb-6'>{t('layout.search.noResults', { query: searchTerm.current })}</h2>
        </div>
    );
}