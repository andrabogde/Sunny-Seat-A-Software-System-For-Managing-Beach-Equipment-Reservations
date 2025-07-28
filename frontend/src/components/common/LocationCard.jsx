import React, { useState, useEffect, useRef } from 'react';
import { IconMapPin, IconDirections, IconExternalLink } from '@tabler/icons-react';

// Componentă pentru Google Maps
const GoogleMapComponent = ({ plaja, onDirectionsClick }) => {
  const mapRef = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(false);

  // Coordonate default pentru Constanța dacă nu avem coordonate specifice
  const getCoordinates = () => {
    if (plaja?.coordonate?.lat && plaja?.coordonate?.lng) {
      return {
        lat: parseFloat(plaja.coordonate.lat),
        lng: parseFloat(plaja.coordonate.lng)
      };
    }
    
    // Coordonate default pentru centrul Constanței
    return { lat: 44.1598, lng: 28.6348 };
  };

  const initializeMap = () => {
    if (!window.google || !mapRef.current) return;

    try {
      const coordinates = getCoordinates();
      
      const map = new window.google.maps.Map(mapRef.current, {
        center: coordinates,
        zoom: 15,
        styles: [
          {
            featureType: "water",
            elementType: "geometry",
            stylers: [{ color: "#0ea5e9" }]
          },
          {
            featureType: "landscape.natural",
            elementType: "geometry.fill",
            stylers: [{ color: "#fef3c7" }]
          }
        ],
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: true,
        zoomControl: true,
        gestureHandling: 'cooperative'
      });

      // Adaugă marker pentru plajă
      const marker = new window.google.maps.Marker({
        position: coordinates,
        map: map,
        title: plaja?.denumire || 'Plaja',
        icon: {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
              <circle cx="20" cy="20" r="18" fill="#0ea5e9" stroke="#ffffff" stroke-width="3"/>
              <text x="20" y="26" text-anchor="middle" fill="white" font-size="20">🏖️</text>
            </svg>
          `),
          scaledSize: new window.google.maps.Size(40, 40),
          anchor: new window.google.maps.Point(20, 20)
        },
        animation: window.google.maps.Animation.DROP
      });

      // InfoWindow cu detalii plajă
      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div style="padding: 8px; max-width: 200px;">
            <h6 style="margin: 0 0 8px 0; color: #0ea5e9;">${plaja?.denumire || 'Plaja'}</h6>
            <p style="margin: 0 0 8px 0; font-size: 14px;">${plaja?.statiune?.denumire || 'Constanța'}</p>
            <button 
              onclick="window.open('https://www.google.com/maps/dir/?api=1&destination=${coordinates.lat},${coordinates.lng}', '_blank')"
              style="background: #0ea5e9; color: white; border: none; padding: 6px 12px; border-radius: 4px; font-size: 12px; cursor: pointer;"
            >
              🧭 Indicații
            </button>
          </div>
        `
      });

      marker.addListener('click', () => {
        infoWindow.open(map, marker);
      });

      setMapLoaded(true);
    } catch (error) {
      console.error('Eroare la inițializarea Google Maps:', error);
      setMapError(true);
    }
  };

  useEffect(() => {
    // Verifică dacă Google Maps API este deja încărcat
    if (window.google && window.google.maps) {
      initializeMap();
      return;
    }

    // Încarcă Google Maps API
    const loadGoogleMaps = () => {
      if (document.querySelector('script[src*="maps.googleapis.com"]')) {
        // Script-ul este deja în proces de încărcare
        const checkGoogle = setInterval(() => {
          if (window.google && window.google.maps) {
            clearInterval(checkGoogle);
            initializeMap();
          }
        }, 100);
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        initializeMap();
      };
      
      script.onerror = () => {
        console.error('Eroare la încărcarea Google Maps API');
        setMapError(true);
      };

      document.head.appendChild(script);
    };

    loadGoogleMaps();
  }, [plaja]);

  if (mapError) {
    return (
      <div className="h-100 d-flex align-items-center justify-content-center bg-light rounded-3">
        <div className="text-center">
          <IconMapPin className="text-muted mb-2" size={48} />
          <p className="mb-0 text-muted">Hartă indisponibilă</p>
          <small className="text-muted">Folosește butonul Indicații</small>
        </div>
      </div>
    );
  }

  if (!mapLoaded) {
    return (
      <div className="h-100 d-flex align-items-center justify-content-center bg-light rounded-3">
        <div className="text-center">
          <div className="spinner-border text-primary mb-2" role="status">
            <span className="visually-hidden">Se încarcă harta...</span>
          </div>
          <p className="mb-0 text-muted">Se încarcă harta...</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={mapRef} 
      className="w-100 h-100 rounded-3"
      style={{ minHeight: '200px' }}
    />
  );
};

// Componenta principală pentru cardul de locație
const LocationCard = ({ plaja }) => {
  const [showMap, setShowMap] = useState(true);

  const getCoordinates = () => {
    if (plaja?.coordonate?.lat && plaja?.coordonate?.lng) {
      return {
        lat: parseFloat(plaja.coordonate.lat),
        lng: parseFloat(plaja.coordonate.lng)
      };
    }
    return { lat: 44.1598, lng: 28.6348 }; // Default Constanța
  };

  const handleDirectionsClick = () => {
    const coordinates = getCoordinates();
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${coordinates.lat},${coordinates.lng}&destination_place_id=${plaja?.place_id || ''}`;
    window.open(googleMapsUrl, '_blank');
  };

  const handleViewInMaps = () => {
    const coordinates = getCoordinates();
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${coordinates.lat},${coordinates.lng}`;
    window.open(googleMapsUrl, '_blank');
  };

  const getFullAddress = () => {
    const parts = [];
    
    if (plaja?.detaliiWeb?.formatted_address) {
      return plaja.detaliiWeb.formatted_address;
    }
    
    if (plaja?.statiune?.denumire) {
      parts.push(plaja.statiune.denumire);
    }
    
    parts.push('Constanța', 'România');
    return parts.join(', ');
  };

  return (
    <div className="card shadow-sm rounded-4">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center border-bottom pb-2 mb-3">
          <h5 className="card-title mb-0">Locație</h5>
          <div className="d-flex gap-1">
            <button
              className={`btn btn-sm ${showMap ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setShowMap(true)}
              title="Afișează harta"
            >
              🗺️
            </button>
            <button
              className="btn btn-sm btn-outline-primary"
              onClick={handleViewInMaps}
              title="Deschide în Google Maps"
            >
              <IconExternalLink size={16} />
            </button>
          </div>
        </div>
        
        {/* Container hartă */}
        <div className="rounded-3 overflow-hidden mb-3" style={{ height: '200px' }}>
          {showMap ? (
            <GoogleMapComponent 
              plaja={plaja} 
              onDirectionsClick={handleDirectionsClick}
            />
          ) : (
            <div className="h-100 d-flex align-items-center justify-content-center bg-light">
              <div className="text-center">
                <IconMapPin className="text-primary mb-2" size={48} />
                <p className="mb-0">Hartă interactivă</p>
                <small className="text-muted">Click pentru a afișa</small>
              </div>
            </div>
          )}
        </div>
        
        {/* Adresa */}
        <div className="mb-3">
          <div className="d-flex align-items-start">
            <IconMapPin className="me-2 text-primary mt-1 flex-shrink-0" size={16} />
            <div>
              <p className="mb-1 fw-medium">{plaja?.denumire}</p>
              <p className="mb-0 text-muted small">{getFullAddress()}</p>
            </div>
          </div>
        </div>
        
        {/* Coordonate (dacă există) */}
        {plaja?.coordonate?.lat && plaja?.coordonate?.lng && (
          <div className="mb-3">
            <small className="text-muted">
              📍 {parseFloat(plaja.coordonate.lat).toFixed(6)}, {parseFloat(plaja.coordonate.lng).toFixed(6)}
            </small>
          </div>
        )}
        
        {/* Butoane acțiuni */}
        <div className="d-grid gap-2">
          <button 
            className="btn btn-primary"
            onClick={handleDirectionsClick}
          >
            <IconDirections className="me-1" /> Indicații spre plajă
          </button>
          <button 
            className="btn btn-outline-primary btn-sm"
            onClick={handleViewInMaps}
          >
            <IconExternalLink className="me-1" size={16} /> Deschide în Google Maps
          </button>
        </div>
      </div>
    </div>
  );
};

export default LocationCard;