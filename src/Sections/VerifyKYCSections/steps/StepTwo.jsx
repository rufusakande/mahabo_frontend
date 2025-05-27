import React from 'react';
import { CreditCard, Home, Upload } from 'lucide-react';

const StepTwo = ({ formData, errors, handleInputChange, handleFileChange }) => (
  <div id="stepTwo" className="form-step">
    <div className="step-header">
      <h2>Documents à Fournir</h2>
      <p>Veuillez télécharger vos documents d'identité et justificatifs</p>
    </div>

    <div className="documents-section">
      <div className="document-group">
        <h3>
          <CreditCard size={20} />
          Pièce d'Identité
        </h3>
        
        <div className="form-group">
          <label htmlFor="idType">Type de pièce d'identité *</label>
          <select
            id="idType"
            value={formData.idType}
            onChange={(e) => handleInputChange('idType', e.target.value)}
            className={errors.idType ? 'error' : ''}
          >
            <option value="">Sélectionner le type</option>
            <option value="CNI">Carte Nationale d'Identité</option>
            <option value="CIP">Carte d'Identité Professionnelle</option>
            <option value="passeport">Passeport</option>
            <option value="permis_conduire">Permis de conduire</option>
          </select>
          {errors.idType && <span className="error-message">{errors.idType}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="idNumber">Numéro de la pièce *</label>
          <input
            id="idNumber"
            type="text"
            value={formData.idNumber}
            onChange={(e) => handleInputChange('idNumber', e.target.value)}
            className={errors.idNumber ? 'error' : ''}
            placeholder="Numéro de votre pièce d'identité"
          />
          {errors.idNumber && <span className="error-message">{errors.idNumber}</span>}
        </div>

        <div className="file-upload">
          <label htmlFor="idFile" className="upload-label">
            <Upload size={24} />
            <span>{formData.idFile ? formData.idFile.name : 'Télécharger la pièce d\'identité'}</span>
          </label>
          <input
            id="idFile"
            type="file"
            accept="image/*,.pdf"
            onChange={(e) => handleFileChange('idFile', e.target.files[0])}
            className="file-input"
          />
          {errors.idFile && <span className="error-message">{errors.idFile}</span>}
        </div>
      </div>

      <div className="document-group">
        <h3>
          <Home size={20} />
          Justificatif de Domicile
        </h3>
        
        <div className="form-group">
          <label htmlFor="addressDocType">Type de justificatif *</label>
          <select
            id="addressDocType"
            value={formData.addressDocType}
            onChange={(e) => handleInputChange('addressDocType', e.target.value)}
            className={errors.addressDocType ? 'error' : ''}
          >
            <option value="">Sélectionner le type</option>
            <option value="Certificat_de_résidence">Certificat de résidence</option>
            <option value="Facture_SBEE">Facture d'électricité (SBEE)</option>
            <option value="Facture_SONEB">Facture d'eau (SONEB)</option>
            <option value="Releve_bancaire">Relevé bancaire</option>
          </select>
          {errors.addressDocType && <span className="error-message">{errors.addressDocType}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="justificatifId">Numéro du justificatif *</label>
          <input
            id="justificatifId"
            type="text"
            value={formData.justificatifId}
            onChange={(e) => handleInputChange('justificatifId', e.target.value)}
            className={errors.justificatifId ? 'error' : ''}
            placeholder="Numéro du justificatif"
          />
          {errors.justificatifId && <span className="error-message">{errors.justificatifId}</span>}
        </div>

        <div className="file-upload">
          <label htmlFor="addressFile" className="upload-label">
            <Upload size={24} />
            <span>{formData.addressFile ? formData.addressFile.name : 'Télécharger le justificatif'}</span>
          </label>
          <input
            id="addressFile"
            type="file"
            accept="image/*,.pdf"
            onChange={(e) => handleFileChange('addressFile', e.target.files[0])}
            className="file-input"
          />
          {errors.addressFile && <span className="error-message">{errors.addressFile}</span>}
        </div>
      </div>
    </div>
  </div>
);

export default StepTwo;