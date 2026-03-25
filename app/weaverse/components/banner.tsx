import { Link } from '@remix-run/react';
import { Image } from '@shopify/hydrogen';
import type {
    ComponentLoaderArgs,
    HydrogenComponentProps,
    HydrogenComponentSchema,
    WeaverseImage,
} from '@weaverse/hydrogen'
import { forwardRef } from 'react'

type BannerData = {
    title: string;
    image: WeaverseImage;
    instagram: WeaverseImage;
    tiktok: WeaverseImage;
}

type BannerProps = HydrogenComponentProps<
    Awaited<ReturnType<typeof loader>>
> &
    BannerData

let Banner = forwardRef<HTMLElement, BannerProps>((props, ref) => {
    let { loaderData, title, image, instagram, tiktok, ...rest } = props

    return (
        <section ref={ref} className=''>
            <div className='flex justify-end items-end flex-wrap pb-[20px] pt-[30px] lg:py-[20px] h-[270px] lg:h-[700px] max-h-[700px] bg-cover bg-center bg-no-repeat' style={{ backgroundImage: image?.url ? `url(${image?.url})` : '' }}>
                <div className='px-[15px] w-full max-w-[1200px] mx-auto'>
                    <div className='lg:p-[15px]'>
                        <h2 className='text-white text-xl lg:text-[45px] font-heading font-semibold text-center'>{title}</h2>
                    </div>
                </div>
            </div>

            <div className='pt-[30px]'>
                <div className='max-w-[1200px] mx-auto px-[15px] w-full'>
                    <div className='p-[15px]'>
                        <div className='flex justify-center items-center max-w-[350px] mx-auto'>
                            <div className='p-[15px] w-full flex justify-center items-center'>
                                {instagram?.url && (
                                    <Link to='https://instagram.com/essnce.edp/'>
                                        <Image
                                            src={instagram.url}
                                            alt={instagram.altText}
                                            width={instagram.width}
                                            height={instagram.height}
                                            loading='lazy'
                                            className='w-[80px] h-auto'
                                        />
                                    </Link>
                                )}
                            </div>
                            <div className='p-[15px] w-full flex justify-center items-center'>
                                {tiktok?.url && (
                                    <Link to={'https://tiktok.com/@essnce.edp'}>
                                        <Image
                                            src={tiktok.url}
                                            alt={tiktok.altText}
                                            width={tiktok.width}
                                            height={tiktok.height}
                                            loading='lazy'
                                            className='w-[80px] h-auto'
                                        />
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
})

export let loader = async (args: ComponentLoaderArgs<BannerData>) => {
    // Data fetching logic, the code will be run on the server-side ...
}

export let schema: HydrogenComponentSchema = {
    type: 'banner',
    title: 'Banner',
    inspector: [
        {
            group: 'Konfiguration',
            inputs: [
                {
                    name: 'title',
                    type: 'text',
                    label: 'Titel',
                },
                {
                    name: 'image',
                    type: 'image',
                    label: 'Bild'
                }
            ]
        },
        {
            group: 'Sociala Medier',
            inputs: [
                {
                    name: 'instagram',
                    type: 'image',
                    label: 'Instagram'
                },
                {
                    name: 'tiktok',
                    type: 'image',
                    label: 'Tiktok'
                }
            ]
        }

    ]
}

export default Banner;