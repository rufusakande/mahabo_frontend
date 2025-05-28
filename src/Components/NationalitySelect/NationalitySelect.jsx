import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search, X } from 'lucide-react';

const NationalitySelect = ({ 
  value, 
  onChange, 
  error, 
  nationalitiesByContinent,
  placeholder = "Rechercher ou sélectionner votre nationalité"
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredNationalities, setFilteredNationalities] = useState({});
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  // Fermer le dropdown quand on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filtrer les nationalités basé sur le terme de recherche
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredNationalities(nationalitiesByContinent);
      return;
    }

    const filtered = {};
    const searchLower = searchTerm.toLowerCase();

    Object.entries(nationalitiesByContinent).forEach(([continent, countries]) => {
      const matchingCountries = countries.filter(country =>
        country.name.toLowerCase().includes(searchLower)
      );
      
      if (matchingCountries.length > 0) {
        filtered[continent] = matchingCountries;
      }
    });

    setFilteredNationalities(filtered);
  }, [searchTerm, nationalitiesByContinent]);

  // Trouver le nom complet de la nationalité sélectionnée
  const getSelectedNationalityName = () => {
    if (!value) return '';
    
    for (const continent of Object.values(nationalitiesByContinent)) {
      const nationality = continent.find(country => country.name.toLowerCase() === value.toLowerCase());
      if (nationality) return nationality.name;
    }
    return value;
  };

  const handleSelect = (nationality) => {
    onChange(nationality.name.toLowerCase());
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleClear = () => {
    onChange('');
    setSearchTerm('');
    inputRef.current?.focus();
  };

  const handleInputClick = () => {
    setIsOpen(true);
  };

  const selectedName = getSelectedNationalityName();

  return (
    <div className="nationality-select-container" ref={dropdownRef}>
      <div className={`nationality-select-input ${error ? 'error' : ''}`}>
        <div className="input-wrapper">
          <Search size={16} className="search-icon" />
          <input
            ref={inputRef}
            type="text"
            value={isOpen ? searchTerm : selectedName}
            onChange={(e) => setSearchTerm(e.target.value)}
            onClick={handleInputClick}
            onFocus={() => setIsOpen(true)}
            placeholder={placeholder}
            className="search-input"
          />
          {selectedName && !isOpen && (
            <button
              type="button"
              onClick={handleClear}
              className="clear-button"
            >
              <X size={16} />
            </button>
          )}
          <ChevronDown 
            size={16} 
            className={`chevron-icon ${isOpen ? 'rotated' : ''}`}
            onClick={() => setIsOpen(!isOpen)}
          />
        </div>
      </div>

      {isOpen && (
        <div className="nationality-dropdown">
          {Object.keys(filteredNationalities).length === 0 ? (
            <div className="no-results">
              Aucune nationalité trouvée pour "{searchTerm}"
            </div>
          ) : (
            Object.entries(filteredNationalities).map(([continent, countries]) => (
              <div key={continent} className="continent-group">
                <div className="continent-header">{continent}</div>
                {countries.map(country => (
                  <div
                    key={country.code}
                    className={`nationality-option ${
                      value === country.name.toLowerCase() ? 'selected' : ''
                    }`}
                    onClick={() => handleSelect(country)}
                  >
                    {country.name}
                  </div>
                ))}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default NationalitySelect;