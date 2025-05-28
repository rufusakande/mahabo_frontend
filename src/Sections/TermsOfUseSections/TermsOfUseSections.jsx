import React from 'react';
import './TermsOfUseSections.css';
import { ShieldCheck, FileText, UserCheck, AlertTriangle, BookOpen, RefreshCcw, Globe } from 'lucide-react';

const TermsOfUseSections = () => {
  return (
    <section className="terms-of-use">
      <div className="terms-container">
        <h1>Conditions d'utilisation</h1>

        <div className="terms-section">
          <h2><ShieldCheck size={20} /> Acceptation</h2>
          <p>
            En accédant au site <strong>https://kyc.mahabow.com</strong>, vous acceptez sans réserve les présentes conditions générales d'utilisation.
          </p>
        </div>

        <div className="terms-section">
          <h2><FileText size={20} /> Objet</h2>
          <p>
            Le site permet aux utilisateurs de soumettre des demandes de vérification d’identité (KYC) dans le cadre des activités professionnelles de MAHABO.
          </p>
        </div>

        <div className="terms-section">
          <h2><UserCheck size={20} /> Utilisation responsable</h2>
          <p>Vous vous engagez à :</p>
          <ul>
            <li>Fournir des informations exactes et complètes</li>
            <li>Ne pas soumettre de documents falsifiés</li>
            <li>Respecter la législation en vigueur</li>
          </ul>
        </div>

        <div className="terms-section">
          <h2><AlertTriangle size={20} /> Responsabilité</h2>
          <p>MAHABO décline toute responsabilité en cas :</p>
          <ul>
            <li>D’usage frauduleux des informations envoyées</li>
            <li>D’interruption du site due à des problèmes techniques</li>
            <li>D’accès non autorisé à votre compte ou à vos fichiers</li>
          </ul>
        </div>

        <div className="terms-section">
          <h2><BookOpen size={20} /> Propriété intellectuelle</h2>
          <p>
            Tous les contenus du site (textes, images, logos, logiciels) sont la propriété exclusive de MAHABO.
          </p>
        </div>

        <div className="terms-section">
          <h2><RefreshCcw size={20} /> Modification des conditions</h2>
          <p>
            MAHABO se réserve le droit de modifier les présentes conditions à tout moment. Les modifications seront publiées sur cette page.
          </p>
        </div>

        <div className="terms-section">
          <h2><Globe size={20} /> Droit applicable</h2>
          <p>
            Les présentes conditions sont régies par le droit béninois.
          </p>
        </div>
      </div>
    </section>
  );
};

export default TermsOfUseSections;