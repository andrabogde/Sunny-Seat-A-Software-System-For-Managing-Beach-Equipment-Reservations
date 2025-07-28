import React, { useState } from 'react';
import { IconFilterOff, IconFilter, IconMapPin, IconStar, IconSun, IconAdjustments, IconSquareCheck } from '@tabler/icons-react';

/**
 * Componentă îmbunătățită pentru filtrarea listei de plaje cu design modern
 * @param {Object} props 
 * @param {Object} props.filters - Starea filtrelor actuale
 * @param {Function} props.setFilters - Funcție pentru actualizarea filtrelor
 * @param {string[]} props.statiuni - Lista de stațiuni disponibile pentru filtrare
 * @param {number} props.maxSezlonguri - Numărul maxim de șezlonguri pentru slider
 */
const PlajaFilters = ({ filters, setFilters, statiuni, maxSezlonguri = 200 }) => {
  // Stare pentru a arăta/ascunde filtrele pe mobile
  const [showFilters, setShowFilters] = useState(false);
  
  // Reset filtre la valorile inițiale
  const resetFilters = () => {
    setFilters({
      statiune: "",
      rating: 0,
      sezlonguri: 0
    });
  };

  // Verificăm dacă există filtre active
  const hasActiveFilters = filters.statiune || filters.rating > 0 || filters.sezlonguri > 0;

  // Culori pentru teme
  const colors = {
    primary: "#3498db", // Albastru
    secondary: "#1abc9c", // Turcoaz
    accent: "#f39c12",  // Portocaliu
    dark: "#2c3e50",    // Albastru închis
    light: "#ecf0f1"    // Gri deschis
  };

  // Custom styles pentru range inputs
  const customRangeStyle = {
    WebkitAppearance: 'none',
    width: '100%',
    height: '8px',
    borderRadius: '10px',
    background: `linear-gradient(to right, ${colors.primary}, ${colors.secondary})`,
    outline: 'none',
  };
  
  const customThumbStyle = `
    .custom-range::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: white;
      border: 2px solid ${colors.primary};
      box-shadow: 0 2px 5px rgba(0,0,0,0.2);
      cursor: pointer;
      transition: all 0.2s ease;
    }
    
    .custom-range::-webkit-slider-thumb:hover {
      background: ${colors.primary};
      transform: scale(1.1);
    }
    
    .custom-range::-moz-range-thumb {
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: white;
      border: 2px solid ${colors.primary};
      box-shadow: 0 2px 5px rgba(0,0,0,0.2);
      cursor: pointer;
      transition: all 0.2s ease;
    }
    
    .custom-range::-moz-range-thumb:hover {
      background: ${colors.primary};
      transform: scale(1.1);
    }
  `;

  return (
    <div className="filter-card p-4 rounded-4 shadow-sm" style={{
      background: 'linear-gradient(145deg, #e6f7ff, #d1ebff)',
      border: '1px solid rgba(100,181,246,0.2)'
    }}>
      {/* Style pentru range inputs */}
      <style>{customThumbStyle}</style>
      
      {/* Header cu titlu și toggle pentru mobile */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="mb-0 d-flex align-items-center fw-bold" style={{ color: colors.dark }}>
          <div className="me-2 p-2 rounded-circle" style={{ background: colors.primary }}>
            <IconFilter size={18} color="white" stroke={2.5} />
          </div>
          Filtrează plajele
        </h5>
        <div>
          <button 
            className="btn btn-sm me-2 px-3 py-2 d-md-none"
            onClick={() => setShowFilters(!showFilters)}
            style={{
              background: colors.primary,
              color: 'white',
              border: 'none',
              borderRadius: '50px',
              boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
              transition: 'all 0.3s ease'
            }}
          >
            <IconAdjustments size={18} className="me-1" />
            {showFilters ? ' Ascunde' : ' Arată'}
          </button>
          {hasActiveFilters && (
            <button
              className="btn btn-sm px-3 py-2"
              onClick={resetFilters}
              title="Resetează filtrele"
              style={{
                background: '#e74c3c',
                color: 'white',
                border: 'none',
                borderRadius: '50px',
                boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                transition: 'all 0.3s ease'
              }}
            >
              <IconFilterOff size={18} className="me-1" /> Reset
            </button>
          )}
        </div>
      </div>

      {/* Filtre - afișate mereu pe desktop, toggle pe mobile */}
      <div className={`row g-4 ${!showFilters ? 'd-none d-md-flex' : 'd-flex'}`}>
        <div className="col-md-4">
          <div className="form-group">
            <label htmlFor="statiuneFilter" className="form-label d-flex align-items-center mb-2 fw-semibold">
              <div className="me-2 p-1 rounded-circle" style={{ background: colors.primary }}>
                <IconMapPin size={14} color="white" stroke={2.5} />
              </div>
              Stațiune
            </label>
            <select
              id="statiuneFilter"
              className="form-select py-2 px-3"
              value={filters.statiune}
              onChange={(e) => setFilters({ ...filters, statiune: e.target.value })}
              style={{
                borderRadius: '10px',
                border: `1px solid ${colors.primary}25`,
                boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
                fontSize: '0.95rem',
                cursor: 'pointer'
              }}
            >
              <option value="">Toate Stațiunile</option>
              {statiuni.map((nume, idx) => (
                <option key={idx} value={nume}>
                  {nume}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="col-md-4">
          <div className="form-group">
            <label htmlFor="ratingFilter" className="form-label d-flex align-items-center justify-content-between mb-2 fw-semibold">
              <span className="d-flex align-items-center">
                <div className="me-2 p-1 rounded-circle" style={{ background: colors.accent }}>
                  <IconStar size={14} color="white" stroke={2.5} />
                </div>
                Rating minim
              </span>
              <span className="badge px-2 py-1" style={{
                background: filters.rating > 0 ? colors.accent : '#e0e0e0',
                color: filters.rating > 0 ? 'white' : colors.dark,
                borderRadius: '20px',
                fontWeight: '600',
                fontSize: '0.75rem'
              }}>
                {filters.rating || "0"} ★
              </span>
            </label>
            <input
              id="ratingFilter"
              type="range"
              min="0"
              max="5"
              step="0.1"
              className="form-range custom-range"
              value={filters.rating}
              onChange={(e) => setFilters({ ...filters, rating: parseFloat(e.target.value) })}
              style={customRangeStyle}
            />
            <div className="d-flex justify-content-between mt-2">
              <small className="text-muted fw-semibold">0</small>
              <small className="text-muted fw-semibold">5</small>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="form-group">
            <label htmlFor="sezlonguriFilter" className="form-label d-flex align-items-center justify-content-between mb-2 fw-semibold">
              <span className="d-flex align-items-center">
                <div className="me-2 p-1 rounded-circle" style={{ background: colors.secondary }}>
                  <IconSun size={14} color="white" stroke={2.5} />
                </div>
                Șezlonguri min.
              </span>
              <span className="badge px-2 py-1" style={{
                background: filters.sezlonguri > 0 ? colors.secondary : '#e0e0e0',
                color: filters.sezlonguri > 0 ? 'white' : colors.dark,
                borderRadius: '20px',
                fontWeight: '600',
                fontSize: '0.75rem'
              }}>
                {filters.sezlonguri || "0"}
              </span>
            </label>
            <input
              id="sezlonguriFilter"
              type="range"
              min="0"
              max={maxSezlonguri}
              step="5"
              className="form-range custom-range"
              value={filters.sezlonguri}
              onChange={(e) => setFilters({ ...filters, sezlonguri: parseInt(e.target.value, 10) })}
              style={customRangeStyle}
            />
            <div className="d-flex justify-content-between mt-2">
              <small className="text-muted fw-semibold">0</small>
              <small className="text-muted fw-semibold">{maxSezlonguri}</small>
            </div>
          </div>
        </div>
      </div>

      {/* Badge-uri pentru filtrele active */}
      {hasActiveFilters && (
        <div className="mt-4 pt-3" style={{ 
          borderTop: '1px solid rgba(100,181,246,0.2)',
          background: 'rgba(255,255,255,0.3)',
          borderRadius: '0 0 12px 12px'
        }}>
          <p className="mb-2 small fw-semibold" style={{ color: colors.dark }}>
            <IconSquareCheck size={16} className="me-1" style={{ color: colors.primary }} />
            Filtre active:
          </p>
          <div className="d-flex flex-wrap gap-2">
            {filters.statiune && (
              <span className="badge py-2 px-3 d-flex align-items-center" style={{
                background: colors.primary,
                color: 'white',
                borderRadius: '50px',
                fontWeight: '500',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}>
                <IconMapPin size={14} className="me-1" />
                {filters.statiune} 
                <button 
                  className="btn-close btn-close-white ms-2" 
                  style={{ 
                    fontSize: '0.5rem',
                    opacity: '0.8',
                    transition: 'all 0.2s ease'
                  }}
                  onClick={() => setFilters({...filters, statiune: ""})}
                  onMouseOver={(e) => e.target.style.opacity = '1'}
                  onMouseOut={(e) => e.target.style.opacity = '0.8'}
                ></button>
              </span>
            )}
            {filters.rating > 0 && (
              <span className="badge py-2 px-3 d-flex align-items-center" style={{
                background: colors.accent,
                color: 'white',
                borderRadius: '50px',
                fontWeight: '500',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}>
                <IconStar size={14} className="me-1" />
                ≥ {filters.rating} ★
                <button 
                  className="btn-close btn-close-white ms-2" 
                  style={{ 
                    fontSize: '0.5rem',
                    opacity: '0.8',
                    transition: 'all 0.2s ease'
                  }}
                  onClick={() => setFilters({...filters, rating: 0})}
                  onMouseOver={(e) => e.target.style.opacity = '1'}
                  onMouseOut={(e) => e.target.style.opacity = '0.8'}
                ></button>
              </span>
            )}
            {filters.sezlonguri > 0 && (
              <span className="badge py-2 px-3 d-flex align-items-center" style={{
                background: colors.secondary,
                color: 'white',
                borderRadius: '50px',
                fontWeight: '500',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}>
                <IconSun size={14} className="me-1" />
                ≥ {filters.sezlonguri}
                <button 
                  className="btn-close btn-close-white ms-2" 
                  style={{ 
                    fontSize: '0.5rem',
                    opacity: '0.8',
                    transition: 'all 0.2s ease'
                  }}
                  onClick={() => setFilters({...filters, sezlonguri: 0})}
                  onMouseOver={(e) => e.target.style.opacity = '1'}
                  onMouseOut={(e) => e.target.style.opacity = '0.8'}
                ></button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PlajaFilters;