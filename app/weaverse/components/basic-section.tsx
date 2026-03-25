import type {
    HydrogenComponentSchema,
} from '@weaverse/hydrogen';
import { forwardRef } from 'react';
import { Section, sectionInspector, SectionProps } from './atoms/Section';

type BasicSectionProps = SectionProps & {
    mobileColumns: string;
    tabletColumns: string;
    desktopColumns: string;
};

const BasicSection = forwardRef<
    HTMLElement,
    BasicSectionProps
>((props, ref) => {
    let {
        children,
        mobileColumns = '1',
        tabletColumns = '1',
        desktopColumns = '1',
        ...rest
    } = props;

    return (
        <Section ref={ref} {...rest}>
            <div className={`grid w-full gap-4 grid-cols-${mobileColumns} md:grid-cols-${tabletColumns} lg:grid-cols-${desktopColumns}`}>
                {children}
            </div>
        </Section>
    );
});

export default BasicSection;

export let schema: HydrogenComponentSchema = {
    type: 'basic-section',
    title: 'Basic section',
    toolbar: ['general-settings', ['duplicate', 'delete']],
    inspector: [
        ...sectionInspector,
        {
            group: 'Grid settings',
            inputs: [
                {
                    type: 'select',
                    name: 'mobileColumns',
                    label: 'Mobile columns',
                    defaultValue: '1',
                    configs: {
                        options: [
                            { value: '1', label: '1 column' },
                            { value: '2', label: '2 columns' },
                            { value: '3', label: '3 columns' },
                            { value: '4', label: '4 columns' }
                        ]
                    }
                },
                {
                    type: 'select',
                    name: 'tabletColumns',
                    label: 'Tablet columns',
                    defaultValue: '1',
                    configs: {
                        options: [
                            { value: '1', label: '1 column' },
                            { value: '2', label: '2 columns' },
                            { value: '3', label: '3 columns' },
                            { value: '4', label: '4 columns' }
                        ]
                    }
                },
                {
                    type: 'select',
                    name: 'desktopColumns',
                    label: 'Desktop columns',
                    defaultValue: '1',
                    configs: {
                        options: [
                            { value: '1', label: '1 column' },
                            { value: '2', label: '2 columns' },
                            { value: '3', label: '3 columns' },
                            { value: '4', label: '4 columns' }
                        ]
                    }
                }
            ]
        }
    ],
    childTypes: ['heading-other', 'description', 'image', 'expandable-description', 'product-slide', 'column', 'button'],
};