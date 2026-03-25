import { Link } from '@remix-run/react';
import { Image } from '@shopify/hydrogen';
import type {
    ComponentLoaderArgs,
    HydrogenComponentProps,
    HydrogenComponentSchema,
    WeaverseImage,
} from '@weaverse/hydrogen'
import { forwardRef } from 'react'
import { ProductItemFragment } from 'storefrontapi.generated';
import ExpandableDescription from '~/components/ExpandableDescription';
import { ScrollableGrid } from '~/components/ScrollableList';
import { ScentFamilies } from '~/data/scent-families';
import { FAMILY_QUERY } from '~/graphql/products/ProductQueries';
import { ProductItem } from '~/routes/($locale).collections.$handle';

type DoftgrupperRelatedData = {
    title: string;
    description: string;
    image: WeaverseImage;
    family: string;
}

type DoftgrupperRelatedProps = HydrogenComponentProps<
    Awaited<ReturnType<typeof loader>>
> &
    DoftgrupperRelatedData

let DoftgrupperRelated = forwardRef<HTMLElement, DoftgrupperRelatedProps>((props, ref) => {
    let { title, family, loaderData, ...rest } = props

    return (
        <section ref={ref} {...rest} className="max-w-[1440px] mx-auto px-5">
            <div className="py-8 lg:py-16">
                <h1 className="text-[40px] font-heading uppercase text-center">{title}</h1>
            </div>

            {loaderData?.related.collection?.products.nodes && (
                <div className="grid lg:grid-cols-4 grid-cols-2 gap-4 lg:gap-8">
                    {loaderData.related.collection?.products.nodes.map((product: ProductItemFragment) => (
                        <ProductItem
                            key={product.id}
                            product={product}
                            loading='lazy'
                        />
                    ))}
                </div>
            )}
        </section>
    )
})


export let loader = async (args: ComponentLoaderArgs<DoftgrupperRelatedData>) => {

    if (!args.data.family) {
        return {
            related: {
                collection: {
                    products: {
                        nodes: []
                    }
                }
            },
        }
    } else {
        return {
            related: await args.weaverse.storefront.query(FAMILY_QUERY, {
                variables: {
                    handle: 'alla-parfymer',
                    family: args.data.family
                }
            })
        }
    }

}

export let schema: HydrogenComponentSchema = {
    type: 'doftgrupper-related',
    title: 'Doftgrupper Related',
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

export default DoftgrupperRelated;