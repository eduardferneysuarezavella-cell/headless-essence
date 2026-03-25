import { LoaderFunctionArgs, json } from '@shopify/remix-oxygen';
import { useOutletContext } from '@remix-run/react';
import { useI18n } from '~/components/i18n-provider';
import { useTranslation } from '~/i18n/i18n';

export async function loader({ context }: LoaderFunctionArgs) {
    await context.customerAccount.handleAuthStatus();
    return json({});
}

export default function AccountOverview() {
    const { customer } = useOutletContext<{ customer: any }>();
    const { t: _ } = useTranslation();

    return (
        <div className="account-overview">
            <div className="bg-white rounded-lg p-6 shadow-sm">
                <h2 className="text-xl font-medium mb-4">{_('account.account_info')}</h2>
                <div className="space-y-2">
                    <p>
                        <span className="text-gray-600">{_('account.name')}: </span>
                        {customer.firstName} {customer.lastName}
                    </p>
                    <p>
                        <span className="text-gray-600">{_('account.email')}: </span>
                        {customer.emailAddress?.emailAddress}
                    </p>
                    {customer.defaultAddress?.phoneNumber && (
                        <p>
                            <span className="text-gray-600">{_('account.phone')}: </span>
                            {customer.defaultAddress.phoneNumber}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
