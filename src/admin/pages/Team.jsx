import React, { useEffect, useState } from 'react';
import { Search, Edit2, Trash2, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

export default function Team() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .order('display_order', { ascending: true });
        
      if (error) throw error;
      setMembers(data || []);
    } catch (error) {
      console.error('Error fetching team members:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteMember = async (id) => {
    if(!window.confirm('Are you sure you want to delete this team member?')) return;
    try {
      await supabase.from('team_members').delete().eq('id', id);
      fetchMembers();
    } catch (error) {
      console.error('Error deleting member:', error);
    }
  };

  const filteredMembers = members.filter(m => 
    m.name?.toLowerCase().includes(search.toLowerCase()) || 
    m.role?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="admin-team-page" style={{ width: '100%', minWidth: 0 }}>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Team Members</h1>
        <Link to="/admin/team/new" className="admin-btn-primary">
          <Plus size={18} />
          <span>Add Member</span>
        </Link>
      </div>

      <div className="admin-card">
        <div className="admin-table-toolbar">
          <div className="admin-search-box" style={{ position: 'relative', flex: 1, minWidth: 'min(100%, 260px)' }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--admin-text-muted)' }} />
            <input 
              type="text" 
              className="admin-input" 
              placeholder="Search by name or role..." 
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
                <th style={{ padding: '0.875rem 1rem', color: 'var(--admin-text-muted)', fontWeight: 500 }}>Name</th>
                <th style={{ padding: '0.875rem 1rem', color: 'var(--admin-text-muted)', fontWeight: 500 }}>Role</th>
                <th style={{ padding: '0.875rem 1rem', color: 'var(--admin-text-muted)', fontWeight: 500 }}>Status</th>
                <th style={{ padding: '0.875rem 1rem', color: 'var(--admin-text-muted)', fontWeight: 500 }}>Order</th>
                <th style={{ padding: '0.875rem 1rem', color: 'var(--admin-text-muted)', fontWeight: 500, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: 'var(--admin-text-muted)' }}>Loading team...</td>
                </tr>
              ) : filteredMembers.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: 'var(--admin-text-muted)' }}>No team members found.</td>
                </tr>
              ) : (
                filteredMembers.map(member => (
                  <tr key={member.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '0.875rem 1rem', fontWeight: 500 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'var(--admin-border)', overflow: 'hidden', flexShrink: 0 }}>
                           {member.image ? <img src={member.image} alt={member.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : null}
                        </div>
                        <span>{member.name}</span>
                      </div>
                    </td>
                    <td style={{ padding: '0.875rem 1rem', color: 'var(--admin-text-muted)' }}>{member.role}</td>
                    <td style={{ padding: '0.875rem 1rem' }}>
                      <span style={{ 
                        padding: '0.25rem 0.65rem', 
                        borderRadius: '999px', 
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        background: member.status === 'PUBLISHED' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255, 255, 255, 0.1)',
                        color: member.status === 'PUBLISHED' ? 'var(--admin-success)' : 'var(--admin-text-muted)',
                        whiteSpace: 'nowrap'
                      }}>
                        {member.status}
                      </span>
                    </td>
                    <td style={{ padding: '0.875rem 1rem', color: 'var(--admin-text-muted)' }}>{member.display_order}</td>
                    <td style={{ padding: '0.875rem 1rem', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                        <Link to={`/admin/team/${member.id}`} className="admin-btn-secondary" style={{ padding: '0.45rem', minHeight: '36px' }} title="Edit" aria-label={`Edit ${member.name}`}>
                          <Edit2 size={16} />
                        </Link>
                        <button onClick={() => deleteMember(member.id)} className="admin-btn-secondary" style={{ padding: '0.45rem', minHeight: '36px', borderColor: 'rgba(239, 68, 68, 0.2)', color: 'var(--admin-danger)' }} title="Delete" aria-label={`Delete ${member.name}`}>
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
