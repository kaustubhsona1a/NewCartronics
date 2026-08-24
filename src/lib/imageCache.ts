/**
 * Client-Side Media Cache Engine for Cartronics
 * 
 * Uses the Web Cache Storage API and memory caching to drastically reduce
 * Supabase Storage Cached Egress. Once an image is downloaded, it is stored
 * in the browser's persistent cache and served locally with ZERO network traffic.
 */

const CACHE_NAME = 'cartronics-media-cache-v1';
const memoryCache = new Map<string, string>();
const pendingRequests = new Map<string, Promise<string>>();

/**
 * Checks if CacheStorage is supported in the current environment
 */
function isCacheStorageAvailable(): boolean {
  return typeof window !== 'undefined' && 'caches' in window;
}

/**
 * Retrieves a locally cached Object URL for a given remote asset URL,
 * or fetches and caches it if not already stored.
 */
export async function getCachedMediaUrl(url: string): Promise<string> {
  if (!url || typeof url !== 'string' || url.startsWith('data:') || url.startsWith('blob:')) {
    return url;
  }

  // 1. Fast in-memory cache hit
  if (memoryCache.has(url)) {
    return memoryCache.get(url)!;
  }

  // 2. Prevent duplicate concurrent network fetches for the same URL
  if (pendingRequests.has(url)) {
    return pendingRequests.get(url)!;
  }

  const fetchPromise = (async () => {
    try {
      if (isCacheStorageAvailable()) {
        const cache = await caches.open(CACHE_NAME);
        const cachedResponse = await cache.match(url);

        if (cachedResponse) {
          const blob = await cachedResponse.blob();
          const objectUrl = URL.createObjectURL(blob);
          memoryCache.set(url, objectUrl);
          return objectUrl;
        }

        // Fetch over network with standard CORS handling
        try {
          const response = await fetch(url, {
            mode: 'cors',
            credentials: 'omit',
            cache: 'force-cache'
          });

          if (response.ok) {
            // Clone before reading body so we can store in CacheStorage
            await cache.put(url, response.clone());
            const blob = await response.blob();
            const objectUrl = URL.createObjectURL(blob);
            memoryCache.set(url, objectUrl);
            return objectUrl;
          }
        } catch (fetchErr) {
          // If direct fetch fails (e.g. CORS restrictions on 3rd-party placeholder), fallback to original url
          return url;
        }
      }
    } catch (err) {
      console.warn('[MEDIA CACHE] Error accessing cache storage, using direct URL:', err);
    }
    return url;
  })();

  pendingRequests.set(url, fetchPromise);

  try {
    const result = await fetchPromise;
    return result;
  } finally {
    pendingRequests.delete(url);
  }
}

/**
 * Preloads a list of image URLs into the local browser cache in the background
 */
export async function preloadMediaBatch(urls: string[]): Promise<void> {
  if (!urls || urls.length === 0) return;
  const uniqueUrls = Array.from(new Set(urls.filter(Boolean)));
  
  // Use non-blocking idle callback or low-priority promise chain
  const runPreload = () => {
    Promise.allSettled(uniqueUrls.map(url => getCachedMediaUrl(url))).catch(() => {});
  };

  if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
    (window as any).requestIdleCallback(runPreload, { timeout: 3000 });
  } else {
    setTimeout(runPreload, 100);
  }
}

/**
 * Purges the media cache (useful when admin modifies or purges inventory images)
 */
export async function clearMediaCache(): Promise<void> {
  // Revoke object URLs in memory to prevent leaks
  memoryCache.forEach((objUrl) => {
    if (objUrl.startsWith('blob:')) {
      URL.revokeObjectURL(objUrl);
    }
  });
  memoryCache.clear();

  if (isCacheStorageAvailable()) {
    try {
      await caches.delete(CACHE_NAME);
      console.log('[MEDIA CACHE] Persistent CacheStorage purged successfully.');
    } catch (e) {
      console.warn('[MEDIA CACHE] Failed to clear CacheStorage:', e);
    }
  }
}
