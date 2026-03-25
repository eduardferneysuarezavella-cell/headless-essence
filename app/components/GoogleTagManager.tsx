import { useAnalytics } from '@shopify/hydrogen';
import { useEffect } from 'react';

declare global {
    interface Window {
        dataLayer: any[];
    }
}

export function GoogleTagManager() {
    const { subscribe, register } = useAnalytics();
    const { ready } = register('Google Tag Manager');
    console.log('GTM is running');

    useEffect(() => {
        subscribe('product_viewed', () => {
            // Triggering a custom event in GTM when a product is viewed
            window.dataLayer.push({ event: 'viewed-product' });
        });

        subscribe('banner_displayed', () => {
            // Triggering a custom event in GTM when the banner is displayed
            window.dataLayer.push({ event: 'displayed-banner' });
        });

        ready();
    }, []);

    return null;
}