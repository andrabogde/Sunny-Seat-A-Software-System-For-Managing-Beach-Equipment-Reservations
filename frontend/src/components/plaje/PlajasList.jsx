import React from 'react';
import PlajaCard from './PlajaCard';

/**
 * PlajesList SIMPLU care funcționează 100%
 * Fără logică complicată, doar afișează plajele
 */
const PlajesList = ({ plaje, loading, error }) => {
  // Loading state
  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary mb-3" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <h5 className="text-muted">Se încarcă plajele...</h5>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="alert alert-danger d-flex align-items-center" role="alert">
        <span className="me-2">⚠️</span>
        <div>
          <h6 className="alert-heading mb-1">Eroare la încărcarea plajelor</h6>
          <small>{error}</small>
        </div>
      </div>
    );
  }

  // Empty state
  if (!plaje || plaje.length === 0) {
    return (
      <div className="text-center py-5">
        <div style={{ fontSize: '4rem' }} className="text-muted mb-3">🏖️</div>
        <h4 className="text-muted mb-2">Nu s-au găsit plaje</h4>
        <p className="text-muted">
          Încercați să modificați filtrele de căutare sau să reîncărcați pagina.
        </p>
      </div>
    );
  }

  // Calculează statistici simple
  const totalPlaje = plaje.length;
  const plajeConImaginiReale = plaje.filter(p => 
    p.isReal === true || p.detaliiWeb?.profileImage?.isReal === true
  ).length;
  const plajeConRating = plaje.filter(p => 
    p.rating || p.detaliiWeb?.rating
  ).length;

  return (
    <div>
  

      {/* Grid cu plajele */}
      <div className="row g-4">
        {plaje.map((plaja, index) => (
          <div key={plaja.id || index} className="col-12 col-sm-6 col-lg-4 col-xl-3">
            <PlajaCard plaja={plaja} />
          </div>
        ))}
      </div>

   
    </div>
  );
};

export default PlajesList;