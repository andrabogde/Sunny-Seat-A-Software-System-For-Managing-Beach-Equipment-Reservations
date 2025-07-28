import React, { useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import RegisterForm from '../components/auth/RegisterForm';
import { AuthContext } from '../contexts/AuthContext';
import { IconBeach, IconUsers, IconUserCheck, IconShieldCheck } from '@tabler/icons-react';

/**
 * Pagină de înregistrare modernă cu suport pentru manageri
 */
const RegisterPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useContext(AuthContext);
  
  // Dacă utilizatorul este deja autentificat, îl redirecționăm către pagina principală
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="register-page py-5" 
         style={{
           minHeight: '100vh',
           background: 'linear-gradient(135deg, #e0f7fa 0%, #80deea 50%, #4dd0e1 100%)',
           backgroundSize: 'cover'
         }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-11 col-xl-10">
            <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
              <div className="row g-0">
                {/* Secțiunea imagine decorativă - doar pe ecrane mari */}
                <div className="col-lg-5 d-none d-lg-block">
                  <div className="h-100 position-relative" 
                       style={{
                         background: 'url(https://images.unsplash.com/photo-1473186578172-c141e6798cf4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80)',
                         backgroundSize: 'cover',
                         backgroundPosition: 'center'
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
                        <p className="lead mb-4">Alătură-te platformei noastre și bucură-te de beneficiile rezervărilor online!</p>
                      </div>
                      
                      {/* Avantajele platformei */}
                      <div className="mb-4">
                        <h5 className="fw-semibold mb-3">De ce SunnySeat?</h5>
                        
                        <div className="d-flex align-items-start mb-3">
                          <IconUsers className="me-3 mt-1 flex-shrink-0" size={20} />
                          <div>
                            <div className="fw-semibold">Pentru clienți</div>
                            <small className="opacity-75">Rezervări simple și rapide pentru plajele tale preferate</small>
                          </div>
                        </div>
                        
                        <div className="d-flex align-items-start mb-3">
                          <IconUserCheck className="me-3 mt-1 flex-shrink-0" size={20} />
                          <div>
                            <div className="fw-semibold">Pentru manageri</div>
                            <small className="opacity-75">Gestionează-ți plaja și rezervările cu ușurință</small>
                          </div>
                        </div>
                        
                        <div className="d-flex align-items-start">
                          <IconShieldCheck className="me-3 mt-1 flex-shrink-0" size={20} />
                          <div>
                            <div className="fw-semibold">100% Securizat</div>
                            <small className="opacity-75">Datele tale sunt protejate și verificate</small>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Secțiunea formular */}
                <div className="col-lg-7">
                  <div className="card-body p-4 p-lg-5">
                    <div className="d-flex justify-content-center mb-4 d-lg-none">
                      <div className="d-flex align-items-center">
                        <IconBeach className="text-primary me-2" size={32} stroke={1.5} />
                        <span className="fw-bold fs-4">SunnySeat</span>
                      </div>
                    </div>
                    
                    <div className="text-center mb-4">
                      <h2 className="fw-bold mb-2">Creează un cont nou</h2>
                      <p className="text-muted">
                        Alege tipul de cont potrivit pentru tine și alătură-te comunității SunnySeat
                      </p>
                    </div>

                    {/* Beneficii mobile - doar pe mobile */}
                    <div className="d-lg-none mb-4">
                      <div className="row g-3">
                        <div className="col-6">
                          <div className="text-center p-3 bg-light rounded-3">
                            <IconUsers className="text-primary mb-2" size={24} />
                            <div className="small fw-semibold">Clienți</div>
                            <div className="small text-muted">Rezervări facile</div>
                          </div>
                        </div>
                        <div className="col-6">
                          <div className="text-center p-3 bg-light rounded-3">
                            <IconUserCheck className="text-primary mb-2" size={24} />
                            <div className="small fw-semibold">Manageri</div>
                            <div className="small text-muted">Gestionează plaja</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Formular de înregistrare */}
                    <RegisterForm />
                    
                    {/* Link către login */}
                    {/* <div className="text-center mt-4">
                      <p className="mb-0">
                        Ai deja un cont? <Link to="/login" className="text-primary fw-medium">Conectează-te</Link>
                      </p>
                    </div> */}
                    
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

export default RegisterPage;