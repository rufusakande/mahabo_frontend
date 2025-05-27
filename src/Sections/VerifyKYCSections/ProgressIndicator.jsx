import React from 'react';
import { User, FileText, CheckCircle, Check } from 'lucide-react';

const ProgressIndicator = ({ currentStep }) => (
  <div id="progressIndicator" className="progress-indicator">
    <div className="progress-steps">
      <div className={`step ${currentStep >= 1 ? 'active' : ''} ${currentStep > 1 ? 'completed' : ''}`}>
        <div className="step-icon">
          {currentStep > 1 ? <Check size={16} /> : <User size={16} />}
        </div>
        <span className="step-label">Informations</span>
      </div>
      
      <div className="progress-line"></div>
      
      <div className={`step ${currentStep >= 2 ? 'active' : ''} ${currentStep > 2 ? 'completed' : ''}`}>
        <div className="step-icon">
          {currentStep > 2 ? <Check size={16} /> : <FileText size={16} />}
        </div>
        <span className="step-label">Documents</span>
      </div>
      
      <div className="progress-line"></div>
      
      <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>
        <div className="step-icon">
          <CheckCircle size={16} />
        </div>
        <span className="step-label">Récapitulatif</span>
      </div>
    </div>
  </div>
);

export default ProgressIndicator;