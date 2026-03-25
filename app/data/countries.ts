import { CountryCode, LanguageCode } from "@shopify/hydrogen/storefront-api-types"

export type SupportedLanguage = 'SV' | 'DA' | 'EN';

export type Locale = {
    language: LanguageCode;
    country: CountryCode;
    label: string;
    translationKey: string;
    host: string;
    currency: string;
    pathPrefix?: string;
};

export const countries: Record<string, Locale> = {
    global: {
        language: 'EN',
        country: 'FR',
        label: 'English',
        translationKey: 'language.english',
        host: 'https://essnce.com',
        currency: 'EUR €',
    },
    se: {
        language: 'SV',
        country: 'SE',
        label: 'Sverige',
        translationKey: 'language.swedish',
        host: 'https://essnce.se',
        currency: 'SEK kr',
    },
    no: {
        language: 'SV',
        country: 'NO',
        label: 'Norge',
        translationKey: 'language.norwegian',
        host: 'https://essnce.no',
        currency: 'NOK kr',
    },
    fi: {
        language: 'SV',
        country: 'FI',
        label: 'Finland',
        translationKey: 'language.finnish',
        host: 'https://essnce.fi',
        currency: 'EUR €',
    },
    dk: {
        language: 'DA',
        country: 'DK',
        label: 'Danmark',
        translationKey: 'language.danish',
        host: 'https://essnce.dk',
        currency: 'DKK kr',
    }
}
