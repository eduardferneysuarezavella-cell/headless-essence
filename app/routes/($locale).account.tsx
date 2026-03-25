import { LoaderFunctionArgs, json } from "@shopify/remix-oxygen";
import { Outlet, useLoaderData, Link, Form } from "@remix-run/react";
import { CUSTOMER_DETAILS_QUERY } from '~/graphql/customer-account/CustomerDetailsQuery';
import { useI18n } from '~/components/i18n-provider';
import { useTranslation } from "~/i18n/i18n";

export async function loader({ context }: LoaderFunctionArgs) {
    const { customerAccount } = context;
    await customerAccount.handleAuthStatus();

    const { data, errors } = await customerAccount.query(CUSTOMER_DETAILS_QUERY);

    if (errors?.length || !data?.customer) {
        throw new Error('Customer not found');
    }

    return json({ customer: data.customer });
}

export default function AccountLayout() {
    const { customer } = useLoaderData<typeof loader>();
    const { t: _ } = useTranslation();

    return (
        <div className="account-layout max-w-[1440px] mx-auto">
            <h1 className="font-heading lg:text-2xl text-xl uppercase px-4 lg:px-8 pt-8 pb-2 lg:pb-4">
                {customer.firstName 
                    ? _('account.welcome', { name: customer.firstName })
                    : _('account.my_account')}
            </h1>
            <div className="border-t border-gray-200">
                <div className="grid grid-cols-1 lg:grid-cols-[282px_1fr] gap-8 px-4 lg:px-8 py-8 bg-gray-50">
                    <div className="lg:border-r lg:pr-8 border-gray-200">
                        <AccountMenu />
                    </div>
                    <main className="min-w-0">
                        <Outlet context={{ customer }} />
                    </main>
                </div>
            </div>
        </div>
    );
}

function AccountMenu() {
    const { t: _ } = useTranslation();
    
    return (
        <nav className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
                <Link
                    to="/account"
                    className="text-lg hover:text-gray-600"
                >
                    {_('account.overview')}
                </Link>
                <Link
                    to="/account/orders"
                    className="text-lg hover:text-gray-600"
                >
                    {_('account.orders')}
                </Link>
            </div>
            <Form
                method="POST"
                action="/account/logout"
                onSubmit={() => {
                    if (typeof window !== 'undefined' && typeof (window as any).gmf !== 'undefined') {
                        (window as any).gmf('update', { customerToken: null });
                    }
                }}
            >
                <button
                    type="submit"
                    className="text-lg text-red-600 hover:text-red-700"
                >
                    {_('account.logout')}
                </button>
            </Form>
        </nav>
    );
}