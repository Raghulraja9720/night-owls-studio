import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import AdminLayout from './layouts/AdminLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Work from './pages/Work';
import ProjectEditor from './pages/ProjectEditor';
import Services from './pages/Services';
import ServiceEditor from './pages/ServiceEditor';
import Team from './pages/Team';
import TeamMemberEditor from './pages/TeamMemberEditor';
import Inquiries from './pages/Inquiries';
import Media from './pages/Media';
import Activity from './pages/Activity';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import Messages from './pages/Messages';
import MetaAds from './pages/MetaAds';
import MetaAdEditor from './pages/MetaAdEditor';
import './admin.css';

export default function AdminApp() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return <div className="admin-loading-screen">Loading...</div>;
  }

  if (!session && location.pathname !== '/admin/login') {
    return <Navigate to="/admin/login" replace />;
  }

  if (session && location.pathname === '/admin/login') {
    return <Navigate to="/admin" replace />;
  }

  return (
    <Routes>
      <Route path="login" element={<Login />} />
      <Route path="/" element={<AdminLayout session={session} />}>
        <Route index element={<Dashboard />} />
        <Route path="work" element={<Work />} />
        <Route path="work/new" element={<ProjectEditor />} />
        <Route path="work/:id" element={<ProjectEditor />} />
        <Route path="meta-ads" element={<MetaAds />} />
        <Route path="meta-ads/new" element={<MetaAdEditor />} />
        <Route path="meta-ads/:id" element={<MetaAdEditor />} />
        <Route path="services" element={<Services />} />
        <Route path="services/new" element={<ServiceEditor />} />
        <Route path="services/:id" element={<ServiceEditor />} />
        <Route path="team" element={<Team />} />
        <Route path="team/new" element={<TeamMemberEditor />} />
        <Route path="team/:id" element={<TeamMemberEditor />} />
        <Route path="inquiries" element={<Inquiries />} />
        <Route path="media" element={<Media />} />
        <Route path="messages" element={<Messages />} />
        <Route path="activity" element={<Activity />} />
        <Route path="settings" element={<Settings />} />
        <Route path="profile" element={<Profile />} />
      </Route>
    </Routes>
  );
}
