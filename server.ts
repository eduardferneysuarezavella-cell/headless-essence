// @ts-ignore
// Virtual entry point for the app
import * as remixBuild from 'virtual:remix/server-build';
import { createWithCache, storefrontRedirect } from '@shopify/hydrogen';
import { createRequestHandler } from '@shopify/remix-oxygen';
import { createAppLoadContext } from '~/lib/context';
import { createWeaverseClient } from '~/weaverse/weaverse.server';
import { createGamifieraClient } from '~/lib/gamifiera.server';

/**
 * Export a fetch handler in module format.
 */
export default {
    async fetch(
        request: Request,
        env: Env,
        executionContext: ExecutionContext,
    ): Promise<Response> {
        try {
            if (request.url.includes('/cdn/')) {
                const cdnUrl = new URL(request.url.replace('essnce.se', 'essnce-se.myshopify.com'));
                return fetch(cdnUrl);
            }

            const appLoadContext = await createAppLoadContext(request, env, executionContext);
            const withCache = createWithCache({ 
                cache: appLoadContext.cache, 
                waitUntil: appLoadContext.waitUntil, 
                request 
            });

            const handleRequest = createRequestHandler({
                build: remixBuild,
                mode: process.env.NODE_ENV,
                getLoadContext: () => ({
                    ...appLoadContext,
                    withCache,
                }),
            });

            const gamifieraClient = createGamifieraClient({
                cache: appLoadContext.cache,
                waitUntil: appLoadContext.waitUntil,
                request
            });

            const response = await handleRequest(request);

            if (response.status === 404) {
                return storefrontRedirect({ request, response, storefront: appLoadContext.storefront });
            }

            // Handle Gamifiera token
            const token = appLoadContext.session.get('gamifieraToken');
            if (!token && await appLoadContext.customerAccount.isLoggedIn()) {
                const customerInfo = await appLoadContext.customerAccount.query('query { customer { id } }');
                try {
                    const gamifieraResponse = await gamifieraClient.query<{ token: string }>(
                        customerInfo.data.customer.id, 
                        env.GAMIFIERA_API_KEY
                    );
                    if (gamifieraResponse?.token) {
                        appLoadContext.session.set('gamifieraToken', gamifieraResponse.token);
                    }
                } catch (error) {
                    console.error(`[Gamifiera] Token fetch error - ${customerInfo.data.customer.id}`);
                }
            }

            if (appLoadContext.session.isPending) {
                response.headers.set('Set-Cookie', await appLoadContext.session.commit());
            }

            return response;
        } catch (error) {
            console.error(error);
            return new Response('An unexpected error occurred', { status: 500 });
        }
    },
};
