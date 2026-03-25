import { CacheLong, CachingStrategy, createWithCache } from "@shopify/hydrogen";

export function createGamifieraClient({
    cache,
    waitUntil,
    request,
}: {
    cache: Cache;
    waitUntil: ExecutionContext['waitUntil'];
    request: Request;
}) {
    const withCache = createWithCache({ cache, waitUntil, request });

    async function query<T = any>(
        customerId: string,
        apiKey: string,
        options: {
            variables?: object;
            cacheStrategy?: CachingStrategy;
        } = { variables: {}, cacheStrategy: CacheLong() },
    ) {
        const customer = customerId.replace('gid://shopify/Customer/', '');

        const result = await withCache.fetch<T>(
            `https://api.gamifiera.com/v1/auth/customer-token/${customer}`,
            {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    'X-API-Key': apiKey,
                },
            },
            {
                cacheKey: ['gamifiera', query, JSON.stringify(options.variables)],
                cacheStrategy: options.cacheStrategy,
                shouldCacheResponse: (body: T) => true
            },
        );
        return result.data;
    }

    return { query };
}