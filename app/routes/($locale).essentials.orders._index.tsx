import { Link, useLoaderData, type MetaFunction } from '@remix-run/react';
import {
    Money,
    getPaginationVariables,
    flattenConnection,
} from '@shopify/hydrogen';
import { json, type LoaderFunctionArgs } from '@shopify/remix-oxygen';
import { CUSTOMER_ORDERS_QUERY } from '~/graphql/customer-account/CustomerOrdersQuery';
import type {
    CustomerOrdersFragment,
    OrderItemFragment,
} from 'customer-accountapi.generated';
import { PaginatedResourceSection } from '~/components/PaginatedResourceSection';

export const meta: MetaFunction = () => {
    return [{ title: 'Orders' }];
};

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
        throw Error('Customer orders not found');
    }

    return json({ customer: data.customer, gamifieraToken: context.session.get('gamifieraToken') });
}

export default function Orders() {
    const { customer, gamifieraToken } = useLoaderData<{ customer: CustomerOrdersFragment, gamifieraToken: string }>();
    const { orders } = customer;
    return (
        <div className="orders">
            {orders.nodes.length ? <OrdersTable orders={orders} /> : <EmptyOrders />}
        </div>
    );
}

function OrdersTable({ orders }: Pick<CustomerOrdersFragment, 'orders'>) {
    return (
        <div className="acccount-orders">
            {orders?.nodes.length ? (
                <PaginatedResourceSection connection={orders} page={1}>
                    {({ node: order }) => <OrderItem key={order.id} order={order} />}
                </PaginatedResourceSection>
            ) : (
                <EmptyOrders />
            )}
        </div>
    );
}

function EmptyOrders() {
    return (
        <div className='px-12 py-8'>
            <h2 className='font-heading lg:text-2xl text-xl font-medium'>Det verkar inte som du har gjort några beställningar än...</h2>

            <p className='pb-6 text-lg'>
                Vi har mycket produkter att visa dig! Tryck på knappen nedan för att börja shoppa!
            </p>

            <Link
                to="/collections"
                className="uppercase font-heading font-medium text-lg w-full border border-black text-black py-3 px-8 hover:bg-black hover:text-white transition-all"
            >
                Ta mig till butiken!
            </Link>
        </div>
    );
}

function OrderItem({ order }: { order: OrderItemFragment }) {
    const fulfillmentStatus = flattenConnection(order.fulfillments)[0]?.status;
    return (
        <>
            <fieldset>
                <Link to={`/essentials/orders/${btoa(order.id)}`}>
                    <strong>#{order.number}</strong>
                </Link>
                <p>{new Date(order.processedAt).toDateString()}</p>
                <p>{order.financialStatus}</p>
                {fulfillmentStatus && <p>{fulfillmentStatus}</p>}
                <Money data={order.totalPrice} />
                <Link to={`/essentials/orders/${btoa(order.id)}`}>View Order →</Link>
            </fieldset>
            <br />
        </>
    );
}
