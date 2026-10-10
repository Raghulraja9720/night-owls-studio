import React, { useState, useEffect } from 'react';
import { Loader2, AlertTriangle, AlertCircle, RefreshCw, X, ExternalLink, Image as ImageIcon, CheckCircle, Info } from 'lucide-react';
import { validateImageUrl } from '../../lib/imageUrlUtils';

/**
 * ImagePreviewCard Component
 * Provides live image preview, loading state, error resilience, retry action,
 * share-page detection, and CORS/hotlinking diagnostics for any external or Supabase URL.
 */
export default function ImagePreviewCard({
  url,
  label = 'Cover Image',
  onRemove,
  onApplyDirectUrl,
  aspectRatio = '16/9',
  className = ''
}) {
  const [loadState, setLoadState] = useState('idle'); // 'idle' | 'loading' | 'loaded' | 'error'
  const [retryKey, setRetryKey] = useState(0);

  const validation = url ? validateImageUrl(url) : { isValid: false, isHttpWarning: false, isWebpageShareLink: false };

  useEffect(() => {
    if (!url || !validation.isValid) {
      setLoadState('idle');
      return;
    }
    setLoadState('loading');
  }, [url, retryKey]);

  if (!url) return null;

  return (
    <div className={`admin-image-preview-card ${className}`} style={{ marginTop: '0.75rem', width: '100%', maxWidth: '440px' }}>
      {/* Share Page Warning */}
      {validation.isWebpageShareLink && (
        <div style={{
          padding: '0.65rem 0.85rem', marginBottom: '0.5rem',
          background: 'rgba(234, 88, 12, 0.12)', border: '1px solid rgba(234, 88, 12, 0.4)',
          borderRadius: '8px', fontSize: '0.8rem', color: '#fb923c'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontWeight: 600, marginBottom: '0.25rem' }}>
            <AlertTriangle size={15} style={{ flexShrink: 0 }} />
            <span>Webpage Share Link Detected ({validation.shareService})</span>
          </div>
          <div style={{ fontSize: '0.76rem', color: '#fed7aa', lineHeight: 1.4 }}>
            {validation.shareAdvice || 'Share links load an HTML webpage, not raw image bytes. Web browsers cannot render an HTML page inside an image element.'}
          </div>
          {validation.directUrlSuggestion && onApplyDirectUrl && (
            <button
              type="button"
              onClick={() => onApplyDirectUrl(validation.directUrlSuggestion)}
              className="admin-btn-secondary"
              style={{ marginTop: '0.5rem', padding: '0.25rem 0.5rem', fontSize: '0.74rem', minHeight: '26px' }}
            >
              Use Direct Image Link Instead
            </button>
          )}
        </div>
      )}

      {/* Validation warning if http:// */}
      {validation.isHttpWarning && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.5rem',
          padding: '0.5rem 0.75rem', marginBottom: '0.5rem',
          background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)',
          borderRadius: '6px', fontSize: '0.78rem', color: '#fbbf24'
        }}>
          <AlertTriangle size={14} style={{ flexShrink: 0 }} />
          <span>Warning: This URL uses <code>http://</code>. It may be blocked on HTTPS production sites by mixed-content security.</span>
        </div>
      )}

      {/* Validation error if syntax invalid */}
      {!validation.isValid && validation.error && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.5rem',
          padding: '0.5rem 0.75rem', marginBottom: '0.5rem',
          background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: '6px', fontSize: '0.78rem', color: '#f87171'
        }}>
          <AlertCircle size={14} style={{ flexShrink: 0 }} />
          <span>{validation.error}</span>
        </div>
      )}

      {/* Preview Box Frame */}
      <div style={{
        position: 'relative',
        width: '100%',
        aspectRatio,
        background: 'rgba(0, 0, 0, 0.5)',
        border: '1px solid var(--admin-border)',
        borderRadius: '8px',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {/* Loading Spinner */}
        {loadState === 'loading' && (
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(5, 10, 22, 0.85)', gap: '0.5rem', color: 'var(--admin-text-muted)',
            zIndex: 2
          }}>
            <Loader2 size={24} className="spin" style={{ color: 'var(--admin-accent)' }} />
            <span style={{ fontSize: '0.75rem' }}>Loading image from host...</span>
          </div>
        )}

        {/* Failed to Load State (Resilient - URL is preserved in form/database) */}
        {loadState === 'error' && (
          <div style={{
            position: 'absolute', inset: 0,
            padding: '1rem',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            textAlign: 'center', background: 'rgba(239, 68, 68, 0.07)',
            color: 'var(--admin-text)', gap: '0.45rem', zIndex: 2
          }}>
            <ImageIcon size={26} style={{ color: '#f87171', opacity: 0.8 }} />
            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#fca5a5' }}>
              {validation.isWebpageShareLink
                ? 'Webpage link cannot be rendered as an image'
                : 'Image failed to load in browser'}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--admin-text-muted)', maxWidth: '320px', lineHeight: 1.4 }}>
              {validation.isWebpageShareLink
                ? 'This link returned an HTML webpage. Web browsers only render direct image bytes (e.g. .jpg, .png, .webp, or CDN endpoints).'
                : 'The host may block hotlinking, require credentials, or the URL does not return raw image bytes. Note: Starting with HTTPS does not guarantee an image.'}
            </div>
            <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
              (Original URL is retained and not discarded)
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.35rem' }}>
              <button
                type="button"
                onClick={() => setRetryKey(k => k + 1)}
                className="admin-btn-secondary"
                style={{ padding: '0.3rem 0.65rem', fontSize: '0.75rem', minHeight: '28px' }}
                title="Retry loading preview"
              >
                <RefreshCw size={12} />
                <span>Retry</span>
              </button>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="admin-btn-secondary"
                style={{ padding: '0.3rem 0.65rem', fontSize: '0.75rem', minHeight: '28px', textDecoration: 'none' }}
                title="Open image in new tab to verify directly"
              >
                <ExternalLink size={12} />
                <span>Test Link</span>
              </a>
            </div>
          </div>
        )}

        {/* Actual Image Element */}
        {validation.isValid && (
          <img
            key={retryKey}
            src={url}
            alt={label}
            onLoad={() => setLoadState('loaded')}
            onError={() => setLoadState('error')}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: loadState === 'error' ? 'none' : 'block'
            }}
          />
        )}

        {/* Success Loaded Indicator Tag */}
        {loadState === 'loaded' && (
          <div style={{
            position: 'absolute', bottom: '0.5rem', left: '0.5rem',
            background: 'rgba(16, 185, 129, 0.85)', backdropFilter: 'blur(4px)',
            color: 'white', padding: '0.2rem 0.5rem', borderRadius: '4px',
            fontSize: '0.68rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem',
            zIndex: 3
          }}>
            <CheckCircle size={11} />
            <span>Direct URL Rendered</span>
          </div>
        )}

        {/* Remove Button Overlay */}
        {onRemove && (
          <button
            type="button"
            onClick={onRemove}
            aria-label={`Remove ${label}`}
            style={{
              position: 'absolute',
              top: '0.5rem',
              right: '0.5rem',
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              background: 'rgba(0, 0, 0, 0.75)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              zIndex: 3
            }}
          >
            <X size={14} />
          </button>
        )}
      </div>
    </div>
  );
}
