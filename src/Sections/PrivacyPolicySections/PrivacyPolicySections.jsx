import React from 'react';
import './PrivacyPolicySections.css';
import { ShieldCheck, Info, FileText, UserCheck, Lock, Clock, Mail, Users } from 'lucide-react';

const PrivacyPolicySections = () => {
  return (
    <section className="privacy-policy">
      <div className="privacy-container">
        <h1>Politique de confidentialité</h1>

        <div className="policy-section">
          <h2><Info size={20} /> Introduction</h2>
          <p>MAHABO respecte votre vie privée et s'engage à protéger vos données personnelles.</p>
          <p>Cette politique décrit comment nous utilisons vos données via <strong>https://kyc.mahabow.com</strong>.</p>
        </div>

        <div className="policy-section">
          <h2><FileText size={20} /> Données collectées</h2>
          <ul>
            <li>Informations d'identité</li>
            <li>Coordonnées</li>
            <li>Informations de vérification</li>
            <li>Fichiers téléchargés</li>
          </ul>
        </div>

        <div className="policy-section">
          <h2><UserCheck size={20} /> Utilisation des données</h2>
          <ul>
            <li>Vérifier votre identité (KYC)</li>
            <li>Communiquer avec vous</li>
            <li>Conformité légale</li>
          </ul>
        </div>

        <div className="policy-section">
          <h2><Users size={20} /> Partage des données</h2>
          <ul>
            <li>Équipe interne</li>
            <li>Autorités compétentes</li>
            <li>Partenaires techniques</li>
          </ul>
        </div>

        <div className="policy-section">
          <h2><Lock size={20} /> Sécurité des données</h2>
          <p>Les données sont protégées contre l’accès non autorisé ou la destruction.</p>
        </div>

        <div className="policy-section">
          <h2><Clock size={20} /> Conservation</h2>
          <p>Les données sont conservées selon la durée requise par la loi.</p>
        </div>

        <div className="policy-section">
          <h2><ShieldCheck size={20} /> Vos droits</h2>
          <p>Accès, correction, suppression, opposition – vous pouvez exercer vos droits à <strong>tamkoti@yahoo.fr</strong></p>
        </div>

        <div className="policy-section contact-info">
          <h2><Mail size={20} /> Contact</h2>
          <address>
            <p><strong>MAHABO</strong></p>
            <p>BP 969 Parakou, Bénin</p>
            <p>Tél : +229 97 73 82 24 / 95 09 19 91</p>
            <p>Email : <a href="mailto:tamkoti@yahoo.fr">tamkoti@yahoo.fr</a></p>
          </address>
        </div>
      </div>
    </section>
  );
};

export default PrivacyPolicySections;
