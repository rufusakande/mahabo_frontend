import React from 'react';
import { User, Calendar, MapPin, Phone, Mail, CreditCard } from 'lucide-react';
import { nationalities, getNationalitiesByContinent } from '../../../data/nationalities';

const StepOne = ({ formData, errors, handleInputChange }) => {
  // Obtenir les nationalités groupées par continent
  const nationalitiesByContinent = getNationalitiesByContinent();
  
  return (
    <div id="stepOne" className="form-step">
      <div className="step-header">
        <h2>Informations Personnelles</h2>
        <p>Veuillez renseigner vos informations personnelles avec précision</p>
      </div>

      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="firstName">
            <User size={18} />
            Prénom *
          </label>
          <input
            id="firstName"
            type="text"
            value={formData.firstName}
            onChange={(e) => handleInputChange('firstName', e.target.value)}
            className={errors.firstName ? 'error' : ''}
            placeholder="Votre prénom"
          />
          {errors.firstName && <span className="error-message">{errors.firstName}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="lastName">
            <User size={18} />
            Nom *
          </label>
          <input
            id="lastName"
            type="text"
            value={formData.lastName}
            onChange={(e) => handleInputChange('lastName', e.target.value)}
            className={errors.lastName ? 'error' : ''}
            placeholder="Votre nom"
          />
          {errors.lastName && <span className="error-message">{errors.lastName}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="sex">
            <CreditCard size={18} />
            Sexe *
          </label>
          <select
            id="sex"
            value={formData.sex}
            onChange={(e) => handleInputChange('sex', e.target.value)}
            className={errors.sex ? 'error' : ''}
          >
            <option value="">Sélectionner votre sexe</option>
            <option value="masculin">Masculin</option>
            <option value="feminin">Féminin</option>
          </select>
          {errors.sex && <span className="error-message">{errors.sex}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="birthDate">
            <Calendar size={18} />
            Date de naissance *
          </label>
          <input
            id="birthDate"
            type="date"
            value={formData.birthDate}
            onChange={(e) => handleInputChange('birthDate', e.target.value)}
            className={errors.birthDate ? 'error' : ''}
          />
          {errors.birthDate && <span className="error-message">{errors.birthDate}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="address">
            <MapPin size={18} />
            Adresse *
          </label>
          <input
            id="address"
            type="text"
            value={formData.address}
            onChange={(e) => handleInputChange('address', e.target.value)}
            className={errors.address ? 'error' : ''}
            placeholder="Ville, Pays"
          />
          {errors.address && <span className="error-message">{errors.address}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="nationality">
            <CreditCard size={18} />
            Nationalité *
          </label>
          <select
            id="nationality"
            value={formData.nationality}
            onChange={(e) => handleInputChange('nationality', e.target.value)}
            className={errors.nationality ? 'error' : ''}
          >
            <option value="">Sélectionner votre nationalité</option>
            
            {/* Affichage des nationalités groupées par continent */}
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
          {errors.nationality && <span className="error-message">{errors.nationality}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="phone">
            <Phone size={18} />
            Téléphone *
          </label>
          <input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            className={errors.phone ? 'error' : ''}
            placeholder="+229 XX XX XX XX XX"
          />
          {errors.phone && <span className="error-message">{errors.phone}</span>}
        </div>

        <div className="form-group full-width">
          <label htmlFor="email">
            <Mail size={18} />
            Email *
          </label>
          <input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className={errors.email ? 'error' : ''}
            placeholder="votre.email@exemple.com"
          />
          {errors.email && <span className="error-message">{errors.email}</span>}
        </div>
      </div>
    </div>
  );
};

export default StepOne;