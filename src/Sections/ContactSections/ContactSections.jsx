import React, { useState, useRef, useEffect } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle, AlertCircle, User, MessageSquare } from 'lucide-react';
import './ContactSections.css';

const ContactSections = () => {
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    sujet: '',
    message: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  
  const formRef = useRef(null);
  const heroRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (heroRef.current) observer.observe(heroRef.current);
    if (formRef.current) observer.observe(formRef.current);

    return () => observer.disconnect();
  }, []);

  const validateField = (name, value) => {
    switch (name) {
      case 'nom':
        return value.length < 2 ? 'Le nom doit contenir au moins 2 caractères' : '';
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return !emailRegex.test(value) ? 'Veuillez saisir une adresse email valide' : '';
      case 'sujet':
        return value.length < 3 ? 'Le sujet doit contenir au moins 3 caractères' : '';
      case 'message':
        return value.length < 10 ? 'Le message doit contenir au moins 10 caractères' : '';
      default:
        return '';
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Validation en temps réel
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validation complète
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      // Simulation d'envoi (remplacer par votre API)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSubmitStatus('success');
      setFormData({ nom: '', email: '', sujet: '', message: '' });
      setErrors({});
      
      // Réinitialiser le statut après 5 secondes
      setTimeout(() => setSubmitStatus(null), 5000);
      
    } catch (error) {
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus(null), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main id="contact">
      {/* Section Héros */}
      <section 
        className="hero-section" 
        ref={heroRef}
        aria-labelledby="contact-title"
      >
        <div className="hero-container">
          <div className={`hero-content ${isVisible ? 'animate-fade-in' : ''}`}>
            <h1 id="contact-title" className="hero-title">
              Contactez-nous
            </h1>
            <p className="hero-subtitle">
              Notre équipe est là pour répondre à toutes vos questions concernant 
              le processus de vérification d'identité KYC
            </p>
          </div>
          <div className="hero-decoration">
            <div className="floating-icon icon-1">
              <Mail size={24} aria-hidden="true" />
            </div>
            <div className="floating-icon icon-2">
              <Phone size={20} aria-hidden="true" />
            </div>
            <div className="floating-icon icon-3">
              <MessageSquare size={22} aria-hidden="true" />
            </div>
          </div>
        </div>
      </section>

      {/* Section principale */}
      <section className="main-section" aria-label="Formulaire de contact et informations">
        <div className="main-container">
          {/* Informations de contact */}
          <aside className="contact-info" aria-labelledby="contact-info-title">
            <h2 id="contact-info-title" className="info-title">
              Informations de contact
            </h2>
            <div className="info-grid">
              <div className="info-card">
                <div className="info-icon">
                  <Mail size={24} aria-hidden="true" />
                </div>
                <div className="info-content">
                  <h3>Email</h3>
                  <a href="mailto:support@kyc-verification.com" className="info-link">
                    support@kyc-verification.com
                  </a>
                </div>
              </div>
              
              <div className="info-card">
                <div className="info-icon">
                  <Phone size={24} aria-hidden="true" />
                </div>
                <div className="info-content">
                  <h3>Téléphone</h3>
                  <a href="tel:+33123456789" className="info-link">
                    +33 1 23 45 67 89
                  </a>
                </div>
              </div>
              
              <div className="info-card">
                <div className="info-icon">
                  <MapPin size={24} aria-hidden="true" />
                </div>
                <div className="info-content">
                  <h3>Adresse</h3>
                  <address className="info-address">
                    123 Avenue de la Sécurité<br />
                    75001 Paris, France
                  </address>
                </div>
              </div>
            </div>

            <div className="availability-info">
              <h3>Horaires d'ouverture</h3>
              <ul className="hours-list">
                <li>Lundi - Vendredi : 9h00 - 18h00</li>
                <li>Samedi : 10h00 - 16h00</li>
                <li>Dimanche : Fermé</li>
              </ul>
            </div>
          </aside>

          {/* Formulaire de contact */}
          <section className="contact-form-section" aria-labelledby="form-title">
            <div 
              ref={formRef}
              className={`contact-form ${isVisible ? 'animate-slide-up' : ''}`}
            >
              <h2 id="form-title" className="form-title">
                Envoyez-nous un message
              </h2>

              {submitStatus === 'success' && (
                <div className="success-message" role="alert" aria-live="polite">
                  <CheckCircle size={20} aria-hidden="true" />
                  <span>Votre message a été envoyé avec succès !</span>
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="error-message" role="alert" aria-live="polite">
                  <AlertCircle size={20} aria-hidden="true" />
                  <span>Une erreur est survenue. Veuillez réessayer.</span>
                </div>
              )}

              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="nom" className="form-label">
                    <User size={18} aria-hidden="true" />
                    Nom complet *
                  </label>
                  <input
                    type="text"
                    id="nom"
                    name="nom"
                    value={formData.nom}
                    onChange={handleInputChange}
                    className={`form-input ${errors.nom ? 'error' : ''}`}
                    placeholder="Votre nom complet"
                    required
                    aria-describedby={errors.nom ? 'nom-error' : undefined}
                    aria-invalid={errors.nom ? 'true' : 'false'}
                  />
                  {errors.nom && (
                    <span id="nom-error" className="error-text" role="alert">
                      {errors.nom}
                    </span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="email" className="form-label">
                    <Mail size={18} aria-hidden="true" />
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`form-input ${errors.email ? 'error' : ''}`}
                    placeholder="votre@email.com"
                    required
                    aria-describedby={errors.email ? 'email-error' : undefined}
                    aria-invalid={errors.email ? 'true' : 'false'}
                  />
                  {errors.email && (
                    <span id="email-error" className="error-text" role="alert">
                      {errors.email}
                    </span>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="sujet" className="form-label">
                  <MessageSquare size={18} aria-hidden="true" />
                  Sujet *
                </label>
                <input
                  type="text"
                  id="sujet"
                  name="sujet"
                  value={formData.sujet}
                  onChange={handleInputChange}
                  className={`form-input ${errors.sujet ? 'error' : ''}`}
                  placeholder="Objet de votre message"
                  required
                  aria-describedby={errors.sujet ? 'sujet-error' : undefined}
                  aria-invalid={errors.sujet ? 'true' : 'false'}
                />
                {errors.sujet && (
                  <span id="sujet-error" className="error-text" role="alert">
                    {errors.sujet}
                  </span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="message" className="form-label">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  className={`form-textarea ${errors.message ? 'error' : ''}`}
                  placeholder="Décrivez votre demande en détail..."
                  rows="6"
                  required
                  aria-describedby={errors.message ? 'message-error' : undefined}
                  aria-invalid={errors.message ? 'true' : 'false'}
                ></textarea>
                {errors.message && (
                  <span id="message-error" className="error-text" role="alert">
                    {errors.message}
                  </span>
                )}
              </div>

              <button
                type="button"
                className="submit-button"
                disabled={isSubmitting}
                aria-describedby="submit-help"
                onClick={handleSubmit}
              >
                {isSubmitting ? (
                  <>
                    <div className="spinner" aria-hidden="true"></div>
                    Envoi en cours...
                  </>
                ) : (
                  <>
                    <Send size={20} aria-hidden="true" />
                    Envoyer le message
                  </>
                )}
              </button>
              <p id="submit-help" className="submit-help">
                * Champs obligatoires. Nous vous répondrons dans les 24h.
              </p>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
};

export default ContactSections;