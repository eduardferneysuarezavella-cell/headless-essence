import { Link, useFetcher } from '@remix-run/react';
import { Image } from '@shopify/hydrogen';
import type {
    ComponentLoaderArgs,
    HydrogenComponentProps,
    HydrogenComponentSchema,
    WeaverseImage,
} from '@weaverse/hydrogen'
import { AlignLeft, Loader2 } from 'lucide-react';
import { forwardRef } from 'react'
import ExpandableDescription from '~/components/ExpandableDescription';
import { action } from '~/routes/($locale).klavyio.submit';

type HeadingData = {
    description: string;
}

type HeadingProps = HydrogenComponentProps<
    Awaited<ReturnType<typeof loader>>
> &
    HeadingData

let Heading = forwardRef<HTMLElement, HeadingProps>((props, ref) => {
    let { description, loaderData, ...rest } = props;

    const fetcher = useFetcher<typeof action>();

    return (
        <div className='flex flex-col items-center w-full p-[15px] mt-16' >
            <p className='text-xl'>
                {description}
            </p>

            <div className='grid grid-cols-2 py-8 w-full'>
                <div className='flex items-center justify-center gap-2 w-full'>
                    <Image
                        src={'/features/c82ae58139f1ddd4f81662c858fa4f2c.png'}
                        alt='Tips Ikon'
                        width={36}
                        height={36}
                    />

                    <span>UNIK INFORMATION</span>
                </div>

                <div className='flex items-center justify-center gap-2 w-full'>
                    <Image
                        src={'/features/c82ae58139f1ddd4f81662c858fa4f2c.png'}
                        alt='Tips Ikon'
                        width={36}
                        height={36}
                    />

                    <span>UNIK INFORMATION</span>
                </div>

                <div className='flex items-center justify-center gap-2'>
                    <Image
                        src={'/features/c82ae58139f1ddd4f81662c858fa4f2c.png'}
                        alt='Tips Ikon'
                        width={36}
                        height={36}
                    />

                    <span>UNIK INFORMATION</span>
                </div>

                <div className='flex items-center justify-center gap-2'>
                    <Image
                        src={'/features/c82ae58139f1ddd4f81662c858fa4f2c.png'}
                        alt='Tips Ikon'
                        width={36}
                        height={36}
                    />

                    <span>UNIK INFORMATION</span>
                </div>
            </div>

            <fetcher.Form method='POST' action='/klavyio/submit' className='w-full'>
                <div className='flex flex-col gap-2'>
                    <input
                        type='hidden'
                        name='list_id'
                        id='list_id'
                        value='XbzKUk'
                    />

                    <input
                        type='email'
                        name='email'
                        className='border border-black py-[22px] max-w-full h-[45px] m-0 px-4 leading-[45px] text-sm outline-none w-full'
                        placeholder='Fyll i din e-post'
                    />

                    <div className='w-auto shrink-0'>
                        <button
                            type='submit'
                            disabled={fetcher.state !== 'idle'}
                            className='text-white  bg-black hover:opacity-90 transition-colors duration-300 w-full h-[45px] px-4'
                        >
                            {fetcher.state !== 'idle' ? <Loader2 className='animate-spin' /> : 'Prenumerera'}
                        </button>
                    </div>
                </div>
            </fetcher.Form>
        </div>
    )
})

export let loader = async (args: ComponentLoaderArgs<HeadingData>) => {
    // Data fetching logic, the code will be run on the server-side ...
}

export let schema: HydrogenComponentSchema = {
    type: 'newsletter',
    title: 'Nyhetsbrev',
    inspector: [
        {
            group: 'Konfiguration',
            inputs: [
                {
                    name: 'description',
                    type: 'text',
                    label: 'Beskrivning',
                    defaultValue: 'Signa upp dig till vårt nyhetsbrev för att få ta del utav alla exklusiv information, tips & råd samt sneakpeaks på kommande produkter!',
                },
            ]
        },
    ]
}

export default Heading;