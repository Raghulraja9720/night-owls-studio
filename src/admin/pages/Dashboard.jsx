import React, { useEffect, useState } from 'react';
import { Briefcase, Settings, Users, Mail, Image as ImageIcon, Plus, ArrowRight, Clock, FileText } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Link, useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalProjects: 0,
    publishedProjects: 0,
    draftProjects: 0,
    services: 0,
    team: 0,
    newInquiries: 0,
    mediaFiles: 0
  });
  
  const [recentProjects, setRecentProjects] = useState([]);
  const [recentInquiries, setRecentInquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // 1. Fetch exact counts in parallel for optimal performance
      const [
        totalProjRes, publishedProjRes, draftProjRes,
        servicesRes, teamRes, newInquiriesRes, mediaRes
      ] = await Promise.all([
        supabase.from('projects').select('*', { count: 'exact', head: true }),
        supabase.from('projects').select('*', { count: 'exact', head: true }).eq('status', 'PUBLISHED'),
        supabase.from('projects').select('*', { count: 'exact', head: true }).eq('status', 'DRAFT'),
        supabase.from('services').select('*', { count: 'exact', head: true }),
        supabase.from('team_members').select('*', { count: 'exact', head: true }),
        supabase.from('inquiries').select('*', { count: 'exact', head: true }).eq('status', 'NEW'),
        supabase.storage.from('media').list() // Assuming a relatively small number of media files for a portfolio
      ]);

      setStats({
        totalProjects: totalProjRes.count || 0,
        publishedProjects: publishedProjRes.count || 0,
        draftProjects: draftProjRes.count || 0,
        services: servicesRes.count || 0,
        team: teamRes.count || 0,
        newInquiries: newInquiriesRes.count || 0,
        mediaFiles: mediaRes.data?.filter(f => f.name !== '.emptyFolderPlaceholder').length || 0
      });

      // 2. Fetch recent records
      const { data: latestProjects } = await supabase
        .from('projects')
        .select('id, title, status, created_at')
        .order('created_at', { ascending: false })
        .limit(4);
        
      const { data: latestInquiries } = await supabase
        .from('inquiries')
        .select('id, name, service, status, created_at')
        .order('created_at', { ascending: false })
        .limit(4);

      if (latestProjects) setRecentProjects(latestProjects);
      if (latestInquiries) setRecentInquiries(latestInquiries);

    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PUBLISHED': return { bg: 'rgba(16, 185, 129, 0.1)', color: 'var(--admin-success)' };
      case 'DRAFT': return { bg: 'rgba(245, 158, 11, 0.1)', color: 'var(--admin-warning)' };
      case 'NEW': return { bg: 'rgba(245, 158, 11, 0.1)', color: 'var(--admin-warning)' };
      case 'CONTACTED': return { bg: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' };
      default: return { bg: 'rgba(255, 255, 255, 0.1)', color: 'var(--admin-text-muted)' };
    }
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Dashboard Overview</h1>
        
        {/* Quick Actions Menu */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button onClick={() => navigate('/admin/work/new')} className="admin-btn-primary" style={{ padding: '0.6rem 1rem' }}>
            <Plus size={16} /> <span>New Project</span>
          </button>
          <button onClick={() => navigate('/admin/inquiries')} className="admin-btn-secondary" style={{ padding: '0.6rem 1rem' }}>
            <Mail size={16} /> <span>View Inquiries</span>
          </button>
        </div>
      </div>

      {/* Primary Statistics Grid */}
      <div className="admin-grid-cards">
        <div className="admin-stat-card" onClick={() => navigate('/admin/work')} style={{ cursor: 'pointer' }}>
          <div className="admin-stat-info">
            <h3>Total Projects</h3>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.75rem', flexWrap: 'wrap' }}>
              <p style={{ fontSize: '2rem', margin: 0, lineHeight: 1 }}>{loading ? '-' : stats.totalProjects}</p>
              <span style={{ fontSize: '0.85rem', color: 'var(--admin-success)', marginBottom: '4px' }}>{stats.publishedProjects} Published</span>
            </div>
          </div>
          <div className="admin-stat-icon"><Briefcase size={24} /></div>
        </div>
        
        <div className="admin-stat-card" onClick={() => navigate('/admin/inquiries')} style={{ cursor: 'pointer', border: stats.newInquiries > 0 ? '1px solid rgba(245, 158, 11, 0.5)' : undefined }}>
          <div className="admin-stat-info">
            <h3 style={{ color: stats.newInquiries > 0 ? 'var(--admin-warning)' : undefined }}>New Inquiries</h3>
            <p style={{ fontSize: '2rem', margin: 0, lineHeight: 1, color: stats.newInquiries > 0 ? 'var(--admin-warning)' : undefined }}>{loading ? '-' : stats.newInquiries}</p>
          </div>
          <div className="admin-stat-icon" style={{ background: stats.newInquiries > 0 ? 'rgba(245, 158, 11, 0.1)' : undefined, color: stats.newInquiries > 0 ? 'var(--admin-warning)' : undefined }}>
            <Mail size={24} />
          </div>
        </div>

        <div className="admin-stat-card" onClick={() => navigate('/admin/services')} style={{ cursor: 'pointer' }}>
          <div className="admin-stat-info">
            <h3>Services Offered</h3>
            <p style={{ fontSize: '2rem', margin: 0, lineHeight: 1 }}>{loading ? '-' : stats.services}</p>
          </div>
          <div className="admin-stat-icon"><Settings size={24} /></div>
        </div>

        <div className="admin-stat-card" onClick={() => navigate('/admin/team')} style={{ cursor: 'pointer' }}>
          <div className="admin-stat-info">
            <h3>Team Members</h3>
            <p style={{ fontSize: '2rem', margin: 0, lineHeight: 1 }}>{loading ? '-' : stats.team}</p>
          </div>
          <div className="admin-stat-icon"><Users size={24} /></div>
        </div>
        
        <div className="admin-stat-card" onClick={() => navigate('/admin/media')} style={{ cursor: 'pointer' }}>
          <div className="admin-stat-info">
            <h3>Media Assets</h3>
            <p style={{ fontSize: '2rem', margin: 0, lineHeight: 1 }}>{loading ? '-' : stats.mediaFiles}</p>
          </div>
          <div className="admin-stat-icon"><ImageIcon size={24} /></div>
        </div>
      </div>

      {/* Secondary Grid: Recent Activity */}
      <div className="admin-dashboard-panels">
        
        {/* Recent Inquiries Panel */}
        <div className="admin-card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', gap: '0.5rem', flexWrap: 'wrap' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0, fontSize: '1.05rem', fontWeight: 600 }}>
              <Clock size={18} color="var(--admin-accent)" /> Recent Inquiries
            </h3>
            <Link to="/admin/inquiries" style={{ color: 'var(--admin-accent)', fontSize: '0.85rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              View All <ArrowRight size={14} />
            </Link>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1, minWidth: 0 }}>
            {loading ? (
              <div style={{ color: 'var(--admin-text-muted)', textAlign: 'center', padding: '2rem' }}>Loading...</div>
            ) : recentInquiries.length === 0 ? (
              <div style={{ color: 'var(--admin-text-muted)', textAlign: 'center', padding: '2rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
                No recent inquiries.
              </div>
            ) : (
              recentInquiries.map(inquiry => (
                <div key={inquiry.id} onClick={() => navigate('/admin/inquiries')} style={{ 
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
                  padding: '0.875rem 1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', cursor: 'pointer',
                  borderLeft: inquiry.status === 'NEW' ? '3px solid var(--admin-warning)' : '3px solid transparent',
                  transition: 'background 0.2s', gap: '0.75rem', minWidth: 0
                }}>
                  <div style={{ minWidth: 0, flex: 1, overflow: 'hidden' }}>
                    <div style={{ color: 'white', fontWeight: 500, marginBottom: '0.2rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{inquiry.name}</div>
                    <div style={{ color: 'var(--admin-text-muted)', fontSize: '0.8rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{inquiry.service}</div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <span style={{ 
                      padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 600,
                      background: getStatusColor(inquiry.status).bg, color: getStatusColor(inquiry.status).color,
                      display: 'inline-block', marginBottom: '0.25rem'
                    }}>
                      {inquiry.status}
                    </span>
                    <div style={{ color: 'var(--admin-text-muted)', fontSize: '0.75rem' }}>
                      {new Date(inquiry.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Projects Panel */}
        <div className="admin-card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', gap: '0.5rem', flexWrap: 'wrap' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0, fontSize: '1.05rem', fontWeight: 600 }}>
              <FileText size={18} color="var(--admin-accent)" /> Recently Added Projects
            </h3>
            <Link to="/admin/work" style={{ color: 'var(--admin-accent)', fontSize: '0.85rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              View All <ArrowRight size={14} />
            </Link>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1, minWidth: 0 }}>
            {loading ? (
              <div style={{ color: 'var(--admin-text-muted)', textAlign: 'center', padding: '2rem' }}>Loading...</div>
            ) : recentProjects.length === 0 ? (
              <div style={{ color: 'var(--admin-text-muted)', textAlign: 'center', padding: '2rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
                No recent projects.
              </div>
            ) : (
              recentProjects.map(project => (
                <div key={project.id} onClick={() => navigate(`/admin/work/${project.id}`)} style={{ 
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
                  padding: '0.875rem 1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', cursor: 'pointer',
                  transition: 'background 0.2s', gap: '0.75rem', minWidth: 0
                }}>
                  <div style={{ minWidth: 0, flex: 1, overflow: 'hidden' }}>
                    <div style={{ color: 'white', fontWeight: 500, marginBottom: '0.2rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{project.title}</div>
                    <div style={{ color: 'var(--admin-text-muted)', fontSize: '0.8rem' }}>
                      Added {new Date(project.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <span style={{ 
                    padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 600,
                    background: getStatusColor(project.status).bg, color: getStatusColor(project.status).color,
                    flexShrink: 0
                  }}>
                    {project.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
