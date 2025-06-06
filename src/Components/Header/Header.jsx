import React, { useState, useEffect } from 'react';
import { Menu, X, Shield, ChevronDown } from 'lucide-react';
import { useLocation } from 'react-router-dom'; // Si vous utilisez React Router
import './Header.css';
import logoMahabo from '../../assets/Images/logo_Mahabo_Kyc.jpg';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  
  // Récupérer la route actuelle
  const location = useLocation();
  const currentPath = location.pathname;

  // Fonction pour vérifier si un lien est actif
  const isActiveLink = (path) => {
    return currentPath === path;
  };

  // Fonction pour vérifier si le dropdown Services est actif
  const isServicesActive = () => {
    const servicesPaths = ['/verifykyc', '/tracking', '/modification'];
    return servicesPaths.includes(currentPath);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    const handleClickOutside = (event) => {
      if (!event.target.closest('.header__nav-dropdown')) {
        setActiveDropdown(null);
      }
    };

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('click', handleClickOutside);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleDropdown = (dropdown) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

  const handleKeyDown = (event, action) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      action();
    }
  };

  return (
    <header 
      id="header" 
      className={`header__container ${isScrolled ? 'header__container--scrolled' : ''}`}
      role="banner"
    >
      <div className="header__wrapper">
        {/* Logo Section */}
        <div className="header__logo">
          <a 
            href="/" 
            className="header__logo-link"
            aria-label="Retour à l'accueil - Vérification d'identité sécurisée"
          >
            <img className='logo_Mahabo' src={logoMahabo} alt="" />
            <span className="header__logo-text">Mahabo KYC</span>
          </a>
        </div>

        {/* Desktop Navigation */}
        <nav className="header__nav" role="navigation" aria-label="Navigation principale">
          <ul className="header__nav-list">
            <li className="header__nav-item">
              <a 
                href="/" 
                className="header__nav-link" 
                aria-current={isActiveLink('/') ? 'page' : undefined}
              >
                Accueil
              </a>
            </li>
            
            <li className="header__nav-item header__nav-dropdown">
              <button
                className={`header__nav-link header__nav-dropdown-trigger ${
                  isServicesActive() ? 'header__nav-link--active' : ''
                }`}
                onClick={() => toggleDropdown('services')}
                onKeyDown={(e) => handleKeyDown(e, () => toggleDropdown('services'))}
                aria-expanded={activeDropdown === 'services'}
                aria-haspopup="true"
                aria-current={isServicesActive() ? 'page' : undefined}
              >
                Services
                <ChevronDown 
                  className={`header__nav-dropdown-icon ${
                    activeDropdown === 'services' ? 'header__nav-dropdown-icon--open' : ''
                  }`}
                  aria-hidden="true"
                />
              </button>
              
              <ul 
                className={`header__nav-dropdown-menu ${
                  activeDropdown === 'services' ? 'header__nav-dropdown-menu--open' : ''
                }`}
                role="menu"
              >
                <li role="none">
                  <a 
                    href="/verifykyc" 
                    className={`header__nav-dropdown-link ${
                      isActiveLink('/verifykyc') ? 'header__nav-dropdown-link--active' : ''
                    }`}
                    role="menuitem"
                  >
                    Vérification KYC
                  </a>
                </li>
                <li role="none">
                  <a 
                    href="/tracking" 
                    className={`header__nav-dropdown-link ${
                      isActiveLink('/tracking') ? 'header__nav-dropdown-link--active' : ''
                    }`}
                    role="menuitem"
                  >
                    Suivi de demande
                  </a>
                </li>
                <li role="none">
                  <a 
                    href="/modification" 
                    className={`header__nav-dropdown-link ${
                      isActiveLink('/modification') ? 'header__nav-dropdown-link--active' : ''
                    }`}
                    role="menuitem"
                  >
                    Modification
                  </a>
                </li>
              </ul>
            </li>

            <li className="header__nav-item">
              <a 
                href="/contact" 
                className="header__nav-link"
                aria-current={isActiveLink('/contact') ? 'page' : undefined}
              >
                Contact
              </a>
            </li>
          </ul>

          {/* CTA Button */}
          <div className="header__cta">
            <a 
              href="/verifykyc" 
              className="header__cta-button"
              aria-label="Commencer le processus de vérification KYC"
            >
              Démarrer KYC
            </a>
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="header__mobile-toggle"
          onClick={toggleMenu}
          onKeyDown={(e) => handleKeyDown(e, toggleMenu)}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-menu"
          aria-label={isMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
        >
          {isMenuOpen ? (
            <X className="header__mobile-icon" aria-hidden="true" />
          ) : (
            <Menu className="header__mobile-icon" aria-hidden="true" />
          )}
        </button>

        {/* Mobile Menu */}
        <div 
          id="mobile-menu"
          className={`header__mobile-menu ${isMenuOpen ? 'header__mobile-menu--open' : ''}`}
          role="navigation"
          aria-label="Navigation mobile"
        >
          <ul className="header__mobile-list">
            <li className="header__mobile-item">
              <a 
                href="/" 
                className={`header__mobile-link ${
                  isActiveLink('/') ? 'header__mobile-link--active' : ''
                }`}
                onClick={toggleMenu}
              >
                Accueil
              </a>
            </li>
            <li className="header__mobile-item">
              <a 
                href="/verifykyc" 
                className={`header__mobile-link ${
                  isActiveLink('/verifykyc') ? 'header__mobile-link--active' : ''
                }`}
                onClick={toggleMenu}
              >
                Vérification KYC
              </a>
            </li>
            <li className="header__mobile-item">
              <a 
                href="/tracking" 
                className={`header__mobile-link ${
                  isActiveLink('/tracking') ? 'header__mobile-link--active' : ''
                }`}
                onClick={toggleMenu}
              >
                Suivi de demande
              </a>
            </li>
            <li className="header__mobile-item">
              <a 
                href="/modification" 
                className={`header__mobile-link ${
                  isActiveLink('/modification') ? 'header__mobile-link--active' : ''
                }`}
                onClick={toggleMenu}
              >
                Modification
              </a>
            </li>
            <li className="header__mobile-item">
              <a 
                href="/contact" 
                className={`header__mobile-link ${
                  isActiveLink('/contact') ? 'header__mobile-link--active' : ''
                }`}
                onClick={toggleMenu}
              >
                Contact
              </a>
            </li>
            <li className="header__mobile-item">
              <a href="/verifykyc" className="header__mobile-cta" onClick={toggleMenu}>
                Démarrer KYC
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div 
          className="header__overlay"
          onClick={toggleMenu}
          aria-hidden="true"
        />
      )}
    </header>
  );
};

export default Header;