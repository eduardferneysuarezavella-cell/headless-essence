import { Link } from '@remix-run/react';
import { Image } from '@shopify/hydrogen';
import type {
    ComponentLoaderArgs,
    HydrogenComponentProps,
    HydrogenComponentSchema,
    WeaverseImage,
} from '@weaverse/hydrogen'
import { forwardRef } from 'react'
import ExpandableDescription from '~/components/ExpandableDescription';
import { ScrollableGrid } from '~/components/ScrollableList';
import { ScentFamilies } from '~/data/scent-families';
import { FAMILY_QUERY } from '~/graphql/products/ProductQueries';

type DoftgrupperHeroData = {
    title: string;
    description: string;
    image: WeaverseImage;
    family: string;
}

type DoftgrupperHeroProps = HydrogenComponentProps<
    Awaited<ReturnType<typeof loader>>
> &
    DoftgrupperHeroData

let DoftgrupperHero = forwardRef<HTMLElement, DoftgrupperHeroProps>((props, ref) => {
    let { title, description, image, family, loaderData, ...rest } = props

    return (
        <section ref={ref} {...rest} className="flex xl:flex-row flex-col-reverse">
            <div className="flex flex-col justify-between xl:flex-1 xl:px-32">
                <div className="flex flex-col gap-4 xl:p-0 p-6">
                    <h1 className="text-[40px] font-heading uppercase text-center xl:text-left">{title}</h1>

                    <ExpandableDescription wrapperClassName="xl:text-lg xl:text-left px-5 xl:px-0">
                        {description}
                    </ExpandableDescription>
                </div>

                <div className="px-5 xl:px-0 py-6">
                    <h1 className="xl:text-3xl text-2xl font-heading font-medium text-center xl:text-left">Bästsäljande inom {title}</h1>

                    {loaderData?.bestselling?.collection?.products.nodes && (
                        <ScrollableGrid
                            variants={loaderData.bestselling.collection.products.nodes}
                            perPage={{ desktop: 3, mobile: 2 }}
                        />
                    )}

                </div>
            </div>
            <div className="xl:basis-[45%]">
                {image && (
                    <Image
                        src={image.url}
                        alt={title}
                        width={2000}
                        height={2000}
                        className="object-cover w-full h-full xl:max-h-full max-h-[250px]"
                    />
                )}
            </div>
        </section>
    )
})

export let loader = async (args: ComponentLoaderArgs<DoftgrupperHeroData>) => {

    if (!args.data.family) {
        return {
            bestselling: {
                collection: {
                    products: {
                        nodes: []
                    }
                }
            },
        }
    } else {
        return {
            bestselling: await args.weaverse.storefront.query(FAMILY_QUERY, {
                variables: {
                    handle: 'bestsellers',
                    family: args.data.family
                }
            })
        }
    }

}

export let schema: HydrogenComponentSchema = {
    type: 'doftgrupper-hero',
    title: 'Doftgrupper Hero',
    enabledOn: {
        pages: ['CUSTOM']
    },
    inspector: [
        {
            group: 'Konfiguration',
            inputs: [
                {
                    name: 'title',
                    type: 'text',
                    label: 'Title',
                    defaultValue: 'En titel här...',
                },
                {
                    name: 'description',
                    type: 'textarea',
                    label: 'Description',
                    defaultValue: 'En beskrivning här...',
                },
                {
                    name: 'image',
                    type: 'image',
                    label: 'Image',
                    defaultValue: '/22f3e52546f2bd8dceeb2a4ef282715a.png',
                },
                {
                    name: 'family',
                    type: 'select',
                    label: 'Familj',
                    configs: {
                        options: ScentFamilies.map((family) => ({
                            value: family.name,
                            label: family.name,
                        }))
                    }
                }
            ]
        },

    ]
}

export default DoftgrupperHero