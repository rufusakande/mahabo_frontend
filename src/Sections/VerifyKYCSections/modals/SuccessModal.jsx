import React from 'react';
import { CheckCircle } from 'lucide-react';

const SuccessModal = ({ showSuccess, verificationCode, setShowSuccess, resetForm }) => (
  <div id="successModal" className={`modal-overlay ${showSuccess ? 'show' : ''}`}>
    <div className="modal-content">
      <div className="success-icon">
        <CheckCircle size={64} />
      </div>
      <h2>Demande Envoyée avec Succès !</h2>
      <p>Votre demande de vérification d'identité a été soumise avec succès.</p>
      
      <div className="verification-code">
        <h3>Votre code de suivi :</h3>
        <div className="code-display">{verificationCode}</div>
        <p>Conservez ce code pour suivre l'état de votre demande</p>
      </div>
      
      <div className="next-steps">
        <h4>Prochaines étapes :</h4>
        <ul>
          <li>Vous recevrez un email de confirmation</li>
          <li>Votre demande sera traitée sous 24-48h</li>
          <li>Utilisez votre code de suivi pour vérifier le statut</li>
        </ul>
      </div>
      
      <button className="btn btn-primary" onClick={() => {
        setShowSuccess(false);
        resetForm();
      }}>
        Compris
      </button>
    </div>
  </div>
);

export default SuccessModal;