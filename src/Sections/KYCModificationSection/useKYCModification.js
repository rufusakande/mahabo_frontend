import { useState, useEffect, useCallback } from 'react';

export const useKYCModification = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [publicId, setPublicId] = useState('');
  const [editCode, setEditCode] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);
  const [kycData, setKycData] = useState(null);
  const [formData, setFormData] = useState({
    nom: '', prenoms: '', sex: '', dateNaissance: '', nationalite: '',
    address: '', telephone: '', email: '', documentId: '', documentType: '',
    justificatifId: '', justificatifType: ''
  });
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

  const formatTime = useCallback((seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, []);

  const showMessage = useCallback((type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
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
        setCurrentStep(2);
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
        setCurrentStep(3);
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
  }, [formData, files, publicId, editCode, API_BASE_URL, showMessage]);

  return {
    // States
    currentStep,
    loading,
    message,
    publicId,
    editCode,
    timeLeft,
    kycData,
    formData,
    files,
    filePreview,
    
    // Setters
    setPublicId,
    setEditCode,
    setFormData,
    setFiles,
    setFilePreview,
    
    // Methods
    formatTime,
    showMessage,
    handleRequestEditCode,
    handleValidateCode,
    handleSubmitModification
  };
};
