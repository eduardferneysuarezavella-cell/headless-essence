import type { I18nBase } from '@shopify/hydrogen';
import { CountryCode, LanguageCode } from '@shopify/hydrogen/storefront-api-types';
import { countries } from '~/data/countries';

export type Locale = {
    language: LanguageCode;
    country: CountryCode;
    label?: string;
    host?: string;
    currency?: string;
    pathPrefix?: string;
}

export function getLocaleFromRequest({ request }: { request: Request }): Locale {
    const url = new URL(request.url);
    const hostname = url.hostname.toLowerCase();

    // Strict domain matching for Nordic domains
    if (hostname === 'essnce.se' || hostname.endsWith('.essnce.se')) return countries.se;
    if (hostname === 'essnce.no' || hostname.endsWith('.essnce.no')) return countries.no;
    if (hostname === 'essnce.dk' || hostname.endsWith('.essnce.dk')) return countries.dk;
    if (hostname === 'essnce.fi' || hostname.endsWith('.essnce.fi')) return countries.fi;

    return countries.global;
}
