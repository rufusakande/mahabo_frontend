import React, { useCallback } from 'react';
import { Upload, FileText, X } from 'lucide-react';

export const FileUpload = ({ 
  type, 
  label, 
  files, 
  filePreview, 
  onFileChange, 
  onRemoveFile, 
  accept = "image/*,.pdf" 
}) => {
  const handleFileChange = useCallback((e) => {
    onFileChange(type, e.target.files[0]);
  }, [type, onFileChange]);

  const handleRemoveFile = useCallback(() => {
    onRemoveFile(type);
  }, [type, onRemoveFile]);

  return (
    <div className="file-upload-section">
      <label className="file-upload-label">{label}</label>
      <div className="file-upload-area">
        {!files[type] && !filePreview[type] ? (
          <label className="file-upload-button">
            <input
              type="file"
              accept={accept}
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
            <Upload className="icon" />
            <span>Cliquer pour sélectionner un fichier</span>
            <small>JPG, PNG ou PDF (max 5MB)</small>
          </label>
        ) : (
          <div className="file-preview">
            {filePreview[type] === 'pdf' ? (
              <div className="pdf-preview">
                <FileText className="icon" />
                <span>{files[type]?.name || 'Document PDF'}</span>
              </div>
            ) : filePreview[type] ? (
              <img src={filePreview[type]} alt="Preview" className="image-preview" />
            ) : (
              <div className="existing-file">
                <FileText className="icon" />
                <span>Fichier existant</span>
              </div>
            )}
            <div className="file-actions">
              <button
                type="button"
                onClick={handleRemoveFile}
                className="btn-remove"
              >
                <X className="icon" />
              </button>
              <label className="btn-change">
                <input
                  type="file"
                  accept={accept}
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
                Changer
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};