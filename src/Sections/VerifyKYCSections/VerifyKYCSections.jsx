// 📁 components/KYC/VerifyKYCForm.jsx
import React, { useState } from 'react';
import { Loader, Send, ArrowLeft, ArrowRight } from 'lucide-react';
import StepOne from './steps/StepOne';
import StepTwo from './steps/StepTwo';
import StepThree from './steps/StepThree';
import ProgressIndicator from './ProgressIndicator';
import SuccessModal from './modals/SuccessModal';
import ErrorModal from './modals/ErrorModal';
import { validateStep } from './validation';
import { submitKYCForm } from './kycService';
import './VerifyKYCSections.css';

const VerifyKYCForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    sex: '',
    birthDate: '',
    address: '',
    nationality: '',
    phone: '',
    email: '',
    idType: '',
    idNumber: '',
    idFile: null,
    addressDocType: '',
    justificatifId: '',
    addressFile: null
  });

  const [errors, setErrors] = useState({});

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      sex: '',
      birthDate: '',
      address: '',
      nationality: '',
      phone: '',
      email: '',
      idType: '',
      idNumber: '',
      idFile: null,
      addressDocType: '',
      justificatifId: '',
      addressFile: null
    });
    setCurrentStep(1);
    setErrors({});
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleFileChange = (field, file) => {
    setFormData(prev => ({ ...prev, [field]: file }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const nextStep = () => {
    const stepErrors = validateStep(currentStep, formData);
    setErrors(stepErrors);
    
    if (Object.keys(stepErrors).length === 0) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    
    try {
      const result = await submitKYCForm(formData);
      const code = result.publicId ;
      
      setVerificationCode(code);
      setShowSuccess(true);
      
    } catch (error) {
      console.error('Erreur lors de l\'envoi:', error);
      setErrorMessage(error.message || 'Une erreur inattendue s\'est produite');
      setShowError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <StepOne 
            formData={formData} 
            errors={errors} 
            handleInputChange={handleInputChange} 
          />
        );
      case 2:
        return (
          <StepTwo 
            formData={formData} 
            errors={errors} 
            handleInputChange={handleInputChange}
            handleFileChange={handleFileChange}
          />
        );
      case 3:
        return <StepThree formData={formData} />;
      default:
        return null;
    }
  };

  return (
    <div id="kycForm">
      <div className="container">
        <div className="form-container">
          <div className="form-header">
            <h1>Demande de Vérification d'Identité</h1>
            <p>Complétez votre processus de vérification en quelques étapes simples</p>
          </div>

          <ProgressIndicator currentStep={currentStep} />

          <div className="form-content">
            {renderCurrentStep()}
          </div>

          <div className="form-actions">
            {currentStep > 1 && (
              <button 
                className="btn btn-secondary" 
                onClick={prevStep}
                disabled={isLoading}
              >
                <ArrowLeft size={18} />
                Précédent
              </button>
            )}
            
            {currentStep < 3 ? (
              <button className="btn btn-primary" onClick={nextStep}>
                Suivant
                <ArrowRight size={18} />
              </button>
            ) : (
              <button 
                className="btn btn-success" 
                onClick={handleSubmit}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader size={18} className="spinning" />
                    Envoi en cours...
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    Envoyer ma Demande
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      <SuccessModal 
        showSuccess={showSuccess} 
        verificationCode={verificationCode} 
        setShowSuccess={setShowSuccess}
        resetForm={resetForm}
      />

      <ErrorModal 
        showError={showError}
        errorMessage={errorMessage}
        setShowError={setShowError}
      />
    </div>
  );
};

export default VerifyKYCForm;