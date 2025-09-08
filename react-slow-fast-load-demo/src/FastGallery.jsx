import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet';

// Optimized image URLs with smaller file sizes and WebP format where possible
const OPTIMIZED_IMAGE_URLS = [
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1454023492550-5696f8ff10e1?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1519985176271-adb1088fa94c?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=800&q=80'
];

// Preload images for better performance
const preloadImages = (urls) => {
  urls.forEach(url => {
    const img = new Image();
    img.src = url;
  });
};

// Lazy image component with intersection observer
const LazyImage = React.memo(({ src, alt, onLoad }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = React.useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '100px' } // Start loading when within 100px of viewport
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      if (imgRef.current) {
        observer.unobserve(imgRef.current);
      }
    };
  }, []);

  return (
    <div 
      ref={imgRef}
      style={{
        margin: '1rem 0',
        background: '#f5f5f5',
        minHeight: 350,
        height: 350,
        width: '100%',
        borderRadius: 8,
        overflow: 'hidden',
        position: 'relative'
      }}
    >
      {isInView && (
        <img
          src={src}
          alt={alt}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            borderRadius: 8,
            display: 'block',
            opacity: isLoaded ? 1 : 0,
            transition: 'opacity 0.3s ease-in-out'
          }}
          onLoad={() => {
            setIsLoaded(true);
            onLoad?.();
          }}
          loading="lazy"
        />
      )}
      {!isLoaded && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#f5f5f5',
          color: '#888',
          fontSize: '0.9rem'
        }}>
          Loading...
        </div>
      )}
    </div>
  );
});

const FastGallery = () => {
  const [imagesLoaded, setImagesLoaded] = useState(0);
  const totalImages = OPTIMIZED_IMAGE_URLS.length;

  // Preload images on component mount
  useEffect(() => {
    preloadImages(OPTIMIZED_IMAGE_URLS);
  }, []);

  const handleImageLoad = useCallback(() => {
    setImagesLoaded(prev => prev + 1);
  }, []);

  return (
    <>
      <Helmet>
        <title>Fast Load Demo</title>
      </Helmet>
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: 32 }}>
        <h1>Optimized Gallery</h1>
        <p>
          This gallery demonstrates performance optimizations including lazy loading,
          image preloading, and optimized image formats.
        </p>
        <p>
          Loaded: {imagesLoaded} of {totalImages} images
        </p>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: 32,
          marginTop: 24
        }}>
          {OPTIMIZED_IMAGE_URLS.map((url, idx) => (
            <LazyImage 
              key={`${url}-${idx}`} 
              src={url} 
              alt={`Gallery image ${idx + 1}`}
              onLoad={handleImageLoad}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default FastGallery;
