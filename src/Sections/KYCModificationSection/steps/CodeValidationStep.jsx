import React from 'react';
import { Clock, Shield, CheckCircle, RefreshCw } from 'lucide-react';
import { StepHeader } from '../common/StepHeader';
import { FormInput } from '../common/FormInput';

export const CodeValidationStep = ({ 
  editCode, 
  timeLeft, 
  loading, 
  formatTime,
  onEditCodeChange, 
  onValidateCode, 
  onRequestEditCode 
}) => {
  return (
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
            onChange={(e) => onEditCodeChange(e.target.value.toUpperCase())}
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
          onClick={onValidateCode}
          disabled={loading || editCode.length !== 6 || timeLeft === 0}
        >
          {loading ? <RefreshCw className="icon spinning" /> : <CheckCircle className="icon" />}
          {loading ? 'Validation...' : 'Valider le code'}
        </button>

        <button 
          className="btn btn-secondary"
          onClick={onRequestEditCode}
          disabled={loading}
        >
          <RefreshCw className="icon" />
          Renvoyer le code
        </button>
      </div>
    </div>
  );
};