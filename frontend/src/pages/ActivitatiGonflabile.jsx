import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { IconArrowLeft, IconClock, IconShare, IconBookmark, IconHeart, IconSun, IconDroplet, IconUsers } from '@tabler/icons-react';

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
 * Pagina cu articol despre activități distractive cu echipamente gonflabile
 */
const ActivitatiGonflabile = () => {
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

  // Datele pentru cardurile de activități
  const activityCards = [
    {
      icon: <IconSun size={24} />,
      title: "Activități pe Plajă",
      description: "Transformă zona ta de nisip într-un spațiu de joacă distractiv",
      color: colors.accent
    },
    {
      icon: <IconDroplet size={24} />,
      title: "Activități în Apă",
      description: "Răcorește-te și distrează-te cu jocuri bazate pe echipamente gonflabile",
      color: colors.primary
    },
    {
      icon: <IconUsers size={24} />,
      title: "Activități de Grup",
      description: "Socializează și creează amintiri de neuitat cu prietenii și familia",
      color: colors.turquoise
    }
  ];
  
  return (
    <div className="blog-article-page">
      {/* Header articol cu video background sau imagine animată */}
      <header 
        className="article-header position-relative text-white d-flex align-items-center"
        style={{
          height: '70vh',
          minHeight: '400px',
          backgroundImage: `url(/images/beach-activities.jpg)`,
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
            style={{ backgroundColor: colors.accent }}
          >
            Activități
          </span>
          
          <h1 className="display-4 fw-bold mb-4" style={{ maxWidth: '800px' }}>
            Activități Distractive cu Echipamente 
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
              <span>5 min citire</span>
            </div>
            
            <div className="d-flex align-items-center">
              <span>5 mai 2025</span>
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
                Ideile noastre pentru jocuri și activități cu echipamente gonflabile vor face ziua la plajă mai distractivă pentru toți membrii familiei. Descoperă cum să transformi o zi obișnuită la plajă într-o aventură plină de bucurie și amintiri de neuitat.
              </p>
              
              {/* Carduri activități */}
              <div className="row g-4 my-5">
                {activityCards.map((card, index) => (
                  <div key={index} className="col-md-4">
                    <div 
                      className="card h-100 border-0 rounded-4 p-4 text-center hover-card"
                      style={{
                        boxShadow: '0 10px 20px rgba(0,0,0,0.05)',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      <div className="card-body">
                        <div
                          className="icon-circle mx-auto mb-4 d-flex align-items-center justify-content-center rounded-circle"
                          style={{
                            width: '70px',
                            height: '70px',
                            backgroundColor: `${card.color}15`,
                            color: card.color
                          }}
                        >
                          {card.icon}
                        </div>
                        <h3 className="h5 fw-bold mb-3">{card.title}</h3>
                        <p className="text-muted mb-0">{card.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <hr className="my-5" style={{ opacity: 0.1 }} />
            </div>
            
            {/* Secțiune 1 */}
            <div 
              ref={addToRefs}
              className="article-section fade-in-section mb-5"
            >
              <div className="row align-items-center">
                <div className="col-md-6 mb-4 mb-md-0">
                  <h2 className="h3 fw-bold mb-4" style={{ color: colors.accent }}>
                    Volei pe plajă 
                  </h2>
                  <p className="text-muted mb-4">
                  Doriți să adăugați un strop de energie și distracție zilei petrecute pe nisip? Un meci de volei poate fi exact ce vă trebuie!Vestea bună este că unele dintre plajele listate ar putea oferi această facilitate.
                  </p>
                  <p className="text-muted">
                    Chiar daca unele plaje nu dispun de un teren oficial sau nu pune la dispoziție mingi, distracția nu trebuie să se oprească aici! Cel mai simplu este să veniți pregătiți cu propria minge de acasă - cele gonflabile sunt o alegere excelentă, fiind ușoare, sigure pentru copii și perfecte pentru jocuri antrenante în grup. Poți folosi prosoape pentru a marca limitele și o frânghie sau o linie trasată în nisip pentru a marca plasa. Este o activitate excelentă pentru a implica întreaga familie sau un grup de prieteni.
                  </p>
                </div>
                <div className="col-md-6">
                  <div 
                    className="image-container overflow-hidden rounded-4 shadow-sm"
                    style={{ height: '300px' }}
                  >
                    <img 
                      src="/images/volei.jpg" 
                      alt="Volei pe plajă cu mingi gonflabile"
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
                  <h2 className="h3 fw-bold mb-4" style={{ color: colors.accent }}>
                  Adrenalină pe Valuri
                  </h2>
                  <p className="text-muted mb-4">
                  Căutați o explozie de distracție și adrenalină pe apă alături de prieteni sau familie? Atunci o plimbare cu banana gonflabilă, trasă cu viteză de un skijet, este exact ce vă trebuie! Este o activitate de grup fantastică, plină de râsete și senzații tari, perfectă pentru a vă răcori și a crea amintiri vibrante în zilele toride de vară.                  </p>
                  <p className="text-muted">
                  Pe multe plaje de pe site-ul nostru puteți găsi această activitate oferită de operatori specializați. Când verificați disponibilitatea la centrele locale de sporturi nautice, alegeți cu responsabilitate: optați pentru operatori autorizați, asigurați-vă că se folosesc veste de salvare (de obicei incluse) și respectați întocmai indicațiile personalului.                  </p>
                </div>
                <div className="col-md-6">
                  <div 
                    className="image-container overflow-hidden rounded-4 shadow-sm"
                    style={{ height: '300px' }}
                  >
                    <img 
                      src="/images/banana.jpg" 
                      alt="Curse de colaci pe apă"
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
                  <h2 className="h3 fw-bold mb-4" style={{ color: colors.accent }}>
                  Descoperă Lumea Subacvatică: Magia Snorkelingului
                  </h2>
                  <p className="text-muted mb-4">
                  Explorați frumusețile ascunse sub luciul apei printr-o sesiune relaxantă de snorkeling! Este o activitate minunată și accesibilă pentru toate vârstele, oferindu-vă șansa de a admira viața marină într-un mod pașnic și fascinant. O mască, un tub de respirat (snorkel) și, opțional, labe de înot sunt suficiente pentru a porni în această aventură subacvatică.                  </p>
                  <p className="text-muted">
                  În ceea ce privește echipamentul, aveți flexibilitate. Cel mai comod este să veniți cu propriul set de snorkeling de acasă. Dacă nu aveți echipament, puteți căuta să achiziționați unul de la magazinele specializate sau cele cu articole de plajă din apropierea zonelor costiere.                  </p>
                </div>
                <div className="col-md-6">
                  <div 
                    className="image-container overflow-hidden rounded-4 shadow-sm"
                    style={{ height: '300px' }}
                  >
                    <img 
                      src="/images/snorkeling.jpg" 
                      alt="Sărituri pe saltele gonflabile"
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
            
            {/* Secțiune interactivă - Ideea zilei */}
            <div 
              ref={addToRefs}
              className="article-section fade-in-section my-5"
            >
              <div 
                className="idea-of-day p-4 rounded-4 text-white"
                style={{ 
                  backgroundImage: `linear-gradient(135deg, ${colors.accent}, ${colors.primary})`,
                  boxShadow: '0 15px 30px rgba(0,0,0,0.1)'
                }}
              >
                <h3 className="h4 fw-bold mb-4">
                  Ideea Zilei: Vânătoarea de Comori Marine
                </h3>
                
                <p className="mb-0">
                  Organizează o vânătoare de comori folosind echipamente gonflabile ca "insule" unde ascunzi indicii în recipiente impermeabile. Participanții trebuie să înoate de la o insulă la alta pentru a găsi toate indiciile care duc la "comoara" finală - poate fi un premiu special sau o activitate surpriză pentru toată lumea.
                </p>
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
                  backgroundColor: `${colors.accent}10`,
                  border: `1px solid ${colors.accent}30`
                }}
              >
                <h3 className="h4 fw-bold mb-4" style={{ color: colors.accent }}>
                  Sfaturi pentru siguranță:
                </h3>
                
                <ul className="mb-0 ps-3">
                  <li className="mb-3">
                    Verifică întotdeauna echipamentele gonflabile pentru scurgeri înainte de utilizare
                  </li>
                  <li className="mb-3">
                    Supraveghează copiii în permanență când folosesc echipamente gonflabile în apă
                  </li>
                  <li className="mb-3">
                    Aplică protecție solară înainte de a începe activitățile, chiar dacă ești în apă
                  </li>
                  <li className="mb-3">
                    Păstrează o pompă de umflat la îndemână pentru ajustări rapide
                  </li>
                  <li className="mb-3">
                    Nu folosi echipamente gonflabile în condiții de vânt puternic sau valuri mari
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
          
          .hover-card:hover {
            transform: translateY(-10px);
            box-shadow: 0 15px 30px rgba(0,0,0,0.1);
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

export default ActivitatiGonflabile;