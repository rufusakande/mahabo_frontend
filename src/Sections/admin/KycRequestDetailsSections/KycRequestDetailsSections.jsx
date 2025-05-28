import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  FileText, 
  Download,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Eye,
  X,
  ZoomIn,
  ZoomOut
} from 'lucide-react';
import Header from '../../../Components/admin/AdminHeader/AdminHeader';
import Sidebar from '../../../Components/admin/Sidebar/Sidebar';
import './KycRequestDetailsSections.css';

const KycRequestDetailsSections = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [request, setRequest] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  
  // États pour l'aperçu des documents
  const [showPreview, setShowPreview] = useState(false);
  const [previewDocument, setPreviewDocument] = useState(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);

  const API_BASE_URL = import.meta.env.VITE_API_URL;
  const URL_DOC = import.meta.env.VITE_URL_DOC;

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

  // Charger les détails de la demande
  const loadRequestDetails = async () => {
    try {
      setLoading(true);
      const response = await fetchWithAuth(`${API_BASE_URL}/admin/kyc/${id}`);
      
      if (!response) return;

      if (response.ok) {
        const data = await response.json();
        setRequest(data);
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

  // Déterminer le type de fichier
  const getFileType = (filename) => {
    const extension = filename.split('.').pop().toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension)) {
      return 'image';
    } else if (extension === 'pdf') {
      return 'pdf';
    }
    return 'unknown';
  };

  // Ouvrir l'aperçu d'un document
  const openPreview = async (documentPath, documentType) => {
    try {
      setPreviewLoading(true);
      setShowPreview(true);
      
      const token = localStorage.getItem('adminToken');
      const documentUrl = `${URL_DOC}/${documentPath}`;
      console.log(documentPath)
      console.log(URL_DOC)
      // Vérifier que le document existe et récupérer les informations
      const response = await fetch(documentUrl, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const fileType = getFileType(documentPath);
        
        setPreviewDocument({
          url: documentUrl,
          type: fileType,
          name: documentType,
          path: documentPath
        });
        setZoomLevel(1);
      } else {
        throw new Error('Impossible de charger le document');
      }
    } catch (err) {
      alert('Erreur lors du chargement du document: ' + err.message);
      setShowPreview(false);
    } finally {
      setPreviewLoading(false);
    }
  };

  // Fermer l'aperçu
  const closePreview = () => {
    setShowPreview(false);
    setPreviewDocument(null);
    setZoomLevel(1);
  };

  // Gérer le zoom
  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.25, 0.5));
  };

  // Mettre à jour le statut
  const updateStatus = async (newStatus, reason = null) => {
    try {
      setUpdating(true);
      const body = { status: newStatus };
      if (reason) {
        body.rejectionReason = reason;
      }

      const response = await fetchWithAuth(`${API_BASE_URL}/admin/kyc/${id}`, {
        method: 'PUT',
        body: JSON.stringify(body)
      });

      if (response && response.ok) {
        await loadRequestDetails();
        setShowRejectModal(false);
        setRejectionReason('');
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Erreur lors de la mise à jour');
      }
    } catch (err) {
      setError('Erreur lors de la mise à jour');
    } finally {
      setUpdating(false);
    }
  };

  // Gérer l'approbation
  const handleApprove = () => {
    updateStatus('approved');
  };

  // Gérer le rejet
  const handleReject = () => {
    if (!rejectionReason.trim()) {
      alert('Veuillez préciser la raison du rejet');
      return;
    }
    updateStatus('rejected', rejectionReason);
  };

  // Obtenir la couleur du statut
  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return '#10B981';
      case 'rejected': return '#EF4444';
      case 'pending': return '#F59E0B';
      default: return '#6B7280';
    }
  };

  // Obtenir le texte du statut
  const getStatusText = (status) => {
    switch (status) {
      case 'approved': return 'Approuvé';
      case 'rejected': return 'Rejeté';
      case 'pending': return 'En attente';
      default: return 'Inconnu';
    }
  };

  // Obtenir l'icône du statut
  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved': return <CheckCircle size={20} />;
      case 'rejected': return <XCircle size={20} />;
      case 'pending': return <Clock size={20} />;
      default: return <AlertTriangle size={20} />;
    }
  };

  // Formater la date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Télécharger un document
  const downloadDocument = (documentPath, documentType) => {
    const link = document.createElement('a');
    link.href = `${API_BASE_URL}/uploads/${documentPath}`;
    link.download = `${documentType}_${request.publicId}`;
    link.click();
  };

  useEffect(() => {
    if (!checkAuth()) return;
    loadRequestDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="kyc-details">
        <div className="kyc-details-loading">
          <div className="loading-spinner"></div>
          <p>Chargement des détails...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="kyc-details">
        <div className="kyc-details-error">
          <p>Erreur: {error}</p>
          <button onClick={loadRequestDetails} className="retry-btn">
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="kyc-details">
        <div className="kyc-details-error">
          <p>Demande non trouvée</p>
          <button onClick={() => navigate('../../admin/dashboard')} className="back-btn">
            Retour au tableau de bord
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="kyc-details">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <main style={{padding:'0px'}} className={`kyc-details-main ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        
        <div className="kyc-details-content">
          {/* En-tête */}
          <div className="kyc-details-header">
            <button 
              className="back-button"
              onClick={() => navigate('../../admin/demandes')}
            >
              <ArrowLeft size={20} />
              Retour
            </button>
            
            <div className="kyc-details-title">
              <h1>Détails de la demande</h1>
              <div className="kyc-details-id">ID: {request.publicId}</div>
            </div>

            <div 
              className="kyc-details-status"
              style={{
                background: `${getStatusColor(request.status)}15`,
                color: getStatusColor(request.status)
              }}
            >
              {getStatusIcon(request.status)}
              {getStatusText(request.status)}
            </div>
          </div>

          {/* Informations personnelles */}
          <div className="kyc-details-section">
            <h2 className="section-title">
              <User size={20} />
              Informations personnelles
            </h2>
            <div className="info-grid">
              <div className="info-item">
                <label>Nom complet</label>
                <span>{request.prenoms} {request.nom}</span>
              </div>
              <div className="info-item">
                <label>Sexe</label>
                <span>{request.sex}</span>
              </div>
              <div className="info-item">
                <label>Date de naissance</label>
                <span>
                  <Calendar size={16} />
                  {new Date(request.dateNaissance).toLocaleDateString('fr-FR')}
                </span>
              </div>
              <div className="info-item">
                <label>Nationalité</label>
                <span>{request.nationalite}</span>
              </div>
            </div>
          </div>

          {/* Coordonnées */}
          <div className="kyc-details-section">
            <h2 className="section-title">
              <Mail size={20} />
              Coordonnées
            </h2>
            <div className="info-grid">
              <div className="info-item">
                <label>Email</label>
                <span>
                  <Mail size={16} />
                  {request.email}
                </span>
              </div>
              <div className="info-item">
                <label>Téléphone</label>
                <span>
                  <Phone size={16} />
                  {request.telephone}
                </span>
              </div>
              <div className="info-item full-width">
                <label>Adresse</label>
                <span>
                  <MapPin size={16} />
                  {request.address}
                </span>
              </div>
            </div>
          </div>

          {/* Documents */}
          <div className="kyc-details-section">
            <h2 className="section-title">
              <FileText size={20} />
              Documents fournis
            </h2>
            <div className="documents-grid">
              <div className="document-item">
                <div className="document-info">
                  <h3>{request.documentType}</h3>
                  <p>ID: {request.documentId}</p>
                </div>
                <div className="document-actions">
                  {request.documentPath && (
                    <>
                      <button 
                        className="preview-btn"
                        onClick={() => openPreview(request.documentPath, request.documentType)}
                      >
                        <Eye size={16} />
                        Aperçu
                      </button>
                      {/* <button 
                        className="download-btn"
                        onClick={() => downloadDocument(request.documentPath, request.documentType)}
                      >
                        <Download size={16} />
                        Télécharger
                      </button> */}
                    </>
                  )}
                </div>
              </div>
              
              <div className="document-item">
                <div className="document-info">
                  <h3>{request.justificatifType}</h3>
                  <p>ID: {request.justificatifId}</p>
                </div>
                <div className="document-actions">
                  {request.justificatifPath && (
                    <>
                      <button 
                        className="preview-btn"
                        onClick={() => openPreview(request.justificatifPath, request.justificatifType)}
                      >
                        <Eye size={16} />
                        Aperçu
                      </button>
                      {/* <button 
                        className="download-btn"
                        onClick={() => downloadDocument(request.justificatifPath, request.justificatifType)}
                      >
                        <Download size={16} />
                        Télécharger
                      </button> */}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Informations sur la demande */}
          <div className="kyc-details-section">
            <h2 className="section-title">Informations sur la demande</h2>
            <div className="info-grid">
              <div className="info-item">
                <label>Date de soumission</label>
                <span>{formatDate(request.createdAt)}</span>
              </div>
              <div className="info-item">
                <label>Dernière modification</label>
                <span>{formatDate(request.updatedAt)}</span>
              </div>
              {request.rejectionReason && (
                <div className="info-item full-width">
                  <label>Raison du rejet</label>
                  <div className="rejection-reason">
                    <AlertTriangle size={16} />
                    {request.rejectionReason}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          {request.status === 'pending' && (
            <div className="kyc-details-actions">
              <button 
                className="approve-btn"
                onClick={handleApprove}
                disabled={updating}
              >
                <CheckCircle size={20} />
                {updating ? 'Traitement...' : 'Approuver'}
              </button>
              
              <button 
                className="reject-btn"
                onClick={() => setShowRejectModal(true)}
                disabled={updating}
              >
                <XCircle size={20} />
                Rejeter
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Modal de rejet */}
      {showRejectModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Rejeter la demande</h3>
            <p>Veuillez préciser la raison du rejet :</p>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Raison du rejet..."
              rows={4}
            />
            <div className="modal-actions">
              <button 
                className="cancel-btn"
                onClick={() => setShowRejectModal(false)}
              >
                Annuler
              </button>
              <button 
                className="confirm-reject-btn"
                onClick={handleReject}
                disabled={updating || !rejectionReason.trim()}
              >
                {updating ? 'Traitement...' : 'Confirmer le rejet'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal d'aperçu des documents */}
      {showPreview && (
        <div className="document-preview-overlay">
          <div className="document-preview-modal">
            <div className="document-preview-header">
              <h3>{previewDocument?.name}</h3>
              <div className="document-preview-controls">
                {previewDocument?.type === 'image' && (
                  <>
                    <button onClick={handleZoomOut} className="zoom-btn">
                      <ZoomOut size={18} />
                    </button>
                    <span className="zoom-level">{Math.round(zoomLevel * 100)}%</span>
                    <button onClick={handleZoomIn} className="zoom-btn">
                      <ZoomIn size={18} />
                    </button>
                  </>
                )}
                <button 
                  onClick={() => downloadDocument(previewDocument?.path, previewDocument?.name)}
                  className="download-preview-btn"
                >
                  <Download size={18} />
                </button>
                <button onClick={closePreview} className="close-preview-btn">
                  <X size={20} />
                </button>
              </div>
            </div>
            
            <div className="document-preview-content">
              {previewLoading ? (
                <div className="preview-loading">
                  <div className="loading-spinner"></div>
                  <p>Chargement du document...</p>
                </div>
              ) : previewDocument ? (
                <div className="document-viewer">
                  {previewDocument.type === 'image' ? (
                    <img 
                      src={previewDocument.url}
                      alt={previewDocument.name}
                      style={{ 
                        transform: `scale(${zoomLevel})`,
                        maxWidth: '100%',
                        height: 'auto',
                        transition: 'transform 0.3s ease'
                      }}
                    />
                  ) : previewDocument.type === 'pdf' ? (
                    <iframe
                      src={previewDocument.url}
                      title={previewDocument.name}
                      width="100%"
                      height="100%"
                      style={{ border: 'none', minHeight: '600px' }}
                    />
                  ) : (
                    <div className="unsupported-file">
                      <FileText size={48} />
                      <p>Aperçu non disponible pour ce type de fichier</p>
                      <button 
                        onClick={() => downloadDocument(previewDocument.path, previewDocument.name)}
                        className="download-btn"
                      >
                        <Download size={16} />
                        Télécharger le fichier
                      </button>
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KycRequestDetailsSections;