import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowLeft, Shield, Eye, EyeOff } from 'lucide-react';
import './LoginSection.css';

const AdminLogin = () => {
  const [step, setStep] = useState('email'); // 'email' ou 'code'
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [cardVisible, setCardVisible] = useState(false);
  const navigate = useNavigate();

  const API_BASE_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    // Animation d'entrée de la carte
    const timer = setTimeout(() => {
      setCardVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleRequestCode = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/admin/request-code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message || 'Code envoyé avec succès !');
        setStep('code');
      } else {
        setError(data.error || 'Erreur lors de l\'envoi du code');
      }
    } catch (err) {
      setError('Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, code }),
      });

      const data = await response.json();

      if (response.ok) {
        // Stocker le token
        localStorage.setItem('adminToken', data.token);
        navigate('/admin/dashboard');
      } else {
        setError(data.message || 'Code invalide ou expiré');
      }
    } catch (err) {
      setError('Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToEmail = () => {
    setStep('email');
    setCode('');
    setError('');
    setMessage('');
  };

  return (
    <div className="login-container">
      {/* Décorations d'arrière-plan */}
      <div className="background-decorations">
        <div className="decoration decoration-1"></div>
        <div className="decoration decoration-2"></div>
        <div className="decoration decoration-3"></div>
      </div>

      <div className="main-content">
        <div className={`login-card ${cardVisible ? 'card-visible' : ''}`}>
          {/* En-tête */}
          <div className="login-header">
            <div className="header-title">
              <div className="logo-container">
                <Shield size={24} />
              </div>
              <h1 className="app-title">Administration</h1>
            </div>
            <p className="subtitle">
              {step === 'email' 
                ? 'Connexion sécurisée par code' 
                : 'Entrez le code reçu par email'
              }
            </p>
          </div>

          {/* Formulaire Email */}
          {step === 'email' ? (
            <form onSubmit={handleRequestCode} className="login-form">
              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  <Mail size={16} />
                  Adresse email
                </label>
                <div className="input-wrapper">
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="votre@email.com"
                    required
                    disabled={loading}
                    className={`form-input ${error ? 'input-error' : ''}`}
                  />
                </div>
              </div>

              {error && (
                <div className="error-message">
                  {error}
                </div>
              )}

              <button 
                type="submit" 
                className={`submit-button ${loading ? 'loading' : ''}`}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="loading-spinner"></div>
                    Envoi en cours...
                  </>
                ) : (
                  <>
                    <Mail size={18} />
                    Recevoir le code
                  </>
                )}
              </button>
            </form>
          ) : (
            /* Formulaire Code */
            <form onSubmit={handleLogin} className="login-form">
              <div className="form-group">
                <label htmlFor="code" className="form-label">
                  <Lock size={16} />
                  Code de connexion
                </label>
                <div className="input-wrapper">
                  <input
                    type="text"
                    id="code"
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="000000"
                    required
                    disabled={loading}
                    maxLength="6"
                    className={`form-input ${error ? 'input-error' : ''}`}
                    style={{ textAlign: 'center', fontSize: '1.25rem', letterSpacing: '0.5rem' }}
                  />
                </div>
              </div>

              {message && (
                <div className="success-message">
                  {message}
                </div>
              )}

              {error && (
                <div className="error-message">
                  {error}
                </div>
              )}

              <button 
                type="submit" 
                className={`submit-button ${loading ? 'loading' : ''}`}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="loading-spinner"></div>
                    Connexion...
                  </>
                ) : (
                  <>
                    <Shield size={18} />
                    Se connecter
                  </>
                )}
              </button>

              <button 
                type="button" 
                className="back-button"
                onClick={handleBackToEmail}
                disabled={loading}
              >
                <ArrowLeft size={16} />
                Changer d'email
              </button>
            </form>
          )}

          {/* Pied de page */}
          <div className="login-footer">
            <p className="security-info">
              <Shield size={14} />
              Connexion sécurisée SSL
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;