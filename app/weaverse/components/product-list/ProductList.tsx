import type {
    ComponentLoaderArgs,
    HydrogenComponentProps,
    HydrogenComponentSchema,
    WeaverseProduct,
} from '@weaverse/hydrogen';
import { forwardRef } from 'react';
import { Section, sectionInspector, SectionProps } from '../atoms/Section';
import { ProductItemFragment } from 'storefrontapi.generated';
import { MULTIPLE_PRODUCTS_BY_ID_QUERY } from '~/graphql/products/ProductQueries';
import { Grid } from '~/components/Grid';
import { ProductItem } from '~/routes/($locale).collections.$handle';

interface AllProductsProps extends HydrogenComponentProps {
    products: WeaverseProduct[];
    columns: number;
}

let AllProducts = forwardRef<HTMLElement, AllProductsProps & SectionProps>((props, ref) => {
    let {
        children,
        loaderData,
        products,
        columns,
        ...rest
    } = props;

    return (
        <Section ref={ref} {...rest} width='1440px'>
            <Grid items={columns}>
                {loaderData.products.map((product: any) => (
                    <ProductItem key={product.id} product={product} />
                ))}
            </Grid>
        </Section>
    );
});

export let loader = async (args: ComponentLoaderArgs<AllProductsProps>) => {
    const { products } = args.data

    if (!products) {
        return {
            products: []
        }
    }

    const ids = products?.map((product: any) => `gid://shopify/Product/${product.id}`)

    const data = await args.weaverse.storefront.query(MULTIPLE_PRODUCTS_BY_ID_QUERY, {
        variables: { ids }
    })

    return {
        products: data.nodes as ProductItemFragment[]
    }
}

export default AllProducts;

export let schema: HydrogenComponentSchema = {
    type: 'product-list',
    title: 'Product list',
    toolbar: ['general-settings', ['duplicate', 'delete']],
    inspector: [
        {
            group: 'Product list',
            inputs: [
                {
                    type: 'range',
                    name: 'columns',
                    label: 'Columns',
                    configs: {
                        min: 1,
                        max: 6,
                        step: 1,
                    },
                    defaultValue: 4,
                },
                {
                    type: 'product-list',
                    name: 'products',
                    label: 'Produkter',
                    configs: {
                        options: [],
                    },
                    defaultValue: [],
                }
            ]
        },
        ...sectionInspector,

    ],
};