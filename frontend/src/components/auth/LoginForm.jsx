// src/components/auth/LoginForm.jsx - ACTUALIZAT CU RESET PAROLĂ ȘI ICONIȚE SPAȚIATE

import React, { useState, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { IconEye, IconEyeOff, IconMail, IconLock } from '@tabler/icons-react';

/**
 * Componentă pentru formularul de autentificare
 * - Gestionează autentificarea pentru USER și ADMIN
 * - Redirecționează bazat pe rol după login
 * - Suportă 2FA (two-factor authentication)
 * - Include link către resetarea parolei
 */
const LoginForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Obținem funcțiile din context-ul de autentificare
  const { login, loginWithVerification } = useContext(AuthContext);
  
  // Stare pentru câmpurile formularului
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  
  // Stare pentru 2FA
  const [twoFactorData, setTwoFactorData] = useState({
    required: false,
    code: ''
  });
  
  // Stare pentru afișarea parolei
  const [showPassword, setShowPassword] = useState(false);
  
  // Stare pentru mesajele de eroare
  const [error, setError] = useState(null);
  // Stare pentru loading în timpul procesării request-ului
  const [loading, setLoading] = useState(false);
  
  // Mesaj de redirecționare (dacă există)
  const message = location.state?.message;
  // URL-ul de redirecționare după autentificare (dacă a fost setat)
  const from = location.state?.from;

  /**
   * Determină unde să redirecționeze utilizatorul bazat pe rol
   * @param {string} role - Rolul utilizatorului (ADMIN sau USER)
   * @returns {string} - Path-ul pentru redirecționare
   */
  const getRedirectPath = (role) => {
    // Dacă avem un path specific de unde a venit utilizatorul
    if (from && from !== '/login' && from !== '/admin/login') {
      return from;
    }
    
    // Altfel, redirecționăm bazat pe rol
    if (role === 'ADMIN' || role === 'ADMINISTRATOR') {
      return '/admin/dashboard';
    } else if (role === 'MANAGER') {
      return '/manager/plaje';
    } else if (role === 'USER' || role === 'CLIENT') {
      return '/homepage';
    } else {
      return '/'; // Homepage pentru roluri necunoscute
    }
  };

  /**
   * Handler pentru schimbarea câmpurilor formularului
   * @param {Event} e - Evenimentul de change
   */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === 'twoFactorCode') {
      setTwoFactorData(prev => ({ ...prev, code: value }));
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value
      });
    }
    
    // Resetăm eroarea la modificarea câmpurilor
    if (error) {
      setError(null);
    }
  };

  /**
   * Handler pentru afișarea/ascunderea parolei
   */
  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  /**
   * Handler pentru trimiterea formularului
   * @param {Event} e - Evenimentul de submit
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      
      // Validare simplă
      if (!formData.email || !formData.password) {
        setError('Toate câmpurile sunt obligatorii.');
        return;
      }
      
      let result;
      
      // Dacă avem nevoie de cod 2FA
      if (twoFactorData.required && twoFactorData.code) {
        result = await loginWithVerification(
          formData.email, 
          formData.password, 
          twoFactorData.code
        );
      } else {
        // Login normal
        result = await login(formData.email, formData.password);
      }
      
      if (result.success) {
        // DEBUGGING
        console.log('💾 Login result:', result);
        console.log('💾 User role detected:', result.user?.role);
        
        const userRole = result.role || result.user?.role;
        console.log('User role for redirect:', userRole);
        
        const redirectPath = getRedirectPath(userRole);
        console.log('Redirecting to:', redirectPath);
        navigate(redirectPath);
      } else if (result.twoFactorRequired) {
        // Activăm modul 2FA
        setTwoFactorData({ required: true, code: '' });
        setError(null);
      } else {
        // Afișăm eroarea
        setError(result.error || 'Eroare la autentificare. Verificați datele introduse.');
      }
    } catch (err) {
      setError('Eroare neașteptată. Încercați din nou.');
      console.error('Eroare la autentificare:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handler pentru anularea 2FA și revenirea la login normal
   */
  const handleCancel2FA = () => {
    setTwoFactorData({ required: false, code: '' });
    setFormData({ ...formData, password: '' });
    setError(null);
  };

  return (
    <div className="auth-container">
      {message && (
        <div className="alert alert-info mb-4 rounded-3">
          <i className="ti ti-info-circle me-2"></i>
          {message}
        </div>
      )}
      
      {error && (
        <div className="alert alert-danger mb-4 rounded-3 border-0 shadow-sm">
          <i className="ti ti-alert-circle me-2"></i>
          {error}
        </div>
      )}
      
      {!twoFactorData.required ? (
        // Formular normal de login
        <form onSubmit={handleSubmit}>
          {/* Email Field */}
          <div className="form-floating mb-3">
            <div className="position-relative">
              <div className="form-floating">
                <input
                  type="email"
                  className="form-control rounded-3"
                  style={{ paddingLeft: '45px' }}
                  id="email"
                  name="email"
                  placeholder="nume@exemplu.com"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  disabled={loading}
                />
                <label htmlFor="email" style={{ paddingLeft: '45px' }}>Adresă Email</label>
              </div>
              <IconMail 
                className="position-absolute text-muted" 
                style={{ left: '15px', top: '50%', transform: 'translateY(-50%)', zIndex: 10 }} 
                size={18} 
              />
            </div>
          </div>
          
          {/* Password Field */}
          <div className="form-floating mb-3">
            <div className="position-relative">
              <div className="form-floating">
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control rounded-3"
                  style={{ paddingLeft: '45px', paddingRight: '45px' }}
                  id="password"
                  name="password"
                  placeholder="Parola ta"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  disabled={loading}
                />
                <label htmlFor="password" style={{ paddingLeft: '45px' }}>Parolă</label>
              </div>
              <IconLock 
                className="position-absolute text-muted" 
                style={{ left: '15px', top: '50%', transform: 'translateY(-50%)', zIndex: 10 }} 
                size={18} 
              />
              <button
                type="button"
                className="btn position-absolute bg-transparent border-0 p-0"
                style={{ right: '15px', top: '50%', transform: 'translateY(-50%)', zIndex: 10 }}
                onClick={togglePasswordVisibility}
                tabIndex="-1"
                disabled={loading}
              >
                {showPassword ? (
                  <IconEyeOff size={18} className="text-muted" />
                ) : (
                  <IconEye size={18} className="text-muted" />
                )}
              </button>
            </div>
          </div>
          
          {/* Remember Me & Forgot Password */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id="rememberMe"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
                disabled={loading}
              />
              <label className="form-check-label" htmlFor="rememberMe">
                Ține-mă minte
              </label>
            </div>
            {/* 🆕 LINK CĂTRE FORGOT PASSWORD */}
            <Link to="/forgot-password" className="text-primary text-decoration-none">
              Ai uitat parola?
            </Link>
          </div>
          
          {/* Submit Button */}
          <button
            type="submit"
            className="btn btn-primary w-100 py-2 rounded-3"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Se procesează...
              </>
            ) : (
              'Conectare'
            )}
          </button>
        </form>
      ) : (
        // Formular pentru 2FA
        <form onSubmit={handleSubmit}>
          <div className="text-center mb-4">
            <h5>Verificare în doi pași</h5>
            <p className="text-muted">
              Introduceți codul de verificare din aplicația de autentificare
            </p>
          </div>
          
          {/* 2FA Code Field */}
          <div className="form-floating mb-3">
            <input
              type="text"
              className="form-control rounded-3 text-center"
              id="twoFactorCode"
              name="twoFactorCode"
              placeholder="000000"
              required
              value={twoFactorData.code}
              onChange={handleChange}
              disabled={loading}
              maxLength="6"
              pattern="[0-9]{6}"
            />
            <label htmlFor="twoFactorCode">Cod de verificare</label>
          </div>
          
          {/* Submit Buttons */}
          <div className="d-grid gap-2">
            <button
              type="submit"
              className="btn btn-primary py-2 rounded-3"
              disabled={loading || twoFactorData.code.length !== 6}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Se verifică...
                </>
              ) : (
                'Verifică'
              )}
            </button>
            
            <button
              type="button"
              className="btn btn-outline-secondary py-2 rounded-3"
              onClick={handleCancel2FA}
              disabled={loading}
            >
              Înapoi
            </button>
          </div>
          
          <div className="text-center mt-3">
            <Link to="/auth/login/recovery-code" className="text-primary text-decoration-none">
              Folosește cod de recuperare
            </Link>
          </div>
        </form>
      )}
    </div>
  );
};

export default LoginForm;