import React from 'react';
import { Menu, TrendingUp } from 'lucide-react';
import './AdminHeader.css';

const AdminHeader = ({ sidebarOpen, setSidebarOpen, todaySubmissions }) => {
  return (
    <header className="header">
      <div className="header-left">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="header-menu-btn"
          aria-label="Ouvrir le menu"
        >
          <Menu size={24} />
        </button>
        <div>
          <h1 className="header-title">Dashboard</h1>
          <p className="header-subtitle">Vue d'ensemble des demandes KYC</p>
        </div>
      </div>
      
      <div className="header-right">
        <div className="header-badge">
          <TrendingUp size={16} />
          +{todaySubmissions} aujourd'hui
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;