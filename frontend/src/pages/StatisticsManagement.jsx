import React, { useState, useEffect } from 'react';
import apiService from '../services/ApiService';

const StatisticsManagement = () => {
  const [statisticsData, setStatisticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedView, setSelectedView] = useState('overview');
  const [error, setError] = useState(null);
  const [debugMode, setDebugMode] = useState(false);
  const [useTestData, setUseTestData] = useState(false);


  const [beachPerformanceData, setBeachPerformanceData] = useState([]);
const [isLoadingBeaches, setIsLoadingBeaches] = useState(false);

const [topActiveClientsData, setTopActiveClientsData] = useState([]);
const [inactiveClientsData, setInactiveClientsData] = useState([]);
const [isLoadingClients, setIsLoadingClients] = useState(false);

const [equipmentStatisticsData, setEquipmentStatisticsData] = useState([]);
const [isLoadingEquipment, setIsLoadingEquipment] = useState(false);

const [overviewData, setOverviewData] = useState({
  userStatistics: null,
  reservationStatistics: null,
  seasonalAnalysis: [],
  resortDistribution: []
});
const [isLoadingOverview, setIsLoadingOverview] = useState(false);


const fetchUserStatistics = async () => {
  try {
    return await apiService.getStatisticsUtilizatori();
  } catch (error) {
    console.error('Eroare:', error);
    return null;
  }
};

const fetchReservationStatistics = async () => {
  try {
    return await apiService.getStatisticsReservations();
  } catch (error) {
    console.error('Eroare:', error);
    return null;
  }
};

const fetchSeasonalAnalysis = async () => {
  try {
   return await apiService.getStatisticsSeasonal();
  } catch (error) {
    console.error('Eroare:', error);
    return [];
  }
};

const fetchResortDistribution = async () => {
  try {
    return await apiService.getStatisticsResorts();
  } catch (error) {
    console.error('Eroare:', error);
    return [];
  }
};

// 3. Funcție principală care încarcă toate datele
const fetchOverviewData = async () => {
  setIsLoadingOverview(true);
  try {
    const [userStats, reservationStats, seasonalData, resortData] = await Promise.all([
      fetchUserStatistics(),
      fetchReservationStatistics(),
      fetchSeasonalAnalysis(),
      fetchResortDistribution()
    ]);

    setOverviewData({
      userStatistics: userStats,
      reservationStatistics: reservationStats,
      seasonalAnalysis: seasonalData,
      resortDistribution: resortData
    });
  } finally {
    setIsLoadingOverview(false);
  }
};



const fetchEquipmentStatistics = async () => {
  setIsLoadingEquipment(true);
  try {
    const data = await apiService.getStatisticsEchipamente();
    setEquipmentStatisticsData(data||[]);
  } catch (error) {
    console.error('Eroare:', error);
    setEquipmentStatisticsData([]);
  } finally {
    setIsLoadingEquipment(false);
  }
};

// 2. Funcție pentru a încărca datele de performanță plaje
const loadBeachPerformance = async () => {
  setIsLoadingBeaches(true);
  try {
    const data = await apiService.getLastXPlajaPerformances();

    console.log(data);
    
    setBeachPerformanceData(data||[]);
  } catch (error) {
    console.error('Eroare:', error);
    setBeachPerformanceData([]);
  } finally {
    setIsLoadingBeaches(false);
  }
};


const fetchTopActiveClients = async () => {
  try {
    const data = await apiService.getTopClients()
    setTopActiveClientsData(data||[]);
  } catch (error) {
    console.error('Eroare:', error);
    setTopActiveClientsData([]);
  }
};

// 3. Funcție pentru a încărca datele de clienți inactivi
const fetchInactiveClients = async () => {
  try {
    const data = await apiService.getInactiveClients();


    setInactiveClientsData(data||[]);
  } catch (error) {
    console.error('Eroare:', error);
    setInactiveClientsData([]);
  }
};

// 4. Funcție care încarcă ambele tipuri de date
const loadClientsData = async () => {
  setIsLoadingClients(true);
  try {
    await Promise.all([
      fetchTopActiveClients(),
      fetchInactiveClients()
    ]);
  } finally {
    setIsLoadingClients(false);
  }
};

// Adaugă această funcție în componenta ta
const formatDateTime = (dateString) => {
  if (!dateString) return '-';
  
  try {
    const date = new Date(dateString);
    
    // Verifică dacă data este validă
    if (isNaN(date.getTime())) return dateString;
    
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    
    return `${day}.${month}.${year} ${hours}:${minutes}:${seconds}`;
  } catch (error) {
    console.error('Eroare la formatarea datei:', error);
    return dateString;
  }
};



  const Icon = ({ name, size = 18, className = "" }) => {
    const icons = {
      chart: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <line x1="12" y1="20" x2="12" y2="10"></line>
          <line x1="18" y1="20" x2="18" y2="4"></line>
          <line x1="6" y1="20" x2="6" y2="16"></line>
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
      users: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
      ),
      ticket: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <path d="M3 7v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2Z"></path>
          <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
        </svg>
      ),
      beach: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <path d="M2 18h20"></path>
          <path d="M12 18V6"></path>
          <path d="M8 14l4-4 4 4"></path>
        </svg>
      ),
      creditCard: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
          <line x1="1" y1="10" x2="23" y2="10"></line>
        </svg>
      ),
      download: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
          <polyline points="7,10 12,15 17,10"></polyline>
          <line x1="12" y1="15" x2="12" y2="3"></line>
        </svg>
      ),
      refresh: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <polyline points="23,4 23,10 17,10"></polyline>
          <polyline points="1,20 1,14 7,14"></polyline>
          <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"></path>
        </svg>
      ),
      star: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"></polygon>
        </svg>
      ),
      target: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <circle cx="12" cy="12" r="10"></circle>
          <circle cx="12" cy="12" r="6"></circle>
          <circle cx="12" cy="12" r="2"></circle>
        </svg>
      ),
      alert: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
          <line x1="12" y1="9" x2="12" y2="13"></line>
          <line x1="12" y1="17" x2="12.01" y2="17"></line>
        </svg>
      )
    };
    
    return icons[name] || icons.chart;
  };

  // Service pentru apelarea API-ului REAL
  const statisticsService = {
    // Configurare API
    BASE_URL: 'http://localhost:8080/api/admin/statistics', // Schimbă cu URL-ul tău
    
    // Helper pentru găsirea token-ului din diferite locații
    getAuthToken: () => {
      // Încearcă să găsești token-ul din diferite locații
      const possibleTokenKeys = [
        'token',
        'authToken', 
        'accessToken',
        'jwt',
        'bearerToken',
        'auth_token',
        'access_token'
      ];
      
      // Caută în localStorage
      for (const key of possibleTokenKeys) {
        const token = localStorage.getItem(key);
        if (token) {
          console.log(`Token găsit în localStorage cu cheia: ${key}`);
          return token;
        }
      }
      
      // Caută în sessionStorage
      for (const key of possibleTokenKeys) {
        const token = sessionStorage.getItem(key);
        if (token) {
          console.log(`Token găsit în sessionStorage cu cheia: ${key}`);
          return token;
        }
      }
      
      console.warn('Nu s-a găsit niciun token de autentificare');
      return null;
    },
    
    // Helper pentru request-uri cu autentificare
    makeRequest: async (endpoint) => {
      const token = statisticsService.getAuthToken();
      
      console.log(`Încercare conexiune la: ${statisticsService.BASE_URL}${endpoint}`);
      console.log(`Token prezent: ${token ? 'Da' : 'Nu'}`);
      
      const headers = {
        'Content-Type': 'application/json',
      };
      
      // Adaugă header-ul de autorizare doar dacă există token
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      try {
        const response = await fetch(`${statisticsService.BASE_URL}${endpoint}`, {
          method: 'GET',
          headers: headers,
        });

        console.log(`Răspuns primit: ${response.status} ${response.statusText}`);

        if (!response.ok) {
          if (response.status === 401) {
            // Încearcă să obții mai multe detalii despre eroare
            let errorMessage = 'Nu ești autentificat.';
            try {
              const errorData = await response.text();
              if (errorData) {
                errorMessage += ` Detalii: ${errorData}`;
              }
            } catch (e) {
              // Ignore parsing errors
            }
            
            throw new Error(errorMessage + ' Te rog să te conectezi din nou.');
          } else if (response.status === 403) {
            throw new Error('Nu ai permisiuni de admin pentru a accesa aceste statistici.');
          } else if (response.status === 404) {
            throw new Error('Endpoint-ul de statistici nu a fost găsit. Verifică că backend-ul rulează.');
          } else if (response.status >= 500) {
            throw new Error(`Eroare server: ${response.status}. Backend-ul poate avea probleme.`);
          } else {
            throw new Error(`Eroare HTTP: ${response.status} - ${response.statusText}`);
          }
        }

        return response.json();
      } catch (fetchError) {
        if (fetchError.name === 'TypeError' && fetchError.message.includes('fetch')) {
          throw new Error('Nu se poate conecta la server. Verifică că backend-ul rulează pe ' + statisticsService.BASE_URL);
        }
        throw fetchError; // Re-throw alte erori
      }
    },

    // Metodă pentru testarea conexiunii fără autentificare
    testConnection: async () => {
      try {
        console.log('Testez conexiunea la backend...');
        const response = await fetch(statisticsService.BASE_URL.replace('/statistics', '/health'), {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (response.ok) {
          console.log('✅ Backend-ul răspunde');
          return true;
        } else {
          console.log(`❌ Backend răspunde cu status: ${response.status}`);
          return false;
        }
      } catch (error) {
        console.log('❌ Nu se poate conecta la backend:', error.message);
        return false;
      }
    },

    // Obține toate statisticile dintr-o dată
    getCompleteStatistics: async () => {
      return await statisticsService.makeRequest('/complete');
    },

    // Metodă de fallback pentru testare fără autentificare (doar pentru development)
    getTestStatistics: async () => {
      console.log('🧪 Folosind date de test pentru development...');
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            userStatistics: {
              totalUtilizatori: 2847,
              utilizatoriNoiLunaAceasta: 156,
              utilizatoriNoiLunaTrecuta: 134,
              rataCrestere: 16.4
            },
            reservationStatistics: {
              rezervariLunaAceasta: 1356,
              rezervariLunaTrecuta: 1247,
              venitLunaAceasta: 145680.50,
              rataCrestereRezervari: 8.7
            },
            topActiveClients: [
              { numeClient: 'Maria Popescu', email: 'maria.p@email.com', numarRezervari: 23, totalCheltuit: 1950.0, ultimaRezervare: '2025-06-20' },
              { numeClient: 'Ion Marinescu', email: 'ion.m@email.com', numarRezervari: 19, totalCheltuit: 1620.0, ultimaRezervare: '2025-06-19' },
              { numeClient: 'Ana Georgescu', email: 'ana.g@email.com', numarRezervari: 17, totalCheltuit: 1445.0, ultimaRezervare: '2025-06-18' },
              { numeClient: 'Mihai Popescu', email: 'mihai.p@email.com', numarRezervari: 15, totalCheltuit: 1275.0, ultimaRezervare: '2025-06-17' },
              { numeClient: 'Elena Stoica', email: 'elena.s@email.com', numarRezervari: 14, totalCheltuit: 1190.0, ultimaRezervare: '2025-06-16' }
            ],
            inactiveClients: [
              { numeClient: 'Gheorghe Popa', email: 'gheorghe.p@email.com', ultimaRezervare: '2024-08-15', zileDeLaUltimaRezervare: 311 },
              { numeClient: 'Carmen Vladescu', email: 'carmen.v@email.com', ultimaRezervare: '2024-09-20', zileDeLaUltimaRezervare: 275 },
              { numeClient: 'Radu Niculescu', email: 'radu.n@email.com', ultimaRezervare: '2024-10-05', zileDeLaUltimaRezervare: 260 }
            ],
            beachPerformance: [
              { numePlaja: 'Plaja Mamaia Nord', statiune: 'Mamaia', numarRezervari: 342, venitTotal: 45680.0, pretMediuRezervare: 133.5 },
              { numePlaja: 'Plaja Eforie Sud Central', statiune: 'Eforie Sud', numarRezervari: 298, venitTotal: 38740.0, pretMediuRezervare: 130.0 },
              { numePlaja: 'Plaja Costinești Beach', statiune: 'Costinești', numarRezervari: 267, venitTotal: 32040.0, pretMediuRezervare: 120.0 },
              { numePlaja: 'Plaja Vama Veche Wild', statiune: 'Vama Veche', numarRezervari: 189, venitTotal: 24570.0, pretMediuRezervare: 130.0 },
              { numePlaja: 'Plaja Neptun Paradise', statiune: 'Neptun', numarRezervari: 151, venitTotal: 19650.0, pretMediuRezervare: 130.1 }
            ],
            equipmentStatistics: [
              { tipEchipament: 'Sezlong', numarTotalEchipamente: 1234, numarRezervari: 967, venitGenerat: 67890.0, rataUtilizare: 78.5 },
              // { tipEchipament: 'Umbrela', numarTotalEchipamente: 856, numarRezervari: 704, venitGenerat: 45670.0, rataUtilizare: 82.3 },
              { tipEchipament: 'Baldachin', numarTotalEchipamente: 456, numarRezervari: 300, venitGenerat: 23450.0, rataUtilizare: 65.8 },
              // { tipEchipament: 'Loc Gol', numarTotalEchipamente: 301, numarRezervari: 136, venitGenerat: 8770.0, rataUtilizare: 45.2 }
            ],
            seasonalAnalysis: [
              { luna: '2024-07', numarRezervari: 89, venitLunar: 6200.0 },
              { luna: '2024-08', numarRezervari: 134, venitLunar: 8900.0 },
              { luna: '2024-09', numarRezervari: 78, venitLunar: 5400.0 },
              { luna: '2024-10', numarRezervari: 45, venitLunar: 3200.0 },
              { luna: '2024-11', numarRezervari: 23, venitLunar: 1800.0 },
              { luna: '2024-12', numarRezervari: 34, venitLunar: 2500.0 },
              { luna: '2025-01', numarRezervari: 67, venitLunar: 4800.0 },
              { luna: '2025-02', numarRezervari: 89, venitLunar: 6500.0 },
              { luna: '2025-03', numarRezervari: 156, venitLunar: 11200.0 },
              { luna: '2025-04', numarRezervari: 234, venitLunar: 17800.0 },
              { luna: '2025-05', numarRezervari: 298, venitLunar: 23400.0 },
              { luna: '2025-06', numarRezervari: 367, venitLunar: 28900.0 }
            ],
            resortDistribution: [
              { statiune: 'Mamaia', numarPlaje: 12, numarRezervari: 1456, venitTotal: 189450.0 },
              { statiune: 'Eforie Sud', numarPlaje: 8, numarRezervari: 987, venitTotal: 123670.0 },
              { statiune: 'Costinești', numarPlaje: 7, numarRezervari: 756, venitTotal: 98450.0 },
              { statiune: 'Vama Veche', numarPlaje: 6, numarRezervari: 543, venitTotal: 67890.0 },
              { statiune: 'Neptun', numarPlaje: 5, numarRezervari: 432, venitTotal: 54230.0 },
              { statiune: 'Olimp', numarPlaje: 4, numarRezervari: 298, venitTotal: 38760.0 },
              { statiune: 'Jupiter', numarPlaje: 3, numarRezervari: 234, venitTotal: 29870.0 }
            ]
          });
        }, 500);
      });
    },

    // Metode individuale (opțional - dacă vrei să încarci separat)
    getUserStatistics: async () => {
      return await statisticsService.makeRequest('/users');
    },

    getReservationStatistics: async () => {
      return await statisticsService.makeRequest('/reservations');
    },

    getTopActiveClients: async (limit = 10) => {
      return await apiService.getTopClients();
    },

    getInactiveClients: async (limit = 10) => {
      return await statisticsService.makeRequest(`/clients/inactive?limit=${limit}`);
    },

    getBeachPerformance: async (limit = 10) => {
      return await statisticsService.makeRequest(`/beaches/performance?limit=${limit}`);
    },

    getEquipmentStatistics: async () => {
      return await statisticsService.makeRequest('/equipment');
    },

    getSeasonalAnalysis: async () => {
      return await statisticsService.makeRequest('/seasonal');
    },

    getResortDistribution: async () => {
      return await statisticsService.makeRequest('/resorts');
    }
  };

  useEffect(() => {
    loadStatistics();
  }, []);

  useEffect(() => {
    if (selectedView === 'beaches') {
      loadBeachPerformance();
    }
    else if (selectedView === 'clients') {
      loadClientsData();
    }
   else if (selectedView === 'equipment') {
      fetchEquipmentStatistics();
    }
    else  if (selectedView === 'overview') {
      fetchOverviewData();
    }
  }, [selectedView]);

  const loadStatistics = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Dacă suntem în modul test, folosește date simulate
      if (useTestData) {
        const data = await statisticsService.getTestStatistics();
        setStatisticsData(data);
        return;
      }
      
      // Încearcă să încarci datele reale
      const data = await statisticsService.getCompleteStatistics();
      setStatisticsData(data);
      
    } catch (err) {
      console.error('Eroare la încărcarea statisticilor:', err);
      setError(err.message);
      
      // Oferă opțiunea de a folosi date de test în caz de eroare
      if (err.message.includes('Nu ești autentificat') || err.message.includes('Nu se poate conecta')) {
        setUseTestData(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleTestMode = async () => {
    setUseTestData(!useTestData);
    // Reîncarcă datele cu noul mod
    await loadStatistics();
  };

  // Helper pentru formatarea numerelor
  const formatNumber = (number) => {
    if (number == null || number === undefined) return '0';
    return Number(number).toLocaleString('ro-RO');
  };

  // Helper pentru formatarea valorilor monetare
  const formatCurrency = (amount) => {
    if (amount == null || amount === undefined) return '0';
    return Number(amount).toLocaleString('ro-RO', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    });
  };

  // Helper pentru formatarea procentelor
  const formatPercentage = (percentage) => {
    if (percentage == null || percentage === undefined) return '0';
    return Number(percentage).toFixed(1);
  };

  const StatCard = ({ title, value, change, changeType, icon, color, suffix = "", description = "" }) => (
    <div className="bg-white rounded-lg shadow-sm border p-4 h-100">
      <div className="d-flex justify-content-between align-items-start">
        <div className="flex-grow-1">
          <p className="text-muted small mb-1">{title}</p>
          <h3 className="fw-bold mb-2">{value}{suffix}</h3>
          {description && <p className="text-muted small mb-2">{description}</p>}
          {change && change !== 0 && (
            <div className={`d-flex align-items-center small ${changeType === 'up' ? 'text-success' : 'text-danger'}`}>
              <Icon name={changeType === 'up' ? 'trendingUp' : 'trendingDown'} size={16} className="me-1" />
              {changeType === 'up' ? '+' : ''}{formatPercentage(change)}% față de luna anterioară
            </div>
          )}
        </div>
        <div className={`p-3 rounded-circle bg-${color} bg-opacity-10`}>
          <Icon name={icon} size={24} className={`text-${color}`} />
        </div>
      </div>
    </div>
  );

  const ChartComponent = ({ data, dataKey, height = '200px', color = 'primary', title = '', showValues = true, chartType = 'bar' }) => {
    if (!data || data.length === 0) {
      return (
        <div className="d-flex align-items-center justify-content-center border rounded" style={{ height }}>
          <div className="text-center">
            <Icon name="chart" size={32} className="text-muted mb-2" />
            <p className="text-muted mb-0">Nu sunt date disponibile pentru grafic</p>
            <small className="text-muted">Conectează-te la backend pentru date reale</small>
          </div>
        </div>
      );
    }

    // Afișează un mesaj dacă sunt prea puține date
    if (data.length === 1) {
      return (
        <div className="border rounded p-4" style={{ height }}>
          <div className="text-center mb-3">
            {title && <h6 className="fw-bold text-muted">{title}</h6>}
            <div className="alert alert-info">
              <Icon name="chart" size={24} className="me-2" />
              <strong>Un singur punct de date</strong>
              <p className="mb-0 mt-2">
                {data[0].luna || data[0].tipEchipament || data[0].statiune}: <strong>
                  {dataKey === 'venitLunar' || dataKey === 'venitTotal' || dataKey === 'venitGenerat' ? 
                    `${formatCurrency(data[0][dataKey])} RON` : 
                    formatNumber(data[0][dataKey])
                  }
                </strong>
              </p>
              {/* <small className="text-muted">
                Pentru o analiză mai completă, conectează-te la backend-ul cu date reale.
              </small> */}
            </div>
          </div>
        </div>
      );
    }

    const maxValue = Math.max(...data.map(item => Number(item[dataKey]) || 0));
    const minValue = Math.min(...data.map(item => Number(item[dataKey]) || 0));
    
    // Calculează înălțimea efectivă pentru bare
    const chartAreaHeight = parseInt(height) - 60; // Lasă spațiu pentru labels și valori
    
    return (
      <div className="position-relative">
        {title && (
          <div className="text-center mb-3">
            <h6 className="fw-bold text-muted">{title}</h6>
          </div>
        )}
        
        {/* Grid lines pentru referință */}
        <div className="position-relative border rounded p-3" style={{ height, backgroundColor: '#fafafa' }}>
          {/* Y-axis labels */}
          <div className="position-absolute" style={{ left: '5px', top: '10px', bottom: '40px', width: '50px' }}>
            <div className="d-flex flex-column justify-content-between h-100 text-end">
              <small className="text-muted" style={{ fontSize: '0.7rem' }}>
                {dataKey.includes('venit') ? `${formatCurrency(maxValue)}` : formatNumber(maxValue)}
              </small>
              <small className="text-muted" style={{ fontSize: '0.7rem' }}>
                {dataKey.includes('venit') ? `${formatCurrency(Math.round(maxValue * 0.75))}` : formatNumber(Math.round(maxValue * 0.75))}
              </small>
              <small className="text-muted" style={{ fontSize: '0.7rem' }}>
                {dataKey.includes('venit') ? `${formatCurrency(Math.round(maxValue * 0.5))}` : formatNumber(Math.round(maxValue * 0.5))}
              </small>
              <small className="text-muted" style={{ fontSize: '0.7rem' }}>
                {dataKey.includes('venit') ? `${formatCurrency(Math.round(maxValue * 0.25))}` : formatNumber(Math.round(maxValue * 0.25))}
              </small>
              <small className="text-muted" style={{ fontSize: '0.7rem' }}>0</small>
            </div>
          </div>
          
          {/* Grid lines horizontale */}
          <div className="position-absolute" style={{ left: '60px', right: '10px', top: '10px', bottom: '40px' }}>
            {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => (
              <div 
                key={index}
                className="position-absolute border-top"
                style={{ 
                  top: `${(1 - ratio) * 100}%`, 
                  left: 0, 
                  right: 0,
                  borderColor: '#e9ecef',
                  borderWidth: ratio === 0 ? '2px' : '1px'
                }}
              ></div>
            ))}
          </div>
          
          {/* Chart bars */}
          <div 
            className="d-flex align-items-end justify-content-between position-absolute" 
            style={{ 
              left: '60px', 
              right: '10px', 
              top: '10px', 
              bottom: '40px',
              gap: data.length > 8 ? '2px' : '4px'
            }}
          >
            {data.map((item, index) => {
              const value = Number(item[dataKey]) || 0;
              const heightPercentage = maxValue > 0 ? (value / maxValue) * 100 : 0;
              const barHeight = (heightPercentage / 100) * chartAreaHeight;
              
              return (
                <div key={index} className="d-flex flex-column align-items-center position-relative" style={{ flex: 1 }}>
                  {/* Valoarea de deasupra barei */}
                  {showValues && value > 0 && (
                    <div 
                      className="position-absolute text-center"
                      style={{ 
                        bottom: `${barHeight + 5}px`,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        fontSize: data.length > 8 ? '0.65rem' : '0.75rem',
                        fontWeight: '600',
                        color: '#495057',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {dataKey === 'venitLunar' || dataKey === 'venitTotal' || dataKey === 'venitGenerat' ? 
                        `${formatCurrency(value)}` : 
                        formatNumber(value)
                      }
                    </div>
                  )}
                  
                  {/* Bara principală */}
                  <div 
                    className={`rounded-top position-relative overflow-hidden`}
                    style={{ 
                      height: `${Math.max(barHeight, 3)}px`, 
                      width: '100%',
                      background: `linear-gradient(to top, var(--bs-${color}), var(--bs-${color}-rgb, 13, 110, 253))`,
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer'
                    }}
                    title={`${item.luna || item.tipEchipament || item.statiune}: ${
                      dataKey.includes('venit') ? 
                        `${formatCurrency(value)} RON` : 
                        formatNumber(value)
                    }`}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.05)';
                      e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                    }}
                  >
                    {/* Efect de highlight pe bară */}
                    <div 
                      className="position-absolute top-0 start-0 w-100"
                      style={{
                        height: '30%',
                        background: 'linear-gradient(to bottom, rgba(255,255,255,0.3), transparent)'
                      }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* X-axis labels */}
          <div 
            className="d-flex justify-content-between position-absolute"
            style={{ 
              left: '60px', 
              right: '10px', 
              bottom: '5px',
              gap: data.length > 8 ? '2px' : '4px'
            }}
          >
            {data.map((item, index) => (
              <div key={index} className="text-center" style={{ flex: 1 }}>
                <small className="text-muted fw-semibold" style={{ fontSize: data.length > 8 ? '0.6rem' : '0.7rem' }}>
                  {item.luna ? item.luna.substring(5) : 
                   item.tipEchipament || 
                   item.statiune ||
                   item.status ||
                   `Item ${index + 1}`}
                </small>
              </div>
            ))}
          </div>
        </div>
        
        {/* Legendă și informații suplimentare */}
        <div className="d-flex justify-content-between align-items-center mt-2">
          <div className="d-flex align-items-center">
            <div 
              className={`rounded me-2`}
              style={{ 
                width: '12px', 
                height: '12px', 
                backgroundColor: `var(--bs-${color})` 
              }}
            ></div>
            <small className="text-muted">
              {dataKey === 'numarRezervari' ? 'Număr rezervări' :
               dataKey === 'venitLunar' ? 'Venit lunar (RON)' :
               dataKey === 'venitTotal' ? 'Venit total (RON)' :
               dataKey === 'rataUtilizare' ? 'Rata utilizare (%)' :
               'Valori'}
            </small>
          </div>
          
          <div className="d-flex gap-3">
            <small className="text-muted">
              <span className="fw-semibold">Max:</span> {dataKey.includes('venit') ? formatCurrency(maxValue) : formatNumber(maxValue)}
            </small>
            <small className="text-muted">
              <span className="fw-semibold">Min:</span> {dataKey.includes('venit') ? formatCurrency(minValue) : formatNumber(minValue)}
            </small>
            <small className="text-muted">
              <span className="fw-semibold">Media:</span> {
                dataKey.includes('venit') ? 
                  formatCurrency(Math.round(data.reduce((sum, item) => sum + (Number(item[dataKey]) || 0), 0) / data.length)) :
                  formatNumber(Math.round(data.reduce((sum, item) => sum + (Number(item[dataKey]) || 0), 0) / data.length))
              }
            </small>
          </div>
        </div>
      </div>
    );
  };         

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-muted">Se încarcă statisticile din baza de date...</p>
          <small className="text-muted">Conectare la {statisticsService.BASE_URL}</small>
        </div>
      </div>
    );
  }

  // if (error) {
  //   return (
  //     <div className="container mt-4">
  //       <div className="alert alert-danger d-flex align-items-start" role="alert">
  //         <Icon name="alert" size={20} className="me-2 mt-1" />
  //         <div className="flex-grow-1">
  //           <h5 className="alert-heading">Eroare de Conectare</h5>
  //           <p className="mb-2"><strong>Detalii:</strong> {error}</p>
            
  //           <div className="mb-3">
  //             <h6>🔧 Soluții posibile:</h6>
  //             <ul className="list-unstyled">
  //               <li>• Verifică că backend-ul Spring Boot rulează pe <code>{statisticsService.BASE_URL}</code></li>
  //               <li>• Verifică că ești autentificat în aplicație</li>
  //               <li>• Verifică că rolul tău este ADMIN</li>
  //               <li>• Verifică că CORS este configurat corect în backend</li>
  //             </ul>
  //           </div>

  //           <div className="d-flex gap-2 flex-wrap">
  //             <button className="btn btn-outline-danger btn-sm" onClick={loadStatistics}>
  //               <Icon name="refresh" size={16} className="me-1" />
  //               Încearcă din nou
  //             </button>
              
  //             <button 
  //               className="btn btn-outline-warning btn-sm" 
  //               onClick={toggleTestMode}
  //             >
  //               📊 Folosește date de test
  //             </button>
              
  //             <button 
  //               className="btn btn-outline-info btn-sm" 
  //               onClick={() => setDebugMode(!debugMode)}
  //             >
  //               🔍 {debugMode ? 'Ascunde' : 'Arată'} Debug Info
  //             </button>
  //           </div>

  //           {debugMode && (
  //             <div className="mt-3 p-3 bg-light rounded">
  //               <h6>🔧 Informații Debug:</h6>
  //               <small className="d-block mb-1"><strong>Backend URL:</strong> {statisticsService.BASE_URL}</small>
  //               <small className="d-block mb-1"><strong>Token prezent:</strong> {statisticsService.getAuthToken() ? 'Da' : 'Nu'}</small>
  //               <small className="d-block mb-1"><strong>Token value:</strong> {statisticsService.getAuthToken() ? `${statisticsService.getAuthToken().substring(0, 20)}...` : 'Lipsește'}</small>
  //               <small className="d-block mb-1"><strong>LocalStorage keys:</strong> {Object.keys(localStorage).join(', ') || 'Nimic'}</small>
  //               <small className="d-block mb-1"><strong>SessionStorage keys:</strong> {Object.keys(sessionStorage).join(', ') || 'Nimic'}</small>
  //               <small className="d-block"><strong>Timp:</strong> {new Date().toLocaleString('ro-RO')}</small>
  //             </div>
  //           )}
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }

  // if (!statisticsData) {
  //   return (
  //     <div className="alert alert-warning d-flex align-items-center" role="alert">
  //       <Icon name="alert" size={20} className="me-2" />
  //       <div>
  //         Nu s-au putut încărca datele de statistici. Te rog să încerci din nou.
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">📊 Analiză Statistică din Baza de Date</h2>
          <p className="text-muted mb-0">
            Dashboard cu date {useTestData ? 'de test' : 'reale'} - {new Date().toLocaleDateString('ro-RO')} 
            {/* <span className={`badge ${useTestData ? 'bg-warning' : 'bg-success'} ms-2`}>
              {useTestData ? 'Test Data' : 'Live Data'}
            </span> */}
          </p>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-primary" onClick={loadStatistics} disabled={loading}>
            <Icon name="refresh" size={18} className="me-2" />
            Actualizează
          </button>
          
          {/* <button 
            className={`btn ${useTestData ? 'btn-warning' : 'btn-outline-warning'} btn-sm`}
            onClick={toggleTestMode}
            title={useTestData ? 'Folosind date de test' : 'Folosind date reale'}
          >
            {useTestData ? '🧪 Date Test' : '📊 Date Reale'}
          </button> */}
          
          {/* <button className="btn btn-outline-success">
            <Icon name="download" size={18} className="me-2" />
            Export Raport
          </button> */}
        </div>
      </div>

      {/* View Selector */}
      <div className="mb-4">
        <div className="btn-group" role="group">
          <button 
            className={`btn ${selectedView === 'overview' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setSelectedView('overview')}
          >
            Overview General
          </button>
          <button 
            className={`btn ${selectedView === 'clients' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setSelectedView('clients')}
          >
            Analiză Clienți
          </button>
          <button 
            className={`btn ${selectedView === 'beaches' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setSelectedView('beaches')}
          >
            Performanță Plaje
          </button>
          <button 
            className={`btn ${selectedView === 'equipment' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setSelectedView('equipment')}
          >
            Echipamente
          </button>
        </div>
      </div>

      {selectedView === 'overview' && (
  <>
    {/* Overview Cards */}
    <div className="row g-4 mb-4">
      <div className="col-md-3">
        <StatCard 
          title="Total Utilizatori" 
          value={isLoadingOverview ? '...' : formatNumber(overviewData?.userStatistics?.totalUtilizatori)}
          change={overviewData?.userStatistics?.rataCrestere}
          changeType={overviewData?.userStatistics?.rataCrestere >= 0 ? 'up' : 'down'}
          icon="users"
          color="primary"
          description="Utilizatori înregistrați în sistem"
          isLoading={isLoadingOverview}
        />
      </div>
      <div className="col-md-3">
        <StatCard 
          title="Rezervări Luna Aceasta" 
          value={isLoadingOverview ? '...' : formatNumber(overviewData?.reservationStatistics?.rezervariLunaAceasta)}
          change={overviewData?.reservationStatistics?.rataCrestereRezervari}
          changeType={overviewData?.reservationStatistics?.rataCrestereRezervari >= 0 ? 'up' : 'down'}
          icon="ticket"
          color="success"
          description="Creștere față de luna trecută"
          isLoading={isLoadingOverview}
        />
      </div>
      <div className="col-md-3">
        <StatCard 
          title="Venit Luna Aceasta" 
          value={isLoadingOverview ? '...' : formatCurrency(overviewData?.reservationStatistics?.venitLunaAceasta)}
          suffix=" RON"
          icon="creditCard"
          color="info"
          description="Venituri generate"
          isLoading={isLoadingOverview}
        />
      </div>
      <div className="col-md-3">
        <StatCard 
          title="Utilizatori Noi" 
          value={isLoadingOverview ? '...' : formatNumber(overviewData?.userStatistics?.utilizatoriNoiLunaAceasta)}
          icon="target"
          color="warning"
          description="Înregistrați luna aceasta"
          isLoading={isLoadingOverview}
        />
      </div>
    </div>

    {/* Charts Row - Îmbunătățite */}
    <div className="row g-4 mb-4">
      <div className="col-lg-6">
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="fw-bold mb-0">📈 Evoluția Lunară - Rezervări</h5>
            <span className="badge bg-primary bg-opacity-10 text-primary">
              {(overviewData?.seasonalAnalysis || []).length} luni
            </span>
          </div>
          
          {isLoadingOverview ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Se încarcă...</span>
              </div>
            </div>
          ) : (
            <>
              {/* Statistici rezumat */}
              <div className="row mb-3">
                <div className="col-4 text-center">
                  <div className="small text-muted">Total Rezervări</div>
                  <div className="fw-bold text-primary">
                    {formatNumber((overviewData?.seasonalAnalysis || [])
                      .reduce((sum, item) => sum + (Number(item.numarRezervari) || 0), 0))}
                  </div>
                </div>
                <div className="col-4 text-center">
                  <div className="small text-muted">Media/Lună</div>
                  <div className="fw-bold text-info">
                    {formatNumber(Math.round(
                      (overviewData?.seasonalAnalysis || [])
                        .reduce((sum, item) => sum + (Number(item.numarRezervari) || 0), 0) /
                      Math.max((overviewData?.seasonalAnalysis || []).length, 1)
                    ))}
                  </div>
                </div>
                <div className="col-4 text-center">
                  <div className="small text-muted">Cea mai bună</div>
                  <div className="fw-bold text-success">
                    {(() => {
                      const maxMonth = (overviewData?.seasonalAnalysis || [])
                        .reduce((max, item) => 
                          (Number(item.numarRezervari) || 0) > (Number(max.numarRezervari) || 0) ? item : max, 
                          { numarRezervari: 0, luna: 'N/A' }
                        );
                      return maxMonth.luna ? maxMonth.luna.substring(5) : 'N/A';
                    })()}
                  </div>
                </div>
              </div>

              <ChartComponent 
                data={overviewData?.seasonalAnalysis || []} 
                dataKey="numarRezervari"
                height="240px"
                color="primary"
                title="Rezervări pe luni"
                showValues={true}
              />
              
              <div className="mt-3">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <small className="text-muted">Tendința rezervărilor pe ultimele luni</small>
                  <small className="text-success">
                    {(() => {
                      const data = overviewData?.seasonalAnalysis || [];
                      if (data.length < 2) return 'N/A';
                      const latest = Number(data[data.length - 1]?.numarRezervari) || 0;
                      const previous = Number(data[data.length - 2]?.numarRezervari) || 0;
                      const growth = previous > 0 ? ((latest - previous) / previous * 100).toFixed(1) : 0;
                      return `${growth > 0 ? '+' : ''}${growth}% față de luna trecută`;
                    })()}
                  </small>
                </div>
                
                {/* Tabel detaliat pentru ultimele 3 luni */}
                <div className="table-responsive">
                  <table className="table table-sm table-borderless">
                    <thead>
                      <tr className="text-muted small">
                        <th>Luna</th>
                        <th className="text-center">Rezervări</th>
                        <th className="text-center">Schimbare</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(overviewData?.seasonalAnalysis || []).slice(-3).map((item, index, arr) => {
                        const prevItem = index > 0 ? arr[index - 1] : null;
                        const change = prevItem ? 
                          ((Number(item.numarRezervari) - Number(prevItem.numarRezervari)) / Number(prevItem.numarRezervari) * 100).toFixed(1) : 
                          null;
                        
                        return (
                          <tr key={index}>
                            <td className="fw-semibold">{item.luna}</td>
                            <td className="text-center">{formatNumber(item.numarRezervari)}</td>
                            <td className="text-center">
                              {change ? (
                                <span className={`small ${change >= 0 ? 'text-success' : 'text-danger'}`}>
                                  {change > 0 ? '+' : ''}{change}%
                                </span>
                              ) : (
                                <span className="small text-muted">-</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="col-lg-6">
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="fw-bold mb-0">💰 Evoluția Lunară - Venituri</h5>
            <span className="badge bg-success bg-opacity-10 text-success">RON</span>
          </div>
          
          {isLoadingOverview ? (
            <div className="text-center py-5">
              <div className="spinner-border text-success" role="status">
                <span className="visually-hidden">Se încarcă...</span>
              </div>
            </div>
          ) : (
            <>
              {/* Statistici rezumat pentru venituri */}
              <div className="row mb-3">
                <div className="col-4 text-center">
                  <div className="small text-muted">Total Venituri</div>
                  <div className="fw-bold text-success">
                    {formatCurrency((overviewData?.seasonalAnalysis || [])
                      .reduce((sum, item) => sum + (Number(item.venitLunar) || 0), 0))} RON
                  </div>
                </div>
                <div className="col-4 text-center">
                  <div className="small text-muted">Media/Lună</div>
                  <div className="fw-bold text-info">
                    {formatCurrency(
                      (overviewData?.seasonalAnalysis || [])
                        .reduce((sum, item) => sum + (Number(item.venitLunar) || 0), 0) /
                      Math.max((overviewData?.seasonalAnalysis || []).length, 1)
                    )} RON
                  </div>
                </div>
                <div className="col-4 text-center">
                  <div className="small text-muted">Cea mai bună</div>
                  <div className="fw-bold text-warning">
                    {(() => {
                      const maxMonth = (overviewData?.seasonalAnalysis || [])
                        .reduce((max, item) => 
                          (Number(item.venitLunar) || 0) > (Number(max.venitLunar) || 0) ? item : max, 
                          { venitLunar: 0, luna: 'N/A' }
                        );
                      return maxMonth.luna ? maxMonth.luna.substring(5) : 'N/A';
                    })()}
                  </div>
                </div>
              </div>

              <ChartComponent 
                data={overviewData?.seasonalAnalysis || []} 
                dataKey="venitLunar"
                height="240px"
                color="success"
                title="Venituri lunare"
                showValues={true}
              />
              
              <div className="mt-3">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <small className="text-muted">Creșterea veniturilor pe ultimele luni</small>
                  <small className="text-success">
                    {(() => {
                      const data = overviewData?.seasonalAnalysis || [];
                      if (data.length < 2) return 'N/A';
                      const latest = Number(data[data.length - 1]?.venitLunar) || 0;
                      const previous = Number(data[data.length - 2]?.venitLunar) || 0;
                      const growth = previous > 0 ? ((latest - previous) / previous * 100).toFixed(1) : 0;
                      return `${growth > 0 ? '+' : ''}${growth}% față de luna trecută`;
                    })()}
                  </small>
                </div>
                
                {/* Tabel detaliat pentru venituri */}
                <div className="table-responsive">
                  <table className="table table-sm table-borderless">
                    <thead>
                      <tr className="text-muted small">
                        <th>Luna</th>
                        <th className="text-center">Venit (RON)</th>
                        <th className="text-center">Venit/Rezervare</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(overviewData?.seasonalAnalysis || []).slice(-3).map((item, index) => {
                        const avgPerReservation = Number(item.numarRezervari) > 0 ? 
                          (Number(item.venitLunar) / Number(item.numarRezervari)).toFixed(2) : 0;
                        
                        return (
                          <tr key={index}>
                            <td className="fw-semibold">{item.luna}</td>
                            <td className="text-center">{formatCurrency(item.venitLunar)}</td>
                            <td className="text-center">
                              <span className="small text-muted">{avgPerReservation} RON</span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>

    {/* Resort Distribution - Îmbunătățit */}
    <div className="bg-white rounded-lg shadow-sm border p-4 mb-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="fw-bold mb-0">🏖️ Distribuția pe Stațiuni</h5>
        <div className="d-flex gap-2">
          <span className="badge bg-info bg-opacity-10 text-info">
            {(overviewData?.resortDistribution || []).length} stațiuni
          </span>
          <span className="badge bg-warning bg-opacity-10 text-warning">
            {formatNumber((overviewData?.resortDistribution || [])
              .reduce((sum, item) => sum + (Number(item.numarPlaje) || 0), 0))} plaje total
          </span>
        </div>
      </div>
      
      {isLoadingOverview ? (
        <div className="text-center py-5">
          <div className="spinner-border text-info" role="status">
            <span className="visually-hidden">Se încarcă...</span>
          </div>
        </div>
      ) : (
        <>
          {/* Statistici generale pentru stațiuni */}
          <div className="row mb-4">
            <div className="col-md-3 text-center">
              <div className="small text-muted">Total Rezervări</div>
              <div className="fw-bold text-primary fs-5">
                {formatNumber((overviewData?.resortDistribution || [])
                  .reduce((sum, item) => sum + (Number(item.numarRezervari) || 0), 0))}
              </div>
            </div>
            <div className="col-md-3 text-center">
              <div className="small text-muted">Total Venituri</div>
              <div className="fw-bold text-success fs-5">
                {formatCurrency((overviewData?.resortDistribution || [])
                  .reduce((sum, item) => sum + (Number(item.venitTotal) || 0), 0))} RON
              </div>
            </div>
            <div className="col-md-3 text-center">
              <div className="small text-muted">Media Rezervări/Stațiune</div>
              <div className="fw-bold text-info fs-5">
                {formatNumber(Math.round(
                  (overviewData?.resortDistribution || [])
                    .reduce((sum, item) => sum + (Number(item.numarRezervari) || 0), 0) /
                  Math.max((overviewData?.resortDistribution || []).length, 1)
                ))}
              </div>
            </div>
            <div className="col-md-3 text-center">
              <div className="small text-muted">Media Plaje/Stațiune</div>
              <div className="fw-bold text-warning fs-5">
                {(
                  (overviewData?.resortDistribution || [])
                    .reduce((sum, item) => sum + (Number(item.numarPlaje) || 0), 0) /
                  Math.max((overviewData?.resortDistribution || []).length, 1)
                ).toFixed(1)}
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-7">
              <h6 className="fw-bold mb-3">📊 Grafic Venituri pe Stațiuni</h6>
              <ChartComponent 
                data={overviewData?.resortDistribution || []} 
                dataKey="venitTotal"
                height="240px"
                color="info"
                title="Distribuția veniturilor"
                showValues={true}
              />
              <div className="mt-2 text-center">
                <small className="text-muted">
                  Stațiunea cu cele mai mari venituri: <strong>
                    {(() => {
                      const topResort = (overviewData?.resortDistribution || [])
                        .reduce((max, item) => 
                          (Number(item.venitTotal) || 0) > (Number(max.venitTotal) || 0) ? item : max, 
                          { statiune: 'N/A', venitTotal: 0 }
                        );
                      return topResort.statiune !== 'N/A' ? 
                        `${topResort.statiune} (${formatCurrency(topResort.venitTotal)} RON)` : 'N/A';
                    })()}
                  </strong>
                </small>
              </div>
            </div>
            
            <div className="col-lg-5">
              <h6 className="fw-bold mb-3">📋 Detalii pe Stațiuni</h6>
              <div className="table-responsive">
                <table className="table table-sm table-hover">
                  <thead className="table-light">
                    <tr>
                      <th>Stațiune</th>
                      <th className="text-center">Plaje</th>
                      <th className="text-center">Rezervări</th>
                      <th className="text-center">Venit (RON)</th>
                      <th className="text-center">%</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(overviewData?.resortDistribution || []).map((resort, index) => {
                      const totalRevenue = (overviewData?.resortDistribution || [])
                        .reduce((sum, item) => sum + (Number(item.venitTotal) || 0), 0);
                      const percentage = totalRevenue > 0 ? 
                        ((Number(resort.venitTotal) / totalRevenue) * 100).toFixed(1) : 0;
                      
                      return (
                        <tr key={resort.id || index}>
                          <td>
                            <div className="d-flex align-items-center">
                              <div className={`p-1 rounded-circle me-2 ${
                                index === 0 ? 'bg-warning' :
                                index === 1 ? 'bg-info' :
                                index === 2 ? 'bg-success' : 'bg-secondary'
                              }`} style={{ width: '8px', height: '8px' }}></div>
                              <span className="fw-semibold">{resort.statiune}</span>
                            </div>
                          </td>
                          <td className="text-center">
                            <span className="badge bg-light text-dark">{formatNumber(resort.numarPlaje)}</span>
                          </td>
                          <td className="text-center">{formatNumber(resort.numarRezervari)}</td>
                          <td className="text-center">
                            <span className="fw-bold text-success">{formatCurrency(resort.venitTotal)}</span>
                          </td>
                          <td className="text-center">
                            <span className="small text-muted">{percentage}%</span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              
              {/* Performanță pe plajă pentru cea mai bună stațiune */}
              {(overviewData?.resortDistribution || []).length > 0 && (
                <div className="mt-3 p-3 bg-light rounded">
                  <small className="text-muted">
                    <strong>💡 Insight:</strong> 
                    {(() => {
                      const topResort = (overviewData?.resortDistribution || [])
                        .reduce((max, item) => 
                          (Number(item.venitTotal) || 0) > (Number(max.venitTotal) || 0) ? item : max, 
                          { statiune: 'N/A', venitTotal: 0, numarPlaje: 0, numarRezervari: 0 }
                        );
                      const avgRevenuePerBeach = Number(topResort.numarPlaje) > 0 ? 
                        (Number(topResort.venitTotal) / Number(topResort.numarPlaje)).toFixed(0) : 0;
                      const avgReservationsPerBeach = Number(topResort.numarPlaje) > 0 ? 
                        (Number(topResort.numarRezervari) / Number(topResort.numarPlaje)).toFixed(0) : 0;
                      
                      return topResort.statiune !== 'N/A' ? 
                        `${topResort.statiune} generează în medie ${formatCurrency(avgRevenuePerBeach)} RON per plajă, cu ${avgReservationsPerBeach} rezervări per plajă.` : 
                        'Nu sunt date disponibile pentru analiză.';
                    })()}
                  </small>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  </>
)}

{selectedView === 'clients' && (
  <>
    <div className="row g-4">
      {/* Top Active Clients */}
      <div className="col-lg-7">
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <h5 className="fw-bold mb-4">🏆 Top Cei Mai Activi Clienți</h5>
          
          {isLoadingClients ? (
            <div className="text-center py-4">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Se încarcă...</span>
              </div>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead className="table-light">
                  <tr>
                    <th>Client</th>
                    <th className="text-center">Rezervări</th>
                    <th className="text-center">Total Cheltuit</th>
                    <th className="text-center">Ultima Vizită</th>
                  </tr>
                </thead>
                <tbody>
                  {topActiveClientsData.map((client, index) => (
                    <tr key={client.id || index}>
                      <td>
                        <div className="d-flex align-items-center">
                          <div className={`p-2 rounded-circle me-3 ${
                            index === 0 ? 'bg-warning bg-opacity-10' :
                            index === 1 ? 'bg-secondary bg-opacity-10' :
                            index === 2 ? 'bg-warning bg-opacity-10' : 'bg-light'
                          }`}>
                            <Icon name="star" size={16} className={
                              index === 0 ? 'text-warning' :
                              index === 1 ? 'text-secondary' :
                              index === 2 ? 'text-warning' : 'text-muted'
                            } />
                          </div>
                          <div>
                            <div className="fw-semibold">{client.numeClient}</div>
                            <small className="text-muted">{client.email}</small>
                          </div>
                        </div>
                      </td>
                      <td className="text-center">
                        <span className="fw-bold text-primary">{formatNumber(client.numarRezervari)}</span>
                      </td>
                      <td className="text-center">
                        <span className="fw-bold text-success">{formatCurrency(client.totalCheltuit)} RON</span>
                      </td>
                      <td className="text-center">
                        <small className="text-muted">{formatDateTime(client.ultimaRezervare)}</small>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          {!isLoadingClients && topActiveClientsData.length === 0 && (
            <div className="text-center py-4">
              <p className="text-muted">Nu există clienți activi în baza de date</p>
            </div>
          )}
        </div>
      </div>

      {/* Inactive Clients */}
      <div className="col-lg-5">
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <h5 className="fw-bold mb-4">😴 Clienți Inactivi (90+ zile)</h5>
          
          {isLoadingClients ? (
            <div className="text-center py-4">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Se încarcă...</span>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {inactiveClientsData.map((client, index) => (
                <div key={client.id || index} className="border-bottom pb-3 mb-3">
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <div className="fw-semibold">{client.numeClient}</div>
                      <small className="text-muted">{client.email}</small>
                      <div className="mt-1">
                        <small className="text-muted">Ultima rezervare: {formatDateTime(client.ultimaRezervare)}</small>
                      </div>
                    </div>
                    <div className="text-end">
                      <span className="badge bg-danger">{client.zileDeLaUltimaRezervare} zile</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {!isLoadingClients && inactiveClientsData.length === 0 && (
            <div className="text-center py-4">
              <p className="text-muted">Nu există clienți inactivi</p>
            </div>
          )}
          
          <div className="text-center mt-3">
            <button className="btn btn-outline-primary btn-sm">
              Vezi toți clienții inactivi
            </button>
          </div>
        </div>
      </div>
    </div>
  </>
)}

{selectedView === 'beaches' && (
  <>
    <div className="bg-white rounded-lg shadow-sm border p-4">
      <h5 className="fw-bold mb-4">🏖️ Top Performanță Plaje</h5>
      
      {isLoadingBeaches ? (
        <div className="text-center py-4">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Se încarcă...</span>
          </div>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover">
            <thead className="table-light">
              <tr>
                <th>Plaja</th>
                <th>Stațiune</th>
                <th className="text-center">Rezervări</th>
                <th className="text-center">Venit Total</th>
                <th className="text-center">Preț Mediu</th>
                <th className="text-center">Performanță</th>
              </tr>
            </thead>
            <tbody>
              {beachPerformanceData.map((beach, index) => (
                <tr key={beach.id || index}>
                  <td>
                    <div className="d-flex align-items-center">
                      <div className={`p-2 rounded-circle me-3 ${
                        index === 0 ? 'bg-warning bg-opacity-10' :
                        index === 1 ? 'bg-secondary bg-opacity-10' :
                        index === 2 ? 'bg-warning bg-opacity-10' : 'bg-light'
                      }`}>
                        <Icon name="beach" size={16} className={
                          index === 0 ? 'text-warning' :
                          index === 1 ? 'text-secondary' :
                          index === 2 ? 'text-warning' : 'text-muted'
                        } />
                      </div>
                      <div>
                        <div className="fw-semibold">{beach.nume_plaja}</div>
                        {index < 3 && (
                          <small className="text-muted">
                            #{index + 1} {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                          </small>
                        )}
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="badge bg-info bg-opacity-10 text-info">{beach.statiune}</span>
                  </td>
                  <td className="text-center">
                    <span className="fw-bold">{formatNumber(beach.numar_rezervari)}</span>
                  </td>
                  <td className="text-center">
                    <span className="fw-bold text-success">{formatCurrency(beach.venit_total)} RON</span>
                  </td>
                  <td className="text-center">
                    <span className="fw-bold">{formatCurrency(beach.pret_mediu_rezervare)} RON</span>
                  </td>
                  <td className="text-center">
                    <div className="progress" style={{ height: '8px', width: '60px' }}>
                      <div 
                        className="progress-bar bg-primary" 
                        style={{ 
                          width: `${Math.min((Number(beach.venit_total) / Math.max(...beachPerformanceData.map(b => b.venit_total))) * 100, 100)}%` 
                        }}
                      ></div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {!isLoadingBeaches && beachPerformanceData.length === 0 && (
        <div className="text-center py-4">
          <p className="text-muted">Nu există date de performanță pentru plaje</p>
        </div>
      )}
    </div>
  </>
)}

{selectedView === 'equipment' && (
  <>
    <div className="row g-4">
      <div className="col-lg-8">
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <h5 className="fw-bold mb-4">🏖️ Utilizarea Echipamentelor</h5>
          
          {isLoadingEquipment ? (
            <div className="text-center py-4" style={{ height: '280px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Se încarcă...</span>
              </div>
            </div>
          ) : (
            <>
              <ChartComponent 
                data={equipmentStatisticsData} 
                dataKey="rataUtilizare"
                height="280px"
                color="warning"
                title="Rata de utilizare (%)"
                showValues={true}
              />
              <div className="mt-3 text-center">
                <small className="text-muted">Rata de utilizare pe tipuri de echipamente (%)</small>
              </div>
            </>
          )}
          
          {!isLoadingEquipment && equipmentStatisticsData.length === 0 && (
            <div className="text-center py-4" style={{ height: '280px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <p className="text-muted">Nu există date despre echipamente</p>
            </div>
          )}
        </div>
      </div>

      <div className="col-lg-4">
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <h5 className="fw-bold mb-4">📊 Statistici Echipamente</h5>
          
          {isLoadingEquipment ? (
            <div className="text-center py-4">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Se încarcă...</span>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {equipmentStatisticsData.map((equipment, index) => (
                <div key={equipment.id || index} className="border-bottom pb-3 mb-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <div className="fw-semibold">{equipment.tipEchipament}</div>
                      <small className="text-muted">{formatNumber(equipment.numarTotalEchipamente)} total</small>
                    </div>
                    <div className="text-end">
                      <div className="fw-bold text-primary">{formatPercentage(equipment.rataUtilizare)}%</div>
                      <small className="text-muted">{formatNumber(equipment.numarRezervari)} rezervări</small>
                    </div>
                  </div>
                  <div className="mt-2">
                    <div className="progress" style={{ height: '6px' }}>
                      <div 
                        className="progress-bar bg-warning" 
                        style={{ width: `${Math.min(Number(equipment.rataUtilizare) || 0, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="mt-1">
                    <small className="text-success fw-semibold">
                      {formatCurrency(equipment.venitGenerat)} RON generat
                    </small>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {!isLoadingEquipment && equipmentStatisticsData.length === 0 && (
            <div className="text-center py-4">
              <p className="text-muted">Nu există date despre echipamente</p>
            </div>
          )}
        </div>
      </div>
    </div>
  </>
)}
    </div>
  );
};

export default StatisticsManagement;