import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  Download, 
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight
} from 'lucide-react';
import Header from '../../../Components/admin/AdminHeader/AdminHeader';
import Sidebar from '../../../Components/admin/Sidebar/Sidebar';
import RequestsTable from '../../../Components/admin/RequestsTable/RequestsTable';
import './DemandesListes.css';

const DemandesListes = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [allRequests, setAllRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  
  // États pour la pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  
  // États pour les filtres
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_API_URL;

  // Vérifier l'authentification
  const checkAuth = () => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return false;
    }
    return token;
  };

  // Faire une requête avec le token
  const fetchWithAuth = async (url, options = {}) => {
    const token = checkAuth();
    if (!token) return null;

    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (response.status === 401 || response.status === 403) {
      localStorage.removeItem('adminToken');
      navigate('/admin/login');
      throw new Error('Session expirée');
    }

    return response;
  };

  // Charger toutes les demandes KYC
  const loadAllKycRequests = async () => {
    try {
      setLoading(true);
      const response = await fetchWithAuth(`${API_BASE_URL}/admin/kyc`);
      
      if (!response) return;

      if (response.ok) {
        const data = await response.json();
        setAllRequests(data);
        setFilteredRequests(data);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Erreur lors du chargement des données');
      }
    } catch (err) {
      if (err.message !== 'Session expirée') {
        setError('Erreur de connexion au serveur');
      }
    } finally {
      setLoading(false);
    }
  };

  // Appliquer les filtres
  const applyFilters = () => {
    let filtered = [...allRequests];

    // Filtre de recherche
    if (searchTerm) {
      filtered = filtered.filter(request => 
        request.prenoms.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.publicId.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtre de statut
    if (statusFilter !== 'all') {
      filtered = filtered.filter(request => request.status === statusFilter);
    }

    // Filtre de date
    if (dateFilter !== 'all') {
      const now = new Date();
      const filterDate = new Date();
      
      switch (dateFilter) {
        case 'today':
          filterDate.setHours(0, 0, 0, 0);
          filtered = filtered.filter(request => 
            new Date(request.createdAt) >= filterDate
          );
          break;
        case 'week':
          filterDate.setDate(now.getDate() - 7);
          filtered = filtered.filter(request => 
            new Date(request.createdAt) >= filterDate
          );
          break;
        case 'month':
          filterDate.setMonth(now.getMonth() - 1);
          filtered = filtered.filter(request => 
            new Date(request.createdAt) >= filterDate
          );
          break;
      }
    }

    setFilteredRequests(filtered);
    setCurrentPage(1);
  };

  // Transformer les données pour le composant RequestsTable
  const transformRequestsForTable = (requests) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    
    return requests.slice(startIndex, endIndex).map(request => ({
      id: request.publicId,
      name: `${request.prenoms} ${request.nom}`,
      email: request.email,
      status: request.status,
      submittedAt: request.createdAt,
      documents: 2,
      fullData: request
    }));
  };

  // Calculer les informations de pagination
  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, filteredRequests.length);

  // Naviguer vers une page
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Générer les numéros de page à afficher
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const start = Math.max(1, currentPage - 2);
      const end = Math.min(totalPages, start + maxVisible - 1);
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  };

  // Réinitialiser les filtres
  const resetFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setDateFilter('all');
    setFilteredRequests(allRequests);
    setCurrentPage(1);
  };

  // Exporter les données (fonction basique)
  const exportData = () => {
    const dataStr = JSON.stringify(filteredRequests, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `kyc_requests_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Appliquer les filtres quand ils changent
  useEffect(() => {
    applyFilters();
  }, [searchTerm, statusFilter, dateFilter, allRequests]);

  useEffect(() => {
    if (!checkAuth()) return;
    loadAllKycRequests();
  }, []);

  if (loading) {
    return (
      <div className="all-kyc-requests">
        <div className="all-kyc-loading">
          <div className="loading-spinner"></div>
          <p>Chargement des demandes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="all-kyc-requests">
        <div className="all-kyc-error">
          <p>Erreur: {error}</p>
          <button onClick={loadAllKycRequests} className="retry-btn">
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="all-kyc-requests">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <main style={{padding:'0px'}} className={`all-kyc-main ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        
        <div className="all-kyc-content">
          {/* En-tête avec actions */}
          <div className="all-kyc-header">
            <div className="header-title">
              <h1>Toutes les demandes KYC</h1>
              <p>{filteredRequests.length} demande{filteredRequests.length > 1 ? 's' : ''} trouvée{filteredRequests.length > 1 ? 's' : ''}</p>
            </div>
            
            <div className="header-actions">
              <button 
                className="refresh-btn"
                onClick={loadAllKycRequests}
                title="Actualiser"
              >
                <RefreshCw size={18} />
              </button>
              
              <button 
                className="export-btn"
                onClick={exportData}
                title="Exporter"
              >
                <Download size={18} />
                Exporter
              </button>
              
              <button 
                className={`filter-toggle ${showFilters ? 'active' : ''}`}
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter size={18} />
                Filtres
              </button>
            </div>
          </div>

          {/* Barre de recherche */}
          <div className="search-bar">
            <div className="search-input-container">
              <Search size={20} />
              <input
                type="text"
                placeholder="Rechercher par nom, email ou ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
          </div>

          {/* Filtres */}
          {showFilters && (
            <div className="filters-panel">
              <div className="filter-group">
                <label>Statut</label>
                <select 
                  value={statusFilter} 
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">Tous les statuts</option>
                  <option value="pending">En attente</option>
                  <option value="approved">Approuvé</option>
                  <option value="rejected">Rejeté</option>
                </select>
              </div>
              
              <div className="filter-group">
                <label>Période</label>
                <select 
                  value={dateFilter} 
                  onChange={(e) => setDateFilter(e.target.value)}
                >
                  <option value="all">Toutes les périodes</option>
                  <option value="today">Aujourd'hui</option>
                  <option value="week">Cette semaine</option>
                  <option value="month">Ce mois</option>
                </select>
              </div>
              
              <button className="reset-filters-btn" onClick={resetFilters}>
                Réinitialiser
              </button>
            </div>
          )}

          {/* Table des demandes */}
          <RequestsTable 
            recentRequests={transformRequestsForTable(filteredRequests)}
            onViewDetails={(request) => {
              navigate(`/admin/kyc/${request.fullData.id}`);
            }}
          />

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination-container">
              <div className="pagination-info">
                Affichage de {startItem} à {endItem} sur {filteredRequests.length} résultats
              </div>
              
              <div className="pagination-controls">
                <button 
                  className="pagination-btn"
                  onClick={() => goToPage(1)}
                  disabled={currentPage === 1}
                  title="Première page"
                >
                  <ChevronsLeft size={16} />
                </button>
                
                <button 
                  className="pagination-btn"
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  title="Page précédente"
                >
                  <ChevronLeft size={16} />
                </button>
                
                {getPageNumbers().map(pageNum => (
                  <button
                    key={pageNum}
                    className={`pagination-btn ${currentPage === pageNum ? 'active' : ''}`}
                    onClick={() => goToPage(pageNum)}
                  >
                    {pageNum}
                  </button>
                ))}
                
                <button 
                  className="pagination-btn"
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  title="Page suivante"
                >
                  <ChevronRight size={16} />
                </button>
                
                <button 
                  className="pagination-btn"
                  onClick={() => goToPage(totalPages)}
                  disabled={currentPage === totalPages}
                  title="Dernière page"
                >
                  <ChevronsRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default DemandesListes;