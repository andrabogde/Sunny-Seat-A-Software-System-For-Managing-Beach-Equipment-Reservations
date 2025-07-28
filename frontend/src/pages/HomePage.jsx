import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { IconBeach, IconArrowRight, IconWaveSine, IconSun, IconWind, IconUmbrella, IconMapPin, IconCrown, IconStar, IconUsers, IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import PlajasList from '../components/plaje/PlajasList';
import ApiClient from "../api/src/ApiClient";
import PlajaControllerApi from "../api/src/api/PlajaControllerApi";
// Acest import poate să nu funcționeze în toate configurațiile
import plajaSezlonguri from '../../public/images/beach.jpg';
// Definim culorile personalizate
const colors = {
  primary: '#3498db',     // Albastru
  secondary: '#2ecc71',   // Verde
  accent: '#f39c12',      // Portocaliu
  turquoise: '#20c997',   // Turcoaz
  dark: '#2c3e50',        // Albastru închis
  light: '#ecf0f1'        // Gri deschis
};

// Inițializăm client-ul API
const apiClient = new ApiClient();
apiClient.enableCookies = true;
const plajaApi = new PlajaControllerApi(apiClient);

/**
 * Componentă Hero Section modernă cu statistici
 * Implementată corespunzător cu designul aplicației
 */
const HeroSection = () => {
  return (
    <div className="position-relative">
      {/* Imagine fundal și overlay */}
      <div
        className="hero-section position-relative overflow-hidden"
        style={{
          minHeight: '100vh',
          backgroundImage: 'url("https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2000&q=80")',
          backgroundSize: 'cover',
          backgroundPosition: 'center bottom',
          paddingTop: '120px',
          paddingBottom: '240px' // Spațiu suplimentar pentru cardurile de statistici
        }}
      >
        <div
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{
            background: 'linear-gradient(to right, rgba(0,0,0,0.6), rgba(0,0,0,0.3))',
            zIndex: 0
          }}
        />

        {/* Conținut Hero */}
        <div className="container position-relative" style={{ zIndex: 2 }}>
          <div className="row">
            <div className="col-lg-8 col-md-10 text-white">
              <div
                className="badge mb-4 px-3 py-2"
                style={{
                  backgroundColor: '#2196f3',
                  borderRadius: '50px',
                  fontSize: '14px'
                }}
              >
                Descoperă plajele din România
              </div>

              <h1 className="display-1 fw-bold mb-4" style={{ lineHeight: '1.1' }}>
                Experiența <span style={{ color: '#20c997' }}>Perfectă</span> la <br />Plajă
              </h1>

              <p className="lead mb-5" style={{ maxWidth: '600px', fontSize: '1.2rem' }}>
                Rezervă-ți locul la cele mai frumoase plaje din România. Șezlonguri, umbrele, activități și mai mult într-un singur loc.
              </p>
              <div className="d-flex flex-wrap gap-3 mb-5">
                <Link
                  to="/statiuni"
                  className="btn btn-primary px-4 py-3"
                  style={{
                    borderRadius: '50px',
                    fontSize: '1rem',
                    fontWeight: '500',
                    boxShadow: '0 8px 15px rgba(33, 150, 243, 0.3)',
                    minWidth: '200px',
                    textAlign: 'center'
                  }}
                >
                  Descoperă Stațiunile
                </Link>
                <Link
                  to="/plaje"
                  className="btn btn-outline-light px-4 py-3"
                  style={{
                    borderRadius: '50px',
                    fontSize: '1rem',
                    fontWeight: '500',
                    minWidth: '200px',
                    textAlign: 'center'
                  }}
                >
                  Rezervă Acum
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Carduri statistici */}
      <div className="container" style={{
        marginTop: '-120px',
        zIndex: 10,
        position: 'relative'
      }}>
        <div className="row">
          <div className="col-12">
            <div className="row g-4 justify-content-center">
              {/* Statistică 1 */}
              <div className="col-lg-3 col-md-6">
                <div
                  className="card text-center border-0 h-100 py-4"
                  style={{
                    background: 'white',
                    borderRadius: '16px',
                    boxShadow: '0 15px 30px rgba(0, 0, 0, 0.1)',
                    transition: 'transform 0.3s ease'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-10px)'}
                  onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <div className="card-body">
                    <div
                      className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
                      style={{
                        width: '80px',
                        height: '80px',
                        backgroundColor: '#3498db',
                      }}
                    >
                      <IconUmbrella size={36} color="white" />
                    </div>
                    <h2
                      className="display-5 fw-bold mb-2"
                      style={{ color: '#3498db' }}
                    >
                      30+
                    </h2>
                    <p className="mb-0 text-muted" style={{ fontSize: '1rem' }}>
                      Plaje în România
                    </p>
                  </div>
                </div>
              </div>

              {/* Statistică 2 */}
              <div className="col-lg-3 col-md-6">
                <div
                  className="card text-center border-0 h-100 py-4"
                  style={{
                    background: 'white',
                    borderRadius: '16px',
                    boxShadow: '0 15px 30px rgba(0, 0, 0, 0.1)',
                    transition: 'transform 0.3s ease'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-10px)'}
                  onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <div className="card-body">
                    <div
                      className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
                      style={{
                        width: '80px',
                        height: '80px',
                        backgroundColor: '#20c997',
                      }}
                    >
                      <IconSun size={36} color="white" />
                    </div>
                    <h2
                      className="display-5 fw-bold mb-2"
                      style={{ color: '#20c997' }}
                    >
                      5K+
                    </h2>
                    <p className="mb-0 text-muted" style={{ fontSize: '1rem' }}>
                      Șezlonguri disponibile
                    </p>
                  </div>
                </div>
              </div>

              {/* Statistică 3 */}
              <div className="col-lg-3 col-md-6">
                <div
                  className="card text-center border-0 h-100 py-4"
                  style={{
                    background: 'white',
                    borderRadius: '16px',
                    boxShadow: '0 15px 30px rgba(0, 0, 0, 0.1)',
                    transition: 'transform 0.3s ease'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-10px)'}
                  onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <div className="card-body">
                    <div
                      className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
                      style={{
                        width: '80px',
                        height: '80px',
                        backgroundColor: '#f39c12',
                      }}
                    >
                      <IconUsers size={36} color="white" />
                    </div>
                    <h2
                      className="display-5 fw-bold mb-2"
                      style={{ color: '#f39c12' }}
                    >
                      10K+
                    </h2>
                    <p className="mb-0 text-muted" style={{ fontSize: '1rem' }}>
                      Rezervări lunare
                    </p>
                  </div>
                </div>
              </div>

              {/* Statistică 4 */}
              <div className="col-lg-3 col-md-6">
                <div
                  className="card text-center border-0 h-100 py-4"
                  style={{
                    background: 'white',
                    borderRadius: '16px',
                    boxShadow: '0 15px 30px rgba(0, 0, 0, 0.1)',
                    transition: 'transform 0.3s ease'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-10px)'}
                  onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <div className="card-body">
                    <div
                      className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
                      style={{
                        width: '80px',
                        height: '80px',
                        backgroundColor: '#2ecc71',
                      }}
                    >
                      <IconStar size={36} color="white" />
                    </div>
                    <h2
                      className="display-5 fw-bold mb-2"
                      style={{ color: '#2ecc71' }}
                    >
                      4.8
                    </h2>
                    <p className="mb-0 text-muted" style={{ fontSize: '1rem' }}>
                      Rating mediu
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Efect de undă */}
      <div className="position-absolute bottom-0 start-0 w-100">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" style={{
          display: 'block',
          width: '100%',
          height: 'auto',
          marginBottom: '-2px'
        }}>
          <path fill="#ffffff" fillOpacity="1" d="M0,288L48,272C96,256,192,224,288,208C384,192,480,192,576,197.3C672,203,768,213,864,213.3C960,213,1056,203,1152,208C1248,213,1344,235,1392,245.3L1440,256L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </div>
    </div>
  );
};

/**
 * Componentă Carusel Lifestyle nou
 * Prezintă diferite scenarii de utilizare a echipamentelor de plajă
 */
const LifestyleCarousel = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const totalSlides = 3;
  const intervalRef = useRef(null);
  
  const nextSlide = () => {
    setActiveSlide(current => (current + 1) % totalSlides);
  };
  
  const prevSlide = () => {
    setActiveSlide(current => (current - 1 + totalSlides) % totalSlides);
  };

  // Auto-play carusel
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      nextSlide();
    }, 5000);
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Oprește auto-play la hover
  const pauseCarousel = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  // Repornește auto-play după hover
  const resumeCarousel = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = setInterval(() => {
      nextSlide();
    }, 5000);
  };

  const slidesData = [
    {
      id: 1,
      title: "Relaxare cu Familia",
      subtitle: "Creați amintiri de neuitat cu cei dragi",
      description: "Echipamentele noastre gonflabile asigură distracție garantată pentru copii, în timp ce părinții se pot relaxa pe șezlonguri confortabile, toate la umbra unei umbrele elegante.",
      image: "/images/family.png",
      iconColor: colors.primary
    },
    {
      id: 2,
      title: "Experiență Premium pentru Cupluri",
      subtitle: "Momente perfecte la malul mării",
      description: "Baldachinele noastre premium creează atmosfera ideală pentru momente romantice la plajă. Servicii de calitate pentru cupluri care apreciază confortul și intimitatea.",
      image: "/images/cuplu.jpg",
      iconColor: colors.turquoise
    },
    {
      id: 3,
      title: "Aventură cu Prietenii",
      subtitle: "Activități și sporturi nautice pentru grupuri",
      description: "De la echipamente de snorkeling până la gonflabile și jet ski, oferim tot ce ai nevoie pentru o zi plină de aventură la plajă alături de prieteni.",
      image: "/images/watersports.png",
      iconColor: colors.accent
    }
  ];

  return (
    <section className="py-5 lifestyle-carousel bg-light position-relative overflow-hidden">
      <div className="container py-5">
        {/* Header secțiune */}
        <div className="row mb-4 text-center">
          <div className="col-lg-8 mx-auto">
            <h2 className="fw-bold mb-4">Trăiește Experiența <span style={{ color: colors.turquoise }}>SunnySeat</span></h2>
            <p className="lead mb-0">Descoperă cum echipamentele noastre transformă o zi obișnuită la plajă într-o experiență memorabilă</p>
          </div>
        </div>

        {/* Carusel */}
        <div 
          className="position-relative mt-5 carousel-container"
          onMouseEnter={pauseCarousel}
          onMouseLeave={resumeCarousel}
          style={{ borderRadius: '20px', overflow: 'hidden' }}
        >
          <div 
            className="slides-wrapper" 
            style={{ 
              display: 'flex', 
              transition: 'transform 0.8s ease-in-out',
              transform: `translateX(-${activeSlide * 100}%)`
            }}
          >
            {slidesData.map((slide, index) => (
              <div 
                key={slide.id} 
                className="carousel-slide" 
                style={{ 
                  minWidth: '100%',
                  position: 'relative',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)'
                }}
              >
                <div 
                  className="slide-bg" 
                  style={{ 
                    backgroundImage: `url(${slide.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    height: '600px',
                    width: '100%'
                  }}
                >
                  <div 
                    className="overlay" 
                    style={{ 
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      background: 'linear-gradient(to right, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.2) 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      padding: '3rem'
                    }}
                  >
                    <div className="container">
                      <div className="row">
                        <div className="col-lg-6">
                          <div 
                            className="slide-content text-white"
                            style={{
                              opacity: activeSlide === index ? 1 : 0,
                              transform: activeSlide === index ? 'translateY(0)' : 'translateY(20px)',
                              transition: 'all 0.8s ease-in-out 0.2s'
                            }}
                          >
                            <div 
                              className="slide-badge mb-4 d-inline-block px-3 py-2 rounded-pill"
                              style={{ backgroundColor: slide.iconColor }}
                            >
                              {index === 0 && <IconUsers size={16} className="me-2" />}
                              {index === 1 && <IconStar size={16} className="me-2" />}
                              {index === 2 && <IconBeach size={16} className="me-2" />}
                              {slide.subtitle}
                            </div>
                            <h2 className="display-4 fw-bold mb-4">{slide.title}</h2>
                            <p className="lead mb-5" style={{ maxWidth: '600px' }}>
                              {slide.description}
                            </p>
{/* Butonul a fost eliminat */}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Controale carusel */}
          <button 
            className="carousel-control prev"
            onClick={prevSlide}
            style={{
              position: 'absolute',
              top: '50%',
              left: '20px',
              transform: 'translateY(-50%)',
              backgroundColor: 'white',
              border: 'none',
              borderRadius: '50%',
              width: '50px',
              height: '50px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
              cursor: 'pointer',
              zIndex: 10,
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
              e.currentTarget.style.boxShadow = '0 6px 15px rgba(0, 0, 0, 0.15)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
              e.currentTarget.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.1)';
            }}
          >
            <IconChevronLeft size={24} color={colors.dark} />
          </button>
          <button 
            className="carousel-control next"
            onClick={nextSlide}
            style={{
              position: 'absolute',
              top: '50%',
              right: '20px',
              transform: 'translateY(-50%)',
              backgroundColor: 'white',
              border: 'none',
              borderRadius: '50%',
              width: '50px',
              height: '50px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
              cursor: 'pointer',
              zIndex: 10,
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
              e.currentTarget.style.boxShadow = '0 6px 15px rgba(0, 0, 0, 0.15)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
              e.currentTarget.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.1)';
            }}
          >
            <IconChevronRight size={24} color={colors.dark} />
          </button>

          {/* Indicatori */}
          <div 
            className="carousel-indicators"
            style={{
              position: 'absolute',
              bottom: '30px',
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              gap: '10px',
              zIndex: 10
            }}
          >
            {slidesData.map((_, index) => (
              <button
                key={index}
                className={`indicator ${activeSlide === index ? 'active' : ''}`}
                onClick={() => setActiveSlide(index)}
                style={{
                  width: activeSlide === index ? '40px' : '12px',
                  height: '12px',
                  borderRadius: '20px',
                  backgroundColor: activeSlide === index ? 'white' : 'rgba(255, 255, 255, 0.5)',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              />
            ))}
          </div>
        </div>
      </div>
      
      {/* Element decorativ - val */}
      <div className="position-absolute bottom-0 start-0 w-100" style={{ zIndex: 1 }}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" style={{ display: 'block', width: '100%' }}>
          <path fill="white" fillOpacity="1" d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"></path>
        </svg>
      </div>
    </section>
  );
};

/**
 * Pagina principală modernizată în stil Beach Club
 */
// Înlocuiește întregul useEffect și secțiunea "Plaje populare" din HomePage cu acest cod:

const HomePage = () => {
  const [plaje, setPlaje] = useState([]);
  const [featuredPlaje, setFeaturedPlaje] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Funcție helper pentru a obține imaginea plajei
  const getPlajaImage = (plaja) => {
    // Încearcă mai multe surse posibile pentru imagine
    const possibleImageSources = [
      plaja.detaliiWeb?.photos?.[0],
      plaja.detaliiWeb?.image,
      plaja.imagine,
      plaja.imagineUrl,
      plaja.photo,
      plaja.thumbnail,
      plaja.detaliiWeb?.primaryImage,
      plaja.detaliiWeb?.mainImage
    ];

    // Găsește prima imagine validă
    for (const imageSource of possibleImageSources) {
      if (imageSource && typeof imageSource === 'string' && imageSource.trim() !== '') {
        return imageSource;
      }
    }

    // Fallback către imagine default doar dacă nu există nicio imagine
    return "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2000&q=80";
  };

  useEffect(() => {
    // Funcție pentru încărcarea plajelor
    const loadPlaje = async () => {
      try {
        setLoading(true);

        // Folosim API-ul pentru a obține toate plajele
        plajaApi.getAllPlajeUsingGET((error, data) => {
          if (error) {
            console.error("Eroare la încărcarea plajelor:", error);
            setError("Nu s-au putut încărca plajele. Încercați din nou mai târziu.");
          } else {
            // Setăm toate plajele
            setPlaje(data || []);

            // Selectăm plajele cu cele mai multe recenzii pentru secțiunea "Featured"
            const sorted = [...(data || [])].sort((a, b) =>
              (b.detaliiWeb?.numarRecenzii || 0) - (a.detaliiWeb?.numarRecenzii || 0)
            );
            setFeaturedPlaje(sorted.slice(0, 3));

            // DEBUG: Adaugă aceste console.log-uri
            console.log("=== DEBUG PLAJE HOMEPAGE ===");
            console.log("Total plaje:", data?.length);
            console.log("Featured plaje:", sorted.slice(0, 3));
            
            sorted.slice(0, 3).forEach((plaja, index) => {
              console.log(`\n--- Plaja ${index + 1}: ${plaja.denumire} ---`);
              console.log("Întregul obiect plaja:", plaja);
              console.log("detaliiWeb:", plaja.detaliiWeb);
              console.log("images:", plaja.detaliiWeb?.images);
              console.log("Prima imagine:", plaja.detaliiWeb?.images?.[0]);
              
              // Verifică și alte posibile proprietăți pentru imagini
              console.log("Alte proprietăți posibile:");
              console.log("- plaja.imagine:", plaja.imagine);
              console.log("- plaja.imagineUrl:", plaja.imagineUrl);
              console.log("- plaja.photo:", plaja.photo);
              console.log("- plaja.thumbnail:", plaja.thumbnail);
              console.log("Imaginea care va fi folosită:", getPlajaImage(plaja));
            });
            console.log("=== SFÂRȘITUL DEBUG ===");

            setError(null);
          }
          setLoading(false);
        });
      } catch (err) {
        console.error("Eroare neașteptată:", err);
        setError("A apărut o eroare neașteptată. Încercați din nou mai târziu.");
        setLoading(false);
      }
    };

    loadPlaje();
  }, []);

  return (
    <>
      {/* Hero Section cu statistici integrate */}
      <HeroSection />

      {/* Secțiune Lifestyle Carusel */}
      <LifestyleCarousel />

      {/* Plaje populare - secțiune modernă cu fix pentru imagini */}
      {featuredPlaje.length > 0 && (
        <section className="py-5">
          <div className="container py-4">
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
                  <IconWaveSine size={22} className="me-2 text-primary" />
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
              {featuredPlaje.map(plaja => (
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
                        src={getPlajaImage(plaja)}
                        className="card-img-top"
                        alt={plaja.denumire}
                        style={{ height: '240px', objectFit: 'cover' }}
                        onError={(e) => {
                          console.log(`Eroare la încărcarea imaginii pentru ${plaja.denumire}:`, e.target.src);
                          // Fallback în caz că imaginea nu se încarcă
                          e.target.src = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2000&q=80";
                        }}
                        onLoad={(e) => {
                          console.log(`Imagine încărcată cu succes pentru ${plaja.denumire}:`, e.target.src);
                        }}
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
      )}



      {/* Secțiune Despre Noi */}
      <section className="py-5" style={{
        background: 'linear-gradient(to right, #f8f9fa, white)',
        overflow: 'hidden'
      }}>
        <div className="container py-5">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-5 mb-lg-0">
            <div className="position-relative" 
     style={{ 
       transform: 'translateY(0)', 
       transition: 'all 0.5s ease',
       animation: 'float 3s ease-in-out infinite alternate'
     }}>
  <img 
    src="/images/beach.jpg" 
    alt="Plajă cu șezlonguri" 
    className="img-fluid rounded-4 shadow-lg" 
    style={{ width: '100%', height: 'auto' }}
  />
  <div className="position-absolute top-0 end-0 translate-middle-y bg-white rounded-circle p-3 shadow-lg"
       style={{ marginRight: '-20px', marginTop: '70px', zIndex: 2 }}>
    <img 
      src="/images/SunnySeat.png" 
      alt="Logo SunnySeat" 
      className="rounded-circle" 
      style={{ width: '80px', height: '80px' , objectFit: 'cover' }}
    />
  </div>
  <style>
    {`
      @keyframes float {
        0% { transform: translateY(0px); }
        100% { transform: translateY(-15px); }
      }
    `}
  </style>
</div>
          </div>
          <div className="col-lg-6 ps-lg-5">
            <h2 className="fw-bold mb-4 position-relative" style={{ color: colors.dark }}>
              <span className="position-relative">
                Despre Sunny Seat
                <div style={{
                  position: 'absolute',
                  bottom: '-10px',
                  left: '0',
                  width: '50%',
                  height: '4px',
                  background: colors.turquoise,
                  borderRadius: '2px'
                }}></div>
              </span>
            </h2>
            <p className="lead mb-4" style={{ color: colors.dark }}>
              Sunny Seat este platforma ta de rezervare a șezlongurilor și umbrelelor de plajă direct de pe telefon sau calculator, în câteva minute.
            </p>
            <p className="text-muted mb-4">
              Ne-am propus să facem experiența ta la plajă cât mai plăcută, eliminând stresul căutării unui loc și oferindu-ți posibilitatea de a-ți rezerva locul preferat înainte de a ajunge la destinație. Cu Sunny Seat, vacanța ta începe înainte de a ajunge la plajă!
            </p>
            <div className="d-flex flex-wrap gap-3 mt-4">
              <Link to="/despre-noi" className="btn px-4 py-3 rounded-pill" style={{
                backgroundColor: colors.accent,
                color: 'white',
                fontWeight: '600',
                boxShadow: `0 10px 20px ${colors.accent}40`,
                transition: 'all 0.3s ease'
              }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = `0 15px 25px ${colors.accent}60`;
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = `0 10px 20px ${colors.accent}40`;
                }}>
                Despre noi <IconArrowRight size={18} className="ms-2" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section >

        {/* Secțiune Mini-Blog / Sfaturi Utile - Carusel modern */}
        <section className="py-5 my-5 beach-tips-section position-relative overflow-hidden">
        <div className="container py-4">
          <div className="row text-center mb-5">
            <div className="col-lg-8 mx-auto">
              <h2 className="fw-bold mb-3">Inspirație pentru Ziua ta la Plajă</h2>
              <p className="text-muted">Descoperă sfaturi, idei și inspirație pentru o experiență perfectă la malul mării</p>
            </div>
          </div>
          
          <BlogCarousel />
        </div>
        
        {/* Element decorativ - val subtil */}
        <div className="position-absolute bottom-0 start-0 w-100" style={{ zIndex: 1, opacity: 0.5 }}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 100" style={{ display: 'block', width: '100%' }}>
            <path fill={colors.primary} fillOpacity="0.2" d="M0,32L60,42.7C120,53,240,75,360,74.7C480,75,600,53,720,48C840,43,960,53,1080,58.7C1200,64,1320,64,1380,64L1440,64L1440,120L1380,120C1320,120,1200,120,1080,120C960,120,840,120,720,120C600,120,480,120,360,120C240,120,120,120,60,120L0,120Z"></path>
          </svg>
        </div>
      </section>
    </>
  );
};

/**
 * Componentă Blog Carusel modern
 * Prezintă sfaturi utile și inspirație într-un format modern și aerisit
 */
/**
 * Componentă Blog Carusel modern
 * Prezintă sfaturi utile și inspirație într-un format modern și aerisit
 */
const BlogCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const totalItems = 3;
  const carouselRef = useRef(null);
  const autoplayIntervalRef = useRef(null);

  // Auto-play carusel
  useEffect(() => {
    autoplayIntervalRef.current = setInterval(() => {
      setActiveIndex(prevIndex => (prevIndex + 1) % totalItems);
    }, 6000);

    return () => {
      if (autoplayIntervalRef.current) {
        clearInterval(autoplayIntervalRef.current);
      }
    };
  }, []);

  // Datele pentru articolele de mini-blog
  const blogData = [
    {
      id: 1,
      title: "Top 3 Accesorii Esențiale pentru o Zi Perfectă la Plajă",
      excerpt: "Descoperă accesoriile care transformă o zi normală la plajă într-o experiență memorabilă. De la umbrele moderne la jocuri distractive.",
      image: "/images/beach-accessories.jpg",
      tag: "Sfaturi",
      color: colors.turquoise,
      readTime: "3 min",
      link: "/accesorii-esentiale"
    },
    {
      id: 2,
      title: "Cum Alegi Șezlongul Ideal pentru Nevoile Tale",
      excerpt: "Ghidul nostru te ajută să alegi șezlongul perfect în funcție de preferințele tale. Confort, design și funcționalitate pentru relaxare maximă.",
      image: "/images/sunbed-choice.jpg",
      tag: "Ghid",
      color: colors.primary,
      readTime: "4 min",
      link: "/alegerea-sezlongului"
    },
    {
      id: 3,
      title: "Activități Distractive cu Echipamentele Noastre Gonflabile",
      excerpt: "Ideile noastre pentru jocuri și activități cu echipamente gonflabile vor face ziua la plajă mai distractivă pentru toți membrii familiei.",
      image: "/images/beach-activities.jpg",
      tag: "Activități",
      color: colors.accent,
      readTime: "5 min",
      link: "/activitati-gonflabile"
    }
  ];

  return (
    <div className="blog-carousel position-relative">
      {/* Indicator progres */}
      <div className="progress mb-5" style={{ height: '2px', backgroundColor: 'rgba(0,0,0,0.05)' }}>
        <div 
          className="progress-bar" 
          role="progressbar"
          style={{ 
            width: `${(activeIndex + 1) / totalItems * 100}%`,
            backgroundColor: colors.turquoise,
            transition: 'width 0.5s ease-in-out'
          }}
          aria-valuenow={(activeIndex + 1) / totalItems * 100}
          aria-valuemin="0"
          aria-valuemax="100"
        ></div>
      </div>
      
      {/* Cards container cu efect de fade */}
      <div 
        className="row g-4 position-relative"
        ref={carouselRef}
      >
        {blogData.map((item, index) => (
          <div 
            key={item.id}
            className="col-lg-4 col-md-6"
            style={{
              opacity: activeIndex === index ? 1 : 0.4,
              transform: activeIndex === index ? 'scale(1)' : 'scale(0.98)',
              transition: 'all 0.5s ease',
              filter: activeIndex === index ? 'none' : 'grayscale(30%)'
            }}
          >
            <div 
              className="card h-100 border-0 bg-white rounded-4 overflow-hidden"
              style={{
                boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-10px)';
                e.currentTarget.style.boxShadow = '0 15px 40px rgba(0,0,0,0.1)';
                if (autoplayIntervalRef.current) {
                  clearInterval(autoplayIntervalRef.current);
                }
                setActiveIndex(index);
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.05)';
                autoplayIntervalRef.current = setInterval(() => {
                  setActiveIndex(prevIndex => (prevIndex + 1) % totalItems);
                }, 6000);
              }}
            >
              {/* Imagine card */}
              <div className="position-relative overflow-hidden" style={{ height: '200px' }}>
                <img 
                  src={item.image} 
                  alt={item.title}
                  className="w-100 h-100"
                  style={{
                    objectFit: 'cover',
                    transition: 'transform 0.7s ease'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'scale(1.05)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                />
                <div 
                  className="position-absolute top-0 start-0 p-3"
                >
                  <span 
                    className="badge rounded-pill px-3 py-2"
                    style={{ 
                      backgroundColor: item.color,
                      color: 'white',
                      fontWeight: '500',
                      backdropFilter: 'blur(5px)'
                    }}
                  >
                    {item.tag}
                  </span>
                </div>
              </div>
              
              {/* Conținut card */}
              <div className="card-body p-4">
                <span className="d-block text-muted mb-2 small">
                  <i className="far fa-clock me-1"></i> {item.readTime} citire
                </span>
                <h3 className="h5 fw-bold mb-3" style={{ lineHeight: '1.4' }}>
                  {item.title}
                </h3>
                <p className="text-muted mb-4" style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>
                  {item.excerpt}
                </p>
                <div className="d-flex align-items-center mt-auto">
                  <Link 
                    to={item.link} 
                    className="btn btn-link text-decoration-none p-0 d-flex align-items-center"
                    style={{ 
                      color: item.color,
                      fontWeight: '500',
                      fontSize: '0.9rem',
                      transition: 'all 0.3s ease' 
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.paddingLeft = '5px';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.paddingLeft = '0px';
                    }}
                  >
                    Citește mai mult <IconArrowRight size={16} className="ms-2" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Indicatori */}
      <div className="d-flex justify-content-center mt-5">
        {blogData.map((_, index) => (
          <button
            key={index}
            type="button"
            className="btn btn-sm rounded-circle mx-1 p-0"
            style={{
              width: '10px',
              height: '10px',
              backgroundColor: activeIndex === index ? colors.turquoise : '#e9e9e9',
              border: 'none',
              transition: 'all 0.3s ease'
            }}
            onClick={() => setActiveIndex(index)}
          />
        ))}
      </div>
    </div>
  );
};
  

export default HomePage;