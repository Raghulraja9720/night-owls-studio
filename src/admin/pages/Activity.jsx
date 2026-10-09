import React, { useEffect, useState } from 'react';
import { Activity as ActivityIcon, User, Clock, FileText, CheckCircle, Trash2, Edit } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function Activity() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const { data, error } = await supabase
        .from('activity_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100); // Fetch last 100 activities
        
      if (error) throw error;
      setLogs(data || []);
    } catch (error) {
      console.error('Error fetching activity logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActionIcon = (action) => {
    const actionLower = action.toLowerCase();
    if (actionLower.includes('create') || actionLower.includes('add')) return <CheckCircle size={16} style={{ color: 'var(--admin-success)' }} />;
    if (actionLower.includes('delete') || actionLower.includes('remove')) return <Trash2 size={16} style={{ color: 'var(--admin-danger)' }} />;
    if (actionLower.includes('update') || actionLower.includes('edit')) return <Edit size={16} style={{ color: 'var(--admin-warning)' }} />;
    return <FileText size={16} style={{ color: 'var(--admin-accent)' }} />;
  };

  const getEntityTypeColor = (type) => {
    const typeLower = type.toLowerCase();
    if (typeLower.includes('project')) return '#3b82f6';
    if (typeLower.includes('service')) return '#8b5cf6';
    if (typeLower.includes('team')) return '#ec4899';
    if (typeLower.includes('inquiry')) return '#f59e0b';
    if (typeLower.includes('setting')) return '#10b981';
    return 'var(--admin-text-muted)';
  };

  return (
    <div className="admin-work-page">
      <div className="admin-page-header">
        <h1 className="admin-page-title">System Activity</h1>
      </div>

      <div className="admin-card" style={{ padding: '0' }}>
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--admin-text-muted)' }}>
            Loading activity logs...
          </div>
        ) : logs.length === 0 ? (
          <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--admin-text-muted)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            <ActivityIcon size={48} style={{ opacity: 0.2 }} />
            <div>
              <p style={{ marginBottom: '0.5rem', fontWeight: 500, color: 'white' }}>No Activity Found</p>
              <p style={{ fontSize: '0.9rem' }}>Actions taken by admins will appear here automatically.</p>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {logs.map((log, index) => (
              <div 
                key={log.id} 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '1.5rem', 
                  padding: '1.25rem 1.5rem',
                  borderBottom: index !== logs.length - 1 ? '1px solid var(--admin-border)' : 'none',
                  background: index % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)'
                }}
              >
                {/* User Info */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', width: '200px', flexShrink: 0 }}>
                  <div style={{ 
                    width: '32px', height: '32px', borderRadius: '50%', 
                    background: 'rgba(255,255,255,0.1)', display: 'flex', 
                    alignItems: 'center', justifyContent: 'center', color: 'white' 
                  }}>
                    <User size={16} />
                  </div>
                  <div style={{ overflow: 'hidden' }}>
                    <div style={{ fontSize: '0.85rem', color: 'white', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                      {log.admin_email}
                    </div>
                  </div>
                </div>

                {/* Action Badge */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: '120px', flexShrink: 0 }}>
                  {getActionIcon(log.action)}
                  <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'white', textTransform: 'capitalize' }}>
                    {log.action}
                  </span>
                </div>

                {/* Entity Info */}
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ 
                    padding: '0.2rem 0.5rem', 
                    borderRadius: '4px', 
                    fontSize: '0.7rem', 
                    fontWeight: 600, 
                    border: `1px solid ${getEntityTypeColor(log.entity_type)}`,
                    color: getEntityTypeColor(log.entity_type),
                    textTransform: 'uppercase'
                  }}>
                    {log.entity_type}
                  </span>
                  <span style={{ color: 'var(--admin-text-muted)', fontSize: '0.9rem' }}>
                    {log.entity_name}
                  </span>
                </div>

                {/* Timestamp */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--admin-text-muted)', fontSize: '0.8rem', width: '150px', justifyContent: 'flex-end' }}>
                  <Clock size={14} />
                  {new Date(log.created_at).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
