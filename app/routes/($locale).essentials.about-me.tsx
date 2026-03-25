import { type MetaFunction } from '@shopify/remix-oxygen';
import { useOutletContext } from '@remix-run/react';
import type { CustomerType } from '../types/customer';

type ContextType = {
    customer: CustomerType;
};

export const meta: MetaFunction = () => {
    return [{ title: 'Om mig | ESSNCE' }];
};

export default function AboutMe() {
    const context = useOutletContext<ContextType>();
    const customer = context?.customer;

    if (!customer) {
        return null;
    }

    return (
        <div className="w-full">
            <h1 className="font-heading text-2xl mb-6">Om mig</h1>
            <div className="gmf-widget-customer-attribute-editor"></div>
        </div>
    );
} 