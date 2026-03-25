import * as React from 'react';
import { Pagination } from '@shopify/hydrogen';
import { useI18n } from './i18n-provider';
import { useTranslation } from '~/i18n/i18n';

/**
 * <PaginatedResourceSection > is a component that encapsulate how the previous and next behaviors throughout your application.
 */

export function PaginatedResourceSection<NodesType>({
    connection,
    page,
    children,
    resourcesClassName,
}: {
    connection: React.ComponentProps<typeof Pagination<NodesType>>['connection'];
    page: number;
    children: React.FunctionComponent<{ node: NodesType; index: number }>;
    resourcesClassName?: string;
}) {
    const { t: _ } = useTranslation();

    return (
        <Pagination connection={connection}>
            {({ nodes, isLoading, PreviousLink, NextLink }) => {
                const resoucesMarkup = nodes.map((node, index) => children({ node, index }));

                return (
                    <div>
                        {resourcesClassName ? (
                            <div className={resourcesClassName}>{resoucesMarkup}</div>
                        ) : (
                            resoucesMarkup
                        )}
                        <div className="flex justify-center items-center gap-4 mt-8">
                            <PreviousLink className='px-6 py-2 border border-black font-heading uppercase text-lg'>
                                {isLoading ? _('layout.pagination.loading') : <span>{_('layout.pagination.previous')}</span>}
                            </PreviousLink>

                            <NextLink className='px-6 py-2 border border-black font-heading uppercase text-lg mt-2 hover:bg-black hover:text-white transition-all duration-300'>
                                {isLoading ? _('layout.pagination.loading') : <span>{_('layout.pagination.loadMore')}</span>}
                            </NextLink>
                        </div>
                    </div>
                );
            }}
        </Pagination>
    );
}
