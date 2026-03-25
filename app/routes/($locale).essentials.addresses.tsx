import type { CustomerAddressInput } from '@shopify/hydrogen/customer-account-api-types';
import type {
  AddressFragment,
  CustomerFragment,
} from 'customer-accountapi.generated';
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
  type Fetcher,
} from '@remix-run/react';
import {
  UPDATE_ADDRESS_MUTATION,
  DELETE_ADDRESS_MUTATION,
  CREATE_ADDRESS_MUTATION,
} from '~/graphql/customer-account/CustomerAddressMutations';

export type ActionResponse = {
  addressId?: string | null;
  createdAddress?: AddressFragment;
  defaultAddress?: string | null;
  deletedAddress?: string | null;
  error: Record<AddressFragment['id'], string> | null;
  updatedAddress?: AddressFragment;
};

export const meta: MetaFunction = () => {
  return [{ title: 'Addresses' }];
};

export async function loader({ context }: LoaderFunctionArgs) {
  await context.customerAccount.handleAuthStatus();

  return json({});
}

export async function action({ request, context }: ActionFunctionArgs) {
  const { customerAccount } = context;

  try {
    const form = await request.formData();

    const addressId = form.has('addressId')
      ? String(form.get('addressId'))
      : null;
    if (!addressId) {
      throw new Error('You must provide an address id.');
    }

    // this will ensure redirecting to login never happen for mutatation
    const isLoggedIn = await customerAccount.isLoggedIn();
    if (!isLoggedIn) {
      return json(
        { error: { [addressId]: 'Unauthorized' } },
        {
          status: 401,
        },
      );
    }

    const defaultAddress = form.has('defaultAddress')
      ? String(form.get('defaultAddress')) === 'on'
      : false;
    const address: CustomerAddressInput = {};
    const keys: (keyof CustomerAddressInput)[] = [
      'address1',
      'address2',
      'city',
      'company',
      'territoryCode',
      'firstName',
      'lastName',
      'phoneNumber',
      'zoneCode',
      'zip',
    ];

    for (const key of keys) {
      const value = form.get(key);
      if (typeof value === 'string') {
        address[key] = value;
      }
    }

    switch (request.method) {
      case 'POST': {
        // handle new address creation
        try {
          const { data, errors } = await customerAccount.mutate(
            CREATE_ADDRESS_MUTATION,
            {
              variables: { address, defaultAddress },
            },
          );

          if (errors?.length) {
            throw new Error(errors[0].message);
          }

          if (data?.customerAddressCreate?.userErrors?.length) {
            throw new Error(data?.customerAddressCreate?.userErrors[0].message);
          }

          if (!data?.customerAddressCreate?.customerAddress) {
            throw new Error('Customer address create failed.');
          }

          return json({
            error: null,
            createdAddress: data?.customerAddressCreate?.customerAddress,
            defaultAddress,
          });
        } catch (error: unknown) {
          if (error instanceof Error) {
            return json(
              { error: { [addressId]: error.message } },
              {
                status: 400,
              },
            );
          }
          return json(
            { error: { [addressId]: error } },
            {
              status: 400,
            },
          );
        }
      }

      case 'PUT': {
        // handle address updates
        try {
          const { data, errors } = await customerAccount.mutate(
            UPDATE_ADDRESS_MUTATION,
            {
              variables: {
                address,
                addressId: decodeURIComponent(addressId),
                defaultAddress,
              },
            },
          );

          if (errors?.length) {
            throw new Error(errors[0].message);
          }

          if (data?.customerAddressUpdate?.userErrors?.length) {
            throw new Error(data?.customerAddressUpdate?.userErrors[0].message);
          }

          if (!data?.customerAddressUpdate?.customerAddress) {
            throw new Error('Customer address update failed.');
          }

          return json({
            error: null,
            updatedAddress: address,
            defaultAddress,
          });
        } catch (error: unknown) {
          if (error instanceof Error) {
            return json(
              { error: { [addressId]: error.message } },
              {
                status: 400,
              },
            );
          }
          return json(
            { error: { [addressId]: error } },
            {
              status: 400,
            },
          );
        }
      }

      case 'DELETE': {
        // handles address deletion
        try {
          const { data, errors } = await customerAccount.mutate(
            DELETE_ADDRESS_MUTATION,
            {
              variables: { addressId: decodeURIComponent(addressId) },
            },
          );

          if (errors?.length) {
            throw new Error(errors[0].message);
          }

          if (data?.customerAddressDelete?.userErrors?.length) {
            throw new Error(data?.customerAddressDelete?.userErrors[0].message);
          }

          if (!data?.customerAddressDelete?.deletedAddressId) {
            throw new Error('Customer address delete failed.');
          }

          return json({ error: null, deletedAddress: addressId });
        } catch (error: unknown) {
          if (error instanceof Error) {
            return json(
              { error: { [addressId]: error.message } },
              {
                status: 400,
              },
            );
          }
          return json(
            { error: { [addressId]: error } },
            {
              status: 400,
            },
          );
        }
      }

      default: {
        return json(
          { error: { [addressId]: 'Method not allowed' } },
          {
            status: 405,
          },
        );
      }
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      return json(
        { error: error.message },
        {
          status: 400,
        },
      );
    }
    return json(
      { error },
      {
        status: 400,
      },
    );
  }
}

export default function Addresses() {
  const { customer } = useOutletContext<{ customer: CustomerFragment }>();
  const { defaultAddress, addresses } = customer;

  return (
    <div className="w-full">
      <h1 className="font-heading text-2xl mb-4">Dina adresser</h1>
      {!addresses.nodes.length ? (
        <div className="px-8 py-6 border border-gray-200 rounded-lg">
          <h2 className="font-heading lg:text-xl text-lg font-medium mb-3">Du har inga sparade adresser</h2>
          <p className="text-base mb-4">Lägg till en ny adress genom att fylla i formuläret nedan.</p>
          <NewAddressForm />
        </div>
      ) : (
        <div className="space-y-4">
          <div className="border border-gray-200 rounded-lg p-4">
            <h2 className="font-heading text-lg mb-3">Lägg till ny adress</h2>
            <NewAddressForm />
          </div>
          <div className="border border-gray-200 rounded-lg p-4">
            <h2 className="font-heading text-lg mb-3">Sparade adresser</h2>
            <ExistingAddresses
              addresses={addresses}
              defaultAddress={defaultAddress}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function ExistingAddresses({
  addresses,
  defaultAddress,
}: Pick<CustomerFragment, 'addresses' | 'defaultAddress'>) {
  return (
    <div className="space-y-4">
      {addresses.nodes.map((address) => (
        <div key={address.id} className="border border-gray-200 rounded-lg p-4">
          <AddressForm
            addressId={address.id}
            address={address}
            defaultAddress={defaultAddress}
          >
            {({ stateForMethod }) => (
              <div className="mt-4 flex gap-3">
                <button
                  disabled={stateForMethod('PUT') !== 'idle'}
                  formMethod="PUT"
                  type="submit"
                  className="flex-1 uppercase font-heading font-medium text-base border border-black text-black py-2 px-6 hover:bg-black hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {stateForMethod('PUT') !== 'idle' ? 'Sparar...' : 'Spara'}
                </button>
                <button
                  disabled={stateForMethod('DELETE') !== 'idle'}
                  formMethod="DELETE"
                  type="submit"
                  className="flex-1 uppercase font-heading font-medium text-base border border-red-500 text-red-500 py-2 px-6 hover:bg-red-500 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {stateForMethod('DELETE') !== 'idle' ? 'Tar bort...' : 'Ta bort'}
                </button>
              </div>
            )}
          </AddressForm>
        </div>
      ))}
    </div>
  );
}

function NewAddressForm() {
  const newAddress = {
    address1: '',
    address2: '',
    city: '',
    company: '',
    territoryCode: '',
    firstName: '',
    id: 'new',
    lastName: '',
    phoneNumber: '',
    zoneCode: '',
    zip: '',
  } as CustomerAddressInput;

  return (
    <AddressForm
      addressId={'NEW_ADDRESS_ID'}
      address={newAddress}
      defaultAddress={null}
    >
      {({ stateForMethod }) => (
        <div className="mt-4">
          <button
            disabled={stateForMethod('POST') !== 'idle'}
            formMethod="POST"
            type="submit"
            className="w-full uppercase font-heading font-medium text-base border border-black text-black py-2 px-6 hover:bg-black hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {stateForMethod('POST') !== 'idle' ? 'Skapar...' : 'Skapa adress'}
          </button>
        </div>
      )}
    </AddressForm>
  );
}

export function AddressForm({
  addressId,
  address,
  defaultAddress,
  children,
}: {
  addressId: AddressFragment['id'];
  address: CustomerAddressInput;
  defaultAddress: CustomerFragment['defaultAddress'];
  children: (props: {
    stateForMethod: (method: 'PUT' | 'POST' | 'DELETE') => Fetcher['state'];
  }) => React.ReactNode;
}) {
  const { state, formMethod } = useNavigation();
  const action = useActionData<ActionResponse>();
  const error = action?.error?.[addressId];
  const isDefaultAddress = defaultAddress?.id === addressId;
  return (
    <Form id={addressId}>
      <fieldset>
        <input type="hidden" name="addressId" defaultValue={addressId} />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div>
            <label htmlFor="firstName" className="block font-heading text-sm mb-1">Förnamn*</label>
            <input
              aria-label="Förnamn"
              autoComplete="given-name"
              defaultValue={address?.firstName ?? ''}
              id="firstName"
              name="firstName"
              placeholder="Förnamn"
              required
              type="text"
              className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
          <div>
            <label htmlFor="lastName" className="block font-heading text-sm mb-1">Efternamn*</label>
            <input
              aria-label="Efternamn"
              autoComplete="family-name"
              defaultValue={address?.lastName ?? ''}
              id="lastName"
              name="lastName"
              placeholder="Efternamn"
              required
              type="text"
              className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
          <div>
            <label htmlFor="company" className="block font-heading text-sm mb-1">Företag</label>
            <input
              aria-label="Företag"
              autoComplete="organization"
              defaultValue={address?.company ?? ''}
              id="company"
              name="company"
              placeholder="Företag"
              type="text"
              className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
          <div>
            <label htmlFor="phoneNumber" className="block font-heading text-sm mb-1">Telefon</label>
            <input
              aria-label="Telefon"
              autoComplete="tel"
              defaultValue={address?.phoneNumber ?? ''}
              id="phoneNumber"
              name="phoneNumber"
              placeholder="+46701234567"
              pattern="^\+?[1-9]\d{3,14}$"
              type="tel"
              className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
          <div className="md:col-span-2">
            <label htmlFor="address1" className="block font-heading text-sm mb-1">Adress*</label>
            <input
              aria-label="Adress"
              autoComplete="address-line1"
              defaultValue={address?.address1 ?? ''}
              id="address1"
              name="address1"
              placeholder="Adress"
              required
              type="text"
              className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
          <div className="md:col-span-2">
            <label htmlFor="address2" className="block font-heading text-sm mb-1">Lägenhet, våning etc.</label>
            <input
              aria-label="Lägenhet, våning etc."
              autoComplete="address-line2"
              defaultValue={address?.address2 ?? ''}
              id="address2"
              name="address2"
              placeholder="Lägenhet, våning etc."
              type="text"
              className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
          <div>
            <label htmlFor="city" className="block font-heading text-sm mb-1">Stad*</label>
            <input
              aria-label="Stad"
              autoComplete="address-level2"
              defaultValue={address?.city ?? ''}
              id="city"
              name="city"
              placeholder="Stad"
              required
              type="text"
              className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
          <div>
            <label htmlFor="zip" className="block font-heading text-sm mb-1">Postnummer*</label>
            <input
              aria-label="Postnummer"
              autoComplete="postal-code"
              defaultValue={address?.zip ?? ''}
              id="zip"
              name="zip"
              placeholder="Postnummer"
              required
              type="text"
              className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
          <div>
            <label htmlFor="zoneCode" className="block font-heading text-sm mb-1">Län*</label>
            <input
              aria-label="Län"
              autoComplete="address-level1"
              defaultValue={address?.zoneCode ?? ''}
              id="zoneCode"
              name="zoneCode"
              placeholder="Län"
              required
              type="text"
              className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
          <div>
            <label htmlFor="territoryCode" className="block font-heading text-sm mb-1">Land*</label>
            <input
              aria-label="Land"
              autoComplete="country"
              defaultValue={address?.territoryCode ?? ''}
              id="territoryCode"
              name="territoryCode"
              placeholder="SE"
              required
              type="text"
              maxLength={2}
              className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
          <div className="md:col-span-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="defaultAddress"
                id="defaultAddress"
                defaultChecked={isDefaultAddress}
                className="w-4 h-4 text-black border-gray-200 rounded focus:ring-black"
              />
              <span className="font-heading text-sm">Sätt som standardadress</span>
            </label>
          </div>
        </div>
        {error && (
          <p className="mt-3 text-red-500 text-sm">{error}</p>
        )}
        {children({
          stateForMethod: (method) => (formMethod === method ? state : 'idle'),
        })}
      </fieldset>
    </Form>
  );
}
