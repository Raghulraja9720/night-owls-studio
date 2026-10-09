import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PublicApp from './PublicApp';
import AdminApp from './admin/AdminApp';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin/*" element={<AdminApp />} />
        <Route path="*" element={<PublicApp />} />
      </Routes>
    </BrowserRouter>
  );
}
