import { Money, useMoney } from '@shopify/hydrogen';
import type { MoneyV2 } from '@shopify/hydrogen/storefront-api-types';
import { cn } from '~/lib/utils';

interface ProductPriceProps {
    price: MoneyV2 | undefined;
    className?: string;
}

export function ProductPrice({ price, className }: ProductPriceProps) {
    const money = price ? useMoney(price) : { withoutTrailingZerosAndCurrency: '0', currencyNarrowSymbol: 'kr' };

    return <span className={cn(className)}>{`${money.withoutTrailingZerosAndCurrency} ${money.currencyNarrowSymbol?.toUpperCase()}`}</span>
}

export function ProductPriceHeading({ price, className }: ProductPriceProps) {
    return (
        <div className={cn("product-price font-heading text-[30px]", className)}>
            <ProductPrice price={price} />
        </div>
    );
}
