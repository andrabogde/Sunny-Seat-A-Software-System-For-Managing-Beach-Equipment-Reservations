import React, { useContext, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import LoginForm from '../components/auth/LoginForm';
import { AuthContext } from '../contexts/AuthContext';
import { IconBeach, IconBrandFacebook, IconBrandGoogle } from '@tabler/icons-react';

/**
 * Pagină de autentificare modernă și atractivă
 * - Păstrează toată funcționalitatea existentă
 * - Design split-screen cu imagine de fundal relevantă pentru plajă
 * - Conține butoanele de social login și link către înregistrare
 */
const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useContext(AuthContext);
  
  // Determinăm URL-ul de redirecționare după autentificare
  const from = location.state?.from || '/';
  
  // Dacă utilizatorul este deja autentificat, îl redirecționăm
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  return (
    <div className="login-page py-5" 
         style={{
           minHeight: '100vh',
           background: 'linear-gradient(135deg, #e0f7fa 0%, #80deea 50%, #4dd0e1 100%)',
           backgroundSize: 'cover'
         }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
              <div className="row g-0">
                {/* Secțiunea imagine decorativă - doar pe ecrane medii și mari */}
                <div className="col-md-6 d-none d-md-block">
                  <div className="h-100 position-relative" 
                       style={{
                         background: 'url(https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80)',
                         backgroundSize: 'cover',
                         backgroundPosition: 'center 30%'
                       }}>
                    <div className="position-absolute top-0 start-0 w-100 h-100"
                         style={{
                           background: 'linear-gradient(135deg, rgba(0,173,181,0.8) 0%, rgba(0,106,160,0.6) 100%)'
                         }}>
                    </div>
                    <div className="position-absolute top-0 start-0 w-100 h-100 d-flex flex-column justify-content-center p-5 text-white">
                      <div className="text-center mb-5">
                        <IconBeach size={60} className="mb-3" stroke={1.5} />
                        <h2 className="fw-bold mb-3">SunnySeat</h2>
                        <p className="lead">Rezervă-ți locul perfect la plajă și bucură-te de vacanța ideală la Marea Neagră!</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Secțiunea formular de login */}
                <div className="col-md-6">
                  <div className="card-body p-4 p-lg-5">
                    <div className="d-flex justify-content-center mb-4 d-md-none">
                      <div className="d-flex align-items-center">
                        <IconBeach className="text-primary me-2" size={32} stroke={1.5} />
                        <span className="fw-bold fs-4">SunnySeat</span>
                      </div>
                    </div>
                    
                    <h2 className="text-center fw-bold mb-2">Bine ai revenit!</h2>
                    <p className="text-center text-muted mb-4">Te rugăm să te conectezi pentru a continua</p>
                    
                
                      
                    
                    
                    {/* Formular de login */}
                    <LoginForm />
                    
                    {/* Link către înregistrare */}
                    <div className="text-center mt-4">
                      <p className="mb-0">
                        Nu ai cont încă? <Link to="/register" className="text-primary fw-medium">Înregistrează-te</Link>
                      </p>
                    </div>
                    
                    {/* Footer formular */}
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
      </div>
    </div>
  );
};

export default LoginPage;