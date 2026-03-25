import { json, type LoaderFunctionArgs, type MetaFunction } from '@shopify/remix-oxygen';
import { Form, NavLink, Outlet, useLoaderData } from '@remix-run/react';
import { CUSTOMER_DETAILS_QUERY } from '~/graphql/customer-account/CustomerDetailsQuery';
import { cn } from '~/lib/utils';
import { ChevronRight, FileTextIcon, HomeIcon, LogOutIcon, MapPinIcon, PackageIcon, SparklesIcon, UserIcon } from 'lucide-react';
import { MobileAccordionMenu } from '~/components/account/mobile-accordion-menu';

export const meta: MetaFunction<typeof loader> = ({ data }) => {
    return [
        { title: `Community | ESSNCE` },
        { name: 'description', content: 'Hantera ditt ESSNCE-konto, beställningar, parfymer och personliga inställningar.' },
        { name: 'robots', content: 'noindex, nofollow' }
    ];
};

export function shouldRevalidate() {
    return true;
}

export async function loader({ context }: LoaderFunctionArgs) {
    const { data, errors } = await context.customerAccount.query(
        CUSTOMER_DETAILS_QUERY,
    );

    if (errors?.length || !data?.customer) {
        throw new Error('Customer not found');
    }

    return {
        customer: data.customer,
    }
}

export default function AccountLayout() {
    const { customer } = useLoaderData<typeof loader>();

    const heading = customer
        ? customer.firstName
            ? `Välkommen, ${customer.firstName}`
            : `Välkommen till ditt konto.`
        : 'Kontoinformation';

    return (
        <div className="max-w-[1440px] mx-auto">
            <h1 className='font-heading lg:text-2xl text-xl uppercase px-4 lg:px-8 pt-8 pb-2 lg:pb-4'>{heading}</h1>

            <div className='border-t border-gray-200'>
                <div className='grid grid-cols-1 lg:grid-cols-[282px_1fr] gap-8 px-4 lg:px-8 py-8 bg-gray-50'>
                    <div className="lg:border-r lg:pr-8 border-gray-200">
                        <AccountMenu />
                    </div>
                    <main className="min-w-0">
                        <div className="">
                            <Outlet context={{ customer }} />
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}


type MenuItem = {
    to: string;
    label: string;
    icon: React.ComponentType<any>;
    end?: boolean;
};

function AccountMenu() {
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

    // Desktop Menu
    const DesktopMenu = () => (
        <nav className="hidden lg:flex flex-col gap-8 min-w-[250px] h-fit">
            <div>
                <h2 className="font-heading text-lg mb-2">Community</h2>
                <div className="flex flex-col divide-y divide-gray-200 border border-gray-200 rounded-lg bg-white">
                    {communityItems.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            end={item.end}
                            className={({ isActive }) => cn(
                                'hover:bg-gray-100 py-4 px-4 font-heading text-lg flex justify-between items-center',
                                isActive ? 'bg-gray-100 font-medium' : ''
                            )}
                        >
                            <span className="flex items-center gap-3">
                                <item.icon className="w-5 h-5" />
                                {item.label}
                            </span>
                            <ChevronRight className='w-4 h-4' />
                        </NavLink>
                    ))}
                </div>
            </div>

            <div>
                <h2 className="font-heading text-lg mb-2">Inställningar</h2>
                <div className="flex flex-col divide-y divide-gray-200 border border-gray-200 rounded-lg bg-white">
                    {settingsItems.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            end={item.end}
                            className={({ isActive }) => cn(
                                'hover:bg-gray-100 py-4 px-4 font-heading text-lg flex justify-between items-center',
                                isActive ? 'bg-gray-100 font-medium' : ''
                            )}
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
            </div>
        </nav>
    );

    return (
        <>
            <DesktopMenu />
            <MobileAccordionMenu />
        </>
    );
}

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