import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

/**
 * PlajaCard cu proxy IMEDIAT pentru a evita blocarea Google
 */
const PlajaCard = ({ plaja, className = '' }) => {
  const [imageUrl, setImageUrl] = useState('');
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isRealImage, setIsRealImage] = useState(false);
  const [currentImageData, setCurrentImageData] = useState(null);
  const [proxyAttempt, setProxyAttempt] = useState(0);

  // Fallback DOAR pentru cazuri extreme
  const fallbackImage = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop&crop=center&auto=format&q=80';

  // PROXY MULTIPLE pentru Google URLs - REDUNDANȚĂ
  const applyProxy = (googleUrl, proxyIndex = 0) => {
    if (!googleUrl || !googleUrl.includes('googleapis.com')) {
      return googleUrl;
    }
    
    // Lista de proxy-uri alternative
    const proxies = [
      'https://api.allorigins.win/raw?url=',
      'https://corsproxy.io/?',
      'https://thingproxy.freeboard.io/fetch/',
      'https://api.codetabs.com/v1/proxy?quest='
    ];
    
    const selectedProxy = proxies[proxyIndex % proxies.length];
    
    if (selectedProxy.includes('allorigins.win') || selectedProxy.includes('codetabs.com')) {
      return `${selectedProxy}${encodeURIComponent(googleUrl)}`;
    } else {
      return `${selectedProxy}${googleUrl}`;
    }
  };

  // Construiește URL-ul imaginii cu PROXY APLICAT IMEDIAT + FALLBACK LA ALTE PROXY-uri
  const buildImageUrl = (plajaData) => {
    if (!plajaData?.detaliiWeb?.photos || !Array.isArray(plajaData.detaliiWeb.photos)) {
      console.log('❌ Nu există photos pentru:', plajaData?.denumire);
      return null;
    }

    const photos = plajaData.detaliiWeb.photos;
    
    // Încearcă să găsească ORICE imagine funcțională din listă
    for (let i = 0; i < Math.min(photos.length, 3); i++) {
      const photo = photos[i];
      
      if (!photo) continue;

      let googleUrl = null;

      // Dacă e URL string direct
      if (typeof photo === 'string') {
        googleUrl = photo;
        console.log(`✅ URL direct găsit pentru ${plajaData?.denumire} (imagine ${i + 1})`);
      }
      // Dacă e obiect cu photo_reference
      else if (typeof photo === 'object' && photo.photo_reference) {
        const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY || 'AIzaSyAFx94qZOmhNHRgEm17hh9C83bP_xXEwFI';
        googleUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=${photo.photo_reference}&key=${apiKey}`;
        console.log(`✅ URL Google construit pentru ${plajaData?.denumire} (imagine ${i + 1})`);
      }

      if (googleUrl) {
        // APLICĂ PRIMUL PROXY
        const proxiedUrl = applyProxy(googleUrl, 0);
        console.log(`🔒 Proxy aplicat pentru ${plajaData?.denumire} (imagine ${i + 1})`);
        return { url: proxiedUrl, originalUrl: googleUrl, photoIndex: i };
      }
    }

    console.log('❌ Nicio imagine funcțională găsită pentru:', plajaData?.denumire);
    return null;
  };

  // Effect pentru setarea IMEDIATĂ a imaginii
  useEffect(() => {
    if (!plaja?.id) {
      return;
    }

    console.log('🚀 Procesez imaginea pentru:', plaja?.denumire);

    // Construiește URL-ul imaginii cu proxy
    const imageData = buildImageUrl(plaja);
    
    if (imageData && imageData.url) {
      console.log('✅ Setez imagine reală cu proxy pentru:', plaja?.denumire);
      setImageUrl(imageData.url);
      setCurrentImageData(imageData);
      setIsRealImage(true);
      setProxyAttempt(0);
    } else {
      console.log('⚠️ Nu s-a găsit imagine reală, folosesc fallback pentru:', plaja?.denumire);
      setImageUrl(fallbackImage);
      setCurrentImageData(null);
      setIsRealImage(false);
    }

    // Reset loading state
    setImageLoaded(false);
  }, [plaja?.id, plaja?.denumire, plaja?.detaliiWeb?.photos]);

  // Handle pentru încărcarea cu succes
  const handleImageLoad = () => {
    setImageLoaded(true);
    console.log('✅ Imagine încărcată cu succes pentru:', plaja?.denumire);
  };

  // Handle pentru eroare - ÎNCEARCĂ PROXY-URI ALTERNATIVE
  const handleImageError = (e) => {
    if (!currentImageData || !currentImageData.originalUrl) {
      console.log('❌ Eroare finală pentru:', plaja?.denumire, 'trecem la fallback');
      if (e.target && e.target.src !== fallbackImage) {
        e.target.src = fallbackImage;
        setIsRealImage(false);
        setImageLoaded(true);
      }
      return;
    }

    // Încearcă următorul proxy
    const nextProxyIndex = proxyAttempt + 1;
    const maxProxies = 4; // Avem 4 proxy-uri

    if (nextProxyIndex < maxProxies) {
      console.log(`🔄 Încercare proxy ${nextProxyIndex + 1}/${maxProxies} pentru:`, plaja?.denumire);
      
      const newProxiedUrl = applyProxy(currentImageData.originalUrl, nextProxyIndex);
      setProxyAttempt(nextProxyIndex);
      setImageLoaded(false);
      
      if (e.target) {
        e.target.src = newProxiedUrl;
        setImageUrl(newProxiedUrl);
      }
    } else {
      // Toate proxy-urile au eșuat, încearcă următoarea imagine din listă
      const photos = plaja?.detaliiWeb?.photos;
      const nextImageIndex = currentImageData.photoIndex + 1;
      
      if (photos && nextImageIndex < Math.min(photos.length, 3)) {
        console.log(`🔄 Încercare imagine ${nextImageIndex + 1} pentru:`, plaja?.denumire);
        
        const nextPhoto = photos[nextImageIndex];
        let nextGoogleUrl = null;

        if (typeof nextPhoto === 'string') {
          nextGoogleUrl = nextPhoto;
        } else if (typeof nextPhoto === 'object' && nextPhoto.photo_reference) {
          const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY || 'AIzaSyAFx94qZOmhNHRgEm17hh9C83bP_xXEwFI';
          nextGoogleUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=${nextPhoto.photo_reference}&key=${apiKey}`;
        }

        if (nextGoogleUrl) {
          const nextProxiedUrl = applyProxy(nextGoogleUrl, 0);
          setCurrentImageData({ 
            url: nextProxiedUrl, 
            originalUrl: nextGoogleUrl, 
            photoIndex: nextImageIndex 
          });
          setProxyAttempt(0);
          setImageLoaded(false);
          
          if (e.target) {
            e.target.src = nextProxiedUrl;
            setImageUrl(nextProxiedUrl);
          }
          return;
        }
      }

      // Toate încercările au eșuat
      console.log('❌ Toate încercările au eșuat pentru:', plaja?.denumire, 'folosesc fallback');
      if (e.target && e.target.src !== fallbackImage) {
        e.target.src = fallbackImage;
        setIsRealImage(false);
        setImageLoaded(true);
      }
    }
  };

  if (!plaja) {
    return null;
  }

  // Calculează datele pentru afișare
  const rating = plaja.rating || plaja.detaliiWeb?.rating;
  const numarSezlonguri = plaja.numarSezlonguri || plaja.detaliiWeb?.sezlonguri || 0;
  const statiune = plaja.statiune?.denumire || 'Constanța';
  const photosCount = plaja.detaliiWeb?.photos?.length || 0;

  return (
    <div className={`card h-100 shadow-sm border-0 ${className}`}>
      {/* Container pentru imagine */}
      <div className="position-relative overflow-hidden" style={{ height: '200px' }}>
        
        {/* Imaginea principală - AFIȘARE IMEDIATĂ */}
        <img
          src={imageUrl || fallbackImage}
          className="w-100 h-100"
          alt={`Plaja ${plaja.denumire} - ${statiune}`}
          style={{ 
            objectFit: 'cover',
            opacity: imageLoaded ? 1 : 0.8,
            transition: 'opacity 0.2s ease'
          }}
          onLoad={handleImageLoad}
          onError={handleImageError}
          loading="lazy"
          decoding="async"
        />

        {/* Overlay gradient */}
        <div 
          className="position-absolute bottom-0 start-0 w-100"
          style={{
            height: '60px',
            background: 'linear-gradient(transparent, rgba(0,0,0,0.6))',
            pointerEvents: 'none'
          }}
        />

        {/* Rating badge */}
        {rating && (
          <div className="position-absolute bottom-0 start-0 m-2">
            <span className="badge bg-warning text-dark px-2 py-1 rounded-pill shadow">
              ⭐ {typeof rating === 'number' ? rating.toFixed(1) : rating}
            </span>
          </div>
        )}

        {/* Status badge - ELIMINAT */}

        {/* Photos count - ELIMINAT */}

        {/* Proxy attempt indicator - ELIMINAT */}
      </div>

      {/* Conținutul cardului */}
      <div className="card-body d-flex flex-column p-3">
        {/* Titlul */}
        <h5 className="card-title mb-2" style={{ fontSize: '1.1rem', fontWeight: '600' }}>
          {plaja.denumire}
        </h5>
        
        {/* Locația */}
        <div className="d-flex align-items-center text-muted mb-2">
          <span className="me-1">📍</span>
          <small>{statiune}, România</small>
        </div>
        
        {/* Șezlonguri */}
        {numarSezlonguri > 0 && (
          <div className="d-flex align-items-center text-muted mb-2">
            <span className="me-1">🏖️</span>
            <small>{numarSezlonguri} șezlonguri disponibile</small>
          </div>
        )}
        
        {/* Status imagine - ELIMINAT */}
        
        {/* Descrierea */}
        {plaja.descriere && (
          <p className="card-text text-muted small mb-3" style={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}>
            {plaja.descriere}
          </p>
        )}
        
        {/* Spacer */}
        <div className="flex-grow-1"></div>
        
        {/* Butonul de detalii */}
        <Link 
          to={`/plaja/${plaja.id}`}
          className="btn btn-primary btn-sm text-decoration-none"
        >
          🏖️ Vezi detalii
        </Link>
      </div>
    </div>
  );
};

export default PlajaCard;