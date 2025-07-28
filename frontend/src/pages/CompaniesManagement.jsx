import React, { useState, useEffect, useCallback } from 'react';

const CompaniesManagement = () => {
  const [companies, setCompanies] = useState([]);
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localitati, setLocalitati] = useState([]);

  const API_BASE_URL = 'http://localhost:8080/firme';

  const Icon = ({ name, size = 18, className = "" }) => {
    const icons = {
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
          <path d="m19,6v14a2,2 0 0,1-2,2H7a2,2 0 0,1-2-2V6m3,0V4a2,2 0 0,1,2-2h4a2,2 0 0,1,2,2v2"></path>
        </svg>
      ),
      check: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <polyline points="20,6 9,17 4,12"></polyline>
        </svg>
      ),
      x: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <path d="m18 6-12 12"></path>
          <path d="m6 6 12 12"></path>
        </svg>
      ),
      mail: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <rect width="20" height="16" x="2" y="4" rx="2"></rect>
          <path d="m22 7-10 5L2 7"></path>
        </svg>
      ),
      phone: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
        </svg>
      ),
      mapPin: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
          <circle cx="12" cy="10" r="3"></circle>
        </svg>
      ),
      refresh: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <polyline points="23 4 23 10 17 10"></polyline>
          <polyline points="1 20 1 14 7 14"></polyline>
          <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4-4.64 4.36A9 9 0 0 1 3.51 15"></path>
        </svg>
      )
    };
    
    return icons[name] || icons.building;
  };

  const makeApiCall = (method, url, data = null, callback) => {
    const xhr = new XMLHttpRequest();
    xhr.open(method, url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Accept', 'application/json');
    xhr.withCredentials = true;
    
    // Token demo pentru testare - înlocuiește cu token-ul real
    const adminToken = 'demo_token_for_testing';
    if (adminToken) {
      xhr.setRequestHeader('Authorization', `Bearer ${adminToken}`);
    }
    
    console.log('🚀 Making API call:', method, url);
    if (data) console.log('📦 Data:', data);
    
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {
        console.log('📡 Response status:', xhr.status);
        
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const responseData = xhr.responseText ? JSON.parse(xhr.responseText) : null;
            console.log('✅ Response data:', responseData);
            callback(null, responseData);
          } catch (e) {
            console.error('❌ JSON parse error:', e);
            callback(new Error('Invalid JSON response'), null);
          }
        } else {
          const error = new Error(`HTTP ${xhr.status}: ${xhr.statusText}`);
          error.status = xhr.status;
          const responseData = xhr.responseText ? JSON.parse(xhr.responseText) : null;
          if(responseData?.message) error.message = responseData.message;
          console.error('❌ API error:', xhr,error);
          
          // Fallback cu date demo pentru dezvoltare
          if (method === 'GET' && url.includes('localitati') && xhr.status !== 200) {
            console.log('🔄 Fallback to demo localitati data');
            const demoLocalitati = [
              { id: 1, nume: 'Constanța' },
              { id: 2, nume: 'București' },
              { id: 3, nume: 'Cluj-Napoca' },
              { id: 4, nume: 'Timișoara' },
              { id: 5, nume: 'Iași' }
            ];
            callback(null, demoLocalitati);
            return;
          } else if (method === 'GET' && url.includes('firme') && xhr.status !== 200) {
            console.log('🔄 Fallback to demo companies data');
            const demoCompanies = [
              {
                id: 1,
                denumire: 'SC Demo SRL',
                cui: 'RO12345678',
                adresa: 'Str. Principală nr. 1, Constanța',
                telefon: '0231234567',
                email: 'contact@demo.ro',
                activ: true,
                localitate: 1
              },
              {
                id: 2,
                denumire: 'Firma Test SRL',
                cui: 'RO87654321',
                adresa: 'Bd. Tomis nr. 50, Constanța',
                telefon: '0231765432',
                email: 'info@test.ro',
                activ: false,
                localitate: 2
              }
            ];
            callback(null, demoCompanies);
            return;
          }
          
          callback(error, null);
        }
      }
    };
    
    xhr.onerror = function() {
      console.error('❌ Network error');
      callback(new Error('Network error'), null);
    };
    
    if (data) {
      xhr.send(JSON.stringify(data));
    } else {
      xhr.send();
    }
  };

  const loadCompanies = useCallback((showLoadingIndicator = true) => {
    if (showLoadingIndicator) setLoading(true);
    setError(null);
    
    makeApiCall('GET', API_BASE_URL, null, (error, data) => {
      if (showLoadingIndicator) setLoading(false);
      if (error) {
        setError('Nu s-au putut încărca firmele');
      } else {
        const firmeData = data || [];
        const transformedCompanies = firmeData.map(firma => ({
          id: firma.id,
          nume: firma.denumire || 'Fără nume',
          cui: firma.cui || 'N/A',
          adresa: firma.adresa || 'Adresă necunoscută',
          telefon: firma.telefon || 'N/A',
          email: firma.email || 'N/A',
          activ: firma.activ,
          status: firma.activ ? 'Activ' : 'Inactiv',
          localitate: firma.localitate,
          originalData: firma
        }));
        setCompanies(transformedCompanies);
      }
    });
  }, []);

  const createCompany = (companyData, callback) => {
    makeApiCall('POST', API_BASE_URL, companyData, callback);
  };

  const updateCompany = (id, companyData, callback) => {
    makeApiCall('PUT', `${API_BASE_URL}/${id}`, companyData, callback);
  };

  const deleteCompany = async (id, callback) => {
    try {
      console.log('🗑️ Attempting DELETE with fetch API...');
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'omit' // Exclude credentials to avoid CORS issues
      });
      
      console.log('📡 DELETE Response status:', response.status);
      
      if (response.ok) {
        callback(null, null);
      } else {
        const error = new Error(`HTTP ${response.status}: ${response.statusText}`);
        error.status = response.status;
        callback(error, null);
      }
    } catch (error) {
      console.error('❌ DELETE fetch error:', error);
      callback(error, null);
    }
  };

  const handleDeleteCompany = (company) => {
    if (window.confirm(`Ești sigur că vrei să ștergi firma ${company.nume}?`)) {
      setIsSubmitting(true);
      deleteCompany(company.id, (error) => {
        setIsSubmitting(false);
        if (error) {
          alert(`Eroare la ștergere: ${error.message}`);
        } else {
          alert('Firma ștearsă cu succes!');
          loadCompanies();
        }
      });
    }
  };

  const handleToggleStatus = (company) => {
    setIsSubmitting(true);
    const updatedData = {
      ...company.originalData,
      activ: !company.activ
    };
    
    updateCompany(company.id, updatedData, (error) => {
      setIsSubmitting(false);
      if (error) {
        console.log('❌ Error toggling status:', error);
        alert(`Eroare: ${error.message || 'Necunoscută'}`);
      } else {
        alert('Status schimbat cu succes!');
        loadCompanies();
      }
    });
  };

  const loadLocalitati = useCallback(() => {
    console.log('🏘️ Loading localitati from API...');
    makeApiCall('GET', 'http://localhost:8080/api/localitati', null, (error, data) => {
      if (error) {
        console.error('❌ Eroare la încărcarea localităților:', error);
        // Fallback-ul este deja implementat în makeApiCall
      } else {
        console.log('✅ Localitati loaded:', data);
        console.log('📊 Number of localitati:', data ? data.length : 0);
        if (data && data.length > 0) {
          data.forEach((loc, index) => {
            console.log(`   ${index + 1}. ID: ${loc.id}, Denumire: ${loc.denumire}`);
          });
        }
        setLocalitati(data || []);
      }
    });
  }, []); // Empty dependency array to prevent re-creation

  useEffect(() => {
    console.log('🔄 Component mounted, loading data...');
    loadCompanies();
    loadLocalitati();
    
    // Remove interval for now to prevent re-renders
    // const intervalId = setInterval(() => {
    //   if (!showDetailsModal && !showEditModal && !showAddModal && !isSubmitting) {
    //     loadCompanies(false);
    //   }
    // }, 30000);
    // return () => clearInterval(intervalId);
  }, [loadCompanies, loadLocalitati]);

  // Debug: Log localitati state changes
  useEffect(() => {
    console.log('📊 Localitati state updated:', {
      count: localitati.length,
      data: localitati
    });
  }, [localitati]);

  useEffect(() => {
    if (!loading) {
      let result = [...companies];
      if (searchTerm) {
        const lowerSearchTerm = searchTerm.toLowerCase();
        result = result.filter(company =>
          company.nume.toLowerCase().includes(lowerSearchTerm) ||
          company.cui.toLowerCase().includes(lowerSearchTerm) ||
          company.email.toLowerCase().includes(lowerSearchTerm)
        );
      }
      if (selectedStatus !== 'all') {
        result = result.filter(company => 
          (selectedStatus === 'activ' && company.activ) ||
          (selectedStatus === 'inactiv' && !company.activ)
        );
      }
      setFilteredCompanies(result);
    }
  }, [searchTerm, selectedStatus, companies, loading]);

  const CompanyModal = ({ show, onHide, company, title, isAdd = false, readOnly = false }) => {
    const [formData, setFormData] = useState({
      cui: '',
      denumire: '',
      adresa: '',
      telefon: '',
      email: '',
      activ: true,
      localitate: ''
    });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
      if (show) {
        if (company && !isAdd) {
          setFormData({
            cui: company.originalData?.cui || company.cui || '',
            denumire: company.originalData?.denumire || company.nume || '',
            adresa: company.originalData?.adresa || company.adresa || '',
            telefon: company.originalData?.telefon || company.telefon || '',
            email: company.originalData?.email || company.email || '',
            activ: company.originalData?.activ !== undefined ? company.originalData.activ : (company.activ !== undefined ? company.activ : true),
            localitate: company.originalData?.localitate || company.localitate || ''
          });
        } else if (isAdd) {
          setFormData({
            cui: '',
            denumire: '',
            adresa: '',
            telefon: '',
            email: '',
            activ: true,
            localitate: ''
          });
        }
      }
    }, [company, isAdd, show]);

    if (!show) return null;

    const handleInputChange = (field, value) => {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    };

    const handleSave = () => {
      if (!formData.denumire.trim()) {
        alert('Denumirea firmei este obligatorie!');
        return;
      }
      if (!formData.cui.trim()) {
        alert('CUI-ul este obligatoriu!');
        return;
      }
      if (!formData.email.trim()) {
        alert('Email-ul este obligatoriu!');
        return;
      }
      if (!formData.telefon.trim()) {
        alert('Telefonul este obligatoriu!');
        return;
      }
      if (!formData.adresa.trim()) {
        alert('Adresa este obligatorie!');
        return;
      }
      // Localitatea nu mai este obligatorie

      setSaving(true);
      
      const callback = (error) => {
        setSaving(false);
        if (error) {
          alert(`Eroare la salvare: ${error.message}`);
        } else {
          alert(isAdd ? 'Firma adăugată cu succes!' : 'Firma actualizată cu succes!');
          onHide();
          loadCompanies();
        }
      };

      if (isAdd) {
        createCompany(formData, callback);
      } else {
        updateCompany(company.id, formData, callback);
      }
    };

    return (
      <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{title}</h5>
              <button type="button" className="btn-close" onClick={onHide}></button>
            </div>
            <div className="modal-body">
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Denumire firmă *</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={formData.denumire}
                    onChange={(e) => handleInputChange('denumire', e.target.value)}
                    placeholder="Numele firmei"
                    readOnly={readOnly}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">CUI *</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={formData.cui}
                    onChange={(e) => handleInputChange('cui', e.target.value)}
                    placeholder="RO12345678"
                    maxLength="10"
                    readOnly={readOnly}
                  />
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label">Adresă *</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={formData.adresa}
                  onChange={(e) => handleInputChange('adresa', e.target.value)}
                  placeholder="Adresa completă"
                  maxLength="200"
                  readOnly={readOnly}
                />
              </div>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Localitate *</label>
                  <select 
                    className="form-select" 
                    value={formData.localitate || ''}
                    onChange={(e) => handleInputChange('localitate', e.target.value)}
                    required
                    disabled={readOnly}
                  >
                    <option value="">Selectează localitatea...</option>
                    {localitati.length > 0 ? (
                      localitati.map(localitate => (
                        <option key={localitate.id} value={localitate.id}>
                          {localitate.denumire}
                        </option>
                      ))
                    ) : (
                      <option disabled>Se încarcă localitățile...</option>
                    )}
                  </select>
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Telefon *</label>
                  <input 
                    type="tel" 
                    className="form-control" 
                    value={formData.telefon}
                    onChange={(e) => handleInputChange('telefon', e.target.value)}
                    placeholder="0231456789"
                    maxLength="10"
                    readOnly={readOnly}
                  />
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label">Email *</label>
                <input 
                  type="email" 
                  className="form-control" 
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="contact@firma.ro"
                  maxLength="150"
                  readOnly={readOnly}
                />
              </div>
              <div className="form-check">
                <input 
                  className="form-check-input" 
                  type="checkbox" 
                  id="activCheck"
                  checked={formData.activ}
                  onChange={(e) => handleInputChange('activ', e.target.checked)}
                  disabled={readOnly}
                />
                <label className="form-check-label" htmlFor="activCheck">
                  Firmă activă
                </label>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onHide}>
                {readOnly ? 'Închide' : 'Anulează'}
              </button>
              {!readOnly && (
                <button 
                  type="button" 
                  className="btn btn-primary" 
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <div className="spinner-border spinner-border-sm me-2"></div>
                      Salvează...
                    </>
                  ) : (
                    <>
                      <Icon name="check" size={16} className="me-2" />
                      {isAdd ? 'Creează' : 'Actualizează'} Firma
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading && companies.length === 0) {
    return (
      <div className="container-fluid py-3 px-lg-4">
        <div className="text-center py-5">
          <div className="spinner-border text-primary mb-3"></div>
          <p>Se încarcă firmele...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-3 px-lg-4">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
          <h1 className="h3 fw-bold mb-0">Managementul Firmelor</h1>
          <p className="text-muted small mb-0">Gestionează firmele partenere și informațiile acestora</p>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-secondary btn-sm" onClick={() => loadCompanies()} disabled={loading || isSubmitting}>
            <Icon name="refresh" size={16} className="me-1" />Reîmprospătează
          </button>
          <button className="btn btn-primary btn-sm" onClick={() => setShowAddModal(true)} disabled={isSubmitting}>
            <Icon name="plus" size={16} className="me-1" />Adaugă Firmă
          </button>
        </div>
      </div>

      {error && (
        <div className="alert alert-warning alert-dismissible fade show small" role="alert">
          <strong>Atenție:</strong> {error}
          <button type="button" className="btn-close" onClick={() => setError(null)}></button>
        </div>
      )}

      <div className="row g-3 mb-4">
        <div className="col-sm-6 col-lg-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body d-flex align-items-center p-3">
              <div className="p-3 rounded-circle bg-primary bg-opacity-10 me-3">
                <Icon name="building" size={22} className="text-primary" />
              </div>
              <div>
                <h5 className="fw-bold mb-0">{companies.length}</h5>
                <small className="text-muted">Total Firme</small>
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
                <h5 className="fw-bold mb-0">{companies.filter(c => c.activ).length}</h5>
                <small className="text-muted">Firme Active</small>
              </div>
            </div>
          </div>
        </div>
        <div className="col-sm-6 col-lg-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body d-flex align-items-center p-3">
              <div className="p-3 rounded-circle bg-danger bg-opacity-10 me-3">
                <Icon name="x" size={22} className="text-danger" />
              </div>
              <div>
                <h5 className="fw-bold mb-0">{companies.filter(c => !c.activ).length}</h5>
                <small className="text-muted">Firme Inactive</small>
              </div>
            </div>
          </div>
        </div>
        <div className="col-sm-6 col-lg-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body d-flex align-items-center p-3">
              <div className="p-3 rounded-circle bg-info bg-opacity-10 me-3">
                <Icon name="mail" size={22} className="text-info" />
              </div>
              <div>
                <h5 className="fw-bold mb-0">{companies.filter(c => c.email !== 'N/A').length}</h5>
                <small className="text-muted">Cu Email Valid</small>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm p-3 mb-4">
        <div className="row g-3 align-items-center">
          <div className="col-xl-6 col-lg-4 col-md-12">
            <div className="input-group">
              <span className="input-group-text text-muted">
                <Icon name="search" size={16} />
              </span>
              <input 
                type="text" 
                className="form-control" 
                placeholder="Caută firmă, CUI, email..." 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
              />
            </div>
          </div>
          <div className="col-xl-4 col-lg-4 col-md-6">
            <select className="form-select" value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
              <option value="all">Toate statusurile</option>
              <option value="activ">Active</option>
              <option value="inactiv">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {filteredCompanies.length > 0 ? filteredCompanies.map(company => (
          <div key={company.id} className="col-md-6 col-lg-4 d-flex">
            <div className="card shadow-sm border-0 h-100 w-100">
              <div className={`card-header ${company.activ ? 'bg-primary-subtle text-primary-emphasis' : 'bg-secondary-subtle text-secondary-emphasis'} p-3`}>
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="fw-bold mb-0 card-title text-truncate" title={company.nume}>
                    {company.nume}
                  </h5>
                  <span className={`badge ${company.activ ? 'bg-success' : 'bg-danger'}`}>
                    {company.activ ? 'Activ' : 'Inactiv'}
                  </span>
                </div>
              </div>
              <div className="card-body p-3 d-flex flex-column">
                <div className="mb-2">
                  <div className="d-flex align-items-center mb-1">
                    <Icon name="building" size={14} className="text-muted me-2" />
                    <small><strong>CUI:</strong> {company.cui}</small>
                  </div>
                  <div className="d-flex align-items-center mb-1">
                    <Icon name="phone" size={14} className="text-muted me-2" />
                    <small>{company.telefon}</small>
                  </div>
                  <div className="d-flex align-items-center mb-1">
                    <Icon name="mail" size={14} className="text-muted me-2" />
                    <small className="text-truncate" title={company.email}>{company.email}</small>
                  </div>
                  <div className="d-flex align-items-start">
                    <Icon name="mapPin" size={14} className="text-muted me-2 mt-1 flex-shrink-0" />
                    <small className="text-muted" style={{ 
                      fontSize: '0.8rem', 
                      maxHeight: '40px',
                      overflow: 'hidden', 
                      textOverflow: 'ellipsis', 
                      display: '-webkit-box', 
                      WebkitLineClamp: 2, 
                      WebkitBoxOrient: 'vertical' 
                    }}>
                      {company.adresa}
                    </small>
                  </div>
                </div>
                
                <div className="mt-auto">
                  <div className="d-grid gap-2 d-sm-flex mb-2">
                    <button 
                      className="btn btn-outline-secondary btn-sm flex-sm-fill" 
                      onClick={() => {
                        setSelectedCompany(company);
                        setShowEditModal(true);
                      }}
                      disabled={isSubmitting}
                    >
                      <Icon name="edit" size={14} className="me-1" />Editează
                    </button>
                    <button 
                      className="btn btn-outline-primary btn-sm flex-sm-fill" 
                      onClick={() => {
                        setSelectedCompany(company);
                        setShowDetailsModal(true);
                      }}
                      disabled={isSubmitting}
                    >
                      <Icon name="check" size={14} className="me-1" />Detalii
                    </button>
                  </div>
                  <div className="d-grid gap-2 d-sm-flex">
                    <button 
                      className={`btn btn-sm flex-sm-fill ${company.activ ? 'btn-outline-warning' : 'btn-outline-success'}`} 
                      onClick={() => handleToggleStatus(company)} 
                      disabled={isSubmitting}
                    >
                      {isSubmitting && selectedCompany?.id === company.id ? '...' : (company.activ ? 'Dezactivează' : 'Activează')}
                    </button>
                    <button 
                      title="Șterge Firma" 
                      className="btn btn-outline-danger btn-sm" 
                      onClick={() => {
                        if (window.confirm(`Ești sigur că vrei să ștergi firma ${company.nume}?`)) {
                          setIsSubmitting(true);
                          deleteCompany(company.id, (error) => {
                            setIsSubmitting(false);
                            if (error) {
                              alert(`Eroare la ștergere: ${error.message}`);
                            } else {
                              alert('Firma ștearsă cu succes!');
                              loadCompanies();
                            }
                          });
                        }
                      }}
                      disabled={isSubmitting}
                    >
                      <Icon name="trash" size={14} />
                    </button>
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
                  <h5 className="text-muted">Nicio firmă nu corespunde filtrelor actuale.</h5>
                  <p className="text-muted small">Încearcă să ajustezi căutarea sau filtrele.</p>
                </div>
              </div>
            </div>
          )
        )}
      </div>

      {showDetailsModal && selectedCompany && (
        <CompanyModal 
          show={showDetailsModal} 
          onHide={() => { 
            setShowDetailsModal(false); 
            setSelectedCompany(null); 
          }} 
          company={selectedCompany}
          title={`Detalii Firmă: ${selectedCompany.nume}`}
          isAdd={false}
          readOnly={true}
        />
      )}

      {showEditModal && selectedCompany && (
        <CompanyModal 
          show={showEditModal} 
          onHide={() => { 
            setShowEditModal(false); 
            setSelectedCompany(null); 
          }} 
          company={selectedCompany}
          title="Editează Firma"
          isAdd={false}
        />
      )}
      
      {showAddModal && (
        <CompanyModal 
          show={showAddModal} 
          onHide={() => setShowAddModal(false)}
          title="Adaugă Firmă Nouă"
          isAdd={true}
        />
      )}
    </div>
  );
};

export default CompaniesManagement;