import React from 'react';
import { Helmet } from 'react-helmet';

const SLOW_IMAGE_URLS = [
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=4000&q=80',
  'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=4000&q=80',
  'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=4000&q=80',
  'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=4000&q=80',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=4000&q=80',
  'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=4000&q=80',
  'https://images.unsplash.com/photo-1454023492550-5696f8ff10e1?auto=format&fit=crop&w=4000&q=80',
  'https://images.unsplash.com/photo-1519985176271-adb1088fa94c?auto=format&fit=crop&w=4000&q=80',
  'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=4000&q=80',
  'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=4000&q=80'
];

const SlowImage = ({ src, alt }) => {
  const [loadedSrc, setLoadedSrc] = React.useState(null);
  React.useEffect(() => {
    const timer = setTimeout(() => setLoadedSrc(src), 2500);
    return () => clearTimeout(timer);
  }, [src]);
  
  return (
    <div style={{ margin: '1rem 0', background: '#eee', minHeight: 350, height: 350, width: '100%', borderRadius: 8, overflow: 'hidden' }}>
      {loadedSrc ? (
        <img src={loadedSrc} alt={alt} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8, display: 'block' }} />
      ) : (
        <span style={{ color: '#888', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: 350 }}>Loading image...</span>
      )}
    </div>
  );
};

const SlowGallery = () => {
  // Intentionally block the main thread for ~7 seconds to demonstrate poor performance
  React.useEffect(() => {
    const start = performance.now();
    while (performance.now() - start < 7000) {
      // Busy-wait loop for 7 seconds
    }
  }, []);

  return (
    <>
      <Helmet>
        <title>Slow Load Demo</title>
      </Helmet>
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: 32 }}>
        <h1>Slow Loading Gallery</h1>
        <p>
          This gallery simulates poor performance with large images and artificial delays.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, minHeight: 200 }}>
          {SLOW_IMAGE_URLS.map((url, idx) => (
            <SlowImage key={`${url}-${idx}`} src={url} alt={`Demo slow image ${idx + 1}`} />
          ))}
        </div>
      </div>
    </>
  );
};

export default SlowGallery;
