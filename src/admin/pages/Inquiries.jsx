import React, { useEffect, useState } from 'react';
import { Search, Mail, Trash2, CheckCircle, X, Clock, PlayCircle, Archive } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function Inquiries() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [notes, setNotes] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    try {
      const { data, error } = await supabase
        .from('inquiries')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      setInquiries(data || []);
    } catch (error) {
      console.error('Error fetching inquiries:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      await supabase.from('inquiries').update({ status: newStatus }).eq('id', id);
      fetchInquiries();
      if (selectedInquiry && selectedInquiry.id === id) {
        setSelectedInquiry({ ...selectedInquiry, status: newStatus });
      }
    } catch (error) {
      console.error('Error updating inquiry status:', error);
      alert('Failed to update status.');
    }
  };

  const saveNotes = async () => {
    if (!selectedInquiry) return;
    setSavingNotes(true);
    try {
      await supabase.from('inquiries').update({ internal_notes: notes }).eq('id', selectedInquiry.id);
      setSelectedInquiry({ ...selectedInquiry, internal_notes: notes });
      fetchInquiries();
    } catch (error) {
      console.error('Error saving notes:', error);
      alert('Failed to save notes.');
    } finally {
      setSavingNotes(false);
    }
  };

  const deleteInquiry = async (id) => {
    if(!window.confirm('Are you sure you want to permanently delete this inquiry?')) return;
    try {
      await supabase.from('inquiries').delete().eq('id', id);
      fetchInquiries();
      if (selectedInquiry && selectedInquiry.id === id) {
        setSelectedInquiry(null);
      }
    } catch (error) {
      console.error('Error deleting inquiry:', error);
      alert('Failed to delete inquiry.');
    }
  };

  const filteredInquiries = inquiries.filter(i => {
    const matchesSearch = i.name?.toLowerCase().includes(search.toLowerCase()) || 
                          i.email?.toLowerCase().includes(search.toLowerCase()) ||
                          i.company?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || i.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'NEW': return { bg: 'rgba(245, 158, 11, 0.1)', color: 'var(--admin-warning)' };
      case 'CONTACTED': return { bg: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' };
      case 'IN_PROGRESS': return { bg: 'rgba(16, 185, 129, 0.1)', color: 'var(--admin-success)' };
      case 'CONVERTED': return { bg: 'rgba(217, 70, 239, 0.1)', color: '#d946ef' };
      case 'CLOSED': return { bg: 'rgba(255, 255, 255, 0.1)', color: 'var(--admin-text-muted)' };
      default: return { bg: 'rgba(255, 255, 255, 0.1)', color: 'var(--admin-text-muted)' };
    }
  };

  return (
    <div className="admin-work-page" style={{ position: 'relative' }}>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Client Inquiries</h1>
        <div style={{ color: 'var(--admin-text-muted)' }}>
          {inquiries.filter(i => i.status === 'NEW').length} New Inquiries
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-table-toolbar" style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div className="admin-search-box" style={{ position: 'relative', flex: 1, minWidth: '250px' }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--admin-text-muted)' }} />
            <input 
              type="text" 
              className="admin-input" 
              placeholder="Search by name, email, or company..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: '2.5rem', width: '100%' }}
            />
          </div>
          <select 
            className="admin-input" 
            value={statusFilter} 
            onChange={e => setStatusFilter(e.target.value)}
            style={{ width: 'auto', minWidth: '150px' }}
          >
            <option value="ALL">All Statuses</option>
            <option value="NEW">New</option>
            <option value="CONTACTED">Contacted</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="CONVERTED">Converted</option>
            <option value="CLOSED">Closed</option>
          </select>
        </div>

        <div className="admin-table-container" style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--admin-border)' }}>
                <th style={{ padding: '1rem', color: 'var(--admin-text-muted)', fontWeight: 500 }}>Date</th>
                <th style={{ padding: '1rem', color: 'var(--admin-text-muted)', fontWeight: 500 }}>Client</th>
                <th style={{ padding: '1rem', color: 'var(--admin-text-muted)', fontWeight: 500 }}>Service</th>
                <th style={{ padding: '1rem', color: 'var(--admin-text-muted)', fontWeight: 500 }}>Status</th>
                <th style={{ padding: '1rem', color: 'var(--admin-text-muted)', fontWeight: 500, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: 'var(--admin-text-muted)' }}>Loading inquiries...</td>
                </tr>
              ) : filteredInquiries.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: 'var(--admin-text-muted)' }}>No inquiries found.</td>
                </tr>
              ) : (
                filteredInquiries.map(inquiry => (
                  <tr 
                    key={inquiry.id} 
                    style={{ 
                      borderBottom: '1px solid rgba(255,255,255,0.05)',
                      background: selectedInquiry?.id === inquiry.id ? 'rgba(255,255,255,0.02)' : 'transparent',
                      cursor: 'pointer',
                      transition: 'background 0.2s'
                    }}
                    onClick={() => { setSelectedInquiry(inquiry); setNotes(inquiry.internal_notes || ''); }}
                  >
                    <td style={{ padding: '1rem', color: 'var(--admin-text-muted)' }}>
                      {new Date(inquiry.created_at).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {inquiry.status === 'NEW' && <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--admin-warning)', display: 'inline-block' }}></span>}
                        {inquiry.name}
                      </div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--admin-text-muted)' }}>{inquiry.company || 'Individual'}</div>
                    </td>
                    <td style={{ padding: '1rem', color: 'var(--admin-text-muted)' }}>{inquiry.service}</td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{ 
                        padding: '0.35rem 0.75rem', 
                        borderRadius: '999px', 
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        background: getStatusColor(inquiry.status).bg,
                        color: getStatusColor(inquiry.status).color
                      }}>
                        {inquiry.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'right' }} onClick={e => e.stopPropagation()}>
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                        <a href={`mailto:${inquiry.email}`} className="admin-btn-secondary" style={{ padding: '0.5rem' }} title="Reply via Email">
                          <Mail size={16} />
                        </a>
                        <button onClick={() => deleteInquiry(inquiry.id)} className="admin-btn-secondary" style={{ padding: '0.5rem', borderColor: 'rgba(239, 68, 68, 0.2)', color: 'var(--admin-danger)' }} title="Delete">
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

      {/* Detail Modal Overlay */}
      {selectedInquiry && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(3, 7, 18, 0.8)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000, padding: '2rem'
        }} onClick={() => setSelectedInquiry(null)}>
          <div className="admin-card" style={{
            width: '100%', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto',
            background: 'var(--admin-bg)', border: '1px solid var(--admin-border)',
            padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem',
            position: 'relative'
          }} onClick={e => e.stopPropagation()}>
            
            <button 
              onClick={() => setSelectedInquiry(null)} 
              style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', color: 'var(--admin-text-muted)', cursor: 'pointer' }}
            >
              <X size={24} />
            </button>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                <h2 style={{ color: 'white', margin: 0, fontSize: '1.5rem' }}>{selectedInquiry.name}</h2>
                <span style={{ 
                  padding: '0.35rem 0.75rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 600,
                  background: getStatusColor(selectedInquiry.status).bg, color: getStatusColor(selectedInquiry.status).color
                }}>
                  {selectedInquiry.status.replace('_', ' ')}
                </span>
              </div>
              <p style={{ color: 'var(--admin-text-muted)', margin: 0 }}>
                Submitted on {new Date(selectedInquiry.created_at).toLocaleString()}
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '8px' }}>
              <div>
                <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--admin-text-muted)', marginBottom: '0.25rem' }}>Email Address</span>
                <a href={`mailto:${selectedInquiry.email}`} style={{ color: 'white', textDecoration: 'none' }}>{selectedInquiry.email}</a>
              </div>
              <div>
                <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--admin-text-muted)', marginBottom: '0.25rem' }}>Phone / WhatsApp</span>
                <span style={{ color: 'white' }}>{selectedInquiry.phone || 'Not provided'}</span>
              </div>
              <div>
                <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--admin-text-muted)', marginBottom: '0.25rem' }}>Company / Website</span>
                <span style={{ color: 'white' }}>{selectedInquiry.company || 'Not provided'}</span>
              </div>
              <div>
                <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--admin-text-muted)', marginBottom: '0.25rem' }}>Service Required</span>
                <span style={{ color: 'white' }}>{selectedInquiry.service}</span>
              </div>
            </div>

            <div>
              <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--admin-text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Project Overview</span>
              <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: '8px', color: 'white', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                {selectedInquiry.message || 'No additional details provided.'}
              </div>
            </div>

            <div>
              <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--admin-text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Internal Admin Notes</span>
              <textarea 
                className="admin-input" 
                rows="3" 
                value={notes} 
                onChange={e => setNotes(e.target.value)}
                placeholder="Add private notes about this inquiry..."
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                <button className="admin-btn-secondary" onClick={saveNotes} disabled={savingNotes}>
                  {savingNotes ? 'Saving...' : 'Save Notes'}
                </button>
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--admin-border)', paddingTop: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              {selectedInquiry.status === 'NEW' && (
                <button className="admin-btn-secondary" onClick={() => updateStatus(selectedInquiry.id, 'CONTACTED')} style={{ color: '#3b82f6', borderColor: 'rgba(59, 130, 246, 0.2)' }}>
                  <Mail size={16} /> Mark as Contacted
                </button>
              )}
              {['NEW', 'CONTACTED'].includes(selectedInquiry.status) && (
                <button className="admin-btn-secondary" onClick={() => updateStatus(selectedInquiry.id, 'IN_PROGRESS')} style={{ color: 'var(--admin-success)', borderColor: 'rgba(16, 185, 129, 0.2)' }}>
                  <PlayCircle size={16} /> Mark In Progress
                </button>
              )}
              {selectedInquiry.status === 'IN_PROGRESS' && (
                <button className="admin-btn-secondary" onClick={() => updateStatus(selectedInquiry.id, 'CONVERTED')} style={{ color: '#d946ef', borderColor: 'rgba(217, 70, 239, 0.2)' }}>
                  <CheckCircle size={16} /> Mark Converted (Won)
                </button>
              )}
              {selectedInquiry.status !== 'CLOSED' && (
                <button className="admin-btn-secondary" onClick={() => updateStatus(selectedInquiry.id, 'CLOSED')}>
                  <Archive size={16} /> Close Inquiry
                </button>
              )}
              <button className="admin-btn-secondary" onClick={() => deleteInquiry(selectedInquiry.id)} style={{ color: 'var(--admin-danger)', borderColor: 'rgba(239, 68, 68, 0.2)', marginLeft: 'auto' }}>
                <Trash2 size={16} /> Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
