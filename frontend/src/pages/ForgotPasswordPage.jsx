// src/pages/ForgotPasswordPage.jsx - VERSIUNEA CORECTATĂ

import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { IconMail, IconArrowLeft, IconCheck, IconBeach } from '@tabler/icons-react';
import { AuthContext } from '../contexts/AuthContext';

/**
 * Pagină pentru resetarea parolei
 * - Permite utilizatorului să introducă email-ul pentru resetare
 * - Afișează mesaj de confirmare după trimiterea email-ului
 * - Include validare și handling pentru erori
 */
const ForgotPasswordPage = () => {
  const { forgotPassword } = useContext(AuthContext);
  
  const [formData, setFormData] = useState({
    email: ''
  });
  
  const [status, setStatus] = useState({
    loading: false,
    sent: false,
    error: null
  });

  /**
   * Handler pentru schimbarea câmpului email
   */
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    
    // Resetăm eroarea la modificarea câmpului
    if (status.error) {
      setStatus(prev => ({ ...prev, error: null }));
    }
  };

  /**
   * Handler pentru trimiterea formularului
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setStatus({ loading: true, sent: false, error: null });
      
      // Validare simplă
      if (!formData.email) {
        setStatus(prev => ({ ...prev, loading: false, error: 'Email-ul este obligatoriu.' }));
        return;
      }

      // Validare format email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setStatus(prev => ({ ...prev, loading: false, error: 'Formatul email-ului nu este valid.' }));
        return;
      }

      // Folosește funcția din AuthContext
      const result = await forgotPassword(formData.email);
      
      if (result.success) {
        setStatus({ loading: false, sent: true, error: null });
      } else {
        setStatus({ loading: false, sent: false, error: result.error });
      }
      
    } catch (error) {
      setStatus({ loading: false, sent: false, error: 'Eroare neașteptată' });
    }
  };

  return (
    <div className="forgot-password-page py-5" 
         style={{
           minHeight: '100vh',
           background: 'linear-gradient(135deg, #e0f7fa 0%, #80deea 50%, #4dd0e1 100%)'
         }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <div className="card border-0 shadow-lg rounded-4">
              <div className="card-body p-4 p-lg-5">
                
                {/* Logo SunnySeat */}
                <div className="text-center mb-4">
                  <div className="d-flex align-items-center justify-content-center mb-3">
                    <IconBeach className="text-primary me-2" size={32} stroke={1.5} />
                    <span className="fw-bold fs-4">SunnySeat</span>
                  </div>
                </div>
                
                {!status.sent ? (
                  // Formular pentru introducerea email-ului
                  <>
                    <div className="text-center mb-4">
                      <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                           style={{ width: '60px', height: '60px' }}>
                        <IconMail className="text-primary" size={28} />
                      </div>
                      <h2 className="fw-bold mb-2">Ai uitat parola?</h2>
                      <p className="text-muted">
                        Nu-ți face griji! Introdu adresa de email și îți vom trimite un link pentru resetarea parolei.
                      </p>
                    </div>

                    {status.error && (
                      <div className="alert alert-danger rounded-3 border-0">
                        <i className="ti ti-alert-circle me-2"></i>
                        {status.error}
                      </div>
                    )}

                    <form onSubmit={handleSubmit}>
                      {/* Email Field */}
                      <div className="form-floating mb-4">
                        <div className="position-relative">
                          <div className="form-floating">
                            <input
                              type="email"
                              className="form-control rounded-3 ps-4"
                              id="email"
                              name="email"
                              placeholder="nume@exemplu.com"
                              required
                              value={formData.email}
                              onChange={handleChange}
                              disabled={status.loading}
                            />
                            <label htmlFor="email" className="ps-4">Adresă Email</label>
                          </div>
                          <IconMail 
                            className="position-absolute text-muted" 
                            style={{ left: '10px', top: '50%', transform: 'translateY(-50%)' }} 
                            size={18} 
                          />
                        </div>
                      </div>

                      {/* Submit Button */}
                      <button
                        type="submit"
                        className="btn btn-primary w-100 py-2 rounded-3 mb-3"
                        disabled={status.loading}
                      >
                        {status.loading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Se trimite...
                          </>
                        ) : (
                          'Trimite link de resetare'
                        )}
                      </button>
                    </form>
                  </>
                ) : (
                  // Mesaj de succes
                  <div className="text-center">
                    <div className="bg-success bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                         style={{ width: '60px', height: '60px' }}>
                      <IconCheck className="text-success" size={28} />
                    </div>
                    <h2 className="fw-bold mb-2 text-success">Email trimis!</h2>
                    <p className="text-muted mb-4">
                      Am trimis un link de resetare la adresa <strong>{formData.email}</strong>. 
                      Verifică căsuța de email și urmează instrucțiunile pentru a-ți reseta parola.
                    </p>
                    <div className="alert alert-info rounded-3 border-0">
                      <small>
                        <strong>Nu găsești email-ul?</strong><br />
                        Verifică folderul de spam sau așteaptă câteva minute pentru ca email-ul să ajungă.
                      </small>
                    </div>
                  </div>
                )}

                {/* Back to Login */}
                <div className="text-center mt-4">
                  <Link 
                    to="/login" 
                    className="btn btn-outline-secondary d-inline-flex align-items-center"
                    disabled={status.loading}
                  >
                    <IconArrowLeft size={16} className="me-2" />
                    Înapoi la conectare
                  </Link>
                </div>

                {/* Retry option */}
                {status.sent && (
                  <div className="text-center mt-3">
                    <button
                      type="button"
                      className="btn btn-link text-primary p-0"
                      onClick={() => setStatus({ loading: false, sent: false, error: null })}
                    >
                      Trimite din nou email-ul
                    </button>
                  </div>
                )}

                {/* Footer */}
                <div className="text-center mt-5 pt-3 border-top">
                  <p className="small text-muted mb-0">
                    &copy; 2025 SunnySeat. Toate drepturile rezervate.
                  </p>
                  <div className="mt-2">
                    <Link to="/termeni-conditii" className="small text-muted me-3">Termeni și condiții</Link>
                    <Link to="/politica-confidentialitate" className="small text-muted">Confidențialitate</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;