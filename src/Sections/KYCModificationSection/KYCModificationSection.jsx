import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
  RefreshCw,
  X
} from 'lucide-react';
import './KYCModificationSection.css';

const STEPS = {
  VERIFICATION: 1,
  CODE_VALIDATION: 2,
  MODIFICATION: 3
};

const DOCUMENT_TYPES = [
  { value: 'CNI', label: 'Carte Nationale d\'Identité' },
  { value: 'CIP', label: 'Carte d\'Identité Professionnelle' },
  { value: 'passeport', label: 'Passeport' },
  { value: 'permis_conduire', label: 'Permis de conduire' }
];

const JUSTIFICATIF_TYPES = [
  { value: 'Facture_SBEE', label: 'Facture SBEE' },
  { value: 'Facture_SONEB', label: 'Facture SONEB' },
  { value: 'Releve_bancaire', label: 'Relevé bancaire' },
  { value: 'Certificat_de_résidence', label: 'Certificat de résidence' }
];

const KYCModificationSection = () => {
  // États principaux
  const [currentStep, setCurrentStep] = useState(STEPS.VERIFICATION);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  // États pour la vérification
  const [publicId, setPublicId] = useState('');
  const [editCode, setEditCode] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);
  
  // États pour les données
  const [kycData, setKycData] = useState(null);
  const [formData, setFormData] = useState({
    nom: '', prenoms: '', sex: '', dateNaissance: '', nationalite: '',
    address: '', telephone: '', email: '', documentId: '', documentType: '',
    justificatifId: '', justificatifType: ''
  });
  
  // États pour les fichiers
  const [files, setFiles] = useState({ document: null, justificatif: null });
  const [filePreview, setFilePreview] = useState({ document: null, justificatif: null });

  const API_BASE_URL = import.meta.env.VITE_API_URL;

  // Timer pour le code de modification
  useEffect(() => {
    if (timeLeft <= 0) return;
    
    const interval = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    
    return () => clearInterval(interval);
  }, [timeLeft]);

  // Utilitaires - Mémorisés pour éviter les re-créations
  const formatTime = useCallback((seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, []);

  const showMessage = useCallback((type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
  }, []);

  // Gestionnaires d'événements - Tous mémorisés avec useCallback
  const handlePublicIdChange = useCallback((e) => {
    setPublicId(e.target.value.toUpperCase());
  }, []);

  const handleEditCodeChange = useCallback((e) => {
    setEditCode(e.target.value.toUpperCase());
  }, []);

  const handleRequestEditCode = useCallback(async () => {
    if (!publicId.trim()) {
      showMessage('error', 'Veuillez saisir votre code de suivi');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/kyc/${publicId}/send-edit-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await response.json();

      if (response.ok) {
        setTimeLeft(15 * 60);
        setCurrentStep(STEPS.CODE_VALIDATION);
        showMessage('success', data.message || 'Code de modification envoyé par email');
      } else {
        showMessage('error', data.error || 'Erreur lors de l\'envoi du code');
      }
    } catch (error) {
      showMessage('error', 'Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
  }, [publicId, API_BASE_URL, showMessage]);

  const handleValidateCode = useCallback(async () => {
    if (!editCode.trim() || editCode.length !== 6) {
      showMessage('error', 'Veuillez saisir un code à 6 caractères');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/kyc/${publicId}`, {
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        const kycInfo = await response.json();
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
        setCurrentStep(STEPS.MODIFICATION);
        showMessage('success', 'Code validé avec succès');
      } else {
        const errorData = await response.json();
        showMessage('error', errorData.error || 'Erreur lors de la récupération des données');
      }
    } catch (error) {
      showMessage('error', 'Code invalide ou erreur de connexion');
    } finally {
      setLoading(false);
    }
  }, [editCode, publicId, API_BASE_URL, showMessage]);

  // Gestionnaire optimisé pour les changements de formulaire
  const handleInputChange = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  // Créer des fonctions spécifiques pour chaque champ
  const handleNomChange = useCallback((e) => handleInputChange('nom', e.target.value), [handleInputChange]);
  const handlePrenomsChange = useCallback((e) => handleInputChange('prenoms', e.target.value), [handleInputChange]);
  const handleSexChange = useCallback((e) => handleInputChange('sex', e.target.value), [handleInputChange]);
  const handleDateNaissanceChange = useCallback((e) => handleInputChange('dateNaissance', e.target.value), [handleInputChange]);
  const handleNationaliteChange = useCallback((e) => handleInputChange('nationalite', e.target.value), [handleInputChange]);
  const handleAddressChange = useCallback((e) => handleInputChange('address', e.target.value), [handleInputChange]);
  const handleTelephoneChange = useCallback((e) => handleInputChange('telephone', e.target.value), [handleInputChange]);
  const handleEmailChange = useCallback((e) => handleInputChange('email', e.target.value), [handleInputChange]);
  const handleDocumentTypeChange = useCallback((e) => handleInputChange('documentType', e.target.value), [handleInputChange]);
  const handleDocumentIdChange = useCallback((e) => handleInputChange('documentId', e.target.value), [handleInputChange]);
  const handleJustificatifTypeChange = useCallback((e) => handleInputChange('justificatifType', e.target.value), [handleInputChange]);
  const handleJustificatifIdChange = useCallback((e) => handleInputChange('justificatifId', e.target.value), [handleInputChange]);

  const handleFileChange = useCallback((type, file) => {
    if (!file) return;

    const maxSize = 5 * 1024 * 1024;
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
    
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFilePreview(prev => ({ ...prev, [type]: e.target.result }));
      };
      reader.readAsDataURL(file);
    } else {
      setFilePreview(prev => ({ ...prev, [type]: 'pdf' }));
    }
  }, [showMessage]);

  const removeFile = useCallback((type) => {
    setFiles(prev => ({ ...prev, [type]: null }));
    setFilePreview(prev => ({ ...prev, [type]: null }));
  }, []);

  const handleSubmitModification = useCallback(async () => {
    setLoading(true);
    try {
      const formDataToSend = new FormData();

      formDataToSend.append('editCode', editCode);
      
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });

      if (files.document) formDataToSend.append('document', files.document);
      if (files.justificatif) formDataToSend.append('justificatif', files.justificatif);

      console.log("formDataToSend : ", editCode)
      const response = await fetch(`${API_BASE_URL}/kyc/${publicId}`, {
        method: 'PUT',
        body: formDataToSend,
      });

      const data = await response.json();

      if (response.ok) {
        showMessage('success', data.message || 'Modifications enregistrées avec succès');
        setTimeout(() => {
          window.location.href = '/tracking';
        }, 2000);
      } else {
        showMessage('error', data.error || 'Erreur lors de la sauvegarde');
      }
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
      showMessage('error', 'Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
  }, [formData, files, publicId, API_BASE_URL, showMessage]);

  const handleBackClick = useCallback(() => {
    window.history.back();
  }, []);

  // Composants mémorisés pour éviter les re-rendus
  const StepHeader = useMemo(() => {
    return ({ icon: Icon, title, subtitle }) => (
      <div className="step-header">
        <div className="step-icon">
          <Icon className="icon" />
        </div>
        <h2>{title}</h2>
        <p>{subtitle}</p>
      </div>
    );
  }, []);

  const FormInput = useMemo(() => {
    return ({ label, children, help }) => (
      <div className="form-group">
        <label>{label}</label>
        {children}
        {help && <small>{help}</small>}
      </div>
    );
  }, []);

  const FileUpload = useCallback(({ type, label, accept = "image/*,.pdf" }) => {
    const handleDocumentFileChange = useCallback((e) => {
      handleFileChange(type, e.target.files[0]);
    }, [type]);

    const handleRemoveFile = useCallback(() => {
      removeFile(type);
    }, [type]);

    return (
      <div className="file-upload-section">
        <label className="file-upload-label">{label}</label>
        <div className="file-upload-area">
          {!files[type] && !filePreview[type] ? (
            <label className="file-upload-button">
              <input
                type="file"
                accept={accept}
                onChange={handleDocumentFileChange}
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
                  onClick={handleRemoveFile}
                  className="btn-remove"
                >
                  <X className="icon" />
                </button>
                <label className="btn-change">
                  <input
                    type="file"
                    accept={accept}
                    onChange={handleDocumentFileChange}
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
  }, [files, filePreview, handleFileChange, removeFile]);

  // Message mémorisé
  const MessageComponent = useMemo(() => {
    if (!message.text) return null;
    
    return (
      <div className={`message message-${message.type}`} role="alert">
        {message.type === 'success' ? <CheckCircle className="icon" /> : <AlertCircle className="icon" />}
        {message.text}
      </div>
    );
  }, [message]);

  // Rendu des étapes - Mémorisés pour éviter les re-créations
  const step1Content = useMemo(() => (
    <div className="step-content">
      <StepHeader 
        icon={Shield}
        title="Vérification d'identité"
        subtitle="Saisissez votre code de suivi pour demander les modifications"
      />

      <FormInput 
        label="Code de suivi KYC"
        help="Format: KYC-MAHABO-YYYYMMDD-XXXXXX"
      >
        <div className="input-wrapper">
          <input
            type="text"
            value={publicId}
            onChange={handlePublicIdChange}
            placeholder="KYC-MAHABO-20240526-ABC123"
            className="form-input"
          />
          <FileText className="input-icon" />
        </div>
      </FormInput>

      <button 
        className="btn btn-primary"
        onClick={handleRequestEditCode}
        disabled={loading || !publicId.trim()}
      >
        {loading ? <RefreshCw className="icon spinning" /> : <Send className="icon" />}
        {loading ? 'Envoi en cours...' : 'Demander le code de modification'}
      </button>
    </div>
  ), [publicId, loading, handlePublicIdChange, handleRequestEditCode, StepHeader, FormInput]);

  const step2Content = useMemo(() => (
    <div className="step-content">
      <StepHeader 
        icon={Clock}
        title="Validation du code de modification"
        subtitle="Saisissez le code reçu par email"
      />

      <div className="timer-display">
        <Clock className="icon" />
        <span>Temps restant: {formatTime(timeLeft)}</span>
      </div>

      <FormInput 
        label="Code de modification"
        help="Code à 6 caractères reçu par email"
      >
        <div className="input-wrapper">
          <input
            type="text"
            value={editCode}
            onChange={handleEditCodeChange}
            placeholder="A1B2C3"
            className="form-input code-input"
            maxLength="6"
          />
          <Shield className="input-icon" />
        </div>
      </FormInput>

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
  ), [editCode, timeLeft, loading, handleEditCodeChange, handleValidateCode, handleRequestEditCode, formatTime, StepHeader, FormInput]);

  const step3Content = useMemo(() => (
    <div className="step-content">
      <StepHeader 
        icon={Edit3}
        title="Modification des informations"
        subtitle="Modifiez les informations nécessaires"
      />

      <div className="form-sections">
        {/* Informations personnelles */}
        <section className="form-section">
          <h3><User className="icon" />Informations personnelles</h3>
          
          <div className="form-row">
            <FormInput label="Nom">
              <input
                type="text"
                value={formData.nom}
                onChange={handleNomChange}
                className="form-input"
                required
              />
            </FormInput>
            
            <FormInput label="Prénoms">
              <input
                type="text"
                value={formData.prenoms}
                onChange={handlePrenomsChange}
                className="form-input"
                required
              />
            </FormInput>
          </div>

          <div className="form-row">
            <FormInput label="Sexe">
              <select
                value={formData.sex}
                onChange={handleSexChange}
                className="form-select"
                required
              >
                <option value="">Sélectionner</option>
                <option value="M">Masculin</option>
                <option value="F">Féminin</option>
              </select>
            </FormInput>
            
            <FormInput label="Date de naissance">
              <div className="input-wrapper">
                <input
                  type="date"
                  value={formData.dateNaissance}
                  onChange={handleDateNaissanceChange}
                  className="form-input"
                  required
                />
                <Calendar className="input-icon" />
              </div>
            </FormInput>
          </div>

          <FormInput label="Nationalité">
            <div className="input-wrapper">
              <input
                type="text"
                value={formData.nationalite}
                onChange={handleNationaliteChange}
                className="form-input"
                required
              />
              <Flag className="input-icon" />
            </div>
          </FormInput>

          <FormInput label="Adresse">
            <div className="input-wrapper">
              <textarea
                value={formData.address}
                onChange={handleAddressChange}
                className="form-textarea"
                rows="3"
                required
              />
              <MapPin className="input-icon" />
            </div>
          </FormInput>

          <div className="form-row">
            <FormInput label="Téléphone">
              <div className="input-wrapper">
                <input
                  type="tel"
                  value={formData.telephone}
                  onChange={handleTelephoneChange}
                  className="form-input"
                  required
                />
                <Phone className="input-icon" />
              </div>
            </FormInput>
            
            <FormInput label="Email">
              <div className="input-wrapper">
                <input
                  type="email"
                  value={formData.email}
                  onChange={handleEmailChange}
                  className="form-input"
                  required
                />
                <Mail className="input-icon" />
              </div>
            </FormInput>
          </div>
        </section>

        {/* Documents d'identité */}
        <section className="form-section">
          <h3><FileText className="icon" />Documents d'identité</h3>
          
          <div className="form-row">
            <FormInput label="Type de document">
              <select
                value={formData.documentType}
                onChange={handleDocumentTypeChange}
                className="form-select"
                required
              >
                <option value="">Sélectionner</option>
                {DOCUMENT_TYPES.map(({ value, label }) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </FormInput>
            
            <FormInput label="Numéro du document">
              <input
                type="text"
                value={formData.documentId}
                onChange={handleDocumentIdChange}
                className="form-input"
                required
              />
            </FormInput>
          </div>

          <FileUpload type="document" label="Document d'identité" />

          <div className="form-row">
            <FormInput label="Type de justificatif">
              <select
                value={formData.justificatifType}
                onChange={handleJustificatifTypeChange}
                className="form-select"
                required
              >
                <option value="">Sélectionner</option>
                {JUSTIFICATIF_TYPES.map(({ value, label }) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </FormInput>
            
            <FormInput label="Référence du justificatif">
              <input
                type="text"
                value={formData.justificatifId}
                onChange={handleJustificatifIdChange}
                className="form-input"
                required
              />
            </FormInput>
          </div>

          <FileUpload type="justificatif" label="Justificatif de domicile" />
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
  ), [formData, loading, handleSubmitModification, FileUpload, StepHeader, FormInput,
      handleNomChange, handlePrenomsChange, handleSexChange, handleDateNaissanceChange,
      handleNationaliteChange, handleAddressChange, handleTelephoneChange, handleEmailChange,
      handleDocumentTypeChange, handleDocumentIdChange, handleJustificatifTypeChange, handleJustificatifIdChange]);

  const Sidebar = useMemo(() => (
    <aside className="sidebarKYCModification">
      <div className="help-section">
        <h3>Instructions</h3>
        <div className="help-steps">
          {[
            { step: 1, title: 'Saisir le code de suivi', desc: 'Utilisez le code reçu lors de votre demande initiale' },
            { step: 2, title: 'Valider le code de modification', desc: 'Saisissez le code reçu par email (valide 15 min)' },
            { step: 3, title: 'Modifier vos informations', desc: 'Corrigez les données nécessaires et soumettez' }
          ].map(({ step, title, desc }) => (
            <div key={step} className={`help-step ${currentStep >= step ? 'active' : ''}`}>
              <div className="help-step-number">{step}</div>
              <div className="help-step-content">
                <h4>{title}</h4>
                <p>{desc}</p>
              </div>
            </div>
          ))}
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
  ), [currentStep]);

  return (
    <div id='kyc-modification' className="kyc-modification">
      <header className="page-header">
        <div style={{paddingTop:'100px'}} className="container">
          <button className="back-button" onClick={handleBackClick}>
            <ArrowLeft className="icon" />
            Retour
          </button>
          
          <div className="header-content">
            <h1>Modification de demande KYC</h1>
          </div>
        </div>
      </header>

      <div className="content-grid">
        <div className="form-section">
          {MessageComponent}
          {currentStep === STEPS.VERIFICATION && step1Content}
          {currentStep === STEPS.CODE_VALIDATION && step2Content}
          {currentStep === STEPS.MODIFICATION && step3Content}
        </div>
        {Sidebar}
      </div>
    </div>
  );
};

export default KYCModificationSection;