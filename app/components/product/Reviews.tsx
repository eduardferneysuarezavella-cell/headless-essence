export default function Reviews({ numberOfReviews, averageRating }: { numberOfReviews: number, averageRating: number }) {
    const fullStars = Math.floor(averageRating);
    const hasHalfStar = averageRating % 1 >= 0.5;

    const renderStar = (index: number) => {
        if (index < fullStars) {
            return <FullStar key={index} />;
        } else if (index === fullStars && hasHalfStar) {
            return <HalfStar key={index} />;
        } else {
            return <EmptyStar key={index} />;
        }
    };

    return (
        <div className='flex font-heading gap-2'>
            <div className='flex'>
                {[...Array(5)].map((_, index) => renderStar(index))}
            </div>
            <p>({numberOfReviews})</p>
        </div>
    )
}


const FullStar = () => (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4.36875 16.5L5.5875 11.2313L1.5 7.6875L6.9 7.21875L9 2.25L11.1 7.21875L16.5 7.6875L12.4125 11.2313L13.6313 16.5L9 13.7063L4.36875 16.5Z" fill="#1D1B20" />
    </svg>
);

const EmptyStar = () => (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4.36875 16.5L5.5875 11.2313L1.5 7.6875L6.9 7.21875L9 2.25L11.1 7.21875L16.5 7.6875L12.4125 11.2313L13.6313 16.5L9 13.7063L4.36875 16.5Z" stroke="#1D1B20" fill="none" />
    </svg>
);

const HalfStar = () => (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <clipPath id="half">
                <rect x="0" y="0" width="9" height="18" />
            </clipPath>
        </defs>
        <path d="M4.36875 16.5L5.5875 11.2313L1.5 7.6875L6.9 7.21875L9 2.25L11.1 7.21875L16.5 7.6875L12.4125 11.2313L13.6313 16.5L9 13.7063L4.36875 16.5Z" fill="none" stroke="#1D1B20" />
        <path d="M4.36875 16.5L5.5875 11.2313L1.5 7.6875L6.9 7.21875L9 2.25L11.1 7.21875L16.5 7.6875L12.4125 11.2313L13.6313 16.5L9 13.7063L4.36875 16.5Z" fill="#1D1B20" clipPath="url(#half)" />
    </svg>
);