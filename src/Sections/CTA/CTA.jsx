import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, Shield, Clock, CheckCircle, Star, Users } from 'lucide-react';
import './CTA.css';

const CTA = () => {
  const ctaRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [animationStep, setAnimationStep] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Animation séquentielle
          setTimeout(() => setAnimationStep(1), 200);
          setTimeout(() => setAnimationStep(2), 400);
          setTimeout(() => setAnimationStep(3), 600);
        }
      },
      {
        threshold: 0.3,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    if (ctaRef.current) {
      observer.observe(ctaRef.current);
    }

    return () => {
      if (ctaRef.current) {
        observer.unobserve(ctaRef.current);
      }
    };
  }, []);

  const stats = [
    { icon: Users, value: '50,000+', label: 'Clients vérifiés' },
    { icon: CheckCircle, value: '99.9%', label: 'Taux de réussite' },
    { icon: Clock, value: '< 24h', label: 'Temps de traitement' },
    { icon: Star, value: '4.9/5', label: 'Satisfaction client' }
  ];

  const handleKeyDown = (event, action) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      action();
    }
  };

  return (
    <section 
      id="cta" 
      className={`cta__container ${isVisible ? 'cta__container--visible' : ''}`}
      ref={ctaRef}
      aria-labelledby="cta-title"
      role="region"
    >
      {/* Background Elements */}
      <div className="cta__background" aria-hidden="true">
        <div className="cta__gradient-orb cta__gradient-orb--1"></div>
        <div className="cta__gradient-orb cta__gradient-orb--2"></div>
        <div className="cta__pattern"></div>
      </div>

      <div className="cta__wrapper">
        {/* Stats Section */}
        <div className={`cta__stats ${animationStep >= 1 ? 'cta__stats--visible' : ''}`}>
          <div className="cta__stats-grid">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div 
                  key={index}
                  className="cta__stat-item"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="cta__stat-icon">
                    <IconComponent aria-hidden="true" />
                  </div>
                  <div className="cta__stat-content">
                    <span className="cta__stat-value">{stat.value}</span>
                    <span className="cta__stat-label">{stat.label}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Main Content */}
        <div className="cta__content">
          <div className={`cta__header ${animationStep >= 2 ? 'cta__header--visible' : ''}`}>
            <div className="cta__icon-wrapper">
              <Shield className="cta__icon" aria-hidden="true" />
              <div className="cta__icon-pulse"></div>
            </div>
            
            <h2 id="cta-title" className="cta__title">
              Prêt à vérifier votre identité en toute sécurité ?
            </h2>
            
            <p className="cta__description">
              Rejoignez des milliers d'utilisateurs qui font confiance à notre plateforme 
              pour leurs vérifications d'identité. Processus simple, sécurisé et conforme RGPD.
            </p>
          </div>

          <div className={`cta__actions ${animationStep >= 3 ? 'cta__actions--visible' : ''}`}>
            <a 
              href="/kyc" 
              className="cta__primary-button"
              aria-label="Commencer le processus de vérification KYC maintenant"
            >
              <span className="cta__button-text">Commencer maintenant</span>
              <ArrowRight className="cta__button-icon" aria-hidden="true" />
              <div className="cta__button-shine"></div>
            </a>
            
            <button 
              className="cta__secondary-button"
              onClick={() => {
                const faqSection = document.getElementById('faq');
                if (faqSection) {
                  faqSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              onKeyDown={(e) => handleKeyDown(e, () => {
                const faqSection = document.getElementById('faq');
                if (faqSection) {
                  faqSection.scrollIntoView({ behavior: 'smooth' });
                }
              })}
              aria-label="En savoir plus sur le processus de vérification"
            >
              En savoir plus
            </button>
          </div>

          {/* Trust Indicators */}
          <div className={`cta__trust-indicators ${animationStep >= 3 ? 'cta__trust-indicators--visible' : ''}`}>
            <div className="cta__trust-item">
              <CheckCircle className="cta__trust-icon" aria-hidden="true" />
              <span className="cta__trust-text">Conformité RGPD</span>
            </div>
            <div className="cta__trust-item">
              <Shield className="cta__trust-icon" aria-hidden="true" />
              <span className="cta__trust-text">Chiffrement SSL</span>
            </div>
            <div className="cta__trust-item">
              <Clock className="cta__trust-icon" aria-hidden="true" />
              <span className="cta__trust-text">Support 24/7</span>
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="cta__floating-elements" aria-hidden="true">
          <div className="cta__floating-card cta__floating-card--1">
            <CheckCircle className="cta__floating-icon" />
            <span>Vérification rapide</span>
          </div>
          <div className="cta__floating-card cta__floating-card--2">
            <Shield className="cta__floating-icon" />
            <span>100% sécurisé</span>
          </div>
          <div className="cta__floating-card cta__floating-card--3">
            <Star className="cta__floating-icon" />
            <span>Note 4.9/5</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;