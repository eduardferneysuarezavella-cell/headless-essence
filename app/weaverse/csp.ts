import type { AppLoadContext } from '@shopify/remix-oxygen'

export function getWeaverseCsp(request: Request, context: AppLoadContext) {
    let url = new URL(request.url)
    // Get weaverse host from query params
    let weaverseHost = url.searchParams.get('weaverseHost') || context.env.WEAVERSE_HOST
    let isDesignMode = url.searchParams.get('weaverseHost')
    let weaverseHosts = ['*.weaverse.io', '*.shopify.com', '*.myshopify.com',]
    if (weaverseHost) {
        weaverseHosts.push(weaverseHost)
    }
    let updatedCsp: {
        [x: string]: string[] | string | boolean;
    } = {
        defaultSrc: [
            '\'self\'',
            'data:',
            'cdn.shopify.com',
            '*.youtube.com',
            'shopify.com',
            '*.cdninstagram.com',
            '*.googletagmanager.com',
            '*.google-analytics.com',
            '*.tiktok.com',
            'tiktok.com',
            ...weaverseHosts
        ],
        scriptSrc: [
            "'self'",
            "'unsafe-eval'",
            "'unsafe-inline'",
            'cdn.shopify.com',
            '*.shopify.com',
            '*.googletagmanager.com',
            '*.google-analytics.com',
            '*.gorgias.help',
            '*.gamifiera.com',
            '*.tiktok.com',
            'tiktok.com',
            ...weaverseHosts
        ],
        styleSrc: [
            '\'self\'',
            '\'unsafe-inline\'',
            'https://fonts.googleapis.com/css2',
            'https://fonts.gstatic.com',
            'https://cdn.shopify.com',
            'http://localhost:*',
            '*.gamifiera.com',
            '*.googletagmanager.com',
            ...weaverseHosts
        ],
        connectSrc: [
            '\'self\'',
            '*.instagram.com',
            '*.google-analytics.com',
            '*.analytics.google.com',
            '*.googletagmanager.com',
            '*.gamifiera.com',
            'monorail-edge.shopifysvc.com',
            '*.shopify.com',
            '*.tiktok.com',
            'tiktok.com',
            ...weaverseHosts
        ],
        styleSrcElem: [
            '\'self\'',
            '\'unsafe-inline\'',
            '*.gamifiera.com',
            'https://fonts.googleapis.com/css2',
            'https://fonts.gstatic.com',
            ...weaverseHosts
        ],
        imgSrc: [
            '\'self\'',
            'data:',
            'cdn.shopify.com',
            '*.shopify.com',
            '*.essnce.se',
            'essnce.se',
            '*.weaverse.io',
            'https://cdn.gamifiera.com',
            '*.gamifiera.com',
            'https://*.google-analytics.com',
            'https://*.googletagmanager.com',
            '*.tiktok.com',
            'tiktok.com'
        ],
        fontSrc: [
            '\'self\'',
            'data:',
            'fonts.gstatic.com',
            '*.fonts.googleapis.com',
            ...weaverseHosts
        ],
        frameSrc: [
            '*.gorgias.help',
            '*.tiktok.com',
            'tiktok.com',
            ...weaverseHosts
        ],
    }

    if (isDesignMode) {
        updatedCsp.frameAncestors = ['*']
    }
    return updatedCsp
}