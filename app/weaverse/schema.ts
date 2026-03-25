import type { HydrogenThemeSchema } from '@weaverse/hydrogen'
import { countries } from '~/data/countries'

export const themeSchema: HydrogenThemeSchema = {
    info: {
        version: '1.0.0',
        author: 'RIBBAN',
        name: 'ESSNCE',
        authorProfilePhoto:
            'https://cdn.shopify.com/s/files/1/0838/0052/3057/files/Weaverse_logo_-_3000x_e2fa8c13-dac2-4dcb-a2c2-f7aaf7a58169.png?v=1698245759',
        documentationUrl: 'https://ribban.co/contact',
        supportUrl: 'https://ribban.co/contact',
    }, 
    defaultLocale: 'SV',
    i18n: Object.values(countries).map((country) => ({
        label: country.label,
        language: country.language,
        country: country.country,
    })),
    inspector: []
}