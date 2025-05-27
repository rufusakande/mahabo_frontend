import React from 'react';
import { AlertCircle } from 'lucide-react';

const ErrorModal = ({ showError, errorMessage, setShowError }) => (
  <div id="errorModal" className={`modal-overlay ${showError ? 'show' : ''}`}>
    <div className="modal-content error-modal">
      <div className="error-icon">
        <AlertCircle size={64} />
      </div>
      <h2>Erreur lors de l'envoi</h2>
      <p>{errorMessage}</p>
      
      <button className="btn btn-secondary" onClick={() => setShowError(false)}>
        Fermer
      </button>
    </div>
  </div>
);

export default ErrorModal;