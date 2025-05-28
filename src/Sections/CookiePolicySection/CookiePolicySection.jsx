import React from 'react';
import './CookiePolicySection.css';
import { Cookie, Layers, Hand, SlidersHorizontal, Clock3, Mail } from 'lucide-react';

const CookiePolicySection = () => {
  return (
    <section className="cookie-policy">
      <div className="cookie-container">
        <h1>Politique de gestion des cookies</h1>

        <div className="cookie-section">
          <h2><Cookie size={20} /> Qu’est-ce qu’un cookie ?</h2>
          <p>
            Un cookie est un petit fichier texte enregistré sur votre terminal (ordinateur, mobile, tablette) lors de votre visite sur notre site web.
          </p>
        </div>

        <div className="cookie-section">
          <h2><Layers size={20} /> Types de cookies utilisés</h2>
          <ul>
            <li><strong>Cookies strictement nécessaires</strong> : essentiels au fonctionnement du site</li>
            <li><strong>Cookies de mesure d’audience</strong> (si utilisés)</li>
            <li><strong>Cookies fonctionnels</strong> (préférence de langue, etc.)</li>
          </ul>
        </div>

        <div className="cookie-section">
          <h2><Hand size={20} /> Consentement</h2>
          <p>
            Le dépôt de cookies non essentiels est soumis à votre consentement via une bannière lors de votre première visite sur le site.
          </p>
        </div>

        <div className="cookie-section">
          <h2><SlidersHorizontal size={20} /> Gestion des cookies</h2>
          <p>Vous pouvez à tout moment :</p>
          <ul>
            <li>Accepter ou refuser les cookies</li>
            <li>Paramétrer votre navigateur pour bloquer certains types de cookies</li>
          </ul>
        </div>

        <div className="cookie-section">
          <h2><Clock3 size={20} /> Durée de conservation</h2>
          <p>
            Les cookies sont conservés pour une durée maximale de 13 mois.
          </p>
        </div>

        <div className="cookie-section">
          <h2><Mail size={20} /> Contact</h2>
          <p>
            Pour toute question concernant les cookies, contactez-nous : <strong>tamkoti@yahoo.fr</strong>
          </p>
        </div>
      </div>
    </section>
  );
};

export default CookiePolicySection;
