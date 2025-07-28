import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  IconMapPin, 
  IconClock, 
  IconFlame, 
  IconTrendingDown,
  IconUmbrella,
  IconSun,
  IconBeach,
  IconCalendar,
  IconTag,
  IconStarFilled
} from '@tabler/icons-react';
import ApiClient from '../api/src/ApiClient';
import PlajaControllerApi from '../api/src/api/PlajaControllerApi';
import useOffers from '../hooks/useOffers';

// Setup API
const apiClient = new ApiClient();
apiClient.enableCookies = true;
const plajaApi = new PlajaControllerApi(apiClient);

const Oferte = () => {
  const [allBeaches, setAllBeaches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Folosește hook-ul pentru oferte
  const { 
    offers: currentOffers, 
    timeRemaining, 
    isLoading: offersLoading,
    refreshOffers,
    stats 
  } = useOffers(allBeaches);

  // Încarcă toate plajele din baza de date
  const loadAllBeaches = async () => {
    try {
      setLoading(true);
      plajaApi.getAllPlajeUsingGET((error, data) => {
        if (error) {
          console.error('Eroare la încărcarea plajelor:', error);
          setError('Nu s-au putut încărca plajele. Încercați din nou.');
        } else {
          setAllBeaches(data || []);
        }
        setLoading(false);
      });
    } catch (err) {
      console.error('Eroare:', err);
      setError('Eroare la conectarea la server.');
      setLoading(false);
    }
  };

  // Efect pentru încărcarea inițială
  useEffect(() => {
    loadAllBeaches();
  }, []);

  // Date pentru graficul săptămânal - ÎNLOCUIT
  const weeklyPriceData = [
    { day: 'Luni', price: 35, type: 'weekday', shortDay: 'L' },
    { day: 'Marți', price: 35, type: 'weekday', shortDay: 'M' },
    { day: 'Miercuri', price: 38, type: 'weekday', shortDay: 'M' },
    { day: 'Joi', price: 42, type: 'weekday', shortDay: 'J' },
    { day: 'Vineri', price: 55, type: 'weekend', shortDay: 'V' },
    { day: 'Sâmbătă', price: 75, type: 'weekend', shortDay: 'S' },
    { day: 'Duminică', price: 70, type: 'weekend', shortDay: 'D' }
  ];

  // Componenta pentru graficul săptămânal - ÎNLOCUIT
  const WeeklyPriceChart = ({ data }) => {
    if (!data || data.length === 0) return <div>Nu există date pentru grafic</div>;
    
    const maxPrice = Math.max(...data.map(item => item.price));
    const minPrice = Math.min(...data.map(item => item.price));
    const avgPrice = Math.round(data.reduce((sum, item) => sum + item.price, 0) / data.length);
    
    return (
      <div className="weekly-chart p-4">
        <div className="row mb-4">
          <div className="col-md-8">
            <h5 className="mb-2">Prețuri Medii pe Săptămână</h5>
            <p className="text-muted small mb-0">
              Prețurile variază în funcție de ziua săptămânii. Weekend-urile sunt mai scumpe.
            </p>
          </div>
          <div className="col-md-4 text-end">
            <div className="d-flex justify-content-end gap-3">
              <div className="text-center">
                <div className="fw-bold text-success">{minPrice} RON</div>
                <small className="text-muted">Min</small>
              </div>
              <div className="text-center">
                <div className="fw-bold text-primary">{avgPrice} RON</div>
                <small className="text-muted">Mediu</small>
              </div>
              <div className="text-center">
                <div className="fw-bold text-warning">{maxPrice} RON</div>
                <small className="text-muted">Max</small>
              </div>
            </div>
          </div>
        </div>
        
        <div className="chart-grid">
          {data.map((item, index) => {
            const heightPercent = ((item.price - minPrice) / (maxPrice - minPrice)) * 100;
            const actualHeight = Math.max(heightPercent, 15); // Minimum 15% pentru vizibilitate
            
            return (
              <div key={index} className="chart-column">
                <div className="price-display mb-2">
                  <span className="price-value">{item.price} RON</span>
                </div>
                
                <div className="bar-container">
                  <div 
                    className={`price-bar ${item.type === 'weekend' ? 'weekend-bar' : 'weekday-bar'}`}
                    style={{
                      height: `${actualHeight}%`,
                      animationDelay: `${index * 0.1}s`
                    }}
                  >
                    {item.type === 'weekend' && (
                      <div className="weekend-indicator">
                        <span>🔥</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="day-label">
                  <div className="day-name">{item.day}</div>
                  <div className={`day-type ${item.type}`}>
                    {item.type === 'weekend' ? 'Weekend' : 'Săptămână'}
                  </div>
                </div>
                
                {item.type === 'weekend' && (
                  <div className="weekend-badge">
                    <span className="badge bg-warning text-dark">
                      +{item.price - avgPrice} RON
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        
        <div className="chart-legend mt-4">
          <div className="row">
            <div className="col-md-6">
              <div className="legend-item">
                <div className="legend-color weekday-color"></div>
                <span>Zile normale (Luni - Joi): Prețuri standard</span>
              </div>
            </div>
            <div className="col-md-6">
              <div className="legend-item">
                <div className="legend-color weekend-color"></div>
                <span>Weekend (Vineri - Duminică): Prețuri majorate</span>
              </div>
            </div>
          </div>
          
          <div className="mt-3 p-3 bg-light rounded">
            <div className="text-center">
              <h6 className="mb-2">💡 Sfat pentru economisire</h6>
              <p className="mb-0 text-muted">
                <strong>Rezervă Luni-Marți</strong> și economisești până la 40 RON față de weekend!
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const OfferCard = ({ beach }) => (
    <div className="col-lg-4 col-md-6 mb-4">
      <div className="card border-0 shadow-sm h-100 offer-card">
        <div className="position-relative">
          <img 
            src={beach.image} 
            className="card-img-top" 
            alt={beach.name}
            style={{ height: '200px', objectFit: 'cover' }}
          />
          <div className="position-absolute top-0 end-0 m-2">
            <span className="badge bg-danger fs-6 pulse-animation">
              -{beach.discount}%
            </span>
          </div>
          <div className="position-absolute bottom-0 start-0 m-2">
            <span className="badge bg-primary">
              <IconFlame size={16} className="me-1" />
              Last Minute
            </span>
          </div>
        </div>
        
        <div className="card-body d-flex flex-column">
          <div className="d-flex justify-content-between align-items-start mb-3">
            <div>
              <h5 className="card-title mb-1">{beach.name}</h5>
              <p className="text-muted mb-0">
                <IconMapPin size={16} className="me-1" />
                {beach.location}
              </p>
            </div>
            <div className="text-end">
              <div className="d-flex align-items-center mb-1">
                <IconStarFilled size={16} className="text-warning me-1" />
                <span className="fw-bold">{beach.rating}</span>
                <small className="text-muted ms-1">({beach.reviews})</small>
              </div>
            </div>
          </div>

          <div className="mb-3">
            <div className="d-flex flex-wrap gap-1">
              {beach.facilities.slice(0, 3).map((facility, index) => (
                <span key={index} className="badge bg-light text-secondary">
                  {facility}
                </span>
              ))}
            </div>
          </div>

          <div className="price-section mb-3 mt-auto">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <span className="text-decoration-line-through text-muted fs-6">
                  {beach.originalPrice} RON
                </span>
                <div className="text-primary fw-bold fs-4">
                  {beach.discountedPrice} RON
                  <small className="text-muted fs-6">/zi</small>
                </div>
              </div>
              <div className="text-success fw-bold">
                Economisești<br />
                {beach.originalPrice - beach.discountedPrice} RON
              </div>
            </div>
          </div>

          <Link 
            to={`/plaja/${beach.id}`} 
            className="btn btn-primary w-100"
          >
            <IconUmbrella size={18} className="me-2" />
            Rezervă Acum
          </Link>
        </div>
      </div>
    </div>
  );

  if (loading || offersLoading) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Se încarcă...</span>
          </div>
          <p className="mt-3">Se încarcă ofertele...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger text-center">
          <h4>Oops! Ceva nu a mers bine</h4>
          <p>{error}</p>
          <button className="btn btn-primary" onClick={loadAllBeaches}>
            Încearcă din nou
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      {/* Header cu timer */}
      <div className="row justify-content-center mb-5">
        <div className="col-lg-8 text-center">
          <div className="bg-gradient-primary text-white rounded-4 p-4 mb-4">
            <h1 className="display-4 fw-bold mb-3">
              <IconFlame className="me-3" size={48} />
              Oferte Last-Minute
            </h1>
            <p className="lead mb-4">
              Reduceri de până la 50% pentru rezervări! Ofertele se schimbă la fiecare oră.
            </p>
            
            <div className="d-flex justify-content-center gap-3">
              <div className="text-center">
                <div className="bg-white text-primary rounded-3 p-3 fw-bold fs-3">
                  {String(timeRemaining.hours).padStart(2, '0')}
                </div>
                <small>ore</small>
              </div>
              <div className="text-center">
                <div className="bg-white text-primary rounded-3 p-3 fw-bold fs-3">
                  {String(timeRemaining.minutes).padStart(2, '0')}
                </div>
                <small>minute</small>
              </div>
              <div className="text-center">
                <div className="bg-white text-primary rounded-3 p-3 fw-bold fs-3">
                  {String(timeRemaining.seconds).padStart(2, '0')}
                </div>
                <small>secunde</small>
              </div>
            </div>
            <p className="mt-3 mb-0"><small>până la următoarea schimbare de oferte</small></p>
          </div>
        </div>
      </div>

      {/* Grafic variația prețurilor pe săptămână - ÎNLOCUIT */}
      <div className="row mb-5">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-transparent border-0 pb-0">
              <h3 className="card-title mb-0">
                <IconCalendar className="me-2 text-primary" />
                Variația Prețurilor pe Săptămână
              </h3>
              <p className="text-muted mb-0">
                Planifică-ți vacanța și economisează! Prețurile sunt mai mici în timpul săptămânii.
              </p>
            </div>
            <div className="card-body">
              <WeeklyPriceChart data={weeklyPriceData} />
            </div>
          </div>
        </div>
      </div>

      {/* Grid cu oferte */}
      <div className="row">
        <div className="col-12 mb-4">
          <div className="d-flex align-items-center justify-content-between">
            <h2 className="mb-0">
              <IconTag className="me-2 text-primary" />
              {currentOffers.length} Oferte Disponibile Acum
            </h2>
            <div className="d-flex align-items-center text-muted">
              <IconClock size={18} className="me-2" />
              Actualizat în timp real
            </div>
          </div>
          <hr />
        </div>
      </div>

      {currentOffers.length > 0 ? (
        <div className="row">
          {currentOffers.map(beach => (
            <OfferCard key={beach.id} beach={beach} />
          ))}
        </div>
      ) : (
        <div className="text-center py-5">
          <h3>Nu sunt oferte disponibile momentan</h3>
          <p className="text-muted">Reveniți în curând pentru oferte noi!</p>
        </div>
      )}

      {/* Call to action */}
      <div className="row mt-5">
        <div className="col-12 text-center">
          <div className="bg-light rounded-4 p-4">
            <h3 className="mb-3">Nu ai găsit ce căutai?</h3>
            <p className="text-muted mb-4">
              Explorează toate plajele noastre și găsește locul perfect pentru tine!
            </p>
            <div className="d-flex gap-3 justify-content-center flex-wrap">
              <Link to="/plaje" className="btn btn-primary btn-lg">
                <IconBeach className="me-2" />
                Vezi Toate Plajele
              </Link>
              <Link to="/statiuni" className="btn btn-outline-primary btn-lg">
                <IconMapPin className="me-2" />
                Explorează Stațiunile
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stiluri CSS - COMBINATE */}
      <style jsx>{`
        .offer-card {
          transition: all 0.3s ease;
        }
        
        .offer-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 25px rgba(0,0,0,0.15) !important;
        }
        
        .pulse-animation {
          animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
          }
        }
        
        .bg-gradient-primary {
          background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
        }
        
        /* Stiluri pentru graficul săptămânal - ADĂUGATE */
        .weekly-chart {
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          border-radius: 12px;
          border: 1px solid #dee2e6;
        }
        
        .chart-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 1rem;
          padding: 2rem 1rem;
          background: white;
          border-radius: 8px;
          box-shadow: inset 0 1px 3px rgba(0,0,0,0.1);
        }
        
        .chart-column {
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
        }
        
        .price-display {
          height: 30px;
          display: flex;
          align-items: center;
        }
        
        .price-value {
          font-weight: bold;
          font-size: 14px;
          color: #495057;
          background: white;
          padding: 4px 8px;
          border-radius: 12px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .bar-container {
          height: 150px;
          width: 100%;
          display: flex;
          align-items: end;
          justify-content: center;
          position: relative;
        }
        
        .price-bar {
          width: 40px;
          border-radius: 6px 6px 0 0;
          position: relative;
          animation: growUp 0.8s ease forwards;
          transform-origin: bottom;
          transform: scaleY(0);
          display: flex;
          align-items: center;
          justify-content: center;
          animation-fill-mode: forwards;
        }
        
        .weekday-bar {
          background: linear-gradient(to top, #28a745, #20c997);
          box-shadow: 0 -2px 8px rgba(40, 167, 69, 0.3);
        }
        
        .weekend-bar {
          background: linear-gradient(to top, #ffc107, #fd7e14);
          box-shadow: 0 -2px 8px rgba(255, 193, 7, 0.4);
        }
        
        .weekend-indicator {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: 16px;
        }
        
        .day-label {
          margin-top: 12px;
          text-align: center;
        }
        
        .day-name {
          font-weight: bold;
          font-size: 13px;
          color: #495057;
        }
        
        .day-type {
          font-size: 11px;
          margin-top: 2px;
          padding: 2px 6px;
          border-radius: 8px;
          display: inline-block;
        }
        
        .day-type.weekday {
          background: #d4edda;
          color: #155724;
        }
        
        .day-type.weekend {
          background: #fff3cd;
          color: #856404;
        }
        
        .weekend-badge {
          position: absolute;
          top: -5px;
          right: -10px;
        }
        
        .weekend-badge .badge {
          font-size: 9px;
          padding: 3px 6px;
        }
        
        .chart-legend {
          border-top: 1px solid #dee2e6;
          padding-top: 1rem;
        }
        
        .legend-item {
          display: flex;
          align-items: center;
          margin-bottom: 8px;
          font-size: 14px;
        }
        
        .legend-color {
          width: 20px;
          height: 12px;
          border-radius: 2px;
          margin-right: 10px;
        }
        
        .weekday-color {
          background: linear-gradient(to right, #28a745, #20c997);
        }
        
        .weekend-color {
          background: linear-gradient(to right, #ffc107, #fd7e14);
        }
        
        .stat-item {
          padding: 0.5rem;
        }
        
        .stat-value {
          font-weight: bold;
          font-size: 14px;
          margin-bottom: 4px;
        }
        
        .stat-label {
          font-size: 11px;
          color: #6c757d;
        }
        
        @keyframes growUp {
          to {
            transform: scaleY(1);
          }
        }
        
        /* Responsive */
        @media (max-width: 768px) {
          .chart-grid {
            grid-template-columns: repeat(4, 1fr);
            gap: 0.5rem;
            padding: 1rem 0.5rem;
          }
          
          .price-bar {
            width: 30px;
          }
          
          .price-value {
            font-size: 12px;
            padding: 2px 6px;
          }
          
          .day-name {
            font-size: 11px;
          }
          
          .day-type {
            font-size: 9px;
          }
          
          .bar-container {
            height: 120px;
          }
        }
        
        @media (max-width: 576px) {
          .chart-grid {
            grid-template-columns: repeat(7, 1fr);
            gap: 4px;
          }
          
          .price-bar {
            width: 25px;
          }
          
          .price-value {
            font-size: 10px;
          }
        }
      `}</style>
    </div>
  );
};

export default Oferte;