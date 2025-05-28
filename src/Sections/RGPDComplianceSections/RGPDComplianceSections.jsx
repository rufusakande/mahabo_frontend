import React from 'react';
import './RGPDComplianceSections.css';
import { ShieldCheck, BookText, Landmark, UserCog, Lock, Send, Mail } from 'lucide-react';

const RGPDComplianceSections = () => {
  return (
    <section className="rgpd-compliance">
      <div className="rgpd-container">
        <h1>Conformité au RGPD</h1>

        <div className="rgpd-section">
          <h2><ShieldCheck size={20} /> Finalité</h2>
          <p>
            La collecte de vos données personnelles est effectuée exclusivement dans le cadre des procédures de vérification d’identité (KYC) conformément au RGPD.
          </p>
        </div>

        <div className="rgpd-section">
          <h2><BookText size={20} /> Base légale</h2>
          <p>Le traitement est basé sur :</p>
          <ul>
            <li>Votre consentement explicite</li>
            <li>Une obligation légale imposée à MAHABO</li>
            <li>L’intérêt légitime de MAHABO à sécuriser ses services</li>
          </ul>
        </div>

        <div className="rgpd-section">
          <h2><UserCog size={20} /> Vos droits</h2>
          <p>En tant que personne concernée, vous disposez des droits suivants :</p>
          <ul>
            <li>Droit d’accès</li>
            <li>Droit de rectification</li>
            <li>Droit à l’effacement (« droit à l’oubli »)</li>
            <li>Droit à la limitation du traitement</li>
            <li>Droit à la portabilité des données</li>
            <li>Droit d’opposition</li>
          </ul>
        </div>

        <div className="rgpd-section">
          <h2><Lock size={20} /> Sécurité et confidentialité</h2>
          <p>
            Nous mettons en place des mesures de sécurité techniques et organisationnelles pour garantir la confidentialité, l'intégrité et la disponibilité de vos données personnelles.
          </p>
        </div>

        <div className="rgpd-section">
          <h2><Send size={20} /> Transfert de données</h2>
          <p>
            Aucune donnée n’est transférée en dehors de l’Union européenne sans un niveau de protection équivalent garanti.
          </p>
        </div>

        <div className="rgpd-section">
          <h2><Mail size={20} /> Délégué à la protection des données</h2>
          <p>
            Pour toute question relative à la protection de vos données, vous pouvez nous contacter à <strong>tamkoti@yahoo.fr</strong>
          </p>
        </div>
      </div>
    </section>
  );
};

export default RGPDComplianceSections;
