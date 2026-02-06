import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

export default function Save({ attributes }) {
    const { slides } = attributes;

    const getVideoEmbedUrl = (url) => {
        if (!url) return null;

        const youtubeRegex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/;
        const youtubeMatch = url.match(youtubeRegex);
        if (youtubeMatch) {
            return `https://www.youtube.com/embed/${youtubeMatch[1]}?autoplay=1&mute=1&loop=1&controls=0&playlist=${youtubeMatch[1]}`;
        }

        const vimeoRegex = /vimeo\.com\/(\d+)/;
        const vimeoMatch = url.match(vimeoRegex);
        if (vimeoMatch) {
            return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1&muted=1&loop=1&background=1`;
        }

        return null;
    };

    return (
        <div {...useBlockProps.save({ className: 'acemar-hero-slider' })}>
            <div className="splide">
                <div className="splide__track">
                    <ul className="splide__list">
                        {slides.map((slide) => {
                            const videoEmbedUrl = slide.mediaType === 'video' ? getVideoEmbedUrl(slide.videoUrl) : null;

                            return (
                                <li key={slide.id} className="splide__slide">
                                    <div className="hero-slide">
                                        {slide.mediaType === 'image' && slide.imageUrl && (
                                            <div 
                                                className="hero-background hero-background-image"
                                                style={{ backgroundImage: `url(${slide.imageUrl})` }}
                                            />
                                        )}

                                        {slide.mediaType === 'video' && videoEmbedUrl && (
                                            <div className="hero-background hero-background-video">
                                                <iframe
                                                    src={videoEmbedUrl}
                                                    frameBorder="0"
                                                    allow="autoplay; fullscreen; picture-in-picture"
                                                    allowFullScreen
                                                    title={`Video slide ${slide.id}`}
                                                />
                                            </div>
                                        )}

                                        <div className="hero-overlay" />

                                        <div className={`hero-content hero-content-${slide.alignment || 'center'}`}>
                                            <InnerBlocks.Content />
                                        </div>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                </div>

                <div className="splide__arrows">
                    <button className="splide__arrow splide__arrow--prev">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="15 18 9 12 15 6"></polyline>
                        </svg>
                    </button>
                    <button className="splide__arrow splide__arrow--next">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="9 18 15 12 9 6"></polyline>
                        </svg>
                    </button>
                </div>

                <ul className="splide__pagination"></ul>
            </div>
        </div>
    );
}