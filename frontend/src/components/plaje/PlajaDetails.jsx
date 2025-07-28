import React, { useState, useEffect, useCallback, useMemo } from 'react';
import LocationCard from '../common/LocationCard';
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

const PlajaDetails = ({ plaja, onReservationClick }) => {
  const [headerImage, setHeaderImage] = useState('');
  const [imagini, setImagini] = useState([]);
  const [incarcaImagini, setIncarcaImagini] = useState(true);
  const [imaginiFailed, setImaginiFailed] = useState(new Set());

  // Imagini fallback pentru cazuri extreme
  const fallbackImages = useMemo(() => [
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&h=800&fit=crop&crop=center&auto=format&q=80',
    'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200&h=800&fit=crop&crop=center&auto=format&q=80',
    'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200&h=800&fit=crop&crop=center&auto=format&q=80',
    'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=1200&h=800&fit=crop&crop=center&auto=format&q=80',
    'https://images.unsplash.com/photo-1471940408576-1073921470b4?w=1200&h=800&fit=crop&crop=center&auto=format&q=80'
  ], []);

  // Funcție pentru convertirea URL-urilor Google prin proxy
  const convertToProxyUrl = useCallback((googlePhotoUrl) => {
    if (!googlePhotoUrl?.includes('googleapis.com')) return googlePhotoUrl;
    
    try {
      // Folosește un proxy simplu și stabil
      return `https://api.allorigins.win/raw?url=${encodeURIComponent(googlePhotoUrl)}`;
    } catch (error) {
      console.error('Eroare convertire proxy URL:', error);
      return googlePhotoUrl;
    }
  }, []);

  // Funcție pentru handle-ul erorii de încărcare a imaginii
  const handleImageError = useCallback((e, index = 0, imageUrl = '') => {
    try {
      const safeIndex = Number.isInteger(index) ? index : 0;
      console.error(`❌ Eroare la încărcarea imaginii ${safeIndex + 1}:`, imageUrl.substring(0, 100) + '...');

      if (!e.target || e.target.getAttribute('data-fallback') === 'true') {
        console.log('⚠️ Elementul are deja fallback setat sau este null');
        return;
      }

      // Marchează imaginea ca failed
      setImaginiFailed(prev => new Set([...prev, imageUrl]));

      const fallbackIndex = safeIndex % fallbackImages.length;
      const fallbackImage = fallbackImages[fallbackIndex];

      if (fallbackImage && e.target) {
        e.target.src = fallbackImage;
        e.target.setAttribute('data-fallback', 'true');
        console.log(`🔄 Fallback aplicat: imagine ${fallbackIndex + 1}`);

        // Actualizează lista de imagini pentru a înlocui imaginea failed
        setImagini(prevImagini => {
          const newImagini = [...prevImagini];
          if (newImagini[safeIndex] === imageUrl) {
            newImagini[safeIndex] = fallbackImage;
          }
          return newImagini;
        });
      }
    } catch (error) {
      console.error('❌ Eroare în handleImageError:', error);
    }
  }, [fallbackImages]);

  // Funcție pentru procesarea imaginilor REALE
  const processRealImages = useCallback((plajaData) => {
    if (!plajaData) {
      console.log('⚠️ Nu există date plajă pentru procesare imagini');
      return fallbackImages.slice(0, 5);
    }

    console.log('🖼️ Procesare imagini pentru:', plajaData?.denumire);

    let realImages = [];
    const MAX_IMAGES = 5;

    // Verifică dacă există photos în detaliiWeb
    if (plajaData?.detaliiWeb?.photos && Array.isArray(plajaData.detaliiWeb.photos)) {
      console.log('📸 Găsite photos în detaliiWeb:', plajaData.detaliiWeb.photos.length);

      const photos = plajaData.detaliiWeb.photos;
      const firstPhoto = photos[0];

      if (typeof firstPhoto === 'string') {
        // Photos sunt URL-uri Google - le convertim prin proxy
        console.log('📷 Convertesc URL-uri Google prin proxy...');

        realImages = photos
          .slice(0, MAX_IMAGES)
          .filter(photo => typeof photo === 'string' && photo.length > 0)
          .map(photo => convertToProxyUrl(photo));

        console.log(`✅ ${realImages.length} URL-uri Google convertite prin proxy`);

      } else if (typeof firstPhoto === 'object' && firstPhoto !== null) {
        // Photos sunt obiecte cu photo_reference
        console.log('📷 Procesez obiecte photo_reference...');

        const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

        if (apiKey) {
          photos.slice(0, MAX_IMAGES).forEach((photo, index) => {
            const photoRef = photo.photo_reference || photo.photoReference ||
              photo['photo-reference'] || photo.reference ||
              photo.photoRef || photo.photo_id || photo.photoId || photo.id;

            if (photoRef && photoRef.length > 10) {
              const googleUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=1200&photoreference=${photoRef}&key=${apiKey}`;
              const proxyUrl = convertToProxyUrl(googleUrl);
              realImages.push(proxyUrl);
              console.log(`📷 Photo ${index + 1} convertită prin proxy`);
            }
          });

          console.log(`✅ ${realImages.length} imagini din obiecte convertite prin proxy`);
        } else {
          console.warn('⚠️ API Key lipsă pentru Google Photos');
        }
      }
    }

    // Dacă nu avem suficiente imagini reale, completăm cu fallback
    if (realImages.length === 0) {
      console.log('⚠️ Nu există imagini reale - folosesc fallback');
      return fallbackImages.slice(0, MAX_IMAGES);
    } else if (realImages.length < MAX_IMAGES) {
      const needMore = MAX_IMAGES - realImages.length;
      realImages = [...realImages, ...fallbackImages.slice(0, needMore)];
      console.log(`🔄 Completat cu ${needMore} imagini fallback`);
    }

    console.log(`✅ Total imagini procesate: ${realImages.length}`);
    return realImages;
  }, [convertToProxyUrl, fallbackImages]);

  // Funcție pentru încărcarea imaginilor
  const loadImages = useCallback(async (plajaData) => {
    if (!plajaData) {
      console.log('⚠️ Nu există date plajă pentru încărcare imagini');
      setImagini(fallbackImages.slice(0, 5));
      setHeaderImage(fallbackImages[0]);
      setIncarcaImagini(false);
      return;
    }

    try {
      console.log('🚀 Încărcare imagini pentru:', plajaData?.denumire);
      setIncarcaImagini(true);
      setImaginiFailed(new Set());

      const processedImages = processRealImages(plajaData);

      setImagini(processedImages);
      setHeaderImage(processedImages[0]);

      console.log('✅ Imagini setate:', processedImages.length);

    } catch (error) {
      console.error('❌ Eroare la încărcarea imaginilor:', error);
      setImagini(fallbackImages.slice(0, 5));
      setHeaderImage(fallbackImages[0]);
    } finally {
      setIncarcaImagini(false);
    }
  }, [processRealImages, fallbackImages]);

  // Funcție pentru schimbarea imaginii de header
  const changeHeaderImage = useCallback((newImageUrl) => {
    if (newImageUrl && typeof newImageUrl === 'string') {
      console.log('🔄 Schimb header imagine la:', newImageUrl.substring(0, 50) + '...');
      setHeaderImage(newImageUrl);
    }
  }, []);

  // Effect pentru încărcarea imaginilor
  useEffect(() => {
    if (plaja?.id) {
      loadImages(plaja);
    }
  }, [plaja?.id, loadImages]);

  // Loading state
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

  // Calculează datele pentru afișare
  const numarSezlonguri = plaja.numarSezlonguri || 0;
  const numarUmbrele = Math.ceil(numarSezlonguri / 2);
  const temperatura = plaja.detaliiWeb?.weather?.temperature;
  const vant = plaja.detaliiWeb?.weather?.wind_speed;
  const valuri = plaja.detaliiWeb?.weather?.wave_height || 0.5;
  const umiditate = plaja.detaliiWeb?.weather?.humidity || 65;
  const temperaturaApa = plaja.detaliiWeb?.weather?.water_temperature || 
    (temperatura ? Math.max(20, temperatura - 4) : 22);

  // Statistici pentru debug
  const realImagesCount = imagini.filter(img =>
    img.includes('proxy') || (img.includes('googleapis') && !img.includes('unsplash'))
  ).length;
  const fallbackImagesCount = imagini.length - realImagesCount;

  return (
    <div className="container my-5">
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
                  key={`thumbnail-${plaja.id}-${index}`}
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
                  onError={(e) => handleImageError(e, index, img)}
                  loading="lazy"
                  decoding="async"
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
                <div className="d-flex gap-2">
                  <span className="badge bg-primary">{imagini.length} imagini</span>
                  {realImagesCount > 0 && (
                    <span className="badge bg-success">{realImagesCount} reale</span>
                  )}
                  {fallbackImagesCount > 0 && (
                    <span className="badge bg-warning">{fallbackImagesCount} fallback</span>
                  )}
                  {imaginiFailed.size > 0 && (
                    <span className="badge bg-danger">{imaginiFailed.size} eșuate</span>
                  )}
                </div>
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
                    <div className="col-md-4" key={`gallery-${plaja.id}-${index}`}>
                      <div className="position-relative">
                        <img
                          src={photo}
                          className="img-fluid rounded"
                          alt={`${plaja.denumire} - ${index + 1}`}
                          style={{
                            height: '200px',
                            width: '100%',
                            objectFit: 'cover',
                            cursor: 'pointer',
                            transition: 'transform 0.2s ease'
                          }}
                          onError={(e) => handleImageError(e, index, photo)}
                          onClick={() => window.open(photo, '_blank')}
                          loading="lazy"
                          decoding="async"
                          onMouseEnter={(e) => e.target.style.transform = 'scale(1.02)'}
                          onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
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

                        {/* Indicator pentru tipul imaginii */}
                        <div className="position-absolute bottom-0 start-0 p-2">
                          <span className={`badge ${photo.includes('proxy') || photo.includes('googleapis') ? 'bg-success' : 'bg-warning'
                            }`}>
                            {photo.includes('proxy') || photo.includes('googleapis') ? 'Reală' : 'Fallback'}
                          </span>
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
                  <div className="review-card mb-4 pb-3 border-bottom" key={`review-${idx}`}>
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

          {/* Card Locație cu Google Maps */}
          <div className="card shadow-sm rounded-4">
            <div className="card-body">
              <h5 className="card-title border-bottom pb-2 mb-3">Locație</h5>
              
              {/* Container hartă optimizată */}
              <div className="rounded-3 overflow-hidden mb-3" style={{ height: '200px' }}>
                {(() => {
                  // Obține coordonatele reale ale plajei
                  const lat = plaja?.coordonate?.lat || plaja?.detaliiWeb?.geometry?.location?.lat;
                  const lng = plaja?.coordonate?.lng || plaja?.detaliiWeb?.geometry?.location?.lng;
                  const placeName = plaja?.denumire;
                  const stationName = plaja?.statiune?.denumire;
                  
                  let embedUrl;
                  
                  if (lat && lng) {
                    // Hartă cu coordonate exacte
                    embedUrl = `https://maps.google.com/maps?q=${lat},${lng}&hl=ro&z=16&output=embed&iwloc=near`;
                  } else {
                    // Hartă cu căutare optimizată
                    const searchQuery = encodeURIComponent(`${placeName} ${stationName} plajă`);
                    embedUrl = `https://maps.google.com/maps?q=${searchQuery}&hl=ro&z=16&output=embed`;
                  }
                  
                  return (
                    <div className="position-relative w-100 h-100">
                      {/* Hartă Google Maps */}
                      <iframe
                        src={embedUrl}
                        width="100%"
                        height="200"
                        style={{ 
                          border: 0, 
                          borderRadius: '12px',
                          filter: 'contrast(1.1) saturate(1.1)'
                        }}
                        allowFullScreen=""
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title={`Hartă ${placeName}`}
                        className="w-100 h-100"
                        onLoad={() => {
                          console.log(`✅ Hartă încărcată pentru ${placeName}`);
                        }}
                        onError={() => {
                          console.log(`⚠️ Eroare hartă pentru ${placeName}`);
                        }}
                      />
                      
                      {/* Badge cu numele plajei */}
                      <div 
                        className="position-absolute top-0 start-0 m-3 px-3 py-2 rounded-pill d-flex align-items-center"
                        style={{
                          backgroundColor: 'rgba(255, 255, 255, 0.95)',
                          backdropFilter: 'blur(10px)',
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                          fontSize: '0.875rem',
                          fontWeight: '600',
                          color: '#1f2937',
                          border: '1px solid rgba(255, 255, 255, 0.2)'
                        }}
                      >
                        <span style={{ marginRight: '6px' }}>📍</span>
                        {placeName}
                      </div>
                      
                      {/* Buton pentru navigație */}
                      <button
                        className="btn btn-primary btn-sm position-absolute bottom-0 end-0 m-3 d-flex align-items-center"
                        onClick={() => {
                          if (lat && lng) {
                            const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
                            window.open(googleMapsUrl, '_blank');
                          } else {
                            const searchQuery = encodeURIComponent(`${placeName} ${stationName}`);
                            const googleMapsUrl = `https://www.google.com/maps/search/${searchQuery}`;
                            window.open(googleMapsUrl, '_blank');
                          }
                        }}
                        title="Deschide în Google Maps pentru navigație"
                        style={{
                          fontSize: '0.75rem',
                          padding: '0.5rem 0.75rem',
                          fontWeight: '600',
                          boxShadow: '0 2px 8px rgba(59, 130, 246, 0.3)',
                          border: 'none'
                        }}
                      >
                        <span style={{ marginRight: '4px' }}>🧭</span>
                        Navighează
                      </button>
                    </div>
                  );
                })()}
              </div>
              
              {/* Adresa */}
              <div className="mb-3">
                <div className="d-flex align-items-start">
                  <IconMapPin className="me-2 text-primary mt-1 flex-shrink-0" size={16} />
                  <div className="flex-grow-1">
                    <p className="mb-1 fw-medium">{plaja?.denumire}</p>
                    <p className="mb-0 text-muted small">
                      {plaja?.detaliiWeb?.formatted_address || `${plaja?.statiune?.denumire}, Constanța, România`}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Coordonate GPS */}
              {(plaja?.coordonate?.lat && plaja?.coordonate?.lng) && (
                <div className="mb-3 p-2 bg-light rounded-3">
                  <small className="text-muted d-flex align-items-center">
                    <span className="me-2">🎯</span>
                    <strong>Coordonate GPS:</strong>
                    <span className="ms-2 font-monospace">
                      {parseFloat(plaja.coordonate.lat).toFixed(6)}, {parseFloat(plaja.coordonate.lng).toFixed(6)}
                    </span>
                  </small>
                </div>
              )}
              
              {/* Butoane navigație */}
              <div className="d-grid gap-2">
                <button 
                  className="btn btn-primary d-flex align-items-center justify-content-center"
                  onClick={() => {
                    const lat = plaja?.coordonate?.lat || plaja?.detaliiWeb?.geometry?.location?.lat;
                    const lng = plaja?.coordonate?.lng || plaja?.detaliiWeb?.geometry?.location?.lng;
                    
                    if (lat && lng) {
                      const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&destination_place_id=${plaja?.detaliiWeb?.place_id || ''}`;
                      window.open(googleMapsUrl, '_blank');
                    } else {
                      const searchQuery = encodeURIComponent(`${plaja?.denumire} ${plaja?.statiune?.denumire} plajă`);
                      const googleMapsUrl = `https://www.google.com/maps/search/${searchQuery}`;
                      window.open(googleMapsUrl, '_blank');
                    }
                  }}
                  style={{ fontWeight: '600' }}
                >
                  <IconDirections className="me-2" size={18} />
                  Indicații spre {plaja?.denumire}
                </button>
                
                <button 
                  className="btn btn-outline-primary btn-sm d-flex align-items-center justify-content-center"
                  onClick={() => {
                    const lat = plaja?.coordonate?.lat || plaja?.detaliiWeb?.geometry?.location?.lat;
                    const lng = plaja?.coordonate?.lng || plaja?.detaliiWeb?.geometry?.location?.lng;
                    
                    if (lat && lng) {
                      const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
                      window.open(googleMapsUrl, '_blank');
                    } else {
                      const searchQuery = encodeURIComponent(`${plaja?.denumire} ${plaja?.statiune?.denumire}`);
                      const googleMapsUrl = `https://www.google.com/maps/search/${searchQuery}`;
                      window.open(googleMapsUrl, '_blank');
                    }
                  }}
                >
                  <span className="me-2">🗺️</span>
                  Vezi pe hartă
                </button>
              </div>
              
              {/* Info suplimentară */}
              {(plaja?.detaliiWeb?.website || plaja?.detaliiWeb?.formatted_phone_number) && (
                <div className="mt-3 pt-3 border-top">
                  {plaja?.detaliiWeb?.website && (
                    <div className="mb-2">
                      <small className="text-muted d-block mb-1">Website oficial:</small>
                      <a 
                        href={plaja.detaliiWeb.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-decoration-none small d-flex align-items-center"
                      >
                        <span className="me-2">🌐</span>
                        {plaja.detaliiWeb.website.replace(/^https?:\/\//, '')}
                      </a>
                    </div>
                  )}
                  
                  {plaja?.detaliiWeb?.formatted_phone_number && (
                    <div>
                      <small className="text-muted d-block mb-1">Telefon:</small>
                      <a 
                        href={`tel:${plaja.detaliiWeb.formatted_phone_number}`}
                        className="text-decoration-none small d-flex align-items-center"
                      >
                        <span className="me-2">📞</span>
                        {plaja.detaliiWeb.formatted_phone_number}
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlajaDetails;