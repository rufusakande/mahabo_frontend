import React, { useState, useEffect, useRef } from 'react';
import { Shield, Clock, CheckCircle, Eye, Lock, Smartphone } from 'lucide-react';
import './Advantages.css';

const Advantages = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      {
        threshold: 0.2,
        rootMargin: '0px 0px -100px 0px'
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const advantages = [
    {
      icon: Shield,
      title: 'Sécurité Maximale',
      description: 'Vos données sont protégées par un chiffrement de niveau bancaire et conformes au RGPD.',
      color: '#1E3A8A',
      delay: '0.1s'
    },
    {
      icon: Clock,
      title: 'Processus Rapide',
      description: 'Validation en moins de 5 minutes avec un processus simplifié et intuitif.',
      color: '#10B981',
      delay: '0.2s'
    },
    {
      icon: CheckCircle,
      title: 'Fiabilité Garantie',
      description: 'Système de vérification automatisé avec validation humaine pour 100% de précision.',
      color: '#F59E0B',
      delay: '0.3s'
    },
    {
      icon: Eye,
      title: 'Transparence Totale',
      description: 'Suivi en temps réel de votre demande avec notifications instantanées.',
      color: '#1E3A8A',
      delay: '0.4s'
    },
    {
      icon: Lock,
      title: 'Confidentialité',
      description: 'Vos informations personnelles ne sont jamais partagées avec des tiers.',
      color: '#10B981',
      delay: '0.5s'
    },
    {
      icon: Smartphone,
      title: 'Multi-Plateforme',
      description: 'Accessible depuis tous vos appareils : ordinateur, tablette ou smartphone.',
      color: '#F59E0B',
      delay: '0.6s'
    }
  ];

  return (
    <section id="advantages" ref={sectionRef} className={isVisible ? 'visible' : ''} aria-labelledby="advantages-title">
      <div className="container">
        <header className="section-header">
          <h2 id="advantages-title">Pourquoi Choisir Notre Solution KYC ?</h2>
          <p className="section-subtitle">
            Une plateforme de vérification d'identité moderne, sécurisée et conforme aux standards internationaux
          </p>
        </header>

        <div className="advantages-grid">
          {advantages.map((advantage, index) => {
            const IconComponent = advantage.icon;
            return (
              <article 
                key={index} 
                className="advantage-card"
                style={{ '--animation-delay': advantage.delay }}
                tabIndex="0"
                role="article"
                aria-labelledby={`advantage-title-${index}`}
              >
                <div className="advantage-icon" style={{ '--icon-color': advantage.color }}>
                  <IconComponent size={32} aria-hidden="true" />
                </div>
                <div className="advantage-content">
                  <h3 id={`advantage-title-${index}`} className="advantage-title">
                    {advantage.title}
                  </h3>
                  <p className="advantage-description">
                    {advantage.description}
                  </p>
                </div>
                <div className="advantage-overlay"></div>
              </article>
            );
          })}
        </div>

        <div className="stats-container">
          <div className="stat-item">
            <span className="stat-number" data-target="99.9">0</span>
            <span className="stat-label">% de Fiabilité</span>
          </div>
          <div className="stat-item">
            <span className="stat-number" data-target="50000">0</span>
            <span className="stat-label">Vérifications Effectuées</span>
          </div>
          <div className="stat-item">
            <span className="stat-number" data-target="24">0</span>
            <span className="stat-label">Support 24/7</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Advantages;