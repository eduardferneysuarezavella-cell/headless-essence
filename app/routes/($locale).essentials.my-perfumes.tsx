import { type MetaFunction } from '@shopify/remix-oxygen';
import { useOutletContext } from '@remix-run/react';
import type { CustomerType } from '../types/customer';

type ContextType = {
    customer: CustomerType;
};

export const meta: MetaFunction = () => {
    return [{ title: 'Mina parfymer | ESSNCE' }];
};

export default function MyPerfumes() {
    const context = useOutletContext<ContextType>();
    const customer = context?.customer;

    if (!customer) {
        return null;
    }

    return (
        <div className="w-full">
            <h1 className="font-heading text-2xl mb-6">Mina parfymer</h1>
            <div className="gmf-ordered-product-list"></div>
        </div>
    );
} 