import React, { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Link } from "react-router-dom";
import ApiClient from "../api/src/ApiClient";
import StatiuneControllerApi from "../api/src/api/StatiuneControllerApi";
import PlajaControllerApi from "../api/src/api/PlajaControllerApi";
import PlajaCard from "../components/plaje/PlajaCard";

// Inițializează API Clientul
const apiClient = new ApiClient();
apiClient.enableCookies = true;
const statiuneApi = new StatiuneControllerApi(apiClient);
const plajaApi = new PlajaControllerApi(apiClient);

// Rezolvă problema cu iconii Leaflet în React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png"
});

// Icon personalizat pentru marcatori
const customIcon = new L.Icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

// Componentă pentru a centra pe o stațiune selectată
const FlyToLocation = ({ location }) => {
  const map = useMap();
  useEffect(() => {
    if (location) {
      map.flyTo([location.latitudine, location.longitudine], 13, {
        duration: 1.5
      });
    }
  }, [location, map]);

  return null;
};
const MapPage = () => {
  const [statiuni, setStatiuni] = useState([]);
  const [plaje, setPlaje] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingPlaje, setLoadingPlaje] = useState(false);
  const [selectedStatiune, setSelectedStatiune] = useState(null);
  const [plajeInStatiune, setPlajeInStatiune] = useState([]);
  const popupRefs = useRef({});

  useEffect(() => {
    setLoading(true);
    statiuneApi.getAllStatiuniUsingGET((error, data) => {
      if (error) {
        console.error("Eroare la preluarea stațiunilor:", error);
        setError("Nu s-au putut încărca stațiunile.");
      } else {
        console.log("Stațiuni primite de la API:", data);
        setStatiuni(data || []);
      }
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    plajaApi.getAllPlajeUsingGET((error, data) => {
      if (error) {
        console.error("Eroare la preluarea plajelor:", error);
      } else {
        console.log("Plaje primite de la API:", data);
        setPlaje(data || []);
      }
    });
  }, []);

  // Filtrarea stațiunilor pentru afișare
  const statiuniValide = statiuni.filter(
    (st) =>
      st.latitudine !== undefined && 
      st.latitudine !== null &&
      st.latitudine !== 0 &&
      st.longitudine !== undefined &&
      st.longitudine !== null &&
      st.longitudine !== 0
  );

  // Funcție pentru găsirea plajelor dintr-o stațiune
  const getPlajeInStatiune = (statiune) => {
    if (!statiune || !plaje.length) return [];
    
    // Filtrăm plajele care aparțin acestei stațiuni
    const plajeFiltered = plaje.filter(plaja => {
      // Verificăm dacă plaja aparține acestei stațiuni
      if (plaja.statiune && plaja.statiune.id === statiune.id) {
        return true;
      }
      
      // Sau verificăm după denumirea stațiunii (backup)
      if (plaja.statiune && plaja.statiune.denumire === statiune.denumire) {
        return true;
      }
      
      return false;
    });
    
    console.log(`Plaje găsite pentru ${statiune.denumire}:`, plajeFiltered.length);
    return plajeFiltered;
  };

  const handleStatiuneClick = (statiune) => {
    console.log("Selectez stațiunea:", statiune.denumire);
    setSelectedStatiune(statiune);
    setLoadingPlaje(true);

    // Găsim plajele din această stațiune
    const plajeGasite = getPlajeInStatiune(statiune);
    setPlajeInStatiune(plajeGasite);
    setLoadingPlaje(false);

    // Deschide popup-ul corespunzător (dacă există referința)
    const popup = popupRefs.current[statiune.id];
    if (popup) {
      popup.openPopup();
    }
  };

  return (
    <div className="container py-5">
      <div className="row mb-4">
        <div className="col-12">
          <h1 className="fw-bold border-start ps-4" style={{ borderLeftWidth: '4px !important', borderLeftColor: '#20c997 !important' }}>
            Stațiuni cu Plaje
          </h1>
          <p className="lead">
            Descoperă cele mai populare stațiuni și plajele disponibile în fiecare dintre ele.
          </p>
        </div>
      </div>
      
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      
      {loading ? (
        <div className="d-flex justify-content-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Se încarcă...</span>
          </div>
        </div>
      ) : (
        <div className="row">
          {/* Lista de stațiuni */}
          <div className="col-lg-4 mb-4 mb-lg-0">
            <div className="card border-0 shadow-sm rounded-4 h-100">
              <div className="card-header bg-white border-0 pt-4 pb-0">
                <h5 className="fw-bold mb-0">Listă Stațiuni</h5>
                <hr className="my-3" />
              </div>
              <div className="card-body p-0" style={{ maxHeight: '500px', overflowY: 'auto' }}>
                {statiuniValide.length === 0 ? (
                  <div className="p-4 text-center">
                    <p className="text-muted mb-0">Nu există stațiuni disponibile.</p>
                  </div>
                ) : (
                  <ul className="list-group list-group-flush">
                    {statiuniValide.map((statiune) => {
                      const plajeCount = getPlajeInStatiune(statiune).length;
                      return (
                        <li
                          key={statiune.id}
                          className={`list-group-item list-group-item-action border-0 px-4 py-3 d-flex align-items-center ${
                            selectedStatiune?.id === statiune.id ? 'active bg-primary text-white' : ''
                          }`}
                          onClick={() => handleStatiuneClick(statiune)}
                          style={{ cursor: 'pointer' }}
                        >
                          <div>
                            <span className={`me-3 badge rounded-pill ${selectedStatiune?.id === statiune.id ? 'bg-white text-primary' : 'bg-light'}`}>
                              {plajeCount}
                            </span>
                          </div>
                          <div>
                            <h6 className="mb-0 fw-semibold">{statiune.denumire}</h6>
                            {statiune.judet && (
                              <small className={selectedStatiune?.id === statiune.id ? 'text-white-50' : 'text-muted'}>
                                {statiune.judet}
                              </small>
                            )}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            </div>
          </div>

          {/* Harta */}
          <div className="col-lg-8">
            <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
              {statiuniValide.length === 0 && !loading ? (
                <div className="p-5 text-center">
                  <p className="mb-0">Nu există stațiuni cu coordonate valide de afișat pe hartă.</p>
                </div>
              ) : (
                <MapContainer
                  center={[44.1762, 28.6516]} // Constanța
                  zoom={8}
                  style={{ height: '600px', width: '100%' }}
                >
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                  {/* Când selectezi o stațiune */}
                  <FlyToLocation location={selectedStatiune} />

                  {statiuniValide.map((statiune) => {
                    const plajeCount = getPlajeInStatiune(statiune).length;
                    return (
                      <Marker
                        key={statiune.id}
                        position={[statiune.latitudine, statiune.longitudine]}
                        icon={customIcon}
                        ref={(ref) => (popupRefs.current[statiune.id] = ref)}
                      >
                        <Popup>
                          <div className="popup-content">
                            <h6 className="fw-bold mb-1">{statiune.denumire}</h6>
                            {statiune.judet && (
                              <p className="mb-2 small text-muted">{statiune.judet}</p>
                            )}
                            <p className="mb-2 small">
                              <strong>Plaje disponibile:</strong> {plajeCount}
                            </p>
                            {plajeCount > 0 ? (
                              <button 
                                className="btn btn-sm btn-primary rounded-pill w-100"
                                onClick={() => handleStatiuneClick(statiune)}
                              >
                                Vezi plajele
                              </button>
                            ) : (
                              <p className="mb-0 small text-muted">Nicio plajă disponibilă în această stațiune.</p>
                            )}
                          </div>
                        </Popup>
                      </Marker>
                    );
                  })}
                </MapContainer>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Secțiunea Plaje din Stațiunea Selectată */}
      {selectedStatiune && (
        <div className="row mt-5">
          <div className="col-12">
            <div className="card border-0 shadow-sm rounded-4">
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div>
                    <h2 className="h4 fw-bold mb-2">
                      Plaje din {selectedStatiune.denumire}
                    </h2>
                    <p className="text-muted mb-0">
                      {selectedStatiune.descriere || 
                       `Descoperă plajele disponibile în stațiunea ${selectedStatiune.denumire}, ${selectedStatiune.judet || "România"}.`}
                    </p>
                  </div>
                  <div className="text-end">
                    <span className="badge bg-primary fs-6 px-3 py-2">
                      {plajeInStatiune.length} plaje
                    </span>
                  </div>
                </div>
                
                {loadingPlaje ? (
                  <div className="text-center py-5">
                    <div className="spinner-border text-primary mb-3" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="text-muted">Se încarcă plajele...</p>
                  </div>
                ) : plajeInStatiune.length > 0 ? (
                  <>
                    {/* Grid cu plajele */}
                    <div className="row g-4">
                      {plajeInStatiune.map((plaja) => (
                        <div key={plaja.id} className="col-12 col-sm-6 col-lg-4 col-xl-3">
                          <PlajaCard plaja={plaja} />
                        </div>
                      ))}
                    </div>
                    
                    {/* Link către toate plajele din stațiune */}
                    <div className="text-center mt-4 pt-4 border-top">
                      <Link 
                        to={`/plaje?statiune=${selectedStatiune.denumire}`}
                        className="btn btn-outline-primary rounded-pill px-4"
                      >
                        Vezi toate plajele din {selectedStatiune.denumire} cu filtre
                      </Link>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-5">
                    <div style={{ fontSize: '3rem' }} className="text-muted mb-3">🏖️</div>
                    <h5 className="text-muted mb-2">Nicio plajă disponibilă</h5>
                    <p className="text-muted">
                      Momentan nu avem plaje înregistrate pentru stațiunea {selectedStatiune.denumire}.
                    </p>
                    <Link 
                      to="/plaje"
                      className="btn btn-primary rounded-pill px-4"
                    >
                      Vezi toate plajele disponibile
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      
      <style>
        {`
          .hover-card {
            transition: transform 0.3s ease;
          }
          .hover-card:hover {
            transform: translateY(-5px);
          }
        `}
      </style>
    </div>
  );
};

export default MapPage;