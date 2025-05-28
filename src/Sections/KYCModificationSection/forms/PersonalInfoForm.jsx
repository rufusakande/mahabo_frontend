import React from 'react';
import { User, MapPin, Phone, Mail, Calendar } from 'lucide-react';
import { FormInput } from '../common/FormInput';
import { getNationalitiesByContinent } from '../../../data/nationalities';

const nationalitiesByContinent = getNationalitiesByContinent();

export const PersonalInfoForm = ({ formData, onFormDataChange }) => {
  const handleInputChange = (field, value) => {
    onFormDataChange(prev => ({ ...prev, [field]: value }));
  };

  return (
    <section className="form-section">
      <h3><User className="icon" />Informations personnelles</h3>
      
      <div className="form-row">
        <FormInput label="Nom">
          <input
            type="text"
            value={formData.nom}
            onChange={(e) => handleInputChange('nom', e.target.value)}
            className="form-input"
            required
          />
        </FormInput>
        
        <FormInput label="Prénoms">
          <input
            type="text"
            value={formData.prenoms}
            onChange={(e) => handleInputChange('prenoms', e.target.value)}
            className="form-input"
            required
          />
        </FormInput>
      </div>

      <div className="form-row">
        <FormInput label="Sexe">
          <select
            value={formData.sex}
            onChange={(e) => handleInputChange('sex', e.target.value)}
            className="form-select"
            required
          >
            <option value="">Sélectionner</option>
            <option value="M">Masculin</option>
            <option value="F">Féminin</option>
          </select>
        </FormInput>
        
        <FormInput label="Date de naissance">
          <div className="input-wrapper">
            <input
              type="date"
              value={formData.dateNaissance}
              onChange={(e) => handleInputChange('dateNaissance', e.target.value)}
              className="form-input"
              required
            />
          </div>
        </FormInput>
      </div>

      <FormInput label="Nationalité">
        <select
          value={formData.nationalite}
          onChange={(e) => handleInputChange('nationalite', e.target.value)}
          className="form-select"
          required
        >
          <option value="">Sélectionner votre nationalité</option>
          {Object.entries(nationalitiesByContinent).map(([continent, countries]) => (
            <optgroup key={continent} label={continent}>
              {countries.map(country => (
                <option key={country.code} value={country.name.toLowerCase()}>
                  {country.name}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </FormInput>

      <FormInput label="Adresse">
        <div className="input-wrapper">
          <input
            type='text'
            value={formData.address}
            onChange={(e) => handleInputChange('address', e.target.value)}
            className="form-input"
            required
          />
          <MapPin className="input-icon" />
        </div>
      </FormInput>

      <div className="form-row">
        <FormInput label="Téléphone">
          <div className="input-wrapper">
            <input
              type="tel"
              value={formData.telephone}
              onChange={(e) => handleInputChange('telephone', e.target.value)}
              className="form-input"
              required
            />
            <Phone className="input-icon" />
          </div>
        </FormInput>
        
        <FormInput label="Email">
          <div className="input-wrapper">
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="form-input"
              required
            />
            <Mail className="input-icon" />
          </div>
        </FormInput>
      </div>
    </section>
  );
};