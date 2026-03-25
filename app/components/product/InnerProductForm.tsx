import { type VariantOption as BaseVariantOption, VariantSelector } from '@shopify/hydrogen';
import { MoneyV2, ProductOption } from '@shopify/hydrogen/storefront-api-types';
import type {
    ProductFragment,
    ProductVariantFragment,
} from 'storefrontapi.generated';
import { AddToCartButton } from '~/components/AddToCartButton';
import { useAside } from '~/components/Aside';
import { ProductPriceHeading } from '../ProductPrice';
import { ReactNode, useState } from 'react';
import { useTranslation } from '~/i18n/i18n';
type VariantOption = BaseVariantOption & {
    optionValues: Array<{
        name: string;
        firstSelectableVariant?: ProductVariantFragment | null;
    }>;
};

export function InnerProductForm({
    product,
    variants,
    price,
    description,
    onVariantChange,
}: {
    product: ProductFragment;
    variants: Array<ProductVariantFragment>;
    price: MoneyV2;
    description?: ReactNode;
    onVariantChange?: (variant: ProductVariantFragment) => void;
}) {
    const { open } = useAside();
    const { t } = useTranslation();
    const [selectedVariant, setSelectedVariant] = useState<ProductVariantFragment | undefined>(variants[0]);

    return (
        <div className="flex flex-col flex-1">
            <div >
                <VariantSelector
                    handle={product.handle}
                    options={(product.options || []).filter((option) => option?.optionValues?.length > 1)}
                    variants={variants}
                >
                    {({ option }) => (
                        <ProductOptions
                            key={option.name}
                            option={option as VariantOption}
                            selectedVariant={selectedVariant}
                            onUpdate={(value) => {
                                const variant = variants.find((variant) => variant.selectedOptions.find((option) => option.name === option.name && option.value === value));

                                setSelectedVariant(variant);
                                onVariantChange?.(variant ?? variants[0]);
                            }}
                        />
                    )}
                </VariantSelector>
            </div>

            {description && (
                <p className='pt-4 pb-6'>
                    {description}
                </p>
            )}

            <div className='flex gap-4'>
                <div className='flex-1'>
                    <AddToCartButton
                        disabled={!selectedVariant || !selectedVariant.availableForSale}
                        onClick={() => open('cart')}
                        lines={selectedVariant
                            ? [{
                                merchandiseId: selectedVariant.id,
                                quantity: 1,
                                selectedVariant,
                            }]
                            : []}
                    >
                        {selectedVariant?.availableForSale ? t('product.card.purchase.addToCart') : t('product.card.purchase.watch')}
                    </AddToCartButton>
                </div>

                <ProductPriceHeading price={price} />
            </div>
        </div>
    );
}

export function ProductOptions({ option, selectedVariant, onUpdate }: { option: VariantOption, selectedVariant: ProductVariantFragment | undefined | null, onUpdate: (value: string) => void }) {
    return (
        <div className="product-options w-full" key={option.name}>
            <div className='relative'>
                <select
                    value={selectedVariant?.selectedOptions.find(({ name }) => name === option.name)?.value}
                    className="product-options-select appearance-none rounded-none mb-2 w-full px-2 py-0.5"
                    onChange={(e) => {
                        const selectedValue = e.target.value;

                        onUpdate(selectedValue);
                    }}
                >
                    {option.optionValues.map(({ name: value, firstSelectableVariant }) => (
                        <option
                            key={option.name + value}
                            value={value}
                            disabled={!firstSelectableVariant}
                        >
                            {option.name} - {value}
                        </option>
                    ))}
                </select>

                <div className="pointer-events-none absolute top-0 right-0 flex items-center px-2 py-0.5 text-gray-700">
                    <span>v</span>
                </div>
            </div>
        </div>
    );
}
