import React, { useEffect, useState } from 'react';
import { Mail, Search, Trash2, Archive, CheckCircle, MailOpen, User, X, Plus } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function Messages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('ALL');
  const [selectedMessage, setSelectedMessage] = useState(null);
  
  // Compose state
  const [isComposing, setIsComposing] = useState(false);
  const [composeData, setComposeData] = useState({ title: '', body: '' });
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('internal_messages')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) {
        if (error.code === '42P01') {
          console.warn('internal_messages table missing. Please run add_messages_table.sql');
        } else {
          throw error;
        }
      }
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, newStatus, e) => {
    if (e) e.stopPropagation();
    try {
      await supabase.from('internal_messages').update({ status: newStatus }).eq('id', id);
      setMessages(messages.map(m => m.id === id ? { ...m, status: newStatus } : m));
      if (selectedMessage && selectedMessage.id === id) {
        setSelectedMessage({ ...selectedMessage, status: newStatus });
      }
    } catch (error) {
      console.error('Error updating message status:', error);
    }
  };

  const deleteMessage = async (id, e) => {
    if (e) e.stopPropagation();
    if (!window.confirm('Are you sure you want to permanently delete this message?')) return;
    try {
      await supabase.from('internal_messages').delete().eq('id', id);
      setMessages(messages.filter(m => m.id !== id));
      if (selectedMessage && selectedMessage.id === id) setSelectedMessage(null);
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { error } = await supabase.from('internal_messages').insert([{
        sender_email: user?.email || 'Admin',
        title: composeData.title,
        body: composeData.body,
        status: 'UNREAD'
      }]);
      
      if (error) throw error;
      
      setIsComposing(false);
      setComposeData({ title: '', body: '' });
      fetchMessages();
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message.');
    } finally {
      setSending(false);
    }
  };

  const handleOpenMessage = (msg) => {
    setSelectedMessage(msg);
    if (msg.status === 'UNREAD') {
      updateStatus(msg.id, 'READ');
    }
  };

  const filteredMessages = messages.filter(m => {
    const matchesSearch = 
      m.title.toLowerCase().includes(search.toLowerCase()) || 
      m.body.toLowerCase().includes(search.toLowerCase()) ||
      m.sender_email.toLowerCase().includes(search.toLowerCase());
    
    if (filter === 'ALL') return matchesSearch && m.status !== 'ARCHIVED';
    return matchesSearch && m.status === filter;
  });

  return (
    <div className="admin-work-page" style={{ position: 'relative' }}>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Internal Team Messages</h1>
        <button className="admin-btn-primary" onClick={() => setIsComposing(true)}>
          <Plus size={18} /> Compose
        </button>
      </div>

      <div className="admin-card" style={{ padding: 0, overflow: 'hidden', display: 'flex', minHeight: '600px' }}>
        
        {/* Left Sidebar: List */}
        <div style={{ width: '350px', borderRight: '1px solid var(--admin-border)', display: 'flex', flexDirection: 'column', background: 'rgba(255,255,255,0.01)' }}>
          <div style={{ padding: '1rem', borderBottom: '1px solid var(--admin-border)' }}>
            <div className="admin-search-box" style={{ position: 'relative', marginBottom: '1rem' }}>
              <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--admin-text-muted)' }} />
              <input 
                type="text" 
                className="admin-input" 
                placeholder="Search messages..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ paddingLeft: '2.25rem', width: '100%', fontSize: '0.85rem' }}
              />
            </div>
            
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button 
                onClick={() => setFilter('ALL')}
                style={{ flex: 1, padding: '0.4rem', fontSize: '0.75rem', borderRadius: '4px', border: 'none', background: filter === 'ALL' ? 'rgba(255,255,255,0.1)' : 'transparent', color: filter === 'ALL' ? 'white' : 'var(--admin-text-muted)', cursor: 'pointer' }}
              >
                Inbox
              </button>
              <button 
                onClick={() => setFilter('UNREAD')}
                style={{ flex: 1, padding: '0.4rem', fontSize: '0.75rem', borderRadius: '4px', border: 'none', background: filter === 'UNREAD' ? 'rgba(255,255,255,0.1)' : 'transparent', color: filter === 'UNREAD' ? 'white' : 'var(--admin-text-muted)', cursor: 'pointer' }}
              >
                Unread
              </button>
              <button 
                onClick={() => setFilter('ARCHIVED')}
                style={{ flex: 1, padding: '0.4rem', fontSize: '0.75rem', borderRadius: '4px', border: 'none', background: filter === 'ARCHIVED' ? 'rgba(255,255,255,0.1)' : 'transparent', color: filter === 'ARCHIVED' ? 'white' : 'var(--admin-text-muted)', cursor: 'pointer' }}
              >
                Archive
              </button>
            </div>
          </div>

          <div style={{ flex: 1, overflowY: 'auto' }}>
            {loading ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--admin-text-muted)' }}>Loading...</div>
            ) : filteredMessages.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--admin-text-muted)' }}>No messages found.</div>
            ) : (
              filteredMessages.map(msg => (
                <div 
                  key={msg.id}
                  onClick={() => handleOpenMessage(msg)}
                  style={{ 
                    padding: '1rem', 
                    borderBottom: '1px solid rgba(255,255,255,0.03)',
                    cursor: 'pointer',
                    background: selectedMessage?.id === msg.id ? 'rgba(255,255,255,0.05)' : msg.status === 'UNREAD' ? 'rgba(245, 158, 11, 0.05)' : 'transparent',
                    borderLeft: msg.status === 'UNREAD' ? '3px solid var(--admin-warning)' : '3px solid transparent'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: msg.status === 'UNREAD' ? 600 : 500, color: 'white' }}>
                      {msg.sender_email.split('@')[0]}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)' }}>
                      {new Date(msg.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: msg.status === 'UNREAD' ? 'white' : 'var(--admin-text-muted)', fontWeight: msg.status === 'UNREAD' ? 500 : 400, marginBottom: '0.25rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {msg.title}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--admin-text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {msg.body}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Content: Message View */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--admin-bg)' }}>
          {selectedMessage ? (
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              {/* Message Header */}
              <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--admin-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h2 style={{ fontSize: '1.25rem', color: 'white', margin: '0 0 1rem 0' }}>{selectedMessage.title}</h2>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                      <User size={16} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.9rem', color: 'white', fontWeight: 500 }}>{selectedMessage.sender_email}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)' }}>
                        {new Date(selectedMessage.created_at).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {selectedMessage.status !== 'UNREAD' && (
                    <button onClick={(e) => updateStatus(selectedMessage.id, 'UNREAD', e)} className="admin-btn-secondary" style={{ padding: '0.5rem' }} title="Mark Unread">
                      <Mail size={16} />
                    </button>
                  )}
                  {selectedMessage.status !== 'ARCHIVED' && (
                    <button onClick={(e) => updateStatus(selectedMessage.id, 'ARCHIVED', e)} className="admin-btn-secondary" style={{ padding: '0.5rem' }} title="Archive">
                      <Archive size={16} />
                    </button>
                  )}
                  <button onClick={(e) => deleteMessage(selectedMessage.id, e)} className="admin-btn-secondary" style={{ padding: '0.5rem', color: 'var(--admin-danger)', borderColor: 'rgba(239, 68, 68, 0.2)' }} title="Delete">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              
              {/* Message Body */}
              <div style={{ padding: '2rem', flex: 1, overflowY: 'auto', color: 'white', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                {selectedMessage.body}
              </div>
            </div>
          ) : (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--admin-text-muted)' }}>
              <MailOpen size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
              <p>Select a message to read</p>
            </div>
          )}
        </div>
      </div>

      {/* Compose Modal */}
      {isComposing && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(3, 7, 18, 0.8)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000, padding: '2rem'
        }}>
          <div className="admin-card" style={{ width: '100%', maxWidth: '600px', padding: '2rem', position: 'relative' }}>
            <button 
              onClick={() => setIsComposing(false)} 
              style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', color: 'var(--admin-text-muted)', cursor: 'pointer' }}
            >
              <X size={24} />
            </button>
            
            <h2 style={{ fontSize: '1.25rem', color: 'white', marginBottom: '1.5rem' }}>New Team Message</h2>
            
            <form onSubmit={handleSendMessage} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div className="admin-form-group">
                <label>Subject</label>
                <input 
                  type="text" 
                  className="admin-input" 
                  value={composeData.title}
                  onChange={e => setComposeData({...composeData, title: e.target.value})}
                  required
                  placeholder="Message subject..."
                />
              </div>
              
              <div className="admin-form-group">
                <label>Message</label>
                <textarea 
                  className="admin-input" 
                  rows="6"
                  value={composeData.body}
                  onChange={e => setComposeData({...composeData, body: e.target.value})}
                  required
                  placeholder="Type your message here..."
                />
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '0.5rem' }}>
                <button type="button" className="admin-btn-secondary" onClick={() => setIsComposing(false)}>
                  Cancel
                </button>
                <button type="submit" className="admin-btn-primary" disabled={sending}>
                  {sending ? 'Sending...' : 'Send Message'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
