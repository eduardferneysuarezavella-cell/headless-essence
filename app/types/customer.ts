export type CustomerType = {
    id: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    defaultAddress?: {
        id: string;
        formatted: string;
        firstName?: string;
        lastName?: string;
        company?: string;
        address1?: string;
        address2?: string;
        country: string;
        province?: string;
        city?: string;
        zip?: string;
        phone?: string;
    };
    addresses: {
        edges: Array<{
            node: {
                id: string;
                formatted: string;
                firstName?: string;
                lastName?: string;
                company?: string;
                address1?: string;
                address2?: string;
                country: string;
                province?: string;
                city?: string;
                zip?: string;
                phone?: string;
            };
        }>;
    };
    orders: {
        edges: Array<{
            node: {
                id: string;
                orderNumber: string;
                processedAt: string;
                financialStatus: string;
                fulfillmentStatus: string;
                currentTotalPrice: {
                    amount: string;
                    currencyCode: string;
                };
                lineItems: {
                    edges: Array<{
                        node: {
                            title: string;
                            variant?: {
                                id: string;
                                title: string;
                                image?: {
                                    url: string;
                                    altText?: string;
                                    width: number;
                                    height: number;
                                };
                            };
                            quantity: number;
                        };
                    }>;
                };
            };
        }>;
    };
}; 