import React, { useState, useEffect, useRef, ImgHTMLAttributes } from 'react';
import { getCachedMediaUrl } from '../lib/imageCache';

interface OptimizedImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
  disableCache?: boolean;
  /**
   * If true (default), the image will only load when it enters or is close to the viewport.
   * This drastically cuts down egress cache usage.
   */
  viewportLazy?: boolean;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt = '',
  className = '',
  fallbackSrc = "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=800",
  disableCache = false,
  viewportLazy = true,
  loading = 'lazy',
  decoding = 'async',
  onError,
  ...props
}) => {
  const [displaySrc, setDisplaySrc] = useState<string>('');
  const [isVisible, setIsVisible] = useState<boolean>(!viewportLazy);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement | null>(null);

  // Intersection Observer for viewport-aware loading
  useEffect(() => {
    if (!viewportLazy) {
      setIsVisible(true);
      return;
    }

    // If IntersectionObserver is not available, load immediately
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: '150px 0px', // Pre-trigger 150px before entering viewport for smooth scrolling
        threshold: 0.01,
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [viewportLazy]);

  // Load and cache image only when visible
  useEffect(() => {
    if (!isVisible) return;

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
      .then((cachedUrl) => {
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
  }, [src, isVisible, disableCache, fallbackSrc]);

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
      ref={imgRef}
      src={displaySrc || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 4 3"%3E%3C/svg%3E'}
      alt={alt}
      loading={loading}
      decoding={decoding}
      onError={handleError}
      className={className}
      {...props}
    />
  );
};

