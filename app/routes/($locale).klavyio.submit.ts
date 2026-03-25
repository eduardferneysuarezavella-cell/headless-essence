import { ActionFunctionArgs, json, LoaderFunctionArgs, redirect } from "@shopify/remix-oxygen";

export const loader = async ({ request }: LoaderFunctionArgs) => {
    if (request.method === 'GET') {
        return redirect('/404');
    }
};

export const action = async ({ request, context }: ActionFunctionArgs) => {
    if (request.method !== 'POST') {
        return json({ error: 'Method not allowed' }, { status: 405 });
    }

    const formData = await request.formData();
    const type = formData.get('type');
    const email = formData.get('email');

    if (type === 'NEWSLETTER') {
        const listId = formData.get('list_id');

        if (!email || !listId) {
            return json({ error: 'Missing required fields' }, { status: 400 });
        }

        const subscribedObject = {
            email: {
                marketing: {
                    consent: 'SUBSCRIBED',
                }
            }
        }

        const profiles: any = {
            data: [
                {
                    type: 'profile',
                    attributes: {
                        email: email,
                        subscriptions: subscribedObject
                    },
                }
            ]
        };

        try {
            const response = await fetch(
                'https://a.klaviyo.com/api/profile-subscription-bulk-create-jobs/',
                {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        Revision: '2024-02-15',
                        'Content-Type': 'application/json',
                        Authorization: `Klaviyo-API-Key ${context.env.KLAVYIO_API_KEY}`,
                    },
                    body: JSON.stringify({
                        data: {
                            type: 'profile-subscription-bulk-create-job',
                            attributes: {
                                profiles: profiles,
                            },
                            relationships: {
                                list: {
                                    data: {
                                        type: 'list',
                                        id: listId,
                                    },
                                },
                            },
                        },
                    }),
                }
            );

            if (response.status >= 200 && response.status < 300) {
                return json({ success: true, message: 'Prenumerationen lyckades.' });
            } else {
                const error = await response.json();

                let errors: any[] = [];

                if (error && typeof error === 'object' && 'errors' in error && Array.isArray(error.errors)) {
                    errors = error?.errors;
                } else {
                    errors = [{
                        status: 500,
                        code: 'internal_error',
                        title: 'Internal Server Error',
                        detail: 'An internal server error occurred while subscribing to the newsletter.',
                    }]
                }

                return json({ success: false, message: 'Misslyckades att prenumerera till vårt nyhetsbrev.', errors: errors });
            }
        } catch (error) {
            console.error('Klavyio API Error:', error);
            return json({ success: false, message: 'Misslyckades att prenumerera till vårt nyhetsbrev.' });
        }
    } else if (type === 'MONITOR') {
        const productId = formData.get('product_id')?.toString();

        if (!email || !productId) {
            return json({ error: 'Missing required fields' }, { status: 400 });
        }

        try {
            const response = await fetch(
                'https://a.klaviyo.com/api/back-in-stock-subscriptions',
                {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        Revision: '2024-02-15',
                        'Content-Type': 'application/json',
                        Authorization: `Klaviyo-API-Key ${context.env.KLAVYIO_API_KEY}`,
                    },
                    body: JSON.stringify({
                        data: {
                            type: 'back-in-stock-subscription',
                            attributes: {
                                profile: {
                                    data: {
                                        type: 'profile',
                                        attributes: {
                                            email: email,
                                        },
                                    }
                                },
                                channels: ["EMAIL"],
                            },
                            relationships: {
                                variant: {
                                    data: {
                                        type: 'catalog-variant',
                                        id: `$shopify:::$default:::${productId.replace('gid://shopify/ProductVariant/', '')}`,
                                    },
                                },
                            },
                        },
                    }),
                }
            );

            if (response.status >= 200 && response.status < 300) {
                return json({ success: true, message: 'Prenumerationen lyckades.' });
            } else {
                const error = await response.json();

                let errors: any[] = [];

                if (error && typeof error === 'object' && 'errors' in error && Array.isArray(error.errors)) {
                    errors = error?.errors;
                } else {
                    errors = [{
                        status: 500,
                        code: 'internal_error',
                        title: 'Internal Server Error',
                        detail: 'An internal server error occurred while subscribing to the newsletter.',
                    }]
                }

                return json({ success: false, message: 'Misslyckades att prenumera till vår newsletter.', errors: errors });
            }
        } catch (error) {
            console.error('Klavyio API Error:', error);
            return json({ success: false, message: 'Misslyckades att prenumerera till vårt nyhetsbrev.' });
        }
    }
}