import React, { useState } from 'react';
import { Link } from 'react-router-dom';

/**
 * Componentă pentru afișarea listei de rezervări a utilizatorului
 * @param {Object} props 
 * @param {Array} props.rezervari - Lista de rezervări a utilizatorului
 * @param {boolean} props.loading - Indicator pentru starea de încărcare
 */
const ReservationsList = ({ rezervari, loading }) => {
  // Stare pentru rezervarea selectată pentru vedere detaliată
  const [selectedRezervare, setSelectedRezervare] = useState(null);
  
  // Stare pentru confirmarea anulării rezervării
  const [confirmCancelId, setConfirmCancelId] = useState(null);
  
  // Stare pentru statusul anulării
  const [cancelStatus, setCancelStatus] = useState({
    loading: false,
    error: null,
    success: null
  });

  /**
   * Mapare a statusului rezervării la textul și clasa badge-ului
   * @param {string} status - Statusul rezervării
   * @returns {Object} - Obiect cu textul și clasa badge-ului
   */
  const getStatusBadge = (status) => {
    switch (status) {
      case 'confirmata':
        return { text: 'Confirmată', className: 'bg-success' };
      case 'in_asteptare':
        return { text: 'În așteptare', className: 'bg-info' };
      case 'anulata':
        return { text: 'Anulată', className: 'bg-danger' };
      default:
        return { text: 'Necunoscut', className: 'bg-secondary' };
    }
  };

  /**
   * Formatează data pentru afișare
   * @param {string} dateString - Data în format ISO
   * @returns {string} - Data formatată pentru afișare
   */
  const formatDate = (dateString) => {
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('ro-RO', options);
  };

  /**
   * Handler pentru cererea de anulare a rezervării
   * @param {string} rezervareId - ID-ul rezervării
   */
  const handleCancelRequest = (rezervareId) => {
    setConfirmCancelId(rezervareId);
  };

  /**
   * Handler pentru confirmarea anulării rezervării
   */
  const handleConfirmCancel = async () => {
    if (!confirmCancelId) return;
    
    setCancelStatus({ loading: true, error: null, success: null });
    
    try {
      // În implementarea reală, aici ar trebui să apelăm un API pentru a anula rezervarea
      // Pentru demonstrație, simulăm un răspuns de succes după un scurt delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulăm succes
      setCancelStatus({ 
        loading: false, 
        error: null, 
        success: `Rezervarea #${confirmCancelId} a fost anulată cu succes` 
      });
      
      // Resetăm confirmCancelId
      setConfirmCancelId(null);
    } catch (error) {
      console.error('Eroare la anularea rezervării:', error);
      setCancelStatus({ 
        loading: false, 
        error: 'A apărut o eroare la anularea rezervării. Încercați din nou.', 
        success: null 
      });
    }
  };

  /**
   * Handler pentru anularea acțiunii de confirmare
   */
  const handleCancelConfirmation = () => {
    setConfirmCancelId(null);
    setCancelStatus({ loading: false, error: null, success: null });
  };

  /**
   * Handler pentru deschiderea detaliilor rezervării
   * @param {Object} rezervare - Rezervarea pentru care se afișează detaliile
   */
  const handleViewDetails = (rezervare) => {
    setSelectedRezervare(rezervare);
  };

  /**
   * Handler pentru închiderea detaliilor rezervării
   */
  const handleCloseDetails = () => {
    setSelectedRezervare(null);
  };

  return (
    <div className="card shadow-sm rounded-4">
      <div className="card-body">
        <h4 className="card-title border-bottom pb-3 mb-4">Rezervările mele</h4>
        
        {cancelStatus.success && (
          <div className="alert alert-success mb-4">
            <i className="ti ti-check me-2"></i>
            {cancelStatus.success}
          </div>
        )}
        
        {cancelStatus.error && (
          <div className="alert alert-danger mb-4">
            <i className="ti ti-alert-circle me-2"></i>
            {cancelStatus.error}
          </div>
        )}
        
        {loading ? (
          <div className="text-center py-4">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Se încarcă...</span>
            </div>
            <p className="mt-2 text-muted">Se încarcă rezervările...</p>
          </div>
        ) : rezervari.length === 0 ? (
          <div className="alert alert-info">
            <i className="ti ti-info-circle me-2"></i>
            Nu ai nicio rezervare activă.
            <Link to="/" className="btn btn-sm btn-primary ms-3">
              Descoperă plajele
            </Link>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th scope="col">ID Rezervare</th>
                  <th scope="col">Plajă</th>
                  <th scope="col">Data</th>
                  <th scope="col">Șezlonguri</th>
                  <th scope="col">Total</th>
                  <th scope="col">Status</th>
                  <th scope="col">Acțiuni</th>
                </tr>
              </thead>
              <tbody>
                {rezervari.map((rezervare) => {
                  const statusBadge = getStatusBadge(rezervare.status);
                  
                  return (
                    <tr key={rezervare.id}>
                      <td>{rezervare.id}</td>
                      <td>{rezervare.plajaDenumire}</td>
                      <td>{formatDate(rezervare.data)}</td>
                      <td>{rezervare.nrSezlonguri}</td>
                      <td>{rezervare.pret.total} RON</td>
                      <td>
                        <span className={`badge ${statusBadge.className}`}>
                          {statusBadge.text}
                        </span>
                      </td>
                      <td>
                        <button 
                          className="btn btn-sm btn-outline-primary me-1" 
                          title="Vezi detalii"
                          onClick={() => handleViewDetails(rezervare)}
                        >
                          <i className="ti ti-eye"></i>
                        </button>
                        {rezervare.status !== 'anulata' && (
                          <button 
                            className="btn btn-sm btn-outline-danger" 
                            title="Anulează"
                            onClick={() => handleCancelRequest(rezervare.id)}
                          >
                            <i className="ti ti-x"></i>
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        
        {/* Modal pentru detaliile rezervării */}
        {selectedRezervare && (
          <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Detalii Rezervare #{selectedRezervare.id}</h5>
                  <button type="button" className="btn-close" onClick={handleCloseDetails}></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <h6 className="fw-bold">{selectedRezervare.plajaDenumire}</h6>
                    <p className="text-muted">{selectedRezervare.statiune}, Constanța</p>
                  </div>
                  
                  <div className="row mb-2">
                    <div className="col-6 text-muted">Data:</div>
                    <div className="col-6">{formatDate(selectedRezervare.data)}</div>
                  </div>
                  
                  <div className="row mb-2">
                    <div className="col-6 text-muted">Șezlonguri:</div>
                    <div className="col-6">{selectedRezervare.nrSezlonguri}</div>
                  </div>
                  
                  <div className="row mb-2">
                    <div className="col-6 text-muted">Umbrele:</div>
                    <div className="col-6">{selectedRezervare.nrUmbrele}</div>
                  </div>
                  
                  <div className="row mb-2">
                    <div className="col-6 text-muted">Poziție:</div>
                    <div className="col-6">
                      {selectedRezervare.pozitie === 'fata' ? 'Primul rând (lângă mare)' : 
                       selectedRezervare.pozitie === 'mijloc' ? 'Rândurile din mijloc' : 
                       'Rândurile din spate'}
                    </div>
                  </div>
                  
                  <div className="row mb-2">
                    <div className="col-6 text-muted">Status:</div>
                    <div className="col-6">
                      <span className={`badge ${getStatusBadge(selectedRezervare.status).className}`}>
                        {getStatusBadge(selectedRezervare.status).text}
                      </span>
                    </div>
                  </div>
                  
                  <div className="row mb-2">
                    <div className="col-6 text-muted">Total:</div>
                    <div className="col-6 fw-bold">{selectedRezervare.pret.total} RON</div>
                  </div>
                  
                  {selectedRezervare.observatii && (
                    <div className="mt-3">
                      <h6 className="text-muted">Observații:</h6>
                      <p>{selectedRezervare.observatii}</p>
                    </div>
                  )}
                </div>
                <div className="modal-footer">
                  <Link to={`/plaja/${selectedRezervare.plajaId}`} className="btn btn-outline-primary">
                    Vezi plaja
                  </Link>
                  {selectedRezervare.status !== 'anulata' && (
                    <button 
                      className="btn btn-outline-danger"
                      onClick={() => handleCancelRequest(selectedRezervare.id)}
                    >
                      Anulează rezervarea
                    </button>
                  )}
                  <button type="button" className="btn btn-secondary" onClick={handleCloseDetails}>
                    Închide
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Modal pentru confirmarea anulării */}
        {confirmCancelId && (
          <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Confirmați anularea?</h5>
                  <button type="button" className="btn-close" onClick={handleCancelConfirmation}></button>
                </div>
                <div className="modal-body">
                  <p>Sunteți sigur că doriți să anulați rezervarea #{confirmCancelId}?</p>
                  <p className="text-muted small">
                    <i className="ti ti-info-circle me-1"></i>
                    Anularea se poate face gratuit cu cel puțin 24 de ore înainte de data rezervării. 
                    În caz contrar, se va reține o taxă de anulare de 50% din valoarea rezervării.
                  </p>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={handleCancelConfirmation}>
                    Nu, păstrează rezervarea
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-danger"
                    onClick={handleConfirmCancel}
                    disabled={cancelStatus.loading}
                  >
                    {cancelStatus.loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Se anulează...
                      </>
                    ) : 'Da, anulează rezervarea'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReservationsList;