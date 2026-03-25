import { Form, NavLink } from "@remix-run/react";
import { cn } from "~/lib/utils";
import { ChevronDown, ChevronRight, FileTextIcon, HomeIcon, LogOutIcon, MapPinIcon, PackageIcon, SparklesIcon, UserIcon } from 'lucide-react';
import { useState } from "react";

type MenuItem = {
    to: string;
    label: string;
    icon: React.ComponentType<any>;
    end?: boolean;
};

function Logout() {
    return (
        <Form className="account-logout" method="POST" action="/account/logout">
            <button type="submit" className='flex items-center gap-2 px-4 py-4 text-sm w-full hover:bg-gray-50' >
                <LogOutIcon className='w-5 h-5' />
                Logga ut från ditt konto
            </button>
        </Form>
    );
}

export function MobileAccordionMenu() {
    const [activeSection, setActiveSection] = useState<'menu' | null>(null);

    const communityItems: MenuItem[] = [
        {
            to: "/essentials",
            label: "Hem",
            icon: HomeIcon,
            end: true
        },
        {
            to: "/essentials/about-me",
            label: "Om mig",
            icon: UserIcon
        },
        {
            to: "/essentials/my-content",
            label: "Mitt innehåll",
            icon: FileTextIcon
        },
        {
            to: "/essentials/my-perfumes",
            label: "Mina parfymer",
            icon: SparklesIcon
        }
    ];

    const settingsItems: MenuItem[] = [
        {
            to: "/essentials/orders",
            label: "Dina beställningar",
            icon: PackageIcon
        },
        {
            to: "/essentials/profile",
            label: "Dina uppgifter",
            icon: UserIcon
        },
        {
            to: "/essentials/addresses",
            label: "Dina adresser",
            icon: MapPinIcon
        }
    ];

    const allItems = [...communityItems, ...settingsItems];

    return (
        <div className="lg:hidden relative">
            <button
                onClick={() => setActiveSection(activeSection === 'menu' ? null : 'menu')}
                className="w-full flex justify-between items-center p-4 bg-white border border-gray-200"
            >
                <span className="font-heading text-lg flex items-center gap-3">
                    <HomeIcon className="w-5 h-5" />
                    Meny
                </span>
                <ChevronDown className={cn(
                    'w-5 h-5 transition-transform',
                    activeSection === 'menu' ? 'rotate-180' : ''
                )} />
            </button>
            {activeSection === 'menu' && (
                <div className="absolute top-full left-0 right-0 z-50 bg-white flex flex-col divide-y divide-gray-200 border-x border-b border-gray-200 max-h-[calc(100vh-200px)] overflow-y-auto">
                    {allItems.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            end={item.end}
                            className={({ isActive }) => cn(
                                'hover:bg-gray-50 py-4 px-4 font-heading text-lg flex justify-between items-center',
                                isActive ? 'bg-gray-50 font-medium' : ''
                            )}
                            onClick={() => setActiveSection(null)}
                        >
                            <span className="flex items-center gap-3">
                                <item.icon className="w-5 h-5" />
                                {item.label}
                            </span>
                            <ChevronRight className='w-4 h-4' />
                        </NavLink>
                    ))}
                    <Logout />
                </div>
            )}
        </div>
    );
} 