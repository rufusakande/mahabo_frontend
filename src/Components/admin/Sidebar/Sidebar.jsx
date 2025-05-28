import React from 'react';
import { Users, X, Home, List, LogOut, Settings } from 'lucide-react';
import './Sidebar.css';
import { Link } from 'react-router-dom';

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  return (
    <>
      {/* Sidebar Overlay pour mobile */}
      {sidebarOpen && (
        <div 
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-header-content">
            <div className="sidebar-brand">
              <div className="sidebar-logo">
                <Users size={24} />
              </div>
              <h2 className="sidebar-title">Mahabo KYC Admin</h2>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="sidebar-close-btn"
              aria-label="Fermer le menu"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <nav className="sidebar-nav">
          <ul className="sidebar-nav-list">
            <li>
              <Link to="../../admin/dashboard" className="sidebar-nav-link active">
                <Home size={20} />
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="../../admin/demandes" className="sidebar-nav-link">
                <List size={20} />
                Demandes KYC
              </Link>
            </li>
            <li>
              <Link to="#" className="sidebar-nav-link">
                <Settings size={20} />
                Paramètres
              </Link>
            </li>
          </ul>
        </nav>

        <div className="sidebar-footer">
          <button className="sidebar-logout-btn">
            <LogOut size={20} />
            Déconnexion
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;