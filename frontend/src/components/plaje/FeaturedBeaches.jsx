import React from 'react';
import { Link } from 'react-router-dom';
import { IconMapPin, IconStar, IconArrowRight, IconUmbrella, IconWaves } from '@tabler/icons-react';

const FeaturedBeaches = ({ plaje }) => {
  // Verificare inițială dacă avem date
  if (!plaje || plaje.length === 0) {
    return null;
  }

  // Număr de plaje populare de afișat
  const NUMAR_PLAJE_POPULARE = 3;

  // Sortăm plajele după numărul de recenzii
  const plajePopulare = [...plaje]
    .sort((a, b) => {
      // Extrage numărul de recenzii, cu valori default 0 dacă nu există
      const recenziiA = a.detaliiWeb?.numarRecenzii || 0;
      const recenziiB = b.detaliiWeb?.numarRecenzii || 0;

      // Sortează descrescător DOAR după numărul de recenzii
      return recenziiB - recenziiA;
    })
    .slice(0, NUMAR_PLAJE_POPULARE);

  // Definim culorile personalizate pentru interfață
  const colors = {
    primary: '#3498db',     // Albastru
    secondary: '#2ecc71',   // Verde
    accent: '#f39c12',      // Portocaliu
    turquoise: '#20c997',   // Turcoaz
    dark: '#2c3e50',        // Albastru închis
    light: '#ecf0f1'        // Gri deschis
  };

  return (
    <section className="py-5 my-5">
      <div className="container">
        {/* Header secțiune */}
        <div className="row mb-5">
          <div className="col-lg-6">
            <h2 className="fw-bold mb-4 position-relative border-start ps-4" 
                style={{ 
                  borderLeftWidth: '4px !important', 
                  borderLeftColor: `${colors.turquoise} !important` 
                }}>
              Plaje Populare
            </h2>
            <div className="d-flex align-items-center mb-4">
              <IconWaves size={22} className="me-2 text-primary" />
              <p className="lead mb-0">Descoperă cele mai populare plaje din România.</p>
            </div>
          </div>
          <div className="col-lg-6 d-flex align-items-center justify-content-lg-end mt-4 mt-lg-0">
            <Link to="/plaje" className="btn btn-outline-primary rounded-pill px-4">
              Vezi toate plajele <IconArrowRight size={18} className="ms-2" />
            </Link>
          </div>
        </div>
        
        {/* Plaje cards modern style */}
        <div className="row g-4">
          {plajePopulare.map(plaja => (
            <div key={plaja.id} className="col-md-4">
              <div className="card border-0 rounded-4 shadow-sm overflow-hidden h-100 hover-lift"
                   style={{ 
                     transition: 'all 0.3s ease',
                     transform: 'translateY(0)',
                   }}
                   onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-10px)'}
                   onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div className="position-relative">
                  <img 
                    src={plaja.detaliiWeb?.images?.[0] || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e"}
                    className="card-img-top" 
                    alt={plaja.denumire}
                    style={{ height: '240px', objectFit: 'cover' }}
                  />
                  <div className="position-absolute bottom-0 start-0 end-0 p-4 text-white" 
                       style={{ 
                         background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                         paddingTop: '100px' 
                       }}>
                    <div className="d-flex align-items-center mb-2">
                      <span className="badge rounded-pill px-3 py-2 me-2" 
                            style={{ backgroundColor: colors.turquoise }}>
                        <IconUmbrella size={14} className="me-1" />
                        Plajă
                      </span>
                      {plaja.detaliiWeb?.rating && (
                        <span className="badge rounded-pill px-3 py-2" 
                              style={{ backgroundColor: colors.accent }}>
                          <IconStar size={14} className="me-1" />
                          {plaja.detaliiWeb.rating.toFixed(1)}
                        </span>
                      )}
                    </div>
                    <h3 className="h5 fw-bold mb-1">{plaja.denumire}</h3>
                    {plaja.statiune?.denumire && (
                      <p className="mb-0 d-flex align-items-center small">
                        <IconMapPin size={14} className="me-1" />
                        {plaja.statiune.denumire}
                      </p>
                    )}
                  </div>
                 
                  {/* Număr de recenzii badge */}
                  {typeof plaja.detaliiWeb?.numarRecenzii !== 'undefined' && (
                    <div className="position-absolute top-0 end-0 m-3 px-3 py-2 rounded-pill bg-white d-flex align-items-center" 
                         style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                      <span className="fw-bold me-1">{plaja.detaliiWeb.numarRecenzii}</span>
                      <span className="small text-muted">{plaja.detaliiWeb.numarRecenzii === 1 ? 'recenzie' : 'recenzii'}</span>
                    </div>
                  )}
                </div>
                
                <div className="card-body p-4">
                  <p className="card-text text-muted mb-4">
                    {plaja.descriere 
                      ? (plaja.descriere.length > 120 ? plaja.descriere.substring(0, 120) + '...' : plaja.descriere)
                      : 'Descoperă această plajă minunată din ' + (plaja.statiune?.denumire || 'România') + '.'}
                  </p>
                  <div className="d-flex align-items-center justify-content-between mt-auto pt-3 border-top">
                    <div className="small text-muted">
                      {plaja.detaliiWeb?.sezlonguri && (
                        <span className="d-block">
                          {plaja.detaliiWeb.sezlonguri} șezlonguri disponibile
                        </span>
                      )}
                    </div>
                    <Link to={`/plaja/${plaja.id}`} className="btn btn-sm btn-primary rounded-pill px-3">
                      Vezi detalii
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedBeaches;