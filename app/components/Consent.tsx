import { useAnalytics, useLoadScript } from "@shopify/hydrogen";
import { useCallback, useEffect } from "react";

type ThirdPartyConsentType = 'marketing' | 'analytics' | 'preferences' | 'sale_of_data';

declare global {
    interface Window {
        ThirdPartyConsent: {
            onChange: (consent: any) => void;
            types: Array<ThirdPartyConsentType>;
        }
    }
}


const thirdPartyConsentSdkUrl = `https://cdn.shopify.com/shopifycloud/consent-tracking-api/v0.1/consent-tracking-api.js`;
const pandectesGdprUrl = `https://st.pandect.es/essnce-se/pandectes-rules.js`;
const pandectesGdprUrl2 = `https://gdpr-static.s3.us-east-1.amazonaws.com/c/pandectes-core.js?storeId=55146119308`;

export function GDPRConsent() {    
    useLoadScript(thirdPartyConsentSdkUrl);
    useLoadScript(pandectesGdprUrl);
    useLoadScript(pandectesGdprUrl2);

    return null;
}

export function getThirdPartyConsentStatus(type: string): boolean {
    try {
        return window.ThirdPartyConsent.types.includes(type);
    } catch (e) {
        return false;
    }
}