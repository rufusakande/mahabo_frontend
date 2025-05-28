import React from 'react';
import { FileText } from 'lucide-react';
import { FormInput } from '../common/FormInput';
import { FileUpload } from '../FileUpload';

const DOCUMENT_TYPES = [
  { value: 'CNI', label: 'Carte Nationale d\'Identité' },
  { value: 'CIP', label: 'Carte d\'Identité Professionnelle' },
  { value: 'passeport', label: 'Passeport' },
  { value: 'permis_conduire', label: 'Permis de conduire' }
];

const JUSTIFICATIF_TYPES = [
  { value: 'Facture_SBEE', label: 'Facture SBEE' },
  { value: 'Facture_SONEB', label: 'Facture SONEB' },
  { value: 'Releve_bancaire', label: 'Relevé bancaire' },
  { value: 'Certificat_de_résidence', label: 'Certificat de résidence' }
];

export const DocumentsForm = ({ 
  formData, 
  files, 
  filePreview, 
  onFormDataChange, 
  onFileChange, 
  onRemoveFile 
}) => {
  const handleInputChange = (field, value) => {
    onFormDataChange(prev => ({ ...prev, [field]: value }));
  };

  return (
    <section className="form-section">
      <h3><FileText className="icon" />Documents d'identité</h3>
      
      <div className="form-row">
        <FormInput label="Type de document">
          <select
            value={formData.documentType}
            onChange={(e) => handleInputChange('documentType', e.target.value)}
            className="form-select"
            required
          >
            <option value="">Sélectionner</option>
            {DOCUMENT_TYPES.map(({ value, label }) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </FormInput>
        
        <FormInput label="Numéro du document">
          <input
            type="text"
            value={formData.documentId}
            onChange={(e) => handleInputChange('documentId', e.target.value)}
            className="form-input"
            required
          />
        </FormInput>
      </div>

      <FileUpload 
        type="document" 
        label="Document d'identité" 
        files={files}
        filePreview={filePreview}
        onFileChange={onFileChange}
        onRemoveFile={onRemoveFile}
      />

      <div className="form-row">
        <FormInput label="Type de justificatif">
          <select
            value={formData.justificatifType}
            onChange={(e) => handleInputChange('justificatifType', e.target.value)}
            className="form-select"
            required
          >
            <option value="">Sélectionner</option>
            {JUSTIFICATIF_TYPES.map(({ value, label }) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </FormInput>
        
        <FormInput label="Référence du justificatif">
          <input
            type="text"
            value={formData.justificatifId}
            onChange={(e) => handleInputChange('justificatifId', e.target.value)}
            className="form-input"
            required
          />
        </FormInput>
      </div>

      <FileUpload 
        type="justificatif" 
        label="Justificatif de domicile" 
        files={files}
        filePreview={filePreview}
        onFileChange={onFileChange}
        onRemoveFile={onRemoveFile}
      />
    </section>
  );
};