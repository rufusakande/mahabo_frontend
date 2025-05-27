import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, Shield, Clock, CheckCircle, Star, Users, Zap } from 'lucide-react';
import './CTA.css';

const CTA = () => {
  const ctaRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      {
        threshold: 0.2,
        rootMargin: '0px 0px -20px 0px'
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
    { icon: Users, value: '50K+', label: 'Clients' },
    { icon: CheckCircle, value: '99.9%', label: 'Réussite' },
    { icon: Clock, value: '< 24h', label: 'Traitement' },
    { icon: Star, value: '4.9/5', label: 'Satisfaction' }
  ];

  const features = [
    { icon: Shield, text: 'Conformité RGPD' },
    { icon: Zap, text: 'Processus rapide' },
    { icon: CheckCircle, text: 'Support 24/7' }
  ];

  return (
    <section 
      id="cta" 
      className={`cta ${isVisible ? 'cta--visible' : ''}`}
      ref={ctaRef}
      aria-labelledby="cta-title"
    >
      <div className="container">
        {/* Stats */}
        <div className="cta__stats">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div key={index} className="stat">
                <div className="stat__icon">
                  <IconComponent size={20} />
                </div>
                <div className="stat__content">
                  <span className="stat__value">{stat.value}</span>
                  <span className="stat__label">{stat.label}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Main Content */}
        <div className="cta__content">
          <div className="cta__header">
            <h2 id="cta-title" className="cta__title">
              Vérifiez votre identité en toute sécurité
            </h2>
            <p className="cta__description">
              Processus simple et sécurisé, conforme RGPD. 
              Plus de 50 000 utilisateurs nous font confiance.
            </p>
          </div>

          <div className="cta__actions">
            <a href="/verifykyc" className="btn btn--primary">
              <span>Commencer maintenant</span>
              <ArrowRight size={18} />
            </a>
            <button 
              className="btn btn--secondary"
              onClick={() => {
                const faqSection = document.getElementById('faq');
                if (faqSection) {
                  faqSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              En savoir plus
            </button>
          </div>

          <div className="cta__features">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="feature">
                  <IconComponent size={16} />
                  <span>{feature.text}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;