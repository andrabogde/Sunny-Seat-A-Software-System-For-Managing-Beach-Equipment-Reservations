import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { IconArrowLeft, IconClock, IconShare, IconBookmark, IconHeart } from '@tabler/icons-react';

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
 * Pagina cu articol despre accesoriile esențiale pentru plajă
 */
const AccesoriiEsentiale = () => {
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
      {/* Header articol cu imagine full-width */}
      <header 
        className="article-header position-relative text-white d-flex align-items-center"
        style={{
          height: '60vh',
          minHeight: '400px',
          backgroundImage: `url(/images/beach-accessories.jpg)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
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
            style={{ backgroundColor: colors.turquoise }}
          >
            Sfaturi
          </span>
          
          <h1 className="display-4 fw-bold mb-4" style={{ maxWidth: '800px' }}>
            Top 3 Accesorii Esențiale pentru o Zi Perfectă la Plajă
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
              <span>3 min citire</span>
            </div>
            
            <div className="d-flex align-items-center">
              <span>10 mai 2025</span>
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
                Descoperă accesoriile care transformă o zi normală la plajă într-o experiență memorabilă. De la umbrele moderne la jocuri distractive, acestea te vor ajuta să te bucuri la maximum de timpul petrecut pe plajă.
              </p>
              
              <hr className="my-5" style={{ opacity: 0.1 }} />
            </div>
            
            {/* Secțiune 1 */}
            <div 
              ref={addToRefs}
              className="article-section fade-in-section mb-5"
            >
              <div className="row align-items-center">
                <div className="col-md-6 mb-4 mb-md-0">
                  <h2 className="h3 fw-bold mb-4" style={{ color: colors.turquoise }}>
                    Umbrela de plajă premium
                  </h2>
                  <p className="text-muted">
                    Alegerea unei umbrele de calitate poate face diferența între o zi relaxantă la plajă și una inconfortabilă. Gasiţi plaje cu umbrele premium care oferă protecție UV ridicată și sunt stabile chiar și în condiții de vânt moderat, optând pentru astfel de facilități, veți beneficia de confortul unor materiale superioare.
                  </p>
                </div>
                <div className="col-md-6">
                  <div 
                    className="image-container overflow-hidden rounded-4 shadow-sm"
                    style={{ height: '300px' }}
                  >
                    <img 
                      src="/images/premium-umbrella.jpg" 
                      alt="Umbrela de plajă premium"
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
              <div className="row align-items-center flex-row-reverse">
                <div className="col-md-6 mb-4 mb-md-0">
                  <h2 className="h3 fw-bold mb-4" style={{ color: colors.turquoise }}>
                    Suport pentru băuturi
                  </h2>
                  <p className="text-muted">
                  Când vă alegeți locul pe plajă, nu subestimați importanța unui suport pentru băuturi integrat în șezlong. Acesta este un mic detaliu, dar esențial pentru a vă menține băuturile curate, ferite de nisip și la îndemână. Asigurați-vă că facilitățile alese oferă astfel de suporturi, preferabil durabile și ușor de întreținut, pentru o relaxare neîntreruptă.
                  </p>
                </div>
                <div className="col-md-6">
                  <div 
                    className="image-container overflow-hidden rounded-4 shadow-sm"
                    style={{ height: '300px' }}
                  >
                    <img 
                      src="/images/drink-holder.jpg" 
                      alt="Suport pentru băuturi"
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
              <div className="row align-items-center">
                <div className="col-md-6 mb-4 mb-md-0">
                  <h2 className="h3 fw-bold mb-4" style={{ color: colors.turquoise }}>
                    Pernă pentru șezlong
                  </h2>
                  <p className="text-muted">
                  Pentru o experiență desăvârșită la plajă, prioritizați alegerea plajelor care vă pun la dispoziție șezlonguri echipate cu perne speciale. Confortul dumneavoastră va fi sporit considerabil, iar relaxarea totală. Ideal ar fi ca aceste perne să fie rezistente la apă și ușor de curățat, adăugând un plus de practicitate. Căutați șezlongurile ale căror perne sunt confecționate din materiale respirabile, cu un design anatomic: acestea vă vor asigura un confort optim și o senzație plăcută chiar și în cele mai călduroase zile de vară.
                  </p>
                </div>
                <div className="col-md-6">
                  <div 
                    className="image-container overflow-hidden rounded-4 shadow-sm"
                    style={{ height: '300px' }}
                  >
                    <img 
                      src="/images/sunbed-pillow.jpg" 
                      alt="Pernă pentru șezlong"
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
            
            {/* Sfaturi utile */}
            <div 
              ref={addToRefs}
              className="article-section fade-in-section mt-5 mb-5"
            >
              <div 
                className="tips-container p-4 rounded-4"
                style={{ 
                  backgroundColor: `${colors.turquoise}10`,
                  border: `1px solid ${colors.turquoise}30`
                }}
              >
                <h3 className="h4 fw-bold mb-4" style={{ color: colors.turquoise }}>
                  Sfaturi utile:
                </h3>
                
                <ul className="mb-0 ps-3">
                  <li className="mb-3">
                    Alege o umbrelă cu protecție UV de minim 50+ pentru protecție maximă
                  </li>
                  <li className="mb-3">
                    Caută suporturi pentru băuturi care se pot înfige în nisip sau atașa de șezlong
                  </li>
                  <li className="mb-3">
                    Pernele pentru șezlong ar trebui să fie rezistente la apă și cu uscare rapidă
                  </li>
                  <li className="mb-3">
                    Optează pentru accesorii în culori deschise, care absorb mai puțin căldura soarelui
                  </li>
                </ul>
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
            }
          }
        `}
      </style>
    </div>
  );
};

export default AccesoriiEsentiale;