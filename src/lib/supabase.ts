import { createClient } from '@supabase/supabase-js';
import imageCompression from 'browser-image-compression';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_ANON || 'placeholder';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export function handleSupabaseError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo = {
    error: error instanceof Error ? error.message : String(error),
    operationType,
    path
  }
  console.error('Supabase Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export async function deleteImagesFromStorage(items: any[], bucket: string = 'vehicle-images'): Promise<void> {
  if (!items || items.length === 0) return;

  const urls: string[] = [];
  items.forEach(item => {
    if (typeof item === 'string') {
      let cleanItem = item;
      if (item.includes('|||')) {
        cleanItem = item.split('|||')[0];
      }
      urls.push(cleanItem);
    } else if (item && typeof item === 'object') {
      let mainUrl = item.thumbnail_url || item.gallery_url || item.fullscreen_url || item.image_url;
      if (mainUrl) {
        if (typeof mainUrl === 'string' && mainUrl.includes('|||')) {
          mainUrl = mainUrl.split('|||')[0];
        }
        urls.push(mainUrl);
      }
    }
  });

  const paths = urls.map(url => {
    try {
      const urlObj = new URL(url);
      const pathname = urlObj.pathname;
      
      // Look for "/public/bucket_name/" case-insensitively
      const publicIndex = pathname.toLowerCase().indexOf(`/public/${bucket.toLowerCase()}/`);
      if (publicIndex !== -1) {
        const splitStart = publicIndex + `/public/${bucket}/`.length;
        return decodeURIComponent(pathname.substring(splitStart));
      }
      
      // Alternate check for other Supabase URL structures (e.g. without /public/)
      const bucketIndex = pathname.toLowerCase().indexOf(`/${bucket.toLowerCase()}/`);
      if (bucketIndex !== -1) {
        const splitStart = bucketIndex + `/${bucket}/`.length;
        return decodeURIComponent(pathname.substring(splitStart));
      }

      // Fallback for custom domains or different URL formats
      if (url.toLowerCase().includes(bucket.toLowerCase())) {
        const fallbackSplit = url.split(new RegExp(bucket + '/', 'i'));
        if (fallbackSplit.length > 1) {
          return decodeURIComponent(fallbackSplit[1].split('?')[0]);
        }
      }
      return null;
    } catch (e) {
      console.warn('[PATH PARSE ERROR]', e, 'for url:', url);
      return null;
    }
  }).filter(Boolean) as string[];

  console.log(`[STORAGE PURGE] Attempting to delete ${paths.length} items from bucket "${bucket}":`, paths);

  if (paths.length > 0) {
    const { data, error } = await supabase.storage.from(bucket).remove(paths);
    if (error) {
      console.error(`[STORAGE PURGE ERROR] Failed to delete images from bucket "${bucket}":`, error);
    } else {
      console.log(`[STORAGE PURGE SUCCESS] Deleted from bucket "${bucket}":`, data);
    }
  }
}

export async function cleanupLegacyImageVariants(bucket: string = 'vehicle-images'): Promise<{deletedCount: number, errors: any[]}> {
  let deletedCount = 0;
  const errors: any[] = [];
  try {
    const { data: list, error } = await supabase.storage.from(bucket).list('vehicles', {
      limit: 1000,
      offset: 0,
    });
    if (error) {
      errors.push(error);
      return { deletedCount, errors };
    }

    const filesToDelete = list?.filter(f => 
      f.name.endsWith('-thumb.webp') || 
      f.name.endsWith('-gallery.webp') || 
      f.name.endsWith('-full.webp')
    ).map(f => `vehicles/${f.name}`) || [];

    if (filesToDelete.length > 0) {
      const { data, error: removeError } = await supabase.storage.from(bucket).remove(filesToDelete);
      if (removeError) {
        errors.push(removeError);
      } else {
        deletedCount = data?.length || 0;
      }
    }
  } catch (err) {
    errors.push(err);
  }
  return { deletedCount, errors };
}

export async function uploadImageToStorage(file: File, path: string, bucket: string = 'vehicle-images'): Promise<string> {
  let finalFile = file;
  
  if (file.type.startsWith('image/') && !file.type.includes('svg')) {
    const lowerPath = path.toLowerCase();
    const isHero = lowerPath.includes('hero') || lowerPath.includes('backdrop');
    const isDeliveryOrAbout = lowerPath.includes('delivery') || lowerPath.includes('about');
    const isLogo = lowerPath.includes('logo');
    const isLead = lowerPath.includes('lead');

    // Multi-tier smart compression for optimal visual fidelity & minimal egress
    let compressionOptions = {
      maxSizeMB: 0.28, // ~280 KB default for crisp vehicle gallery photos
      maxWidthOrHeight: 1440,
      useWebWorker: true,
      fileType: 'image/webp' as string,
      initialQuality: 0.86
    };

    if (isHero) {
      compressionOptions = {
        maxSizeMB: 0.45, // ~450 KB for full-width 2K hero backdrops
        maxWidthOrHeight: 1920,
        useWebWorker: true,
        fileType: 'image/webp' as string,
        initialQuality: 0.88
      };
    } else if (isDeliveryOrAbout) {
      compressionOptions = {
        maxSizeMB: 0.25, // ~250 KB for delivery gallery & about photos
        maxWidthOrHeight: 1440,
        useWebWorker: true,
        fileType: 'image/webp' as string,
        initialQuality: 0.84
      };
    } else if (isLogo) {
      compressionOptions = {
        maxSizeMB: 0.08, // ~80 KB for logos
        maxWidthOrHeight: 600,
        useWebWorker: true,
        fileType: 'image/webp' as string,
        initialQuality: 0.90
      };
    } else if (isLead) {
      compressionOptions = {
        maxSizeMB: 0.15, // ~150 KB for customer valuation submissions
        maxWidthOrHeight: 1024,
        useWebWorker: true,
        fileType: 'image/webp' as string,
        initialQuality: 0.80
      };
    }

    try {
      finalFile = await imageCompression(file, compressionOptions);
    } catch (err) {
      console.warn('Image compression failed, using original file', err);
    }
  }

  const fileExt = finalFile.type === 'image/webp' ? 'webp' : (finalFile.name.split('.').pop() || 'jpg');
  const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
  const filePath = `${path}/${fileName}`;

  // Upload with 1-Year (31,536,000s) immutable cache header so CDN & browsers cache permanently
  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(filePath, finalFile, {
      cacheControl: '31536000', // 1 year immutable cache header
      upsert: false,
      contentType: finalFile.type || 'image/webp'
    });

  if (uploadError) {
    throw uploadError;
  }

  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath);

  return data.publicUrl;
}

