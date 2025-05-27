export const validateStep = (step, formData) => {
  const errors = {};
  
  if (step === 1) {
    if (!formData.firstName.trim()) errors.firstName = 'Le prénom est requis';
    if (!formData.lastName.trim()) errors.lastName = 'Le nom est requis';
    if (!formData.sex.trim()) errors.sex = 'Le sexe est requis';
    if (!formData.birthDate) errors.birthDate = 'La date de naissance est requise';
    if (!formData.address.trim()) errors.address = 'Adresse';
    if (!formData.nationality.trim()) errors.nationality = 'La nationalité est requise';
    if (!formData.phone.trim()) errors.phone = 'Le numéro de téléphone est requis';
    if (!formData.email.trim()) errors.email = 'L\'email est requis';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Email invalide';
  }
  
  if (step === 2) {
    if (!formData.idType) errors.idType = 'Le type de pièce d\'identité est requis';
    if (!formData.idNumber.trim()) errors.idNumber = 'Le numéro de la pièce est requis';
    if (!formData.justificatifId.trim()) errors.justificatifId = 'Le numéro du justificatif est requis';
    if (!formData.idFile) errors.idFile = 'Le fichier de la pièce d\'identité est requis';
    if (!formData.addressDocType) errors.addressDocType = 'Le type de justificatif est requis';
    if (!formData.addressFile) errors.addressFile = 'Le justificatif de domicile est requis';
  }
  
  return errors;
};