const API_BASE_URL = import.meta.env.VITE_API_URL;

export const submitKYCForm = async (formData) => {
  const formDataToSend = new FormData();
  
  // Ajouter les données textuelles
  formDataToSend.append('prenoms', formData.firstName);
  formDataToSend.append('nom', formData.lastName);
  formDataToSend.append('sex', formData.sex);
  formDataToSend.append('dateNaissance', formData.birthDate);
  formDataToSend.append('address', formData.address);
  formDataToSend.append('nationalite', formData.nationality);
  formDataToSend.append('telephone', formData.phone);
  formDataToSend.append('email', formData.email);
  formDataToSend.append('documentType', formData.idType);
  formDataToSend.append('documentId', formData.idNumber);
  formDataToSend.append('justificatifId', formData.justificatifId);
  formDataToSend.append('justificatifType', formData.addressDocType);
  
  // Ajouter les fichiers
  if (formData.idFile) {
    formDataToSend.append('document', formData.idFile);
  }
  if (formData.addressFile) {
    formDataToSend.append('justificatif', formData.addressFile);
  }

  const response = await fetch(`${API_BASE_URL}/kyc`, {
    method: 'POST',
    body: formDataToSend,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Erreur lors de l\'envoi de la demande');
  }

  return await response.json();
};