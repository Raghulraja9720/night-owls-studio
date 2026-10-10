/**
 * Image URL utilities and validation for Night Owls Studio
 * Supports Supabase Storage, Unsplash, Cloudinary, ImgBB, Imgur, CDNs, and arbitrary external image hosts.
 * URL-Only Image Management Specification:
 * - Accepts any valid HTTP/HTTPS URL
 * - Supports query parameters, signed tokens, and extensionless image endpoints
 * - Detects webpage/share links that return HTML instead of raw image bytes
 * - Does NOT assume a URL is a valid image just because it starts with https://
 */

/**
 * Detects whether a URL is a webpage/share link rather than a direct image URL.
 * Webpages return HTML documents which cannot be decoded by an <img> tag.
 *
 * @param {string} urlString
 * @returns {{
 *   isSharePage: boolean,
 *   service?: string,
 *   advice?: string,
 *   directUrlSuggestion?: string
 * }}
 */
export function detectWebpageShareLink(urlString) {
  if (!urlString || typeof urlString !== 'string') {
    return { isSharePage: false };
  }

  const trimmed = urlString.trim();

  try {
    const parsed = new URL(trimmed);
    const host = parsed.hostname.toLowerCase();
    const pathname = parsed.pathname;

    // Google Drive share / preview link
    if (host.includes('drive.google.com')) {
      const match = pathname.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
      const idFromQuery = parsed.searchParams.get('id');
      const fileId = match ? match[1] : idFromQuery;
      return {
        isSharePage: true,
        service: 'Google Drive Viewer',
        advice: 'Google Drive view/preview links return an HTML webpage instead of direct image bytes.',
        directUrlSuggestion: fileId ? `https://drive.google.com/uc?export=view&id=${fileId}` : undefined
      };
    }

    // Google Photos share link
    if (host.includes('photos.app.goo.gl') || (host.includes('photos.google.com') && pathname.includes('/share/'))) {
      return {
        isSharePage: true,
        service: 'Google Photos Share',
        advice: 'Google Photos share links return an album page. Open the photo, right-click the image, and select "Copy Image Address".'
      };
    }

    // Dropbox share link (e.g. dropbox.com/s/..., dropbox.com/scl/...)
    if (host.includes('dropbox.com')) {
      const isRawOrDl = parsed.searchParams.get('raw') === '1' || parsed.searchParams.get('dl') === '1';
      if (!isRawOrDl) {
        const direct = new URL(parsed.href);
        direct.searchParams.set('raw', '1');
        return {
          isSharePage: true,
          service: 'Dropbox Preview Page',
          advice: 'Standard Dropbox share links load an HTML preview wrapper. Append "?raw=1" or use the direct link.',
          directUrlSuggestion: direct.href
        };
      }
    }

    // Imgur gallery or album (e.g. imgur.com/gallery/xyz, imgur.com/a/xyz)
    if (host === 'imgur.com' || host === 'www.imgur.com') {
      if (pathname.startsWith('/gallery/') || pathname.startsWith('/a/')) {
        return {
          isSharePage: true,
          service: 'Imgur Album/Gallery',
          advice: 'Imgur gallery links load an HTML page. Use the direct link starting with https://i.imgur.com/<id>.jpg'
        };
      }
    }

    // Pinterest pin
    if (host.includes('pinterest.com') || host === 'pin.it') {
      return {
        isSharePage: true,
        service: 'Pinterest Pin Page',
        advice: 'Pinterest pin links are social webpages. Right-click the image and select "Copy Image Address" (direct links usually start with i.pinimg.com).'
      };
    }

    // Flickr photo page
    if (host.includes('flickr.com') && !host.includes('staticflickr.com')) {
      return {
        isSharePage: true,
        service: 'Flickr Photo Page',
        advice: 'Flickr photo pages are HTML wrappers. Use the static direct link from staticflickr.com or right-click the image.'
      };
    }

    // Postimages share link (postimg.cc vs i.postimg.cc)
    if (host === 'postimg.cc') {
      return {
        isSharePage: true,
        service: 'Postimages Viewer Page',
        advice: 'This is a viewer page. Use the direct link starting with https://i.postimg.cc/...'
      };
    }

    // ImgBB share page (ibb.co vs i.ibb.co)
    if (host === 'ibb.co') {
      return {
        isSharePage: true,
        service: 'ImgBB Viewer Page',
        advice: 'This is an ImgBB webpage viewer. Right-click the image and choose "Copy Image Address" (direct links usually start with i.ibb.co).'
      };
    }

    return { isSharePage: false };
  } catch {
    return { isSharePage: false };
  }
}

/**
 * Validates a single image URL.
 * Accepts any valid HTTP/HTTPS URL (including extensionless, signed, and query-parameterized URLs).
 * Rejects unsupported schemes (javascript:, data:, file:, etc.) and malformed URLs.
 * Detects if the URL is a webpage share link rather than direct image bytes.
 *
 * @param {string} urlString
 * @returns {{
 *   isValid: boolean,
 *   isHttpWarning: boolean,
 *   isWebpageShareLink: boolean,
 *   shareService?: string,
 *   shareAdvice?: string,
 *   directUrlSuggestion?: string,
 *   error?: string,
 *   normalizedUrl?: string
 * }}
 */
export function validateImageUrl(urlString) {
  if (!urlString || typeof urlString !== 'string') {
    return {
      isValid: false,
      isHttpWarning: false,
      isWebpageShareLink: false,
      error: 'URL cannot be empty'
    };
  }

  const trimmed = urlString.trim();
  if (!trimmed) {
    return {
      isValid: false,
      isHttpWarning: false,
      isWebpageShareLink: false,
      error: 'URL cannot be empty'
    };
  }

  // Reject dangerous schemes immediately
  const lower = trimmed.toLowerCase();
  if (
    lower.startsWith('javascript:') ||
    lower.startsWith('data:') ||
    lower.startsWith('file:') ||
    lower.startsWith('vbscript:')
  ) {
    return {
      isValid: false,
      isHttpWarning: false,
      isWebpageShareLink: false,
      error: 'Unsupported URL scheme. Please use a valid http:// or https:// URL.'
    };
  }

  try {
    const parsed = new URL(trimmed);

    // Require http: or https:
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return {
        isValid: false,
        isHttpWarning: false,
        isWebpageShareLink: false,
        error: `Protocol "${parsed.protocol}" is not supported. Use https:// or http://.`
      };
    }

    // Must have a valid host
    if (!parsed.hostname || !parsed.hostname.includes('.')) {
      return {
        isValid: false,
        isHttpWarning: false,
        isWebpageShareLink: false,
        error: 'URL must contain a valid domain name (e.g. example.com).'
      };
    }

    const isHttpWarning = parsed.protocol === 'http:';
    const shareCheck = detectWebpageShareLink(trimmed);

    return {
      isValid: true,
      isHttpWarning,
      isWebpageShareLink: shareCheck.isSharePage,
      shareService: shareCheck.service,
      shareAdvice: shareCheck.advice,
      directUrlSuggestion: shareCheck.directUrlSuggestion,
      error: undefined,
      normalizedUrl: trimmed
    };
  } catch {
    return {
      isValid: false,
      isHttpWarning: false,
      isWebpageShareLink: false,
      error: 'Invalid URL format. Please enter a complete URL starting with https://'
    };
  }
}

/**
 * Validates a list of gallery URLs (e.g. from textarea one-per-line).
 *
 * @param {string|string[]} input 
 * @returns {{
 *   validUrls: string[],
 *   lineResults: {
 *     line: number,
 *     raw: string,
 *     isValid: boolean,
 *     isHttpWarning: boolean,
 *     isWebpageShareLink: boolean,
 *     shareService?: string,
 *     shareAdvice?: string,
 *     directUrlSuggestion?: string,
 *     error?: string
 *   }[],
 *   hasErrors: boolean
 * }}
 */
export function validateGalleryUrls(input) {
  const lines = Array.isArray(input)
    ? input
    : (input || '').split('\n');

  const lineResults = [];
  const validUrls = [];
  let hasErrors = false;

  lines.forEach((raw, idx) => {
    const trimmed = raw.trim();
    if (!trimmed) return; // ignore blank lines

    const result = validateImageUrl(trimmed);
    lineResults.push({
      line: idx + 1,
      raw: trimmed,
      isValid: result.isValid,
      isHttpWarning: result.isHttpWarning,
      isWebpageShareLink: result.isWebpageShareLink,
      shareService: result.shareService,
      shareAdvice: result.shareAdvice,
      directUrlSuggestion: result.directUrlSuggestion,
      error: result.error
    });

    if (result.isValid) {
      validUrls.push(trimmed);
    } else {
      hasErrors = true;
    }
  });

  return {
    validUrls,
    lineResults,
    hasErrors
  };
}

/**
 * Returns a fallback placeholder if the provided URL is empty or broken.
 */
export const DEFAULT_PROJECT_PLACEHOLDER = '/assets/images/sai-indirabala.png';
