import type {CustomerFragment} from 'customer-accountapi.generated';
import type {CustomerUpdateInput} from '@shopify/hydrogen/customer-account-api-types';
import {CUSTOMER_UPDATE_MUTATION} from '~/graphql/customer-account/CustomerUpdateMutation';
import {
  json,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from '@shopify/remix-oxygen';
import {
  Form,
  useActionData,
  useNavigation,
  useOutletContext,
  type MetaFunction,
} from '@remix-run/react';

export type ActionResponse = {
  error: string | null;
  customer: CustomerFragment | null;
};

export const meta: MetaFunction = () => {
  return [{title: 'Profile'}];
};

export async function loader({context}: LoaderFunctionArgs) {
  await context.customerAccount.handleAuthStatus();

  return json({});
}

export async function action({request, context}: ActionFunctionArgs) {
  const {customerAccount} = context;

  if (request.method !== 'PUT') {
    return json({error: 'Method not allowed'}, {status: 405});
  }

  const form = await request.formData();

  try {
    const customer: CustomerUpdateInput = {};
    const validInputKeys = ['firstName', 'lastName'] as const;
    for (const [key, value] of form.entries()) {
      if (!validInputKeys.includes(key as any)) {
        continue;
      }
      if (typeof value === 'string' && value.length) {
        customer[key as (typeof validInputKeys)[number]] = value;
      }
    }

    // update customer and possibly password
    const {data, errors} = await customerAccount.mutate(
      CUSTOMER_UPDATE_MUTATION,
      {
        variables: {
          customer,
        },
      },
    );

    if (errors?.length) {
      throw new Error(errors[0].message);
    }

    if (!data?.customerUpdate?.customer) {
      throw new Error('Customer profile update failed.');
    }

    return json({
      error: null,
      customer: data?.customerUpdate?.customer,
    });
  } catch (error: any) {
    return json(
      {error: error.message, customer: null},
      {
        status: 400,
      },
    );
  }
}

export default function AccountProfile() {
  const account = useOutletContext<{customer: CustomerFragment}>();
  const {state} = useNavigation();
  const action = useActionData<ActionResponse>();
  const customer = action?.customer ?? account?.customer;

  return (
    <div className="w-full">
      <h1 className="font-heading text-2xl mb-6">Dina uppgifter</h1>
      <Form method="PUT" className="max-w-xl">
        <div className="border border-gray-200 rounded-lg p-6">
          <h2 className="font-heading text-lg mb-4">Personlig information</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="firstName" className="block font-heading mb-1">Förnamn</label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                autoComplete="given-name"
                placeholder="Förnamn"
                aria-label="Förnamn"
                defaultValue={customer.firstName ?? ''}
                minLength={2}
                className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block font-heading mb-1">Efternamn</label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                autoComplete="family-name"
                placeholder="Efternamn"
                aria-label="Efternamn"
                defaultValue={customer.lastName ?? ''}
                minLength={2}
                className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
          </div>
          {action?.error && (
            <p className="mt-4 text-red-500 text-sm">{action.error}</p>
          )}
          <div className="mt-6">
            <button 
              type="submit" 
              disabled={state !== 'idle'}
              className="w-full uppercase font-heading font-medium text-lg border border-black text-black py-3 px-8 hover:bg-black hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {state !== 'idle' ? 'Uppdaterar...' : 'Uppdatera'}
            </button>
          </div>
        </div>
      </Form>
    </div>
  );
}
