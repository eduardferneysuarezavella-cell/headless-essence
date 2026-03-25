import { LocaleStrategy } from "./types";
import { getLocaleFromRequest, Locale } from "~/lib/i18n";
import { countries } from "~/data/countries";
import { CacheLong, createWithCache, I18nBase } from "@shopify/hydrogen";
import { CountryCode, LanguageCode } from "@shopify/hydrogen/storefront-api-types";

export async function getLocale({
    cache,
    request,
    waitUntil,
}: {
    cache: Cache,
    request: Request,
    waitUntil: (promise: Promise<any>) => void,
}) {
    const locale = getLocaleFromRequest({
        request,
    });

    const storefrontParsedLocale: I18nBase = {
        country: locale.country.toUpperCase() as CountryCode,
        language: locale.language.toUpperCase() as LanguageCode,
    };

    if (!locale) {
        return {
            locale: countries.global,
            storefront: storefrontParsedLocale
        }
    }

    const translations = await getLocaleJSON({
        cache,
        locale,
        request,
        waitUntil,
    });

    return {
        locale,
        storefront: storefrontParsedLocale,
        translations,
    }
};


type GetLocaleJSONOptions = {
    cache: Cache,
    locale: Locale,
    request: Request,
    waitUntil: (promise: Promise<any>) => void,
}

export async function getLocaleJSON({ cache, locale, request, waitUntil }: GetLocaleJSONOptions) {
    const withCache = createWithCache({ cache, waitUntil, request });

    return await withCache.run({
        cacheKey: ['i18n-locale-json', locale.language.toLowerCase()],
        cacheStrategy: CacheLong(),
        shouldCacheResult: (result) => result !== null,
    }, async () => {
        try {
            return await import(`./../../public/locales/${locale.language.toLowerCase()}.json`);
        } catch (error) {
            console.error(`Failed to fetch translations for ${locale.language}`, error);
            return null;
        }
    });
};