import { CloseButton, Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { useFetcher } from "@remix-run/react";
import { Product } from "@shopify/hydrogen/storefront-api-types";
import { CheckIcon, Loader2, XIcon } from "lucide-react";
import { useState } from "react";
import { ProductFragment } from "storefrontapi.generated";
import { match } from "ts-pattern";
import { action } from "~/routes/($locale).klavyio.submit";
import { useI18n } from "./i18n-provider";
import { useTranslation } from "~/i18n/i18n";

interface MonitorDialogProps {
    product: {
        title: string;
        selectedVariant: {
            id: string;
        };
    };
    className?: string;
    onClick?: () => void;
    children: React.ReactNode;
}

export default function MonitorDialog({ product, className, children }: MonitorDialogProps) {
    const fetcher = useFetcher<typeof action>();
    const [open, setOpen] = useState<boolean>(false);
    const { t: _ } = useTranslation();
    const handleMenuOpen = () => {
        setOpen(true);
    }

    const handleMenuClose = () => {
        setOpen(false);
    }

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        event.stopPropagation();

        handleMenuOpen();
    }

    return (
        <>
            <button
                onClick={handleClick}
                className={className}
            >
                {children}
            </button>

            <Dialog
                open={open}
                transition
                onClose={handleMenuClose}
                className="fixed inset-0 w-screen flex items-center justify-center bg-black/40 transition-all duration-200 ease-in-out data-[closed]:opacity-0 z-20"
            >
                <DialogPanel className='max-w-xl bg-white p-5 relative'>
                    <DialogTitle className='text-2xl font-heading'>{_('monitor.title', { productName: product.title })}</DialogTitle>

                    <p className="mt-2">
                        {_('monitor.description')}
                    </p>

                    <fetcher.Form
                        method='POST'
                        action='/klavyio/submit'
                        className="flex flex-col mt-4 gap-4"
                    >
                        <input
                            type="hidden"
                            name="product_id"
                            value={product.selectedVariant?.id}
                        />

                        <input
                            type="hidden"
                            name="type"
                            value="MONITOR"
                        />

                        <XIcon 
                            className='absolute top-5 right-5 text-gray-500 cursor-pointer'
                            onClick={handleMenuClose}
                            size={16}
                        />

                        {!fetcher.data && (
                            <>
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    className="border border-[#eaeaea] px-2 py-2"
                                    placeholder={_('monitor.form.placeholder')?.toString()}
                                />

                                <button
                                    type="submit"
                                    disabled={fetcher.state !== 'idle'}
                                    className="flex justify-center items-center bg-black text-white text-lg font-heading uppercase h-[45px] w-full disabled:bg-black/50 font-medium cursor-pointer"
                                >
                                    {match(fetcher.state)
                                        .with('idle', () => _('monitor.button'))
                                        .with('loading', () => <Loader2 size={16} className="animate-spin" />)
                                        .with('submitting', () => <Loader2 size={16} className="animate-spin" />)
                                        .exhaustive()}
                                </button>
                            </>
                        )}

                        {(fetcher.data && 'success' in fetcher.data) && (fetcher.data.success ? (
                            <p className="text-black">
                                🥳 {_('monitor.form.success', { productName: product.title, close: (value) => <span className="underline cursor-pointer font-medium" onClick={handleMenuClose}>{value}</span> })}
                            </p>
                        ) : (
                            <p className="text-red-500">
                                {fetcher.data.message}
                            </p>
                        ))}
                    </fetcher.Form>
                </DialogPanel>
            </Dialog>
        </>
    )
}