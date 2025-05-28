import React, { useCallback } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useKYCModification } from './useKYCModification';
import { Message } from './common/Message';
import { VerificationStep } from './steps/VerificationStep';
import { CodeValidationStep } from './steps/CodeValidationStep';
import { ModificationStep } from './steps/ModificationStep';
import { Sidebar } from './Sidebar';
import './KYCModificationSection.css';

const KYCModificationSection = () => {
  const {
    currentStep,
    loading,
    message,
    publicId,
    editCode,
    timeLeft,
    formData,
    files,
    filePreview,
    setPublicId,
    setEditCode,
    setFormData,
    setFiles,
    setFilePreview,
    formatTime,
    showMessage,
    handleRequestEditCode,
    handleValidateCode,
    handleSubmitModification
  } = useKYCModification();

  const handleBackClick = useCallback(() => {
    window.history.back();
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
  }, [showMessage, setFiles, setFilePreview]);

  const handleRemoveFile = useCallback((type) => {
    setFiles(prev => ({ ...prev, [type]: null }));
    setFilePreview(prev => ({ ...prev, [type]: null }));
  }, [setFiles, setFilePreview]);

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <VerificationStep
            publicId={publicId}
            loading={loading}
            onPublicIdChange={setPublicId}
            onRequestEditCode={handleRequestEditCode}
          />
        );
      case 2:
        return (
          <CodeValidationStep
            editCode={editCode}
            timeLeft={timeLeft}
            loading={loading}
            formatTime={formatTime}
            onEditCodeChange={setEditCode}
            onValidateCode={handleValidateCode}
            onRequestEditCode={handleRequestEditCode}
          />
        );
      case 3:
        return (
          <ModificationStep
            formData={formData}
            files={files}
            filePreview={filePreview}
            loading={loading}
            onFormDataChange={setFormData}
            onFileChange={handleFileChange}
            onRemoveFile={handleRemoveFile}
            onSubmitModification={handleSubmitModification}
          />
        );
      default:
        return null;
    }
  };

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
          <Message message={message} />
          {renderCurrentStep()}
        </div>
        <Sidebar currentStep={currentStep} />
      </div>
    </div>
  );
};

export default KYCModificationSection;