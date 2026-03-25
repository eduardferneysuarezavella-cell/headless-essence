import { useFetcher, useParams } from "@remix-run/react";
import { NormalizedPredictiveSearchResults, SearchFromProps } from "./types";
import { useEffect, useRef } from "react";

/**
 *  Search form component that posts search requests to the `/search` route
 **/
export function PredictiveSearchForm({
    action,
    children,
    className = 'predictive-search-form',
    method = 'POST',
    ...props
}: SearchFromProps) {
    const fetcher = useFetcher<NormalizedPredictiveSearchResults>();
    const inputRef = useRef<HTMLInputElement | null>(null);

    function fetchResults(event: React.ChangeEvent<HTMLInputElement>) {
        const searchAction = action ?? '/api/predictive-search';
        const newSearchTerm = event.target.value || '';

        fetcher.submit(
            { q: newSearchTerm, limit: '5' },
            { method, action: searchAction },
        );
    }

    useEffect(() => {
        inputRef?.current?.setAttribute('type', 'search');
        inputRef?.current?.focus()
    }, []);

    return (
        <fetcher.Form
            {...props}
            className={className}
            onSubmit={(event) => {
                event.preventDefault();
                event.stopPropagation();

                if (!inputRef?.current || inputRef.current.value === '') {
                    return;
                }

                inputRef.current.blur();
            }}
        >
            {children({ fetchResults, inputRef, fetcher })}
        </fetcher.Form>
    );
}