import { Link, useLoaderData } from '@remix-run/react';
import { Money, getPaginationVariables } from '@shopify/hydrogen';
import { json, type LoaderFunctionArgs } from '@shopify/remix-oxygen';
import { CUSTOMER_ORDERS_QUERY } from '~/graphql/customer-account/CustomerOrdersQuery';
import type { OrderItemFragment } from 'customer-accountapi.generated';
import { useI18n } from '~/components/i18n-provider';
import { useTranslation } from '~/i18n/i18n';

export async function loader({ request, context }: LoaderFunctionArgs) {
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 20,
  });

  const { data, errors } = await context.customerAccount.query(
    CUSTOMER_ORDERS_QUERY,
    {
      variables: {
        ...paginationVariables,
      },
    },
  );

  if (errors?.length || !data?.customer) {
    throw new Error('Kunde inte hitta dina ordrar');
  }

  return json({ customer: data.customer });
}

export default function AccountOrders() {
  const { customer } = useLoaderData<typeof loader>();
  const { orders } = customer;
  const { t: _ } = useTranslation();

  if (!orders.nodes.length) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <h2 className="text-xl font-medium mb-4">{_('account.no_orders')}</h2>
        <p className="text-gray-500 mb-6">{_('account.no_orders_description')}</p>
        <Link
          to="/collections/all"
          className="bg-black text-white px-6 py-3 rounded-lg hover:opacity-80"
        >
          {_('account.start_shopping')}
        </Link>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-semibold mb-8">{_('account.my_orders')}</h1>
      <div className="grid gap-4">
        {orders.nodes.map((order: OrderItemFragment) => (
          <Link
            key={order.id}
            to={`/account/orders/${btoa(order.id)}`}
            className="border rounded-lg p-4 hover:border-black transition-colors"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="font-medium">{_('account.order_number', { number: order.number })}</p>
                <p className="text-sm text-gray-500">
                  {new Date(order.processedAt).toLocaleDateString('sv-SE')}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <Money data={order.totalPrice} />
                </div>
                <span className="text-sm px-3 py-1 rounded-full bg-gray-100">
                  {getOrderStatus(order.fulfillments.nodes[0]?.status)}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function getOrderStatus(status: string | null | undefined) {
  const { t: _ } = useTranslation();
  switch (status) {
    case 'FULFILLED':
      return _('account.order_status.fulfilled');
    case 'IN_PROGRESS':
      return _('account.order_status.in_progress');
    case 'ON_HOLD':
      return _('account.order_status.on_hold');
    case 'OPEN':
      return _('account.order_status.open');
    case 'PARTIALLY_FULFILLED':
      return _('account.order_status.partially_fulfilled');
    case 'PENDING_FULFILLMENT':
      return _('account.order_status.pending_fulfillment');
    case 'RESTOCKED':
      return _('account.order_status.restocked');
    case 'SCHEDULED':
      return _('account.order_status.scheduled');
    case 'UNFULFILLED':
      return _('account.order_status.unfulfilled');
    default:
      return _('account.order_status.unknown');
  }
} 