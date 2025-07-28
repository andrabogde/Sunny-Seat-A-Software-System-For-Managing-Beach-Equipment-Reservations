// src/pages/UnauthorizedPage.jsx

import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const UnauthorizedPage = () => {
  const { user, logout } = useContext(AuthContext);

  // Componentă simplă pentru iconuri
  const Icon = ({ name, size = 18, className = "" }) => {
    const icons = {
      lock: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
          <circle cx="12" cy="16" r="1"></circle>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
        </svg>
      ),
      home: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          <polyline points="9,22 9,12 15,12 15,22"></polyline>
        </svg>
      ),
      arrowLeft: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12,19 5,12 12,5"></polyline>
        </svg>
      )
    };
    
    return icons[name] || icons.home;
  };

  return (
    <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="row justify-content-center w-100">
        <div className="col-lg-6 col-md-8">
          <div className="card border-0 shadow-lg">
            <div className="card-body text-center p-5">
              <div className="mb-4">
                <div className="rounded-circle bg-danger bg-opacity-10 p-4 mx-auto d-inline-flex">
                  <Icon name="lock" size={48} className="text-danger" />
                </div>
              </div>
              
              <h1 className="display-6 fw-bold text-danger mb-3">Acces Interzis</h1>
              <h4 className="mb-4">Nu ai permisiunile necesare</h4>
              
              <p className="text-muted mb-4">
                {user ? (
                  <>
                    Salut <strong>{user.nume} {user.prenume}</strong>, încerci să accesezi o zonă pentru care nu ai permisiunile necesare.
                    <br /><br />
                    Rolul tău actual: <span className="badge bg-primary">{user.role || 'utilizator'}</span>
                  </>
                ) : (
                  'Trebuie să te conectezi pentru a accesa această pagină.'
                )}
              </p>

              <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center">
                <Link to="/" className="btn btn-primary">
                  <Icon name="home" size={18} className="me-2" />
                  Înapoi la Prima Pagină
                </Link>
                
                {user ? (
                  <button onClick={logout} className="btn btn-outline-secondary">
                    <Icon name="arrowLeft" size={18} className="me-2" />
                    Deconectează-te
                  </button>
                ) : (
                  <Link to="/login" className="btn btn-outline-primary">
                    <Icon name="arrowLeft" size={18} className="me-2" />
                    Conectează-te
                  </Link>
                )}
              </div>

              <hr className="my-4" />
              
              <p className="small text-muted mb-0">
                Dacă crezi că este o eroare, contactează administratorul sistemului.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;