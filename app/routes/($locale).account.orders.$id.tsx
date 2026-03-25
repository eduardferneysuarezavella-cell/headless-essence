import { Link, useLoaderData } from '@remix-run/react';
import { Money, flattenConnection } from '@shopify/hydrogen';
import { json, type LoaderFunctionArgs } from '@shopify/remix-oxygen';
import { CUSTOMER_ORDER_QUERY } from '~/graphql/customer-account/CustomerOrderQuery';
import { useI18n } from '~/components/i18n-provider';
import { useTranslation } from '~/i18n/i18n';

export async function loader({ params, context }: LoaderFunctionArgs) {
  if (!params.id) {
    throw new Error('Order ID saknas');
  }

  const orderId = atob(params.id);
  const { data, errors } = await context.customerAccount.query(
    CUSTOMER_ORDER_QUERY,
    {
      variables: { orderId },
    },
  );

  if (errors?.length || !data?.order) {
    throw new Error('Ordern hittades inte');
  }

  const { order } = data;
  const lineItems = flattenConnection(order.lineItems);
  const fulfillmentStatus = flattenConnection(order.fulfillments)[0]?.status;

  return json({ order, lineItems, fulfillmentStatus });
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

export default function OrderDetails() {
  const { order, lineItems, fulfillmentStatus } = useLoaderData<typeof loader>();
  const { t: _ } = useTranslation();

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <Link to="/account/orders" className="text-gray-500 hover:text-black">
          {_('account.back_to_orders')}
        </Link>
      </div>

      <div className="border rounded-lg p-6 mb-8">
        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-semibold mb-2">{_('account.order_number', { number: order.name })}</h1>
            <p className="text-gray-500">
              {new Date(order.processedAt).toLocaleDateString('sv-SE')}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500 mb-1">{_('account.order_total')}</p>
            {order.totalPrice && <Money data={order.totalPrice} className="text-xl font-medium" />}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          {order.shippingAddress && (
            <div>
              <h2 className="font-medium mb-2">{_('account.shipping_address')}</h2>
              <p className="text-gray-600 whitespace-pre-wrap">
                {order.shippingAddress.formatted}
              </p>
            </div>
          )}
          <div>
            <h2 className="font-medium mb-2">{_('account.status')}</h2>
            <span className="inline-block px-3 py-1 rounded-full bg-gray-100 text-sm">
              {getOrderStatus(fulfillmentStatus)}
            </span>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">{_('account.products')}</h2>
        <div className="grid gap-4">
          {lineItems.map((item) => (
            <div key={item.id} className="border rounded-lg p-4">
              <div className="flex gap-4">
                {item.image && (
                  <div className="w-20 h-20 flex-shrink-0">
                    <img
                      src={item.image.url}
                      alt={item.image.altText || item.title}
                      className="w-full h-full object-cover rounded"
                    />
                  </div>
                )}
                <div className="flex-grow">
                  <h3 className="font-medium">{item.title}</h3>
                  {item.variantTitle && (
                    <p className="text-sm text-gray-500">{item.variantTitle}</p>
                  )}
                  <div className="mt-2 flex justify-between">
                    <p className="text-sm">{_('account.quantity')}: {item.quantity}</p>
                    {item.price && <Money data={item.price} />}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 