import { type FetcherWithComponents } from '@remix-run/react';
import { AnalyticsEventName, CartForm, getClientBrowserParameters, sendShopifyAnalytics, ShopifyAddToCartPayload, type OptimisticCartLineInput } from '@shopify/hydrogen';
import { useEffect } from 'react';
import { useAside } from './Aside';
import { Loader2 } from 'lucide-react';
import { cn } from '~/lib/utils';
import { usePageAnalytics } from '~/hooks/usePageAnalytics';

export function AddToCartButton({
    analytics,
    children,
    disabled,
    lines,
    buttonClassName = '',
    onClick,
}: {
    analytics?: unknown;
    children: React.ReactNode;
    disabled?: boolean;
    lines: Array<OptimisticCartLineInput>;
    buttonClassName?: string;
    onClick?: () => void;
}) {
    return (
        <CartForm route="/cart" inputs={{ lines }} action={CartForm.ACTIONS.LinesAdd}>
            {(fetcher: FetcherWithComponents<any>) => (
                <AddToCartButtonInner
                    fetcher={fetcher}
                    children={children}
                    disabled={disabled}
                    analytics={analytics}
                    onClick={onClick}
                    buttonClassName={buttonClassName}
                />
            )}
        </CartForm>
    );
}

export const AddToCartButtonInner = ({ fetcher, children, disabled, analytics, onClick, buttonClassName }: { fetcher: FetcherWithComponents<any>, children: React.ReactNode, disabled?: boolean, analytics?: unknown, onClick?: () => void, buttonClassName?: string }) => {
    useEffect(() => {
        if (fetcher.state === 'idle' && fetcher.data) {
            onClick?.();
        }
    }, [fetcher.state]);

    return (
        <AddToCartAnalytics fetcher={fetcher}>
            <input
                name="analytics"
                type="hidden"
                value={JSON.stringify(analytics)}
            />
            <button
                type="submit"
                disabled={disabled || fetcher.state !== 'idle'}
                className={cn(
                    'flex justify-center items-center bg-black text-white text-lg font-heading uppercase h-[45px] w-full disabled:bg-black/50 font-medium cursor-pointer',
                    buttonClassName
                )}
            >
                {fetcher.state === 'idle' ? children : <Loader2 className='animate-spin' />}
            </button>
        </AddToCartAnalytics>
    );
};

function AddToCartAnalytics({
    fetcher, 
    children
}: {
    fetcher: FetcherWithComponents<any>,
    children: React.ReactNode
}) {
    const fetcherData = fetcher.data;
    const formData = fetcher.formData;
    const pageAnalytics = usePageAnalytics({ hasUserConsent: true });

    useEffect(() => {
        if (formData) {
            const cartData: Record<string, unknown> = {};
            const cartInputs = CartForm.getFormInput(formData);

            try {
                if (cartInputs.inputs.analytics) {
                    const dataInForm: unknown = JSON.parse(
                        String(cartInputs.inputs.analytics)
                    );

                    Object.assign(cartData, dataInForm);
                }
            } catch {

            }

            if (Object.keys(cartData).length && fetcherData) {
                const addToCartPayload: ShopifyAddToCartPayload = {
                    ...getClientBrowserParameters(),
                    ...pageAnalytics,
                    ...cartData,
                    cartId: fetcherData.cart.id,
                };

                try {
                    sendShopifyAnalytics({
                        eventName: AnalyticsEventName.ADD_TO_CART,
                        payload: addToCartPayload,
                    });
                } catch (error) {
                    console.error('Failed to send Shopify analytics:', error);
                    // Continue execution even if analytics fails
                }
            }
        }
    }, [fetcherData, formData, pageAnalytics]);

    return <>{children}</>
}