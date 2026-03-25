import { useLocation } from "@remix-run/react";
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { cn } from "~/lib/utils";
import { ArrowLeftIcon } from "lucide-react";

/**
 * Drawer component that opens on user click.
 * @param heading - string. Shown at the top of the drawer.
 * @param open - boolean state. if true opens the drawer.
 * @param onClose - function should set the open state.
 * @param openFrom - right, left
 * @param children - react children node.
 */
export function Drawer({
    heading,
    open,
    onClose,
    openFrom = "right",
    isForm,
    isBackMenu = false,
    children,
}: {
    heading?: string;
    open: boolean;
    onClose: () => void;
    openFrom: "right" | "left" | "top";
    children: React.ReactNode;
    isForm?: "cart" | "search" | "menu" | "filter";
    isBackMenu?: boolean;
}) {
    const offScreen = {
        right: "translate-x-full",
        left: "-translate-x-full",
        top: "-translate-y-full",
    };

    const maxWidth = isForm === "cart" ? "max-w-[420px]" : "max-w-96";

    return (
        <Transition appear show={open} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <TransitionChild
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 left-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="text-body fixed inset-0 bg-opacity-25" />
                </TransitionChild>

                <div className="fixed inset-0">
                    <TransitionChild
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 left-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="text-body fixed inset-0 bg-black/40 transition-opacity duration-300" />
                    </TransitionChild>

                    <div className={`fixed inset-y-0 flex max-w-full ${openFrom === "right" ? "right-0" : ""}`}>
                        <TransitionChild
                            as={Fragment}
                            enter="transform transition ease-in-out duration-500"
                            enterFrom={offScreen[openFrom]}
                            enterTo="translate-x-0"
                            leave="transform transition ease-in-out duration-500"
                            leaveFrom="translate-x-0"
                            leaveTo={offScreen[openFrom]}
                        >
                            <DialogPanel
                                className={cn(
                                    "transform text-left align-middle shadow-lg transition-all",
                                    openFrom === "left"
                                        ? `h-screen-dynamic w-screen ${maxWidth}`
                                        : openFrom === "top"
                                            ? "h-fit w-screen"
                                            : `h-screen-dynamic w-screen ${maxWidth}`,
                                    isForm === "cart" || isForm === "filter"
                                        ? "bg-background-basic"
                                        : "bg-background-subtle-1"
                                )}
                            >
                                {children}
                            </DialogPanel>
                        </TransitionChild>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}

/* Use for associating arialabelledby with the title*/

export function useDrawer(openDefault = false) {
    let { pathname } = useLocation();
    const [open, setOpen] = useState(openDefault);

    useEffect(() => {
        if (open) {
            closeDrawer();
        }
    }, [pathname]);

    function openDrawer() {
        setOpen(true);
    }

    function closeDrawer() {
        setOpen(false);
    }

    return {
        isOpen: open,
        openDrawer,
        closeDrawer,
    };
}