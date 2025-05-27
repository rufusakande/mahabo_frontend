import React from 'react';
import { FileText, Home } from 'lucide-react';

const StepThree = ({ formData }) => (
  <div id="stepThree" className="form-step">
    <div className="step-header">
      <h2>Récapitulatif de votre Demande</h2>
      <p>Vérifiez toutes vos informations avant de soumettre votre demande</p>
    </div>

    <div className="summary-section">
      <div className="info-summary">
        <h3>Informations Personnelles</h3>
        <div className="summary-grid">
          <div className="summary-item">
            <strong>Nom complet :</strong>
            <span>{formData.firstName} {formData.lastName}</span>
          </div>
          <div className="summary-item">
            <strong>sexe :</strong>
            <span>{formData.sex}</span>
          </div>
          <div className="summary-item">
            <strong>Date de naissance :</strong>
            <span>{formData.birthDate}</span>
          </div>
          <div className="summary-item">
            <strong>Adresse :</strong>
            <span>{formData.address}</span>
          </div>
          <div className="summary-item">
            <strong>Nationalité :</strong>
            <span>{formData.nationality}</span>
          </div>
          <div className="summary-item">
            <strong>Téléphone :</strong>
            <span>{formData.phone}</span>
          </div>
          <div className="summary-item">
            <strong>Email :</strong>
            <span>{formData.email}</span>
          </div>
        </div>
      </div>

      <div className="documents-summary">
        <h3>Documents Fournis</h3>
        <div className="document-preview">
          <div className="preview-item">
            <FileText size={24} />
            <div className="preview-info">
              <strong>{formData.idType === 'CNI' ? 'Carte Nationale d\'Identité' : 
                      formData.idType === 'CIP' ? 'Carte d\'Identité Professionnelle' : 'Passeport'}</strong>
              <span>N° {formData.idNumber}</span>
              <span className="file-name">{formData.idFile?.name}</span>
            </div>
          </div>
          
          <div className="preview-item">
            <Home size={24} />
            <div className="preview-info">
              <strong>{formData.addressDocType === 'Certificat_de_résidence' ? 'Certificat de résidence' :
                      formData.addressDocType === 'Facture_SBEE' ? 'Facture d\'électricité/eau' : 'Attestation de logement'}</strong>
              <span>N° {formData.justificatifId}</span>
              <span className="file-name">{formData.addressFile?.name}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default StepThree;