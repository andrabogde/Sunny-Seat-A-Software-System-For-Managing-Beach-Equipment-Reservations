// import React, { useEffect, useState } from "react";
// import { IconBeach } from "@tabler/icons-react";
// import "@tabler/core/dist/css/tabler.min.css";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "bootstrap/dist/js/bootstrap.bundle.min";
// import ApiClient from "../api/src/ApiClient";
// import PlajaControllerApi from "../api/src/api/PlajaControllerApi";
// import { Modal } from "bootstrap"; // ← import explicit corect
// import { useNavigate } from "react-router-dom";

// const apiClient = new ApiClient();
// apiClient.enableCookies = true;
// const plajaApi = new PlajaControllerApi(apiClient);

// const Home = () => {
//   const [plaje, setPlaje] = useState([]);
//   const [error, setError] = useState(null);
//   const [selectedPlaja, setSelectedPlaja] = useState(null);
//   const navigate = useNavigate();

//   const [filters, setFilters] = useState({
//     statiune: "",
//     rating: 0,
//     sezlonguri: 0,
//   });
  

//   useEffect(() => {
//     plajaApi.getAllPlajeUsingGET((error, data) => {
//       if (error) {
//         console.error("Eroare la încărcarea plajelor:", error);
//         setError("Eroare la încărcarea plajelor.");
//       } else {
//         setPlaje(data || []);
//       }
//     });
//   }, []);

//   const openModal = (plaja) => {
//     setSelectedPlaja(plaja);
//     const modalEl = document.getElementById("plajaModal");
//     const bsModal = new Modal(modalEl);
//     bsModal.show();
//   };
  
// // Filtrare locală
// const plajeFiltrate = plaje.filter((plaja) => {
//   const denumireStatiune = plaja.statiune?.denumire?.toLowerCase() || "";

//   const matchStatiune =
//     !filters.statiune ||
//     denumireStatiune === filters.statiune.toLowerCase();

//   const matchRating =
//     !filters.rating ||
//     (plaja.detaliiWeb?.rating ?? 0) >= parseFloat(filters.rating);

//   const matchSezlonguri =
//     !filters.sezlonguri ||
//     (plaja.numarSezlonguri ?? 0) >= parseInt(filters.sezlonguri);

//   return matchStatiune && matchRating && matchSezlonguri;
// });

//   return (
//     <div className="container mt-4">
//       <h2 className="text-center mb-4">Plaje disponibile</h2>
// {/* Formulare filtrare */}
// <div className="card p-3 mb-4 shadow-sm">
//   <div className="row align-items-end">
//     <div className="col-md-4 mb-3">
//       <label className="form-label">Stațiune</label>
//       <select
//         className="form-select"
//         value={filters.statiune}
//         onChange={(e) => setFilters({ ...filters, statiune: e.target.value })}
//       >
//         <option value="">Toate</option>
//         {[...new Set(plaje.map((p) => p.statiune?.denumire))]
//           .filter(Boolean)
//           .map((nume, idx) => (
//             <option key={idx} value={nume}>
//               {nume}
//             </option>
//           ))}
//       </select>
//     </div>

//     <div className="col-md-4 mb-3">
//       <label className="form-label d-flex justify-content-between">
//         <span>Rating minim</span>
//         <span className="text-primary fw-bold">{filters.rating || "0"}</span>
//       </label>
//       <input
//         type="range"
//         min="0"
//         max="5"
//         step="0.1"
//         className="form-range"
//         value={filters.rating}
//         onChange={(e) => setFilters({ ...filters, rating: e.target.value })}
//       />
//     </div>

//     <div className="col-md-4 mb-3">
//       <label className="form-label d-flex justify-content-between">
//         <span>Șezlonguri minime</span>
//         <span className="text-primary fw-bold">{filters.sezlonguri || "0"}</span>
//       </label>
//       <input
//         type="range"
//         min="0"
//         max="100"
//         step="1"
//         className="form-range"
//         value={filters.sezlonguri}
//         onChange={(e) => setFilters({ ...filters, sezlonguri: e.target.value })}
//       />
//     </div>
//   </div>

//   <div className="text-end mt-2">
//     <button
//       className="btn btn-outline-secondary btn-sm"
//       onClick={() => setFilters({ statiune: "", rating: "", sezlonguri: "" })}
//     >
//       Reset filtre
//     </button>
//   </div>
// </div>


//       {error && <div className="alert alert-danger">{error}</div>}

//       <div className="row">
//         {
//         plajeFiltrate.map((plaja) => {
//           const images = plaja.detaliiWeb?.images?.slice(0, 3) || [];
//           const website = plaja.detaliiWeb?.website;
//           const rating = plaja.detaliiWeb?.rating;
//           const telefon = plaja.detaliiWeb?.phone_number;
//           const temperatura = plaja.detaliiWeb?.weather?.temperature;
//           const vant = plaja.detaliiWeb?.weather?.wind_speed;
//           const nrSezlonguri = plaja.numarSezlonguri;
//           // Filtrare locală


//           return (
//             <div key={plaja.id} className="col-md-4 mb-4">
//               <div className="card shadow-sm h-100 rounded-4 overflow-hidden">
//                 <div
//                   id={`carousel-${plaja.id}`}
//                   className="carousel slide"
//                   data-bs-ride="carousel"
//                 >
//                   <div className="carousel-inner" style={{ height: "240px" }}>
//                     {images.length > 0 ? (
//                       images.map((img, index) => (
//                         <div
//                           key={index}
//                           className={`carousel-item ${index === 0 ? "active" : ""}`}
//                         >
//                           <img
//                             src={img}
//                             className="d-block w-100"
//                             alt="Plajă"
//                             style={{
//                               height: "240px",
//                               objectFit: "cover",
//                             }}
//                           />
//                         </div>
//                       ))
//                     ) : (
//                       <div className="carousel-item active">
//                         <img
//                           src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e"
//                           className="d-block w-100"
//                           alt="Default beach"
//                           style={{
//                             height: "240px",
//                             objectFit: "cover",
//                           }}
//                         />
//                       </div>
//                     )}
//                   </div>
//                   {images.length > 1 && (
//                     <>
//                       <button
//                         className="carousel-control-prev"
//                         type="button"
//                         data-bs-target={`#carousel-${plaja.id}`}
//                         data-bs-slide="prev"
//                       >
//                         <span className="carousel-control-prev-icon"></span>
//                       </button>
//                       <button
//                         className="carousel-control-next"
//                         type="button"
//                         data-bs-target={`#carousel-${plaja.id}`}
//                         data-bs-slide="next"
//                       >
//                         <span className="carousel-control-next-icon"></span>
//                       </button>
//                     </>
//                   )}
//                 </div>

//                 <div className="card-header d-flex align-items-center bg-light">
//                   <IconBeach size={24} className="me-2 text-primary" />
//                   <h5 className="mb-0">{plaja.denumire}</h5>
//                 </div>

//                 <div className="card-body">
//                   <p><strong>Stațiune:</strong> {plaja.statiune?.denumire || "N/A"}</p>
//                   <p><strong>Rating:</strong> {rating ? `${rating} / 5` : "N/A"}</p>
//                   <p><strong>Șezlonguri totale:</strong> {nrSezlonguri ?? "N/A"}</p>
//                   <p><strong>Temperatură:</strong> {temperatura != null ? `${temperatura}°C` : "N/A"}</p>
//                   <p><strong>Vânt:</strong> {vant != null ? `${vant} km/h` : "N/A"}</p>
//                   <button
//   className="btn btn-primary w-100 mt-2"
//   onClick={() => navigate(`/plaja/${plaja.id}`)}
// >
//   Detalii plaja
// </button>

//                 </div>
//               </div>
//             </div>
//           );
//         })}
//       </div>

//       {/* Modal Bootstrap */}
//       <div className="modal fade" id="plajaModal" tabIndex="-1" aria-hidden="true">
//         <div className="modal-dialog modal-lg modal-dialog-scrollable">
//           <div className="modal-content rounded-4">
//             <div className="modal-header">
//               <h5 className="modal-title">
//                 {selectedPlaja?.denumire || "Detalii Plajă"}
//               </h5>
//               <button
//                 type="button"
//                 className="btn-close"
//                 data-bs-dismiss="modal"
//                 aria-label="Închide"
//               ></button>
//             </div>
//             <div className="modal-body">
//               {selectedPlaja?.descriere && (
//                 <p><strong>Descriere:</strong> {selectedPlaja.descriere}</p>
//               )}
//               {selectedPlaja?.detaliiWeb?.reviews && selectedPlaja.detaliiWeb.reviews.length > 0 ? (
//                 <>
//                   <h6 className="mt-3">Recenzii:</h6>
//                   {selectedPlaja.detaliiWeb.reviews.map((review, idx) => (
//                     <div key={idx} className="border-bottom pb-2 mb-2">
//                       <strong>{review.author_name}</strong> ({review.rating}★):<br />
//                       <small className="text-muted">{review.relative_time_description}</small>
//                       <p className="mt-1">{review.text}</p>
//                     </div>
//                   ))}
//                 </>
//               ) : (
//                 <p className="text-muted">Nu există recenzii disponibile.</p>
//               )}
//             </div>
//             <div className="modal-footer">
//               <button className="btn btn-success">Continuă cu rezervarea</button>
//               <button className="btn btn-secondary" data-bs-dismiss="modal">
//                 Închide
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Home;




import React, { useEffect, useState, useRef } from "react"; // Am adăugat useRef pentru modal
import { IconBeach, IconMapPin, IconStar, IconSun, IconWind, IconFilterOff, IconMoodEmpty } from "@tabler/icons-react";
import { IconHeart, IconHeartFilled } from "@tabler/icons-react";

import "@tabler/core/dist/css/tabler.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min"; // Asigură-te că Popper.js este inclus dacă nu e deja prin bundle
import ApiClient from "../api/src/ApiClient"; // Calea corectă către ApiClient
import PlajaControllerApi from "../api/src/api/PlajaControllerApi"; // Calea corectă
import { Modal as BootstrapModal } from "bootstrap"; // Import explicit și redenumire pentru a evita confuzia
import { useNavigate } from "react-router-dom";

// Stiluri CSS adiționale - pot fi mutate într-un fișier CSS separat (ex: Home.css)
const additionalStyles = `
  .card-plaja {
    transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
    border: none; // Eliminăm bordura default a cardului pentru un look mai curat cu shadow
  }

  .card-plaja:hover {
    transform: translateY(-5px);
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
  }

  .carousel-inner, .carousel-item img {
    border-top-left-radius: calc(0.375rem - 1px); // Potrivim cu border-radius-ul cardului
    border-top-right-radius: calc(0.375rem - 1px);
  }

  .filter-card {
    background-color: #f8f9fa; // Un fundal ușor diferit pentru secțiunea de filtre
    border-radius: 0.5rem;
  }

  .form-range::-webkit-slider-thumb {
    background: var(--bs-primary);
  }
  .form-range::-moz-range-thumb {
    background: var(--bs-primary);
  }
  .form-range::-ms-thumb {
    background: var(--bs-primary);
  }

  .empty-state {
    text-align: center;
    padding: 3rem 1rem;
    background-color: #f8f9fa;
    border-radius: 0.5rem;
    margin-top: 2rem;
  }
  .empty-state .icon-mood-empty {
    color: var(--bs-primary);
    margin-bottom: 1rem;
  }
`;

const apiClient = new ApiClient();
apiClient.enableCookies = true; // Asigură-te că gestionezi corect cookies dacă API-ul tău o cere
const plajaApi = new PlajaControllerApi(apiClient);

const Home = () => {
  const [plaje, setPlaje] = useState([]);
  const [error, setError] = useState(null);
  const [selectedPlaja, setSelectedPlaja] = useState(null);
  const navigate = useNavigate();
  const modalRef = useRef(null); // Ref pentru elementul modal
  const bsModalRef = useRef(null); // Ref pentru instanța modalului Bootstrap


   // NOU: Stare pentru plajele favorite, inițializată din localStorage
   const [favorites, setFavorites] = useState(() => {
    const savedFavorites = localStorage.getItem('favoritePlaje');
    return savedFavorites ? JSON.parse(savedFavorites) : []; // Stocăm ID-urile plajelor favorite
  });

  // NOU: Efect pentru a actualiza localStorage când starea `favorites` se schimbă
  useEffect(() => {
    localStorage.setItem('favoritePlaje', JSON.stringify(favorites));
  }, [favorites]);

  // ... (useEffect pentru încărcarea plajelor, funcția openModalWithPlaja, etc.)

  // NOU: Funcție pentru a adăuga/elimina o plajă din favorite
  const toggleFavorite = (plajaId, event) => {
    event.stopPropagation(); // Oprește propagarea evenimentului pentru a nu declanșa click-ul pe card
    setFavorites((prevFavorites) =>
      prevFavorites.includes(plajaId)
        ? prevFavorites.filter((id) => id !== plajaId)
        : [...prevFavorites, plajaId]
    );
  };


  const [filters, setFilters] = useState({
    statiune: "",
    rating: 0,
    sezlonguri: 0,
  });

  useEffect(() => {
    // Inițializează instanța modalului Bootstrap o singură dată
    if (modalRef.current) {
      bsModalRef.current = new BootstrapModal(modalRef.current);
    }

    plajaApi.getAllPlajeUsingGET((error, data) => {
      if (error) {
        console.error("Eroare la încărcarea plajelor:", error);
        setError("Nu s-au putut încărca plajele. Încercați din nou mai târziu.");
      } else {
        setPlaje(data || []);
      }
    });
  }, []); // Dependințe goale, rulează o singură dată la montare

  const openModalWithPlaja = (plaja) => {
    setSelectedPlaja(plaja);
    if (bsModalRef.current) {
      bsModalRef.current.show();
    }
  };
  
  const handleNavigateToDetails = (plajaId) => {
    navigate(`/plaja/${plajaId}`);
  };

  const plajeFiltrate = plaje.filter((plaja) => {
    const denumireStatiune = plaja.statiune?.denumire?.toLowerCase() || "";
    const matchStatiune =
      !filters.statiune || denumireStatiune === filters.statiune.toLowerCase();
    const matchRating =
      !filters.rating || (plaja.detaliiWeb?.rating ?? 0) >= parseFloat(filters.rating);
    const matchSezlonguri =
      !filters.sezlonguri || (plaja.numarSezlonguri ?? 0) >= parseInt(filters.sezlonguri, 10);
    return matchStatiune && matchRating && matchSezlonguri;
  });

  // Extragem lista unică de stațiuni pentru dropdown
  const statiuniUnice = [...new Set(plaje.map((p) => p.statiune?.denumire).filter(Boolean))];

  return (
    <>
      <style>{additionalStyles}</style> {/* Injectăm stilurile definite mai sus */}
      <div className="container mt-4 mb-5"> {/* Am adăugat mb-5 pentru spațiu la final */}
        <h2 className="text-center mb-4 fw-bold">
          <IconBeach size={36} className="me-2 text-primary" />
          Descoperă Plajele Noastre
        </h2>

        {/* Formulare filtrare */}
        <div className="card filter-card p-3 mb-4 shadow-sm">
          <div className="row gx-3 gy-2 align-items-end">
            <div className="col-md-4">
              <label htmlFor="statiuneFilter" className="form-label">Stațiune</label>
              <select
                id="statiuneFilter"
                className="form-select"
                value={filters.statiune}
                onChange={(e) => setFilters({ ...filters, statiune: e.target.value })}
              >
                <option value="">Toate Stațiunile</option>
                {statiuniUnice.map((nume, idx) => (
                  <option key={idx} value={nume}>
                    {nume}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-3">
              <label htmlFor="ratingFilter" className="form-label d-flex justify-content-between">
                <span>Rating minim</span>
                <span className="text-primary fw-bold">{filters.rating || "0"} ★</span>
              </label>
              <input
                id="ratingFilter"
                type="range"
                min="0"
                max="5"
                step="0.1"
                className="form-range"
                value={filters.rating}
                onChange={(e) => setFilters({ ...filters, rating: parseFloat(e.target.value) })}
              />
            </div>

            <div className="col-md-3">
              <label htmlFor="sezlonguriFilter" className="form-label d-flex justify-content-between">
                <span>Șezlonguri min.</span>
                <span className="text-primary fw-bold">{filters.sezlonguri || "0"}</span>
              </label>
              <input
                id="sezlonguriFilter"
                type="range"
                min="0"
                max={Math.max(100, ...plaje.map(p => p.numarSezlonguri || 0))} // Max dinamic
                step="5" // Step mai mare pentru plaje cu multe șezlonguri
                className="form-range"
                value={filters.sezlonguri}
                onChange={(e) => setFilters({ ...filters, sezlonguri: parseInt(e.target.value, 10) })}
              />
            </div>
            <div className="col-md-2 text-end">
              <button
                className="btn btn-outline-secondary w-100"
                onClick={() => setFilters({ statiune: "", rating: 0, sezlonguri: 0 })} // Reset la valori numerice
                title="Resetează filtrele"
              >
                <IconFilterOff size={18} className="me-1" /> Reset
              </button>
            </div>
          </div>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <div className="row gy-4"> {/* gy-4 adaugă spațiu vertical între carduri */}
          {plajeFiltrate.length > 0 ? (
            plajeFiltrate.map((plaja) => {
              const images = plaja.detaliiWeb?.images?.slice(0, 3) || [];
              const rating = plaja.detaliiWeb?.rating;
              const nrSezlonguri = plaja.numarSezlonguri;
              const temperatura = plaja.detaliiWeb?.weather?.temperature;
              const vant = plaja.detaliiWeb?.weather?.wind_speed;
              // NOU: Verifică dacă plaja curentă este favorită
              const isFavorite = favorites.includes(plaja.id);
              return (
                <div key={plaja.id} className="col-md-6 col-lg-4"> {/* Ajustat col-md pentru 2 pe rând pe mediu */}
                  <div className="card card-plaja shadow-sm h-100 rounded-4 overflow-hidden">
                    <div
                      id={`carousel-${plaja.id}`}
                      className="carousel slide"
                      data-bs-ride="carousel"
                    >
                      <div className="carousel-inner" style={{ height: "220px" }}> {/* Ușor redusă înălțimea */}
                        {images.length > 0 ? (
                          images.map((img, index) => (
                            <div
                              key={index}
                              className={`carousel-item ${index === 0 ? "active" : ""}`}
                            >
                              <img
                                src={img}
                                className="d-block w-100"
                                alt={`Imagine ${index + 1} pentru ${plaja.denumire}`}
                                style={{ height: "220px", objectFit: "cover" }}
                              />
                            </div>
                          ))
                        ) : (
                          <div className="carousel-item active">
                            <img
                              src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" // O imagine default mai generică
                              className="d-block w-100"
                              alt="Imagine plajă default"
                              style={{ height: "220px", objectFit: "cover" }}
                            />
                          </div>
                        )}
                      </div>
                      {images.length > 1 && (
                        <>
                          <button
                            className="carousel-control-prev"
                            type="button"
                            data-bs-target={`#carousel-${plaja.id}`}
                            data-bs-slide="prev"
                          >
                            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                            <span className="visually-hidden">Previous</span>
                          </button>
                          <button
                            className="carousel-control-next"
                            type="button"
                            data-bs-target={`#carousel-${plaja.id}`}
                            data-bs-slide="next"
                          >
                            <span className="carousel-control-next-icon" aria-hidden="true"></span>
                            <span className="visually-hidden">Next</span>
                          </button>
                        </>
                      )}
                    </div>

                    <div className="card-body d-flex flex-column"> {/* Flex column pentru alinierea butonului jos */}
                      {/* <h5 className="card-title mb-1">
                        <IconBeach size={20} className="me-1 text-primary" />
                        {plaja.denumire}
                      </h5> */}

                        {/* MODIFICAT: Titlul cardului cu inimioara */}
                        <div className="d-flex justify-content-between align-items-start mb-1">
                        <h5 className="card-title mb-0 me-2"> {/* Adăugat me-2 pentru spațiu */}
                          <IconBeach size={20} className="me-1 text-primary align-text-bottom" />
                          {plaja.denumire}
                        </h5>
                        <button
                          onClick={(e) => toggleFavorite(plaja.id, e)}
                          className="btn btn-link p-0 border-0" // Stil simplu, fără padding adițional
                          title={isFavorite ? "Șterge de la favorite" : "Adaugă la favorite"}
                          aria-label={isFavorite ? "Șterge de la favorite" : "Adaugă la favorite"}
                          style={{ lineHeight: 1 }} // Previne mărirea înălțimii din cauza butonului
                        >
                          {isFavorite ? (
                            <IconHeartFilled size={22} className="text-danger favorite-icon active" />
                          ) : (
                            <IconHeart size={22} className="text-secondary favorite-icon" />
                          )}
                        </button>
                      </div>
                      {/* SFÂRȘIT MODIFICARE TITLU */}
                      <p className="card-text text-muted small mb-2">
                        <IconMapPin size={16} className="me-1" />
                        {plaja.statiune?.denumire || "N/A"}
                      </p>
                      
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        {rating != null && (
                          <span className="badge bg-warning text-dark">
                            <IconStar size={14} className="me-1" /> {rating.toFixed(1)} / 5
                          </span>
                        )}
                        {nrSezlonguri != null && (
                           <span className="badge bg-info-lt">
                            <IconSun size={14} className="me-1" /> {nrSezlonguri} șezlonguri
                           </span>
                        )}
                      </div>

                      <div className="d-flex justify-content-around small text-muted mb-3">
                         {temperatura != null && (
                           <span><i className="ti ti-temperature me-1"></i>{temperatura}°C</span>
                         )}
                         {vant != null && (
                           <span><IconWind size={16} className="me-1"/>{vant} km/h</span>
                         )}
                      </div>
                      
                      {/* Butoane acțiune */}
                      <div className="mt-auto"> {/* Aliniază butoanele la baza cardului */}
                        <button
                            className="btn btn-outline-primary btn-sm w-100 mb-2"
                            onClick={() => openModalWithPlaja(plaja)}
                        >
                            Vezi detalii rapide
                        </button>
                        <button
                            className="btn btn-primary w-100"
                            onClick={() => handleNavigateToDetails(plaja.id)}
                        >
                            Mergi la pagina plajei
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
             !error && ( // Afișăm starea goală doar dacă nu e deja o eroare de încărcare
              <div className="col-12">
                <div className="empty-state">
                  <IconMoodEmpty size={64} stroke={1.5} className="icon-mood-empty" />
                  <h4>Nicio plajă nu corespunde filtrelor selectate.</h4>
                  <p className="text-muted">Încercați să ajustați criteriile de căutare.</p>
                  <button
                    className="btn btn-primary mt-2"
                    onClick={() => setFilters({ statiune: "", rating: 0, sezlonguri: 0 })}
                  >
                    Resetează toate filtrele
                  </button>
                </div>
              </div>
            )
          )}
        </div>

        {/* Modal Bootstrap - referențiat cu modalRef */}
        <div className="modal fade" id="plajaModal" tabIndex="-1" aria-labelledby="plajaModalLabel" aria-hidden="true" ref={modalRef}>
          <div className="modal-dialog modal-lg modal-dialog-scrollable">
            <div className="modal-content rounded-4 shadow-lg">
              <div className="modal-header bg-light">
                <h5 className="modal-title" id="plajaModalLabel">
                  <IconBeach className="me-2 text-primary" />
                  {selectedPlaja?.denumire || "Detalii Plajă"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Închide"
                ></button>
              </div>
              <div className="modal-body">
                {selectedPlaja?.statiune?.denumire && (
                    <p><strong>Stațiune:</strong> {selectedPlaja.statiune.denumire}</p>
                )}
                {selectedPlaja?.descriere && (
                  <p><strong>Descriere:</strong> {selectedPlaja.descriere}</p>
                )}
                 {selectedPlaja?.detaliiWeb?.rating != null && (
                    <p><strong>Rating:</strong> {selectedPlaja.detaliiWeb.rating.toFixed(1)} ★ ({selectedPlaja.detaliiWeb.user_ratings_total || 0} recenzii)</p>
                 )}
                 {selectedPlaja?.numarSezlonguri != null && (
                    <p><strong>Șezlonguri:</strong> {selectedPlaja.numarSezlonguri}</p>
                 )}
                 {selectedPlaja?.detaliiWeb?.website && (
                    <p><strong>Website:</strong> <a href={selectedPlaja.detaliiWeb.website} target="_blank" rel="noopener noreferrer">{selectedPlaja.detaliiWeb.website}</a></p>
                 )}
                 {selectedPlaja?.detaliiWeb?.phone_number && (
                    <p><strong>Telefon:</strong> {selectedPlaja.detaliiWeb.phone_number}</p>
                 )}

                {selectedPlaja?.detaliiWeb?.reviews && selectedPlaja.detaliiWeb.reviews.length > 0 ? (
                  <>
                    <h6 className="mt-4 mb-3">Recenzii Google:</h6>
                    {selectedPlaja.detaliiWeb.reviews.map((review, idx) => (
                      <div key={idx} className="border-bottom pb-2 mb-2">
                        <div className="d-flex align-items-center mb-1">
                            <img src={review.profile_photo_url} alt={review.author_name} className="rounded-circle me-2" style={{width: '32px', height: '32px'}} />
                            <strong>{review.author_name}</strong> 
                            <span className="ms-2 badge bg-warning text-dark">{review.rating}★</span>
                        </div>
                        <small className="text-muted">{review.relative_time_description}</small>
                        <p className="mt-1 mb-0 fst-italic">"{review.text}"</p>
                      </div>
                    ))}
                  </>
                ) : (
                  <p className="text-muted mt-3">Nu există recenzii Google disponibile.</p>
                )}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-success" onClick={() => navigate(`/rezervare/${selectedPlaja?.id}`)}> {/* Exemplu, ajustează ruta */}
                  Continuă cu rezervarea
                </button>
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                  Închide
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
