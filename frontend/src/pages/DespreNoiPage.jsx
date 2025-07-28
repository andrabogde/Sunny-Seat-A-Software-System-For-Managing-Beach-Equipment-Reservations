import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { IconBrandInstagram, IconBrandFacebook, IconBrandTwitter, IconArrowRight, IconSend, IconCheck, IconX } from '@tabler/icons-react';

// Definim culorile personalizate în concordanță cu restul aplicației
const colors = {
  primary: '#3498db',     // Albastru
  secondary: '#2ecc71',   // Verde
  accent: '#f39c12',      // Portocaliu
  turquoise: '#20c997',   // Turcoaz
  dark: '#2c3e50',        // Albastru închis
  light: '#ecf0f1'        // Gri deschis
};

const DespreNoiPage = () => {
  // State pentru formularul de contact
  const [formData, setFormData] = useState({
    nume: '',
    email: '',
    mesaj: ''
  });
  const [submitStatus, setSubmitStatus] = useState(null); // null, 'success', 'error'
  const [loading, setLoading] = useState(false);

  // Handler pentru schimbarea câmpurilor formularului
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  // Handler pentru trimiterea formularului
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulăm un request de trimitere email
    setTimeout(() => {
      // În implementarea reală, aici ar trebui să faci un request către backend
      // pentru a trimite email-ul
      console.log('Formular trimis:', formData);
      setSubmitStatus('success');
      setLoading(false);
      
      // Resetăm formularul după trimitere
      setFormData({
        nume: '',
        email: '',
        mesaj: ''
      });
      
      // Resetăm status-ul după 5 secunde
      setTimeout(() => {
        setSubmitStatus(null);
      }, 5000);
    }, 1500);
  };

  // Datele echipei - exemplu
  const teamMembers = [
    {
      nume: 'Andrei Ionescu',
      rol: 'Fondator & CEO',
      imagine: '/images/andrei.jpg', // Înlocuiește cu imagini reale
      descriere: 'Pasionat de antreprenoriat și inovație în turism.'
    },
    {
      nume: 'Maria Popescu',
      rol: 'Manager Operațiuni',
      imagine: '/images/maria.jpg',
      descriere: 'Expertă în optimizarea experienței clienților și gestionarea plajelor.'
    },
    {
      nume: 'Alex Dumitrescu',
      rol: 'Dezvoltator Software',
      imagine: '/images/alex.jpg',
      descriere: 'Specialist în crearea de soluții digitale pentru industria turistică.'
    }
  ];

  return (
    <div className="despre-noi-page">
      {/* Header cu imagine de fundal */}
      <header 
        className="position-relative d-flex align-items-center text-white py-5"
        style={{
          backgroundImage: 'linear-gradient(to right, rgba(0,0,0,0.7), rgba(0,0,0,0.3)), url("https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          minHeight: '50vh'
        }}
      >
        <div className="container py-5">
          <div className="row">
            <div className="col-lg-8">
              <h1 className="display-4 fw-bold mb-4">Despre Sunny Seat</h1>
              <p className="lead mb-0">Platforma care transformă experiența ta pe plajele din România</p>
            </div>
          </div>
        </div>
      </header>

      {/* Secțiunea Misiunea Noastră */}
      <section className="py-5 bg-light">
        <div className="container py-5">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-4 mb-lg-0">
              <div className="p-0 position-relative">
                <img 
                  src="/images/beach.jpg" 
                  alt="Plajă cu șezlonguri" 
                  className="img-fluid rounded-4 shadow-lg" 
                  style={{ width: '100%', height: 'auto' }}
                />
                <div 
                  className="position-absolute"
                  style={{
                    bottom: '-20px',
                    right: '-20px',
                    width: '140px',
                    height: '140px',
                    borderRadius: '50%',
                    backgroundColor: colors.turquoise,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
                  }}
                >
                  <div className="text-white text-center">
                    <div className="h2 fw-bold mb-0">2025</div>
                    <div className="small">Fondată</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-5 ms-auto">
              <div className="mb-4">
                <span 
                  className="badge rounded-pill px-3 py-2 mb-2"
                  style={{ backgroundColor: colors.turquoise, color: 'white' }}
                >
                  Misiunea Noastră
                </span>
                <h2 className="h1 fw-bold mb-4">Revoluționăm experiența pe plajă</h2>
                <p className="lead mb-4" style={{ color: colors.dark, fontWeight: '300' }}>
                  La Sunny Seat transformăm modul în care turiștii își petrec timpul pe plajele din România.
                </p>
                <p className="text-muted mb-4">
                  Ne-am propus să facem experiența la plajă cât mai plăcută, eliminând stresul căutării unui loc și oferindu-ți posibilitatea de a-ți rezerva locul preferat înainte de a ajunge la destinație. Cu Sunny Seat, vacanța ta începe înainte de a ajunge la plajă!
                </p>
              </div>
              
              <div className="row gx-3 gy-4">
                <div className="col-12 col-sm-6">
                  <div className="d-flex">
                    <div className="flex-shrink-0">
                      <div 
                        className="d-flex align-items-center justify-content-center rounded-circle mb-3"
                        style={{
                          width: '48px',
                          height: '48px',
                          backgroundColor: `${colors.primary}15`,
                          color: colors.primary
                        }}
                      >
                        <IconCheck size={24} />
                      </div>
                    </div>
                    <div className="flex-grow-1 ms-3">
                      <h5 className="fw-bold mb-1">Simplu</h5>
                      <p className="text-muted mb-0">Rezervări în câteva minute</p>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-sm-6">
                  <div className="d-flex">
                    <div className="flex-shrink-0">
                      <div 
                        className="d-flex align-items-center justify-content-center rounded-circle mb-3"
                        style={{
                          width: '48px',
                          height: '48px',
                          backgroundColor: `${colors.accent}15`,
                          color: colors.accent
                        }}
                      >
                        <IconCheck size={24} />
                      </div>
                    </div>
                    <div className="flex-grow-1 ms-3">
                      <h5 className="fw-bold mb-1">Transparent</h5>
                      <p className="text-muted mb-0">Prețuri clare și corecte</p>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-sm-6">
                  <div className="d-flex">
                    <div className="flex-shrink-0">
                      <div 
                        className="d-flex align-items-center justify-content-center rounded-circle mb-3"
                        style={{
                          width: '48px',
                          height: '48px',
                          backgroundColor: `${colors.turquoise}15`,
                          color: colors.turquoise
                        }}
                      >
                        <IconCheck size={24} />
                      </div>
                    </div>
                    <div className="flex-grow-1 ms-3">
                      <h5 className="fw-bold mb-1">Eficient</h5>
                      <p className="text-muted mb-0">Fără cozi și așteptare</p>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-sm-6">
                  <div className="d-flex">
                    <div className="flex-shrink-0">
                      <div 
                        className="d-flex align-items-center justify-content-center rounded-circle mb-3"
                        style={{
                          width: '48px',
                          height: '48px',
                          backgroundColor: `${colors.secondary}15`,
                          color: colors.secondary
                        }}
                      >
                        <IconCheck size={24} />
                      </div>
                    </div>
                    <div className="flex-grow-1 ms-3">
                      <h5 className="fw-bold mb-1">Divers</h5>
                      <p className="text-muted mb-0">Opțiuni pentru toate preferințele</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Secțiunea Valori */}
      <section className="py-5">
        <div className="container py-5">
          <div className="row mb-5">
            <div className="col-lg-6 mx-auto text-center">
              <span 
                className="badge rounded-pill px-3 py-2 mb-2"
                style={{ backgroundColor: colors.accent, color: 'white' }}
              >
                Valorile Noastre
              </span>
              <h2 className="h1 fw-bold mb-4">Principiile care ne ghidează</h2>
              <p className="lead">
                Ne angajăm să oferim cea mai bună experiență pe plajele din România
              </p>
            </div>
          </div>
          
          <div className="row g-4">
            <div className="col-md-4">
              <div 
                className="card border-0 rounded-4 h-100 shadow-sm p-4 hover-card"
                style={{ transition: 'all 0.3s ease' }}
              >
                <div className="card-body">
                  <div 
                    className="d-inline-flex align-items-center justify-content-center rounded-circle mb-4"
                    style={{
                      width: '64px',
                      height: '64px',
                      backgroundColor: `${colors.primary}15`,
                      color: colors.primary
                    }}
                  >
                    {/* Icon placeholder - înlocuiește cu iconița potrivită */}
                    <span className="fs-3">🌊</span>
                  </div>
                  <h5 className="fw-bold mb-3">Experiențe Memorabile</h5>
                  <p className="text-muted mb-0">
                    Credem că fiecare zi petrecută la plajă ar trebui să fie una de neuitat, iar noi facem tot posibilul să asigurăm acest lucru.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="col-md-4">
              <div 
                className="card border-0 rounded-4 h-100 shadow-sm p-4 hover-card"
                style={{ transition: 'all 0.3s ease' }}
              >
                <div className="card-body">
                  <div 
                    className="d-inline-flex align-items-center justify-content-center rounded-circle mb-4"
                    style={{
                      width: '64px',
                      height: '64px',
                      backgroundColor: `${colors.turquoise}15`,
                      color: colors.turquoise
                    }}
                  >
                    {/* Icon placeholder - înlocuiește cu iconița potrivită */}
                    <span className="fs-3">🤝</span>
                  </div>
                  <h5 className="fw-bold mb-3">Sustenabilitate</h5>
                  <p className="text-muted mb-0">
                    Promovăm un turism responsabil, care respectă natura și comunitățile locale de pe litoralul românesc.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="col-md-4">
              <div 
                className="card border-0 rounded-4 h-100 shadow-sm p-4 hover-card"
                style={{ transition: 'all 0.3s ease' }}
              >
                <div className="card-body">
                  <div 
                    className="d-inline-flex align-items-center justify-content-center rounded-circle mb-4"
                    style={{
                      width: '64px',
                      height: '64px',
                      backgroundColor: `${colors.accent}15`,
                      color: colors.accent
                    }}
                  >
                    {/* Icon placeholder - înlocuiește cu iconița potrivită */}
                    <span className="fs-3">🔍</span>
                  </div>
                  <h5 className="fw-bold mb-3">Inovație Continuă</h5>
                  <p className="text-muted mb-0">
                    Căutăm mereu noi modalități de a îmbunătăți serviciile noastre și de a răspunde nevoilor în schimbare ale clienților.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Secțiunea Echipa - Opțională */}
      <section className="py-5 bg-light">
        <div className="container py-5">
          <div className="row mb-5">
            <div className="col-lg-6 mx-auto text-center">
              <span 
                className="badge rounded-pill px-3 py-2 mb-2"
                style={{ backgroundColor: colors.primary, color: 'white' }}
              >
                Echipa Noastră
              </span>
              <h2 className="h1 fw-bold mb-4">Oamenii din spatele Sunny Seat</h2>
              <p className="lead">
                O echipă pasionată de tehnologie și turism, dedicată îmbunătățirii experienței tale pe plajă
              </p>
            </div>
          </div>
          
          <div className="row g-4">
  {teamMembers.map((member, index) => (
    <div className="col-md-4" key={index}>
      <div 
        className="card border-0 rounded-4 overflow-hidden shadow-sm hover-card"
        style={{ transition: 'all 0.3s ease' }}
      >
        <div 
          className="position-relative"
          style={{ height: '280px', overflow: 'hidden' }}
        >
          <img 
            src={member.imagine}
            alt={member.nume}
            className="card-img-top w-100 h-100"
            style={{ 
              objectFit: 'cover',
              objectPosition: 'center 30%', // Această proprietate controlează poziționarea verticală a imaginii
              transition: 'transform 0.5s ease'
            }}
            onError={(e) => {
              // Backup pentru imagini care nu se încarcă
              e.target.src = 'https://via.placeholder.com/400x600?text=Team+Member';
            }}
          />
          <div 
            className="position-absolute top-0 start-0 w-100 h-100"
            style={{
              background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent 70%)'
            }}
          ></div>
        </div>
        <div className="card-body p-4">
          <h5 className="fw-bold mb-1">{member.nume}</h5>
          <p className="text-primary mb-3">{member.rol}</p>
          <p className="text-muted mb-0">{member.descriere}</p>
        </div>
      </div>
    </div>
  ))}
</div>
        </div>
      </section>

      {/* Formular Contact */}
      <section className="py-5">
        <div className="container py-5">
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div className="card border-0 rounded-4 shadow-sm overflow-hidden">
                <div className="row g-0">
                  <div 
                    className="col-md-5 d-none d-md-block"
                    style={{
                      backgroundImage: 'url("https://images.unsplash.com/photo-1527259216948-b0c66d6fc31f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80")',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                  >
                    <div 
                      className="p-5 h-100 d-flex flex-column justify-content-end text-white"
                      style={{
                        background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent 70%)'
                      }}
                    >
                      <h3 className="h4 fw-bold mb-4">Contactează-ne</h3>
                      <div className="mb-4">
                        <p className="mb-1"><strong>Email:</strong></p>
                        <p className="mb-0">contact@sunnyseat.ro</p>
                      </div>
                      <div className="mb-4">
                        <p className="mb-1"><strong>Telefon:</strong></p>
                        <p className="mb-0">+40 755 123 456</p>
                      </div>
                      <div className="social-links">
                        <p className="mb-2"><strong>Social Media:</strong></p>
                        <div className="d-flex gap-2">
                          <a 
                            href="https://facebook.com" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="btn btn-sm btn-outline-light rounded-circle"
                            style={{ width: '36px', height: '36px', padding: '6px' }}
                          >
                            <IconBrandFacebook size={18} />
                          </a>
                          <a 
                            href="https://instagram.com" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="btn btn-sm btn-outline-light rounded-circle"
                            style={{ width: '36px', height: '36px', padding: '6px' }}
                          >
                            <IconBrandInstagram size={18} />
                          </a>
                          <a 
                            href="https://twitter.com" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="btn btn-sm btn-outline-light rounded-circle"
                            style={{ width: '36px', height: '36px', padding: '6px' }}
                          >
                            <IconBrandTwitter size={18} />
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-7">
                    <div className="p-4 p-lg-5">
                      <div className="mb-4">
                        <h3 className="h4 fw-bold mb-2">Trimite-ne un mesaj</h3>
                        <p className="text-muted mb-0">
                          Ai întrebări sau sugestii? Completează formularul și te vom contacta cât mai curând.
                        </p>
                      </div>
                      
                      {submitStatus === 'success' ? (
                        <div 
                          className="alert d-flex align-items-center rounded-4 p-3"
                          style={{ 
                            backgroundColor: `${colors.secondary}15`,
                            color: colors.secondary,
                            border: `1px solid ${colors.secondary}30`
                          }}
                        >
                          <IconCheck size={20} className="me-2" />
                          <div>Mesajul tău a fost trimis cu succes! Îți mulțumim.</div>
                        </div>
                      ) : submitStatus === 'error' ? (
                        <div 
                          className="alert d-flex align-items-center rounded-4 p-3"
                          style={{ 
                            backgroundColor: '#F8D7DA',
                            color: '#842029',
                            border: '1px solid #F5C2C7'
                          }}
                        >
                          <IconX size={20} className="me-2" />
                          <div>A apărut o eroare la trimiterea mesajului. Te rugăm să încerci din nou.</div>
                        </div>
                      ) : null}
                      
                      <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                          <label htmlFor="nume" className="form-label fw-semibold">Nume complet</label>
                          <input 
                            type="text" 
                            className="form-control rounded-3 py-2" 
                            id="nume" 
                            name="nume"
                            value={formData.nume}
                            onChange={handleInputChange}
                            placeholder="Introdu numele tău"
                            required
                          />
                        </div>
                        <div className="mb-3">
                          <label htmlFor="email" className="form-label fw-semibold">Email</label>
                          <input 
                            type="email" 
                            className="form-control rounded-3 py-2" 
                            id="email" 
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="Adresa ta de email"
                            required
                          />
                        </div>
                        <div className="mb-4">
                          <label htmlFor="mesaj" className="form-label fw-semibold">Mesaj</label>
                          <textarea 
                            className="form-control rounded-3 py-2" 
                            id="mesaj" 
                            name="mesaj"
                            value={formData.mesaj}
                            onChange={handleInputChange}
                            rows="4"
                            placeholder="Scrie mesajul tău aici..."
                            required
                          ></textarea>
                        </div>
                        <button 
                          type="submit" 
                          className="btn btn-primary rounded-pill px-4 py-2 d-flex align-items-center"
                          style={{ minWidth: '160px' }}
                          disabled={loading}
                        >
                          {loading ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                              <span>Se trimite...</span>
                            </>
                          ) : (
                            <>
                              <span>Trimite mesaj</span>
                              <IconSend size={18} className="ms-2" />
                            </>
                          )}
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistici și CTA */}
      {/* <section 
        className="py-5 text-white"
        style={{
          backgroundImage: `linear-gradient(to right, ${colors.primary}, ${colors.turquoise})`,
          backgroundSize: 'cover'
        }}
      >
        <div className="container py-5 my-4">
          <div className="row g-4 mb-5">
            <div className="col-md-4 text-center">
              <h3 className="display-4 fw-bold mb-2">30+</h3>
              <p className="h6 fw-normal">Plaje partenere</p>
            </div>
            <div className="col-md-4 text-center">
              <h3 className="display-4 fw-bold mb-2">10k+</h3>
              <p className="h6 fw-normal">Clienți mulțumiți</p>
            </div>
            <div className="col-md-4 text-center">
              <h3 className="display-4 fw-bold mb-2">4.8</h3>
              <p className="h6 fw-normal">Rating mediu</p>
            </div>
          </div>
          
          <div className="row justify-content-center">
            <div className="col-lg-8 text-center">
              <h3 className="mb-4">Pregătit pentru o experiență de neuitat la plajă?</h3>
              <Link 
                to="/plaje" 
                className="btn btn-light rounded-pill px-5 py-3 d-inline-flex align-items-center"
                style={{ 
                  minWidth: '200px',
                  color: colors.primary,
                  fontWeight: '600'
                }}
              >
                Rezervă acum <IconArrowRight size={18} className="ms-2" />
              </Link>
            </div>
          </div>
        </div>
      </section> */}
      
      <style>
        {`
          .hover-card:hover {
            transform: translateY(-10px);
            box-shadow: 0 15px 30px rgba(0,0,0,0.1) !important;
          }
        `}
      </style>
    </div>
  );
};
<style>
  {`
    .hover-card:hover {
      transform: translateY(-10px);
      box-shadow: 0 15px 30px rgba(0,0,0,0.1) !important;
    }
    
    .hover-card:hover .card-img-top {
      transform: scale(1.05);
    }
  `}
</style>
export default DespreNoiPage;