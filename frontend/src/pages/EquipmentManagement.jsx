import React, { useState, useEffect, useContext } from 'react';
import apiService from '../services/ApiService';
import PositiveNumberInput from '../components/common/PositiveNumberInput';
import { AuthContext } from '../contexts/AuthContext';

const EquipmentManagement = () => {
    const { user } = useContext(AuthContext);
  
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingEquipment, setEditingEquipment] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPlaja, setFilterPlaja] = useState('');
  const [filterStare, setFilterStare] = useState('');
  const [showPriceHistory, setShowPriceHistory] = useState(null);
  const [plaje, setPlaje] = useState([]);
  const [stariEchipament, setStariEchipament] = useState([]);
  const [tipuriEchipament, setTipuriEchipament] = useState([]);
  
  // Stare pentru paginare
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);
  const [totalItems, setTotalItems] = useState(0);

  // Componente pentru iconuri simple cu SVG
  const Icon = ({ name, size = 18, className = "" }) => {
    const icons = {
      search: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <circle cx="11" cy="11" r="8"></circle>
          <path d="m21 21-4.35-4.35"></path>
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
      trash: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <polyline points="3,6 5,6 21,6"></polyline>
          <path d="m19,6v14a2,2 0 0,1-2,2H7a2,2 0 0,1-2,-2V6m3,0V4a2,2 0 0,1,2-2h4a2,2 0 0,1,2,2v2"></path>
        </svg>
      ),
      eye: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
          <circle cx="12" cy="12" r="3"></circle>
        </svg>
      ),
      x: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <path d="m18 6-12 12"></path>
          <path d="m6 6 12 12"></path>
        </svg>
      ),
      'chevron-left': (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <path d="m15 18-6-6 6-6"></path>
  </svg>
),

'chevron-right': (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <path d="m9 18 6-6-6-6"></path>
  </svg>
),

// Sau alternativ, cu săgeți mai groase:
'arrow-left': (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <path d="m12 19-7-7 7-7"></path>
    <path d="M19 12H5"></path>
  </svg>
),

'arrow-right': (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <path d="M5 12h14"></path>
    <path d="m12 5 7 7-7 7"></path>
  </svg>
),
      filter: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46"></polygon>
        </svg>
      ),
      umbrella: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <path d="M23 12a11.05 11.05 0 0 0-22 0zm-5 7a3 3 0 0 1-6 0v-7"></path>
        </svg>
      ),
      dollar: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <line x1="12" y1="1" x2="12" y2="23"></line>
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
        </svg>
      ),
      refresh: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <polyline points="23,4 23,10 17,10"></polyline>
          <polyline points="1,20 1,14 7,14"></polyline>
          <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"></path>
        </svg>
      ),
      tool: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
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
    
    return icons[name] || icons.search;
  };

  // Încărcare date inițiale
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    await Promise.all([
      loadEquipment(),
      loadPlaje(),
      loadStariEchipament(),
      loadTipuriEchipament()
    ]);
  };

  const loadEquipment = async () => {
    try {
      setRefreshing(true);
      setError(null);
      console.log('📥 Loading equipment from API...');
      
      const data = await apiService.getAllEchipamentePlaja();
      console.log('✅ Equipment loaded:', data);
      if(user.role==='MANAGER'){
      setEquipment(data.filter((el)=>el.userId===user.id && !['Loc Gol'].includes(el.tipEchipamentDenumire)) || []);
      }
      else if(user.role==='ADMIN'){
        setEquipment(data.filter((el)=>!['Loc Gol'].includes(el.tipEchipamentDenumire)) || []);
      }
    } catch (err) {
      console.error('❌ Error loading equipment:', err);
      setError('Eroare la încărcarea echipamentelor: ' + (err.message || 'Eroare necunoscută'));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const loadPlaje = async () => {
    try {
      console.log('🏖️ Loading plaje from API...');
      const data = await apiService.getAllPlaje();
      console.log('✅ Plaje loaded:', data);
      setPlaje(data || []);
    } catch (err) {
      console.error('❌ Error loading plaje:', err);
      // Fallback cu date mock
      setPlaje([
        { id: 1, denumire: "Plaja Default 1" },
        { id: 2, denumire: "Plaja Default 2" }
      ]);
    }
  };

  const loadStariEchipament = async () => {
    try {
      console.log('📊 Loading stari echipament from API...');
      const data = await apiService.getAllStariEchipament();
      console.log('✅ Stari echipament loaded:', data);
      setStariEchipament(data || []);
    } catch (err) {
      console.error('❌ Error loading stari echipament:', err);
      // Fallback cu date mock
      setStariEchipament([
        { id: 1, denumire: "Liber" },
        { id: 2, denumire: "Ocupat" },
        { id: 3, denumire: "Rezervat" },
        { id: 4, denumire: "Indisponibil" }
      ]);
    }
  };

  const loadTipuriEchipament = async () => {
    try {
      console.log('🔧 Loading tipuri echipament from API...');
      const data = await apiService.getAllTipuriEchipament();
      console.log('✅ Tipuri echipament loaded:', data);
      setTipuriEchipament(data || []);
    } catch (err) {
      console.error('❌ Error loading tipuri echipament:', err);
      // Fallback cu date mock
      setTipuriEchipament([
        { id: 1, denumire: "Sezlong" },
        { id: 2, denumire: "Umbrela" },
        { id: 3, denumire: "Baldachin" }
      ]);
    }
  };

  const handleAddEquipment = () => {
    setEditingEquipment(null);
    setShowModal(true);
  };

  const handleEditEquipment = (equip) => {
    setEditingEquipment(equip);
    setShowModal(true);
  };

  const handleDeleteEquipment = async (id) => {
    if (!window.confirm('Sigur doriți să ștergeți acest echipament?')) {
      return;
    }

    try {
      console.log('🗑️ Deleting equipment:', id);
      await apiService.deleteEchipamentPlaja(id);
      console.log('✅ Equipment deleted successfully');
      
      await loadEquipment(); // Reîncarcă lista
      alert('Echipamentul a fost șters cu succes!');
    } catch (err) {
      console.error('❌ Error deleting equipment:', err);
      alert('Eroare la ștergerea echipamentului: ' + (err.message || 'Eroare necunoscută'));
    }
  };

  const handleViewPriceHistory = async (equipmentId) => {
    try {
      console.log('💰 Loading price history for equipment:', equipmentId);
      // Apelează API pentru istoricul prețurilor
      // const history = await apiService.getPriceHistory(equipmentId);
      setShowPriceHistory(equipmentId);
    } catch (err) {
      console.error('❌ Error loading price history:', err);
      alert('Eroare la încărcarea istoricului prețurilor');
    }
  };

  const filteredEquipment = equipment.filter(equip => {
    const searchMatch = equip.denumire?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       equip.tipEchipamentDenumire?.toLowerCase().includes(searchTerm.toLowerCase());
    const plajaMatch = filterPlaja === '' || equip.plajaId?.toString() === filterPlaja;
    const stareMatch = filterStare === '' || equip.stareEchipamentId?.toString() === filterStare;
    
    return searchMatch && plajaMatch && stareMatch;
  });

  // Calculare paginare
  const totalPages = Math.ceil(filteredEquipment.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentEquipment = filteredEquipment.slice(startIndex, endIndex);

  // Actualizare totalItems când se schimbă filtered equipment
  useEffect(() => {
    setTotalItems(filteredEquipment.length);
    // Resetează la prima pagină când se schimbă filtrele
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [filteredEquipment.length, totalPages, currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearchChange = (value) => {
    setSearchTerm(value);
    setCurrentPage(1); // Resetează la prima pagină când se caută
  };

  const handleFilterChange = (filterType, value) => {
    if (filterType === 'plaja') {
      setFilterPlaja(value);
    } else if (filterType === 'stare') {
      setFilterStare(value);
    }
    setCurrentPage(1); // Resetează la prima pagină când se filtrează
  };

  // Componentă pentru paginare
  const Pagination = () => {
    if (totalPages <= 1) return null;

    const getPageNumbers = () => {
      const pages = [];
      const maxVisiblePages = 5;
      
      if (totalPages <= maxVisiblePages) {
        for (let i = 1; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        if (currentPage <= 3) {
          for (let i = 1; i <= 4; i++) {
            pages.push(i);
          }
          pages.push('...');
          pages.push(totalPages);
        } else if (currentPage >= totalPages - 2) {
          pages.push(1);
          pages.push('...');
          for (let i = totalPages - 3; i <= totalPages; i++) {
            pages.push(i);
          }
        } else {
          pages.push(1);
          pages.push('...');
          for (let i = currentPage - 1; i <= currentPage + 1; i++) {
            pages.push(i);
          }
          pages.push('...');
          pages.push(totalPages);
        }
      }
      
      return pages;
    };

    return (
      <nav aria-label="Paginare echipamente">
  <ul className="pagination justify-content-center mb-0">
    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
      <button 
        className="page-link" 
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <Icon name="chevron-left" size={14} />
        Anterior
      </button>
    </li>
    
    {getPageNumbers().map((page, index) => (
      <li key={index} className={`page-item ${page === currentPage ? 'active' : ''}`}>
        {page === '...' ? (
          <span className="page-link">...</span>
        ) : (
          <button 
            className="page-link" 
            onClick={() => handlePageChange(page)}
          >
            {page}
          </button>
        )}
      </li>
    ))}
    
    <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
      <button 
        className="page-link" 
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Următorul
        <Icon name="chevron-right" size={14} />
      </button>
    </li>
  </ul>
</nav>
    );
  };

  const getStatusBadgeClass = (stare) => {
    const stareNormalized = stare?.toLowerCase() || '';
    if (stareNormalized.includes('liber') || stareNormalized.includes('disponibil')) return 'bg-success';
    if (stareNormalized.includes('ocupat')) return 'bg-warning';
    if (stareNormalized.includes('rezervat') || stareNormalized.includes('rezervat')) return 'bg-danger';
    if (stareNormalized.includes('indisponibil')) return 'bg-secondary';
    return 'bg-secondary';
  };

  // Calcularea statisticilor din datele reale
  const calculateStats = () => {
    const total = equipment.length;
    const disponibile = equipment.filter(e => {
      const stare = e.stareEchipamentDenumire?.toLowerCase() || '';
      return stare.includes('liber') || stare.includes('disponibil');
    }).length;
    const indisponibile = equipment.filter(e => {
      const stare = e.stareEchipamentDenumire?.toLowerCase() || '';
      return stare.includes('indisponibil');
    }).length;
    
    return { total, disponibile, indisponibile };
  };

  const stats = calculateStats();

  const EquipmentModal = () => {
    const [formData, setFormData] = useState({
      denumire: '',
      plajaId: '',
      tipEchipamentId: '',
      stareEchipamentId: '',
      pozitieLinie: '',
      pozitieColoana: '',
      pretCurent: '',
      activ: true
    });

    useEffect(() => {
      if (editingEquipment) {
        setFormData({
          denumire: editingEquipment.denumire || '',
          plajaId: editingEquipment.plajaId || '',
          tipEchipamentId: editingEquipment.tipEchipamentId || '',
          stareEchipamentId: editingEquipment.stareEchipamentId || '',
          pozitieLinie: editingEquipment.pozitieLinie || '',
          pozitieColoana: editingEquipment.pozitieColoana || '',
          pretCurent: editingEquipment.pretCurent || '',
          activ: editingEquipment.activ !== undefined ? editingEquipment.activ : true
        });
      } else {
        setFormData({
          denumire: '',
          plajaId: '',
          tipEchipamentId: '',
          stareEchipamentId: '',
          pozitieLinie: '',
          pozitieColoana: '',
          pretCurent: '',
          activ: true
        });
      }
    }, [editingEquipment]);

    const handleSubmit = async (e) => {
      e.preventDefault();
      
      try {
        const equipmentData = {
          denumire: formData.denumire,
          plajaId: parseInt(formData.plajaId),
          tipEchipamentId: parseInt(formData.tipEchipamentId),
          stareEchipamentId: parseInt(formData.stareEchipamentId),
          pozitieLinie: parseInt(formData.pozitieLinie),
          pozitieColoana: parseInt(formData.pozitieColoana),
          pretCurent: parseFloat(formData.pretCurent),
          activ: formData.activ
        };

        if (editingEquipment) {
          console.log('✏️ Updating equipment:', editingEquipment.id, equipmentData);
          await apiService.updateEchipamentPlaja(editingEquipment.id, equipmentData);
          console.log('✅ Equipment updated successfully');
          alert('Echipamentul a fost actualizat cu succes!');
        } else {
          console.log('➕ Creating equipment:', equipmentData);
          await apiService.createEchipamentPlaja(equipmentData);
          console.log('✅ Equipment created successfully');
          alert('Echipamentul a fost creat cu succes!');
        }

        setShowModal(false);
        await loadEquipment(); // Reîncarcă lista
      } catch (err) {
        console.error('❌ Error saving equipment:', err);
        alert('Eroare la salvarea echipamentului: ' + (err.message || 'Eroare necunoscută'));
      }
    };

    return (
      <div className={`modal fade ${showModal ? 'show d-block' : ''}`} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                {editingEquipment ? 'Editează Echipament' : 'Adaugă Echipament Nou'}
              </h5>
              <button className="btn-close" onClick={() => setShowModal(false)}></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Denumire *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.denumire}
                      onChange={(e) => setFormData({...formData, denumire: e.target.value})}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Plaja *</label>
                    <select
                      className="form-select"
                      value={formData.plajaId}
                      onChange={(e) => setFormData({...formData, plajaId: e.target.value})}
                      required
                    >
                      <option value="">Selectează plaja</option>
                      {plaje.map(plaja => (
                        <option key={plaja.id} value={plaja.id}>{plaja.denumire}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Tip Echipament *</label>
                    <select
                      className="form-select"
                      value={formData.tipEchipamentId}
                      onChange={(e) => setFormData({...formData, tipEchipamentId: e.target.value})}
                      required
                    >
                      <option value="">Selectează tipul</option>
                      {tipuriEchipament.map(tip => (
                        <option key={tip.id} value={tip.id}>{tip.denumire}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Stare *</label>
                    <select
                      className="form-select"
                      value={formData.stareEchipamentId}
                      onChange={(e) => setFormData({...formData, stareEchipamentId: e.target.value})}
                      required
                    >
                      <option value="">Selectează starea</option>
                      {stariEchipament.map(stare => (
                        <option key={stare.id} value={stare.id}>{stare.denumire}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Preț Curent (RON) *</label>
                    <PositiveNumberInput
                      // type="number"
                      className="form-control"
                      value={formData.pretCurent}
                      onChange={(e) => setFormData({...formData, pretCurent: e.target.value})}
                      min="0"
                      step="0.01"
                      required
                    />
              
                  </div>
                  <div className="col-md-6">
                    <div className="row">
                      <div className="col-6">
                        <label className="form-label">Linia *</label>
                        <PositiveNumberInput
                          // type="number"
                          className="form-control"
                          value={formData.pozitieLinie}
                          onChange={(e) => setFormData({...formData, pozitieLinie: e.target.value})}
                          min="1"
                          required
                        />
                      </div>
                      <div className="col-6">
                        <label className="form-label">Coloana *</label>
                        <PositiveNumberInput
                          // type="number"
                          className="form-control"
                          value={formData.pozitieColoana}
                          onChange={(e) => setFormData({...formData, pozitieColoana: e.target.value})}
                          min="1"
                          required
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        checked={formData.activ}
                        onChange={(e) => setFormData({...formData, activ: e.target.checked})}
                      />
                      <label className="form-check-label">Activ</label>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Anulează
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingEquipment ? 'Actualizează' : 'Adaugă'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  };

  const PriceHistoryModal = () => {
    const selectedEquipment = equipment.find(e => e.id === showPriceHistory);
    
    return (
      <div className={`modal fade ${showPriceHistory ? 'show d-block' : ''}`} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                Istoric Prețuri - {selectedEquipment?.tipEchipamentDenumire || 'Echipament'}
              </h5>
              <button className="btn-close" onClick={() => setShowPriceHistory(null)}></button>
            </div>
            <div className="modal-body">
              <div className="alert alert-info">
                <Icon name="dollar" size={20} className="me-2" />
                <strong>Preț curent:</strong> {selectedEquipment?.pretCurent || 0} RON
              </div>
              <p className="text-muted">
                Funcționalitatea de istoric prețuri va fi implementată în curând.
                Pentru moment, puteți vedea doar prețul curent al echipamentului.
              </p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowPriceHistory(null)}>
                Închide
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Loading state
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Se încarcă...</span>
          </div>
          <p className="text-muted">Se încarcă echipamentele din baza de date...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger" role="alert">
          <div className="d-flex align-items-center mb-2">
            <Icon name="alert" size={20} className="me-2" />
            <h4 className="alert-heading mb-0">Eroare la încărcarea datelor!</h4>
          </div>
          <p className="mb-3">{error}</p>
          <div className="d-flex gap-2">
            <button className="btn btn-outline-danger" onClick={loadEquipment}>
              <Icon name="refresh" size={18} className="me-2" />
              Încearcă din nou
            </button>
            <button className="btn btn-outline-primary" onClick={() => window.location.reload()}>
              Reîncarcă pagina
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">Managementul Echipamentelor</h2>
          <p className="text-muted mb-0">
            Gestionează echipamentele de plajă și prețurile acestora
            {/* <span className="badge bg-success ms-2">Live Data</span> */}
          </p>
        </div>
        <div className="d-flex gap-2">
          <button 
            className="btn btn-outline-primary" 
            onClick={loadEquipment}
            disabled={refreshing}
          >
            {refreshing ? (
              <span className="spinner-border spinner-border-sm me-2" />
            ) : (
              <Icon name="refresh" size={18} className="me-2" />
            )}
            Actualizează
          </button>
          {/* <button className="btn btn-primary" onClick={handleAddEquipment}>
            <Icon name="plus" size={18} className="me-2" />
            Adaugă Echipament
          </button> */}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border p-4 mb-4">
        <div className="row g-3">
          <div className="col-md-4">
            <label className="form-label small text-muted">Caută echipament</label>
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0">
                <Icon name="search" size={16} className="text-muted" />
              </span>
              <input
                type="text"
                className="form-control border-start-0"
                placeholder="Denumire sau tip echipament..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
              />
            </div>
          </div>
          <div className="col-md-4">
            <label className="form-label small text-muted">Plaja</label>
            <select
              className="form-select"
              value={filterPlaja}
              onChange={(e) => handleFilterChange('plaja', e.target.value)}
            >
              <option value="">Toate plajele</option>
              {
                user.role==='MANAGER'?plaje.filter((el)=>el.userId===user.id).map(plaja => (
                <option key={plaja.id} value={plaja.id}>{plaja.denumire}</option>
              )):plaje.map(plaja => (
                <option key={plaja.id} value={plaja.id}>{plaja.denumire}</option>
              ))
              }
            </select>
          </div>
          <div className="col-md-4">
            <label className="form-label small text-muted">Stare</label>
            <select
              className="form-select"
              value={filterStare}
              onChange={(e) => handleFilterChange('stare', e.target.value)}
            >
              <option value="">Toate stările</option>
              {stariEchipament.map(stare => (
                <option key={stare.id} value={stare.id}>{stare.denumire}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Statistics cu date reale */}
      <div className="row g-4 mb-4">
        <div className="col-md-4">
          <div className="bg-white rounded-lg shadow-sm border p-4 text-center">
            <div className="bg-primary bg-opacity-10 rounded-circle p-3 d-inline-flex mb-2">
              <Icon name="umbrella" size={24} className="text-primary" />
            </div>
            <h4 className="fw-bold mb-1">{stats.total}</h4>
            <small className="text-muted">Total Echipamente</small>
          </div>
        </div>
        <div className="col-md-4">
          <div className="bg-white rounded-lg shadow-sm border p-4 text-center">
            <div className="bg-success bg-opacity-10 rounded-circle p-3 d-inline-flex mb-2">
              <Icon name="eye" size={24} className="text-success" />
            </div>
            <h4 className="fw-bold mb-1">{stats.disponibile}</h4>
            <small className="text-muted">Disponibile</small>
          </div>
        </div>
        <div className="col-md-4">
          <div className="bg-white rounded-lg shadow-sm border p-4 text-center">
            <div className="bg-danger bg-opacity-10 rounded-circle p-3 d-inline-flex mb-2">
              <Icon name="tool" size={24} className="text-danger" />
            </div>
            <h4 className="fw-bold mb-1">{stats.indisponibile}</h4>
            <small className="text-muted">Indisponibile</small>
          </div>
        </div>
      </div>

      {/* Equipment Table */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-4 border-bottom">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h5 className="fw-bold mb-0">Lista Echipamente</h5>
              <small className="text-muted">
                Afișează {startIndex + 1}-{Math.min(endIndex, totalItems)} din {totalItems} echipamente
                {totalItems !== equipment.length && ` (filtrate din ${equipment.length})`}
              </small>
            </div>
            <button className="btn btn-outline-primary btn-sm" onClick={loadEquipment}>
              <Icon name="refresh" size={16} className="me-1" />
              Reîmprospătează
            </button>
          </div>
        </div>
        
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead className="table-light">
              <tr>
                <th>ID</th>
                <th>Tip Echipament</th>
                <th>Plaja</th>
                <th>Poziție</th>
                <th>Stare</th>
                <th>Preț</th>
                <th>Status</th>
                {/* <th width="150">Acțiuni</th> */}
              </tr>
            </thead>
            <tbody>
              {currentEquipment.map(equip => (
                <tr key={equip.id}>
                  <td className="fw-bold text-primary">#{equip.id}</td>
                  <td>
                    <div className="d-flex align-items-center">
                      <Icon name="umbrella" size={16} className="text-muted me-2" />
                      <div>
                        <div className="fw-semibold">{equip.tipEchipamentDenumire || 'N/A'}</div>
                        {equip.denumire && (
                          <small className="text-muted">{equip.denumire}</small>
                        )}
                      </div>
                    </div>
                  </td>
                  <td>{equip.plajaDenumire || 'N/A'}</td>
                  <td>
                    <span className="badge bg-light text-dark">
                      L{equip.pozitieLinie || 0}, C{equip.pozitieColoana || 0}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${getStatusBadgeClass(equip.stareEchipamentDenumire)}`}>
                      {equip.stareEchipamentDenumire || 'N/A'}
                    </span>
                  </td>
                  <td className="fw-bold">{equip.pretCurent || 0} RON</td>
                  <td>
                    <span className={`badge ${equip.activ ? 'bg-success' : 'bg-secondary'}`}>
                      {equip.activ ? 'Activ' : 'Inactiv'}
                    </span>
                  </td>
                  {/* <td>
                    <div className="btn-group btn-group-sm">
                      <button 
                        className="btn btn-outline-primary"
                        onClick={() => handleEditEquipment(equip)}
                        title="Editează"
                      >
                        <Icon name="edit" size={14} />
                      </button>
                      <button 
                        className="btn btn-outline-info"
                        onClick={() => handleViewPriceHistory(equip.id)}
                        title="Istoric prețuri"
                      >
                        <Icon name="dollar" size={14} />
                      </button>
                      <button 
                        className="btn btn-outline-danger"
                        onClick={() => handleDeleteEquipment(equip.id)}
                        title="Șterge"
                      >
                        <Icon name="trash" size={14} />
                      </button>
                    </div>
                  </td> */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {currentEquipment.length === 0 && filteredEquipment.length === 0 && (
          <div className="text-center py-5">
            <Icon name="umbrella" size={48} className="text-muted mb-3" />
            <h5 className="text-muted">Nu au fost găsite echipamente</h5>
            <p className="text-muted mb-0">
              {equipment.length === 0 
                ? 'Nu există echipamente în baza de date. Adaugă primul echipament!'
                : 'Încercați să modificați filtrele de căutare.'
              }
            </p>
            {equipment.length === 0 && (
              <button className="btn btn-primary mt-3" onClick={handleAddEquipment}>
                <Icon name="plus" size={18} className="me-2" />
                Adaugă primul echipament
              </button>
            )}
          </div>
        )}
      </div>

      {/* Paginare */}
      {totalPages > 1 && (
        <div className="d-flex justify-content-center mt-4">
          <Pagination />
        </div>
      )}

      {/* Footer cu informații despre paginare */}
      {currentEquipment.length > 0 && (
        <div className="d-flex justify-content-between align-items-center mt-4">
          <div>
            <small className="text-muted">
              Pagina {currentPage} din {totalPages} 
              {totalPages > 1 && (
                <span> • {itemsPerPage} echipamente per pagină</span>
              )}
            </small>
          </div>
          <div className="d-flex align-items-center gap-3">
            <small className="text-muted">
              Total găsite: <span className="fw-bold">{totalItems}</span>
            </small>
            <small className="text-muted">
              Valoare totală: <span className="fw-bold text-success">
                {filteredEquipment.reduce((total, e) => total + (e.pretCurent || 0), 0).toFixed(2)} RON
              </span>
            </small>
          </div>
        </div>
      )}

      {/* Modals */}
      {showModal && <EquipmentModal />}
      {showPriceHistory && <PriceHistoryModal />}
    </div>
  );
};

export default EquipmentManagement;