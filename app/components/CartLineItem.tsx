import type { CartLineUpdateInput } from '@shopify/hydrogen/storefront-api-types';
import type { CartLayout } from '~/components/CartMain';
import { CartForm, Image, type OptimisticCartLine } from '@shopify/hydrogen';
import { useVariantUrl } from '~/lib/variants';
import { Link } from '@remix-run/react';
import { ProductPrice } from './ProductPrice';
import { useAside } from './Aside';
import type { CartApiQueryFragment } from 'storefrontapi.generated';
import { useI18n } from './i18n-provider';
import { useTranslation } from '~/i18n/i18n';

type CartLine = OptimisticCartLine<CartApiQueryFragment>;

/**
 * A single line item in the cart. It displays the product image, title, price.
 * It also provides controls to update the quantity or remove the line item.
 */
export function CartLineItem({
    layout,
    line,
}: {
    layout: CartLayout;
    line: CartLine;
}) {
    const { id, merchandise } = line;
    const { product, title, image, selectedOptions } = merchandise;
    const lineItemUrl = useVariantUrl(product.handle, selectedOptions);
    const { close } = useAside();

    return (
        <li key={id} className="cart-line">
            {image && (
                <Image
                    alt={title}
                    aspectRatio="1/1"
                    data={image}
                    height={125}
                    loading="lazy"
                    width={125}
                />
            )}

            <div>
                <Link
                    prefetch="intent"
                    to={lineItemUrl}
                    onClick={() => {
                        if (layout === 'aside') {
                            close();
                        }
                    }}
                >
                    <p className='text-base lg:text-xl line-clamp-2'>{product.title}</p>
                </Link>
                <div className='mb-2'>
                    <span className='text-sm'>
                        <ProductPrice price={line?.cost?.totalAmount} />
                    </span>

                    <ul>
                        {selectedOptions.filter(option => option.name !== 'Title' && option.value !== 'Default Title').map((option) => (
                            <li key={option.name} className='text-sm'>
                                {option.value}
                            </li>
                        ))}
                    </ul>
                </div>
                <div>
                    <CartLineQuantity line={line} />
                </div>
            </div>
        </li>
    );
}

/**
 * Provides the controls to update the quantity of a line item in the cart.
 * These controls are disabled when the line item is new, and the server
 * hasn't yet responded that it was successfully added to the cart.
 */
function CartLineQuantity({ line }: { line: CartLine }) {
    if (!line || typeof line?.quantity === 'undefined') return null;
    const { id: lineId, quantity, isOptimistic } = line;
    const prevQuantity = Number(Math.max(0, quantity - 1).toFixed(0));
    const nextQuantity = Number((quantity + 1).toFixed(0));

    return (
        <div className="">
            {/* <small>Quantity: {quantity} &nbsp;&nbsp;</small> */}
            <div className='flex items-center'>
                <CartLineUpdateButton lines={[{ id: lineId, quantity: prevQuantity }]}>
                    <button
                        aria-label="Decrease quantity"
                        disabled={quantity <= 1 || !!isOptimistic}
                        name="decrease-quantity"
                        className='border-y border-l border-neutral-200 h-8 px-2 flex items-center justify-center'
                        value={prevQuantity}
                    >
                        <span className='text-lg'>&#8722; </span>
                    </button>
                </CartLineUpdateButton>
                <div className='border border-neutral-200 w-8 h-8 flex items-center justify-center'>
                    {quantity}
                </div>
                <CartLineUpdateButton lines={[{ id: lineId, quantity: nextQuantity }]}>
                    <button
                        aria-label="Increase quantity"
                        name="increase-quantity"
                        className='border-y border-r border-neutral-200 h-8 px-2 flex items-center justify-center'
                        value={nextQuantity}
                        disabled={!!isOptimistic}
                    >
                        <span className='text-lg'>&#43;</span>
                    </button>
                </CartLineUpdateButton>
                &nbsp;
            </div>
            <CartLineRemoveButton lineIds={[lineId]} disabled={!!isOptimistic} />
        </div>
    );
}

/**
 * A button that removes a line item from the cart. It is disabled
 * when the line item is new, and the server hasn't yet responded
 * that it was successfully added to the cart.
 */
function CartLineRemoveButton({
    lineIds,
    disabled,
}: {
    lineIds: string[];
    disabled: boolean;
}) {
    const { t: _ } = useTranslation();

    return (
        <CartForm
            route="/cart"
            action={CartForm.ACTIONS.LinesRemove}
            inputs={{ lineIds }}
        >
            <button disabled={disabled} type="submit" className='text-xs mt-2 underline underline-offset-2 uppercase'>
                {_('layout.cart.actions.removeItem')}
            </button>
        </CartForm>
    );
}

function CartLineUpdateButton({
    children,
    lines,
}: {
    children: React.ReactNode;
    lines: CartLineUpdateInput[];
}) {
    return (
        <CartForm
            route="/cart"
            action={CartForm.ACTIONS.LinesUpdate}
            inputs={{ lines }}
        >
            {children}
        </CartForm>
    );
}
