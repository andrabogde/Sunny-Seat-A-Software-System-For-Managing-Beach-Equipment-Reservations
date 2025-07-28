import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { IconArrowLeft, IconClock, IconShare, IconBookmark, IconHeart, IconCheck } from '@tabler/icons-react';

// Definim culorile personalizate
const colors = {
  primary: '#3498db',     // Albastru
  secondary: '#2ecc71',   // Verde
  accent: '#f39c12',      // Portocaliu
  turquoise: '#20c997',   // Turcoaz
  dark: '#2c3e50',        // Albastru închis
  light: '#ecf0f1'        // Gri deschis
};

/**
 * Pagina cu articol despre alegerea șezlongului ideal
 */
const AlegereaSezlongului = () => {
  // Referință pentru elementele animate
  const sectionRefs = useRef([]);
  
  // Configurarea animațiilor la scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    
    // Observă toate secțiunile pentru animații
    sectionRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });
    
    return () => {
      sectionRefs.current.forEach((el) => {
        if (el) observer.unobserve(el);
      });
    };
  }, []);
  
  // Adaugă elemente la array-ul de referințe
  const addToRefs = (el) => {
    if (el && !sectionRefs.current.includes(el)) {
      sectionRefs.current.push(el);
    }
  };
  
  return (
    <div className="blog-article-page">
      {/* Header articol cu imagine parallax */}
      <header 
        className="article-header position-relative text-white d-flex align-items-center"
        style={{
          height: '60vh',
          minHeight: '400px',
          backgroundImage: `url(/images/sunbed-choice.jpg)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          marginBottom: '3rem'
        }}
      >
        <div 
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.7))'
          }}
        ></div>
        
        <div className="container position-relative z-1">
          <Link 
            to="/" 
            className="btn btn-sm btn-light rounded-pill d-inline-flex align-items-center mb-4 px-3 py-2"
          >
            <IconArrowLeft size={16} className="me-2" />
            Înapoi la pagina principală
          </Link>
          
          <span 
            className="badge rounded-pill px-3 py-2 mb-4 d-inline-block"
            style={{ backgroundColor: colors.primary }}
          >
            Ghid
          </span>
          
          <h1 className="display-4 fw-bold mb-4" style={{ maxWidth: '800px' }}>
            Cum Alegi Șezlongul Ideal pentru Nevoile Tale
          </h1>
          
          <div className="d-flex flex-wrap align-items-center gap-4 text-white-50">
            <div className="d-flex align-items-center">
              <img 
                src="/images/SunnySeat.png" 
                alt="Avatar" 
                className="rounded-circle me-2"
                width="30"
                height="30"
              />
              <span>Echipa SunnySeat</span>
            </div>
            
            <div className="d-flex align-items-center">
              <IconClock size={18} className="me-2" />
              <span>4 min citire</span>
            </div>
            
            <div className="d-flex align-items-center">
              <span>8 mai 2025</span>
            </div>
          </div>
        </div>
      </header>
      
      {/* Conținut articol */}
      <div className="container py-5">
        <div className="row">
          <div className="col-lg-8 mx-auto">
            {/* Introducere */}
            <div 
              ref={addToRefs}
              className="article-section fade-in-section mb-5"
            >
              <p className="lead mb-5">
                Ghidul nostru te ajută să alegi șezlongul perfect în funcție de preferințele tale. Confort, design și funcționalitate pentru relaxare maximă la plajă. Descoperă cum să faci alegerea potrivită pentru tine.
              </p>
              
              <hr className="my-5" style={{ opacity: 0.1 }} />
            </div>
            
            {/* Secțiune 1 */}
            <div 
              ref={addToRefs}
              className="article-section fade-in-section mb-5"
            >
              <div className="row align-items-center flex-row-reverse">
                <div className="col-md-6 mb-4 mb-md-0">
                  <h2 className="h3 fw-bold mb-4" style={{ color: colors.primary }}>
                    Tipuri de șezlonguri
                  </h2>
                  <p className="text-muted mb-4">
                    Există mai multe tipuri de șezlonguri disponibile, de la cele clasice fixe până la cele reglabile care permit poziționare în multiple unghiuri. Șezlongurile reglabile sunt ideale pentru cei care alternează între lectură și bronzat.
                  </p>
                  <p className="text-muted">
                    Unele modele oferă opțiuni de pliere completă, fiind ideale pentru transportul și depozitarea acasă, în timp ce altele rămân fixe dar oferă un confort superior pe termen lung.
                  </p>
                </div>
                <div className="col-md-6">
                  <div 
                    className="image-container overflow-hidden rounded-4 shadow-sm"
                    style={{ height: '300px' }}
                  >
                    <img 
                      src="/images/sunbed-types.jpg" 
                      alt="Tipuri de șezlonguri"
                      className="w-100 h-100 image-zoom"
                      style={{ 
                        objectFit: 'cover',
                        transition: 'transform 0.5s ease-in-out'
                      }}
                    />
                  </div>
                </div>
              </div>
              
              <hr className="my-5" style={{ opacity: 0.1 }} />
            </div>
            
            {/* Secțiune 2 */}
            <div 
              ref={addToRefs}
              className="article-section fade-in-section mb-5"
            >
              <div className="row align-items-center">
                <div className="col-md-6 mb-4 mb-md-0">
                  <h2 className="h3 fw-bold mb-4" style={{ color: colors.primary }}>
                    Materialele contează
                  </h2>
                  <p className="text-muted mb-4">
                    Șezlongurile moderne sunt construite din materiale diverse, de la lemn și metal până la ratan și plastic. Materialele influențează nu doar estetica, ci și durabilitatea și confortul șezlongului.
                  </p>
                  <p className="text-muted">
                    Aluminiul este ușor și rezistent la coroziune, lemnul oferă un aspect natural și elegant, în timp ce materialele textile de calitate precum Textilene asigură respirabilitate și uscare rapidă.
                  </p>
                </div>
                <div className="col-md-6">
                  <div 
                    className="image-container overflow-hidden rounded-4 shadow-sm"
                    style={{ height: '300px' }}
                  >
                    <img 
                      src="/images/sunbed-materials.jpg" 
                      alt="Materiale pentru șezlonguri"
                      className="w-100 h-100 image-zoom"
                      style={{ 
                        objectFit: 'cover',
                        transition: 'transform 0.5s ease-in-out'
                      }}
                    />
                  </div>
                </div>
              </div>
              
              <hr className="my-5" style={{ opacity: 0.1 }} />
            </div>
            
            {/* Secțiune 3 */}
            <div 
              ref={addToRefs}
              className="article-section fade-in-section mb-5"
            >
              <div className="row align-items-center flex-row-reverse">
                <div className="col-md-6 mb-4 mb-md-0">
                  <h2 className="h3 fw-bold mb-4" style={{ color: colors.primary }}>
                    Șezlonguri premium
                  </h2>
                  <p className="text-muted">
                    Dacă îți dorești un confort sporit, șezlongurile premium vin cu caracteristici precum perne integrate, copertine pentru protecție solară și suporturi pentru băuturi. Acestea oferă cea mai bună experiență la plajă, fiind ideale pentru cei care petrec multe ore la soare și apreciază confortul de înaltă calitate.
                  </p>
                </div>
                <div className="col-md-6">
                  <div 
                    className="image-container overflow-hidden rounded-4 shadow-sm"
                    style={{ height: '300px' }}
                  >
                    <img 
                      src="/images/premium-sunbed.jpg" 
                      alt="Șezlonguri premium"
                      className="w-100 h-100 image-zoom"
                      style={{ 
                        objectFit: 'cover',
                        transition: 'transform 0.5s ease-in-out'
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Secțiune comparativă - tabel */}
            <div 
              ref={addToRefs}
              className="article-section fade-in-section my-5"
            >
              <h3 className="h4 fw-bold mb-4" style={{ color: colors.primary }}>
                Comparație rapidă
              </h3>
              
              <div className="table-responsive">
                <table className="table table-bordered">
                  <thead style={{ backgroundColor: `${colors.primary}10` }}>
                    <tr>
                      <th>Tip șezlong</th>
                      <th>Confort</th>
                      <th>Portabilitate</th>
                      <th>Durabilitate</th>
                      <th>Ideal pentru</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Clasic fix</td>
                      <td>⭐⭐⭐</td>
                      <td>⭐</td>
                      <td>⭐⭐⭐⭐</td>
                      <td>Plaje amenajate</td>
                    </tr>
                    <tr>
                      <td>Reglabil</td>
                      <td>⭐⭐⭐⭐</td>
                      <td>⭐⭐</td>
                      <td>⭐⭐⭐</td>
                      <td>Utilizatori diverși</td>
                    </tr>
                    <tr>
                      <td>Pliabil</td>
                      <td>⭐⭐</td>
                      <td>⭐⭐⭐⭐⭐</td>
                      <td>⭐⭐</td>
                      <td>Călătorii</td>
                    </tr>
                    <tr>
                      <td>Premium</td>
                      <td>⭐⭐⭐⭐⭐</td>
                      <td>⭐⭐</td>
                      <td>⭐⭐⭐⭐⭐</td>
                      <td>Confort maxim</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* Sfaturi utile */}
            <div 
              ref={addToRefs}
              className="article-section fade-in-section mt-5 mb-5"
            >
              <div 
                className="tips-container p-4 rounded-4"
                style={{ 
                  backgroundColor: `${colors.primary}10`,
                  border: `1px solid ${colors.primary}30`
                }}
              >
                <h3 className="h4 fw-bold mb-4" style={{ color: colors.primary }}>
                  Sfaturi pentru alegerea șezlongului ideal:
                </h3>
                
                <div className="row">
                  <div className="col-md-6">
                    <div className="d-flex mb-3">
                      <div className="flex-shrink-0 me-2">
                        <div className="d-flex align-items-center justify-content-center rounded-circle" style={{ width: '24px', height: '24px', backgroundColor: colors.primary }}>
                          <IconCheck size={16} color="white" />
                        </div>
                      </div>
                      <div>
                        Verifică greutatea maximă suportată de șezlong
                      </div>
                    </div>
                    
                    <div className="d-flex mb-3">
                      <div className="flex-shrink-0 me-2">
                        <div className="d-flex align-items-center justify-content-center rounded-circle" style={{ width: '24px', height: '24px', backgroundColor: colors.primary }}>
                          <IconCheck size={16} color="white" />
                        </div>
                      </div>
                      <div>
                        Alege șezlonguri cu cadre din aluminiu pentru rezistență la coroziune
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-md-6">
                    <div className="d-flex mb-3">
                      <div className="flex-shrink-0 me-2">
                        <div className="d-flex align-items-center justify-content-center rounded-circle" style={{ width: '24px', height: '24px', backgroundColor: colors.primary }}>
                          <IconCheck size={16} color="white" />
                        </div>
                      </div>
                      <div>
                        Materialele textile precum Textilene sunt ideale datorită durabilității
                      </div>
                    </div>
                    
                    <div className="d-flex mb-3">
                      <div className="flex-shrink-0 me-2">
                        <div className="d-flex align-items-center justify-content-center rounded-circle" style={{ width: '24px', height: '24px', backgroundColor: colors.primary }}>
                          <IconCheck size={16} color="white" />
                        </div>
                      </div>
                      <div>
                        Pentru escapade la plajă, optează pentru un șezlong pliabil ușor
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Butoane acțiuni */}
            <div className="d-flex justify-content-between align-items-center mt-5 pt-4 border-top">
              <div className="d-flex gap-3">
                <button 
                  className="btn btn-light rounded-circle p-2"
                  style={{ width: '40px', height: '40px' }}
                >
                  <IconHeart size={20} color={colors.accent} />
                </button>
                <button 
                  className="btn btn-light rounded-circle p-2"
                  style={{ width: '40px', height: '40px' }}
                >
                  <IconBookmark size={20} color={colors.primary} />
                </button>
                <button 
                  className="btn btn-light rounded-circle p-2"
                  style={{ width: '40px', height: '40px' }}
                >
                  <IconShare size={20} color={colors.turquoise} />
                </button>
              </div>
              
              <Link 
                to="/" 
                className="btn btn-outline-primary rounded-pill px-4"
              >
                Înapoi la pagina principală
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Adaugă stilurile pentru animații */}
      <style>
        {`
          .fade-in-section {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.6s ease-out, transform 0.6s ease-out;
          }
          
          .fade-in-section.animate-in {
            opacity: 1;
            transform: translateY(0);
          }
          
          .image-zoom:hover {
            transform: scale(1.05);
          }
          
          @media (max-width: 768px) {
            .article-header {
              height: 40vh;
              background-attachment: scroll;
            }
          }
        `}
      </style>
    </div>
  );
};

export default AlegereaSezlongului;