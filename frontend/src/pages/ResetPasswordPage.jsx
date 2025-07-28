// src/pages/ResetPasswordPage.jsx - VERSIUNEA CORECTATĂ

import React, { useState, useEffect, useContext } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { IconLock, IconEye, IconEyeOff, IconCheck, IconX, IconBeach } from '@tabler/icons-react';
import { AuthContext } from '../contexts/AuthContext';

/**
 * Pagină pentru resetarea efectivă a parolei cu token
 * - Validează token-ul primit prin URL
 * - Permite utilizatorului să introducă parola nouă
 * - Include validare pentru complexitatea parolei
 */
const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { resetPassword } = useContext(AuthContext);
  
  // Extragem token-ul și email-ul din URL (conform backend-ului Spring)
  const token = searchParams.get('token');
  const email = searchParams.get('email');
  
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  
  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false
  });
  
  const [status, setStatus] = useState({
    loading: false,
    success: false,
    error: null,
    tokenValid: null // null = checking, true = valid, false = invalid
  });

  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    feedback: []
  });

  /**
   * Verifică validitatea token-ului la încărcarea paginii
   */
  useEffect(() => {
    if (!token || !email) {
      setStatus(prev => ({ 
        ...prev, 
        tokenValid: false, 
        error: 'Link invalid sau parametri lipsă.' 
      }));
      return;
    }

    // Pentru Spring Boot backend, validarea se face direct la resetarea parolei
    setStatus(prev => ({ ...prev, tokenValid: true }));
  }, [token, email]);

  /**
   * Evaluează puterea parolei
   */
  const evaluatePasswordStrength = (password) => {
    let score = 0;
    const feedback = [];

    if (password.length >= 8) {
      score += 1;
    } else {
      feedback.push('Minimum 8 caractere');
    }

    if (/[a-z]/.test(password)) {
      score += 1;
    } else {
      feedback.push('O literă mică');
    }

    if (/[A-Z]/.test(password)) {
      score += 1;
    } else {
      feedback.push('O literă mare');
    }

    if (/\d/.test(password)) {
      score += 1;
    } else {
      feedback.push('Un număr');
    }

    if (/[^a-zA-Z\d]/.test(password)) {
      score += 1;
    } else {
      feedback.push('Un caracter special');
    }

    return { score, feedback };
  };

  /**
   * Handler pentru schimbarea câmpurilor
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Evaluăm puterea parolei în timp real
    if (name === 'password') {
      const strength = evaluatePasswordStrength(value);
      setPasswordStrength(strength);
    }

    // Resetăm eroarea la modificarea câmpurilor
    if (status.error) {
      setStatus(prev => ({ ...prev, error: null }));
    }
  };

  /**
   * Toggle pentru afișarea parolei
   */
  const togglePasswordVisibility = (field) => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  /**
   * Handler pentru trimiterea formularului
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setStatus(prev => ({ ...prev, loading: true, error: null }));
      
      // Validări
      if (!formData.password || !formData.confirmPassword) {
        setStatus(prev => ({ ...prev, loading: false, error: 'Toate câmpurile sunt obligatorii.' }));
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        setStatus(prev => ({ ...prev, loading: false, error: 'Parolele nu se potrivesc.' }));
        return;
      }

      if (passwordStrength.score < 3) {
        setStatus(prev => ({ 
          ...prev, 
          loading: false, 
          error: 'Parola nu este suficient de puternică. ' + passwordStrength.feedback.join(', ') + '.' 
        }));
        return;
      }

      // Resetăm parola folosind AuthContext
      const result = await resetPassword(email, token, formData.password);
      
      if (result.success) {
        setStatus(prev => ({ ...prev, loading: false, success: true }));
        
        // Redirecționăm după 3 secunde
        setTimeout(() => {
          navigate('/login', { 
            state: { message: 'Parola a fost resetată cu succes. Te poți conecta acum.' }
          });
        }, 3000);
      } else {
        setStatus(prev => ({ ...prev, loading: false, error: result.error }));
      }
      
    } catch (error) {
      setStatus(prev => ({ ...prev, loading: false, error: 'Eroare neașteptată.' }));
    }
  };

  /**
   * Componenta de afișare a puterii parolei
   */
  const PasswordStrengthIndicator = () => {
    const getStrengthColor = () => {
      if (passwordStrength.score < 2) return 'danger';
      if (passwordStrength.score < 4) return 'warning';
      return 'success';
    };

    const getStrengthText = () => {
      if (passwordStrength.score < 2) return 'Slabă';
      if (passwordStrength.score < 4) return 'Medie';
      return 'Puternică';
    };

    return formData.password && (
      <div className="mt-2">
        <div className="d-flex justify-content-between small mb-1">
          <span>Puterea parolei:</span>
          <span className={`text-${getStrengthColor()}`}>{getStrengthText()}</span>
        </div>
        <div className="progress" style={{ height: '4px' }}>
          <div 
            className={`progress-bar bg-${getStrengthColor()}`}
            style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
          />
        </div>
        {passwordStrength.feedback.length > 0 && (
          <small className="text-muted">
            Lipsește: {passwordStrength.feedback.join(', ')}
          </small>
        )}
      </div>
    );
  };

  // Dacă token-ul sau email-ul nu sunt valide
  if (status.tokenValid === false) {
    return (
      <div className="reset-password-page py-5" 
           style={{
             minHeight: '100vh',
             background: 'linear-gradient(135deg, #e0f7fa 0%, #80deea 50%, #4dd0e1 100%)'
           }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-6 col-lg-5">
              <div className="card border-0 shadow-lg rounded-4">
                <div className="card-body p-4 p-lg-5 text-center">
                  <div className="d-flex align-items-center justify-content-center mb-3">
                    <IconBeach className="text-primary me-2" size={32} stroke={1.5} />
                    <span className="fw-bold fs-4">SunnySeat</span>
                  </div>
                  <div className="bg-danger bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                       style={{ width: '60px', height: '60px' }}>
                    <IconX className="text-danger" size={28} />
                  </div>
                  <h2 className="fw-bold mb-2 text-danger">Link invalid</h2>
                  <p className="text-muted mb-4">
                    {status.error || 'Link-ul de resetare este invalid sau a expirat.'}
                  </p>
                  <Link to="/forgot-password" className="btn btn-primary">
                    Solicită un link nou
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Dacă resetarea a fost cu succes
  if (status.success) {
    return (
      <div className="reset-password-page py-5" 
           style={{
             minHeight: '100vh',
             background: 'linear-gradient(135deg, #e0f7fa 0%, #80deea 50%, #4dd0e1 100%)'
           }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-6 col-lg-5">
              <div className="card border-0 shadow-lg rounded-4">
                <div className="card-body p-4 p-lg-5 text-center">
                  <div className="d-flex align-items-center justify-content-center mb-3">
                    <IconBeach className="text-primary me-2" size={32} stroke={1.5} />
                    <span className="fw-bold fs-4">SunnySeat</span>
                  </div>
                  <div className="bg-success bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                       style={{ width: '60px', height: '60px' }}>
                    <IconCheck className="text-success" size={28} />
                  </div>
                  <h2 className="fw-bold mb-2 text-success">Parolă resetată!</h2>
                  <p className="text-muted mb-4">
                    Parola ta a fost resetată cu succes. Te redirecționăm către pagina de conectare...
                  </p>
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Se încarcă...</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="reset-password-page py-5" 
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
                
                <div className="text-center mb-4">
                  <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                       style={{ width: '60px', height: '60px' }}>
                    <IconLock className="text-primary" size={28} />
                  </div>
                  <h2 className="fw-bold mb-2">Resetează parola</h2>
                  <p className="text-muted">
                    Introdu parola ta nouă pentru a-ți reseta accesul la cont.
                  </p>
                </div>

                {status.error && (
                  <div className="alert alert-danger rounded-3 border-0">
                    <i className="ti ti-alert-circle me-2"></i>
                    {status.error}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  {/* Password Field */}
                  <div className="form-floating mb-3">
                    <div className="position-relative">
                      <div className="form-floating">
                        <input
                          type={showPassword.password ? "text" : "password"}
                          className="form-control rounded-3 ps-4 pe-5"
                          id="password"
                          name="password"
                          placeholder="Parola nouă"
                          required
                          value={formData.password}
                          onChange={handleChange}
                          disabled={status.loading}
                        />
                        <label htmlFor="password" className="ps-4">Parolă nouă</label>
                      </div>
                      <IconLock 
                        className="position-absolute text-muted" 
                        style={{ left: '10px', top: '50%', transform: 'translateY(-50%)' }} 
                        size={18} 
                      />
                      <button
                        type="button"
                        className="btn position-absolute bg-transparent border-0 p-0"
                        style={{ right: '10px', top: '50%', transform: 'translateY(-50%)' }}
                        onClick={() => togglePasswordVisibility('password')}
                        tabIndex="-1"
                        disabled={status.loading}
                      >
                        {showPassword.password ? (
                          <IconEyeOff size={18} className="text-muted" />
                        ) : (
                          <IconEye size={18} className="text-muted" />
                        )}
                      </button>
                    </div>
                    <PasswordStrengthIndicator />
                  </div>

                  {/* Confirm Password Field */}
                  <div className="form-floating mb-4">
                    <div className="position-relative">
                      <div className="form-floating">
                        <input
                          type={showPassword.confirmPassword ? "text" : "password"}
                          className="form-control rounded-3 ps-4 pe-5"
                          id="confirmPassword"
                          name="confirmPassword"
                          placeholder="Confirmă parola"
                          required
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          disabled={status.loading}
                        />
                        <label htmlFor="confirmPassword" className="ps-4">Confirmă parola</label>
                      </div>
                      <IconLock 
                        className="position-absolute text-muted" 
                        style={{ left: '10px', top: '50%', transform: 'translateY(-50%)' }} 
                        size={18} 
                      />
                      <button
                        type="button"
                        className="btn position-absolute bg-transparent border-0 p-0"
                        style={{ right: '10px', top: '50%', transform: 'translateY(-50%)' }}
                        onClick={() => togglePasswordVisibility('confirmPassword')}
                        tabIndex="-1"
                        disabled={status.loading}
                      >
                        {showPassword.confirmPassword ? (
                          <IconEyeOff size={18} className="text-muted" />
                        ) : (
                          <IconEye size={18} className="text-muted" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="btn btn-primary w-100 py-2 rounded-3 mb-3"
                    disabled={status.loading || passwordStrength.score < 3}
                  >
                    {status.loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Se resetează...
                      </>
                    ) : (
                      'Resetează parola'
                    )}
                  </button>
                </form>

                {/* Back to Login */}
                <div className="text-center">
                  <Link to="/login" className="text-primary text-decoration-none">
                    Înapoi la conectare
                  </Link>
                </div>

                {/* Footer */}
                <div className="text-center mt-5 pt-3 border-top">
                  <p className="small text-muted mb-0">
                    &copy; 2025 SunnySeat. Toate drepturile rezervate.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;