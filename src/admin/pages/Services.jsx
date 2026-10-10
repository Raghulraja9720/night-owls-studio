import React, { useEffect, useState } from 'react';
import { Search, Edit2, Trash2, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

export default function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('display_order', { ascending: true });
        
      if (error) throw error;
      setServices(data || []);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteService = async (id) => {
    if(!window.confirm('Are you sure you want to delete this service?')) return;
    try {
      await supabase.from('services').delete().eq('id', id);
      fetchServices();
    } catch (error) {
      console.error('Error deleting service:', error);
    }
  };

  const filteredServices = services.filter(s => 
    s.title?.toLowerCase().includes(search.toLowerCase()) || 
    s.short_description?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="admin-services-page" style={{ width: '100%', minWidth: 0 }}>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Services</h1>
        <Link to="/admin/services/new" className="admin-btn-primary">
          <Plus size={18} />
          <span>Add Service</span>
        </Link>
      </div>

      <div className="admin-card">
        <div className="admin-table-toolbar">
          <div className="admin-search-box" style={{ position: 'relative', flex: 1, minWidth: 'min(100%, 260px)' }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--admin-text-muted)' }} />
            <input 
              type="text" 
              className="admin-input" 
              placeholder="Search by title..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: '2.5rem', width: '100%' }}
            />
          </div>
        </div>

        <div className="admin-table-container">
          <table style={{ width: '100%', minWidth: '580px', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--admin-border)' }}>
                <th style={{ padding: '0.875rem 1rem', color: 'var(--admin-text-muted)', fontWeight: 500 }}>Title</th>
                <th style={{ padding: '0.875rem 1rem', color: 'var(--admin-text-muted)', fontWeight: 500 }}>Short Description</th>
                <th style={{ padding: '0.875rem 1rem', color: 'var(--admin-text-muted)', fontWeight: 500 }}>Status</th>
                <th style={{ padding: '0.875rem 1rem', color: 'var(--admin-text-muted)', fontWeight: 500 }}>Order</th>
                <th style={{ padding: '0.875rem 1rem', color: 'var(--admin-text-muted)', fontWeight: 500, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: 'var(--admin-text-muted)' }}>Loading services...</td>
                </tr>
              ) : filteredServices.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: 'var(--admin-text-muted)' }}>No services found.</td>
                </tr>
              ) : (
                filteredServices.map(service => (
                  <tr key={service.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '0.875rem 1rem', fontWeight: 500 }}>{service.title}</td>
                    <td style={{ padding: '0.875rem 1rem', color: 'var(--admin-text-muted)' }}>
                      {service.short_description?.substring(0, 50)}{service.short_description?.length > 50 ? '...' : ''}
                    </td>
                    <td style={{ padding: '0.875rem 1rem' }}>
                      <span style={{ 
                        padding: '0.25rem 0.65rem', 
                        borderRadius: '999px', 
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        background: service.status === 'PUBLISHED' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255, 255, 255, 0.1)',
                        color: service.status === 'PUBLISHED' ? 'var(--admin-success)' : 'var(--admin-text-muted)',
                        whiteSpace: 'nowrap'
                      }}>
                        {service.status}
                      </span>
                    </td>
                    <td style={{ padding: '0.875rem 1rem', color: 'var(--admin-text-muted)' }}>{service.display_order}</td>
                    <td style={{ padding: '0.875rem 1rem', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                        <Link to={`/admin/services/${service.id}`} className="admin-btn-secondary" style={{ padding: '0.45rem', minHeight: '36px' }} title="Edit" aria-label={`Edit ${service.title}`}>
                          <Edit2 size={16} />
                        </Link>
                        <button onClick={() => deleteService(service.id)} className="admin-btn-secondary" style={{ padding: '0.45rem', minHeight: '36px', borderColor: 'rgba(239, 68, 68, 0.2)', color: 'var(--admin-danger)' }} title="Delete" aria-label={`Delete ${service.title}`}>
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
