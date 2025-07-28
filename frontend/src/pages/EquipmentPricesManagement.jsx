import React, { useState, useEffect } from 'react';
import ApiClient from "../api/src/ApiClient";
import PlajaControllerApi from "../api/src/api/PlajaControllerApi";
import FirmaControllerApi from "../api/src/api/FirmaControllerApi";
import StatiuneControllerApi from "../api/src/api/StatiuneControllerApi";
import EchipamentPlajaControllerApi from "../api/src/api/EchipamentPlajaControllerApi";
import TipEchipamentPlajaControllerApi from "../api/src/api/TipEchipamentPlajaControllerApi";
import PreturiControllerApi from "../api/src/api/PreturiControllerApi";
import apiService from "../services/ApiService.js";
import PositiveNumberInput from '../components/common/PositiveNumberInput.jsx';
// import { toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import { useTranslation } from 'react-i18next';
// import { Link } from 'react-router-dom';

const preturiApi = new PreturiControllerApi(new ApiClient());
const fetchPreturi = () => {
  preturiApi.getPreturiWithDetails((error, data, response) => {
    if (error) {
      console.error("❌ Eroare la încărcarea prețurilor:", error);
    } else {
      console.log(data); // aici primești lista de prețuri
      setEquipmentPrices(data); // dacă vrei să o salvezi în state
    }
  });
};

const EquipmentPricesManagement = () => {
  const [equipmentPrices, setEquipmentPrices] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedResort, setSelectedResort] = useState('all');
  const [selectedEquipmentType, setSelectedEquipmentType] = useState('all');
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedPrice, setSelectedPrice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statiuni, setStatiuni] = useState([]);
  const [equipmentTypes, setEquipmentTypes] = useState([]);
  const [echipamente, setEchipamente] = useState([]);
  const [modalLoading, setModalLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newPrice, setNewPrice] = useState('');
  const [selectedEquipmentForAdd, setSelectedEquipmentForAdd] = useState('');

  const [apiClient] = useState(() => {
  const client = new ApiClient();
  client.enableCookies = true;
  client.basePath = 'http://localhost:8080';

  // 👉 Definește bearerAuth întâi
  client.authentications = {
    bearerAuth: {
      type: 'apiKey',
      in: 'header',
      name: 'Authorization',
      apiKey: null,
    }
  };

  // 👉 Apoi setează tokenul dacă există
  const token = localStorage.getItem('authToken') || localStorage.getItem('token');
  if (token) {
    client.authentications['bearerAuth'].apiKey = `Bearer ${token}`;
    console.log('✅ Token JWT setat în ApiClient');
  } else {
    console.warn('⚠️ Tokenul JWT lipsește din localStorage');
  }

  return client;
});


useEffect(() => {
  console.log('🔧 ApiClient configurat:', {
    basePath: apiClient.basePath,
    enableCookies: apiClient.enableCookies,
    authentications: apiClient.authentications
  });
  }, [apiClient]);

  
  // API-uri necesare
  const plajaApi = new PlajaControllerApi(apiClient);
  const preturiApi = new PreturiControllerApi(apiClient);
  const tipEchipamentApi = new TipEchipamentPlajaControllerApi(apiClient);
  const statiuneApi = new StatiuneControllerApi(apiClient);
  const firmaApi = new FirmaControllerApi(apiClient);
  const echipamentePlajaApi = new EchipamentPlajaControllerApi(apiClient);

  // Iconuri SVG
  const Icon = ({ name, size = 18, className = "" }) => {
    const icons = {
      search: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <circle cx="11" cy="11" r="8"></circle>
          <path d="m21 21-4.35-4.35"></path>
        </svg>
      ),
      filter: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46"></polygon>
        </svg>
      ),
      edit: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
          <path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4Z"></path>
        </svg>
      ),
      plus: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <path d="M5 12h14"></path>
          <path d="M12 5v14"></path>
        </svg>
      ),
      umbrella: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <path d="M23 12a11.05 11.05 0 0 0-22 0zm-5 7a3 3 0 0 1-6 0v-7"></path>
        </svg>
      ),
      tent: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <path d="M3.5 21 14 3l10.5 18H3.5Z"></path>
          <path d="M12 13.5 7.5 21"></path>
          <path d="M12 13.5 16.5 21"></path>
        </svg>
      ),
      chair: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <path d="M4 18v-8a4 4 0 0 1 8 0v8Z"></path>
          <path d="M4 10V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v4"></path>
          <path d="M2 18h20"></path>
        </svg>
      ),
      money: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <path d="M12 1v22" />
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      ),
      x: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <path d="m18 6-12 12"></path>
          <path d="m6 6 12 12"></path>
        </svg>
      ),
      check: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <polyline points="20,6 9,17 4,12"></polyline>
        </svg>
      ),
      alertTriangle: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path>
          <path d="M12 9v4"></path>
          <path d="m12 17 .01 0"></path>
        </svg>
      ),
      refresh: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path>
          <path d="M21 3v5h-5"></path>
          <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path>
          <path d="M3 21v-5h5"></path>
        </svg>
      ),
      trash: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <polyline points="3,6 5,6 21,6"></polyline>
          <path d="m19,6v14a2,2 0 0,1-2,2H7a2,2 0 0,1-2-2V6m3,0V4a2,2 0 0,1 2-2h4a2,2 0 0,1 2,2v2"></path>
        </svg>
      ),
      history: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="12,6 12,12 16,14"></polyline>
        </svg>
      )
    };
    
    return icons[name] || null;
  };

  // Încărcare date inițiale cu debugging
  useEffect(() => {
    console.log('🚀 EquipmentPricesManagement component mounted');
    
    // Debug API methods pentru a vedea ce metode sunt disponibile
    console.log('🔍 Debug API methods:');
    console.log('statiuneApi methods:', Object.getOwnPropertyNames(Object.getPrototypeOf(statiuneApi)));
    console.log('tipEchipamentApi methods:', Object.getOwnPropertyNames(Object.getPrototypeOf(tipEchipamentApi)));
    console.log('echipamentePlajaApi methods:', Object.getOwnPropertyNames(Object.getPrototypeOf(echipamentePlajaApi)));
    console.log('preturiApi methods:', Object.getOwnPropertyNames(Object.getPrototypeOf(preturiApi)));
    
    fetchEquipmentPrices();
    fetchStatiuni();
    fetchEquipmentTypes();
    fetchEchipamente();
  }, []);

  // Filtrare date
  useEffect(() => {
    let filtered = equipmentPrices;

    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.plajaDenumire?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.firmaNume?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.tipEchipamentNume?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.echipamentDenumire?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedResort !== 'all') {
      filtered = filtered.filter(item => item.statiuneId === parseInt(selectedResort));
    }

    if (selectedEquipmentType !== 'all') {
      filtered = filtered.filter(item => item.tipEchipamentId === parseInt(selectedEquipmentType));
    }

    setFilteredData(filtered);
    console.log(`🔄 Filtered data updated: ${filtered.length} items`);
  }, [equipmentPrices, searchTerm, selectedResort, selectedEquipmentType]);

  // Funcție pentru încărcarea prețurilor - simplificată inițial
  const fetchEquipmentPrices = async () => {
    try {
      console.log('📊 Starting fetchEquipmentPrices...');
      setLoading(true);
      
      // Încearcă să obții prețurile direct
      let preturiResponse;
      if (typeof preturiApi.getAllPreturi === 'function') {
        console.log('✅ Found getAllPreturi method, calling it...');
        preturiResponse = await apiService.getPreturiWithFullDetails();
        console.log('📋 Raw preturi response:', preturiResponse);
      } else {
        console.error('❌ Metoda getAllPreturi nu există în preturiApi');
        console.log('🔍 Available methods in preturiApi:', Object.getOwnPropertyNames(Object.getPrototypeOf(preturiApi)));
        setEquipmentPrices([]);
        setError('Nu s-a putut încărca API-ul pentru prețuri');
        return;
      }
      
      if (!preturiResponse || preturiResponse.length === 0) {
        console.log('⚠️ No prices found or empty response');
        setEquipmentPrices([]);
        setError(null);
        return;
      }

      console.log(`📈 Found ${preturiResponse.length} prices, creating simplified data...`);

      // Temporar, doar afișează prețurile simple fără detalii complete
      // Vom adăuga detaliile mai târziu când API-urile funcționează
      const simplePrices = preturiResponse.map((pret, index) => {
  console.log(`🔧 Processing detailed price ${index + 1}:`, pret);
  return {
    pretId: pret.pretId,
    echipamentPlajaId: pret.echipamentPlajaId,
    valoare: pret.valoare,
    dataOra: pret.dataOra,
    plajaDenumire: pret.plajaDenumire,
    firmaNume: pret.firmaNume,
    statiuneNume: pret.statiuneNume,
    echipamentDenumire: pret.echipamentDenumire,
    tipEchipamentNume: pret.tipEchipamentNume,
    pozitioLinie: pret.pozitioLinie,
    pozitioColoana: pret.pozitioColoana,
    plajaId: pret.plajaId,
    tipEchipamentId: pret.tipEchipamentId,
    firmaId: pret.firmaId,
    statiuneId: pret.statiuneId
  };
});


      console.log('✅ Simplified prices created:', simplePrices);
      setEquipmentPrices(simplePrices);
      setError(null);
    } catch (err) {
      console.error('❌ Eroare la încărcarea prețurilor:', err);
      setError('Eroare la încărcarea datelor. Vă rugăm încercați din nou.');
      setEquipmentPrices([]);
    } finally {
      setLoading(false);
      console.log('🏁 fetchEquipmentPrices completed');
    }
  };

  // Funcții pentru încărcarea datelor auxiliare cu fallback-uri multiple
  const fetchStatiuni = async () => {
    try {
      console.log('🏖️ Starting fetchStatiuni...');
      let response;
      
      // Încearcă mai multe variante de nume pentru metoda API
      if (typeof statiuneApi.getAllStatiuni === 'function') {
        console.log('✅ Using getAllStatiuni method');
        response = await statiuneApi.getAllStatiuni();
      } else if (typeof statiuneApi.getStatiuni === 'function') {
        console.log('✅ Using getStatiuni method');
        response = await statiuneApi.getStatiuni();
      } else if (typeof statiuneApi.findAll === 'function') {
        console.log('✅ Using findAll method');
        response = await statiuneApi.findAll();
      } else if (typeof statiuneApi.getAll === 'function') {
        console.log('✅ Using getAll method');
        response = await statiuneApi.getAll();
      } else {
        console.warn('⚠️ Nu s-a găsit o metodă validă pentru încărcarea stațiunilor');
        console.log('🔍 Available methods:', Object.getOwnPropertyNames(Object.getPrototypeOf(statiuneApi)));
        setStatiuni([]);
        return;
      }
      
      console.log('📋 Statiuni response:', response);
      setStatiuni(response || []);
    } catch (err) {
      console.error('❌ Eroare la încărcarea stațiunilor:', err);
      setStatiuni([]);
    }
  };

  const fetchEquipmentTypes = async () => {
    try {
      console.log('🔧 Starting fetchEquipmentTypes...');
      let response;
      
      if (typeof tipEchipamentApi.getAllTipuriEchipament === 'function') {
        console.log('✅ Using getAllTipuriEchipament method');
        response = await tipEchipamentApi.getAllTipuriEchipament();
      } else if (typeof tipEchipamentApi.getTipuriEchipament === 'function') {
        console.log('✅ Using getTipuriEchipament method');
        response = await tipEchipamentApi.getTipuriEchipament();
      } else if (typeof tipEchipamentApi.findAll === 'function') {
        console.log('✅ Using findAll method');
        response = await tipEchipamentApi.findAll();
      } else if (typeof tipEchipamentApi.getAll === 'function') {
        console.log('✅ Using getAll method');
        response = await tipEchipamentApi.getAll();
      } else {
        console.warn('⚠️ Nu s-a găsit o metodă validă pentru încărcarea tipurilor de echipament');
        console.log('🔍 Available methods:', Object.getOwnPropertyNames(Object.getPrototypeOf(tipEchipamentApi)));
        setEquipmentTypes([]);
        return;
      }
      
      console.log('📋 Equipment types response:', response);
      setEquipmentTypes(response || []);
    } catch (err) {
      console.error('❌ Eroare la încărcarea tipurilor de echipament:', err);
      setEquipmentTypes([]);
    }
  };

  const fetchEchipamente = async () => {
    try {
      console.log('🏖️ Starting fetchEchipamente...');
      let response;
      
      if (typeof echipamentePlajaApi.getAllEchipamentePlaja === 'function') {
        console.log('✅ Using getAllEchipamentePlaja method');
        response = await echipamentePlajaApi.getAllEchipamentePlaja();
      } else if (typeof echipamentePlajaApi.getEchipamentePlaja === 'function') {
        console.log('✅ Using getEchipamentePlaja method');
        response = await echipamentePlajaApi.getEchipamentePlaja();
      } else if (typeof echipamentePlajaApi.findAll === 'function') {
        console.log('✅ Using findAll method');
        response = await echipamentePlajaApi.findAll();
      } else if (typeof echipamentePlajaApi.getAll === 'function') {
        console.log('✅ Using getAll method');
        response = await echipamentePlajaApi.getAll();
      } else {
        console.warn('⚠️ Nu s-a găsit o metodă validă pentru încărcarea echipamentelor');
        console.log('🔍 Available methods:', Object.getOwnPropertyNames(Object.getPrototypeOf(echipamentePlajaApi)));
        setEchipamente([]);
        return;
      }
      
      console.log('📋 Echipamente response:', response);
      setEchipamente(response || []);
    } catch (err) {
      console.error('❌ Eroare la încărcarea echipamentelor:', err);
      setEchipamente([]);
    }
  };

  const handleEditPrice = (priceRecord) => {
    console.log('✏️ Editing price:', priceRecord);
    setSelectedPrice(priceRecord);
    setNewPrice(priceRecord.valoare.toString());
    setShowEditModal(true);
  };

  const handleAddPrice = () => {
    console.log('➕ Adding new price');
    setNewPrice('');
    setSelectedEquipmentForAdd('');
    setShowAddModal(true);
  };

  const handleSavePrice = async () => {
    if (!selectedPrice || !newPrice) {
      console.warn('⚠️ Missing data for price save');
      return;
    }

    try {
      console.log('💾 Saving price update:', { selectedPrice, newPrice });
      setIsSubmitting(true);
      
      // Creează un nou preț în tabela preturi (păstrează istoricul)
      const newPriceData = {
        echipamentPlajaId: selectedPrice.echipamentPlajaId,
        valoare: parseInt(newPrice)
        // dataOra se setează automat în backend
      };

      console.log('📤 Sending price data:', newPriceData);

      // Apelează API-ul pentru crearea unui nou preț
      await preturiApi.createPret(newPriceData);
      
      console.log('✅ Price saved successfully');
      
      // Reîncarcă datele pentru a afișa noul preț
      await fetchEquipmentPrices();
      
      setShowEditModal(false);
      setSelectedPrice(null);
      setNewPrice('');
      
      // Folosește alert în loc de toast pentru moment
      alert('Prețul a fost actualizat cu succes!');
      
    } catch (err) {
      console.error('❌ Eroare la salvarea prețului:', err);
      alert('Eroare la salvarea prețului. Vă rugăm încercați din nou.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveNewPrice = async () => {
    if (!selectedEquipmentForAdd || !newPrice) {
      console.warn('⚠️ Missing data for new price');
      return;
    }

    try {
      console.log('💾 Creating new price:', { selectedEquipmentForAdd, newPrice });
      setIsSubmitting(true);
      
      const newPriceData = {
        echipamentPlajaId: parseInt(selectedEquipmentForAdd),
        valoare: parseInt(newPrice)
      };

      console.log('📤 Sending new price data:', newPriceData);

      await preturiApi.createPret(newPriceData);
      
      console.log('✅ New price created successfully');
      
      await fetchEquipmentPrices();
      
      setShowAddModal(false);
      setSelectedEquipmentForAdd('');
      setNewPrice('');
      
      alert('Prețul a fost adăugat cu succes!');
      
    } catch (err) {
      console.error('❌ Eroare la adăugarea prețului:', err);
      alert('Eroare la adăugarea prețului. Vă rugăm încercați din nou.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePrice = async (priceRecord) => {
    console.log('🗑️ Attempting to delete price:', priceRecord);
    
    if (!confirm(`Sigur doriți să ștergeți prețul pentru ${priceRecord.tipEchipamentNume} - ${priceRecord.echipamentDenumire}?`)) {
      console.log('❌ Delete cancelled by user');
      return;
    }

    try {
      console.log('🗑️ Deleting price with ID:', priceRecord.pretId);
      
      // Apelează API-ul pentru ștergerea prețului
      await preturiApi.deletePret(priceRecord.pretId);
      
      console.log('✅ Price deleted successfully');
      
      // Reîncarcă datele
      await fetchEquipmentPrices();
      
      alert('Prețul a fost șters cu succes!');
      
    } catch (err) {
      console.error('❌ Eroare la ștergerea prețului:', err);
      alert('Eroare la ștergerea prețului. Vă rugăm încercați din nou.');
    }
  };

  const closeModal = () => {
    console.log('🚪 Closing modal');
    setShowEditModal(false);
    setShowAddModal(false);
    setSelectedPrice(null);
    setNewPrice('');
    setSelectedEquipmentForAdd('');
  };

  const getEquipmentIcon = (tipEchipament) => {
    switch (tipEchipament?.toLowerCase()) {
      case 'umbrelă': return 'umbrella';
      case 'baldachin': return 'tent';
      case 'șezlong': return 'chair';
      default: return 'money';
    }
  };

  const formatDateTime = (dateTimeString) => {
    try {
      const date = new Date(dateTimeString);
      return date.toLocaleString('ro-RO', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (err) {
      console.error('❌ Error formatting date:', err);
      return 'Data invalidă';
    }
  };

  const getAvailableEquipments = () => {
    const available = echipamente.filter(echipament => 
      !equipmentPrices.some(price => price.echipamentPlajaId === echipament.id)
    );
    console.log(`🔍 Available equipments: ${available.length} out of ${echipamente.length}`);
    return available;
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Se încarcă...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">Prețuri Echipamente</h2>
          <p className="text-muted mb-0">Gestionați prețurile pentru toate echipamentele de pe plaje cu istoric complet</p>
        </div>
        <div className="d-flex gap-2">
          <button 
            className="btn btn-outline-primary"
            onClick={fetchEquipmentPrices}
            disabled={loading}
          >
            <Icon name="refresh" size={18} className="me-2" />
            Reîmprospătează
          </button>
          <button 
            className="btn btn-success"
            onClick={handleAddPrice}
            disabled={loading}
          >
            <Icon name="plus" size={18} className="me-2" />
            Adaugă Preț
          </button>
        </div>
      </div>

      {/* Debug info */}
   {/*<div className="bg-light border rounded p-3 mb-4 small">
        <div className="row">
          <div className="col-3">
            <strong>Debug Info:</strong><br/>
            Prețuri: {equipmentPrices.length}<br/>
            Stațiuni: {statiuni.length}<br/>
            Tipuri: {equipmentTypes.length}<br/>
            Echipamente: {echipamente.length}
          </div>
          <div className="col-9">
            <strong>API Status:</strong><br/>
            <span className="badge bg-primary me-1">preturiApi: {typeof preturiApi.getAllPreturi === 'function' ? '✅' : '❌'}</span>
            <span className="badge bg-info me-1">statiuneApi: {Object.getOwnPropertyNames(Object.getPrototypeOf(statiuneApi)).length} methods</span>
            <span className="badge bg-success me-1">tipEchipamentApi: {Object.getOwnPropertyNames(Object.getPrototypeOf(tipEchipamentApi)).length} methods</span>
            <span className="badge bg-warning">echipamentePlajaApi: {Object.getOwnPropertyNames(Object.getPrototypeOf(echipamentePlajaApi)).length} methods</span>
          </div>
        </div>
      </div> */}

      {/* Statistici rapide */}
      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <div className="bg-white rounded-lg shadow-sm border p-3">
            <div className="d-flex align-items-center">
              <Icon name="money" size={24} className="text-primary me-3" />
              <div>
                <div className="fw-bold">{equipmentPrices.length}</div>
                <small className="text-muted">Total înregistrări preț</small>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="bg-white rounded-lg shadow-sm border p-3">
            <div className="d-flex align-items-center">
              <Icon name="umbrella" size={24} className="text-info me-3" />
              <div>
                <div className="fw-bold">{new Set(equipmentPrices.map(p => p.echipamentPlajaId)).size}</div>
                <small className="text-muted">Echipamente cu preț</small>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="bg-white rounded-lg shadow-sm border p-3">
            <div className="d-flex align-items-center">
              <Icon name="chair" size={24} className="text-success me-3" />
              <div>
                <div className="fw-bold">{new Set(equipmentPrices.map(p => p.plajaId)).size}</div>
                <small className="text-muted">Plaje cu echipamente</small>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="bg-white rounded-lg shadow-sm border p-3">
            <div className="d-flex align-items-center">
              <Icon name="tent" size={24} className="text-warning me-3" />
              <div>
                <div className="fw-bold">
                  {Math.round(equipmentPrices.reduce((sum, p) => sum + p.valoare, 0) / equipmentPrices.length) || 0} RON
                </div>
                <small className="text-muted">Preț mediu</small>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filtre și căutare */}
      <div className="bg-white rounded-lg shadow-sm border p-4 mb-4">
        <div className="row g-3">
          <div className="col-md-4">
            <label className="form-label">Caută plajă, firmă sau echipament</label>
            <div className="input-group">
              <span className="input-group-text bg-light">
                <Icon name="search" size={18} className="text-muted" />
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Introduceți termenul de căutare..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="col-md-3">
            <label className="form-label">Stațiune</label>
            <select
              className="form-select"
              value={selectedResort}
              onChange={(e) => setSelectedResort(e.target.value)}
            >
              <option value="all">Toate stațiunile</option>
              {statiuni.map(statiune => (
                <option key={statiune.id} value={statiune.id}>
                  {statiune.nume}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-3">
            <label className="form-label">Tip echipament</label>
            <select
              className="form-select"
              value={selectedEquipmentType}
              onChange={(e) => setSelectedEquipmentType(e.target.value)}
            >
              <option value="all">Toate tipurile</option>
              {equipmentTypes.map(type => (
                <option key={type.id} value={type.id}>
                  {type.nume}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-2 d-flex align-items-end">
            <div className="text-muted small">
              <Icon name="filter" size={16} className="me-1" />
              {filteredData.length} înregistrări
            </div>
          </div>
        </div>
      </div>

      {/* Mesaje de eroare */}
      {error && (
        <div className="alert alert-danger d-flex align-items-center mb-4">
          <Icon name="alertTriangle" size={20} className="me-2" />
          {error}
        </div>
      )}

      {/* Tabel prețuri */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="table-responsive">
          <table className="table table-hover mb-0" style={{ tableLayout: 'fixed', width: '100%' }}>
            <thead className="table-light">
              <tr>
                <th scope="col" className="border-0 fw-bold">Plajă</th>
                <th scope="col" className="border-0 fw-bold">Firmă</th>
                <th scope="col" className="border-0 fw-bold">Stațiune</th>
                <th scope="col" className="border-0 fw-bold">Echipament</th>
                <th scope="col" className="border-0 fw-bold text-center">Preț curent (RON)</th>
                <th scope="col" className="border-0 fw-bold text-center">Ultima modificare</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-muted">
                    {searchTerm || selectedResort !== 'all' || selectedEquipmentType !== 'all'
                      ? 'Nu au fost găsite înregistrări care să corespundă criteriilor de căutare.'
                      : 'Nu există prețuri înregistrate în sistem.'
                    }
                  </td>
                </tr>
              ) : (
                filteredData.map((item) => (
                  <tr key={`${item.pretId}-${item.echipamentPlajaId}`}>
                    <td className="fw-bold">{item.plajaDenumire}</td>
                    <td>{item.firmaNume}</td>
                    <td>
                      <span className="badge bg-info bg-opacity-10 text-info">
                        {item.statiuneNume}
                      </span>
                    </td>
                    <td>
                      <span className="text-muted">{item.tipEchipamentNume}</span>
                    </td>

                    <td className="text-center">
                      <span className="badge bg-success fs-6 px-3 py-2">
                        {item.valoare} RON
                      </span>
                    </td>
                    <td className="text-center">
                      <div className="d-flex align-items-center justify-content-center">
                        <Icon name="history" size={14} className="me-1 text-muted" />
                        <small className="text-muted">
                          {formatDateTime(item.dataOra)}
                        </small>
                      </div>
                    </td>
                    <td className="text-center">
                      <div className="btn-group btn-group-sm">
                        <button
                          className="btn btn-outline-primary"
                          onClick={() => handleEditPrice(item)}
                          title="Modifică prețul"
                        >
                          <Icon name="edit" size={14} />
                        </button>
                        <button
                          className="btn btn-outline-danger"
                          onClick={() => handleDeletePrice(item)}
                          title="Șterge prețul"
                        >
                          <Icon name="trash" size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal editare preț */}
      {showEditModal && (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <Icon name="money" size={20} className="me-2" />
                  Modifică Preț - {selectedPrice?.echipamentDenumire}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeModal}
                  disabled={isSubmitting}
                ></button>
              </div>

              <div className="modal-body">
                <div className="mb-3">
                  <div className="row">
                    <div className="col-6">
                      <strong>Plajă:</strong> {selectedPrice?.plajaDenumire}
                    </div>
                    <div className="col-6">
                      <strong>Firmă:</strong> {selectedPrice?.firmaNume}
                    </div>
                  </div>
                  <div className="row mt-2">
                    <div className="col-6">
                      <strong>Stațiune:</strong> {selectedPrice?.statiuneNume}
                    </div>
                    <div className="col-6">
                      <strong>Tip:</strong> {selectedPrice?.tipEchipamentNume}
                    </div>
                  </div>
                  <div className="row mt-2">
                    <div className="col-6">
                      <strong>Echipament:</strong> {selectedPrice?.echipamentDenumire}
                    </div>
                    <div className="col-6">
                      <strong>Poziție:</strong> L{selectedPrice?.pozitioLinie} / C{selectedPrice?.pozitioColoana}
                    </div>
                  </div>
                </div>

                <div className="mb-3">
                  <div className="p-3 bg-light rounded">
                    <div className="d-flex align-items-center justify-content-between">
                      <span>Preț curent:</span>
                      <span className="badge bg-info fs-6 px-3 py-2">
                        {selectedPrice?.valoare} RON
                      </span>
                    </div>
                    <div className="d-flex align-items-center justify-content-between mt-2">
                      <span>Ultima modificare:</span>
                      <small className="text-muted">
                        {formatDateTime(selectedPrice?.dataOra)}
                      </small>
                    </div>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold">Preț nou (RON):</label>
                  <PositiveNumberInput
                    // type="number"
                    className="form-control"
                    placeholder="Introduceți noul preț..."
                    min="0"
                    step="1"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    disabled={isSubmitting}
                    autoFocus
                  />
                </div>

                {newPrice && newPrice !== selectedPrice?.valoare.toString() && (
                  <div className="alert alert-info">
                    <strong>Noul preț va fi:</strong> {newPrice} RON
                    <br />
                    <small>Se va crea o nouă înregistrare în tabela preturi cu data și ora curentă.</small>
                  </div>
                )}
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={closeModal}
                  disabled={isSubmitting}
                >
                  <Icon name="x" size={16} className="me-2" />
                  Anulează
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleSavePrice}
                  disabled={isSubmitting || !newPrice || newPrice === selectedPrice?.valoare.toString()}
                >
                  {isSubmitting ? (
                    <>
                      <div className="spinner-border spinner-border-sm me-2" role="status">
                        <span className="visually-hidden">Se salvează...</span>
                      </div>
                      Se salvează...
                    </>
                  ) : (
                    <>
                      <Icon name="check" size={16} className="me-2" />
                      Salvează Noul Preț
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal adăugare preț nou */}
      {showAddModal && (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <Icon name="plus" size={20} className="me-2" />
                  Adaugă Preț Nou
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeModal}
                  disabled={isSubmitting}
                ></button>
              </div>

              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label fw-bold">Selectează echipamentul:</label>
                  <select
                    className="form-select"
                    value={selectedEquipmentForAdd}
                    onChange={(e) => setSelectedEquipmentForAdd(e.target.value)}
                    disabled={isSubmitting}
                  >
                    <option value="">-- Selectează un echipament --</option>
                    {getAvailableEquipments().map(echipament => (
                      <option key={echipament.id} value={echipament.id}>
                        {echipament.denumire} (ID: {echipament.id})
                      </option>
                    ))}
                  </select>
                  <small className="text-muted">
                    Se afișează doar echipamentele care nu au încă un preț asociat.
                  </small>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold">Preț (RON):</label>
                  <PositiveNumberInput
                    // type="number"
                    className="form-control"
                    placeholder="Introduceți prețul..."
                    min="0"
                    step="1"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    disabled={isSubmitting}
                  />
                </div>

                {selectedEquipmentForAdd && newPrice && (
                  <div className="alert alert-success">
                    <strong>Se va crea un nou preț:</strong> {newPrice} RON pentru echipamentul selectat
                    <br />
                    <small>Data și ora vor fi setate automat la momentul curent.</small>
                  </div>
                )}
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={closeModal}
                  disabled={isSubmitting}
                >
                  <Icon name="x" size={16} className="me-2" />
                  Anulează
                </button>
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={handleSaveNewPrice}
                  disabled={isSubmitting || !selectedEquipmentForAdd || !newPrice}
                >
                  {isSubmitting ? (
                    <>
                      <div className="spinner-border spinner-border-sm me-2" role="status">
                        <span className="visually-hidden">Se salvează...</span>
                      </div>
                      Se salvează...
                    </>
                  ) : (
                    <>
                      <Icon name="check" size={16} className="me-2" />
                      Adaugă Prețul
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EquipmentPricesManagement;