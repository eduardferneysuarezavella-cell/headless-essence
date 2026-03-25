import { Link } from '@remix-run/react';
import { Image } from '@shopify/hydrogen';
import type {
    ComponentLoaderArgs,
    HydrogenComponentProps,
    HydrogenComponentSchema,
    WeaverseImage,
} from '@weaverse/hydrogen'
import { forwardRef } from 'react'

type GuaranteeData = {
    title: string;
    imageOne: WeaverseImage;
    textOne: string;
    imageTwo: WeaverseImage;
    textTwo: string;
    imageThree: WeaverseImage;
    textThree: string;
    imageFour: WeaverseImage;
    textFour: string;
}

type GuaranteeProps = HydrogenComponentProps<
    Awaited<ReturnType<typeof loader>>
> &
    GuaranteeData

let Guarantee = forwardRef<HTMLElement, GuaranteeProps>((props, ref) => {
    let { loaderData, title, imageOne, textOne, imageTwo, textTwo, imageThree, textThree, imageFour, textFour, ...rest } = props

    return (
        <section ref={ref} className='max-w-[1200px] mx-auto pb-[30px] pt-[50px]'>
            <div className=''>
                <h2 className='font-heading lg:text-3xl text-2xl lg:text-[45px] pb-[30px] text-center font-semibold'>{title}</h2>
            </div>

            <div className='grid grid-cols-2 lg:flex justify-center'>
                {imageOne && (
                    <div className='flex flex-col items-center p-[15px]'>
                        <Image
                            src={imageOne.url}
                            alt={imageOne.altText}
                            width={imageOne.width}
                            height={imageOne.height}
                            className='lg:w-1/2 lg:h-auto lg:object-contain h-[60px] w-auto object-cover'

                        />

                        <p className='text-lg lg:text-2xl text-center font-heading pt-[15px] my-[18px]'>{textOne}</p>
                    </div>
                )}

                {imageTwo && (
                    <div className='flex flex-col items-center p-[15px]'>
                        <Image
                            src={imageTwo.url}
                            alt={imageTwo.altText}
                            width={imageTwo.width}
                            height={imageTwo.height}
                            className='lg:w-1/2 lg:h-auto lg:object-contain h-[60px] w-auto object-cover'
                        />

                        <p className='text-lg lg:text-2xl text-center font-heading pt-[15px] my-[18px]'>{textTwo}</p>
                    </div>
                )}

                {imageThree && (
                    <div className='flex flex-col items-center p-[15px]'>
                        <Image
                            src={imageThree.url}
                            alt={imageThree.altText}
                            width={imageThree.width}
                            height={imageThree.height}
                            className='lg:w-1/2 lg:h-auto lg:object-contain h-[60px] w-auto object-cover'
                        />

                        <p className='text-lg lg:text-2xl text-center font-heading pt-[15px] my-[18px]'>{textThree}</p>
                    </div>
                )}

                {imageFour && (
                    <div className='flex flex-col items-center p-[15px]'>
                        <Image
                            src={imageFour.url}
                            alt={imageFour.altText}
                            width={imageFour.width}
                            height={imageFour.height}
                            className='lg:w-1/2 lg:h-auto lg:object-contain h-[60px] w-auto object-cover'
                        />

                        <p className='text-lg lg:text-2xl text-center font-heading pt-[15px] my-[18px]'>{textFour}</p>
                    </div>
                )}
            </div>
        </section>
    )
})

export let loader = async (args: ComponentLoaderArgs<GuaranteeData>) => {
    // Data fetching logic, the code will be run on the server-side ...
}

export let schema: HydrogenComponentSchema = {
    type: 'guarantee',
    title: 'Garanti',
    inspector: [
        {
            group: 'Konfiguration',
            inputs: [
                {
                    name: 'title',
                    type: 'text',
                    label: 'Titel'
                }
            ]
        },
        {
            group: 'Bild 1',
            inputs: [
                {
                    name: 'imageOne',
                    type: 'image',
                    label: 'Bild'
                },
                {
                    name: 'textOne',
                    type: 'text',
                    label: 'Text'
                }
            ]
        },
        {
            group: 'Bild 2',
            inputs: [
                {
                    name: 'imageTwo',
                    type: 'image',
                    label: 'Bild'
                },
                {
                    name: 'textTwo',
                    type: 'text',
                    label: 'Text'
                }
            ]
        },
        {
            group: 'Bild 3',
            inputs: [
                {
                    name: 'imageThree',
                    type: 'image',
                    label: 'Bild'
                },
                {
                    name: 'textThree',
                    type: 'text',
                    label: 'Text'
                }
            ]
        },
        {
            group: 'Bild 4',
            inputs: [
                {
                    name: 'imageFour',
                    type: 'image',
                    label: 'Bild'
                },
                {
                    name: 'textFour',
                    type: 'text',
                    label: 'Text'
                }
            ]
        }
    ]
}

export default Guarantee;