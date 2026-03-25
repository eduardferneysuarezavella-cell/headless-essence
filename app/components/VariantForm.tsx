import { Link } from '@remix-run/react';
import { type VariantOption, VariantSelector } from '@shopify/hydrogen';
import type {
    ProductFragment,
    ProductVariantFragment,
} from 'storefrontapi.generated';
import { AddToCartButton } from '~/components/AddToCartButton';
import { useAside } from '~/components/Aside';
import { useI18n } from '~/components/i18n-provider';
import { useTranslation } from '~/i18n/i18n';

export function VariantForm({ variant }: { variant: ProductVariantFragment | undefined }) {
    const { open } = useAside();
    const { t: _ } = useTranslation();
    return (
        <div className="product-form flex-1">
            <AddToCartButton
                disabled={!variant || !variant.availableForSale}
                onClick={() => open('cart')}
                lines={variant
                    ? [{
                        merchandiseId: variant.id,
                        quantity: 1,
                        selectedVariant: variant,
                    }]
                    : []}
            >
                {variant?.availableForSale ? _('product.card.purchase.addToCart') : _('product.card.purchase.watch')}
            </AddToCartButton>
        </div>
    );
}
