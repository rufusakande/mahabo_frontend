import React from 'react';
import { Shield } from 'lucide-react';

export const Sidebar = ({ currentStep }) => (
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