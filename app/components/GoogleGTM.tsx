"use client"

import { Script } from '@shopify/hydrogen';

export function GoogleGTM({ id }: { id: string }) {
    return (
        <>
            {/* Initialize GTM container */}
            <Script
                dangerouslySetInnerHTML={{
                    __html: `
              console.log('Initializing Google Tag Manager with ID:', "${id}");
              dataLayer = window.dataLayer || [];

              function gtag(){
                dataLayer.push(arguments)
              };

              gtag('js', new Date());
              gtag({'gtm.start': new Date().getTime(),event:'gtm.js'})
              gtag('config', "${id}");
          `,
                }}
            />

            {/* Load GTM script */}
            <Script async src={`https://www.googletagmanager.com/gtm.js?id=${id}`} />
        </>
    );
}