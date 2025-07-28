import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { IconBeach, IconStar, IconMapPin, IconDroplet, IconUmbrella, IconCalendar, IconClock, IconSofa, IconArmchair2 } from '@tabler/icons-react';
import { AuthContext } from '../contexts/AuthContext';
import ApiClient from "../api/src/ApiClient";
import PlajaControllerApi from "../api/src/api/PlajaControllerApi";
import EchipamentePlajaControllerApi from "../api/src/api/EchipamentPlajaControllerApi";
import RezervareControllerApi from "../api/src/api/RezervareControllerApi";

// Date Range Selector Component
const DateRangeSelector = ({ startDate, endDate, onDateChange, maxDays = 3 }) => {
  const today = new Date().toISOString().split('T')[0];
  
  const handleStartDateChange = (e) => {
    const newStartDate = e.target.value;
    onDateChange(newStartDate, endDate);
  };

  const handleEndDateChange = (e) => {
    const newEndDate = e.target.value;
    onDateChange(startDate, newEndDate);
  };

  const getMaxEndDate = () => {
    if (!startDate) return '';
    const start = new Date(startDate);
    const maxEnd = new Date(start);
    maxEnd.setDate(start.getDate() + maxDays - 1);
    return maxEnd.toISOString().split('T')[0];
  };

  const getDaysDifference = () => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  return (
    <div className="date-range-selector">
      <div className="card border-0 shadow-sm bg-gradient">
        <div className="card-body p-4">
          <h5 className="card-title d-flex align-items-center mb-4">
            <IconCalendar className="me-2 text-primary" size={24} />
            Selectează perioada rezervării
          </h5>
          
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label fw-semibold text-dark mb-2">
                <IconClock size={16} className="me-1" />
                Data de început
              </label>
              <input
                type="date"
                className="form-control form-control-lg border-2"
                value={startDate}
                onChange={handleStartDateChange}
                min={today}
                style={{ borderRadius: '12px' }}
              />
            </div>
            
            <div className="col-md-6">
              <label className="form-label fw-semibold text-dark mb-2">
                <IconClock size={16} className="me-1" />
                Data de sfârșit
              </label>
              <input
                type="date"
                className="form-control form-control-lg border-2"
                value={endDate}
                onChange={handleEndDateChange}
                min={startDate || today}
                max={getMaxEndDate()}
                disabled={!startDate}
                style={{ borderRadius: '12px' }}
              />
            </div>
          </div>
          
          {startDate && endDate && (
            <div className="mt-3 p-3 bg-light rounded-3">
              <div className="d-flex justify-content-between align-items-center">
                <span className="text-muted">Perioada selectată:</span>
                <span className="fw-bold text-primary">
                  {getDaysDifference()} {getDaysDifference() === 1 ? 'zi' : 'zile'}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <style jsx>{`
        .bg-gradient {
          background: linear-gradient(135deg, #f8f9ff 0%, #f0f4ff 100%);
        }
        
        .form-control:focus {
          border-color: #0d6efd;
          box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.1);
        }
      `}</style>
    </div>
  );
};
const BeachLayout = ({ plaja, selectedPositions, onPositionSelect, reservedPositions, dateRange }) => {
  console.log('plaja selectata ',selectedPositions);
  const selectedPlajaId=plaja.id;
  const [equipmentData, setEquipmentData] = useState([]);

  
  const echipamentApi = new EchipamentePlajaControllerApi(new ApiClient());

const [layout, setLayout] = useState([]);
//const [reservedPositions, setReservedPositions] = useState([]);
//const [selectedPositions, setSelectedPositions] = useState([]);

useEffect(() => {
  if (equipmentData.length > 0) {
    const generatedLayout = generateLayoutFromApi(equipmentData, reservedPositions, selectedPositions);
    setLayout(generatedLayout);
  }
}, [equipmentData, selectedPositions, reservedPositions]);


useEffect(() => {
  if (!selectedPlajaId) return;

  echipamentApi.getEchipamenteByPlajaIdUsingGET(selectedPlajaId, (error, data) => {
    if (error) {
      console.error("Eroare la încărcarea echipamentelor:", error);
    } else {
      setEquipmentData(data);
      const generatedLayout = generateLayoutFromApi(data,selectedPositions,reservedPositions);
      setLayout(generatedLayout);
    }
  });
}, [selectedPlajaId]);


const generateLayoutFromApi = (equipmentData, reservedPositions, selectedPositions) => {
  const layoutMap = new Map();
  // grupare pe rânduri
  equipmentData.forEach(item => {
    const row = item.pozitieLinie;
    const col = item.pozitieColoana;
    const id = `${row}-${col}`;
    const isReserved = reservedPositions.includes(id);//item.stareEchipamentDenumire?.toLowerCase() === 'rezervat';
    const isSelected = selectedPositions.some(pos => pos.id === id);

    const selectable = item.tipEchipamentDenumire === 'Baldachin' || item.tipEchipamentDenumire === 'Sezlong';
    const isSpacer = item.tipEchipamentDenumire === 'Loc Gol';

    const cell = {
      id,
      row,
      col,
      type: item.tipEchipamentDenumire.toLowerCase().replace(" ", "_"), // ex: loc_gol
      isReserved,
      isSelected,
      price: item.pretCurent,
      selectable,
      isSpacer
    };

    if (!layoutMap.has(row)) layoutMap.set(row, []);
    layoutMap.get(row).push(cell);
  });

  // sortăm coloanele în fiecare rând
  const layout = [];
  [...layoutMap.keys()].sort().forEach(rowIndex => {
    const row = layoutMap.get(rowIndex).sort((a, b) => a.col - b.col);
    layout.push(row);
  });

  return layout;
};


  const handlePositionClick = (position) => {
    if (!position.selectable || position.isReserved || !dateRange.startDate || !dateRange.endDate) return;
    onPositionSelect(position);
  };

  const getPositionClass = (position) => {
    let className = 'beach-position';
    
    if (position.type === 'empty') {
      return 'beach-position empty';
    }
    
    if (!position.selectable) {
      className += ' non-selectable';
    } else if (position.isReserved) {
      className += ' reserved';
    } else if (position.isSelected) {
      className += ' selected';
    } else {
      className += ' available';
    }
    
    className += ` ${position.type}`;
    return className;
  };

  const isLayoutDisabled = !dateRange.startDate || !dateRange.endDate;

  return (
    <div className="beach-layout-container">
      <div className={`beach-layout ${isLayoutDisabled ? 'disabled' : ''}`}>
        <div className="sea-indicator mb-5">
          <div className="sea-waves">
            <div className="wave wave1"></div>
            <div className="wave wave2"></div>
            <div className="wave wave3"></div>
          </div>
          <div className="sea-content">
            <IconDroplet className="me-3" size={28} />
            <span className="sea-title">MAREA NEAGRĂ</span>
            <IconDroplet className="ms-3" size={28} />
          </div>
        </div>

        <div className="beach-grid-container">
          <div className="beach-grid">
            {layout.map((row, rowIndex) => (
              <div key={rowIndex} className="beach-row">
                <div className="row-indicator">
                  <span className="row-number">R{rowIndex + 1}</span>
                </div>
                <div className="positions-container">
                  {row.map((position) => (
                    <div
                      key={position.id}
                      className={getPositionClass(position)}
                      onClick={() => handlePositionClick(position)}
                      title={
                        position.type === 'empty' ? '' :
                        position.type === 'umbrela' ? 'Umbrelă (inclusă în preț)' :
                        position.type === 'baldachin' ? `Baldachin - ${position.price} RON/zi ${position.isReserved ? '(Rezervat)' : ''}` :
                        `Șezlong - ${position.price} RON/zi ${position.isReserved ? '(Rezervat)' : ''}`
                      }
                    >
                      {position.type !== 'empty' && (
                        <div className="position-content">
                          {position.type === 'umbrela' && <IconUmbrella size={20} className="position-icon umbrella-icon" />}
                          {position.type === 'baldachin' && <IconSofa size={28} className="position-icon baldachin-icon" />}
                          {position.type === 'sezlong' && <IconArmchair2 size={20} className="position-icon sezlong-icon" />}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="beach-legend">
           {/* ... rest of the legend code ... */}
        </div>

        {isLayoutDisabled && (
          <div className="layout-overlay">
            {/* ... overlay code ... */}
          </div>
        )}
      </div>

      {/* ================= STYLES (CSS) MODIFIED ================= */}
      <style jsx>{`
        .beach-layout {
          background: linear-gradient(180deg, #f8fbff 0%, #fff8f0 100%);
          padding: 2rem;
          border-radius: 20px;
          border: 1px solid #e3f2fd;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
        }
        
        /* ... other styles remain the same ... */

        .sea-indicator {
          position: relative;
          height: 80px;
          background: linear-gradient(135deg, #1e88e5, #42a5f5, #64b5f6);
          border-radius: 16px;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 20px rgba(30, 136, 229, 0.3);
        }

        .sea-content {
          position: relative;
          z-index: 2;
          color: white;
          font-weight: 700;
          font-size: 1.2rem;
          display: flex;
          align-items: center;
          text-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }

        .beach-grid-container {
          display: flex;
          justify-content: center;
          padding: 1rem;
        }
        
        .beach-grid {
          display: inline-block;
        }

        .beach-row {
          display: flex;
          align-items: center;
          margin-bottom: 0.75rem;
        }

        .row-indicator {
          width: 50px;
          flex-shrink: 0;
          margin-right: 1.5rem;
          text-align: center;
        }

        .row-number {
          background: linear-gradient(135deg, #6366f1, #4f46e5);
          color: white;
          padding: 0.4rem 0.6rem;
          border-radius: 10px;
          font-weight: 600;
          font-size: 0.8rem;
          box-shadow: 0 2px 8px rgba(99, 102, 241, 0.3);
          min-width: 35px;
          display: inline-block;
        }

        .positions-container {
          display: flex;
          gap: 0.3rem; /* Small gap for items within a group */
          align-items: center;
        }

        .beach-position {
          height: 40px;
          border: 2px solid transparent;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          background: white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        }

        
        .beach-position.loc_gol {
            width: 40px;
        }
         .beach-position.sezlong {
            width: 40px;
        }
        .beach-position.umbrela {
            width: 40px;
        }

        .beach-position.baldachin {
            /* Un baldachin = 3 elemente (S+u+S) + 2 spatii mici intre ele */
            width: 40px;//calc(40px * 3 + 0.3rem * 2); 
            border-radius: 10px;
        }

        .beach-position.empty {
          background: transparent;
          border: none;
          box-shadow: none;
          cursor: default;
          width: 2rem; /* Spațiul mai mare dintre grupuri */
        }

        .beach-position:hover:not(.reserved):not(.empty):not(.non-selectable) {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }

        .beach-position.selected {
          border-color: #3b82f6;
          background: linear-gradient(135deg, #eff6ff, #dbeafe);
          transform: scale(1.05);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        }
        
        .beach-position.available.sezlong {
          border-color: #10b981;
          background: linear-gradient(135deg, #ecfdf5, #d1fae5);
        }

        .beach-position.available.baldachin {
          border-color: #8b5cf6;
          background: linear-gradient(135deg, #f3e8ff, #e9d5ff);
        }
        
        .beach-position.reserved {
          border-color: #ef4444;
          background: linear-gradient(135deg, #fef2f2, #fee2e2);
          cursor: not-allowed;
          opacity: 0.7;
        }

        .beach-position.non-selectable.umbrela {
          border-radius: 8px;
          border-color: #f59e0b;
          background: linear-gradient(135deg, #fffbeb, #fef3c7);
          cursor: default;
        }

        .position-content {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
        }

        .baldachin-icon { color: #7c3aed; }
        .sezlong-icon { color: #2563eb; }
        .umbrela-icon { color: #d97706; }

        /* ... restul stilurilor ... */
        .beach-legend, .layout-overlay, @media queries {
            /* No changes needed here, they will adapt */
        }

      `}</style>
    </div>
  );
};


// Main ReservationPage and other components remain unchanged
// ... așezați aici restul componentelor (ReservationSummary, ReservationPage, etc.)
// ... ele nu necesită modificări ...


// Enhanced Reservation Summary Component
const ReservationSummary = ({ selectedPositions, dateRange, onConfirm }) => {
  const calculateDays = () => {
    if (!dateRange.startDate || !dateRange.endDate) return 0;
    const start = new Date(dateRange.startDate);
    const end = new Date(dateRange.endDate);
    const diffTime = Math.abs(end - start);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  const calculateTotal = () => {
    const days = calculateDays();
    return selectedPositions.reduce((total, pos) => {
      if (pos.selectable) {
        return total + (pos.price * days);
      }
      return total;
    }, 0);
  };

  const groupByType = () => {
    const groups = { sezlong: [], baldachin: [] };
    selectedPositions.forEach(pos => {
      if (pos.type === 'sezlong') {
        groups.sezlong.push(pos);
      } else if (pos.type === 'baldachin') {
        groups.baldachin.push(pos);
      }
    });
    return groups;
  };

  const grouped = groupByType();
  const total = calculateTotal();
  const days = calculateDays();
  const isValid = selectedPositions.length > 0 && dateRange.startDate && dateRange.endDate;

  if (!dateRange.startDate || !dateRange.endDate) {
    return (
      <div className="summary-card">
        <div className="card border-0 shadow-sm">
          <div className="card-body text-center p-4">
            <IconCalendar size={48} className="text-muted mb-3" />
            <h6 className="text-muted">Selectează perioada</h6>
            <p className="text-muted small mb-0">
              Alege datele pentru a vedea opțiunile de rezervare
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (selectedPositions.length === 0) {
    return (
      <div className="summary-card">
        <div className="card border-0 shadow-sm">
          <div className="card-body text-center p-4">
            <IconBeach size={48} className="text-muted mb-3" />
            <h6 className="text-muted">Selectează pozițiile</h6>
            <p className="text-muted small mb-0">
              Alege șezlongurile și baldachinele dorite de pe hartă
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="summary-card">
      <div className="card border-0 shadow-lg">
        <div className="card-header bg-gradient text-white text-center py-3">
          <h5 className="mb-0 fw-bold">Rezumat Rezervare</h5>
        </div>
        
        <div className="card-body p-4">
          {/* Period Display */}
          <div className="period-section mb-4">
            <div className="period-card">
              <div className="d-flex justify-content-between align-items-center">
                <span className="period-label">Perioada:</span>
                <span className="period-value">
                  {new Date(dateRange.startDate).toLocaleDateString('ro-RO')} - 
                  {new Date(dateRange.endDate).toLocaleDateString('ro-RO')}
                </span>
              </div>
              <div className="d-flex justify-content-between align-items-center mt-1">
                <span className="period-label">Durată:</span>
                <span className="period-days">{days} {days === 1 ? 'zi' : 'zile'}</span>
              </div>
            </div>
          </div>

          {/* Selected Items */}
          {grouped.sezlong.length > 0 && (
            <div className="item-section mb-3">
              <div className="item-header">
                <IconArmchair2 size={16} className="text-primary" />
                <span className="item-title">Șezlonguri ({grouped.sezlong.length})</span>
              </div>
              <div className="item-details">
                {grouped.sezlong.map(pos => (
                  <div key={pos.id} className="item-detail">
                    <span>R{pos.row}C{pos.col}</span>
                    <span>{pos.price} × {days} = {pos.price * days} RON</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {grouped.baldachin.length > 0 && (
            <div className="item-section mb-4">
              <div className="item-header">
                <IconSofa size={16} className="text-purple-600" />
                <span className="item-title">Baldachine ({grouped.baldachin.length})</span>
              </div>
              <div className="item-details">
                {grouped.baldachin.map(pos => (
                  <div key={pos.id} className="item-detail">
                    <span>R{pos.row}C{pos.col}</span>
                    <span>{pos.price} × {days} = {pos.price * days} RON</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Total */}
          <div className="total-section">
            <div className="total-card">
              <div className="d-flex justify-content-between align-items-center">
                <span className="total-label">Total:</span>
                <span className="total-amount">{total} RON</span>
              </div>
            </div>
          </div>

          {/* Confirm Button */}
          <button 
            className="btn btn-primary btn-lg w-100 mt-3 confirm-btn"
            onClick={() => onConfirm({ selectedPositions, total, dateRange, days })}
            disabled={!isValid}
          >
            <i className="ti ti-check me-2"></i>
            Confirmă Rezervarea
          </button>
        </div>
      </div>

      <style jsx>{`
        .summary-card .card {
          border-radius: 20px;
          overflow: hidden;
        }

        .bg-gradient {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .period-section {
          border-bottom: 1px solid #f1f5f9;
          padding-bottom: 1rem;
        }

        .period-card {
          background: linear-gradient(135deg, #f8fafc, #f1f5f9);
          padding: 1rem;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
        }

        .period-label {
          color: #64748b;
          font-size: 0.875rem;
        }

        .period-value {
          font-weight: 600;
          color: #1e293b;
          font-size: 0.875rem;
        }

        .period-days {
          background: linear-gradient(135deg, #3b82f6, #1d4ed8);
          color: white;
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-weight: 600;
          font-size: 0.75rem;
        }

        .item-section {
          border-left: 3px solid #e2e8f0;
          padding-left: 1rem;
        }

        .item-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.75rem;
        }

        .item-title {
          font-weight: 600;
          color: #1e293b;
        }

        .sezlong-mini {
          width: 16px;
          height: 10px;
          background: linear-gradient(135deg, #3b82f6, #60a5fa);
          border-radius: 3px;
        }

        .text-purple-600 {
          color: #9333ea;
        }

        .item-details {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .item-detail {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.5rem 0.75rem;
          background: #f8fafc;
          border-radius: 8px;
          font-size: 0.875rem;
        }

        .item-detail span:first-child {
          color: #64748b;
          font-weight: 500;
        }

        .item-detail span:last-child {
          color: #1e293b;
          font-weight: 600;
        }

        .total-section {
          border-top: 2px solid #f1f5f9;
          padding-top: 1rem;
        }

        .total-card {
          background: linear-gradient(135deg, #fef3c7, #fde68a);
          padding: 1rem;
          border-radius: 12px;
          border: 1px solid #f59e0b;
        }

        .total-label {
          font-size: 1.125rem;
          font-weight: 600;
          color: #92400e;
        }

        .total-amount {
          font-size: 1.5rem;
          font-weight: 700;
          color: #92400e;
        }

        .confirm-btn {
          border-radius: 12px;
          font-weight: 600;
          background: linear-gradient(135deg, #10b981, #059669);
          border: none;
          transition: all 0.3s ease;
        }

        .confirm-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(16, 185, 129, 0.3);
        }

        .confirm-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};


// Main Component
const ReservationPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user,userDetails } = useContext(AuthContext);
  
  const [plaja, setPlaja] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reservationSuccess, setReservationSuccess] = useState(false);
  const [reservationData, setReservationData] = useState(null);
  
  // Enhanced state for multi-day reservations
  const [selectedPositions, setSelectedPositions] = useState([]);
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });
  const [reservedPositions, setReservedPositions] = useState([
    //'0-2', '0-6', '1-8', '2-4', '3-0', '3-12', '4-2', '5-6', '6-10', '7-0', '8-8', '9-14'
  ]);

  // Initialize API client
  const apiClient = new ApiClient();
  apiClient.enableCookies = true;
  const plajaApi = new PlajaControllerApi(apiClient);
 const rezervariApi = new RezervareControllerApi(apiClient);
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { 
        state: { 
          from: `/rezervare/${id}`,
          message: 'Trebuie să vă autentificați pentru a face o rezervare' 
        } 
      });
      return;
    }

    const loadPlajaDetails = async () => {
      try {
        setLoading(true);
        
        plajaApi.getPlajaByIdUsingGET(id, (error, data) => {
          if (error) {
            console.error("Eroare la încărcarea detaliilor plajei:", error);
            setError("Nu s-au putut încărca detaliile plajei. Încercați din nou mai târziu.");
          } else {
            setPlaja(data);
            setError(null);
          }
          setLoading(false);
        });
      } catch (err) {
        console.error("Eroare neașteptată:", err);
        setError("A apărut o eroare neașteptată. Încercați din nou mai târziu.");
        setLoading(false);
      }
    };

    if (id) {
      loadPlajaDetails();
    } else {
      setError("ID-ul plajei lipsește.");
      setLoading(false);
    }
  }, [id, isAuthenticated, navigate]);

  // Handle date range changes
  const handleDateRangeChange = (startDate, endDate) => {
    setDateRange({ startDate, endDate });
    setSelectedPositions([]); // Reset selections when dates change
    if(!endDate)
      return;
    // In real implementation, fetch reserved positions for the new date range
    // fetchReservedPositions(startDate, endDate);
    rezervariApi.getReservedPositionsUsingGET(startDate, endDate, id, (error, data) => {
      if (error) {
        console.error("Eroare la obtinerea pozitiilor rezervate:", error);
      } else {
        setReservedPositions(data);
        console.log("Reserved positions:", data);
      }
    })
  };

  // Handle position selection
  const handlePositionSelect = (position) => {
    console.log('pozitie selectata ',position);
    setSelectedPositions(prev => {
      const isAlreadySelected = prev.find(p => p.id === position.id);
      
      if (isAlreadySelected) {
        return prev.filter(p => p.id !== position.id);
      } else {
        return [...prev, position];
      }
    });
  };

  // Handle reservation confirmation
  // Adaugă în ReservationPage componenta - partea cu handleReservationConfirm

  // Handle reservation confirmation - ACTUALIZAT
  // Handle reservation confirmation - ACTUALIZAT pentru PaymentPage
  // Handle reservation confirmation - ACTUALIZAT pentru a trimite date reale
const handleReservationConfirm = async (reservationDetails) => {
  console.log("🔄 Trimitere către plată - Date primite:", reservationDetails);
  
  try { 
    // Verifică că utilizatorul este autentificat
    if (!isAuthenticated || !user) {
      navigate('/login', { 
        state: { 
          from: `/rezervare/${id}`,
          message: 'Trebuie să vă autentificați pentru a face o rezervare' 
        } 
      });
      return;
    }

    // 🆕 PREGĂTEȘTE DATELE REALE DIN FORMULAR PENTRU STRIPE
    const reservationData = {
      // Informații utilizator
      utilizatorId: user.id,
      utilizatorEmail: user.email,
      
      // Informații plajă - DIN STATE
      plajaId: plaja.id,
      numePlaja: plaja.denumire,        // 🔑 Din plaja încărcată
      statiune: plaja.statiune?.denumire || "Constanța",
      
      // Perioada - DIN FORM
      dataRezervare: reservationDetails.dateRange.startDate,  // 🔑 Data principală
      dataInceput: reservationDetails.dateRange.startDate,    // Pentru compatibilitate
      dataSfarsit: reservationDetails.dateRange.endDate,
      days: reservationDetails.days,
      
      // 🔑 POZIȚII SELECTATE DIN HARTĂ - FOARTE IMPORTANT!
      pozitiiSelectate: selectedPositions.filter(pos => pos.selectable).map(pos => ({
        id: pos.id,
        row: pos.row,
        col: pos.col,
        type: pos.type,
        price: pos.price,
        pozitiaSezlong: `R${pos.row + 1}C${pos.col + 1}-${pos.type.toUpperCase()}` // Format: R2C3-SEZLONG
      })),
      
      // Poziția principală (prima selectată) - pentru notificare
      pozitiaSezlong: selectedPositions.length > 0 
        ? `R${selectedPositions[0].row + 1}C${selectedPositions[0].col + 1}-${selectedPositions[0].type.toUpperCase()}`
        : 'Personalizat',
      
      // Prețuri și calcule
      totalCalculat: reservationDetails.total,
      pret: {
        taxaRezervare: 15,
        total: reservationDetails.total
      },
      
      // Metadate pentru debugging
      pozitie: 'din_harta', // Markează că sunt selectate din hartă
      numarPozitii: selectedPositions.filter(pos => pos.selectable).length,
      tipuriSelectate: [...new Set(selectedPositions.filter(pos => pos.selectable).map(pos => pos.type))]
    };

    console.log("🔍 Date finale pregătite pentru PaymentPage:", {
      utilizatorId: reservationData.utilizatorId,
      numePlaja: reservationData.numePlaja,
      dataRezervare: reservationData.dataRezervare,
      pozitiaSezlong: reservationData.pozitiaSezlong,
      pozitiiSelectate: reservationData.pozitiiSelectate,
      totalCalculat: reservationData.totalCalculat
    });

    // Validează că avem toate datele necesare
    if (!reservationData.numePlaja) {
      throw new Error('Numele plajei lipsește');
    }
    if (!reservationData.dataRezervare) {
      throw new Error('Data rezervării lipsește');
    }
    if (!reservationData.pozitiaSezlong || reservationData.pozitiaSezlong === 'Personalizat') {
      throw new Error('Te rugăm să selectezi cel puțin o poziție din hartă');
    }
    if (reservationData.pozitiiSelectate.length === 0) {
      throw new Error('Nu au fost selectate poziții valide');
    }

    console.log("✅ Validare trecută, navigare către PaymentPage...");

    // Navighează către PaymentPage cu datele rezervării
    navigate('/payment', {
      state: {
        reservationData: reservationData
      }
    });

  } catch (error) {
    console.error("❌ Eroare la pregătirea datelor pentru plată:", error);
    setError(`Eroare la pregătirea rezervării: ${error.message}`);
    
    // Scroll la început pentru a vedea eroarea
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};
  // 🛠️ FUNCȚIE HELPER PENTRU MESAJ SUCCESS
  const showSuccessMessage = (message) => {
    // Poți să folosești un toast library sau să afișezi un alert
    if (window.toast) {
      window.toast.success(message);
    } else {
      // Fallback la alert simplu
      setTimeout(() => {
        alert(message);
      }, 500);
    }
  };

  // 🛠️ FUNCȚII HELPER NECESARE

  // Obține user ID din context sau token
  const getUserIdFromAuth = () => {
    // Implementează bazat pe cum ai configurat AuthContext
    const { user } = useContext(AuthContext);
    return user?.id || null;
  };

  // Obține token-ul de autentificare
  const getAuthToken = () => {
    // Implementează bazat pe cum stochezi token-ul
    return localStorage.getItem('authToken') || '';
  };

  // Generează ID pentru echipament bazat pe poziție
  const generateEchipamentId = (position) => {
    // Implementează logica pentru maparea pozițiilor la echipamente
    // De exemplu, bazat pe row și col
    return (position.row * 100) + position.col;
  };

  return (
    <div className="modern-reservation-container">
      <div className="container-fluid px-4 py-5">
        {loading ? (
          <div className="loading-container">
            <div className="loading-content">
              <div className="spinner-border text-primary mb-4" role="status" style={{ width: '3rem', height: '3rem' }}>
                <span className="visually-hidden">Se încarcă...</span>
              </div>
              <h5 className="text-muted">Se încarcă detaliile plajei...</h5>
            </div>
          </div>
        ) : error ? (
          <div className="error-container">
            <div className="alert alert-danger shadow-sm border-0 rounded-4">
              <div className="d-flex align-items-center">
                <div className="alert-icon me-3">
                  <i className="ti ti-alert-circle" style={{ fontSize: '2rem' }}></i>
                </div>
                <div className="flex-grow-1">
                  <h4 className="alert-heading mb-2">Oops! Ceva nu a mers bine</h4>
                  <p className="mb-3">{error}</p>
                  <button 
                    className="btn btn-outline-danger rounded-pill"
                    onClick={() => navigate(-1)}
                  >
                    <i className="ti ti-arrow-left me-1"></i> Înapoi
                  </button>
                </div>
              </div>
            </div>
          </div>
       ) : reservationSuccess ? (
        <div className="success-container">
          <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
            <div className="card-header bg-success text-white text-center py-4">
              <div className="success-icon mb-3">
                <i className="ti ti-check-circle" style={{ fontSize: '4rem' }}></i>
              </div>
              <h2 className="mb-0 fw-bold">Rezervare Confirmată!</h2>
              {/* 🆕 AFIȘEAZĂ CODUL REZERVĂRII PROEMINENT */}
              <div className="reservation-code mt-3">
                <div className="code-badge">
                  <span className="code-label">Codul rezervării tale:</span>
                  <span className="code-value">{reservationData?.codRezervare}</span>
                </div>
              </div>
            </div>
            
            <div className="card-body p-5">
              <div className="text-center mb-4">
                <p className="text-muted fs-5">
                  Rezervarea ta la <strong>{reservationData?.plajaDenumire}</strong> a fost înregistrată cu succes.
                </p>
                {/* 🔔 INFORMAȚIE DESPRE NOTIFICARE */}
                <div className="alert alert-info border-0 rounded-3 mt-3">
                  <i className="ti ti-bell me-2"></i>
                  O notificare cu detaliile rezervării a fost adăugată în contul tău.
                  <br />
                  <small>Verifică secțiunea <strong>Notificări</strong> pentru mai multe detalii.</small>
                </div>
              </div>
              
              <div className="reservation-details">
                <h5 className="section-title">Detalii rezervare</h5>
                <div className="details-grid">
                  <div className="detail-item highlight">
                    <span className="detail-label">Cod rezervare:</span>
                    <span className="detail-value reservation-code-text">{reservationData?.codRezervare}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Stare:</span>
                    <span className="detail-value">
                      <span className="badge bg-success">{reservationData?.stareRezervare}</span>
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Plajă:</span>
                    <span className="detail-value">{reservationData?.plajaDenumire}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Stațiune:</span>
                    <span className="detail-value">{reservationData?.statiune}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Perioada:</span>
                    <span className="detail-value">
                      {new Date(reservationData?.dateRange.startDate).toLocaleDateString('ro-RO')} - 
                      {new Date(reservationData?.dateRange.endDate).toLocaleDateString('ro-RO')}
                      <span className="ms-2 badge bg-primary">{reservationData?.days} {reservationData?.days === 1 ? 'zi' : 'zile'}</span>
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Poziții rezervate:</span>
                    <span className="detail-value">
                      {reservationData?.pozitii?.map(pos => 
                        `R${pos.row + 1}C${pos.col + 1} (${pos.type === 'baldachin' ? 'Baldachin' : 'Șezlong'})`
                      ).join(', ')}
                    </span>
                  </div>
                  <div className="detail-item highlight">
                    <span className="detail-label">Total:</span>
                    <span className="detail-value total-amount">{reservationData?.pret.total} RON</span>
                  </div>
                </div>
              </div>
              
              <div className="action-buttons">
                <button className="btn btn-outline-primary btn-lg rounded-pill" onClick={() => navigate('/')}>
                  <i className="ti ti-home me-2"></i> Pagina principală
                </button>
                <button className="btn btn-outline-info btn-lg rounded-pill" onClick={() => navigate('/notificari')}>
                  <i className="ti ti-bell me-2"></i> Vezi notificările
                </button>
                <button className="btn btn-primary btn-lg rounded-pill" onClick={() => navigate('/rezervari')}>
                  <i className="ti ti-ticket me-2"></i> Rezervările mele
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
          <div className="reservation-content">
            {/* Header */}
            <div className="page-header mb-5">
              <div className="row align-items-center">
                <div className="col-md-8">
                  <h1 className="page-title">
                    <IconBeach className="me-3 text-primary" size={36} />
                    Rezervare la {plaja.denumire}
                  </h1>
                  <p className="page-subtitle">
                    <IconMapPin size={18} className="me-1 text-muted" />
                    {plaja.statiune?.denumire || "N/A"}
                    {plaja.detaliiWeb?.rating != null && (
                      <span className="ms-3 badge bg-warning text-dark fs-6">
                        <IconStar size={16} className="me-1" /> {plaja.detaliiWeb.rating.toFixed(1)}
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </div>

            <div className="row g-4">
              <div className="col-xl-8">
                {/* Date Range Selector */}
                <div className="mb-4">
                  <DateRangeSelector
                    startDate={dateRange.startDate}
                    endDate={dateRange.endDate}
                    onDateChange={handleDateRangeChange}
                    maxDays={3}
                  />
                </div>

                {/* Beach Layout */}
                <div className="beach-section">
                  <div className="card border-0 shadow-sm rounded-4">
                    <div className="card-body p-4">
                      <h5 className="card-title mb-4">
                        <IconBeach className="me-2 text-primary" size={24} />
                        Selectează pozițiile dorite
                      </h5>
                      
                      <BeachLayout
                        plaja={plaja}
                        selectedPositions={selectedPositions}
                        onPositionSelect={handlePositionSelect}
                        reservedPositions={reservedPositions}
                        dateRange={dateRange}
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="col-xl-4">
                {/* Reservation Summary */}
                <div className="sticky-sidebar">
                  <div className="mb-4">
                    <ReservationSummary
                      selectedPositions={selectedPositions}
                      dateRange={dateRange}
                      onConfirm={handleReservationConfirm}
                    />
                  </div>

                  {/* Info Cards */}
                  <div className="info-cards">
                    <div className="card border-0 shadow-sm rounded-4 mb-4">
                      <div className="card-body p-4">
                        <h6 className="card-title text-primary mb-3">
                          <i className="ti ti-info-circle me-2"></i>
                          Informații rezervare
                        </h6>
                        <div className="info-list">
                          <div className="info-item">
                            <i className="ti ti-clock text-primary"></i>
                            <div>
                              <strong>Check-in:</strong> 9:00 - 11:00
                            </div>
                          </div>
                          <div className="info-item">
                            <i className="ti ti-credit-card text-primary"></i>
                            <div>
                              <strong>Plată:</strong> Card, Cash, Online
                            </div>
                          </div>
                          <div className="info-item">
                            <i className="ti ti-calendar text-primary"></i>
                            <div>
                              <strong>Sezon:</strong> 15 Mai - 15 Septembrie
                            </div>
                          </div>
                          <div className="info-item">
                            <i className="ti ti-shield-check text-primary"></i>
                            <div>
                              <strong>Anulare:</strong> Gratuită cu 24h înainte
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="card border-0 shadow-sm rounded-4">
                      <div className="card-body p-4">
                        <h6 className="card-title text-primary mb-3">
                          <i className="ti ti-headphones me-2"></i>
                          Ai nevoie de ajutor?
                        </h6>
                        <p className="text-muted mb-3">
                          Echipa noastră este disponibilă pentru orice întrebare.
                        </p>
                        <div className="contact-buttons">
                          <a href="tel:+40722123456" className="btn btn-outline-primary rounded-pill w-100 mb-2">
                            <i className="ti ti-phone me-2"></i> 0722 123 456
                          </a>
                          <a href="mailto:rezervari@SunnySeat.ro" className="btn btn-outline-primary rounded-pill w-100">
                            <i className="ti ti-mail me-2"></i> rezervari@sunnyseat.ro
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .modern-reservation-container {
          background-color: #f4f7fa; /* Light grey background for the whole page */
          min-height: 100vh;
        }

        .container-fluid {
          max-width: 1600px; /* Wider container for large screens */
        }

        .loading-container,
        .error-container {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 60vh;
        }

        .loading-content {
          text-align: center;
          background: white;
          padding: 3rem;
          border-radius: 20px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        }

        .success-container {
          max-width: 800px;
          margin: 0 auto;
        }

        .page-header {
          background: white;
          padding: 2rem;
          border-radius: 20px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.07);
        }

        .page-title {
          font-size: 2.5rem;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 0.5rem;
          display: flex;
          align-items: center;
        }

        .page-subtitle {
          font-size: 1.1rem;
          color: #64748b;
          margin-bottom: 0;
          display: flex;
          align-items: center;
        }

        .sticky-sidebar {
          position: sticky;
          top: 2rem;
        }

        .info-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .info-item {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          padding: 0.75rem;
          background: linear-gradient(135deg, #f8fafc, #f1f5f9);
          border-radius: 10px;
          transition: transform 0.2s ease;
        }

        .info-item:hover {
          transform: translateX(4px);
        }

        .info-item i {
          margin-top: 0.125rem;
          flex-shrink: 0;
        }

        .contact-buttons .btn {
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .contact-buttons .btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.15);
        }

        .reservation-details {
          background: linear-gradient(135deg, #f8fafc, #f1f5f9);
          padding: 2rem;
          border-radius: 16px;
          margin-bottom: 2rem;
        }

        .section-title {
          color: #1e293b;
          font-weight: 700;
          margin-bottom: 1.5rem;
          padding-bottom: 0.5rem;
          border-bottom: 2px solid #e2e8f0;
        }

        .details-grid {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .detail-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.06);
        }

        .detail-item.highlight {
          background: linear-gradient(135deg, #fef3c7, #fde68a);
          border: 1px solid #f59e0b;
        }

        .detail-label {
          color: #64748b;
          font-weight: 600;
        }

        .detail-value {
          color: #1e293b;
          font-weight: 600;
          text-align: right;
        }

        .total-amount {
          font-size: 1.5rem;
          color: #92400e;
          font-weight: 700;
        }

        .action-buttons {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        .action-buttons .btn {
          min-width: 200px;
          font-weight: 600;
        }

        @media (max-width: 768px) {
          .page-title {
            font-size: 1.8rem;
            flex-direction: column;
            align-items: flex-start;
          }

          .modern-reservation-container {
            background: white;
          }

          .container-fluid {
            padding-left: 1rem;
            padding-right: 1rem;
          }

          .sticky-sidebar {
            position: static;
          }

          .action-buttons {
            flex-direction: column;
          }

          .action-buttons .btn {
            min-width: auto;
          }
        }
      `}</style>
    </div>
  );
};

export default ReservationPage;