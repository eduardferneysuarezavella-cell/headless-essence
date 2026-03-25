import { NavLink } from "@remix-run/react";
import { cn } from "~/lib/utils";
import { HomeIcon, UserIcon, PackageIcon, SparklesIcon } from 'lucide-react';

type MenuItem = {
    to: string;
    label: string;
    icon: React.ComponentType<any>;
    end?: boolean;
};

export function MobileBottomNav() {
    const navItems: MenuItem[] = [
        {
            to: "/essentials",
            label: "Hem",
            icon: HomeIcon,
            end: true
        },
        {
            to: "/essentials/my-perfumes",
            label: "Mina parfymer",
            icon: SparklesIcon
        },
        {
            to: "/essentials/orders",
            label: "Dina beställningar",
            icon: PackageIcon
        },
        {
            to: "/essentials/profile",
            label: "Dina uppgifter",
            icon: UserIcon
        }
    ];

    return (
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
            <div className="grid grid-cols-4 gap-1 px-2">
                {navItems.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        end={item.end}
                        className={({ isActive }) => cn(
                            'flex flex-col items-center gap-1 py-3 px-2 text-sm',
                            isActive ? 'text-black' : 'text-gray-500'
                        )}
                    >
                        <item.icon className="w-6 h-6" />
                        <span className="text-xs truncate">{item.label}</span>
                    </NavLink>
                ))}
            </div>
        </nav>
    );
} 