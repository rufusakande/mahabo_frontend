import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, ChevronUp, HelpCircle, Clock, Shield, FileText, Users, Smartphone } from 'lucide-react';
import './FAQ.css';

const FAQ = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [openItems, setOpenItems] = useState(new Set([0])); // Premier item ouvert par défaut
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
        rootMargin: '0px 0px -50px 0px'
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

  const toggleItem = (index) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index);
    } else {
      newOpenItems.add(index);
    }
    setOpenItems(newOpenItems);
  };

  const handleKeyPress = (event, index) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      toggleItem(index);
    }
  };

  const faqData = [
    {
      icon: Clock,
      question: "Combien de temps prend le processus de vérification KYC ?",
      answer: "Le processus de vérification prend généralement entre 2 à 5 minutes pour soumettre vos documents, et 24 à 48 heures pour la validation complète. Les cas simples peuvent être approuvés en quelques heures seulement.",
      category: "Délais"
    },
    {
      icon: FileText,
      question: "Quels documents sont nécessaires pour la vérification ?",
      answer: "Vous aurez besoin d'une pièce d'identité valide (carte d'identité, passeport ou permis de conduire) et d'un justificatif de domicile récent (facture, relevé bancaire ou attestation de moins de 3 mois). Tous les documents doivent être lisibles et en couleur.",
      category: "Documents"
    },
    {
      icon: Shield,
      question: "Mes données personnelles sont-elles sécurisées ?",
      answer: "Absolument. Nous utilisons un chiffrement de niveau bancaire (AES-256) pour protéger vos données. Nous sommes conformes au RGPD et vos informations ne sont jamais partagées avec des tiers sans votre consentement explicite.",
      category: "Sécurité"
    },
    {
      icon: Users,
      question: "Que se passe-t-il si ma demande est rejetée ?",
      answer: "En cas de rejet, vous recevrez un email détaillé expliquant les raisons et les étapes à suivre. Vous pourrez soumettre de nouveaux documents ou corriger les informations. Notre équipe support est disponible 24/7 pour vous accompagner.",
      category: "Support"
    },
    {
      icon: Smartphone,
      question: "Puis-je effectuer la vérification depuis mon smartphone ?",
      answer: "Oui, notre plateforme est entièrement optimisée pour mobile. Vous pouvez prendre des photos de vos documents directement avec votre smartphone et compléter tout le processus en déplacement.",
      category: "Accessibilité"
    },
    {
      icon: HelpCircle,
      question: "Comment puis-je suivre l'état de ma demande ?",
      answer: "Vous recevrez un code de suivi unique après soumission. Utilisez ce code sur notre page de suivi pour voir l'état en temps réel : 'En attente', 'En cours de vérification', 'Approuvé' ou 'Rejeté'. Vous serez également notifié par email à chaque changement d'état.",
      category: "Suivi"
    }
  ];

  return (
    <section id="faq" ref={sectionRef} className={isVisible ? 'visible' : ''} aria-labelledby="faq-title">
      <div className="container">
        <header className="section-header">
          <div className="header-icon">
            <HelpCircle size={48} aria-hidden="true" />
          </div>
          <h2 id="faq-title">Questions Fréquemment Posées</h2>
          <p className="section-subtitle">
            Trouvez rapidement les réponses à vos questions sur notre processus de vérification KYC
          </p>
        </header>

        <div className="faq-container">
          <div className="faq-list" role="list">
            {faqData.map((item, index) => {
              const IconComponent = item.icon;
              const isOpen = openItems.has(index);
              
              return (
                <article 
                  key={index} 
                  className={`faq-item ${isOpen ? 'open' : ''}`}
                  style={{ '--animation-delay': `${index * 0.1 + 0.2}s` }}
                  role="listitem"
                >
                  <button
                    className="faq-question"
                    onClick={() => toggleItem(index)}
                    onKeyPress={(e) => handleKeyPress(e, index)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${index}`}
                    id={`faq-question-${index}`}
                  >
                    <div className="question-content">
                      <div className="question-icon">
                        <IconComponent size={24} aria-hidden="true" />
                      </div>
                      <div className="question-text">
                        <span className="question-category">{item.category}</span>
                        <h3>{item.question}</h3>
                      </div>
                    </div>
                    <div className="question-toggle">
                      {isOpen ? 
                        <ChevronUp size={24} aria-hidden="true" /> : 
                        <ChevronDown size={24} aria-hidden="true" />
                      }
                    </div>
                  </button>
                  
                  <div 
                    className="faq-answer"
                    id={`faq-answer-${index}`}
                    role="region"
                    aria-labelledby={`faq-question-${index}`}
                  >
                    <div className="answer-content">
                      <p>{item.answer}</p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          <div className="faq-sidebar">
            <div className="help-card">
              <div className="help-icon">
                <HelpCircle size={32} aria-hidden="true" />
              </div>
              <h3>Besoin d'aide supplémentaire ?</h3>
              <p>Notre équipe support est disponible 24/7 pour répondre à toutes vos questions.</p>
              <button className="help-button" type="button">
                Contacter le Support
              </button>
            </div>

            <div className="stats-card">
              <h3>En chiffres</h3>
              <div className="stat-row">
                <span className="stat-label">Temps moyen de traitement</span>
                <span className="stat-value">24h</span>
              </div>
              <div className="stat-row">
                <span className="stat-label">Taux d'approbation</span>
                <span className="stat-value">96%</span>
              </div>
              <div className="stat-row">
                <span className="stat-label">Satisfaction client</span>
                <span className="stat-value">99%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;