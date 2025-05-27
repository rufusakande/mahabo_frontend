import React from 'react';
import { Shield, Phone, Mail, MapPin, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';
import './Footer.css';
import logoMahabo from '../../assets/Images/logo_Mahabo_Kyc.jpg';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    services: [
      { href: 'tracking', label: 'Suivi de demande' },
      { href: 'verifykyc', label: 'Vérification d\'identité' },
      { href: '#aide', label: 'Centre d\'aide' }
    ],
    legal: [
      { href: '#confidentialite', label: 'Politique de confidentialité' },
      { href: '#conditions', label: 'Conditions d\'utilisation' },
      { href: '#rgpd', label: 'Conformité RGPD' },
      { href: '#cookies', label: 'Gestion des cookies' }
    ],
    company: [
      { href: '#apropos', label: 'À propos' },
      { href: '#equipe', label: 'Notre équipe' },
      { href: '#carriere', label: 'Carrières' },
      { href: '#partenaires', label: 'Partenaires' }
    ]
  };

  const socialLinks = [
    { href: 'https://facebook.com', icon: Facebook, label: 'Facebook' },
    { href: 'https://twitter.com', icon: Twitter, label: 'Twitter' },
    { href: 'https://linkedin.com', icon: Linkedin, label: 'LinkedIn' },
    { href: 'https://instagram.com', icon: Instagram, label: 'Instagram' }
  ];

  return (
    <footer id="footer" role="contentinfo" aria-label="Pied de page">
      <div className="container">
        {/* Section principale du footer */}
        <div className="footer-main">
          {/* Informations de l'entreprise */}
          <div className="footer-brand">
            <div className="brand-logo">
              {/* <Shield className="brand-icon" aria-hidden="true" /> */}
              <img className='logo_Mahabo' src={logoMahabo} alt="" />
              <span className="brand-name">Mahabo KYC</span>
            </div>
            
            <p className="brand-description">
              Votre partenaire de confiance pour la vérification d'identité sécurisée. 
              Nous garantissons un processus KYC rapide, simple et conforme aux réglementations.
            </p>

            {/* Informations de contact */}
            <div className="contact-details">
              <div className="contact-item">
                <MapPin className="contact-icon" aria-hidden="true" />
                <span className="contact-text">123 Avenue de la République, 75011 Paris</span>
              </div>
              
              <div className="contact-item">
                <Phone className="contact-icon" aria-hidden="true" />
                <a href="tel:+33123456789" className="contact-link">+33 1 23 45 67 89</a>
              </div>
              
              <div className="contact-item">
                <Mail className="contact-icon" aria-hidden="true" />
                <a href="mailto:contact@securekyc.com" className="contact-link">contact@securekyc.com</a>
              </div>
            </div>

            {/* Réseaux sociaux */}
            <div className="social-links">
              <h3 className="social-title">Suivez-nous</h3>
              <div className="social-icons">
                {socialLinks.map((social, index) => {
                  const IconComponent = social.icon;
                  return (
                    <a
                      key={index}
                      href={social.href}
                      className="social-icon"
                      aria-label={`Suivez-nous sur ${social.label}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <IconComponent aria-hidden="true" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Liens de navigation */}
          <div className="footer-links">
            {/* Services */}
            <div className="link-group">
              <h3 className="link-group-title">Services</h3>
              <ul className="link-list" role="list">
                {footerLinks.services.map((link, index) => (
                  <li key={index} role="listitem">
                    <a href={link.href} className="footer-link">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Légal */}
            <div className="link-group">
              <h3 className="link-group-title">Légal</h3>
              <ul className="link-list" role="list">
                {footerLinks.legal.map((link, index) => (
                  <li key={index} role="listitem">
                    <a href={link.href} className="footer-link">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Entreprise */}
            <div className="link-group">
              <h3 className="link-group-title">Entreprise</h3>
              <ul className="link-list" role="list">
                {footerLinks.company.map((link, index) => (
                  <li key={index} role="listitem">
                    <a href={link.href} className="footer-link">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Certifications et badges */}
        <div className="footer-certifications">
          <div className="cert-item">
            <div className="cert-badge">
              <Shield className="cert-icon" aria-hidden="true" />
              <span className="cert-text">Certifié ISO 27001</span>
            </div>
          </div>
          
          <div className="cert-item">
            <div className="cert-badge">
              <Shield className="cert-icon" aria-hidden="true" />
              <span className="cert-text">Conforme RGPD</span>
            </div>
          </div>
          
          <div className="cert-item">
            <div className="cert-badge">
              <Shield className="cert-icon" aria-hidden="true" />
              <span className="cert-text">Sécurisé SSL</span>
            </div>
          </div>
        </div>

        {/* Séparateur */}
        <div className="footer-divider" role="separator" aria-hidden="true"></div>

        {/* Bas de page */}
        <div className="footer-bottom">
          <div className="copyright">
            <p>© {currentYear} SecureKYC. Tous droits réservés.</p>
          </div>
          
          <div className="bottom-links">
            <a href="#confidentialite" className="bottom-link">
              Confidentialité
            </a>
            <span className="link-separator" aria-hidden="true">•</span>
            <a href="#conditions" className="bottom-link">
              Conditions
            </a>
            <span className="link-separator" aria-hidden="true">•</span>
            <a href="#cookies" className="bottom-link">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;