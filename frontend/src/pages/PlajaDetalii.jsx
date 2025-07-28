import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  IconSun, 
  IconUmbrella,
  IconCoffee,
  IconWifi,
  IconSwimming,
  IconMassage,
  IconLifebuoy,
  IconBallFootball,
  IconWind,
  IconDroplet,
  IconTemperature,
  IconClock,
  IconPhone,
  IconMail,
  IconWorld,
  IconMapPin,
  IconDirections,
  IconStar
} from '@tabler/icons-react';
import FavoriteButton from './FavoriteButton';
import axios from 'axios';

const PlajaDetailii = ({ plaja, onReservationClick }) => {
  const [headerImage, setHeaderImage] = useState('');
  const [imagini, setImagini] = useState([]);
  const [incarcaImagini, setIncarcaImagini] = useState(true);

  // Imagini default sigure
  const defaultImages = [
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&h=800&fit=crop&crop=center&auto=format',
    'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200&h=800&fit=crop&crop=center&auto=format',
    'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200&h=800&fit=crop&crop=center&auto=format',
    'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=1200&h=800&fit=crop&crop=center&auto=format',
    'https://images.unsplash.com/photo-1471940408576-1073921470b4?w=1200&h=800&fit=crop&crop=center&auto=format'
  ];

  // Funcție simplă pentru API key - FOARTE SIGURĂ
  const getGoogleApiKey = () => {
    // Verifică dacă există o variabilă globală setată manual
    if (typeof window !== 'undefined' && window.GOOGLE_MAPS_API_KEY) {
      return window.GOOGLE_MAPS_API_KEY;
    }
    
    // Pentru Create React App - verifică dacă process există
    try {
      if (process && process.env && process.env.REACT_APP_GOOGLE_MAPS_API_KEY) {
        return process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
      }
    } catch (e) {
      // Process nu există sau nu are env
    }
    
    // Fallback key pentru development/testing
    return 'AIzaSyAFx94qZOmhNHRgEm17hh9C83bP_xXEwFI';
  };

  // Funcție pentru procesarea imaginilor - FOARTE SIMPLĂ
  const processImages = (plajaData) => {
    console.log('🖼️ Procesare imagini pentru:', plajaData?.denumire);
    
    let images = [];
    
    // Verifică dacă există photos în detaliiWeb
    if (plajaData?.detaliiWeb?.photos && Array.isArray(plajaData.detaliiWeb.photos)) {
      console.log('📸 Găsite photos în detaliiWeb:', plajaData.detaliiWeb.photos.length);
      
      // Procesează fiecare photo
      images = plajaData.detaliiWeb.photos.map((photo, index) => {
        if (photo && typeof photo === 'object' && photo.photo_reference) {
          const apiKey = getGoogleApiKey();
          const url = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=1200&photoreference=${photo.photo_reference}&key=${apiKey}`;
          console.log(`📷 Google photo ${index + 1}:`, url.substring(0, 100) + '...');
          return url;
        }
        return null;
      }).filter(Boolean);
    }
    
    // Dacă nu am imagini din Google, folosește default
    if (images.length === 0) {
      console.log('📷 Folosesc imagini default');
      images = defaultImages;
    }
    
    console.log('✅ Total imagini procesate:', images.length);
    return images;
  };

  // Funcție simplă pentru încărcarea imaginilor
  const loadImages = async (plajaData) => {
    try {
      console.log('🚀 Încărcare imagini pentru:', plajaData?.denumire);
      setIncarcaImagini(true);
      
      const images = processImages(plajaData);
      
      setImagini(images);
      setHeaderImage(images[0]);
      
      console.log('✅ Imagini setate:', images.length);
      
    } catch (error) {
      console.error('❌ Eroare la încărcarea imaginilor:', error);
      setImagini(defaultImages);
      setHeaderImage(defaultImages[0]);
    } finally {
      setIncarcaImagini(false);
    }
  };

  // Effect pentru încărcarea imaginilor
  useEffect(() => {
    if (plaja) {
      loadImages(plaja);
    }
  }, [plaja]);

  // Funcție pentru handle-ul erorii de încărcare a imaginii
  const handleImageError = (e, index) => {
    console.error(`❌ Eroare la încărcarea imaginii ${index + 1}`);
    
    if (e.target.getAttribute('data-fallback') !== 'true') {
      const fallbackIndex = index % defaultImages.length;
      e.target.src = defaultImages[fallbackIndex];
      e.target.setAttribute('data-fallback', 'true');
    }
  };

  // Funcție pentru schimbarea imaginii de header
  const changeHeaderImage = (newImageUrl) => {
    setHeaderImage(newImageUrl);
  };

  if (!plaja) {
    return (
      <div className="container my-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Se încarcă...</span>
          </div>
          <p className="mt-3">Se încarcă detaliile plajei...</p>
        </div>
      </div>
    );
  }

  const numarSezlonguri = plaja.numarSezlonguri || 0;
  const numarUmbrele = Math.ceil(numarSezlonguri / 2);
  const temperatura = plaja.detaliiWeb?.weather?.temperature;
  const vant = plaja.detaliiWeb?.weather?.wind_speed;
  const valuri = plaja.detaliiWeb?.weather?.wave_height || 0.5;
  const umiditate = plaja.detaliiWeb?.weather?.humidity || 65;
  const temperaturaApa = plaja.detaliiWeb?.weather?.water_temperature || Math.max(20, temperatura - 4);

  return (
    <div className="container my-5">
      {/* Debug info simplu */}
      <div className="alert alert-info mb-4">
        <h6>🔍 Info Debug:</h6>
        <small>
          <strong>Plaja:</strong> {plaja.denumire}<br />
          <strong>API Key:</strong> {getGoogleApiKey() ? 'Prezent' : 'Lipsă'}<br />
          <strong>Place ID:</strong> {plaja.detaliiWeb?.place_id || 'Lipsă'}<br />
          <strong>Photos în detaliiWeb:</strong> {plaja.detaliiWeb?.photos?.length || 0}<br />
          <strong>Total imagini încărcate:</strong> {imagini.length}
        </small>
      </div>

      {/* Header plajă */}
      <div className="plaja-details-header" style={{ 
        backgroundImage: `url('${headerImage}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '400px',
        borderRadius: '15px',
        position: 'relative',
        marginBottom: '2rem'
      }}>
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
          color: 'white',
          padding: '2rem',
          borderRadius: '0 0 15px 15px'
        }}>
          <div className="d-flex align-items-center">
            <h1 className="mb-0 me-3">{plaja.denumire}</h1>
            <FavoriteButton plajaId={plaja.id} position="title" size="large" />
          </div>
          <p className="mb-0 d-flex align-items-center">
            <IconMapPin className="me-1" />
            {plaja.statiune?.denumire || 'N/A'}, Constanța
            {plaja.detaliiWeb?.rating && (
              <span className="ms-3 badge bg-warning text-dark">
                <IconStar className="me-1" size={16} /> {plaja.detaliiWeb.rating.toFixed(1)}
              </span>
            )}
          </p>
        </div>
        
        {incarcaImagini && (
          <div className="position-absolute top-50 start-50 translate-middle">
            <div className="spinner-border text-white" role="status">
              <span className="visually-hidden">Se încarcă...</span>
            </div>
          </div>
        )}

        {/* Thumbnails pentru schimbarea imaginii */}
        {imagini.length > 1 && !incarcaImagini && (
          <div className="position-absolute bottom-0 end-0 p-3">
            <div className="d-flex gap-1">
              {imagini.slice(0, 4).map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`Thumbnail ${index + 1}`}
                  className="rounded"
                  style={{
                    width: '40px',
                    height: '40px',
                    objectFit: 'cover',
                    cursor: 'pointer',
                    opacity: img === headerImage ? 1 : 0.7,
                    border: img === headerImage ? '2px solid white' : '2px solid transparent'
                  }}
                  onClick={() => changeHeaderImage(img)}
                  onError={(e) => handleImageError(e, index)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
      
      <div className="row g-4">
        {/* Coloana stângă */}
        <div className="col-lg-8">
          <div className="card shadow-sm rounded-4 mb-4">
            <div className="card-body">
              <h4 className="card-title border-bottom pb-3 mb-3">Despre plajă</h4>
              <p className="card-text">
                {plaja.descriere || `Plajă situată în stațiunea ${plaja.statiune?.denumire} oferind facilități moderne și o vedere superbă spre mare.`}
              </p>
              
              <div className="row mt-4">
                <div className="col-md-6">
                  <h5>Facilități</h5>
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item border-0 ps-0">
                      <IconSun className="me-2 text-primary" /> {numarSezlonguri} șezlonguri
                    </li>
                    <li className="list-group-item border-0 ps-0">
                      <IconUmbrella className="me-2 text-primary" /> {numarUmbrele} umbrele
                    </li>
                    <li className="list-group-item border-0 ps-0">
                      <IconDroplet className="me-2 text-primary" /> Dușuri și vestiare
                    </li>
                    <li className="list-group-item border-0 ps-0">
                      <IconCoffee className="me-2 text-primary" /> Bar pe plajă
                    </li>
                    <li className="list-group-item border-0 ps-0">
                      <IconWifi className="me-2 text-primary" /> Wi-Fi gratuit
                    </li>
                  </ul>
                </div>
                <div className="col-md-6">
                  <h5>Servicii</h5>
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item border-0 ps-0">
                      <IconSwimming className="me-2 text-primary" /> Sporturi nautice
                    </li>
                    <li className="list-group-item border-0 ps-0">
                      <IconMassage className="me-2 text-primary" /> Masaj pe plajă
                    </li>
                    <li className="list-group-item border-0 ps-0">
                      <IconLifebuoy className="me-2 text-primary" /> Salvamar
                    </li>
                    <li className="list-group-item border-0 ps-0">
                      <IconBallFootball className="me-2 text-primary" /> Activități
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          {/* Galerie foto */}
          <div className="card shadow-sm rounded-4 mb-4">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-3">
                <h4 className="card-title mb-0">Galerie foto</h4>
                <span className="badge bg-primary">{imagini.length} imagini</span>
              </div>
              
              {incarcaImagini ? (
                <div className="text-center my-4">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Se încarcă...</span>
                  </div>
                  <p className="mt-2">Se încarcă imaginile...</p>
                </div>
              ) : (
                <div className="row g-3">
                  {imagini.map((photo, index) => (
                    <div className="col-md-4" key={index}>
                      <div className="position-relative">
                        <img 
                          src={photo} 
                          className="img-fluid rounded" 
                          alt={`${plaja.denumire} - ${index + 1}`}
                          style={{
                            height: '200px',
                            width: '100%',
                            objectFit: 'cover',
                            cursor: 'pointer'
                          }}
                          onError={(e) => handleImageError(e, index)}
                          onClick={() => window.open(photo, '_blank')}
                        />
                        
                        <div className="position-absolute top-0 end-0 p-2">
                          <button
                            className="btn btn-sm btn-light rounded-circle"
                            style={{ width: '32px', height: '32px' }}
                            onClick={(e) => {
                              e.stopPropagation();
                              changeHeaderImage(photo);
                            }}
                            title="Setează ca imagine principală"
                          >
                            🖼️
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {/* Recenzii */}
          <div className="card shadow-sm rounded-4">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-3">
                <h4 className="card-title mb-0">Recenzii</h4>
                {plaja.detaliiWeb?.rating && (
                  <span className="badge bg-warning text-dark py-2 px-3 rounded-pill">
                    <IconStar className="me-1" /> {plaja.detaliiWeb.rating.toFixed(1)} / 5
                  </span>
                )}
              </div>
              
              {plaja.detaliiWeb?.reviews?.length > 0 ? (
                plaja.detaliiWeb.reviews.slice(0, 3).map((review, idx) => (
                  <div className="review-card mb-4 pb-3 border-bottom" key={idx}>
                    <div className="d-flex">
                      <img 
                        src={review.profile_photo_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(review.author_name)}&background=random`} 
                        alt={review.author_name} 
                        className="rounded-circle me-3" 
                        style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                        onError={(e) => {
                          e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(review.author_name)}&background=random`;
                        }}
                      />
                      <div className="flex-grow-1">
                        <div className="d-flex align-items-center mb-1">
                          <h6 className="mb-0">{review.author_name}</h6>
                          <div className="ms-2">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <IconStar 
                                key={i}
                                className={i < review.rating ? "text-warning" : "text-muted"} 
                                size={16}
                                fill={i < review.rating ? "currentColor" : "none"}
                              />
                            ))}
                          </div>
                        </div>
                        <small className="text-muted">{review.relative_time_description}</small>
                        <p className="mt-2 mb-0">{review.text}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center my-4">
                  <IconStar className="text-muted mb-2" size={48} />
                  <p className="text-muted">Nu există recenzii disponibile.</p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Coloana dreaptă */}
        <div className="col-lg-4">
          {/* Card rezervare */}
          <div className="card shadow-sm rounded-4 mb-4 border-primary border-top border-4">
            <div className="card-body">
              <h4 className="card-title text-center mb-4">Rezervă acum</h4>
              
              <button 
                className="btn btn-primary btn-lg w-100" 
                onClick={() => onReservationClick && onReservationClick(plaja.id)}
              >
                <IconSun className="me-2" /> Mergi la rezervare
              </button>
              
              <div className="text-center mt-3 text-muted">
                <small>Rezervă acum pentru cel mai bun loc pe plajă</small>
              </div>
            </div>
          </div>
          
          {/* Card Meteo */}
          <div className="card shadow-sm rounded-4 mb-4">
            <div className="card-body">
              <h5 className="card-title border-bottom pb-2 mb-3">Condiții meteo</h5>
              {temperatura ? (
                <>
                  <div className="d-flex align-items-center mb-3">
                    <div className="me-3 bg-light rounded-circle p-3 text-primary">
                      <IconSun size={32} />
                    </div>
                    <div>
                      <h3 className="mb-0">{temperatura}°C</h3>
                      <p className="mb-0 text-muted">Însorit</p>
                    </div>
                  </div>
                  
                  <div className="row text-center g-2">
                    <div className="col-6">
                      <div className="p-3 bg-light rounded-3">
                        <IconWind className="text-primary mb-1" />
                        <small className="text-muted d-block">Vânt</small>
                        <span>{vant || 'N/A'}</span>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="p-3 bg-light rounded-3">
                        <IconDroplet className="text-primary mb-1" />
                        <small className="text-muted d-block">Valuri</small>
                        <span>{valuri} m</span>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="p-3 bg-light rounded-3">
                        <IconDroplet className="text-primary mb-1" />
                        <small className="text-muted d-block">Umiditate</small>
                        <span>{umiditate}%</span>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="p-3 bg-light rounded-3">
                        <IconTemperature className="text-primary mb-1" />
                        <small className="text-muted d-block">Apă</small>
                        <span>{temperaturaApa}°C</span>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-3">
                  <IconTemperature className="text-muted mb-2" size={32} />
                  <p className="text-muted mb-0">Informații meteo indisponibile</p>
                </div>
              )}
              
              <h5 className="card-title border-bottom pb-2 mt-4 mb-3">Program</h5>
              <ul className="list-unstyled">
                <li className="mb-2">
                  <IconClock className="me-2 text-primary" />
                  <strong>Luni - Duminică:</strong> 08:00 - 20:00
                </li>
              </ul>
              
              <h5 className="card-title border-bottom pb-2 mt-4 mb-3">Contact</h5>
              <ul className="list-unstyled">
                {plaja.detaliiWeb?.phone_number && (
                  <li className="mb-2">
                    <IconPhone className="me-2 text-primary" />
                    <a href={`tel:${plaja.detaliiWeb.phone_number}`}>{plaja.detaliiWeb.phone_number}</a>
                  </li>
                )}
                <li className="mb-2">
                  <IconMail className="me-2 text-primary" />
                  <a href={`mailto:contact@plaja.ro`}>contact@plaja.ro</a>
                </li>
                {plaja.detaliiWeb?.website && (
                  <li>
                    <IconWorld className="me-2 text-primary" />
                    <a href={plaja.detaliiWeb.website} target="_blank" rel="noopener noreferrer">
                      Website
                    </a>
                  </li>
                )}
              </ul>
            </div>
          </div>
          
          {/* Card Locație */}
          <div className="card shadow-sm rounded-4">
            <div className="card-body">
              <h5 className="card-title border-bottom pb-2 mb-3">Locație</h5>
              <div className="rounded-3 overflow-hidden mb-3" style={{ height: '200px', backgroundColor: '#e9ecef' }}>
                <div className="h-100 d-flex align-items-center justify-content-center">
                  <div className="text-center">
                    <IconMapPin className="text-primary mb-2" size={48} />
                    <p className="mb-0">Hartă interactivă</p>
                    <small className="text-muted">Click pentru detalii</small>
                  </div>
                </div>
              </div>
              <p className="mb-0">
                <IconMapPin className="me-1 text-primary" />
                {plaja.statiune?.denumire}, Constanța
              </p>
              <button className="btn btn-sm btn-outline-primary mt-3 w-100">
                <IconDirections className="me-1" /> Indicații
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlajaDetailii;