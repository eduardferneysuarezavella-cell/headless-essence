import { useRouteLoaderData } from '@remix-run/react';
import { createContext, useContext } from 'react';
import { RootLoader } from '~/root';

interface I18nContextType {
    locale: string;
    translate: (key: string, fallback?: string) => string;
}

const i18nContext = createContext<I18nContextType | null>(null);

export function I18nProvider({ children, locale, initialData }: { children: React.ReactNode, locale: string, initialData: any }) {
    const translate = (key: string, fallback?: string) => {
        if (!initialData?.metaobject?.fields) {
            return fallback ?? key;
        }
        const translation = initialData.metaobject.fields.find((field: any) => field.key === key);
        return translation ? translation.value : fallback ?? key;
    }

    return (
        <i18nContext.Provider value={{ locale, translate }}>
            {children}
        </i18nContext.Provider>
    )
}

export function useI18n() {
    const context = useContext(i18nContext);

    if (!context) {
        throw new Error('useI18n must be used within an I18nProvider');
    }
    return context;
}

