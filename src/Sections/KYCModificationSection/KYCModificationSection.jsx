import React, { useState, useEffect } from 'react';
import { 
  Edit3, 
  Shield, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  ArrowLeft, 
  Send,
  User,
  FileText,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Flag,
  Upload,
  Eye,
  RefreshCw,
  Download,
  X
} from 'lucide-react';
import './KYCModificationSection.css';

const KYCModificationSection = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [publicId, setPublicId] = useState('');
  const [editCode, setEditCode] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [kycData, setKycData] = useState(null);
  const [formData, setFormData] = useState({
    nom: '',
    prenoms: '',
    sex: '',
    dateNaissance: '',
    nationalite: '',
    address: '',
    telephone: '',
    email: '',
    documentId: '',
    documentType: '',
    justificatifId: '',
    justificatifType: ''
  });
  const [files, setFiles] = useState({
    document: null,
    justificatif: null
  });
  const [filePreview, setFilePreview] = useState({
    document: null,
    justificatif: null
  });

  // Base URL de votre API
  const API_BASE_URL = import.meta.env.VITE_API_URL;

  // Timer pour le code de modification
  useEffect(() => {
    let interval;
    if (timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => time - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
  };

  // Demander le code de modification
  const handleRequestEditCode = async () => {
    if (!publicId.trim()) {
      showMessage('error', 'Veuillez saisir votre code de suivi');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/kyc/${publicId}/send-edit-code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok) {
        setTimeLeft(15 * 60); // 15 minutes
        setCurrentStep(2);
        showMessage('success', data.message || 'Code de modification envoyé par email');
      } else {
        showMessage('error', data.error || 'Erreur lors de l\'envoi du code');
      }
    } catch (error) {
      console.error('Erreur:', error);
      showMessage('error', 'Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
  };

  // Valider le code et récupérer les données
  const handleValidateCode = async () => {
    if (!editCode.trim() || editCode.length !== 6) {
      showMessage('error', 'Veuillez saisir un code à 6 caractères');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/kyc/${publicId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const kycInfo = await response.json();
        
        // Simulation de validation du code (vous pouvez ajouter un endpoint spécifique)
        // Pour l'instant, on passe directement à l'étape suivante
        setKycData(kycInfo);
        setFormData({
          nom: kycInfo.nom || '',
          prenoms: kycInfo.prenoms || '',
          sex: kycInfo.sex || '',
          dateNaissance: kycInfo.dateNaissance || '',
          nationalite: kycInfo.nationalite || '',
          address: kycInfo.address || '',
          telephone: kycInfo.telephone || '',
          email: kycInfo.email || '',
          documentId: kycInfo.documentId || '',
          documentType: kycInfo.documentType || '',
          justificatifId: kycInfo.justificatifId || '',
          justificatifType: kycInfo.justificatifType || ''
        });
        setCurrentStep(3);
        showMessage('success', 'Code validé avec succès');
      } else {
        const errorData = await response.json();
        showMessage('error', errorData.error || 'Erreur lors de la récupération des données');
      }
    } catch (error) {
      console.error('Erreur:', error);
      showMessage('error', 'Code invalide ou erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Gestion des fichiers
  const handleFileChange = (type, file) => {
    if (file) {
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        showMessage('error', 'Le fichier ne doit pas dépasser 5MB');
        return;
      }

      const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        showMessage('error', 'Format de fichier non supporté (JPG, PNG, PDF uniquement)');
        return;
      }

      setFiles(prev => ({ ...prev, [type]: file }));
      
      // Créer un aperçu si c'est une image
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setFilePreview(prev => ({ ...prev, [type]: e.target.result }));
        };
        reader.readAsDataURL(file);
      } else {
        setFilePreview(prev => ({ ...prev, [type]: 'pdf' }));
      }
    }
  };

  const removeFile = (type) => {
    setFiles(prev => ({ ...prev, [type]: null }));
    setFilePreview(prev => ({ ...prev, [type]: null }));
  };

  // Soumettre les modifications
  const handleSubmitModification = async () => {
    setLoading(true);
    try {
      const formDataToSend = new FormData();
      
      // Ajouter les données du formulaire
      Object.keys(formData).forEach(key => {
        formDataToSend.append(key, formData[key]);
      });

      // Ajouter le code de modification
      //formDataToSend.append('editCode', editCode);

      // Ajouter les fichiers s'ils ont été modifiés
      if (files.document) {
        formDataToSend.append('document', files.document);
      }
      if (files.justificatif) {
        formDataToSend.append('justificatif', files.justificatif);
      }

      const response = await fetch(`${API_BASE_URL}/kyc/${publicId}`, {
        method: 'PUT',
        body: formDataToSend,
      });

      const data = await response.json();

      if (response.ok) {
        showMessage('success', data.message || 'Modifications enregistrées avec succès');
        setTimeout(() => {
          // Redirection vers page de suivi
          window.location.href = '/suivi';
        }, 2000);
      } else {
        showMessage('error', data.error || 'Erreur lors de la sauvegarde');
      }
    } catch (error) {
      console.error('Erreur:', error);
      showMessage('error', 'Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
  };

  const renderStep1 = () => (
    <div className="step-content" data-step="1">
      <div className="step-header">
        <div className="step-icon">
          <Shield className="icon" />
        </div>
        <h2>Vérification d'identité</h2>
        <p>Saisissez votre code de suivi pour demander les modifications</p>
      </div>

      <div className="form-group">
        <label htmlFor="publicId">Code de suivi KYC</label>
        <div className="input-wrapper">
          <input
            type="text"
            id="publicId"
            value={publicId}
            onChange={(e) => setPublicId(e.target.value.toUpperCase())}
            placeholder="KYC-MAHABO-20240526-ABC123"
            className="form-input"
            aria-describedby="publicId-help"
          />
          <div className="input-icon">
            <FileText className="icon" />
          </div>
        </div>
        <small id="publicId-help">Format: KYC-MAHABO-YYYYMMDD-XXXXXX</small>
      </div>

      <button 
        className="btn btn-primary"
        onClick={handleRequestEditCode}
        disabled={loading || !publicId.trim()}
        aria-label="Demander le code de modification"
      >
        {loading ? <RefreshCw className="icon spinning" /> : <Send className="icon" />}
        {loading ? 'Envoi en cours...' : 'Demander le code de modification'}
      </button>
    </div>
  );

  const renderStep2 = () => (
    <div className="step-content" data-step="2">
      <div className="step-header">
        <div className="step-icon">
          <Clock className="icon" />
        </div>
        <h2>Validation du code de modification</h2>
        <p>Saisissez le code reçu par email</p>
      </div>

      <div className="timer-display">
        <Clock className="icon" />
        <span>Temps restant: {formatTime(timeLeft)}</span>
      </div>

      <div className="form-group">
        <label htmlFor="editCode">Code de modification</label>
        <div className="input-wrapper">
          <input
            type="text"
            id="editCode"
            value={editCode}
            onChange={(e) => setEditCode(e.target.value.toUpperCase())}
            placeholder="A1B2C3"
            className="form-input code-input"
            maxLength="6"
            aria-describedby="editCode-help"
          />
          <div className="input-icon">
            <Shield className="icon" />
          </div>
        </div>
        <small id="editCode-help">Code à 6 caractères reçu par email</small>
      </div>

      <div className="button-group">
        <button 
          className="btn btn-primary"
          onClick={handleValidateCode}
          disabled={loading || editCode.length !== 6 || timeLeft === 0}
        >
          {loading ? <RefreshCw className="icon spinning" /> : <CheckCircle className="icon" />}
          {loading ? 'Validation...' : 'Valider le code'}
        </button>

        <button 
          className="btn btn-secondary"
          onClick={handleRequestEditCode}
          disabled={loading}
        >
          <RefreshCw className="icon" />
          Renvoyer le code
        </button>
      </div>
    </div>
  );

  const renderFileUpload = (type, label, accept = "image/*,.pdf") => (
    <div className="file-upload-section">
      <label className="file-upload-label">{label}</label>
      <div className="file-upload-area">
        {!files[type] && !filePreview[type] ? (
          <label className="file-upload-button">
            <input
              type="file"
              accept={accept}
              onChange={(e) => handleFileChange(type, e.target.files[0])}
              style={{ display: 'none' }}
            />
            <Upload className="icon" />
            <span>Cliquer pour sélectionner un fichier</span>
            <small>JPG, PNG ou PDF (max 5MB)</small>
          </label>
        ) : (
          <div className="file-preview">
            {filePreview[type] === 'pdf' ? (
              <div className="pdf-preview">
                <FileText className="icon" />
                <span>{files[type]?.name || 'Document PDF'}</span>
              </div>
            ) : filePreview[type] ? (
              <img src={filePreview[type]} alt="Preview" className="image-preview" />
            ) : (
              <div className="existing-file">
                <FileText className="icon" />
                <span>Fichier existant</span>
              </div>
            )}
            <div className="file-actions">
              <button
                type="button"
                onClick={() => removeFile(type)}
                className="btn-remove-file"
              >
                <X className="icon" />
              </button>
              <label className="btn-change-file">
                <input
                  type="file"
                  accept={accept}
                  onChange={(e) => handleFileChange(type, e.target.files[0])}
                  style={{ display: 'none' }}
                />
                Changer
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="step-content" data-step="3">
      <div className="step-header">
        <div className="step-icon">
          <Edit3 className="icon" />
        </div>
        <h2>Modification des informations</h2>
        <p>Modifiez les informations nécessaires</p>
      </div>

      <div className="form-sections">
        <section className="form-section">
          <h3>
            <User className="icon" />
            Informations personnelles
          </h3>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="nom">Nom</label>
              <input
                type="text"
                id="nom"
                value={formData.nom}
                onChange={(e) => handleInputChange('nom', e.target.value)}
                className="form-input"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="prenoms">Prénoms</label>
              <input
                type="text"
                id="prenoms"
                value={formData.prenoms}
                onChange={(e) => handleInputChange('prenoms', e.target.value)}
                className="form-input"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="sex">Sexe</label>
              <select
                id="sex"
                value={formData.sex}
                onChange={(e) => handleInputChange('sex', e.target.value)}
                className="form-select"
                required
              >
                <option value="">Sélectionner</option>
                <option value="M">Masculin</option>
                <option value="F">Féminin</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="dateNaissance">Date de naissance</label>
              <div className="input-wrapper">
                <input
                  type="date"
                  id="dateNaissance"
                  value={formData.dateNaissance}
                  onChange={(e) => handleInputChange('dateNaissance', e.target.value)}
                  className="form-input"
                  required
                />
                <Calendar className="input-icon icon" />
              </div>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="nationalite">Nationalité</label>
            <div className="input-wrapper">
              <input
                type="text"
                id="nationalite"
                value={formData.nationalite}
                onChange={(e) => handleInputChange('nationalite', e.target.value)}
                className="form-input"
                required
              />
              <Flag className="input-icon icon" />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="address">Adresse</label>
            <div className="input-wrapper">
              <textarea
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                className="form-textarea"
                rows="3"
                required
              />
              <MapPin className="input-icon icon" />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="telephone">Téléphone</label>
              <div className="input-wrapper">
                <input
                  type="tel"
                  id="telephone"
                  value={formData.telephone}
                  onChange={(e) => handleInputChange('telephone', e.target.value)}
                  className="form-input"
                  required
                />
                <Phone className="input-icon icon" />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <div className="input-wrapper">
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="form-input"
                  required
                />
                <Mail className="input-icon icon" />
              </div>
            </div>
          </div>
        </section>

        <section className="form-section">
          <h3>
            <FileText className="icon" />
            Documents d'identité
          </h3>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="documentType">Type de document</label>
              <select
                id="documentType"
                value={formData.documentType}
                onChange={(e) => handleInputChange('documentType', e.target.value)}
                className="form-select"
                required
              >
                <option value="">Sélectionner</option>
                <option value="CNI">Carte Nationale d'Identité</option>
                <option value="CIP">Carte d'Identité Professionnelle</option>
                <option value="passeport">Passeport</option>
                <option value="permis_conduire">Permis de conduire</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="documentId">Numéro du document</label>
              <input
                type="text"
                id="documentId"
                value={formData.documentId}
                onChange={(e) => handleInputChange('documentId', e.target.value)}
                className="form-input"
                required
              />
            </div>
          </div>

          {renderFileUpload('document', 'Document d\'identité')}

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="justificatifType">Type de justificatif</label>
              <select
                id="justificatifType"
                value={formData.justificatifType}
                onChange={(e) => handleInputChange('justificatifType', e.target.value)}
                className="form-select"
                required
              >
                <option value="">Sélectionner</option>
                <option value="Facture_SBEE">Facture SBEE</option>
                <option value="Facture_SONEB">Facture SONEB</option>
                <option value="Releve_bancaire">Relevé bancaire</option>
                <option value="Certificat_de_résidence">Certificat de résidence</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="justificatifId">Référence du justificatif</label>
              <input
                type="text"
                id="justificatifId"
                value={formData.justificatifId}
                onChange={(e) => handleInputChange('justificatifId', e.target.value)}
                className="form-input"
                required
              />
            </div>
          </div>

          {renderFileUpload('justificatif', 'Justificatif de domicile')}
        </section>
      </div>

      <div className="form-actions">
        <button 
          className="btn btn-primary btn-large"
          onClick={handleSubmitModification}
          disabled={loading}
        >
          {loading ? <RefreshCw className="icon spinning" /> : <CheckCircle className="icon" />}
          {loading ? 'Enregistrement...' : 'Enregistrer les modifications'}
        </button>
      </div>
    </div>
  );

  return (
    <div id="kyc-modification">
      <header className="page-header">
        <div className="container">
          <button className="back-button" onClick={() => window.history.back()}>
            <ArrowLeft className="icon" />
            Retour
          </button>
          
          <div className="header-content">
            <h1>Modification de demande KYC</h1>
            <div className="progress-bar">
              <div className="progress-steps">
                {[1, 2, 3].map(step => (
                  <div 
                    key={step}
                    className={`progress-step ${currentStep >= step ? 'active' : ''} ${currentStep > step ? 'completed' : ''}`}
                  >
                    <span className="step-number">{step}</span>
                    <span className="step-label">
                      {step === 1 ? 'Vérification' : step === 2 ? 'Code' : 'Modification'}
                    </span>
                  </div>
                ))}
              </div>
              <div 
                className="progress-fill"
                style={{ width: `${((currentStep - 1) / 2) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </header>

      <main className="main-content">
        <div className="container">
          <div className="content-grid">
            <div className="form-section">
              {message.text && (
                <div className={`message message-${message.type}`} role="alert">
                  {message.type === 'success' ? <CheckCircle className="icon" /> : <AlertCircle className="icon" />}
                  {message.text}
                </div>
              )}

              {currentStep === 1 && renderStep1()}
              {currentStep === 2 && renderStep2()}
              {currentStep === 3 && renderStep3()}
            </div>

            <aside className="sidebar">
              <div className="help-section">
                <h3>Instructions</h3>
                <div className="help-steps">
                  <div className={`help-step ${currentStep >= 1 ? 'active' : ''}`}>
                    <div className="help-step-number">1</div>
                    <div className="help-step-content">
                      <h4>Saisir le code de suivi</h4>
                      <p>Utilisez le code reçu lors de votre demande initiale</p>
                    </div>
                  </div>
                  
                  <div className={`help-step ${currentStep >= 2 ? 'active' : ''}`}>
                    <div className="help-step-number">2</div>
                    <div className="help-step-content">
                      <h4>Valider le code de modification</h4>
                      <p>Saisissez le code reçu par email (valide 15 min)</p>
                    </div>
                  </div>
                  
                  <div className={`help-step ${currentStep >= 3 ? 'active' : ''}`}>
                    <div className="help-step-number">3</div>
                    <div className="help-step-content">
                      <h4>Modifier vos informations</h4>
                      <p>Corrigez les données nécessaires et soumettez</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="security-notice">
                <Shield className="icon" />
                <div>
                  <h4>Sécurité</h4>
                  <p>Vos données sont chiffrées et sécurisées. Cette modification remet votre demande en attente de validation.</p>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>

      <style jsx>{`
        .file-upload-section {
          margin: 1rem 0;
        }

        .file-upload-label {
          display: block;
          font-weight: 600;
          margin-bottom: 0.5rem;
          color: #374151;
        }

        .file-upload-area {
          border: 2px dashed #d1d5db;
          border-radius: 8px;
          padding: 1.5rem;
          text-align: center;
          transition: all 0.3s ease;
        }

        .file-upload-area:hover {
          border-color: #3b82f6;
          background-color: #f8fafc;
        }

        .file-upload-button {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
          color: #6b7280;
        }

        .file-upload-button:hover {
          color: #3b82f6;
        }

        .file-preview {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }

        .image-preview {
          max-width: 200px;
          max-height: 150px;
          object-fit: cover;
          border-radius: 4px;
          border: 1px solid #e5e7eb;
        }

        .pdf-preview, .existing-file {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 1rem;
          background-color: #f3f4f6;
          border-radius: 4px;
          border: 1px solid #e5e7eb;
        }

        .file-actions {
          display: flex;
          gap: 0.5rem;
          align-items: center;
        }

        .btn-remove-file {
          background: #ef4444;
          color: white;
          border: none;
          border-radius: 4px;
          padding: 0.25rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .btn-remove-file:hover {
          background: #dc2626;
        }

        .btn-change-file {
          background: #3b82f6;
          color: white;
          border: none;
          border-radius: 4px;
          padding: 0.5rem 1rem;
          cursor: pointer;
          font-size: 0.875rem;
        }

        .btn-change-file:hover {
          background: #2563eb;
        }

        .spinning {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default KYCModificationSection;