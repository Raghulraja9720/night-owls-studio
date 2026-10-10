/**
 * Image URL utilities and validation for Night Owls Studio
 * Supports Supabase Storage, Unsplash, Cloudinary, ImgBB, Imgur, CDNs, and arbitrary external image hosts.
 */

/**
 * Validates a single image URL.
 * Accepts any valid HTTP/HTTPS URL (including extensionless, signed, and query-parameterized URLs).
 * Rejects unsupported schemes (javascript:, data:, file:, etc.) and malformed URLs.
 * 
 * @param {string} urlString
 * @returns {{ isValid: boolean, isHttpWarning: boolean, error?: string, normalizedUrl?: string }}
 */
export function validateImageUrl(urlString) {
  if (!urlString || typeof urlString !== 'string') {
    return { isValid: false, isHttpWarning: false, error: 'URL cannot be empty' };
  }

  const trimmed = urlString.trim();
  if (!trimmed) {
    return { isValid: false, isHttpWarning: false, error: 'URL cannot be empty' };
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
        error: `Protocol "${parsed.protocol}" is not supported. Use https:// or http://.`
      };
    }

    // Must have a valid host
    if (!parsed.hostname || !parsed.hostname.includes('.')) {
      return {
        isValid: false,
        isHttpWarning: false,
        error: 'URL must contain a valid domain name (e.g. example.com).'
      };
    }

    const isHttpWarning = parsed.protocol === 'http:';

    return {
      isValid: true,
      isHttpWarning,
      error: undefined,
      normalizedUrl: trimmed
    };
  } catch {
    return {
      isValid: false,
      isHttpWarning: false,
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
 *   lineResults: { line: number, raw: string, isValid: boolean, isHttpWarning: boolean, error?: string }[],
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
