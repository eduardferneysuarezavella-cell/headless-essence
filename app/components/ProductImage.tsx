import type { ProductFragment, ProductVariantFragment } from 'storefrontapi.generated';
import { Image } from '@shopify/hydrogen';
import { MediaImage, MediaContentType, Media } from '@shopify/hydrogen/storefront-api-types';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { match, P } from 'ts-pattern';

type MediaItem = {
    id: string;
    mediaContentType: MediaContentType;
    image?: {
        id: string;
        url: string;
        altText?: string;
        width: number;
        height: number;
    };
    sources?: {
        url: string;
        mimeType: string;
        format: string;
    }[];
    previewImage?: {
        url: string;
    };
};

export function ProductImage({
    media,
}: {
    media: MediaItem[];
}) {
    const limitedMedia = media.slice(0, 4);
    const [selectedMediaIndex, setSelectedMediaIndex] = useState(0);
    const [direction, setDirection] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);

    const swipeConfidenceThreshold = 10000;

    const swipePower = (offset: number, velocity: number) => {
        return Math.abs(offset) * velocity;
    };

    const paginate = (newDirection: number) => {
        setDirection(newDirection);
        setIsPlaying(false);
        if (newDirection > 0) {
            setSelectedMediaIndex((prev) => (prev + 1) % limitedMedia.length);
        } else {
            setSelectedMediaIndex((prev) => (prev - 1 + limitedMedia.length) % limitedMedia.length);
        }
    };

    const variants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 300 : -300,
            opacity: 0
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1
        },
        exit: (direction: number) => ({
            zIndex: 0,
            x: direction < 0 ? 300 : -300,
            opacity: 0
        })
    };

    const handleSwipe = (offsetX: number) => {
        if (offsetX < -swipeConfidenceThreshold) {
            paginate(1);
        } else if (offsetX > swipeConfidenceThreshold) {
            paginate(-1);
        }
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        const startX = e.clientX;
        let offsetX = 0;

        const handleMouseMove = (moveEvent: MouseEvent) => {
            offsetX = moveEvent.clientX - startX;
        };

        const handleMouseUp = () => {
            handleSwipe(offsetX);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
    };

    if (!limitedMedia[selectedMediaIndex]) {
        return <div className="product-image" />;
    }

    return (
        <div className='relative product-image'>
            <div className='overflow-hidden cursor-grab' onMouseDown={handleMouseDown}>
                <AnimatePresence initial={false} custom={direction} mode="wait">
                    <motion.div
                        key={selectedMediaIndex}
                        custom={direction}
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: 0.15 }}
                        drag="x"
                        dragConstraints={{ left: 0, right: 0 }}
                        dragElastic={1}
                        className="w-full select-none"
                        onDragEnd={(e, { offset, velocity }) => {
                            const swipe = swipePower(offset.x, velocity.x);
                            if (swipe < -swipeConfidenceThreshold) {
                                paginate(1);
                            } else if (swipe > swipeConfidenceThreshold) {
                                paginate(-1);
                            }
                        }}
                    >
                        {match(limitedMedia[selectedMediaIndex])
                            .with({ mediaContentType: 'VIDEO' }, (mediaItem) => (
                                <div className="relative w-full aspect-square">
                                    <video
                                        className="w-full h-full object-cover"
                                        controls={true}
                                        playsInline
                                        loop
                                        muted={!isPlaying}
                                        autoPlay={false}
                                        poster={limitedMedia[selectedMediaIndex].previewImage?.url}
                                        onClick={() => setIsPlaying(!isPlaying)}
                                        onDragStart={(e) => e.preventDefault()} // Disable dragging
                                    >
                                        {limitedMedia[selectedMediaIndex].sources?.map((source) => (
                                            <source
                                                key={source.url}
                                                src={source.url}
                                                type={source.mimeType}
                                            />
                                        ))}

                                        Your browser does not support the video tag.
                                    </video>
                                </div>
                            ))
                            .with({ mediaContentType: 'IMAGE', image: P.nonNullable }, (mediaItem) => (
                                <Image
                                    alt={mediaItem.image.altText || 'Product Image'}
                                    aspectRatio="1/1"
                                    data={mediaItem.image}
                                    sizes="(min-width: 45em) 50vw, 100vw"
                                    loading='eager'
                                    className="w-full "
                                    onDragStart={(e) => e.preventDefault()} 
                                />
                            ))
                            .otherwise(() => null)}
                    </motion.div>
                </AnimatePresence>
            </div>

            {limitedMedia.length > 1 && (
                <div className='flex gap-2 pt-4 lg:pb-0 pb-4 px-5 overflow-x-auto'>
                    {limitedMedia.map((mediaItem: MediaItem, index: number) => (
                        <div
                            key={mediaItem.id}
                            className={`cursor-pointer flex-shrink-0 ${selectedMediaIndex === index ? 'opacity-100' : 'opacity-50'}`}
                            onClick={() => {
                                setDirection(index > selectedMediaIndex ? 1 : -1);
                                setSelectedMediaIndex(index);
                            }}
                        >
                            {mediaItem.mediaContentType === 'VIDEO' && mediaItem.previewImage ? (
                                <div className="w-20 h-20 relative">
                                    <img
                                        src={mediaItem.previewImage.url}
                                        alt="Video thumbnail"
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M8 5v14l11-7z" />
                                        </svg>
                                    </div>
                                </div>
                            ) : mediaItem.image && (
                                <div className="w-20 h-20">
                                    <Image
                                        data={mediaItem.image}
                                        width={80}
                                        height={80}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
