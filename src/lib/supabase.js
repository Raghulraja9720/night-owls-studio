import { createClient } from '@supabase/supabase-js';

// Sanitize inputs by trimming whitespace and accidental quotes
const sanitize = (val) => (val ? String(val).trim().replace(/^["']|["']$/g, '') : '');

const rawUrl = sanitize(import.meta.env.VITE_SUPABASE_URL);
const rawKey = sanitize(import.meta.env.VITE_SUPABASE_ANON_KEY);

// Helper to validate and normalize URL
const getValidUrl = (urlStr) => {
  if (!urlStr) return null;
  try {
    // If protocol was omitted (e.g. "xyz.supabase.co"), prepend https://
    const normalized = urlStr.startsWith('http://') || urlStr.startsWith('https://')
      ? urlStr
      : `https://${urlStr}`;
    const parsed = new URL(normalized);
    // Strip subpaths like /rest/v1 if accidentally included
    return parsed.origin;
  } catch {
    return null;
  }
};

const validUrl = getValidUrl(rawUrl);
export const isSupabaseConfigured = Boolean(validUrl && rawKey);

if (!isSupabaseConfigured) {
  console.error(
    '[Supabase Config Error] Missing or invalid Supabase environment variables.\n' +
    'Please verify that VITE_SUPABASE_URL (format: https://<project-ref>.supabase.co) ' +
    'and VITE_SUPABASE_ANON_KEY are correctly configured in Vercel / .env.'
  );
}

// Fallback to a syntactically valid URL if misconfigured, preventing createClient from throwing
// an unhandled top-level exception that produces a blank white screen before React can mount.
const clientUrl = validUrl || 'https://unconfigured-project.supabase.co';
const clientKey = rawKey || 'unconfigured-anon-key';

export const supabase = createClient(clientUrl, clientKey);

