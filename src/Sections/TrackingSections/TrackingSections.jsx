import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, CheckCircle, Clock, XCircle, AlertTriangle, RefreshCw } from 'lucide-react';
import './TrackingSections.css';

const TrackingSections = () => {
  const [trackingCode, setTrackingCode] = useState('');
  const [demandData, setDemandData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!trackingCode.trim()) {
      setError('Veuillez saisir un code de suivi');
      return;
    }

    setLoading(true);
    setError('');
    setIsAnimating(true);

    try {
      // Appel à votre API backend
      const response = await fetch(`${API_URL}/kyc/${trackingCode.trim()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setDemandData({
          id: trackingCode.trim(),
          status: data.status,
          submissionDate: new Date().toISOString().split('T')[0], // Date actuelle par défaut
          lastUpdate: new Date().toISOString().split('T')[0], // Date actuelle par défaut
        });
        setError('');
      } else if (response.status === 404) {
        setError('Code de suivi introuvable. Vérifiez votre code et réessayez.');
        setDemandData(null);
      } else {
        setError('Erreur lors de la récupération des données. Veuillez réessayer.');
        setDemandData(null);
      }
    } catch (error) {
      console.error('Erreur API:', error);
      setError('Erreur de connexion. Vérifiez votre connexion internet et réessayez.');
      setDemandData(null);
    } finally {
      setLoading(false);
      setIsAnimating(false);
    }
  };

  const getStatusInfo = (status) => {
    switch (status) {
      case 'pending':
        return {
          label: 'En cours d\'examen',
          icon: Clock,
          color: '#F59E0B',
          bgColor: '#FEF3C7',
          description: 'Votre demande est en cours d\'examen par nos équipes.'
        };
      case 'approved':
        return {
          label: 'Approuvée',
          icon: CheckCircle,
          color: '#10B981',
          bgColor: '#D1FAE5',
          description: 'Félicitations ! Votre identité a été vérifiée avec succès.'
        };
      case 'rejected':
        return {
          label: 'Rejetée',
          icon: XCircle,
          color: '#EF4444',
          bgColor: '#FEE2E2',
          description: 'Votre demande a été rejetée. Veuillez contacter le support pour plus d\'informations.'
        };
      default:
        return {
          label: 'Inconnu',
          icon: AlertTriangle,
          color: '#6B7280',
          bgColor: '#F3F4F6',
          description: 'Statut indéterminé.'
        };
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const sendEditCode = async () => {
    if (!demandData?.id) return;

    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/kyc/${demandData.id}/send-edit-code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        console.log('Code de modification envoyé à votre adresse email !');
      } else {
        console.log('Erreur lors de l\'envoi du code de modification.');
      }
      navigate(`../modification`)
    } catch (error) {
      console.error('Erreur lors de l\'envoi du code:', error);
      console.log('Erreur de connexion lors de l\'envoi du code.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main id="trackingPage" className="tracking-page">
      {/* Header Section */}
      <section className="tracking-header">
        <div className="container">
          <div className="header-content">
            <div className="header-icon">
              <Search size={48} />
            </div>
            <h1>Suivi de votre demande</h1>
            <p>Entrez votre code de suivi pour consulter l'état de votre vérification d'identité</p>
          </div>
        </div>
      </section>

      {/* Search Form Section */}
      <section className="tracking-form-section">
        <div className="container">
          <div className="tracking-form">
            <div className="form-group">
              <label htmlFor="trackingCode">Code de suivi</label>
              <div className="input-wrapper">
                <input
                  id="trackingCode"
                  type="text"
                  value={trackingCode}
                  onChange={(e) => setTrackingCode(e.target.value)}
                  placeholder="Ex: KYC-MAHABO-20250526-ABC123"
                  className={error ? 'error' : ''}
                  aria-describedby={error ? 'tracking-error' : undefined}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch(e)}
                />
                <button 
                  onClick={handleSearch} 
                  disabled={loading}
                  className="search-btn"
                  aria-label="Rechercher la demande"
                >
                  {loading ? <RefreshCw className="spinning" size={20} /> : <Search size={20} />}
                </button>
              </div>
              {error && (
                <div id="tracking-error" className="error-message" role="alert">
                  <AlertTriangle size={16} />
                  <span>{error}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Results Section */}
      {demandData && (
        <section className={`results-section ${isAnimating ? 'animating' : ''}`}>
          <div className="container">
            {/* Status Display */}
            <div className="status-card">
              <div className="status-header">
                <div className="status-icon" style={{ backgroundColor: getStatusInfo(demandData.status).bgColor }}>
                  {React.createElement(getStatusInfo(demandData.status).icon, {
                    size: 32,
                    color: getStatusInfo(demandData.status).color
                  })}
                </div>
                <div className="status-info">
                  <h2>{getStatusInfo(demandData.status).label}</h2>
                  <p>{getStatusInfo(demandData.status).description}</p>
                </div>
              </div>

              <div className="status-details">
                <div className="detail-item">
                  <span className="label">Code de suivi:</span>
                  <span className="value">{demandData.id}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Statut:</span>
                  <span className="value">{getStatusInfo(demandData.status).label}</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Help Section */}
      <section className="help-section">
        <div className="container">
          <h2>Besoin d'aide ?</h2>
          <div className="help-grid">
            <div className="help-item">
              <div className="help-icon">
                <Search size={24} />
              </div>
              <h3>Code de suivi perdu ?</h3>
              <p>Vérifiez votre boîte mail ou contactez notre support pour récupérer votre code.</p>
            </div>
            <div className="help-item">
              <div className="help-icon">
                <Clock size={24} />
              </div>
              <h3>Délais de traitement</h3>
              <p>Les demandes sont généralement traitées sous 2-3 jours ouvrables.</p>
            </div>
            <div className="help-item">
              <div className="help-icon">
                <AlertTriangle size={24} />
              </div>
              <h3>Statuts possibles</h3>
              <p>Pending (en cours), Approved (approuvé), Rejected (rejeté).</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default TrackingSections;