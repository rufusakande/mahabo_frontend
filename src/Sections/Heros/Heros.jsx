import React, { useState, useEffect } from 'react';
import { Shield, CheckCircle, Clock, Users, ArrowRight } from 'lucide-react';
import './Heros.css';

const Heros = () => {
  const [currentStat, setCurrentStat] = useState(0);

  const stats = [
    { number: '50,000+', label: 'Vérifications réalisées', icon: CheckCircle },
    { number: '2 min', label: 'Temps moyen', icon: Clock },
    { number: '99.9%', label: 'Satisfaction', icon: Users }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStat((prev) => (prev + 1) % stats.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="hero">
      <div className="hero-container">
        <div className="hero-content">
          {/* Badge */}
          <div className="trust-badge">
            <Shield size={16} />
            <span>Certifié et sécurisé</span>
          </div>

          {/* Titre principal */}
          <h1 className="hero-title">
            Vérification d'identité
            <span className="title-highlight"> rapide et sécurisée</span>
          </h1>

          {/* Sous-titre */}
          <p className="hero-subtitle" style={{color:'#1E3A8A'}}>
            Processus KYC simplifié en moins de 2 minutes. 
            Conformité RGPD garantie et validation instantanée.
          </p>

          {/* Actions */}
          <div className="hero-actions">
            <a href="/verifykyc" className="btn-primary">
              Commencer la vérification
              <ArrowRight size={18} />
            </a>
            <button className="btn-secondary">
              Voir la démo
            </button>
          </div>

          {/* Note */}
          <p className="hero-note">
            Aucune inscription requise • Processus 100% sécurisé
          </p>

          {/* Statistiques */}
          <div className="hero-stats">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div 
                  key={index}
                  className={`stat-item ${index === currentStat ? 'active' : ''}`}
                >
                  <div className="stat-icon">
                    <IconComponent size={20} />
                  </div>
                  <div className="stat-content">
                    <div className="stat-number">{stat.number}</div>
                    <div className="stat-label">{stat.label}</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Indicateurs */}
          <div className="stats-indicators">
            {stats.map((_, index) => (
              <button
                key={index}
                className={`indicator ${index === currentStat ? 'active' : ''}`}
                onClick={() => setCurrentStat(index)}
              />
            ))}
          </div>
        </div>

        {/* Visual */}
        <div className="hero-visual">
          <div className="visual-card">
            <div className="card-header">
              <div className="header-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
            <div className="card-content">
              <div className="form-preview">
                <div className="form-header">
                  <Shield size={24} />
                  <span>Vérification KYC</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill"></div>
                </div>
                <div className="form-fields">
                  <div className="field"></div>
                  <div className="field"></div>
                  <div className="field wide"></div>
                </div>
                <div className="form-button"></div>
              </div>
            </div>
          </div>
          
          <div className="floating-badges">
            <div className="badge badge-1">
              <CheckCircle size={16} />
              <span>Sécurisé</span>
            </div>
            <div className="badge badge-2">
              <Clock size={16} />
              <span>2 min</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Heros;