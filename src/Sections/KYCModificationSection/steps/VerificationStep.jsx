import React from 'react';
import { Shield, FileText, Send, RefreshCw } from 'lucide-react';
import { StepHeader } from '../common/StepHeader';
import { FormInput } from '../common/FormInput';

export const VerificationStep = ({ 
  publicId, 
  loading, 
  onPublicIdChange, 
  onRequestEditCode 
}) => {
  return (
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
            onChange={(e) => onPublicIdChange(e.target.value.toUpperCase())}
            placeholder="KYC-MAHABO-20240526-ABC123"
            className="form-input"
          />
          <FileText className="input-icon" />
        </div>
      </FormInput>

      <button 
        className="btn btn-primary"
        onClick={onRequestEditCode}
        disabled={loading || !publicId.trim()}
      >
        {loading ? <RefreshCw className="icon spinning" /> : <Send className="icon" />}
        {loading ? 'Envoi en cours...' : 'Demander le code de modification'}
      </button>
    </div>
  );
};