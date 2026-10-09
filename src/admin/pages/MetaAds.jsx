import React, { useEffect, useState } from 'react';
import { Plus, Search, Edit2, Trash2, Video } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

export default function MetaAds() {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchAds();
  }, []);

  const fetchAds = async () => {
    try {
      const { data, error } = await supabase
        .from('meta_ads_videos')
        .select('*')
        .order('display_order', { ascending: true });
        
      if (error) {
        if (error.code === '42P01') {
          console.warn('meta_ads_videos table does not exist yet.');
          setAds([]);
          return;
        }
        throw error;
      }
      setAds(data || []);
    } catch (error) {
      console.error('Error fetching meta ads:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteAd = async (id, videoPath, posterPath) => {
    if(!window.confirm('Are you sure you want to delete this Meta Ad?')) return;
    try {
      // Remove from database
      await supabase.from('meta_ads_videos').delete().eq('id', id);
      
      // Remove from storage if possible
      const pathsToRemove = [];
      if (videoPath) pathsToRemove.push(videoPath);
      if (posterPath) pathsToRemove.push(posterPath);
      
      if (pathsToRemove.length > 0) {
        await supabase.storage.from('media').remove(pathsToRemove);
      }
      
      fetchAds();
    } catch (error) {
      console.error('Error deleting meta ad:', error);
    }
  };

  const filteredAds = ads.filter(a => 
    a.title?.toLowerCase().includes(search.toLowerCase()) ||
    a.business_name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="admin-work-page">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Meta Ads</h1>
        <Link to="/admin/meta-ads/new" className="admin-btn-primary">
          <Plus size={18} />
          <span>Add Meta Ad</span>
        </Link>
      </div>

      <div className="admin-card">
        <div className="admin-table-toolbar" style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem' }}>
          <div className="admin-search-box" style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--admin-text-muted)' }} />
            <input 
              type="text" 
              className="admin-input" 
              placeholder="Search by title or business..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: '2.5rem', width: '100%' }}
            />
          </div>
        </div>

        <div className="admin-table-container" style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--admin-border)' }}>
                <th style={{ padding: '1rem', color: 'var(--admin-text-muted)', fontWeight: 500 }}>Title</th>
                <th style={{ padding: '1rem', color: 'var(--admin-text-muted)', fontWeight: 500 }}>Business</th>
                <th style={{ padding: '1rem', color: 'var(--admin-text-muted)', fontWeight: 500 }}>Status</th>
                <th style={{ padding: '1rem', color: 'var(--admin-text-muted)', fontWeight: 500 }}>Order</th>
                <th style={{ padding: '1rem', color: 'var(--admin-text-muted)', fontWeight: 500, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: 'var(--admin-text-muted)' }}>Loading meta ads...</td>
                </tr>
              ) : filteredAds.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: 'var(--admin-text-muted)' }}>No meta ads found.</td>
                </tr>
              ) : (
                filteredAds.map(ad => (
                  <tr key={ad.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '1rem', fontWeight: 500 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ width: 40, height: 40, borderRadius: '8px', background: 'var(--admin-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                          {ad.poster_path ? (
                            <img 
                              src={supabase.storage.from('media').getPublicUrl(ad.poster_path).data.publicUrl} 
                              alt="Poster" 
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                            />
                          ) : (
                            <Video size={20} color="var(--admin-text-muted)" />
                          )}
                        </div>
                        <div>
                          <div>{ad.title}</div>
                          {ad.platform && <div style={{ fontSize: '0.8rem', color: 'var(--admin-text-muted)' }}>{ad.platform}</div>}
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '1rem', color: 'var(--admin-text-muted)' }}>{ad.business_name || '-'}</td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{ 
                        padding: '0.25rem 0.75rem', 
                        borderRadius: '999px', 
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        background: ad.status === 'PUBLISHED' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255, 255, 255, 0.1)',
                        color: ad.status === 'PUBLISHED' ? 'var(--admin-success)' : 'var(--admin-text-muted)'
                      }}>
                        {ad.status}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', color: 'var(--admin-text-muted)' }}>{ad.display_order}</td>
                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                        <Link to={`/admin/meta-ads/${ad.id}`} className="admin-btn-secondary" style={{ padding: '0.5rem' }}>
                          <Edit2 size={16} />
                        </Link>
                        <button onClick={() => deleteAd(ad.id, ad.video_path, ad.poster_path)} className="admin-btn-secondary" style={{ padding: '0.5rem', borderColor: 'rgba(239, 68, 68, 0.2)', color: 'var(--admin-danger)' }}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
