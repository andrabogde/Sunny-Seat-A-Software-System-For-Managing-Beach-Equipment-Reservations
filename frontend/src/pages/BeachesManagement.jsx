import React, { useState, useEffect, useCallback, useContext } from 'react';
import ApiClient from "../api/src/ApiClient";
import PlajaControllerApi from "../api/src/api/PlajaControllerApi";
import EchipamentControllerApi from "../api/src/api/EchipamentPlajaControllerApi";
import PositiveNumberInput from '../components/common/PositiveNumberInput';
import { AuthContext } from '../contexts/AuthContext';
import apiService from '../services/ApiService';
import { data } from 'react-router-dom';

const BeachesManagement = () => {
  const { user, isAuthenticated } = useContext(AuthContext);
  
  const [beaches, setBeaches] = useState([]);
  const [filteredBeaches, setFilteredBeaches] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedResort, setSelectedResort] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedBeach, setSelectedBeach] = useState(null);
  const [detailedBeach, setDetailedBeach] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statiuni, setStatiuni] = useState([]);
  const [firme, setFirme] = useState([]);
  const [modalLoading, setModalLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Beach Layout Editor States
  const [showLayoutEditor, setShowLayoutEditor] = useState(false);
  const [layoutData, setLayoutData] = useState({
    rows: 8,
    cols: 12,
    grid: [],
    equipmentCount: { S: 0, B: 0, U: 0, G: 0 },
    prices: { S: 0, B: 0, U: 0 }
  });
  const [selectedTool, setSelectedTool] = useState('S');

  // Equipment types for layout editor
  const equipmentTypes = {
    S: {  tipEchipamentId: 1, name: 'Sezlong', color: '#3498db', icon: '🏖️' },
    B: { tipEchipamentId: 2,name: 'Baldachin', color: '#e74c3c', icon: '🏕️' },
    U: { tipEchipamentId: 10,name: 'Umbrelă', color: '#f39c12', icon: '☂️' },
    G: { tipEchipamentId: 11,name: 'Spațiu Gol', color: '#ecf0f1', icon: '⬜' }
  };

 
 
  const [apiClient] = useState(() => {
    const client = new ApiClient();
    client.enableCookies = true;
    client.basePath = 'http://localhost:8080';
  
    // 👉 obține tokenul fără this
    const token = localStorage.getItem('authToken') || 
                  localStorage.getItem('token') ||
                  sessionStorage.getItem('authToken') ||
                  sessionStorage.getItem('token');
  
    if (token) {
      client.defaultHeaders = {
        'Authorization': `Bearer ${token}`
      };
    }
  
    return client;
  });
  
  const plajaApi = new PlajaControllerApi(apiClient);
  const echipamentApi = new EchipamentControllerApi(apiClient);

  const Icon = ({ name, size = 18, className = "" }) => {
    const icons = {
      beach: (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M2 18h20"></path><path d="M12 18V6"></path><path d="M8 14l4-4 4 4"></path></svg>),
      search: (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>),
      filter: (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46"></polygon></svg>),
      plus: (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>),
      edit: (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4Z"></path></svg>),
      eye: (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path><circle cx="12" cy="12" r="3"></circle></svg>),
      trash: (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>),
      mapPin: (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>),
      star: (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>),
      umbrella: (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M23 12a11.05 11.05 0 0 0-22 0Z" /><path d="M18 21.93A3 3 0 0 1 12 20V13" /></svg>),
      users: (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>),
      check: (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="20 6 9 17 4 12"></polyline></svg>),
      x: (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>),
      refresh: (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4-4.64 4.36A9 9 0 0 1 3.51 15"></path></svg>),
      phone: (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>),
      globe: (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>),
      thermometer: (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z"></path></svg>),
      wind: (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2"></path><path d="M9.6 4.6A2 2 0 1 1 11 8H2"></path><path d="M12.6 19.4A2 2 0 1 0 14 16H2"></path></svg>),
      save: (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>),
      info: (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>),
      building: (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line><line x1="15" y1="21" x2="15" y2="9"></line></svg>),
      mail: (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>),
      briefcase: (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>),
      hash: (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="4" y1="9" x2="20" y2="9"></line><line x1="4" y1="15" x2="20" y2="15"></line><line x1="10" y1="3" x2="8" y2="21"></line><line x1="16" y1="3" x2="14" y2="21"></line></svg>),
      grid: (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>),
    };
    return icons[name] || icons.beach;
  };

  function getAllPlajeByUserWithCallback(callback) {
    apiService.getAllPlajeByUser()
      .then(data => callback(null, data, null)) // nu avem `response`, dar poți simula dacă vrei
      .catch(error => callback(error, null, null));
  }

  // SEPARATE FUNCTIONS FOR LOADING DATA
  const loadBeaches = useCallback((showLoadingIndicator = true) => {
    if (showLoadingIndicator) setLoading(true);
    setError(null);
    console.log('UserRole',user);
    if(user.role==='ADMIN'){
    plajaApi.getAllPlajeUsingGET((error, data, response) => {
      if (showLoadingIndicator) setLoading(false);
      if (error) {
        console.error("Eroare la încărcarea plajelor:", error, response);
        setError(`Nu s-au putut încărca plajele. (${error.status || 'Verificați consola'})`);
      } else {
        const plajeData = data || [];
        const transformedBeaches = plajeData.map(plaja => {
          let detaliiWebParsed = plaja.detaliiWeb || plaja.detalii_web;
          if (typeof detaliiWebParsed === 'string') {
            try {
              detaliiWebParsed = JSON.parse(detaliiWebParsed);
            } catch (e) {
              console.error("Eroare la parsarea detalii_web pentru plaja ID " + plaja.id, e);
              detaliiWebParsed = {};
            }
          }

          return {
            id: plaja.id,
            nume: plaja.denumire || 'Fără nume',
            statiune: plaja.statiune?.denumire || 'Necunoscută',
            statiuneId: plaja.statiune?.id,
            firma: plaja.firma?.denumire || 'Necunoscută',
            firmaId: plaja.firma?.id,
            adresa: plaja.adresa || 'Adresă necunoscută',
            numar_sezlonguri: plaja.numarSezlonguri || 0,
            latitudine: plaja.latitudine || 0.0,
            longitudine: plaja.longitudine || 0.0,
            activ: plaja.activ,
            status: plaja.activ ? 'Activ' : 'Inactiv',
            descriere: plaja.descriere || 'Fără descriere',
            detalii_web: detaliiWebParsed || {},
            originalData: plaja
          };
        });
        setBeaches(transformedBeaches);

        // Extract unique statiuni ONLY from beaches data
        const uniqueStatiuniMap = new Map();
        plajeData.forEach(plaja => {
          if (plaja.statiune && plaja.statiune.id && plaja.statiune.denumire) {
            uniqueStatiuniMap.set(plaja.statiune.id, { id: plaja.statiune.id, denumire: plaja.statiune.denumire });
          }
        });
        setStatiuni(Array.from(uniqueStatiuniMap.values()).sort((a, b) => a.denumire.localeCompare(b.denumire)));
      }
    });
  }
  else if(user.role==='MANAGER'){
    plajaApi.getAllPlajeUsingGET((error, data, response) => {
      if (showLoadingIndicator) setLoading(false);
      if (error) {
        console.error("Eroare la încărcarea plajelor:", error, response);
        setError(`Nu s-au putut încărca plajele. (${error.status || 'Verificați consola'})`);
      } else {
        console.log('responsess',response);
        const plajeData = response.body || [];
        const transformedBeaches = plajeData.map(plaja => {
          let detaliiWebParsed = plaja.detaliiWeb || plaja.detalii_web;
          if (typeof detaliiWebParsed === 'string') {
            try {
              detaliiWebParsed = JSON.parse(detaliiWebParsed);
            } catch (e) {
              console.error("Eroare la parsarea detalii_web pentru plaja ID " + plaja.id, e);
              detaliiWebParsed = {};
            }
          }

          return {
            ...plaja,
            id: plaja.id,
            
            nume: plaja.denumire || 'Fără nume',
            statiune: plaja.statiune?.denumire || 'Necunoscută',
            statiuneId: plaja.statiune?.id,
            firma: plaja.firma?.denumire || 'Necunoscută',
            firmaId: plaja.firma?.id,
            adresa: plaja.adresa || 'Adresă necunoscută',
            numar_sezlonguri: plaja.numarSezlonguri || 0,
            latitudine: plaja.latitudine || 0.0,
            longitudine: plaja.longitudine || 0.0,
            activ: plaja.activ,
            status: plaja.activ ? 'Activ' : 'Inactiv',
            descriere: plaja.descriere || 'Fără descriere',
            detalii_web: detaliiWebParsed || {},
            originalData: plaja
          };
        }).filter((el)=>el.userId==user.id);
        console.log('transformedBeaches',transformedBeaches);
        setBeaches(transformedBeaches);

        // Extract unique statiuni ONLY from beaches data
        const uniqueStatiuniMap = new Map();
        plajeData.forEach(plaja => {
          if (plaja.statiune && plaja.statiune.id && plaja.statiune.denumire) {
            uniqueStatiuniMap.set(plaja.statiune.id, { id: plaja.statiune.id, denumire: plaja.statiune.denumire });
          }
        });
        setStatiuni(Array.from(uniqueStatiuniMap.values()).sort((a, b) => a.denumire.localeCompare(b.denumire)));
      }
    });

  }
  }, []);
  

  // NEW FUNCTION: Load all companies from dedicated API
  const loadAllFirme = useCallback(() => {
    console.log('🏢 Loading all companies from /firme API...');

    // Using XMLHttpRequest to match your existing pattern
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'http://localhost:8080/firme');
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.withCredentials = true;

    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const companiesData = JSON.parse(xhr.responseText);
            console.log('✅ Companies loaded successfully:', companiesData);

            const transformedFirme = companiesData.map(firma => ({
              id: firma.id,
              denumire: firma.denumire,
              cui: firma.cui
            }));

            setFirme(transformedFirme.sort((a, b) => a.denumire.localeCompare(b.denumire)));
          } catch (e) {
            console.error('❌ Error parsing companies data:', e);
            setFirme([]);
          }
        } else {
          console.error('❌ Error loading companies:', xhr.status, xhr.statusText);
          setFirme([]);
        }
      }
    };

    xhr.onerror = () => {
      console.error('❌ Network error loading companies');
      setFirme([]);
    };

    xhr.send();
  }, []);

  // INITIAL LOAD - Load both beaches and companies
  useEffect(() => {
    loadBeaches();
    loadAllFirme(); // Load companies from dedicated API
  }, []);

  // SEPARATE INTERVAL EFFECT - Only runs when no modals are open
  useEffect(() => {
    // Don't set up interval if any modal is open
    if (showDetailsModal || showEditModal || showAddModal || showLayoutEditor || isSubmitting || modalLoading) {
      return;
    }

    // Set up interval ONLY for beaches data when safe to do so
    const intervalId = setInterval(() => {
      console.log('🔄 Auto-refresh: Reloading beaches data...');
      loadBeaches(false); // Only reload beaches, not companies
    }, 30000);

    return () => {
      console.log('🛑 Auto-refresh: Interval cleared');
      clearInterval(intervalId);
    };
  }, [showDetailsModal, showEditModal, showAddModal, isSubmitting, modalLoading]);

  // REFRESH FUNCTION - Reload both beaches and companies
  const handleRefresh = () => {
    loadBeaches();
    loadAllFirme(); // Also refresh companies list
  };

  const loadBeachDetails = useCallback((beachId) => {
    setModalLoading(true);
    plajaApi.getPlajaByIdUsingGET(beachId, (error, data, response) => {
      setModalLoading(false);
      if (error) {
        console.error("Eroare la încărcarea detaliilor plajei:", error, response);
        alert(`Nu s-au putut încărca detaliile plajei. (${error.status || 'Eroare server'})`);
        setDetailedBeach(null);
      } else {
        let detaliiWebParsed = data.detaliiWeb || data.detalii_web;
       // console.log('Datele plajei sunt ',response);
        if (typeof detaliiWebParsed === 'string') {
          try {
            detaliiWebParsed = JSON.parse(detaliiWebParsed);
          } catch (e) {
            console.error("Eroare la parsarea detalii_web pentru detalii plaja ID " + data.id, e);
            detaliiWebParsed = {};
          }
        }
        setDetailedBeach({ ...response.body, detalii_web_parsed: detaliiWebParsed });
      }
    });
  }, [plajaApi]);

  useEffect(() => {
    if (!loading) {
      let result = [...beaches];
      if (searchTerm) {
        const lowerSearchTerm = searchTerm.toLowerCase();
        result = result.filter(beach =>
          beach.nume.toLowerCase().includes(lowerSearchTerm) ||
          beach.statiune.toLowerCase().includes(lowerSearchTerm) ||
          beach.firma.toLowerCase().includes(lowerSearchTerm)
        );
      }
      if (selectedResort !== 'all') {
        result = result.filter(beach => beach.statiuneId === parseInt(selectedResort));
      }
      if (selectedStatus !== 'all') {
        result = result.filter(beach => beach.status === selectedStatus);
      }
      setFilteredBeaches(result);
    }
  }, [searchTerm, selectedResort, selectedStatus, beaches, loading]);

  const getStatusBadge = (status) => {
    const statusConfig = {
      'Activ': { class: 'bg-success text-white', text: 'Activ' },
      'Inactiv': { class: 'bg-secondary text-white', text: 'Inactiv' },
    };
    const config = statusConfig[status] || { class: 'bg-light text-dark', text: status || 'Necunoscut' };
    return <span className={`badge ${config.class} py-1 px-2`}>{config.text}</span>;
  };

  const renderStars = (rating) => {
    const stars = [];
    const numRating = parseFloat(rating) || 0;
    const fullStars = Math.floor(numRating);
    for (let i = 0; i < 5; i++) {
      stars.push(
        <Icon
          key={i}
          name="star"
          size={14}
          className={i < fullStars ? "text-warning" : "text-muted"}
          style={i < fullStars ? { fill: 'currentColor' } : {}}
        />
      );
    }
    return stars;
  };

  const handleViewDetails = (beach) => {
    setSelectedBeach(beach);
    if (beach.id) loadBeachDetails(beach.id);
    setShowDetailsModal(true);
  };

  const handleEditBeach = (beach) => {
    setSelectedBeach(beach);
    if (beach.id) loadBeachDetails(beach.id);
    setShowEditModal(true);
  };

  const handleAddBeach = () => {
    setDetailedBeach(null);
    setSelectedBeach(null);
    setShowAddModal(true);
  };

  const handleDeleteBeach = (beach) => {
    if (window.confirm(`Ești sigur că vrei să ștergi plaja "${beach.nume}"? Această acțiune este ireversibilă.`)) {
      setIsSubmitting(true);
      plajaApi.deletePlajaUsingDELETE(beach.id, (error, data, response) => {
        setIsSubmitting(false);
        if (error) {
          console.error('Eroare:', error);
          alert(`Eroare la ștergere: ${error.message}`);
        } else {
          alert('Plaja ștearsă cu succes!');
          loadBeaches();
        }
      });
    }
  };

  // REFRESH PHOTOS FUNCTION
  const handleRefreshPhotos = (beach) => {
    if (window.confirm(`Actualizezi pozele pentru "${beach.nume}"?`)) {
      setIsSubmitting(true);

      // Call the refresh endpoint from backend
      const xhr = new XMLHttpRequest();
      xhr.open('POST', `http://localhost:8080/plaje/${beach.id}/refresh-details`);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.withCredentials = true;

      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          setIsSubmitting(false);
          if (xhr.status >= 200 && xhr.status < 300) {
            alert('Pozele au fost actualizate cu succes!');
            loadBeaches(); // Refresh the list
          } else {
            alert('Eroare la actualizarea pozelor: ' + xhr.status);
          }
        }
      };

      xhr.onerror = () => {
        setIsSubmitting(false);
        alert('Eroare de rețea la actualizarea pozelor');
      };

      xhr.send();
    }
  };

  // TOGGLE STATUS - Funcția corectată pentru schimbarea statusului
  const handleToggleStatus = (beach) => {
    console.log('🏖️ Beach data before toggle:', beach);

    // Payload complet cu relațiile ca obiecte (așa cum îi place backend-ului)
    const payload = {
      id: beach.id,
      denumire: beach.nume,
      descriere: beach.descriere || '',
      adresa: beach.adresa || '',
      numarSezlonguri: beach.numar_sezlonguri || 0,
      latitudine: beach.latitudine || 0,
      longitudine: beach.longitudine || 0,
      activ: !beach.activ, // Toggle statusul
      // Relațiile ca obiecte
      firma: { id: beach.firmaId },
      statiune: { id: beach.statiuneId },
      detaliiWeb: beach.detalii_web || {}
    };

    console.log('🚀 Toggle status payload:', payload);

    setIsSubmitting(true);
    plajaApi.updatePlajaUsingPUT(beach.id, payload, (error, data, response) => {
      setIsSubmitting(false);
      if (error) {
        console.error('Eroare la toggle status:', error);
        alert(`Eroare: ${error.message || 'Necunoscută'}`);
      } else {
        alert('Status schimbat cu succes!');
        loadBeaches();
      }
    });
  };
  // Layout Editor Functions (adaugă după handleToggleStatus)
  const initializeGrid = (rows, cols, existingLayout = null) => {
    const grid = [];
    for (let r = 0; r < rows; r++) {
      const row = [];
      for (let c = 0; c < cols; c++) {
        if (existingLayout && existingLayout[r] && existingLayout[r][c]) {
          row.push(existingLayout[r][c]);
        } else {
          row.push('G');
        }
      }
      grid.push(row);
    }
    return grid;
  };

  const countEquipment = (grid) => {
    const count = { S: 0, B: 0, U: 0, G: 0 };
    grid.forEach(row => {
      row.forEach(cell => {
        count[cell] = (count[cell] || 0) + 1;
      });
    });
    return count;
  };

  const handleCellClick = (rowIndex, colIndex) => {
    const newGrid = [...layoutData.grid];
    newGrid[rowIndex][colIndex] = selectedTool;

    const newCount = countEquipment(newGrid);

    setLayoutData(prev => ({
      ...prev,
      grid: newGrid,
      equipmentCount: newCount
    }));
  };

  const handleGridResize = (newRows, newCols) => {
    const newGrid = initializeGrid(newRows, newCols, layoutData.grid);
    const newCount = countEquipment(newGrid);

    setLayoutData(prev => ({
      ...prev,
      rows: newRows,
      cols: newCols,
      grid: newGrid,
      equipmentCount: newCount
    }));
  };

  // const openLayoutEditor = (beachData) => {
  //   const beach = beachData || selectedBeach;

  //   // Verifică dacă plaja are suficiente șezlonguri
  //   // Verifică dacă plaja are suficiente șezlonguri
  //   if (!beach.numar_sezlonguri || beach.numar_sezlonguri < 10) {
  //     alert('Plaja trebuie să aibă minimum 10 șezlonguri pentru a putea edita harta!');
  //     return;
  //   }
  //   if (beach.numar_sezlonguri > 100) {
  //     alert('Numărul maxim de șezlonguri pentru editor este 100!');
  //     return;
  //   }

  //   // Initialize layout data
  //   const defaultRows = 8;
  //   const defaultCols = Math.max(8, Math.ceil((beach.numar_sezlonguri || 0) / 6));

  //   let existingLayout = null;
  //   if (beach.layout) {
  //     existingLayout = beach.layout.grid;
  //   }

  //   const grid = initializeGrid(
  //     beach.layout?.rows || defaultRows,
  //     beach.layout?.cols || defaultCols,
  //     existingLayout
  //   );

  //   setLayoutData({
  //     rows: beach.layout?.rows || defaultRows,
  //     cols: beach.layout?.cols || defaultCols,
  //     grid: grid,
  //     equipmentCount: countEquipment(grid),
  //     prices: beach.layout?.prices || { S: 0, B: 0, U: 0 }
  //   });

  //   setShowLayoutEditor(true);
  // };


  const openLayoutEditor = (beachData) => {
    const beach = beachData || selectedBeach;
  
    if (!beach.numar_sezlonguri || beach.numar_sezlonguri < 10) {
      alert('Plaja trebuie să aibă minimum 10 șezlonguri pentru a putea edita harta!');
      return;
    }
    if (beach.numar_sezlonguri > 100) {
      alert('Numărul maxim de șezlonguri pentru editor este 100!');
      return;
    }
  
    const defaultRows = 8;
    const defaultCols = Math.max(8, Math.ceil((beach.numar_sezlonguri || 0) / 6));
  
    const loadFromDatabase = (echipamente) => {
      if (!echipamente || echipamente.length === 0) {
        // fallback: nu există echipamente → se generează layout implicit
        const grid = initializeGrid(defaultRows, defaultCols);
        setLayoutData({
          rows: defaultRows,
          cols: defaultCols,
          grid: grid,
          equipmentCount: countEquipment(grid),
          prices: { S: 0, B: 0, U: 0 }
        });
      } else {
        // construiește grid pe baza echipamentelor existente
        const grid = Array.from({ length: defaultRows }, () =>
          Array.from({ length: defaultCols }, () => 'G')
        );
        let pretB=0;
        let pretS=0;
        let pretU=0;
        echipamente.forEach((eq) => {
          const row = eq.pozitieLinie - 1;
          const col = eq.pozitieColoana - 1;
          
          let symbol = 'G';
          if (eq.tipEchipamentDenumire === 'Sezlong') 
          { 
            symbol = 'S';
            pretS=eq.pretCurent;
          }
          if (eq.tipEchipamentDenumire === 'Baldachin'){ 
            symbol = 'B';
            pretB=eq.pretCurent;
          }
          if (eq.tipEchipamentDenumire === 'Umbrela'){ 
            symbol = 'U';
            pretU=eq.pretCurent;
          }
          if (row >= 0 && row < defaultRows && col >= 0 && col < defaultCols) {
            grid[row][col] = symbol;
          }
        });
  
        setLayoutData({
          rows: defaultRows,
          cols: defaultCols,
          grid: grid,
          equipmentCount: countEquipment(grid),
          prices: { S: pretS, B: pretB, U: pretU } // sau poți extrage și prețurile dacă le ai, B: 0, U: 0 } // sau poți extrage și prețurile dacă le ai
        });
      }
  
      setShowLayoutEditor(true);
    };
  
    // 🔄 Încarcă din API
    echipamentApi.getEchipamenteByPlajaIdUsingGET(selectedBeach.id, (error, data, response) => {
      if (error) {
        console.error("❌ Eroare la încărcarea echipamentelor:", error);
        loadFromDatabase(null); // fallback
      } else {
        loadFromDatabase(data); // echipamentele vin din backend
      }
    });
  };
  

  const saveLayout = () => {
    const layoutToSave = {
      rows: layoutData.rows,
      cols: layoutData.cols,
      grid: layoutData.grid,
      equipmentCount: layoutData.equipmentCount,
      prices: layoutData.prices,
      lastModified: new Date().toISOString()
    };
    echipamentApi.deleteEchipamentPlajaByPlajaIdUsingDELETE(selectedBeach.id, (error, data, response) => {
      console.log(error);
    });
    let echipamentCounter = 1;
    layoutData.grid.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (equipmentTypes[cell]) {
          const { tipEchipamentId, name } = equipmentTypes[cell];
          const pretCurent = layoutData.prices[cell] || 0;
          const echipamentPlajaDTO = {
            plajaId:  selectedBeach.id,
            tipEchipamentId: tipEchipamentId,
            stareEchipamentId: 1,
            denumire: `${name}-${rowIndex + 1}-${colIndex + 1}-${selectedBeach.id}`,
            pozitieLinie: rowIndex + 1,
            pozitieColoana: colIndex + 1,
            activ: true,
            pretCurent:pretCurent,
            disponibil: true
          };
    
          echipamentApi.createEchipamentPlajaUsingPOST(echipamentPlajaDTO, (error, data, response) => {
            if (error) {
              console.error(`❌ Eroare la salvarea echipamentului ${echipamentPlajaDTO.denumire}:`, error);
            } else {
              console.log(`✅ Echipament salvat: ${echipamentPlajaDTO.denumire}`);
            }
          });
    
          echipamentCounter++;
        }
      });
    });
  
    console.log('layoutToSave',layoutToSave);
    // Update the beach in beaches array
    if (selectedBeach) {
      const updatedBeaches = beaches.map(beach => {
        if (beach.id === selectedBeach.id) {
          return { ...beach, layout: layoutToSave };
        }
        return beach;
      });
      setBeaches(updatedBeaches);
      
      // Update selectedBeach as well
      setSelectedBeach(prev => ({ ...prev, layout: layoutToSave }));
    }
  
    setShowLayoutEditor(false);
    alert('Layout-ul plajei a fost salvat cu succes!');
  };

  const clearGrid = () => {
    if (window.confirm('Ești sigur că vrei să ștergi tot layout-ul?')) {
      const newGrid = initializeGrid(layoutData.rows, layoutData.cols);
      setLayoutData(prev => ({
        ...prev,
        grid: newGrid,
        equipmentCount: countEquipment(newGrid)
      }));
    }
  };

  const autoArrangeEquipment = () => {
    const targetTotal = Math.min(selectedBeach?.numar_sezlonguri || 0, 100);
    if (targetTotal < 10) {
      alert('Numărul minim pentru auto-aranjare este 10!');
      return;
    }

    // Calculează dimensiunile optime pentru grilă
    const optimalCols = Math.ceil(Math.sqrt(targetTotal * 1.5));
    const optimalRows = Math.ceil(targetTotal / optimalCols) + 2; // +2 pentru spațiu extra

    const newGrid = initializeGrid(optimalRows, optimalCols);

    // Distribuie echipamentele: 70% sezlonguri, 30% baldachine
    const sezlongCount = Math.ceil(targetTotal * 0.7);
    const baldachinCount = targetTotal - sezlongCount;

    let placedSezlong = 0;
    let placedBaldachin = 0;

    // Plasează echipamentele în pattern organizat
    for (let r = 1; r < optimalRows - 1; r++) {
      for (let c = 0; c < optimalCols; c++) {
        if (placedSezlong + placedBaldachin >= targetTotal) break;

        // Pattern: 2 șezlonguri, 1 baldachin, 2 șezlonguri, 1 baldachin
        if ((c % 3 === 2) && placedBaldachin < baldachinCount) {
          newGrid[r][c] = 'B';
          placedBaldachin++;
        } else if (placedSezlong < sezlongCount) {
          newGrid[r][c] = 'S';
          placedSezlong++;
        }
      }
      if (placedSezlong + placedBaldachin >= targetTotal) break;
    }

    // Adaugă umbrele la fiecare 8 echipamente (opțional)
    const umbrellaInterval = 8;
    let equipmentCount = 0;
    for (let r = 0; r < optimalRows; r++) {
      for (let c = 0; c < optimalCols; c++) {
        if (newGrid[r][c] === 'S' || newGrid[r][c] === 'B') {
          equipmentCount++;
          if (equipmentCount % umbrellaInterval === 0) {
            // Încearcă să plasezi o umbrelă în apropierea echipamentului
            for (let dr = -1; dr <= 1; dr++) {
              for (let dc = -1; dc <= 1; dc++) {
                const nr = r + dr;
                const nc = c + dc;
                if (nr >= 0 && nr < optimalRows && nc >= 0 && nc < optimalCols && newGrid[nr][nc] === 'G') {
                  newGrid[nr][nc] = 'U';
                  break;
                }
              }
            }
          }
        }
      }
    }

    const newCount = countEquipment(newGrid);

    setLayoutData(prev => ({
      ...prev,
      rows: optimalRows,
      cols: optimalCols,
      grid: newGrid,
      equipmentCount: newCount,
      prices: prev.prices || { S: 0, B: 0, U: 0 }
    }));
    alert(`Auto-aranjare completă: ${newCount.S} șezlonguri + ${newCount.B} baldachine = ${newCount.S + newCount.B} total (target: ${targetTotal})`);
  };

  // MODAL DEFINITIONS
  const BeachDetailsModal = ({ show, onHide, beach, detailedData }) => {
    if (!show || !beach) return null;
    const currentBeachData = detailedData || beach;
    const detaliiWeb = currentBeachData.detalii_web_parsed || currentBeachData.detalii_web || {};

    const displayStatiune = currentBeachData.statiune?.denumire || statiuni.find(s => s.id === currentBeachData.statiuneId)?.denumire || 'N/A';
    const displayFirma = currentBeachData.firma?.denumire || firme.find(f => f.id === currentBeachData.firmaId)?.denumire || 'N/A';

    return (
      <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
        <div className="modal-dialog modal-xl">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                <Icon name="beach" size={24} className="me-2" />
                Detalii Plajă: {currentBeachData.denumire}
              </h5>
              <button type="button" className="btn-close" onClick={onHide}></button>
            </div>
            <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
              {modalLoading && !detailedData ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary mb-3"></div>
                  <p>Se încarcă...</p>
                </div>
              ) : currentBeachData ? (
                <div>
                  {detaliiWeb.photos?.length > 0 && (
                    <div className="mb-4">
                      <h6 className="fw-bold">Imagini Plajă</h6>
                      <div className="row g-2">
                        {detaliiWeb.photos.slice(0, 4).map((imgSrc, index) => (
                          <div key={index} className="col-md-3 col-6">
                            <img
                              src={imgSrc}
                              onError={(e) => e.target.src = 'https://placehold.co/300x200/CCCCCC/FFFFFF?text=Imagine+Indisponibila'}
                              alt={`Plajă ${index + 1}`}
                              className="img-fluid rounded"
                              style={{ height: '120px', objectFit: 'cover', width: '100%' }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="row">
                    <div className="col-md-6">
                      <h6 className="fw-bold mb-3">Informații Generale</h6>
                      <p className="mb-1"><strong className="fw-semibold">Adresă Plajă:</strong> {currentBeachData.adresa}</p>
                      <p className="mb-1"><strong className="fw-semibold">Latitudine:</strong> {currentBeachData.latitudine}</p>
                      <p className="mb-1"><strong className="fw-semibold">Longitudine:</strong> {currentBeachData.longitudine}</p>
                      <div className="mb-2">
                        <strong className="fw-semibold">Status:</strong> {getStatusBadge(currentBeachData.activ ? 'Activ' : 'Inactiv')}
                      </div>
                      <p className="mb-1"><strong className="fw-semibold">Descriere:</strong></p>
                      <p className="mb-2 text-muted" style={{ whiteSpace: 'pre-wrap' }}>{currentBeachData.descriere}</p>
                    </div>
                    <div className="col-md-6">
                      <h6 className="fw-bold mb-3">Detalii Suplimentare & Firmă</h6>
                      <p className="mb-1"><strong className="fw-semibold">Firmă Administrator:</strong> {displayFirma}</p>
                      <p className="mb-1"><strong className="fw-semibold">Număr Șezlonguri:</strong> {currentBeachData.numarSezlonguri || currentBeachData.numar_sezlonguri}</p>
                      <p className="mb-1">
                        <strong className="fw-semibold">Rating:</strong> {detaliiWeb.rating || 'N/A'}
                        {detaliiWeb.rating && renderStars(detaliiWeb.rating)}
                      </p>
                      <p className="mb-1">
                        <Icon name="phone" size={16} className="me-1" />
                        <strong className="fw-semibold">Telefon Plajă:</strong> {detaliiWeb.phone_number || 'N/A'}
                      </p>
                      <p className="mb-1">
                        <Icon name="globe" size={16} className="me-1" />
                        <strong className="fw-semibold">Website Plajă:</strong>
                        {detaliiWeb.website ? (
                          <a href={detaliiWeb.website} target="_blank" rel="noopener noreferrer" className="ms-1">
                            {detaliiWeb.website}
                          </a>
                        ) : ' N/A'}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-5">
                  <p className="text-muted">Nu s-au putut încărca detaliile.</p>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onHide}>Închide</button>
              <button type="button" className="btn btn-primary" onClick={() => { onHide(); handleEditBeach(currentBeachData); }}>
                <Icon name="edit" size={16} className="me-2" />Editează
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const BeachEditModal = ({ show, onHide, beach, detailedData }) => {
    const initialEditState = {
      denumire: '', descriere: '', adresa: '', activ: true, numar_sezlonguri: 0,
      latitudine: '', longitudine: '',
      statiuni_id: '', firma_id: '',
    };
    const [editData, setEditData] = useState(initialEditState);

    useEffect(() => {
      const sourceData = detailedData || beach?.originalData || beach;
      console.log('sourceData',detailedData);
      if (sourceData) {
        setEditData({
          denumire: sourceData.denumire || sourceData.nume || '',
          descriere: sourceData.descriere || '',
          adresa: sourceData.adresa || '',
          activ: sourceData.activ !== undefined ? sourceData.activ : true,
          numar_sezlonguri: sourceData.numarSezlonguri || sourceData.numar_sezlonguri || 0,
          latitudine: sourceData.latitudine || '',
          longitudine: sourceData.longitudine || '',
          statiuni_id: sourceData.statiune?.id || sourceData.statiuneId || '',
          firma_id: sourceData.firma?.id || sourceData.firmaId || '',
        });
      } else if (!show) {
        setEditData(initialEditState);
      }
    }, [detailedData, beach, show]);

    const handleInputChange = (e) => {
      const { name, value, type, checked } = e.target;
      let val = value;
      if (type === 'checkbox') val = checked;
      else if (type === 'number' || name === 'latitudine' || name === 'longitudine') {
        val = value === '' ? '' : parseFloat(value);
        if (isNaN(val) && value !== '' && value !== '-') val = editData[name];
      }
      setEditData(prev => ({ ...prev, [name]: val }));
    };

    const handleSave = async () => {
      const sourceForId = detailedData || beach?.originalData || beach;
      if (!sourceForId || !sourceForId.id) {
        alert("ID-ul plajei lipsește. Nu se poate salva.");
        return;
      }

      // Payload corect cu relațiile ca obiecte
      const plajaActualizataPayload = {
        id: sourceForId.id,
        denumire: editData.denumire,
        descriere: editData.descriere,
        adresa: editData.adresa,
        numarSezlonguri: parseInt(editData.numar_sezlonguri, 10) || 0,
        latitudine: parseFloat(editData.latitudine) || 0.0,
        longitudine: parseFloat(editData.longitudine) || 0.0,
        activ: editData.activ,
        // Relațiile ca obiecte
        firma: { id: parseInt(editData.firma_id, 10) },
        statiune: { id: parseInt(editData.statiuni_id, 10) },
        detaliiWeb: sourceForId.detaliiWeb || sourceForId.detalii_web || {}
      };

      console.log('Salvare modificări plajă (payload):', plajaActualizataPayload);

      setIsSubmitting(true);
      plajaApi.updatePlajaUsingPUT(sourceForId.id, plajaActualizataPayload, (error, data, response) => {
        setIsSubmitting(false);
        if (error) {
          console.error('Eroare:', error);
          alert(`Eroare la actualizare: ${error.message}`);
        } else {
          alert('Plaja actualizată cu succes!');
          onHide();
          loadBeaches();
        }
      });
    };

    if (!show) return null;
    const currentBeachName = editData.denumire || "plaja selectată";

    return (
      <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
        <div className="modal-dialog modal-xl">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                <Icon name="edit" size={24} className="me-2" />
                Editează Plaja: {currentBeachName}
              </h5>
              <button type="button" className="btn-close" onClick={onHide}></button>
            </div>
            <div className="modal-body" style={{ maxHeight: '75vh', overflowY: 'auto' }}>
              {modalLoading && !editData.denumire ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary mb-3"></div>
                  <p>Se încarcă...</p>
                </div>
              ) : (
                <>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="edit-denumire" className="form-label fw-semibold">Denumire Plajă</label>
                      <input
                        type="text"
                        className="form-control"
                        id="edit-denumire"
                        name="denumire"
                        value={editData.denumire}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="edit-numar_sezlonguri" className="form-label fw-semibold">Număr Șezlonguri</label>
                      <PositiveNumberInput  className="form-control"
                        id="edit-numar_sezlonguri"
                        name="numar_sezlonguri"
                        value={editData.numar_sezlonguri}
                        onChange={handleInputChange}
                        min="10"
                        max="100" />

                      {editData.numar_sezlonguri > 100 && (
                        <div className="text-danger small mt-1">
                          <Icon name="info" size={12} className="me-1" />
                          Numărul maxim de șezlonguri este 100
                        </div>
                      )}
                      {editData.numar_sezlonguri < 10 ? (
                        <div className="alert alert-warning small mb-2">
                          <Icon name="info" size={14} className="me-1" />
                          <strong>Minim 10 șezlonguri</strong> pentru a putea edita harta plajei
                        </div>
                      ) : (
                        <button
                          type="button"
                          className="btn btn-outline-primary btn-sm w-100 mb-2"
                          onClick={() => openLayoutEditor(selectedBeach)}
                        >
                          <Icon name="grid" size={14} className="me-1" />
                          Editează Harta Plajei
                        </button>
                      )}

                      {selectedBeach?.layout && (
                        <div className="mt-1">
                          <small className="text-success">
                            ✓ Layout configurat ({selectedBeach.layout.rows}×{selectedBeach.layout.cols})
                          </small>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="edit-adresa" className="form-label fw-semibold">Adresă Plajă</label>
                    <input
                      type="text"
                      className="form-control"
                      id="edit-adresa"
                      name="adresa"
                      value={editData.adresa}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="edit-descriere" className="form-label fw-semibold">Descriere</label>
                    <textarea
                      className="form-control"
                      id="edit-descriere"
                      name="descriere"
                      rows="3"
                      value={editData.descriere}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="edit-latitudine" className="form-label fw-semibold">Latitudine</label>
                      <PositiveNumberInput 
                       min={0}
                       step="any"
                       className="form-control"
                       id="edit-latitudine"
                       name="latitudine"
                       value={editData.latitudine}
                       onChange={handleInputChange}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="edit-longitudine" className="form-label fw-semibold">Longitudine</label>
                      <PositiveNumberInput 
                      step="any"
                      className="form-control"
                      id="edit-longitudine"
                      name="longitudine"
                      value={editData.longitudine}
                      onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="edit-statiuni_id" className="form-label fw-semibold">Stațiune</label>
                      <select
                        id="edit-statiuni_id"
                        name="statiuni_id"
                        className="form-select"
                        value={editData.statiuni_id}
                        onChange={handleInputChange}
                      >
                        <option value="">Selectează stațiunea...</option>
                        {statiuni.map(st => (
                          <option key={st.id} value={st.id}>{st.denumire}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="edit-firma_id" className="form-label fw-semibold">Firmă</label>
                      <select
                        id="edit-firma_id"
                        name="firma_id"
                        className="form-select"
                        value={editData.firma_id}
                        onChange={handleInputChange}
                      >
                        <option value="">Selectează firma...</option>
                        {firme.map(f => (
                          <option key={f.id} value={f.id}>{f.denumire}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="mb-3 form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      role="switch"
                      id="edit-activ"
                      name="activ"
                      checked={editData.activ}
                      onChange={handleInputChange}
                    />
                    <label className="form-check-label fw-semibold" htmlFor="edit-activ">Plajă activă</label>
                  </div>
                  <div className="alert alert-info small mt-2">
                    Notă: Modificarea detaliilor din câmpul JSON `detaliiWeb` (ex: rating, telefon) nu este implementată în acest formular.
                    Acestea vor rămâne la valorile originale.
                  </div>
                </>
              )}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-outline-secondary" onClick={onHide} disabled={isSubmitting || modalLoading}>
                Anulează
              </button>
              <button type="button" className="btn btn-primary" onClick={handleSave} disabled={isSubmitting || modalLoading}>
                {isSubmitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Se salvează...
                  </>
                ) : (
                  <>
                    <Icon name="save" size={16} className="me-2" />
                    Salvează
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const BeachAddModal = ({ show, onHide }) => {
    const initialAddData = {
      denumire: '', descriere: '', adresa: '', activ: true, numar_sezlonguri: 0,
      latitudine: '', longitudine: '',
      statiuni_id: '', selectedFirmaId: '',
    };
    const [addData, setAddData] = useState(initialAddData);

    useEffect(() => {
      if (show) {
        setAddData(initialAddData);
      }
    }, [show]);

    const handleAddInputChange = (e) => {
      const { name, value, type, checked } = e.target;
      let val = value;
      if (type === 'checkbox') val = checked;
      else if (type === 'number' || name === 'latitudine' || name === 'longitudine' || name === 'numar_sezlonguri') {
        val = value === '' ? '' : parseFloat(value);
        if (isNaN(val) && value !== '' && value !== '-') val = addData[name];
      }
      setAddData(prev => ({ ...prev, [name]: val }));
    };

    const handleSaveNew = async () => {
      if (!addData.denumire.trim()) {
        alert('Numele plajei este obligatoriu!');
        return;
      }
      if (!addData.statiuni_id) {
        alert('Selectează o stațiune!');
        return;
      }
      if (addData.latitudine === '' || addData.longitudine === '') {
        alert('Latitudinea și longitudinea sunt obligatorii!');
        return;
      }
      if (addData.numar_sezlonguri === '') {
        alert('Numărul de șezlonguri este obligatoriu!');
        return;
      }
      if (addData.numar_sezlonguri < 10) {
        alert('Numărul minim de șezlonguri este 10!');
        return;
      }
      if (!addData.selectedFirmaId) {
        alert('Selectează o firmă!');
        return;
      }

      setIsSubmitting(true);

      // Validări suplimentare și conversii explicite
      const latVal = parseFloat(addData.latitudine);
      const lngVal = parseFloat(addData.longitudine);
      const sezlonguriVal = parseInt(addData.numar_sezlonguri, 10);
      const statiuneIdVal = parseInt(addData.statiuni_id, 10);
      const firmaIdVal = parseInt(addData.selectedFirmaId, 10);

      console.log('🔍 Debugging values before payload:');
      console.log('latitudine:', addData.latitudine, '→', latVal);
      console.log('longitudine:', addData.longitudine, '→', lngVal);
      console.log('numar_sezlonguri:', addData.numar_sezlonguri, '→', sezlonguriVal);
      console.log('statiuni_id:', addData.statiuni_id, '→', statiuneIdVal);
      console.log('selectedFirmaId:', addData.selectedFirmaId, '→', firmaIdVal);

      // Verifică valorile NaN
      if (isNaN(latVal) || isNaN(lngVal)) {
        alert('Latitudinea și longitudinea trebuie să fie numere valide!');
        setIsSubmitting(false);
        return;
      }
      if (isNaN(sezlonguriVal)) {
        alert('Numărul de șezlonguri trebuie să fie un număr valid!');
        setIsSubmitting(false);
        return;
      }
      if (isNaN(statiuneIdVal) || isNaN(firmaIdVal)) {
        alert('ID-urile pentru stațiune și firmă trebuie să fie valide!');
        setIsSubmitting(false);
        return;
      }

      const newBeachPayload = {
        denumire: addData.denumire.trim(),
        descriere: addData.descriere.trim() || "Fără descriere specificată.",
        adresa: addData.adresa.trim() || "Adresă nespecificată",
        numarSezlonguri: sezlonguriVal,
        latitudine: latVal, // Backend will convert to BigDecimal
        longitudine: lngVal, // Backend will convert to BigDecimal
        activ: Boolean(addData.activ),
        // Relațiile ca obiecte
        statiune: { id: statiuneIdVal },
        firma: { id: firmaIdVal },
        detaliiWeb: {
          rating: 0,
          pretMediu: 0,
          manager: "Nespecificat",
          phone_number: "Nespecificat",
          photos: [],
        }
      };

      console.log('Payload pentru adăugare plajă nouă:', newBeachPayload);

      plajaApi.createPlajaUsingPOST(newBeachPayload, (error, data, response) => {
        setIsSubmitting(false);
        if (error) {
          console.error('Eroare:', error);
          alert(`Eroare la adăugare: ${error.message}`);
        } else {
          alert('Plaja adăugată cu succes!');
          onHide();
          loadBeaches();
          loadAllFirme(); // Refresh companies list after adding
        }
      });
    };

    if (!show) return null;

    return (
      <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
        <div className="modal-dialog modal-xl">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                <Icon name="plus" size={24} className="me-2" />
                Adaugă Plajă Nouă
              </h5>
              <button type="button" className="btn-close" onClick={onHide}></button>
            </div>
            <div className="modal-body" style={{ maxHeight: '75vh', overflowY: 'auto' }}>
              <h6 className="fw-bold border-bottom pb-2 mb-3">Detalii Plajă</h6>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="add-denumire" className="form-label fw-semibold">
                    Nume Plajă <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="add-denumire"
                    name="denumire"
                    value={addData.denumire}
                    onChange={handleAddInputChange}
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label htmlFor="add-numar_sezlonguri" className="form-label fw-semibold">
                    Număr Șezlonguri <span className="text-danger">*</span>
                  </label>
                  <PositiveNumberInput 
                  className="form-control"
                  id="add-numar_sezlonguri"
                  name="numar_sezlonguri"
                  value={addData.numar_sezlonguri}
                  onChange={handleAddInputChange}
                  min="10"
                  max="100"
                  required
                  />
                  {addData.numar_sezlonguri > 0 && addData.numar_sezlonguri < 10 && (
                    <div className="text-danger small mt-1">
                      <Icon name="info" size={12} className="me-1" />
                      Numărul minim de șezlonguri este 10
                    </div>
                  )}
                </div>
              </div>
              <div className="mb-3">
                <label htmlFor="add-adresa" className="form-label fw-semibold">Adresă Plajă</label>
                <input
                  type="text"
                  className="form-control"
                  id="add-adresa"
                  name="adresa"
                  value={addData.adresa}
                  onChange={handleAddInputChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="add-descriere" className="form-label fw-semibold">
                  Descriere Plajă <span className="text-danger">*</span>
                </label>
                <textarea
                  className="form-control"
                  id="add-descriere"
                  name="descriere"
                  rows="2"
                  value={addData.descriere}
                  onChange={handleAddInputChange}
                  required
                />
              </div>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="add-latitudine" className="form-label fw-semibold">
                    Latitudine <span className="text-danger">*</span>
                  </label>
                 <PositiveNumberInput 
                 step="any"
                 className="form-control"
                 id="add-latitudine"
                 name="latitudine"
                 value={addData.latitudine}
                 onChange={handleAddInputChange}
                 required
                 />
                </div>
                <div className="col-md-6 mb-3">
                  <label htmlFor="add-longitudine" className="form-label fw-semibold">
                    Longitudine <span className="text-danger">*</span>
                  </label>
                  <PositiveNumberInput 
                   step="any"
                   className="form-control"
                   id="add-longitudine"
                   name="longitudine"
                   value={addData.longitudine}
                   onChange={handleAddInputChange}
                   required
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="add-statiuni_id" className="form-label fw-semibold">
                    Stațiune <span className="text-danger">*</span>
                  </label>
                  <select
                    id="add-statiuni_id"
                    name="statiuni_id"
                    className="form-select"
                    value={addData.statiuni_id}
                    onChange={handleAddInputChange}
                    required
                  >
                    <option value="">Selectează stațiunea...</option>
                    {statiuni.map(st => (
                      <option key={st.id} value={st.id}>{st.denumire}</option>
                    ))}
                  </select>
                </div>
                <div className="col-md-6 mb-3">
                  <label htmlFor="add-selectedFirmaId" className="form-label fw-semibold">
                    Firmă <span className="text-danger">*</span>
                  </label>
                  <select
                    id="add-selectedFirmaId"
                    name="selectedFirmaId"
                    className="form-select"
                    value={addData.selectedFirmaId}
                    onChange={handleAddInputChange}
                    required
                  >
                    <option value="">Alege o firmă...</option>
                    {firme.map(f => (
                      <option key={f.id} value={f.id}>
                        {f.denumire} {f.cui ? `(CUI: ${f.cui})` : `(ID: ${f.id})`}
                      </option>
                    ))}
                  </select>
                  {firme.length === 0 && (
                    <div className="text-muted small mt-1">
                      Nu există firme disponibile. <button type="button" className="btn btn-link btn-sm p-0" onClick={loadAllFirme}>Reîncarcă lista</button>
                    </div>
                  )}
                </div>
              </div>
              <div className="mb-3 form-check form-switch">
                <input
                  className="form-check-input"
                  type="checkbox"
                  role="switch"
                  id="add-activ"
                  name="activ"
                  checked={addData.activ}
                  onChange={handleAddInputChange}
                />
                <label className="form-check-label fw-semibold" htmlFor="add-activ">Plajă activă</label>
              </div>
              <div className="alert alert-warning small mt-3 py-2">
                <strong>⚠️ Atenție:</strong> După salvare, sistemul va căuta automat informații suplimentare pe Google Places
                (rating, review-uri, poze), dar <strong>va păstra datele introduse manual</strong> pentru nume și adresă.
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-outline-secondary" onClick={onHide} disabled={isSubmitting}>
                Anulează
              </button>
              <button type="button" className="btn btn-primary" onClick={handleSaveNew} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Se adaugă...
                  </>
                ) : (
                  <>
                    <Icon name="save" size={16} className="me-2" />
                    Adaugă Plaja
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // JSX Principal
 if (loading && beaches.length === 0) {
    return (
      <div className="container-fluid py-3 px-lg-4">
        <div className="text-center py-5">
          <div className="spinner-border text-primary mb-3"></div>
          <p>Se încarcă plajele...</p>
        </div>
      </div>
    );
  }

  if (error && beaches.length === 0) {
    return (
      <div className="container-fluid py-3 px-lg-4">
        <div className="alert alert-danger text-center">
          <h5>Eroare la încărcare</h5>
          <p>{error}</p>
          <button className="btn btn-primary" onClick={handleRefresh}>
            <Icon name="refresh" size={16} className="me-1" />Încearcă din nou
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-3 px-lg-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
          <h1 className="h3 fw-bold mb-0">Management Plaje</h1>
          <p className="text-muted small mb-0">Administrează plajele, stațiunile și firmele asociate.</p>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-secondary btn-sm" onClick={handleRefresh} disabled={loading || isSubmitting}>
            <Icon name="refresh" size={16} className="me-1" />Reîmprospătează
          </button>
          <button className="btn btn-primary btn-sm" onClick={handleAddBeach} disabled={isSubmitting}>
            <Icon name="plus" size={16} className="me-1" />Adaugă Plajă Nouă
          </button>
         
        </div>
      </div>

    

      {/* Statistici */}
      {error && (
        <div className="alert alert-warning alert-dismissible fade show small" role="alert">
          <strong>Atenție:</strong> {error}
          <button type="button" className="btn-close" onClick={() => setError(null)} aria-label="Close"></button>
        </div>
      )}

      <div className="row g-3 mb-4">
        
        <div className="row g-3 mb-4">
        <div className="col-sm-6 col-lg-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body d-flex align-items-center p-3">
              <div className="p-3 rounded-circle bg-primary bg-opacity-10 me-3">
                <Icon name="beach" size={22} className="text-primary" />
              </div>
              <div>
                <h5 className="fw-bold mb-0">{beaches.length}</h5>
                <small className="text-muted">Total Plaje</small>
              </div>
            </div>
          </div>
        </div>
        <div className="col-sm-6 col-lg-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body d-flex align-items-center p-3">
              <div className="p-3 rounded-circle bg-success bg-opacity-10 me-3">
                <Icon name="check" size={22} className="text-success" />
              </div>
              <div>
                <h5 className="fw-bold mb-0">{beaches.filter(b => b.activ).length}</h5>
                <small className="text-muted">Plaje Active</small>
              </div>
            </div>
          </div>
        </div>
        <div className="col-sm-6 col-lg-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body d-flex align-items-center p-3">
              <div className="p-3 rounded-circle bg-secondary bg-opacity-10 me-3">
                <Icon name="x" size={22} className="text-secondary" />
              </div>
              <div>
                <h5 className="fw-bold mb-0">{beaches.filter(b => !b.activ).length}</h5>
                <small className="text-muted">Plaje Inactive</small>
              </div>
            </div>
          </div>
        </div>
        <div className="col-sm-6 col-lg-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body d-flex align-items-center p-3">
              <div className="p-3 rounded-circle bg-info bg-opacity-10 me-3">
                <Icon name="umbrella" size={22} className="text-info" />
              </div>
              <div>
                <h5 className="fw-bold mb-0">
                  {beaches.reduce((sum, b) => sum + (Number(b.numar_sezlonguri) || 0), 0)}
                </h5>
                <small className="text-muted">Total Șezlonguri</small>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>

      {/* Filtre */}
      <div className="card border-0 shadow-sm p-3 mb-4">
        <div className="row g-3 align-items-center">
          <div className="col-xl-5 col-lg-4 col-md-12">
            <div className="input-group">
              <span className="input-group-text text-muted">
                <Icon name="search" size={16} />
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Caută plajă, stațiune, firmă..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="col-xl-3 col-lg-4 col-md-6">
            <select className="form-select" value={selectedResort} onChange={(e) => setSelectedResort(e.target.value)}>
              <option value="all">Toate Stațiunile</option>
              {statiuni.map(st => (
                <option key={st.id} value={st.id}>{st.denumire}</option>
              ))}
            </select>
          </div>
          <div className="col-xl-3 col-lg-4 col-md-6">
            <select className="form-select" value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
              <option value="all">Toate Statusurile</option>
              <option value="Activ">Activ</option>
              <option value="Inactiv">Inactiv</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lista de plaje */}
      <div className="row g-4">
        {filteredBeaches.length > 0 ? filteredBeaches.map(beach => (
          <div key={beach.id} className="col-md-6 col-xl-4 d-flex">
            <div className="card shadow-sm border-0 h-100 w-100 overflow-hidden">
              {/* Header cu imagine de fundal */}
              <div
                className={`card-header position-relative ${beach.activ ? 'bg-primary' : 'bg-secondary'} text-white p-0`}
                style={{
                  minHeight: '140px',
                  background: beach.detalii_web?.photos?.[0]
                    ? `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url(${beach.detalii_web.photos[0]}) center/cover`
                    : undefined
                }}
              >
                <div className="p-3 h-100 d-flex flex-column justify-content-between">
                  <div className="d-flex justify-content-between align-items-start">
                    <div className="flex-grow-1">
                      <h5 className="fw-bold mb-1 text-white" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}>
                        {beach.nume}
                      </h5>
                      <div className="d-flex align-items-center mb-2 small text-white-50">
                        <Icon name="mapPin" size={14} className="me-1 flex-shrink-0" />
                        <span className="text-truncate">{beach.statiune}</span>
                      </div>
                    </div>
                    {getStatusBadge(beach.status)}
                  </div>

                  <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center">
                      {renderStars(beach.detalii_web?.rating || 0)}
                      <span className="ms-2 fw-semibold text-white">
                        {parseFloat(beach.detalii_web?.rating || 0).toFixed(1)}
                      </span>
                    </div>
                    {beach.detalii_web?.temperature && (
                      <div className="d-flex align-items-center text-white-50 small">
                        <Icon name="thermometer" size={14} className="me-1" />
                        <span>{Math.round(beach.detalii_web.temperature)}°C</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Body cu informații detaliate */}
              <div className="card-body p-3 d-flex flex-column">
              
                
                {/* Statistici principale */}
                <div className="row g-2 mb-3">
                  <div className="col-4 text-center">
                    <div className="p-2 bg-light rounded">
                      <Icon name="umbrella" size={20} className="text-primary mb-1" />
                      <div className="fw-bold text-primary">{beach.numar_sezlonguri}</div>
                      <small className="text-muted" style={{ fontSize: '0.7rem' }}>Șezlonguri</small>
                    </div>
                  </div>
                  <div className="col-4 text-center">
                    <div className="p-2 bg-light rounded">
                      <Icon name="users" size={20} className="text-success mb-1" />
                      <div className="fw-bold text-success">
                        {beach.numar_sezlonguri ? Math.round(beach.numar_sezlonguri * 2.2) : 0}
                      </div>
                      <small className="text-muted" style={{ fontSize: '0.7rem' }}>Capacitate</small>
                    </div>
                  </div>
                  <div className="col-4 text-center">
                    <div className="p-2 bg-light rounded">
                      <Icon name="star" size={20} className="text-warning mb-1" />
                      <div className="fw-bold text-warning">
                        {beach.detalii_web?.rating ? `${parseFloat(beach.detalii_web.rating).toFixed(1)}` : 'N/A'}
                      </div>
                      <small className="text-muted" style={{ fontSize: '0.7rem' }}>Rating</small>
                    </div>
                  </div>
                </div>

                {/* Restul conținutului cardului... */}
                {/* Butoane de acțiune */}
                <div className="mt-auto">
                  <div className="d-grid gap-2 mb-2">
                    <div className="btn-group" role="group">
                      <button
                        className="btn btn-outline-primary btn-sm flex-fill"
                        onClick={() => handleViewDetails(beach)}
                        disabled={isSubmitting}
                      >
                        <Icon name="eye" size={14} className="me-1" />
                        Detalii
                      </button>
                      <button
                        className="btn btn-outline-secondary btn-sm flex-fill"
                        onClick={() => handleEditBeach(beach)}
                        disabled={isSubmitting}
                      >
                        <Icon name="edit" size={14} className="me-1" />
                        Editează
                      </button>
                    </div>
                  </div>

                  <div className="d-grid gap-2">
                    <div className="btn-group" role="group">
                      <button
                        className={`btn btn-sm flex-fill ${beach.activ ? 'btn-outline-warning' : 'btn-outline-success'}`}
                        onClick={() => handleToggleStatus(beach)}
                        disabled={isSubmitting}
                      >
                        <Icon name={beach.activ ? 'x' : 'check'} size={14} className="me-1" />
                        {isSubmitting && selectedBeach?.id === beach.id ? 'Se procesează...' : (beach.activ ? 'Dezactivează' : 'Activează')}
                      </button>
                      <button
                        title="Șterge Plaja"
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => handleDeleteBeach(beach)}
                        disabled={isSubmitting}
                        style={{ maxWidth: '60px' }}
                      >
                        <Icon name="trash" size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )) : (
          !loading && (
            <div className="col-12">
              <div className="card shadow-sm border-0">
                <div className="card-body text-center py-5">
                  <Icon name="search" size={48} className="text-muted mb-3" />
                  <h5 className="text-muted">Nicio plajă nu corespunde filtrelor actuale.</h5>
                  <p className="text-muted small">Încearcă să ajustezi căutarea sau filtrele.</p>
                </div>
              </div>
            </div>
          )
        )}
      </div>

      {/* Modaluri */}
      {showDetailsModal && selectedBeach && (
        <BeachDetailsModal
          show={showDetailsModal}
          onHide={() => {
            setShowDetailsModal(false);
            setDetailedBeach(null);
          }}
          beach={selectedBeach}
          detailedData={detailedBeach}
        />
      )}

      {showEditModal && (selectedBeach || detailedBeach) && (
        <BeachEditModal
          show={showEditModal}
          onHide={() => {
            setShowEditModal(false);
            setDetailedBeach(null);
          }}
          beach={selectedBeach}
          detailedData={detailedBeach}
        />
      )}

      {showAddModal && (
        <BeachAddModal
          show={showAddModal}
          onHide={() => setShowAddModal(false)}
        />

      )}
      {/* Beach Layout Editor Modal */}
      {showLayoutEditor && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.8)' }}>
          <div className="modal-dialog modal-xl">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <Icon name="grid" size={24} className="me-2" />
                  Editor Layout Plajă - {selectedBeach?.nume || 'Plaja selectată'}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowLayoutEditor(false)}
                ></button>
              </div>

              <div className="modal-body" style={{ maxHeight: '80vh', overflowY: 'auto' }}>
                {/* Controls */}
                <div className="row mb-4">
                  <div className="col-md-8">
                    <div className="card bg-light">
                      <div className="card-body">
                        <h6 className="fw-bold mb-3">🛠️ Instrumente de Editare</h6>

                        <div className="row g-2 mb-3">
                          {Object.entries(equipmentTypes).map(([key, type]) => (
                            <div key={key} className="col-6 col-md-3">
                              <button
                                className={`btn w-100 ${selectedTool === key ? 'btn-primary' : 'btn-outline-secondary'}`}
                                onClick={() => setSelectedTool(key)}
                                style={{
                                  borderColor: type.color,
                                  backgroundColor: selectedTool === key ? type.color : 'transparent',
                                  color: selectedTool === key ? 'white' : type.color
                                }}
                              >
                                <div>{type.icon}</div>
                                <small>{type.name}</small>
                              </button>
                            </div>
                          ))}
                        </div>

                        <div className="row g-2">
                          <div className="col-6">
                            <button
                              className="btn btn-outline-warning btn-sm w-100"
                              onClick={autoArrangeEquipment}
                            >
                              <Icon name="refresh" size={14} className="me-1" />
                              Auto-Aranjare
                            </button>
                          </div>
                          <div className="col-6">
                            <button
                              className="btn btn-outline-danger btn-sm w-100"
                              onClick={clearGrid}
                            >
                              <Icon name="x" size={14} className="me-1" />
                              Șterge Tot
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Grid Editor */}
                <div className="card">
                  <div className="card-header d-flex justify-content-between align-items-center bg-primary text-white">
                    <h6 className="mb-0">🌊 MAREA / OCEAN</h6>
                    <small>
                      Grid: {layoutData.rows} × {layoutData.cols} |
                      Instrument: {equipmentTypes[selectedTool].icon} {equipmentTypes[selectedTool].name}
                    </small>
                  </div>
                  <div className="card-body">
                    <div
                      className="beach-grid mx-auto"
                      style={{
                        display: 'grid',
                        gridTemplateColumns: `repeat(${layoutData.cols}, 1fr)`,
                        gap: '2px',
                        maxWidth: 'fit-content',
                        border: '2px solid #3498db',
                        padding: '10px',
                        borderRadius: '8px',
                        backgroundColor: '#f8f9fa'
                      }}
                    >
                      {layoutData.grid.map((row, rowIndex) =>
                        row.map((cell, colIndex) => (
                          <div
                            key={`${rowIndex}-${colIndex}`}
                            className="beach-cell"
                            onClick={() => handleCellClick(rowIndex, colIndex)}
                            style={{
                              width: '30px',
                              height: '30px',
                              backgroundColor: equipmentTypes[cell]?.color || '#ecf0f1',
                              border: '1px solid #bdc3c7',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '12px',
                              fontWeight: 'bold',
                              color: cell === 'G' ? '#7f8c8d' : 'white',
                              transition: 'all 0.2s ease',
                              userSelect: 'none',
                              borderRadius: '4px',
                              boxShadow: cell !== 'G' ? '0 2px 4px rgba(0,0,0,0.1)' : 'none'
                            }}
                            onMouseEnter={(e) => {
                              e.target.style.transform = 'scale(1.1)';
                              e.target.style.zIndex = '10';
                              e.target.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.transform = 'scale(1)';
                              e.target.style.zIndex = '1';
                              e.target.style.boxShadow = cell !== 'G' ? '0 2px 4px rgba(0,0,0,0.1)' : 'none';
                            }}
                            title={`${equipmentTypes[cell]?.name} - Poziția (${rowIndex + 1}, ${colIndex + 1})`}
                          >
                            {cell}
                          </div>
                        ))
                      )}
                    </div>

                    <div className="mt-3 alert alert-info small">
                      <div className="d-flex align-items-start">
                        <Icon name="info" size={16} className="me-2 mt-1 text-info" />
                        <div>
                          <strong>Instrucțiuni de utilizare:</strong>
                          <ul className="mb-0 mt-1 ps-3">
                            <li>Alege un tip de echipament din panoul de instrumente</li>
                            <li>Fă clic pe celulele din grilă pentru a plasa echipamentele</li>
                            <li>Modifică dimensiunile grilei pentru a se potrivi cu plaja ta</li>
                            <li>Folosește "Auto-Aranjare" pentru un layout rapid</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                  </div>

                  <div className="col-md-4">
                    <div className="card">
                      <div className="card-body">
                        <h6 className="fw-bold mb-3">📊 Statistici Layout</h6>

                        {Object.entries(equipmentTypes).map(([key, type]) => (
                          <div key={key} className="d-flex justify-content-between align-items-center mb-2">
                            <span className="d-flex align-items-center">
                              <span style={{ color: type.color }} className="me-2">{type.icon}</span>
                              {type.name}:
                            </span>
                            <span className="fw-bold badge" style={{ backgroundColor: type.color, color: 'white' }}>
                              {layoutData.equipmentCount[key] || 0}
                            </span>
                          </div>
                        ))}

                        <hr />
                        <div className="row g-2 mt-3">
                          <div className="col-6">
                            <label className="form-label small">Rânduri:</label>
                            <PositiveNumberInput
                              // type="number"
                              className="form-control form-control-sm"
                              value={layoutData.rows}
                              onChange={(e) => {
                                const newRows = Math.max(3, Math.min(20, parseInt(e.target.value) || 3));
                                handleGridResize(newRows, layoutData.cols);
                              }}
                              min="3"
                              max="20"
                            />

                           
                          </div>
                          <div className="col-6">
                            <label className="form-label small">Coloane:</label>
                            <PositiveNumberInput
                              className="form-control form-control-sm"
                              value={layoutData.cols}
                              onChange={(e) => {
                                const newCols = Math.max(3, Math.min(30, parseInt(e.target.value) || 3));
                                handleGridResize(layoutData.rows, newCols);
                              }}
                              min="3"
                              max="30"
                            />
                          </div>
                        </div>

                        <div className="mt-3">
                          <small className="text-muted">
                            Target: <strong>{selectedBeach?.numar_sezlonguri || 0}</strong> șezlonguri (max 100)
                          </small>
                        </div>

                        <hr />
                        <h6 className="fw-bold mb-3">💰 Prețuri Echipamente</h6>
                        <div className="row g-2">
                          <div className="col-12">
                            <label className="form-label small">Preț Șezlong (RON):</label>
                            <PositiveNumberInput
                              // type="number"
                              className="form-control form-control-sm"
                              value={layoutData.prices?.S || 0}
                              onChange={(e) => setLayoutData(prev => ({
                                ...prev,
                                prices: { ...prev.prices, S: parseFloat(e.target.value) || 0 }
                              }))}
                              min="0"
                              step="0.5"
                            />
                           
                          </div>
                          <div className="col-12">
                            <label className="form-label small">Preț Baldachin (RON):</label>
                            <PositiveNumberInput
                              // type="number"
                              className="form-control form-control-sm"
                              value={layoutData.prices?.B || 0}
                              onChange={(e) => setLayoutData(prev => ({
                                ...prev,
                                prices: { ...prev.prices, B: parseFloat(e.target.value) || 0 }
                              }))}
                              min="0"
                              step="0.5"
                            />
                            
                          </div>
                          <div className="col-12">
                            <label className="form-label small">Preț Umbrelă (RON):</label>
                            <PositiveNumberInput
                              // type="number"
                              className="form-control form-control-sm"
                              value={layoutData.prices?.U || 0}
                              onChange={(e) => setLayoutData(prev => ({
                                ...prev,
                                prices: { ...prev.prices, U: parseFloat(e.target.value) || 0 }
                              }))}
                              min="0"
                              step="0.5"
                            />
                           
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowLayoutEditor(false)}
                >
                  Anulează
                </button>
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={saveLayout}
                >
                  <Icon name="save" size={16} className="me-2" />
                  Salvează Layout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BeachesManagement;