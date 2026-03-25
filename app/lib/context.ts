import { createHydrogenContext } from '@shopify/hydrogen';
import { AppSession } from '~/lib/session';
import { CART_QUERY_FRAGMENT } from '~/lib/fragments';
import { WeaverseClient } from '@weaverse/hydrogen';
import { themeSchema } from '~/weaverse/schema';
import { components } from '~/weaverse/component';
import { redirect } from '@remix-run/server-runtime';
import { getLocale } from '~/i18n/i18n.server';

// Function to get country from request headers
function getCountryFromHeaders(request: Request): string | null {
    // Common headers that might contain country information
    const cfCountry = request.headers.get('cf-ipcountry');
    if (cfCountry) return cfCountry;

    const xCountry = request.headers.get('x-country-code');
    if (xCountry) return xCountry;

    return null;
}

export async function createAppLoadContext(
    request: Request,
    env: Env,
    executionContext: ExecutionContext,
) {
    if (!env?.SESSION_SECRET) {
        throw new Error('SESSION_SECRET environment variable is not set');
    }

    const waitUntil = executionContext.waitUntil.bind(executionContext);
    const [cache, session] = await Promise.all([
        caches.open('hydrogen'),
        AppSession.init(request, [env.SESSION_SECRET]),
    ]);

    // Get country from request headers
    const detectedCountry = getCountryFromHeaders(request);

    const { locale, storefront, translations } = await getLocale({
        cache,
        request,
        waitUntil,
    });

    const hydrogenContext = createHydrogenContext({
        env,
        request,
        cache,
        waitUntil,
        session,
        i18n: {
            language: locale.language,
            country: locale.country
        },
        cart: {
            queryFragment: CART_QUERY_FRAGMENT,
        },
        customerAccount: {
            customAuthStatusHandler: () => {
                const { pathname } = new URL(request.url);
                const redirectTo = `/account/login?${new URLSearchParams({ return_to: pathname }).toString()}`;
                return redirect(redirectTo);
            },
        }
    });

    return {
        ...hydrogenContext,
        cache,
        waitUntil,
        i18n: {
            locale,
            translations,
        },
        detectedCountry,
        weaverse: new WeaverseClient({
            ...hydrogenContext,
            request,
            cache,
            themeSchema,
            components,
        }),
    };
}
