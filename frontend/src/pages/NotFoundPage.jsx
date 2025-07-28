import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Pagina afișată când o rută nu există (eroarea 404)
 */
const NotFoundPage = () => {
  return (
    <div className="container py-5 text-center">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow-lg border-0 rounded-lg">
            <div className="card-body p-5">
              <div className="display-1 text-primary mb-4">
                <i className="ti ti-face-mask"></i>
              </div>
              <h1 className="display-4 fw-bold mb-4">404</h1>
              <h2 className="mb-3">Oops! Pagină negăsită</h2>
              <p className="mb-4 text-muted">
                Ne pare rău, dar pagina pe care o căutați nu există sau a fost mutată. 
                Vă rugăm să verificați URL-ul sau să folosiți una dintre opțiunile de mai jos.
              </p>
              <div className="d-flex justify-content-center gap-3">
                <button 
                  className="btn btn-outline-primary px-4"
                  onClick={() => window.history.back()}
                >
                  <i className="ti ti-arrow-left me-2"></i>
                  Înapoi
                </button>
                <Link to="/" className="btn btn-primary px-4">
                  <i className="ti ti-home me-2"></i>
                  Pagina principală
                </Link>
              </div>
            </div>
          </div>
          
          <div className="mt-4">
            <h3 className="h5 mb-3">Nu găsești ce cauți?</h3>
            <div className="d-flex justify-content-center gap-3">
              <Link to="/plaje" className="btn btn-sm btn-outline-secondary">
                <i className="ti ti-beach me-1"></i>
                Explorează plajele
              </Link>
              <Link to="/contact" className="btn btn-sm btn-outline-secondary">
                <i className="ti ti-mail me-1"></i>
                Contactează-ne
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;