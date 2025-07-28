import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  IconTicket,
  IconCalendarEvent,
  IconMapPin,
  IconBeach,
  IconSun,
  IconEdit,
  IconTrash,
  IconAlertTriangle,
  IconCheck,
  IconInfoCircle,
  IconSearch,
  IconCash,
  IconArmchair2,
  IconUmbrella,
  IconSofa
} from '@tabler/icons-react';
import { AuthContext } from '../contexts/AuthContext';
import apiService from '../services/ApiService';

/**
 * 🆕 COMPONENTA ACTUALIZATĂ - Integrat cu API-ul real /api/rezervari/user
 */
const RezervarileMele = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [rezervari, setRezervari] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedRezervare, setSelectedRezervare] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [filtruStare, setFiltruStare] = useState('toate');
  const [cautareTerm, setCautareTerm] = useState('');

  // Adaugă state pentru gestionarea collapse-ului
  const [expandedReservations, setExpandedReservations] = useState(new Set());
  const BASE_URL = 'http://localhost:8080';

  // Funcție pentru toggle
  const toggleReservationDetails = (rezervareId) => {
    const newExpanded = new Set(expandedReservations);
    if (newExpanded.has(rezervareId)) {
      newExpanded.delete(rezervareId);
    } else {
      newExpanded.add(rezervareId);
    }
    setExpandedReservations(newExpanded);
  };

  // Helper pentru obținerea token-ului de autentificare
  const getAuthToken = () => {
    return localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
  };

  // Helper pentru fetch cu autentificare
  const fetchWithAuth = async (url, options = {}) => {
    const token = getAuthToken();

    return fetch(`${BASE_URL}${url}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers
      }
    });
  };

  const extragePozitie = (denumire) => {
    const [_, linie, coloana] = denumire.split('-');
    return [`R${linie}C${coloana}`,`Randul: ${linie}, Coloana: ${coloana}`];
  }

  // 🆕 FUNCȚIE pentru maparea datelor din API la formatul UI
  const mapApiDataToUI = (apiRezervare) => {
    const liniiDetalii = apiRezervare.liniiDetalii || [];
    const totalCantitate = apiRezervare.cantitate || 0;
    const totalCalculat = apiRezervare.pretCalculat || apiRezervare.sumaPlatita || 0;
    const tipuriEchipament = apiRezervare.tipuriEchipament || [];
    const tipEchipamentPrincipal = tipuriEchipament.length > 0 ? tipuriEchipament[0] : 'Nespecificat';
    const stareRezervare = apiRezervare.stareRezervare || 'Necunoscuta';

    let pretBucata = 0;
    if (liniiDetalii.length > 0 && totalCantitate > 0) {
      pretBucata = Math.round(totalCalculat / totalCantitate);
    }
    let dataInceput = apiRezervare.dataInceput;
    let dataSfarsit = apiRezervare.dataSfarsit;
    // if (liniiDetalii.length > 0) {
    //   // Găsește prima și ultima dată din linii
    //   const dateLinii = liniiDetalii.flatMap(linie => [linie.dataInceput, linie.dataSfarsit]).filter(Boolean);
    //   if (dateLinii.length > 0) {
    //     dataInceput = dateLinii.sort()[0];
    //     dataSfarsit = dateLinii.sort().reverse()[0];
    //   }
    // }

    return {

      id: apiRezervare.id,
      codRezervare: apiRezervare.codRezervare,
      numePlaja: apiRezervare.numePlaja || 'Plajă necunoscută',
      pozitiaSezlong: apiRezervare.pozitiaSezlong || '',
      sumaPlatita: apiRezervare.sumaPlatita || 0,
      stareRezervare: stareRezervare,
      dataRezervare: apiRezervare.dataInceput,
      createdAt: apiRezervare.createdAt,
      imageUrl: apiRezervare.imageUrl,
      // Date calculate
      cantitate: totalCantitate,
      dataInceput: dataInceput,
      dataSfarsit: dataSfarsit,
      pretBucata: pretBucata,
      pretCalculat: totalCalculat,
      tipEchipament: tipEchipamentPrincipal,

      // Linii detaliate mapate
      liniiDetalii: liniiDetalii.map(linie => ({
        id: linie.id,
        cantitate: linie.cantitate || 1,
        dataInceput: linie.dataInceput,
        dataSfarsit: linie.dataSfarsit,
        pretBucata: linie.pretBucata || 0,
        pretCalculat: linie.pretCalculat || 0,
        tipEchipament: linie.tipEchipament || 'Nespecificat',
        echipament: linie.echipamentNume || linie.echipament?.denumire || `Echipament ${linie.id}`,
        pozitie: extragePozitie(linie.echipament)[0],
        pozitieDetalii: extragePozitie(linie.echipament)[1]
      })),

      // Date originale pentru referință
      _originalData: apiRezervare
    };
  };

  // 🆕 ÎNCĂRCARE rezervări din API-ul real cu debugging îmbunătățit
  useEffect(() => {
    const loadRezervari = async () => {
      if (!user?.id) {
        setError("Utilizator invalid. Te rugăm să te autentifici din nou.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        console.log("🔍 Încărcare rezervări pentru utilizatorul:", user?.email);
        console.log("🔍 URL complet:", window.location.origin + '/api/rezervari/user');

        const response = await apiService.getAllRezervariByUser();


        console.log("📋 Rezervări din API:", response);
        // Mapează datele din API la formatul UI
        const rezervariMapped = response.map(mapApiDataToUI);


        console.log("📋 Rezervări mapate pentru UI:", rezervariMapped);
        setRezervari(rezervariMapped);

      } catch (err) {
        console.error("❌ Eroare la încărcarea rezervărilor:", err);

        // 🔧 VERIFICA TIPUL DE EROARE cu detalii
        if (err.message.includes('Unexpected token') || err.message.includes('<!doctype')) {
          setError("Backend-ul returnează HTML în loc de JSON. Verificați că endpoint-ul /api/rezervari/user există și funcționează.");
        } else if (err.message.includes('NetworkError') || err.message.includes('Failed to fetch')) {
          setError("Nu se poate conecta la backend. Verificați că serverul rulează pe http://localhost:8080");
        } else {
          setError(`Eroare la încărcarea rezervărilor: ${err.message}`);
        }

        // 🔧 Fallback cu date de test pentru a continua dezvoltarea
        console.log("🔧 Folosesc date de fallback pentru dezvoltare");
        setRezervari([
          {
            id: 999,
            codRezervare: "FALLBACK001",
            numePlaja: "Plajă Test (Fallback)",
            pozitiaSezlong: "R1C1-SEZLONG",
            sumaPlatita: 150.0,
            stareRezervare: "CONFIRMATA",
            dataRezervare: "2025-06-25",
            createdAt: new Date().toISOString(),
            cantitate: 2,
            dataInceput: "2025-06-25",
            dataSfarsit: "2025-06-27",
            pretBucata: 25,
            pretCalculat: 150.0,
            tipEchipament: "Șezlong",
            liniiDetalii: [
              {
                id: 1,
                cantitate: 1,
                dataInceput: "2025-06-25",
                dataSfarsit: "2025-06-27",
                pretBucata: 25,
                pretCalculat: 75,
                tipEchipament: "Șezlong",
                echipament: "Șezlong R1C1",
                pozitie: "R1C1"
              },
              {
                id: 2,
                cantitate: 1,
                dataInceput: "2025-06-25",
                dataSfarsit: "2025-06-27",
                pretBucata: 25,
                pretCalculat: 75,
                tipEchipament: "Șezlong",
                echipament: "Șezlong R1C2",
                pozitie: "R1C2"
              }
            ]
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadRezervari();
  }, [user?.id]);

  // 🆕 MAPAREA stării rezervării în format user-friendly
  const getStareDisplay = (stare) => {
    switch (stare?.toUpperCase()) {
      case 'CONFIRMATA':
        return { text: 'Confirmată', class: 'bg-success' };
      case 'PENDING':
        return { text: 'În așteptare', class: 'bg-warning' };
      case 'ANULATA':
        return { text: 'Anulată', class: 'bg-danger' };
      case 'FINALIZATA':
        return { text: 'Finalizată', class: 'bg-info' };
      default:
        return { text: 'Necunoscută', class: 'bg-secondary' };
    }
  };

  // Funcție pentru formatarea datei într-un format citibil
  const formatDate = (dateString) => {
    try {
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString('ro-RO', options);
    } catch (err) {
      return dateString;
    }
  };

  // Verifică dacă rezervarea este în viitor și poate fi anulată
  const isRezervareActive = (dataRezervare) => {
    try {
      return new Date(dataRezervare) > new Date();
    } catch (err) {
      return false;
    }
  };

  // 🆕 Afișează iconița pentru tipul de echipament
  const getTipEchipamentIcon = (tipEchipament) => {
    if (!tipEchipament) return null;
    console.log(tipEchipament);
    const tip = tipEchipament.toLowerCase();
    if (tip.includes('sezlong') || tip.includes('scaun')) {
      return <IconArmchair2 size={16} className="me-1 text-primary" />;
    } else if (tip.includes('umbrela') || tip.includes('parasol')) {
      return <IconUmbrella size={16} className="me-1 text-info" />;
    } else if (tip.includes('baldachin') || tip.includes('cort')) {
      return <IconSofa size={16} className="me-1 text-purple-600" />;
    }
    return <IconSun size={16} className="me-1 text-warning" />;
  };

  // Handler pentru deschiderea modalului de anulare
  const handleOpenCancelModal = (rezervare, e) => {
    e.stopPropagation();
    setSelectedRezervare(rezervare);
    setShowCancelModal(true);
  };

  // 🆕 Handler pentru anularea rezervării prin API
  const handleCancelRezervare = async () => {
    if (!selectedRezervare) return;

    setIsSubmitting(true);

    try {
      const response = await fetchWithAuth(`/api/rezervari/${selectedRezervare.id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error(`Eroare la anularea rezervării: ${response.status}`);
      }

      // Actualizează starea locală
      setRezervari(prev => prev.map(r =>
        r.id === selectedRezervare.id
          ? { ...r, stareRezervare: 'ANULATA' }
          : r
      ));

      setSuccessMessage("Rezervarea a fost anulată cu succes!");
      setShowCancelModal(false);
      setSelectedRezervare(null);

      // Ascundem mesajul de succes după 3 secunde
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);

    } catch (err) {
      console.error("❌ Eroare la anularea rezervării:", err);
      setError("Nu s-a putut anula rezervarea. Încercați din nou mai târziu.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handler pentru navigarea la pagina de modificare a rezervării
  const handleEditRezervare = (rezervareId, e) => {
    e.stopPropagation();
    navigate(`/rezervari/edit/${rezervareId}`);
  };

  // Handler pentru vizualizarea detaliilor rezervării
  const handleViewRezervare = (rezervareId) => {
    navigate(`/rezervari/view/${rezervareId}`);
  };

  // 🆕 Filtrare rezervări după stare
  const filterRezervariByStare = () => {
    if (filtruStare === 'active') {
      return rezervari.filter(rezervare => {
        const isActive = isRezervareActive(rezervare.dataRezervare);
        const isConfirmed = rezervare.stareRezervare === 'CONFIRMATA';
        return isActive && isConfirmed;
      });
    } else if (filtruStare === 'trecute') {
      return rezervari.filter(rezervare => !isRezervareActive(rezervare.dataRezervare));
    } else if (filtruStare === 'anulate') {
      return rezervari.filter(rezervare => rezervare.stareRezervare === 'ANULATA');
    } else if (filtruStare === 'pending') {
      return rezervari.filter(rezervare => rezervare.stareRezervare === 'PENDING');
    }

    return rezervari;
  };

  // Filtrare rezervări după căutare
  const filteredRezervari = filterRezervariByStare().filter(rezervare => {
    if (!cautareTerm) return true;

    const searchTerm = cautareTerm.toLowerCase();

    return (rezervare.codRezervare && rezervare.codRezervare.toLowerCase().includes(searchTerm)) ||
      (rezervare.numePlaja && rezervare.numePlaja.toLowerCase().includes(searchTerm)) ||
      (rezervare.tipEchipament && rezervare.tipEchipament.toLowerCase().includes(searchTerm)) ||
      (rezervare.pozitiaSezlong && rezervare.pozitiaSezlong.toLowerCase().includes(searchTerm)) ||
      formatDate(rezervare.dataRezervare).toLowerCase().includes(searchTerm);
  });

  // Mesaj pentru cazul când nu sunt rezervări
  const renderEmptyState = () => (
    <div className="text-center py-5">
      <div className="mb-4">
        <IconTicket size={64} className="text-muted" />
      </div>
      <h4 className="text-muted mb-3">Nu ai nicio rezervare</h4>
      <p className="text-muted mb-4">
        Nu ai făcut încă nicio rezervare de plajă. Explorează plajele disponibile și fă prima ta rezervare!
      </p>
      <button
        className="btn btn-primary rounded-pill px-4"
        onClick={() => navigate('/plaje')}
      >
        <IconBeach size={20} className="me-2" />
        Explorează plajele
      </button>
    </div>
  );

  const calculeazaZile = (start, end) => {
    return Math.ceil((new Date(end) - new Date(start)) / (1000 * 60 * 60 * 24)) + 1;
  }
  return (
    <div className="container my-5">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div className="d-flex align-items-center">
          <IconTicket size={36} className="me-2 text-primary" />
          <h2 className="mb-0">Rezervările mele</h2>
        </div>
        <button
          className="btn btn-outline-primary rounded-pill"
          onClick={() => navigate('/plaje')}
        >
          <IconBeach size={20} className="me-2" />
          Rezervare nouă
        </button>
      </div>

      {/* 🆕 Filtre și căutare ACTUALIZATE */}
      <div className="card mb-4 shadow-sm rounded-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-6">
              <label htmlFor="filtruStare" className="form-label fw-semibold">Filtrare după stare</label>
              <select
                id="filtruStare"
                className="form-select rounded-pill"
                value={filtruStare}
                onChange={(e) => setFiltruStare(e.target.value)}
              >
                <option value="toate">Toate rezervările</option>
                <option value="active">Rezervări active</option>
                <option value="pending">În așteptare</option>
                <option value="trecute">Rezervări trecute</option>
                <option value="anulate">Rezervări anulate</option>
              </select>
            </div>
            <div className="col-md-6">
              <label htmlFor="cautare" className="form-label fw-semibold">Căutare</label>
              <div className="input-group">
                <span className="input-group-text rounded-start-pill">
                  <IconSearch size={18} />
                </span>
                <input
                  type="text"
                  id="cautare"
                  className="form-control rounded-end-pill"
                  placeholder="Caută după cod rezervare, plajă, poziție..."
                  value={cautareTerm}
                  onChange={(e) => setCautareTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mesaj de succes */}
      {successMessage && (
        <div className="alert alert-success d-flex align-items-center mb-4 rounded-4">
          <IconCheck size={24} className="me-2" />
          {successMessage}
        </div>
      )}

      {/* Afișare loading */}
      {loading && (
        <div className="d-flex justify-content-center my-5">
          <div className="text-center">
            <div className="spinner-border text-primary mb-3" role="status">
              <span className="visually-hidden">Se încarcă...</span>
            </div>
            <p className="text-muted">Se încarcă rezervările...</p>
          </div>
        </div>
      )}

      {/* Afișare eroare */}
      {error && (
        <div className="alert alert-danger rounded-4">
          <div className="d-flex align-items-center">
            <IconAlertTriangle size={24} className="me-2" />
            <div>
              <strong>Eroare</strong>
              <div>{error}</div>
            </div>
          </div>
        </div>
      )}

      {/* Mesaj când nu sunt rezervări */}
      {!loading && !error && rezervari.length === 0 && renderEmptyState()}

      {/* Nicio rezervare găsită după filtrare */}
      {!loading && !error && rezervari.length > 0 && filteredRezervari.length === 0 && (
        <div className="alert alert-warning rounded-4">
          <div className="d-flex align-items-center">
            <IconInfoCircle size={24} className="me-2" />
            <div>
              Nu a fost găsită nicio rezervare care să corespundă criteriilor de filtrare.
            </div>
          </div>
        </div>
      )}

      {/* 🆕 Listă rezervări cu datele din API */}
      {!loading && !error && filteredRezervari.length > 0 && (
        <div className="row">
          {filteredRezervari.map(rezervare => {
            const isActive = isRezervareActive(rezervare.dataRezervare);
            const stareDisplay = getStareDisplay(rezervare.stareRezervare);

            return (
              <div key={rezervare.id} className="col-md-6 col-lg-4 mb-4">
                <div
                  className={`card h-100 rounded-4 overflow-hidden cursor-pointer transition-all`}
                  onClick={() => handleViewRezervare(rezervare.id)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="position-relative">
                    <img
                      src={`${rezervare.imageUrl || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"}`}
                      className="card-img-top"
                      alt="Plajă"
                      style={{ height: '180px', objectFit: 'cover' }}
                    />
                    <div className={`position-absolute top-0 end-0 m-2 badge ${stareDisplay.class} rounded-pill`}>
                      {stareDisplay.text}
                    </div>
                    {rezervare.codRezervare && (
                      <div className="position-absolute top-0 start-0 m-2 badge bg-dark rounded-pill">
                        #{rezervare.codRezervare}
                      </div>
                    )}
                  </div>

                  <div className="card-body">
                    <h5 className="card-title mb-1">
                      <IconBeach size={20} className="me-1 text-primary" />
                      {rezervare.numePlaja}
                    </h5>

                    {/* DATA ȘI PERIOADA */}
                    <div className="mb-2">
                      <IconCalendarEvent size={16} className="me-1 text-success" />
                      <span className="fw-medium">{formatDate(rezervare.dataRezervare)}</span>
                      {rezervare.dataInceput && rezervare.dataSfarsit && rezervare.dataInceput !== rezervare.dataSfarsit && (
                        <div className="text-muted small">
                          până la {formatDate(rezervare.dataSfarsit)}
                        </div>
                      )}
                    </div>


                    {/* DETALII ECHIPAMENTE */}
                    {/* {rezervare.cantitate > 0 && (
                      <div className="mb-2">
                        {getTipEchipamentIcon(rezervare.tipEchipament)}
                        <span className="fw-medium">
                          {rezervare.cantitate} × {rezervare.tipEchipament}
                        </span>
                        {rezervare.pretBucata > 0 && (
                          <div className="text-muted small">
                            {rezervare.pretBucata} RON/zi per bucată
                          </div>
                        )}
                      </div>
                    )} */}

                    {/* PREȚ TOTAL */}
                    <div className="mb-3">
                      <IconCash size={16} className="me-1 text-warning" />
                      <span className="fw-bold text-primary fs-5"> Total de plata {calculeazaZile(rezervare.dataInceput, rezervare.dataSfarsit) * rezervare.pretCalculat} RON
                      </span>
                      {rezervare.sumaPlatita && rezervare.sumaPlatita !== rezervare.pretCalculat && (
                        <div className="text-muted small">
                          Plătit: {rezervare.sumaPlatita} RON
                        </div>
                      )}
                    </div>

                    {/* LINII DETALIATE */}
                    {rezervare.liniiDetalii && rezervare.liniiDetalii.length > 0 && (
                      <div className="mb-3">
                        <div
                          className="text-muted cursor-pointer small d-flex align-items-center"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleReservationDetails(rezervare.id);
                          }}
                          style={{ cursor: 'pointer' }}
                        >
                          <span className="me-2">
                            {expandedReservations.has(rezervare.id) ? '▼' : '▶'}
                          </span>
                          Vezi detalii echipamente ({rezervare.liniiDetalii.length})
                        </div>

                        {expandedReservations.has(rezervare.id) && (
                          <div className="mt-2 border-start border-2 border-light ps-3"     onClick={(e) => e.stopPropagation()} // Oprește propagarea pentru tot containerul
                          >
                            {rezervare.liniiDetalii.map((linie, index) => (
                              <div key={linie.id || index} className="d-flex justify-content-between text-muted small mb-1">
                                <span>
                                  {getTipEchipamentIcon(linie.tipEchipament)}
                                  {linie.cantitate} × {linie.tipEchipament}
                                  {linie.pozitie && (
                                    <span
                                      className="text-info"
                                      data-bs-toggle="tooltip"
                                      data-bs-placement="top"
                                      title={`${linie.pozitieDetalii}`}
                                    >
                                      ({linie.pozitie})
                                    </span>
                                  )}
                                </span>
                                <span className="fw-medium">{linie.pretCalculat} RON</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}


                    {/* BUTOANE ACȚIUNI */}
                    {isActive && rezervare.stareRezervare === 'CONFIRMATA' && (
                      <div className="d-flex gap-2 justify-content-between">
                        <button
                          className="btn btn-outline-danger w-100 rounded-pill"
                          onClick={(e) => handleOpenCancelModal(rezervare, e)}
                        >
                          <IconTrash size={18} className="me-1" />
                          Anulează
                        </button>
                      </div>
                    )}
                    {/* BUTOANE ACȚIUNI */}
                    {/* <div className="d-flex gap-2 justify-content-between">
  {isActive && rezervare.stareRezervare === 'CONFIRMATA' ? (
    <button 
      className="btn btn-outline-danger w-100 rounded-pill"
      onClick={(e) => handleOpenCancelModal(rezervare, e)}
    >
      <IconTrash size={18} className="me-1" />
      Anulează
    </button>
  ) : (
    <button 
      className="btn btn-primary w-100 rounded-pill"
      onClick={(e) => {
        e.stopPropagation();
        handleViewRezervare(rezervare.id);
      }}
    >
      <IconInfoCircle size={18} className="me-1" />
      Vezi detalii
    </button>
  )}
</div> */}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal confirmare anulare */}
      {showCancelModal && selectedRezervare && (
        <div className="modal fade show"
          style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}
          tabIndex="-1"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-4 shadow">
              <div className="modal-header border-0">
                <h5 className="modal-title">Confirmare anulare rezervare</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowCancelModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="d-flex align-items-center mb-3">
                  <IconAlertTriangle size={24} className="me-2 text-warning" />
                  <p className="mb-0">Ești sigur că dorești să anulezi această rezervare?</p>
                </div>
                <div className="alert alert-light rounded-3">
                  <p className="mb-1">
                    <strong>Cod:</strong> {selectedRezervare.codRezervare}
                  </p>
                  <p className="mb-1">
                    <strong>Plajă:</strong> {selectedRezervare.numePlaja}
                  </p>
                  <p className="mb-1">
                    <strong>Data:</strong> {formatDate(selectedRezervare.dataRezervare)}
                  </p>
                  <p className="mb-1">
                    <strong>Poziție:</strong> {selectedRezervare.pozitiaSezlong}
                  </p>
                  <p className="mb-0">
                    <strong>Total:</strong> {selectedRezervare.pretCalculat || selectedRezervare.sumaPlatita} RON
                  </p>
                </div>
                <p className="text-danger mb-0">
                  <small>* Anularea rezervării este definitivă și nu poate fi revocată.</small>
                </p>
              </div>
              <div className="modal-footer border-0">
                <button
                  type="button"
                  className="btn btn-outline-secondary rounded-pill"
                  onClick={() => setShowCancelModal(false)}
                  disabled={isSubmitting}
                >
                  Renunță
                </button>
                <button
                  type="button"
                  className="btn btn-danger rounded-pill"
                  onClick={handleCancelRezervare}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Se procesează...
                    </>
                  ) : (
                    <>
                      <IconTrash size={18} className="me-1" />
                      Anulează rezervarea
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .cursor-pointer {
          cursor: pointer;
        }
        
        .transition-all {
          transition: all 0.3s ease;
        }
        
        .card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 24px rgba(0,0,0,0.15);
        }
        
        .text-purple-600 {
          color: #9333ea;
        }

        details summary {
          cursor: pointer;
          user-select: none;
        }

        details summary::-webkit-details-marker {
          display: none;
        }

        details summary::before {
          content: '▶';
          margin-right: 0.5rem;
          transition: transform 0.2s;
        }

        details[open] summary::before {
          transform: rotate(90deg);
        }
      `}</style>
    </div>
  );
};

export default RezervarileMele;