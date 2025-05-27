import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, CheckCircle, XCircle, Clock } from 'lucide-react';
import Header from '../../../Components/admin/AdminHeader/AdminHeader';
import Sidebar from '../../../Components/admin/Sidebar/Sidebar';
import StatCard from '../../../Components/admin/StatCard/StatCard';
import RequestsTable from '../../../Components/admin/RequestsTable/RequestsTable';
import './DashboardSections.css';

const DashboardSections = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [statsVisible, setStatsVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [kycRequests, setKycRequests] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    approved: 0,
    rejected: 0,
    pending: 0,
    todaySubmissions: 0,
    weeklyGrowth: 0,
    monthlyGrowth: 0
  });

  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_API_URL; // Ajustez selon votre config

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

  // Calculer les statistiques à partir des données
  const calculateStats = (requests) => {
    const total = requests.length;
    const approved = requests.filter(req => req.status === 'approved').length;
    const rejected = requests.filter(req => req.status === 'rejected').length;
    const pending = requests.filter(req => req.status === 'pending').length;

    // Calculer les soumissions d'aujourd'hui
    const today = new Date().toDateString();
    const todaySubmissions = requests.filter(req => 
      new Date(req.createdAt).toDateString() === today
    ).length;

    // Pour les tendances, on peut simuler ou calculer selon vos besoins
    const weeklyGrowth = Math.random() * 20 - 10; // Simulation pour l'exemple
    const monthlyGrowth = Math.random() * 15 - 7.5;

    return {
      total,
      approved,
      rejected,
      pending,
      todaySubmissions,
      weeklyGrowth: parseFloat(weeklyGrowth.toFixed(1)),
      monthlyGrowth: parseFloat(monthlyGrowth.toFixed(1))
    };
  };

  // Charger les données KYC
  const loadKycRequests = async () => {
    try {
      setLoading(true);
      const response = await fetchWithAuth(`${API_BASE_URL}/admin/kyc`);
      
      if (!response) return;

      if (response.ok) {
        const data = await response.json();
        setKycRequests(data);
        
        // Calculer les statistiques
        const calculatedStats = calculateStats(data);
        setStats(calculatedStats);
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

  // Transformer les données pour le composant RequestsTable
  const transformRequestsForTable = (requests) => {
    return requests.slice(0, 10).map(request => ({
      id: request.publicId,
      name: `${request.prenoms} ${request.nom}`,
      email: request.email,
      status: request.status,
      submittedAt: request.createdAt,
      documents: 2, // Vous avez toujours 2 docs (document + justificatif)
      fullData: request // Garder les données complètes pour plus tard
    }));
  };

  useEffect(() => {
    // Vérifier l'auth au chargement
    if (!checkAuth()) return;

    // Charger les données
    loadKycRequests();

    // Animation des stats
    const timer = setTimeout(() => setStatsVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="dashboard">
        <div className="dashboard-loading">
          <div className="loading-spinner"></div>
          <p>Chargement des données...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard">
        <div className="dashboard-error">
          <p>Erreur: {error}</p>
          <button onClick={loadKycRequests} className="retry-btn">
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <main style={{padding:'0px'}} className={`dashboard-main ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <Header 
          sidebarOpen={sidebarOpen} 
          setSidebarOpen={setSidebarOpen} 
          todaySubmissions={stats.todaySubmissions} 
        />
        <div className="dashboard-content">
          {/* Cartes de statistiques */}
          <div className="stats-grid">
            <StatCard 
              title="Total des demandes" 
              value={stats.total} 
              icon={Users} 
              color="#1E3A8A" 
              delay={0} 
              statsVisible={statsVisible} 
            />
            <StatCard 
              title="Demandes approuvées" 
              value={stats.approved} 
              icon={CheckCircle} 
              color="#10B981" 
              trend={stats.weeklyGrowth} 
              delay={100} 
              statsVisible={statsVisible} 
            />
            <StatCard 
              title="Demandes rejetées" 
              value={stats.rejected} 
              icon={XCircle} 
              color="#EF4444" 
              trend={stats.monthlyGrowth} 
              delay={200} 
              statsVisible={statsVisible} 
            />
            <StatCard 
              title="En attente" 
              value={stats.pending} 
              icon={Clock} 
              color="#F59E0B" 
              delay={300} 
              statsVisible={statsVisible} 
            />
          </div>

          {/* Demandes récentes */}
          <RequestsTable 
            recentRequests={transformRequestsForTable(kycRequests)} 
            onViewDetails={(request) => {
              // Navigation vers la page de détails (à implémenter plus tard)
              navigate(`/admin/kyc/${request.fullData.id}`);
            }}
          />
        </div>
      </main>
    </div>
  );
};

export default DashboardSections;