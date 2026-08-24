import React, { useState, useEffect, ImgHTMLAttributes } from 'react';
import { getCachedMediaUrl } from '../lib/imageCache';

interface OptimizedImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
  disableCache?: boolean;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt = '',
  className = '',
  fallbackSrc = "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=800",
  disableCache = false,
  loading = 'lazy',
  decoding = 'async',
  onError,
  ...props
}) => {
  const [displaySrc, setDisplaySrc] = useState<string>(src || fallbackSrc);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let isMounted = true;
    if (!src) {
      setDisplaySrc(fallbackSrc);
      return;
    }

    setHasError(false);

    if (disableCache) {
      setDisplaySrc(src);
      return;
    }

    // Attempt to load from browser media cache
    getCachedMediaUrl(src)
      .then(cachedUrl => {
        if (isMounted) {
          setDisplaySrc(cachedUrl);
        }
      })
      .catch(() => {
        if (isMounted) {
          setDisplaySrc(src);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [src, disableCache, fallbackSrc]);

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    if (!hasError && fallbackSrc && displaySrc !== fallbackSrc) {
      setHasError(true);
      setDisplaySrc(fallbackSrc);
    }
    if (onError) {
      onError(e);
    }
  };

  return (
    <img
      src={displaySrc}
      alt={alt}
      loading={loading}
      decoding={decoding}
      onError={handleError}
      className={className}
      {...props}
    />
  );
};
