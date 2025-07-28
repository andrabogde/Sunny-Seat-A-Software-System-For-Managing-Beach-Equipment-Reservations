import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
// Importă AuthContext din aplicația ta
import apiService from '../services/ApiService';

// import { AuthContext } from '../context/AuthContext';

const ManagerDashboard = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [dashboardStats, setDashboardStats] = useState({
    totalUsers: 0,
    totalReservations: 0,
    totalBeaches: 0,
    totalRevenue: 0,
    todayReservations: 0,
    activeEquipment: 0,
    userGrowth: 0,
    revenueGrowth: 0
  });
  const [recentReservations, setRecentReservations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();
  const location = useLocation();
  
  // Decomentează această linie când integrezi în aplicația ta
  // const { logout } = useContext(AuthContext);

  // API Service pentru dashboard
  const DashboardAPI = {
    // Obține statisticile principale
    getDashboardStats: async () => {
      try {
        const response = await apiService.getDashboardStats();

        return response;
      } catch (error) {
        console.error('Eroare la obținerea statisticilor:', error);
        throw error;
      }
    },

    // Obține rezervările recente
    getRecentReservations: async () => {
      try {
        const response = await apiService.getRecentReservations();

        return response;
      } catch (error) {
        console.error('Eroare la obținerea rezervărilor:', error);
        throw error;
      }
    },

    // Obține notificările de alertă
    getAlerts: async () => {
      try {
        const response = await apiService.getDashboardAlerts();

        return response;
      } catch (error) {
        console.error('Eroare la obținerea alertelor:', error);
        throw error;
      }
    }
  };


  const loadDashboardData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('📊 Încărcare date dashboard...');
      
      // Încarcă toate datele în paralel
      const [statsData, reservationsData] = await Promise.all([
        DashboardAPI.getDashboardStats(),
        DashboardAPI.getRecentReservations()
      ]);

      console.log('✅ Date încărcate:', { statsData, reservationsData });

      // Actualizează statisticile
      setDashboardStats({
        totalUsers: statsData.totalUsers || 0,
        totalReservations: statsData.totalReservations || 0,
        totalBeaches: statsData.totalBeaches || 0,
        totalRevenue: statsData.totalRevenue || 0,
        todayReservations: statsData.todayReservations || 0,
        activeEquipment: statsData.activeEquipment || 0,
        userGrowth: statsData.userGrowth || 0,
        revenueGrowth: statsData.revenueGrowth || 0
      });

      // Actualizează rezervările recente
      setRecentReservations(reservationsData.reservations || []);

    } catch (error) {
      console.error('❌ Eroare la încărcarea datelor:', error);
      setError(error.message);
      
      // Fallback la date mock în caz de eroare
      setDashboardStats({
        totalUsers: 1247,
        totalReservations: 856,
        totalBeaches: 59,
        totalRevenue: 45620,
        todayReservations: 34,
        activeEquipment: 1432,
        userGrowth: 12.5,
        revenueGrowth: 8.3
      });
      
      setRecentReservations([
        { 
          id: 'RZ001', 
          userName: 'Ion Popescu', 
          beachName: 'Plaja Mamaia Nord', 
          createdAt: '2025-05-24', 
          status: 'CONFIRMATA', 
          totalAmount: 150 
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };



  // Componente pentru iconuri simple cu SVG (păstrează codul existent)
  const Icon = ({ name, size = 18, className = "" }) => {
    const icons = {
      dashboard: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <rect x="3" y="3" width="7" height="7"></rect>
          <rect x="14" y="3" width="7" height="7"></rect>
          <rect x="14" y="14" width="7" height="7"></rect>
          <rect x="3" y="14" width="7" height="7"></rect>
        </svg>
      ),
      users: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
      ),
      beach: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <path d="M2 18h20"></path>
          <path d="M12 18V6"></path>
          <path d="M8 14l4-4 4 4"></path>
        </svg>
      ),
      money: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <path d="M12 1v22" />
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      ),
      umbrella: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <path d="M23 12a11.05 11.05 0 0 0-22 0zm-5 7a3 3 0 0 1-6 0v-7"></path>
        </svg>
      ),
      ticket: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <path d="M3 7v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2Z"></path>
          <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
        </svg>
      ),
      building: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"></path>
          <path d="M6 12H4a2 2 0 0 0-2 2v8h4"></path>
          <path d="M18 9h2a2 2 0 0 1 2 2v11h-4"></path>
          <path d="M10 6h4"></path>
          <path d="M10 10h4"></path>
          <path d="M10 14h4"></path>
          <path d="M10 18h4"></path>
        </svg>
      ),
      settings: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
          <circle cx="12" cy="12" r="3"></circle>
        </svg>
      ),
      chart: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <line x1="12" y1="20" x2="12" y2="10"></line>
          <line x1="18" y1="20" x2="18" y2="4"></line>
          <line x1="6" y1="20" x2="6" y2="16"></line>
        </svg>
      ),
      bell: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path>
          <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path>
        </svg>
      ),
      search: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <circle cx="11" cy="11" r="8"></circle>
          <path d="m21 21-4.35-4.35"></path>
        </svg>
      ),
      logout: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
          <polyline points="16,17 21,12 16,7"></polyline>
          <line x1="21" y1="12" x2="9" y2="12"></line>
        </svg>
      ),
      menu: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <line x1="4" y1="6" x2="20" y2="6"></line>
          <line x1="4" y1="12" x2="20" y2="12"></line>
          <line x1="4" y1="18" x2="16" y2="18"></line>
        </svg>
      ),
      x: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <path d="m18 6-12 12"></path>
          <path d="m6 6 12 12"></path>
        </svg>
      ),
      plus: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <path d="M5 12h14"></path>
          <path d="M12 5v14"></path>
        </svg>
      ),
      edit: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
          <path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4Z"></path>
        </svg>
      ),
      eye: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
          <circle cx="12" cy="12" r="3"></circle>
        </svg>
      ),
      trendingUp: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <polyline points="22,7 13.5,15.5 8.5,10.5 2,17"></polyline>
          <polyline points="16,7 22,7 22,13"></polyline>
        </svg>
      ),
      trendingDown: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <polyline points="22,17 13.5,8.5 8.5,13.5 2,7"></polyline>
          <polyline points="16,17 22,17 22,11"></polyline>
        </svg>
      ),
      alertTriangle: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path>
          <path d="M12 9v4"></path>
          <path d="m12 17 .01 0"></path>
        </svg>
      ),
      check: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <polyline points="20,6 9,17 4,12"></polyline>
        </svg>
      ),
      clock: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="12,6 12,12 16,14"></polyline>
        </svg>
      ),
      refresh: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path>
          <path d="M21 3v5h-5"></path>
          <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path>
          <path d="M3 21v-5h5"></path>
        </svg>
      )
    };
    
    return icons[name] || icons.dashboard;
  };

  const menuItems = [
    // { id: 'dashboard', label: 'Dashboard', icon: 'dashboard', link: '/manager/dashboard' },
    { id: 'beaches', label: 'Plaje', icon: 'beach', link: '/manager/plaje' },
    { id: 'reservations', label: 'Rezervări', icon: 'ticket', link: '/manager/rezervari' },
    { id: 'equipment', label: 'Echipamente', icon: 'umbrella', link: '/manager/echipamente' },
    { id: 'companies', label: 'Firme', icon: 'building', link: '/manager/firme' },
  ];

  // Funcția de logout corectată (păstrează codul existent)
  const handleLogout = async () => {
    try {
      console.log('🚪 Începere proces logout...');
      
      localStorage.removeItem('adminToken');
      localStorage.removeItem('authToken');
      localStorage.removeItem('userToken');
      localStorage.removeItem('userData');
      localStorage.removeItem('user');
      
      console.log('🗑️ Date șterse din localStorage');
      
      // if (logout) {
      //   await logout();
      //   console.log('🔓 Logout executat prin AuthContext');
      // }
      
      await new Promise(resolve => setTimeout(resolve, 100));
      
      console.log('🔄 Redirecționez către /login...');
      navigate('/login', { replace: true });
      
      setTimeout(() => {
        window.location.href = '/login';
      }, 200);
      
    } catch (error) {
      console.error('❌ Eroare la logout:', error);
      window.location.href = '/login';
    }
  };

  // Debug: verifică dacă navigate funcționează
  useEffect(() => {
    console.log('AdminDashboard montat, calea curentă:', location.pathname);
  }, [location.pathname]);

  // Formatare numere și monedă
  const formatNumber = (number) => {
    return new Intl.NumberFormat('ro-RO').format(number);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ro-RO', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ro-RO');
  };

  // Mapează statusurile la etichete în română
  const getStatusLabel = (status) => {
    const statusMap = {
      'CONFIRMATA': { label: 'Confirmată', class: 'bg-success' },
      'IN_ASTEPTARE': { label: 'În așteptare', class: 'bg-warning' },
      'ANULATA': { label: 'Anulată', class: 'bg-danger' },
      'EXPIRATA': { label: 'Expirată', class: 'bg-secondary' },
      'confirmed': { label: 'Confirmată', class: 'bg-success' },
      'pending': { label: 'În așteptare', class: 'bg-warning' },
      'cancelled': { label: 'Anulată', class: 'bg-danger' }
    };
    
    return statusMap[status] || { label: status, class: 'bg-secondary' };
  };

  const StatCard = ({ title, value, change, changeType, icon, color, isLoading = false }) => (
    <div className="bg-white rounded-lg shadow-sm border p-4" style={{ minHeight: '140px' }}>
      <div className="d-flex justify-content-between align-items-start h-100">
        <div className="d-flex flex-column justify-content-between h-100">
          <p className="text-muted small mb-1">{title}</p>
          {isLoading ? (
            <div className="placeholder-glow">
              <span className="placeholder col-8 rounded h3"></span>
            </div>
          ) : (
            <h3 className="fw-bold mb-2">{value}</h3>
          )}
          {change && !isLoading && (
            <div className={`d-flex align-items-center small ${changeType === 'up' ? 'text-success' : 'text-danger'}`}>
              <Icon name={changeType === 'up' ? 'trendingUp' : 'trendingDown'} size={16} className="me-1" />
              {Math.abs(change)}% față de luna trecută
            </div>
          )}
        </div>
        <div className={`p-3 rounded-circle bg-${color} bg-opacity-10`} style={{ flexShrink: 0 }}>
          <Icon name={icon} size={24} className={`text-${color}`} />
        </div>
      </div>
    </div>
  );

  const renderDashboardContent = () => (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold mb-0">Dashboard</h2>
        <div className="d-flex gap-2">
          <button 
            className="btn btn-outline-secondary"
            onClick={loadDashboardData}
            disabled={isLoading}
          >
            <Icon name="refresh" size={18} className={`me-2 ${isLoading ? 'fa-spin' : ''}`} />
            {isLoading ? 'Se încarcă...' : 'Actualizează'}
          </button>
          <button className="btn btn-primary">
            <Icon name="plus" size={18} className="me-2" />
            Acțiune rapidă
          </button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="alert alert-warning alert-dismissible fade show mb-4" role="alert">
          <Icon name="alertTriangle" size={16} className="me-2" />
          <strong>Atenție:</strong> {error}. Se afișează date mock.
          <button 
            type="button" 
            className="btn-close" 
            onClick={() => setError(null)}
          ></button>
        </div>
      )}

      {/* Stats Cards */}
      <div className="row g-4 mb-4">
        <div className="col-md-3">
          <StatCard 
            title="Rezervări Active" 
            value={isLoading ? '...' : formatNumber(dashboardStats.totalReservations)} 
            change={dashboardStats.revenueGrowth}
            changeType={dashboardStats.revenueGrowth >= 0 ? 'up' : 'down'}
            icon="ticket"
            color="success"
            isLoading={isLoading}
          />
        </div>
        <div className="col-md-3">
          <StatCard 
            title="Plaje Înregistrate" 
            value={isLoading ? '...' : formatNumber(dashboardStats.totalBeaches)} 
            icon="beach"
            color="info"
            isLoading={isLoading}
          />
        </div>
        <div className="col-md-3">
          <StatCard 
            title="Venit Total" 
            value={isLoading ? '...' : `${formatCurrency(dashboardStats.totalRevenue)} RON`} 
            change={dashboardStats.revenueGrowth}
            changeType={dashboardStats.revenueGrowth >= 0 ? 'up' : 'down'}
            icon="chart"
            color="warning"
            isLoading={isLoading}
          />
        </div>
      </div>

      <div className="row g-4">
        {/* Recent Reservations */}
        <div className="col-lg-8">
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-bold mb-0">Rezervări Recente</h5>
              <Link to="/admin/rezervari" className="btn btn-outline-primary btn-sm">
                Vezi toate
              </Link>
            </div>
            
            {isLoading ? (
              <div className="text-center py-4">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Se încarcă...</span>
                </div>
                <p className="text-muted mt-2">Se încarcă rezervările...</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Cod</th>
                      <th>Utilizator</th>
                      <th>Plaja</th>
                      <th>Data</th>
                      <th>Status</th>
                      <th>Sumă</th>
                      {/* <th>Acțiuni</th> */}
                    </tr>
                  </thead>
                  <tbody>
                    {recentReservations.length > 0 ? (
                      recentReservations.map(reservation => {
                        const statusInfo = getStatusLabel(reservation.status);
                        return (
                          <tr key={reservation.id}>
                            <td className="fw-bold">{reservation.id}</td>
                            <td>{reservation.userName || reservation.user}</td>
                            <td>{reservation.beachName || reservation.beach}</td>
                            <td>{formatDate(reservation.createdAt || reservation.date)}</td>
                            <td>
                              <span className={`badge ${statusInfo.class}`}>
                                {statusInfo.label}
                              </span>
                            </td>
                            <td>{formatCurrency(reservation.totalAmount || reservation.amount)} RON</td>
                            {/* <td>
                              <div className="btn-group btn-group-sm">
                                <button className="btn btn-outline-primary">
                                  <Icon name="eye" size={14} />
                                </button>
                                <button className="btn btn-outline-secondary">
                                  <Icon name="edit" size={14} />
                                </button>
                              </div>
                            </td> */}
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="7" className="text-center text-muted py-4">
                          Nu există rezervări recente
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="col-lg-4">
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <h5 className="fw-bold mb-3">Acțiuni Rapide</h5>
            <div className="d-grid gap-2">
              <Link to="/admin/plaje" className="btn btn-outline-primary d-flex align-items-center">
                <Icon name="plus" size={18} className="me-2" />
                Adaugă Plajă
              </Link>
              <Link to="/admin/firme" className="btn btn-outline-success d-flex align-items-center">
                <Icon name="plus" size={18} className="me-2" />
                Adaugă Firmă
              </Link>
              <Link to="/admin/setari" className="btn btn-outline-info d-flex align-items-center">
                <Icon name="settings" size={18} className="me-2" />
                Configurări Sistem
              </Link>
            </div>

            {/* Statistici rapide suplimentare */}
            <div className="mt-4 pt-3 border-top">
              <h6 className="fw-bold mb-3">Statistici Rapide</h6>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="text-muted small">Rezervări azi:</span>
                <span className="fw-bold text-primary">
                  {isLoading ? '...' : formatNumber(dashboardStats.todayReservations)}
                </span>
              </div>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="text-muted small">Echipamente active:</span>
                <span className="fw-bold text-success">
                  {isLoading ? '...' : formatNumber(dashboardStats.activeEquipment)}
                </span>
              </div>
              <div className="d-flex justify-content-between align-items-center">
                <span className="text-muted small">Ultima actualizare:</span>
                <span className="text-muted small">
                  {new Date().toLocaleTimeString('ro-RO', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </span>
              </div>
            </div>

            {/* Alerte și notificări */}
            <div className="mt-4 pt-3 border-top">
              <h6 className="fw-bold mb-3">
                <Icon name="bell" size={16} className="me-2" />
                Notificări
              </h6>
              
              {error && (
                <div className="alert alert-warning py-2 px-3 small">
                  <Icon name="alertTriangle" size={14} className="me-2" />
                  Conexiune la API limitată
                </div>
              )}
              
              <div className="alert alert-info py-2 px-3 small">
                <Icon name="clock" size={14} className="me-2" />
                Auto-refresh în 5 minute
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="d-flex vh-100 bg-light">
      {/* Sidebar */}
      <div 
        className={`bg-dark text-white transition-all ${sidebarOpen ? '' : 'd-none'}`}
        style={{ 
          width: sidebarOpen ? '250px' : '0px',
          height: '100vh',
          transition: 'width 0.3s ease-in-out',
          overflow: 'hidden',
          position: 'relative'
        }}
      >
        <div className="p-3 border-bottom border-secondary">
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center">
              <Icon name="beach" size={32} className="text-primary me-2" />
              <span className="fw-bold">SunnySeat Admin</span>
            </div>
            <button 
              className="btn btn-link text-white p-0"
              onClick={() => setSidebarOpen(false)}
              title="Închide meniul"
            >
              <Icon name="x" size={20} />
            </button>
          </div>
        </div>
        
        <nav className="p-3">
          {menuItems.map(item => (
            <Link
              key={item.id}
              to={item.link}
              className={`d-block w-100 text-decoration-none mb-2 ${
                location.pathname === item.link ? 'active-menu-item' : 'menu-item'
              }`}
              style={{
                color: location.pathname === item.link ? '#fff' : 'rgba(255, 255, 255, 0.8)',
                backgroundColor: location.pathname === item.link ? '#0d6efd' : 'transparent',
                borderRadius: '8px',
                padding: '12px 16px',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                textAlign: 'left'
              }}
              onMouseEnter={(e) => {
                if (location.pathname !== item.link) {
                  e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                  e.target.style.color = '#fff';
                }
              }}
              onMouseLeave={(e) => {
                if (location.pathname !== item.link) {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.color = 'rgba(255, 255, 255, 0.8)';
                }
              }}
            >
              <Icon name={item.icon} size={18} className="me-3" style={{ flexShrink: 0 }} />
              <span style={{ 
                fontSize: '14px', 
                fontWeight: '500',
                textAlign: 'left',
                flex: 1
              }}>
                {item.label}
              </span>
              {item.badge && item.badge > 0 && (
                <span 
                  className="badge bg-warning text-dark ms-2"
                  style={{ 
                    fontSize: '0.7rem',
                    fontWeight: '600',
                    minWidth: '20px',
                    height: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '10px'
                  }}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          ))}
        </nav>

        <div className="position-absolute bottom-0 w-100 p-3 border-top border-secondary">
          <div className="d-flex align-items-center mb-3 p-2 rounded" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>
            <div className="bg-primary rounded-circle p-2 me-3" style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="users" size={18} className="text-white" />
            </div>
            <div className="flex-grow-1">
              <div className="text-white fw-bold" style={{ fontSize: '14px' }}>Manager</div>
            </div>
          </div>
          <button 
            className="btn btn-outline-light btn-sm w-100 d-flex align-items-center justify-content-center"
            style={{ 
              borderRadius: '8px',
              padding: '10px',
              fontSize: '14px',
              fontWeight: '500'
            }}
            onClick={handleLogout}
          >
            <Icon name="logout" size={16} className="me-2" />
            Deconectare
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow-1 d-flex flex-column" style={{ width: sidebarOpen ? 'calc(100% - 250px)' : '100%', transition: 'width 0.3s ease-in-out' }}>
        {/* Header */}
        <header className="bg-white border-bottom p-3">
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center">
              {!sidebarOpen && (
                <button 
                  className="btn btn-link me-3 p-0"
                  onClick={() => setSidebarOpen(true)}
                  title="Deschide meniul"
                >
                  <Icon name="menu" size={24} />
                </button>
              )}
              <div className="input-group" style={{ maxWidth: '300px' }}>
                <span className="input-group-text bg-light border-end-0">
                  <Icon name="search" size={18} className="text-muted" />
                </span>
                <input
                  type="text"
                  className="form-control border-start-0 bg-light"
                  placeholder="Caută..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="d-flex align-items-center">
              {/* Status indicator */}
              <div className="me-3">
                {/* <span className={`badge ${isLoading ? 'bg-warning' : error ? 'bg-danger' : 'bg-success'}`}>
                  {isLoading ? 'Se încarcă...' : error ? 'Eroare conexiune' : 'Online'}
                </span> */}
              </div>
              
              <div className="d-flex align-items-center">
                <div className="me-2 text-end">
                  <small className="d-block fw-bold">Manager</small>
                  {/* <small className="text-muted">
                    {isLoading ? 'Verificare status...' : 'Activ acum'}
                  </small> */}
                </div>
                <div className="bg-primary rounded-circle p-2">
                  <Icon name="users" size={20} className="text-white" />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-grow-1 p-4 overflow-auto">
          {children }
        </main>
      </div>
    </div>
  );
};

export default ManagerDashboard;