import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

const ManagerRequestsPage = () => {
  const authContext = useContext(AuthContext); // Obține contextul complet
  const { user, token } = authContext || {}; // Destructurare cu fallback
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [localitati, setLocalitati] = useState({});

  // CONSTANTA PENTRU BACKEND URL
  const BACKEND_URL = 'http://localhost:8080';

  // Iconuri simple
  const Icon = ({ name, size = 18, className = "" }) => {
    const icons = {
      eye: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
          <circle cx="12" cy="12" r="3"></circle>
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
      building: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"></path>
          <path d="M6 12H4a2 2 0 0 0-2 2v8h4"></path>
          <path d="M18 9h2a2 2 0 0 1 2 2v11h-4"></path>
        </svg>
      ),
      user: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
      ),
      refresh: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
          <path d="M3 3v5h5"></path>
          <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"></path>
          <path d="M21 21v-5h-5"></path>
        </svg>
      ),
      alertCircle: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
      ),
      shield: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
        </svg>
      )
    };
    return icons[name] || icons.user;
  };

  // DEBUG: Loghează starea context-ului
  // console.log('🏢 ManagerRequestsPage - Auth Context Debug:', {
  //   hasUser: !!user,
  //   userRole: user?.role,
  //   userRoles: user?.roles,
  //   hasToken: !!token,
  //   tokenPreview: token ? token.substring(0, 20) + '...' : 'MISSING'
  // });

  // Verifică dacă utilizatorul este admin - COMPATIBIL CU AUTHCONTEXT
  const isAdmin = () => {
    console.log('🔍 Checking admin status for user:', user);
    
    if (!user) {
      console.log('❌ No user available');
      return false;
    }
    
    // Verificare 1: user.role === 'ADMIN' (principala în AuthContext)
    if (user.role === 'ADMIN') {
      console.log('✅ User is ADMIN via user.role');
      return true;
    }
    
    // Verificare 2: user.roles array (backup)
    if (user.roles && Array.isArray(user.roles)) {
      const hasAdminRole = user.roles.some(role => 
        role === 'ADMIN' || 
        role === 'ROLE_ADMIN' || 
        (typeof role === 'object' && (role.name === 'ADMIN' || role.name === 'ROLE_ADMIN'))
      );
      
      if (hasAdminRole) {
        console.log('✅ User is ADMIN via user.roles array');
        return true;
      }
    }
    
    // Verificare 3: folosește funcția hasRole din AuthContext
    if (typeof authContext?.hasRole === 'function') {
      const isAdminViaContext = authContext.hasRole('ADMIN');
      console.log('🔍 Admin check via AuthContext.hasRole:', isAdminViaContext);
      return isAdminViaContext;
    }
    
    console.log('❌ User is NOT admin');
    console.log('   user.role:', user.role);
    console.log('   user.roles:', user.roles);
    return false;
  };

  // Funcție helper pentru request-uri autentificate
  const authenticatedFetch = async (url, options = {}) => {
    console.log('🌐 Making authenticated request to:', url);
    
    // ✅ CORECTARE: Încearcă să obțină token-ul din orice sursă
    let authToken = token;
    if (!authToken) {
      authToken = localStorage.getItem('authToken');
      console.log('🔑 Token taken from localStorage');
    }
    
    if (!authToken) {
      console.error('❌ No authentication token available anywhere');
      throw new Error('Nu sunteți autentificat. Vă rugăm să vă reconectați.');
    }

    const defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${authToken}`
    };

    const config = {
      method: 'GET',
      mode: 'cors',
      credentials: 'include',
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    console.log('📋 Request config:', {
      method: config.method,
      url: url,
      hasAuth: !!config.headers['Authorization'],
      tokenLength: authToken ? authToken.length : 0
    });

    try {
      const response = await fetch(url, config);
      
      console.log(`📡 Response:`, {
        status: response.status,
        statusText: response.statusText,
        contentType: response.headers.get('content-type'),
        url: response.url
      });

      // ✅ ÎMBUNĂTĂȚIRE: Loghează headers-ul de răspuns pentru debugging
      if (process.env.NODE_ENV === 'development') {
        console.log('📡 Response headers:', Object.fromEntries(response.headers.entries()));
      }

      // Dacă primim 401, token-ul a expirat
      if (response.status === 401) {
        console.error('🔒 Unauthorized - token might be expired');
        // ✅ NU ARUNCA EROARE IMEDIAT: Încearcă să continue cu următorul endpoint
        throw new Error('Token expirat sau invalid');
      }

      // Dacă primim 403, nu avem permisiuni
      if (response.status === 403) {
        console.error('🚫 Forbidden - insufficient permissions');
        throw new Error('Permisiuni insuficiente');
      }

      return response;
    } catch (fetchError) {
      console.error('🔴 Fetch error:', fetchError);
      
      if (fetchError.message.includes('Failed to fetch')) {
        throw new Error('Nu se poate conecta la server. Verificați dacă backend-ul rulează.');
      }
      
      throw fetchError;
    }
  };

  // Încarcă cererile cu verificări îmbunătățite
  const loadRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 Loading manager requests...');
      console.log('🔑 Auth state:', { hasUser: !!user, hasToken: !!token, isAdmin: isAdmin() });
      
      // ✅ CORECTARE: Obține token-ul din orice sursă disponibilă
      const authToken = token || localStorage.getItem('authToken');
      
      if (!authToken) {
        throw new Error('Nu sunteți autentificat. Vă rugăm să vă logați ca administrator.');
      }
      
      // ✅ AVERTIZARE ADMIN: Nu oprește execuția, doar loghează
      if (user && !isAdmin()) {
        console.warn('⚠️ User might not have ADMIN role, but proceeding with request');
        console.warn('   This could be a timing issue or role verification problem');
        console.warn('   User role:', user?.role);
      }

      // Lista de endpoint-uri de încercat
      const endpointsToTry = [
        `${BACKEND_URL}/api/admin/cereri-manageri/simple`, // ✅ PRIMUL
        `${BACKEND_URL}/api/admin/cereri-manageri`,
        `${BACKEND_URL}/api/cereri-manageri/in-asteptare`,
        `${BACKEND_URL}/api/cereri-manageri`
      ];

      let lastError = null;

      for (const endpoint of endpointsToTry) {
        try {
          console.log(`🎯 Trying endpoint: ${endpoint}`);
          const response = await authenticatedFetch(endpoint);

          if (response.ok) {
            const contentType = response.headers.get('content-type');
            
            if (!contentType || !contentType.includes('application/json')) {
              console.warn(`⚠️ Non-JSON response from ${endpoint}: ${contentType}`);
              continue;
            }

            const responseText = await response.text();
            
            // Verifică dacă răspunsul pare să fie HTML
            if (responseText.trim().startsWith('<!DOCTYPE') || responseText.trim().startsWith('<html')) {
              console.warn(`⚠️ HTML response from ${endpoint}`);
              continue;
            }

            // Încearcă să parseze JSON-ul
            try {
              const data = JSON.parse(responseText);
              console.log(`✅ Success with endpoint: ${endpoint}`);
              
              // Verifică structura datelor
              let requestsArray = [];
              
              if (Array.isArray(data)) {
                requestsArray = data;
              } else if (data.data && Array.isArray(data.data)) {
                requestsArray = data.data;
              } else if (data.requests && Array.isArray(data.requests)) {
                requestsArray = data.requests;
              } else if (data.content && Array.isArray(data.content)) {
                requestsArray = data.content;
              } else {
                console.warn('⚠️ Unexpected data structure:', data);
                requestsArray = [];
              }
              
              console.log(`📊 Setting ${requestsArray.length} requests`);
              setRequests(requestsArray);
              return; // Succes
              
            } catch (parseError) {
              console.error(`❌ JSON parse error for ${endpoint}:`, parseError);
              lastError = new Error(`Invalid JSON from ${endpoint}: ${parseError.message}`);
            }
          } else {
            console.error(`❌ HTTP error ${response.status} from ${endpoint}`);
            lastError = new Error(`HTTP ${response.status} - ${response.statusText}`);
          }
        } catch (err) {
          console.error(`💥 Error with ${endpoint}:`, err.message);
          lastError = err;
        }
      }

      // Dacă ajungem aici, niciun endpoint nu a funcționat
      throw lastError || new Error('Nu s-au putut încărca cererile din niciun endpoint');

    } catch (error) {
      console.error('❌ Error loading requests:', error);
      setError(error.message);
      setRequests([]);
      
      // ✅ MOCK DATA: Afișează date de test pentru a verifica că UI-ul funcționează
      if (process.env.NODE_ENV === 'development') {
        console.log('🧪 Loading mock data for development...');
        const mockData = [
          {
            id: 1,
            user: {
              id: 1,
              name: 'Ion Popescu',
              email: 'ion.popescu@example.com'
            },
            denumire: 'Beach Resort SRL',
            cui: 'RO12345678',
            email: 'contact@beachresort.ro',
            telefon: '0721234567',
            adresa: 'Str. Mării nr. 1',
            localitate: 1,
            status: 'IN_ASTEPTARE',
            createdAt: '2024-01-15T10:30:00Z'
          },
          {
            id: 2,
            user: {
              id: 2,
              name: 'Maria Ionescu',
              email: 'maria.ionescu@example.com'
            },
            denumire: 'Sunny Beach SRL',
            cui: 'RO87654321',
            email: 'info@sunnybeach.ro',
            telefon: '0731234567',
            adresa: 'Bdul. Mamaia nr. 50',
            localitate: 1,
            status: 'APROBAT',
            createdAt: '2024-01-10T14:20:00Z'
          }
        ];
        setRequests(mockData);
        console.log('✅ Mock data loaded, clearing error');
        setError(null);
      }
    } finally {
      setLoading(false);
    }
  };

  // Încarcă localitățile
  const loadLocalitati = async () => {
    try {
      console.log('🏘️ Loading localitati...');
      const response = await fetch(`${BACKEND_URL}/api/localitati`);
      
      if (response.ok && response.headers.get('content-type')?.includes('application/json')) {
        const data = await response.json();
        const localitatiMap = {};
        
        if (Array.isArray(data)) {
          data.forEach(loc => {
            localitatiMap[loc.id] = loc.denumire || loc.name || loc.nume;
          });
        }
        
        setLocalitati(localitatiMap);
        console.log('✅ Localitati loaded:', localitatiMap);
      } else {
        throw new Error('API not available');
      }
    } catch (error) {
      console.warn('⚠️ Using fallback localitati:', error.message);
      setLocalitati({
        1: 'Constanța',
        2: 'București', 
        3: 'Cluj-Napoca',
        4: 'Timișoara',
        5: 'Iași'
      });
    }
  };

  // Aprobă cererea
  const approveRequest = async (id) => {
    if (!window.confirm('Ești sigur că vrei să aprobi această cerere?')) {
      return;
    }

    try {
      setActionLoading(true);
      console.log('✅ Approving request:', id);
      
      const response = await authenticatedFetch(`${BACKEND_URL}/api/admin/cereri-manageri/${id}/aproba`, {
        method: 'PUT'
      });
      
      if (response.ok) {
        const result = await response.json();
        await loadRequests();
        setShowModal(false);
        alert(result.message || 'Cererea a fost aprobată cu succes!');
      } else {
        const errorText = await response.text();
        console.error('❌ Error approving request:', errorText);
        alert('Eroare la aprobarea cererii: ' + errorText);
      }
    } catch (error) {
      console.error('❌ Error:', error);
      alert('Eroare la aprobarea cererii: ' + error.message);
    } finally {
      setActionLoading(false);
    }
  };

  // Respinge cererea
  const rejectRequest = async (id) => {
    if (!rejectReason.trim()) {
      alert('Te rog să introduci un motiv pentru respingere.');
      return;
    }

    if (!window.confirm('Ești sigur că vrei să respingi această cerere?')) {
      return;
    }

    try {
      setActionLoading(true);
      console.log('❌ Rejecting request:', id, 'with reason:', rejectReason);
      
      const response = await authenticatedFetch(`${BACKEND_URL}/api/admin/cereri-manageri/${id}/respinge`, {
        method: 'PUT',
        body: JSON.stringify({ motiv: rejectReason })
      });
      
      if (response.ok) {
        const result = await response.json();
        await loadRequests();
        setShowModal(false);
        setRejectReason('');
        alert(result.message || 'Cererea a fost respinsă!');
      } else {
        const errorText = await response.text();
        console.error('❌ Error rejecting request:', errorText);
        alert('Eroare la respingerea cererii: ' + errorText);
      }
    } catch (error) {
      console.error('❌ Error:', error);
      alert('Eroare la respingerea cererii: ' + error.message);
    } finally {
      setActionLoading(false);
    }
  };

  // Încarcă datele la mount
  useEffect(() => {
    console.log('🚀 ManagerRequestsPage mounted in AdminDashboard context');
    console.log('🔍 Current auth state:', { hasUser: !!user, hasToken: !!token, userRole: user?.role });
    
    // ✅ CORECTARE: Verifică și în localStorage dacă token-ul nu e în context
    const authToken = token || localStorage.getItem('authToken');
    
    console.log('🔑 Final token check:', {
      contextToken: !!token,
      localStorageToken: !!localStorage.getItem('authToken'),
      finalToken: !!authToken
    });
    
    // ✅ CORECTARE: Nu oprește execuția dacă user/token lipsesc din context
    // În contextul AdminDashboard, RoleProtectedRoute deja a verificat autentificarea
    if (!authToken) {
      console.error('❌ No token available anywhere');
      setError('Token de autentificare lipsește. Vă rugăm să vă reconectați.');
      setLoading(false);
      return;
    }
    
    // ✅ VERIFICARE ADMIN: Doar avertizare, nu oprește execuția
    if (user && !isAdmin()) {
      console.warn('⚠️ User might not be admin, but proceeding anyway');
      console.warn('   User role:', user.role);
      console.warn('   This might be a timing issue with AuthContext loading');
    }
    
    // ✅ ÎNCARCĂ DATELE: Încearcă să încarce datele indiferent de starea user din context
    console.log('📥 Loading requests and localitati...');
    loadRequests();
    loadLocalitati();
  }, [user, token]); // Păstrează dependențele pentru re-run când se actualizează

  // Restul funcțiilor helper...
  const filteredRequests = requests.filter(request => {
    if (filter === 'all') return true;
    if (filter === 'pending') return request.status === 'IN_ASTEPTARE';
    if (filter === 'approved') return request.status === 'APROBAT';
    if (filter === 'rejected') return request.status === 'RESPINS';
    return true;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'IN_ASTEPTARE':
        return <span className="badge bg-warning text-dark">În așteptare</span>;
      case 'APROBAT':
        return <span className="badge bg-success">Aprobat</span>;
      case 'RESPINS':
        return <span className="badge bg-danger">Respins</span>;
      default:
        return <span className="badge bg-secondary">Necunoscut</span>;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('ro-RO', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'N/A';
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Se încarcă...</span>
          </div>
          <p className="text-muted">Se încarcă cererile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid p-0">
     

      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold mb-0">
          <Icon name="building" className="me-2" />
          Cereri Manageri
        </h2>
        <div className="d-flex gap-2">
          <button 
            className="btn btn-outline-primary" 
            onClick={loadRequests}
            disabled={loading}
          >
            <Icon name="refresh" size={16} className="me-1" />
            Reîmprospătează
          </button>
          
          {/* Debug button pentru development */}
          {/* {process.env.NODE_ENV === 'development' && (
            <button 
              className="btn btn-outline-info btn-sm" 
              onClick={() => {
                console.log('🔍 DEBUG INFO:');
                console.log('User:', user);
                console.log('Token exists:', !!(token || localStorage.getItem('authToken')));
                console.log('Is Admin:', isAdmin());
                console.log('Requests:', requests);
                alert('Check console for debug info');
              }}
            >
              🧪 Debug
            </button>
          )} */}
        </div>
      </div>

      {/* Afișează eroarea dacă există */}
      {error && (
        <div className="alert alert-danger" role="alert">
          <Icon name="alertCircle" className="me-2" />
          <strong>Eroare:</strong> {error}
        </div>
      )}

      {/* Filtre */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <div className="row align-items-center">
            <div className="col-md-8">
              <h6 className="fw-bold mb-2">Filtrează după status</h6>
              <div className="btn-group" role="group">
                <input 
                  type="radio" 
                  className="btn-check" 
                  name="filter" 
                  id="all" 
                  checked={filter === 'all'}
                  onChange={() => setFilter('all')}
                />
                <label className="btn btn-outline-primary" htmlFor="all">
                  Toate ({requests.length})
                </label>

                <input 
                  type="radio" 
                  className="btn-check" 
                  name="filter" 
                  id="pending" 
                  checked={filter === 'pending'}
                  onChange={() => setFilter('pending')}
                />
                <label className="btn btn-outline-warning" htmlFor="pending">
                  În așteptare ({requests.filter(r => r.status === 'IN_ASTEPTARE').length})
                </label>

                <input 
                  type="radio" 
                  className="btn-check" 
                  name="filter" 
                  id="approved" 
                  checked={filter === 'approved'}
                  onChange={() => setFilter('approved')}
                />
                <label className="btn btn-outline-success" htmlFor="approved">
                  Aprobate ({requests.filter(r => r.status === 'APROBAT').length})
                </label>

                <input 
                  type="radio" 
                  className="btn-check" 
                  name="filter" 
                  id="rejected" 
                  checked={filter === 'rejected'}
                  onChange={() => setFilter('rejected')}
                />
                <label className="btn btn-outline-danger" htmlFor="rejected">
                  Respinse ({requests.filter(r => r.status === 'RESPINS').length})
                </label>
              </div>
            </div>
            <div className="col-md-4 text-md-end">
              <div className="text-muted">
                Total cereri: <strong>{filteredRequests.length}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lista cereri */}
      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">
          {filteredRequests.length === 0 ? (
            <div className="text-center py-5">
              <Icon name="building" size={48} className="text-muted mb-3" />
              <h5 className="text-muted">Nu există cereri</h5>
              <p className="text-muted">
                {error 
                  ? 'Nu s-au putut încărca cererile din cauza unei erori.'
                  : 'Nu au fost găsite cereri pentru filtrul selectat.'
                }
              </p>
              {error && !error.includes('autentificat') && !error.includes('permisiuni') && (
                <button className="btn btn-primary" onClick={loadRequests}>
                  <Icon name="refresh" size={16} className="me-1" />
                  Reîncarcă
                </button>
              )}
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th>ID</th>
                    <th>Utilizator</th>
                    <th>Firmă</th>
                    <th>CUI</th>
                    <th>Localitatea</th>
                    <th>Data cererii</th>
                    <th>Status</th>
                    <th>Acțiuni</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRequests.map(request => (
                    <tr key={request.id}>
                      <td className="fw-bold">#{request.id}</td>
                      <td>
                        <div>
                          <div className="fw-semibold">{request.user?.name || request.user?.nume || 'N/A'}</div>
                          <small className="text-muted">{request.user?.email || 'N/A'}</small>
                        </div>
                      </td>
                      <td>
                        <div className="fw-semibold">{request.denumire}</div>
                        <small className="text-muted">{request.email}</small>
                      </td>
                      <td className="fw-bold text-primary">{request.cui}</td>
                      <td>{localitati[request.localitate] || `ID: ${request.localitate}`}</td>
                      <td>
                        <small className="text-muted">{formatDate(request.createdAt || request.dataCerere)}</small>
                      </td>
                      <td>{getStatusBadge(request.status)}</td>
                      <td>
                        <div className="btn-group btn-group-sm">
                          <button 
                            className="btn btn-outline-primary"
                            onClick={() => {
                              setSelectedRequest(request);
                              setShowModal(true);
                            }}
                            title="Vezi detalii"
                          >
                            <Icon name="eye" size={14} />
                          </button>
                          
                          {request.status === 'IN_ASTEPTARE' && (
                            <>
                              <button 
                                className="btn btn-outline-success"
                                onClick={() => approveRequest(request.id)}
                                disabled={actionLoading}
                                title="Aprobă"
                              >
                                <Icon name="check" size={14} />
                              </button>
                              <button 
                                className="btn btn-outline-danger"
                                onClick={() => {
                                  setSelectedRequest(request);
                                  setShowModal(true);
                                }}
                                disabled={actionLoading}
                                title="Respinge"
                              >
                                <Icon name="x" size={14} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal pentru detalii și acțiuni */}
      {showModal && selectedRequest && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <Icon name="building" className="me-2" />
                  Detalii Cerere #{selectedRequest.id}
                </h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => {
                    setShowModal(false);
                    setRejectReason('');
                  }}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-6">
                    <h6 className="fw-bold mb-3">Informații Utilizator</h6>
                    <p><strong>Nume:</strong> {selectedRequest.user?.name || 'N/A'}</p>
                    <p><strong>Email:</strong> {selectedRequest.user?.email || 'N/A'}</p>
                  </div>
                  <div className="col-md-6">
                    <h6 className="fw-bold mb-3">Informații Firmă</h6>
                    <p><strong>Denumire:</strong> {selectedRequest.denumire}</p>
                    <p><strong>CUI:</strong> {selectedRequest.cui}</p>
                    <p><strong>Email:</strong> {selectedRequest.email}</p>
                    <p><strong>Telefon:</strong> {selectedRequest.telefon || 'N/A'}</p>
                    <p><strong>Adresă:</strong> {selectedRequest.adresa || 'N/A'}</p>
                    <p><strong>Localitatea:</strong> {localitati[selectedRequest.localitate] || 'N/A'}</p>
                  </div>
                </div>
                <hr />
                <div className="row">
                  <div className="col-md-6">
                    <p><strong>Status:</strong> {getStatusBadge(selectedRequest.status)}</p>
                  </div>
                  <div className="col-md-6">
                    <p><strong>Data cererii:</strong> {formatDate(selectedRequest.createdAt || selectedRequest.dataCerere)}</p>
                  </div>
                </div>

                {selectedRequest.status === 'IN_ASTEPTARE' && (
                  <div className="mt-4">
                    <div className="mb-3">
                      <label className="form-label">Motiv respingere (obligatoriu pentru respingere):</label>
                      <textarea 
                        className="form-control" 
                        rows="3"
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                        placeholder="Introdu motivul respingerii..."
                      />
                    </div>
                  </div>
                )}

                {selectedRequest.motivRespingere && (
                  <div className="mt-3">
                    <h6 className="fw-bold text-danger">Motiv respingere:</h6>
                    <p className="text-muted">{selectedRequest.motivRespingere}</p>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                {selectedRequest.status === 'IN_ASTEPTARE' && (
                  <>
                    <button 
                      type="button" 
                      className="btn btn-success"
                      onClick={() => approveRequest(selectedRequest.id)}
                      disabled={actionLoading}
                    >
                      {actionLoading ? (
                        <span className="spinner-border spinner-border-sm me-1" />
                      ) : (
                        <Icon name="check" size={16} className="me-1" />
                      )}
                      Aprobă
                    </button>
                    <button 
                      type="button" 
                      className="btn btn-danger"
                      onClick={() => rejectRequest(selectedRequest.id)}
                      disabled={actionLoading || !rejectReason.trim()}
                    >
                      {actionLoading ? (
                        <span className="spinner-border spinner-border-sm me-1" />
                      ) : (
                        <Icon name="x" size={16} className="me-1" />
                      )}
                      Respinge
                    </button>
                  </>
                )}
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => {
                    setShowModal(false);
                    setRejectReason('');
                  }}
                >
                  Închide
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagerRequestsPage;