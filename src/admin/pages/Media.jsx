import React, { useState, useEffect, useRef } from 'react';
import { Upload, Trash2, Copy, Search, Image as ImageIcon, CheckCircle, AlertTriangle, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function Media() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const fileInputRef = useRef(null);

  // We assume a public bucket named 'media'
  const BUCKET_NAME = 'media';

  const fetchFiles = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.storage.from(BUCKET_NAME).list('', {
        limit: 100,
        sortBy: { column: 'created_at', order: 'desc' },
      });

      if (error) {
        if (error.message.includes('Bucket not found')) {
          console.warn('Bucket "media" not found. Please create it in Supabase.');
        } else {
          console.error('Error fetching media:', error);
        }
        setFiles([]);
        return;
      }

      // Filter out standard empty folder placeholders like .emptyFolderPlaceholder
      const validFiles = data?.filter(file => file.name !== '.emptyFolderPlaceholder') || [];
      
      // Get public URLs for each
      const filesWithUrls = validFiles.map(file => {
        const { data: { publicUrl } } = supabase.storage.from(BUCKET_NAME).getPublicUrl(file.name);
        return { ...file, publicUrl };
      });

      setFiles(filesWithUrls);
    } catch (err) {
      console.error('Fetch exception:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;

    setUploading(true);
    try {
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        // Clean filename: remove special chars, replace spaces with hyphens
        const fileExt = file.name.split('.').pop();
        const baseName = file.name.replace(`.${fileExt}`, '').replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
        const cleanName = `${baseName}-${Date.now()}.${fileExt}`;

        const { error } = await supabase.storage.from(BUCKET_NAME).upload(cleanName, file, {
          cacheControl: '3600',
          upsert: false
        });

        if (error) throw error;
      }
      
      // Refresh list
      await fetchFiles();
    } catch (error) {
      console.error('Error uploading:', error);
      alert(error.message === 'Bucket not found' 
        ? 'Please create a public bucket named "media" in your Supabase dashboard first.'
        : 'Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const checkUsage = async (publicUrl) => {
    // Check if used in projects
    const { data: projects } = await supabase.from('projects')
      .select('title')
      .or(`cover_image.eq.${publicUrl},images.cs.{${publicUrl}}`);
      
    // Check if used in team members
    const { data: team } = await supabase.from('team_members')
      .select('name')
      .eq('image_url', publicUrl);

    const uses = [];
    if (projects && projects.length > 0) uses.push(...projects.map(p => `Project: ${p.title}`));
    if (team && team.length > 0) uses.push(...team.map(t => `Team: ${t.name}`));
    
    return uses;
  };

  const handleDelete = async (file) => {
    const usage = await checkUsage(file.publicUrl);
    
    if (usage.length > 0) {
      const confirmMessage = `WARNING: This image is currently being used by:\n\n- ${usage.join('\n- ')}\n\nDeleting it will break these references. Are you absolutely sure you want to delete it?`;
      if (!window.confirm(confirmMessage)) return;
    } else {
      if (!window.confirm(`Are you sure you want to delete ${file.name}?`)) return;
    }

    try {
      const { error } = await supabase.storage.from(BUCKET_NAME).remove([file.name]);
      if (error) throw error;
      
      setFiles(files.filter(f => f.id !== file.id));
    } catch (error) {
      console.error('Error deleting:', error);
      alert('Failed to delete file.');
    }
  };

  const copyToClipboard = (url) => {
    navigator.clipboard.writeText(url);
    alert('URL copied to clipboard!');
  };

  const formatBytes = (bytes, decimals = 2) => {
    if (!+bytes) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
  };

  const filteredFiles = files.filter(f => f.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="admin-media-page" style={{ width: '100%', minWidth: 0 }}>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Media Library</h1>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap', minWidth: 0 }}>
          <div className="admin-search-box" style={{ position: 'relative', flex: 1, minWidth: 'min(100%, 200px)' }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--admin-text-muted)' }} />
            <input 
              type="text" 
              className="admin-input"
              placeholder="Search files..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '2.5rem', width: '100%' }}
            />
          </div>
          <button className="admin-btn-primary" onClick={handleUploadClick} disabled={uploading} style={{ flexShrink: 0 }}>
            {uploading ? <Loader2 size={18} className="spin" /> : <Upload size={18} />}
            <span>{uploading ? 'Uploading...' : 'Upload Media'}</span>
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            style={{ display: 'none' }} 
            multiple 
            accept="image/*" 
          />
        </div>
      </div>

      <div className="admin-card" style={{ minHeight: '400px' }}>
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--admin-text-muted)' }}>
            Loading media library...
          </div>
        ) : files.length === 0 ? (
          <div style={{ padding: '4rem 1rem', textAlign: 'center', color: 'var(--admin-text-muted)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            <ImageIcon size={48} style={{ opacity: 0.2 }} />
            <div>
              <p style={{ marginBottom: '0.5rem', fontWeight: 500, color: 'white' }}>No media files found</p>
              <p style={{ fontSize: '0.9rem' }}>Upload your first image to get started.<br/>(Make sure you have created a public bucket named "media" in Supabase!)</p>
            </div>
            <button className="admin-btn-primary" onClick={handleUploadClick} style={{ marginTop: '1rem' }}>
              <Upload size={18} /> <span>Upload Image</span>
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 180px), 1fr))', gap: '1.25rem', width: '100%', minWidth: 0 }}>
            {filteredFiles.map(file => (
              <div key={file.id} style={{ 
                background: 'rgba(255,255,255,0.02)', border: '1px solid var(--admin-border)', 
                borderRadius: '8px', overflow: 'hidden', display: 'flex', flexDirection: 'column' 
              }}>
                <div style={{ height: '160px', width: '100%', background: '#0a101f', position: 'relative' }}>
                  <img 
                    src={file.publicUrl} 
                    alt={file.name} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.src = '/assets/images/placeholder.jpg';
                      e.currentTarget.onerror = null;
                    }}
                  />
                  <div style={{ 
                    position: 'absolute', top: '0.5rem', right: '0.5rem', 
                    display: 'flex', gap: '0.5rem' 
                  }}>
                    <button 
                      onClick={() => copyToClipboard(file.publicUrl)}
                      style={{ background: 'rgba(0,0,0,0.6)', border: 'none', color: 'white', padding: '0.4rem', borderRadius: '4px', cursor: 'pointer', backdropFilter: 'blur(4px)' }}
                      title="Copy URL"
                    >
                      <Copy size={14} />
                    </button>
                    <button 
                      onClick={() => handleDelete(file)}
                      style={{ background: 'rgba(239, 68, 68, 0.8)', border: 'none', color: 'white', padding: '0.4rem', borderRadius: '4px', cursor: 'pointer', backdropFilter: 'blur(4px)' }}
                      title="Delete Image"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                <div style={{ padding: '0.75rem', fontSize: '0.85rem' }}>
                  <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontWeight: 500, color: 'white', marginBottom: '0.25rem' }} title={file.name}>
                    {file.name}
                  </div>
                  <div style={{ color: 'var(--admin-text-muted)', display: 'flex', justifyContent: 'space-between' }}>
                    <span>{formatBytes(file.metadata?.size)}</span>
                    <span>{new Date(file.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
