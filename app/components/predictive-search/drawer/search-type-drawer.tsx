import { PredictiveSearchForm } from "../search-form";
import { SearchTypeDrawerResults } from "./search-type-drawer-results";
import { useState } from "react";
import { useTranslation } from "~/i18n/i18n";
interface PredictiveSearchProps {
    isOpen?: boolean;
}

export function SearchTypeDrawer(props: PredictiveSearchProps) {
    let { isOpen } = props;
    const [inputValue, setInputValue] = useState("");
    const { t } = useTranslation();

    return (
        <div className="">
            <PredictiveSearchForm>
                {({ fetchResults, inputRef }) => (
                    <div className="mx-auto w-full max-w-[1440px] p-6">
                        <div className="relative">
                            <input
                                name="q"
                                onChange={(e) => {
                                    setInputValue(e.target.value);
                                    fetchResults(e);
                                }}
                                onFocus={fetchResults}
                                placeholder={t('layout.search.placeholder') as string}
                                ref={inputRef}
                                className="rounded outline-none border-none py-2 pl-10 pr-4 bg-neutral-100 w-full"
                                autoFocus
                            />
                            <svg
                                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                            </svg>
                            {!inputValue && (
                                <img
                                    src="https://cdn.shopify.com/s/files/1/0551/4611/9308/files/Carashmellow_Frilagd.png?v=1724691421&width=100&height=100&crop=center"
                                    alt="Carashmellow"
                                    className="absolute right-3 top-1/2 -translate-y-1/2 h-6 w-auto block md:hidden"
                                />
                            )}
                        </div>
                    </div>
                )}
            </PredictiveSearchForm>

            {isOpen && <SearchTypeDrawerResults />}
        </div>
    );
}