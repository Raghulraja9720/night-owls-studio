import React, { useEffect, useState } from 'react';
import { Plus, Search, Edit2, Trash2, MoreVertical, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

export default function Work() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('display_order', { ascending: true });
        
      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteProject = async (id) => {
    if(!window.confirm('Are you sure you want to delete this project?')) return;
    try {
      await supabase.from('projects').delete().eq('id', id);
      fetchProjects();
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  const filteredProjects = projects.filter(p => p.title?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="admin-work-page" style={{ width: '100%', minWidth: 0 }}>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Our Work</h1>
        <Link to="/admin/work/new" className="admin-btn-primary">
          <Plus size={18} />
          <span>Add Project</span>
        </Link>
      </div>

      <div className="admin-card">
        <div className="admin-table-toolbar">
          <div className="admin-search-box" style={{ position: 'relative', flex: 1, minWidth: 'min(100%, 260px)' }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--admin-text-muted)' }} />
            <input 
              type="text" 
              className="admin-input" 
              placeholder="Search projects..." 
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
                <th style={{ padding: '0.875rem 1rem', color: 'var(--admin-text-muted)', fontWeight: 500 }}>Project</th>
                <th style={{ padding: '0.875rem 1rem', color: 'var(--admin-text-muted)', fontWeight: 500 }}>Category</th>
                <th style={{ padding: '0.875rem 1rem', color: 'var(--admin-text-muted)', fontWeight: 500 }}>Status</th>
                <th style={{ padding: '0.875rem 1rem', color: 'var(--admin-text-muted)', fontWeight: 500 }}>Featured</th>
                <th style={{ padding: '0.875rem 1rem', color: 'var(--admin-text-muted)', fontWeight: 500, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: 'var(--admin-text-muted)' }}>Loading projects...</td>
                </tr>
              ) : filteredProjects.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: 'var(--admin-text-muted)' }}>No projects found.</td>
                </tr>
              ) : (
                filteredProjects.map(project => (
                  <tr key={project.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '0.875rem 1rem', fontWeight: 500 }}>{project.title}</td>
                    <td style={{ padding: '0.875rem 1rem', color: 'var(--admin-text-muted)' }}>{project.category}</td>
                    <td style={{ padding: '0.875rem 1rem' }}>
                      <span style={{ 
                        padding: '0.25rem 0.65rem', 
                        borderRadius: '999px', 
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        background: project.status === 'PUBLISHED' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255, 255, 255, 0.1)',
                        color: project.status === 'PUBLISHED' ? 'var(--admin-success)' : 'var(--admin-text-muted)',
                        whiteSpace: 'nowrap'
                      }}>
                        {project.status}
                      </span>
                    </td>
                    <td style={{ padding: '0.875rem 1rem', whiteSpace: 'nowrap' }}>
                      {project.featured ? <span style={{ color: 'var(--admin-warning)', fontWeight: 600 }}>★ Yes</span> : <span style={{ color: 'var(--admin-text-muted)' }}>No</span>}
                    </td>
                    <td style={{ padding: '0.875rem 1rem', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                        <a 
                          href={`/work/${project.slug || project.id}?preview=true`} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="admin-btn-secondary" 
                          style={{ padding: '0.45rem', minHeight: '36px' }} 
                          title="View Case Study" 
                          aria-label={`View ${project.title} case study`}
                        >
                          <ExternalLink size={16} />
                        </a>
                        <Link to={`/admin/work/${project.id}`} className="admin-btn-secondary" style={{ padding: '0.45rem', minHeight: '36px' }} title="Edit" aria-label={`Edit ${project.title}`}>
                          <Edit2 size={16} />
                        </Link>
                        <button onClick={() => deleteProject(project.id)} className="admin-btn-secondary" style={{ padding: '0.45rem', minHeight: '36px', borderColor: 'rgba(239, 68, 68, 0.2)', color: 'var(--admin-danger)' }} title="Delete" aria-label={`Delete ${project.title}`}>
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
