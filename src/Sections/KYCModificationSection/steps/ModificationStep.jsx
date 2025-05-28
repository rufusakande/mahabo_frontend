import React from 'react';
import { Edit3, CheckCircle, RefreshCw } from 'lucide-react';
import { StepHeader } from '../common/StepHeader';
import { PersonalInfoForm } from '../forms/PersonalInfoForm';
import { DocumentsForm } from '../forms/DocumentsForm';

export const ModificationStep = ({ 
  formData, 
  files, 
  filePreview, 
  loading,
  onFormDataChange, 
  onFileChange, 
  onRemoveFile, 
  onSubmitModification 
}) => {
  return (
    <div className="step-content">
      <StepHeader 
        icon={Edit3}
        title="Modification des informations"
        subtitle="Modifiez les informations nécessaires"
      />

      <div id='form-section-kyc-modification' className="form-sections">
        <PersonalInfoForm 
          formData={formData}
          onFormDataChange={onFormDataChange}
        />

        <DocumentsForm 
          formData={formData}
          files={files}
          filePreview={filePreview}
          onFormDataChange={onFormDataChange}
          onFileChange={onFileChange}
          onRemoveFile={onRemoveFile}
        />
      </div>

      <div className="form-actions">
        <button 
          className="btn btn-primary btn-large"
          onClick={onSubmitModification}
          disabled={loading}
        >
          {loading ? <RefreshCw className="icon spinning" /> : <CheckCircle className="icon" />}
          {loading ? 'Enregistrement...' : 'Enregistrer les modifications'}
        </button>
      </div>
    </div>
  );
};