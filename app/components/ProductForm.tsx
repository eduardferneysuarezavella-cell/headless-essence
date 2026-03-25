import { Link } from '@remix-run/react';
import { MappedProductOptions, type VariantOption as BaseVariantOption, VariantSelector, VariantOption } from '@shopify/hydrogen';
import { MoneyV2, ProductOption, ProductOptionValue } from '@shopify/hydrogen/storefront-api-types';
import type {
    ProductFragment,
    ProductVariantFragment,
} from 'storefrontapi.generated';
import { AddToCartButton } from '~/components/AddToCartButton';
import { useAside } from '~/components/Aside';
import { ProductPriceHeading } from './ProductPrice';
import { AnimatePresence, motion, useScroll } from 'framer-motion';
import { useState, useEffect } from 'react';
import MonitorDialog from './MonitorDialog';
import { createPortal } from 'react-dom';
import { useI18n } from './i18n-provider';
import { useTranslation } from '~/i18n/i18n';

export function ProductForm({
    product,
    selectedVariant,
    price,
    productOptions,
}: {
    product: ProductFragment;
    selectedVariant: ProductVariantFragment;
    productOptions: MappedProductOptions[];
    price: MoneyV2;
}) {
    const { open } = useAside();
    const { scrollY } = useScroll();
    const [isFixed, setIsFixed] = useState(false);
    const [isMounted, setMounted] = useState(false);
    const { t: _ } = useTranslation();

    useEffect(() => {
        return scrollY.on("change", (latest) => {
            setIsFixed(latest > window.innerHeight);
        });
    }, [scrollY]);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <div className="flex flex-col flex-1">
            {productOptions?.length > 0 && productOptions[0]?.optionValues?.length > 1 && (
                <div >
                    <VariantSelector
                        handle={product.handle}
                        options={productOptions}
                        variants={product.variants.nodes}
                    >
                        {({ option }) => <ProductOptions key={option.name} option={option} selectedVariant={selectedVariant} product={product} />}
                    </VariantSelector>
                </div>
            )}

            <div className='flex gap-4'>
                {isMounted && createPortal(
                    <AnimatePresence>
                        {isFixed && (
                            <motion.div
                                key={isFixed ? 'fixed' : 'relative'}
                                className={`md:hidden basis-0 block ${isFixed ? 'fixed bottom-0 left-0 right-0 px-4 pb-4 shadow-lg' : ''}`}
                                initial={{ y: 100, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: 100, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                            >
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
                                    buttonClassName="w-full flex justify-between items-center px-4 text-base"
                                >
                                    <span>{selectedVariant?.availableForSale ? _('product.card.purchase.addToCart') : _('product.card.purchase.watch')}</span>
                                    <ProductPriceHeading price={price} className="text-base" />
                                </AddToCartButton>
                            </motion.div>
                        )}
                    </AnimatePresence>,
                    document.body
                )}

                <div className='flex-1'>
                    {selectedVariant?.availableForSale ? (
                        <AddToCartButton
                            disabled={!selectedVariant || !selectedVariant.availableForSale}
                            onClick={() => open('cart')}
                            buttonClassName='w-full'
                            lines={selectedVariant
                                ? [{
                                    merchandiseId: selectedVariant.id,
                                    quantity: 1,
                                    selectedVariant,
                                }]
                                : []}
                        >
                            {selectedVariant?.availableForSale ? _('product.card.purchase.addToCart') : _('product.card.purchase.watch')}
                        </AddToCartButton>
                    ) : (
                        <MonitorDialog
                            className='w-full'
                            product={{
                                title: product.title,
                                selectedVariant: {
                                    id: selectedVariant?.id ?? product.variants.nodes[0].id,
                                },
                            }}
                        >
                            <div className='flex justify-center items-center bg-black text-white text-lg font-heading uppercase h-[45px] w-full disabled:bg-black/50 font-medium cursor-pointer opacity-50'>
                                {_('product.card.purchase.watch')}
                            </div>
                        </MonitorDialog>
                    )}
                </div>
                <div>
                    <ProductPriceHeading price={price} />
                </div>
            </div>
        </div>
    );
}

interface ProductOptionsProps {
    option: BaseVariantOption;
    selectedVariant: ProductVariantFragment | undefined | null;
    product: ProductFragment;
}

export function ProductOptions({ option, selectedVariant, product }: ProductOptionsProps) {
    const [selectedValue, setSelectedValue] = useState(selectedVariant?.selectedOptions.find(({ name }) => name === option.name)?.value);

    return (
        <div className="product-options w-full" key={option.name}>
            <div className='relative'>
                <select
                    value={selectedValue}
                    className='appearance-none w-full mb-4 px-2 rounded-none'
                    onChange={(event) => {
                        const selectedValue = event.target.value;
                        setSelectedValue(selectedValue);

                        const selectedOption = option.values.find(({ value }) => value === selectedValue);
                        if (selectedOption?.isAvailable) {
                            window.location.href = selectedOption.search;
                        }
                    }}
                >
                    {option.values.map(({ value, isAvailable, search }) => (
                        <option
                            key={option.name + value}
                            value={value}
                            disabled={!isAvailable}
                            data-search={search}
                        >
                            {option.name} - {value}
                        </option>
                    ))}
                </select>

                <div className="pointer-events-none absolute top-0 right-0 flex items-center px-2 text-gray-700 py-0.5">
                    <span>v</span>
                </div>
            </div>
        </div>
    );
}
