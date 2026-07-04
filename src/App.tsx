import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import Login from './pages/Login';
import KirimProposal from './pages/KirimProposal';
import Dashboard from './pages/Dashboard';
import Pengumuman from './pages/Pengumuman';
import NotFound from './pages/NotFound';
import FloatingChat from './components/FloatingChat';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const App: React.FC = () => {
  useEffect(() => {
    document.title = "Hibah Pendanaan PBL 2026| Huawei ICT Academy";
  }, []);

  return (
    <Router>
      <ScrollToTop />
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/kirim-proposal" element={<KirimProposal />} />
          <Route path="/pengumuman" element={<Pengumuman />} />
          <Route path="/admin/login" element={<Login />} />
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <FloatingChat />
      </div>
    </Router>
  );
};

export default App;
