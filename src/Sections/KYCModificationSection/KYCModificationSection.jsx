import React, { useState, useEffect, useCallback } from 'react';
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

  // Utilitaires
  const formatTime = useCallback((seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, []);

  const showMessage = useCallback((type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
  }, []);

  // Gestionnaires d'événements
  const handleRequestEditCode = async () => {
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
  };

  const handleValidateCode = async () => {
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
  };

  const handleInputChange = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

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

  const handleSubmitModification = async () => {
    setLoading(true);
    try {
      const formDataToSend = new FormData();
      
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });

      if (files.document) formDataToSend.append('document', files.document);
      if (files.justificatif) formDataToSend.append('justificatif', files.justificatif);

      const response = await fetch(`${API_BASE_URL}/kyc/${publicId}`, {
        method: 'PUT',
        body: formDataToSend,
      });

      const data = await response.json();

      if (response.ok) {
        showMessage('success', data.message || 'Modifications enregistrées avec succès');
        setTimeout(() => {
          window.location.href = '/suivi';
        }, 2000);
      } else {
        showMessage('error', data.error || 'Erreur lors de la sauvegarde');
      }
    } catch (error) {
      showMessage('error', 'Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
  };

  // Composants de rendu
  const StepHeader = ({ icon: Icon, title, subtitle }) => (
    <div className="step-header">
      <div className="step-icon">
        <Icon className="icon" />
      </div>
      <h2>{title}</h2>
      <p>{subtitle}</p>
    </div>
  );

  const FormInput = ({ label, children, help }) => (
    <div className="form-group">
      <label>{label}</label>
      {children}
      {help && <small>{help}</small>}
    </div>
  );

  const FileUpload = ({ type, label, accept = "image/*,.pdf" }) => (
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
                className="btn-remove"
              >
                <X className="icon" />
              </button>
              <label className="btn-change">
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

  const Message = () => message.text && (
    <div className={`message message-${message.type}`} role="alert">
      {message.type === 'success' ? <CheckCircle className="icon" /> : <AlertCircle className="icon" />}
      {message.text}
    </div>
  );

  // Rendu des étapes
  const renderStep1 = () => (
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
            onChange={(e) => setPublicId(e.target.value.toUpperCase())}
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
  );

  const renderStep2 = () => (
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
            onChange={(e) => setEditCode(e.target.value.toUpperCase())}
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
  );

  const renderStep3 = () => (
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
                onChange={(e) => handleInputChange('nom', e.target.value)}
                className="form-input"
                required
              />
            </FormInput>
            
            <FormInput label="Prénoms">
              <input
                type="text"
                value={formData.prenoms}
                onChange={(e) => handleInputChange('prenoms', e.target.value)}
                className="form-input"
                required
              />
            </FormInput>
          </div>

          <div className="form-row">
            <FormInput label="Sexe">
              <select
                value={formData.sex}
                onChange={(e) => handleInputChange('sex', e.target.value)}
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
                  onChange={(e) => handleInputChange('dateNaissance', e.target.value)}
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
                onChange={(e) => handleInputChange('nationalite', e.target.value)}
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
                onChange={(e) => handleInputChange('address', e.target.value)}
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
                  onChange={(e) => handleInputChange('telephone', e.target.value)}
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
                  onChange={(e) => handleInputChange('email', e.target.value)}
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
                onChange={(e) => handleInputChange('documentType', e.target.value)}
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
                onChange={(e) => handleInputChange('documentId', e.target.value)}
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
                onChange={(e) => handleInputChange('justificatifType', e.target.value)}
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
                onChange={(e) => handleInputChange('justificatifId', e.target.value)}
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
  );

  const Sidebar = () => (
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
  );

  return (
    <div id='kyc-modification' className="kyc-modification">
      <header className="page-header">
        <div style={{paddingTop:'100px'}} className="container">
          <button className="back-button" onClick={() => window.history.back()}>
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
              <Message />
              {currentStep === STEPS.VERIFICATION && renderStep1()}
              {currentStep === STEPS.CODE_VALIDATION && renderStep2()}
              {currentStep === STEPS.MODIFICATION && renderStep3()}
            </div>
            <Sidebar />
          </div>
    </div>
  );
};

export default KYCModificationSection;