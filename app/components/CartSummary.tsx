import type { CartApiQueryFragment } from 'storefrontapi.generated';
import type { CartLayout } from '~/components/CartMain';
import { CartForm, Money, type OptimisticCart } from '@shopify/hydrogen';
import { useRef } from 'react';
import { FetcherWithComponents } from '@remix-run/react';
import { useI18n } from './i18n-provider';
import { useTranslation } from '~/i18n/i18n';

type CartSummaryProps = {
    cart: OptimisticCart<CartApiQueryFragment | null>;
    layout: CartLayout;
};

export function CartSummary({ cart, layout }: CartSummaryProps) {
    const className =
        layout === 'page' ? 'cart-summary-page' : 'cart-summary-aside';

    return (
        <div aria-labelledby="cart-summary" className={'md:absolute fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 pt-6 text-center px-4'}>
            <CartCheckoutActions checkoutUrl={cart.checkoutUrl} cart={cart} />
        </div>
    );
}
function CartCheckoutActions({ checkoutUrl, cart }: { checkoutUrl?: string, cart?: OptimisticCart<CartApiQueryFragment | null> }) {
    const { t: _ } = useTranslation();
    
    if (!checkoutUrl) return null;

    const total = cart?.cost?.totalAmount?.amount
        ? <Money data={cart.cost.totalAmount} />
        : '-';

    return (
        <div className='w-full'>
            <a href={checkoutUrl} target="_self">
                <button className='bg-black text-white text-md font-heading uppercase h-[45px] w-full disabled:bg-black/50 font-medium cursor-pointer flex justify-between items-center px-4'>
                    <span>{_('layout.cart.checkout')}</span>
                    <span>{total}</span>
                </button>
            </a>
            <br />
        </div>
    );
}

function CartDiscounts({
    discountCodes,
}: {
    discountCodes?: CartApiQueryFragment['discountCodes'];
}) {
    const codes: string[] =
        discountCodes
            ?.filter((discount) => discount.applicable)
            ?.map(({ code }) => code) || [];

    return (
        <div>
            {/* Have existing discount, display it with a remove option */}
            <dl hidden={!codes.length}>
                <div>
                    <dt>Discount(s)</dt>
                    <UpdateDiscountForm>
                        <div className="cart-discount">
                            <code>{codes?.join(', ')}</code>
                            &nbsp;
                            <button>Remove</button>
                        </div>
                    </UpdateDiscountForm>
                </div>
            </dl>

            {/* Show an input to apply a discount */}
            <UpdateDiscountForm discountCodes={codes}>
                <div>
                    <input type="text" name="discountCode" placeholder="Discount code" />
                    &nbsp;
                    <button type="submit">Apply</button>
                </div>
            </UpdateDiscountForm>
        </div>
    );
}

function UpdateDiscountForm({
    discountCodes,
    children,
}: {
    discountCodes?: string[];
    children: React.ReactNode;
}) {
    return (
        <CartForm
            route="/cart"
            action={CartForm.ACTIONS.DiscountCodesUpdate}
            inputs={{
                discountCodes: discountCodes || [],
            }}
        >
            {children}
        </CartForm>
    );
}

function CartGiftCard({
    giftCardCodes,
}: {
    giftCardCodes: CartApiQueryFragment['appliedGiftCards'] | undefined;
}) {
    const appliedGiftCardCodes = useRef<string[]>([]);
    const giftCardCodeInput = useRef<HTMLInputElement>(null);
    const codes: string[] =
        giftCardCodes?.map(({ lastCharacters }) => `***${lastCharacters}`) || [];

    function saveAppliedCode(code: string) {
        const formattedCode = code.replace(/\s/g, ''); // Remove spaces
        if (!appliedGiftCardCodes.current.includes(formattedCode)) {
            appliedGiftCardCodes.current.push(formattedCode);
        }
        giftCardCodeInput.current!.value = '';
    }

    function removeAppliedCode() {
        appliedGiftCardCodes.current = [];
    }

    return (
        <div>
            {/* Have existing gift card applied, display it with a remove option */}
            <dl hidden={!codes.length}>
                <div>
                    <dt>Applied Gift Card(s)</dt>
                    <UpdateGiftCardForm>
                        <div className="cart-discount">
                            <code>{codes?.join(', ')}</code>
                            &nbsp;
                            <button onSubmit={() => removeAppliedCode}>Remove</button>
                        </div>
                    </UpdateGiftCardForm>
                </div>
            </dl>

            {/* Show an input to apply a discount */}
            <UpdateGiftCardForm
                giftCardCodes={appliedGiftCardCodes.current}
                saveAppliedCode={saveAppliedCode}
            >
                <div>
                    <input
                        type="text"
                        name="giftCardCode"
                        placeholder="Gift card code"
                        ref={giftCardCodeInput}
                    />
                    &nbsp;
                    <button type="submit">Apply</button>
                </div>
            </UpdateGiftCardForm>
        </div>
    );
}

function UpdateGiftCardForm({
    giftCardCodes,
    saveAppliedCode,
    children,
}: {
    giftCardCodes?: string[];
    saveAppliedCode?: (code: string) => void;
    removeAppliedCode?: () => void;
    children: React.ReactNode;
}) {
    return (
        <CartForm
            route="/cart"
            action={CartForm.ACTIONS.GiftCardCodesUpdate}
            inputs={{
                giftCardCodes: giftCardCodes || [],
            }}
        >
            {(fetcher: FetcherWithComponents<any>) => {
                const code = fetcher.formData?.get('giftCardCode');
                if (code) saveAppliedCode && saveAppliedCode(code as string);
                return children;
            }}
        </CartForm>
    );
}
