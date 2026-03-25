
import { WeaverseClient, WeaverseClientArgs } from '@weaverse/hydrogen'
import { themeSchema } from './schema'
import { components } from './component'

export function createWeaverseClient(args: Omit<WeaverseClientArgs, 'themeSchema' | 'components'>) {
    const client = new WeaverseClient({
        ...args,
        themeSchema,
        components,
    })


    return client;
}