import { Link } from '@remix-run/react';
import { Image, Video } from '@shopify/hydrogen';
import type {
    ComponentLoaderArgs,
    HydrogenComponentProps,
    HydrogenComponentSchema,
    WeaverseImage,
    WeaverseVideo,
} from '@weaverse/hydrogen'
import { forwardRef } from 'react'

type VideoItemData = {
    video: WeaverseVideo;
}

type VideoItemProps = HydrogenComponentProps<
    Awaited<ReturnType<typeof loader>>
> &
    VideoItemData

let VideoItem = forwardRef<HTMLElement, VideoItemProps>((props, ref) => {
    let { video, loaderData, ...rest } = props

    return (
        <div className='w-full'>
            {video && video.url && (
                <>
                    <video
                        src={video.url}
                        loop
                        muted
                        autoPlay
                        playsInline
                        className="w-full h-full object-cover"
                    >
                        Din webbläsare stödjer inte videor tyvärr.
                    </video>
                </>
            )}
        </div>
    )
})

export let loader = async (args: ComponentLoaderArgs<VideoItemData>) => {
    // Data fetching logic, the code will be run on the server-side ...
}

export let schema: HydrogenComponentSchema = {
    type: 'video',
    title: 'Video',
    inspector: [
        {
            group: 'Konfiguration',
            inputs: [
                {
                    name: 'video',
                    type: 'video',
                    label: 'Video',
                },
            ]
        },

    ]
}

export default VideoItem;