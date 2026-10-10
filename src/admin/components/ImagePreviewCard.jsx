import React, { useState, useEffect } from 'react';
import { Loader2, AlertTriangle, AlertCircle, RefreshCw, X, ExternalLink, Image as ImageIcon } from 'lucide-react';
import { validateImageUrl } from '../../lib/imageUrlUtils';

/**
 * ImagePreviewCard Component
 * Provides live image preview, loading state, error resilience, retry action,
 * and mixed-content warnings for external or Supabase Storage URLs.
 */
export default function ImagePreviewCard({
  url,
  label = 'Cover Image',
  onRemove,
  aspectRatio = '16/9',
  className = ''
}) {
  const [loadState, setLoadState] = useState('idle'); // 'idle' | 'loading' | 'loaded' | 'error'
  const [retryKey, setRetryKey] = useState(0);

  const validation = url ? validateImageUrl(url) : { isValid: false, isHttpWarning: false };

  useEffect(() => {
    if (!url || !validation.isValid) {
      setLoadState('idle');
      return;
    }
    setLoadState('loading');
  }, [url, retryKey]);

  if (!url) return null;

  return (
    <div className={`admin-image-preview-card ${className}`} style={{ marginTop: '0.75rem', width: '100%', maxWidth: '420px' }}>
      {/* Validation warning if http:// */}
      {validation.isHttpWarning && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.5rem',
          padding: '0.5rem 0.75rem', marginBottom: '0.5rem',
          background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)',
          borderRadius: '6px', fontSize: '0.78rem', color: '#fbbf24'
        }}>
          <AlertTriangle size={14} style={{ flexShrink: 0 }} />
          <span>Warning: This URL uses <code>http://</code>. It may be blocked on HTTPS by mixed-content security.</span>
        </div>
      )}

      {/* Validation error if format invalid */}
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
        background: 'rgba(0, 0, 0, 0.4)',
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
            background: 'rgba(5, 10, 22, 0.8)', gap: '0.5rem', color: 'var(--admin-text-muted)',
            zIndex: 2
          }}>
            <Loader2 size={24} className="spin" style={{ color: 'var(--admin-accent)' }} />
            <span style={{ fontSize: '0.75rem' }}>Loading image preview...</span>
          </div>
        )}

        {/* Failed to Load State (Resilient - URL is preserved) */}
        {loadState === 'error' && (
          <div style={{
            position: 'absolute', inset: 0,
            padding: '1rem',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            textAlign: 'center', background: 'rgba(239, 68, 68, 0.05)',
            color: 'var(--admin-text)', gap: '0.5rem', zIndex: 2
          }}>
            <ImageIcon size={28} style={{ color: 'var(--admin-text-muted)', opacity: 0.5 }} />
            <div style={{ fontSize: '0.78rem', color: '#fca5a5', maxWidth: '300px', lineHeight: 1.4 }}>
              Preview unavailable. Host may block hotlinking or require cookies.
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--admin-text-muted)' }}>
              (Original URL will still be saved)
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
              <button
                type="button"
                onClick={() => setRetryKey(k => k + 1)}
                className="admin-btn-secondary"
                style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem', minHeight: '28px' }}
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
                style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem', minHeight: '28px', textDecoration: 'none' }}
                title="Open image in new tab to verify directly"
              >
                <ExternalLink size={12} />
                <span>Test Link</span>
              </a>
            </div>
          </div>
        )}

        {/* Actual Image */}
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
