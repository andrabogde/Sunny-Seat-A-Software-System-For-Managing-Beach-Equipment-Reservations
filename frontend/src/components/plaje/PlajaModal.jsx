import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IconBeach } from '@tabler/icons-react';
import { Modal as BootstrapModal } from 'bootstrap';

/**
 * Modal pentru afișarea detaliilor rapide despre o plajă
 * @param {Object} props 
 * @param {Object} props.selectedPlaja - Obiectul plajei selectate pentru vizualizare
 * @param {Function} props.onClose - Funcție apelată la închiderea modalului
 */
const PlajaModal = ({ selectedPlaja, onClose }) => {
  const navigate = useNavigate();
  const modalRef = useRef(null);
  const bsModalRef = useRef(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Inițializăm modalul Bootstrap când componenta este montată
  useEffect(() => {
    if (modalRef.current && !bsModalRef.current) {
      bsModalRef.current = new BootstrapModal(modalRef.current, {
        backdrop: 'static',
        keyboard: false
      });

      // Adăugăm event listener pentru când modalul este ascuns
      const handleHidden = () => {
        if (onClose) onClose();
      };
      
      modalRef.current.addEventListener('hidden.bs.modal', handleHidden);
      setIsInitialized(true);

      return () => {
        // Curățăm modalul doar când componenta este demontată complet
        if (modalRef.current) {
          modalRef.current.removeEventListener('hidden.bs.modal', handleHidden);
        }
        
        if (bsModalRef.current) {
          try {
            // Încercăm să ascundem modalul înainte de a-l distruge
            bsModalRef.current.hide();
            // Folosim setTimeout pentru a ne asigura că tranziția s-a terminat
            setTimeout(() => {
              if (bsModalRef.current) {
                bsModalRef.current.dispose();
                bsModalRef.current = null;
              }
            }, 300); // 300ms este timpul standard de tranziție Bootstrap
          } catch (e) {
            console.log('Cleanup error:', e);
            // Setăm referința la null în caz de eroare
            bsModalRef.current = null;
          }
        }
      };
    }
  }, [onClose]);

  // Arătăm sau ascundem modalul în funcție de prop-ul selectedPlaja
  useEffect(() => {
    if (isInitialized) {
      if (selectedPlaja && bsModalRef.current) {
        try {
          bsModalRef.current.show();
        } catch (e) {
          console.error('Error showing modal:', e);
        }
      } else if (bsModalRef.current) {
        try {
          bsModalRef.current.hide();
        } catch (e) {
          console.error('Error hiding modal:', e);
        }
      }
    }
  }, [selectedPlaja, isInitialized]);

  // Navigare către pagina de rezervare
  const handleNavigateToReservation = () => {
    if (bsModalRef.current) {
      try {
        bsModalRef.current.hide();
      } catch (e) {
        console.error('Error hiding modal during navigation:', e);
      }
    }
    navigate(`/rezervare/${selectedPlaja?.id}`);
  };

  // Dacă nu există o plajă selectată, nu renderăm modalul
  if (!selectedPlaja) {
    return null;
  }

  return (
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
            {selectedPlaja ? (
              <>
                {selectedPlaja.statiune?.denumire && (
                  <p><strong>Stațiune:</strong> {selectedPlaja.statiune.denumire}</p>
                )}
                {selectedPlaja.descriere && (
                  <p><strong>Descriere:</strong> {selectedPlaja.descriere}</p>
                )}
                {selectedPlaja.detaliiWeb?.rating != null && (
                  <p><strong>Rating:</strong> {selectedPlaja.detaliiWeb.rating.toFixed(1)} ★ ({selectedPlaja.detaliiWeb.user_ratings_total || 0} recenzii)</p>
                )}
                {selectedPlaja.numarSezlonguri != null && (
                  <p><strong>Șezlonguri:</strong> {selectedPlaja.numarSezlonguri}</p>
                )}
                {selectedPlaja.detaliiWeb?.website && (
                  <p><strong>Website:</strong> <a href={selectedPlaja.detaliiWeb.website} target="_blank" rel="noopener noreferrer">{selectedPlaja.detaliiWeb.website}</a></p>
                )}
                {selectedPlaja.detaliiWeb?.phone_number && (
                  <p><strong>Telefon:</strong> {selectedPlaja.detaliiWeb.phone_number}</p>
                )}

                {selectedPlaja.detaliiWeb?.reviews && selectedPlaja.detaliiWeb.reviews.length > 0 ? (
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
              </>
            ) : (
              <p>Se încarcă detaliile plajei...</p>
            )}
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-success" onClick={handleNavigateToReservation}>
              Continuă cu rezervarea
            </button>
            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
              Închide
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlajaModal;