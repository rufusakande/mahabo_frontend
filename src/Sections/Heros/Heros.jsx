import React, { useState, useEffect, useRef } from 'react';
import { Shield, CheckCircle, Clock, Users, ArrowRight, Play } from 'lucide-react';
import './Heros.css';

const Heros = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentStat, setCurrentStat] = useState(0);
  const heroRef = useRef(null);

  const stats = [
    { number: '50,000+', label: 'Vérifications réalisées', icon: CheckCircle },
    { number: '2 min', label: 'Temps moyen de traitement', icon: Clock },
    { number: '99.9%', label: 'Taux de satisfaction', icon: Users }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (heroRef.current) {
      observer.observe(heroRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStat((prev) => (prev + 1) % stats.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [stats.length]);

  const handleStartKYC = () => {
    // Navigation vers le processus KYC
    const element = document.getElementById('processus-kyc');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleWatchDemo = () => {
    // Ouvrir une modal de démonstration ou vidéo
    console.log('Démonstration vidéo');
  };

  return (
    <section 
      id="hero-section" 
      ref={heroRef}
      className={`hero ${isVisible ? 'visible' : ''}`}
      role="banner"
      aria-labelledby="hero-title"
    >
      {/* Éléments de fond animés */}
      <div className="hero-background" aria-hidden="true">
        <div className="floating-element element-1"></div>
        <div className="floating-element element-2"></div>
        <div className="floating-element element-3"></div>
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
      </div>

      <div className="container">
        <div className="hero-content">
          {/* Contenu principal */}
          <div className="hero-main">
            {/* Badge de confiance */}
            <div className="trust-badge">
              <Shield className="trust-icon" aria-hidden="true" />
              <span className="trust-text">Certifié et sécurisé</span>
            </div>

            {/* Titre principal */}
            <h1 id="hero-title" className="hero-title">
              <span className="title-line">Vérification d'identité</span>
              <span className="title-highlight">rapide et sécurisée</span>
            </h1>

            {/* Sous-titre */}
            <p className="hero-subtitle">
              Processus KYC simplifié en moins de 2 minutes. Conformité RGPD garantie, 
              sécurité maximale et validation instantanée de votre identité.
            </p>

            {/* Boutons d'action */}
            <div className="hero-actions">
              <button 
                className="cta-primary"
                onClick={handleStartKYC}
                aria-describedby="cta-description"
              >
                <span>Commencer la vérification</span>
                <ArrowRight className="cta-icon" aria-hidden="true" />
              </button>

              <button 
                className="cta-secondary"
                onClick={handleWatchDemo}
                aria-label="Regarder la démonstration vidéo"
              >
                <Play className="play-icon" aria-hidden="true" />
                <span>Voir la démonstration</span>
              </button>
            </div>

            <p id="cta-description" className="cta-description">
              Aucune inscription requise • Processus 100% sécurisé
            </p>

            {/* Statistiques animées */}
            <div className="hero-stats" role="region" aria-label="Statistiques de performance">
              <div className="stats-container">
                {stats.map((stat, index) => {
                  const IconComponent = stat.icon;
                  return (
                    <div 
                      key={index}
                      className={`stat-item ${index === currentStat ? 'active' : ''}`}
                    >
                      <div className="stat-icon">
                        <IconComponent aria-hidden="true" />
                      </div>
                      <div className="stat-content">
                        <div className="stat-number">{stat.number}</div>
                        <div className="stat-label">{stat.label}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {/* Indicateurs de progression */}
              <div className="stats-indicators" role="tablist" aria-label="Indicateurs statistiques">
                {stats.map((_, index) => (
                  <button
                    key={index}
                    className={`indicator ${index === currentStat ? 'active' : ''}`}
                    onClick={() => setCurrentStat(index)}
                    role="tab"
                    aria-selected={index === currentStat}
                    aria-label={`Afficher statistique ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Élément visuel */}
          <div className="hero-visual" aria-hidden="true">
            <div className="visual-container">
              {/* Mockup de smartphone */}
              <div className="phone-mockup">
                <div className="phone-screen">
                  <div className="screen-header">
                    <div className="screen-dots">
                      <span className="dot dot-red"></span>
                      <span className="dot dot-yellow"></span>
                      <span className="dot dot-green"></span>
                    </div>
                  </div>
                  
                  <div className="screen-content">
                    <div className="kyc-form-preview">
                      <div className="form-step active">
                        <div className="step-icon">
                          <Shield />
                        </div>
                        <div className="step-title">Vérification d'identité</div>
                        <div className="progress-bar">
                          <div className="progress-fill"></div>
                        </div>
                      </div>
                      
                      <div className="form-fields">
                        <div className="field-row">
                          <div className="field-placeholder"></div>
                          <div className="field-placeholder"></div>
                        </div>
                        <div className="field-row">
                          <div className="field-placeholder long"></div>
                        </div>
                      </div>
                      
                      <div className="form-button">
                        <div className="button-placeholder"></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Éléments flottants autour du phone */}
                <div className="floating-badge badge-1">
                  <CheckCircle className="badge-icon" />
                  <span>Sécurisé</span>
                </div>
                
                <div className="floating-badge badge-2">
                  <Clock className="badge-icon" />
                  <span>2 min</span>
                </div>
                
                <div className="floating-badge badge-3">
                  <Shield className="badge-icon" />
                  <span>Certifié</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Indicateur de scroll */}
        <div className="scroll-indicator" aria-hidden="true">
          <div className="scroll-line"></div>
          <div className="scroll-text">Découvrir nos avantages</div>
          <div className="scroll-arrow">
            <ArrowRight className="arrow-icon" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Heros;