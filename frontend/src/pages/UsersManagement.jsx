import React, { useState, useEffect, useCallback } from 'react';
import ApiService from '../services/ApiService';

const UsersManagement = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [detailedUser, setDetailedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [debugLogs, setDebugLogs] = useState([]); // Pentru a stoca log-urile

  // ===== DEBUGGING ENHANCED =====
  const addDebugLog = (message, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    const logEntry = `[${timestamp}] ${type.toUpperCase()}: ${message}`;
    console.log(logEntry);
    setDebugLogs(prev => [...prev.slice(-50), logEntry]); // Păstrează ultimele 50 de log-uri
  };

  const debugAuth = () => {
    addDebugLog('=== 🔍 AUTH DEBUG STATUS ===', 'debug');
    addDebugLog(`localStorage.authToken: ${localStorage.getItem('authToken') ? 'EXISTS' : 'MISSING'}`, 'debug');
    addDebugLog(`localStorage.token: ${localStorage.getItem('token') ? 'EXISTS' : 'MISSING'}`, 'debug');
    addDebugLog(`localStorage.userData: ${localStorage.getItem('userData') ? 'EXISTS' : 'MISSING'}`, 'debug');
    addDebugLog(`localStorage.user: ${localStorage.getItem('user') ? 'EXISTS' : 'MISSING'}`, 'debug');
    
    const token = localStorage.getItem('authToken') || localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        addDebugLog(`Token expires: ${new Date(payload.exp * 1000)}`, 'debug');
        addDebugLog(`Current time: ${new Date()}`, 'debug');
        addDebugLog(`Token valid: ${payload.exp > Date.now() / 1000}`, 'debug');
        addDebugLog(`Token subject: ${payload.sub}`, 'debug');
      } catch (e) {
        addDebugLog(`Error decoding token: ${e.message}`, 'error');
      }
    } else {
      addDebugLog('No token found in any storage location', 'error');
    }
    addDebugLog('=== END AUTH DEBUG ===', 'debug');
  };

  const syncTokens = () => {
    const authToken = localStorage.getItem('authToken');
    const token = localStorage.getItem('token');
    
    if (token && !authToken) {
      localStorage.setItem('authToken', token);
      addDebugLog('Synced token to authToken', 'info');
    } else if (authToken && !token) {
      localStorage.setItem('token', authToken);
      addDebugLog('Synced authToken to token', 'info');
    }
  };

  const checkAdminRole = () => {
    const userData = localStorage.getItem('userData') || localStorage.getItem('user');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        addDebugLog(`Current user role: ${user.role}`, 'info');
        return user.role === 'ADMIN';
      } catch (e) {
        addDebugLog(`Error parsing user data: ${e.message}`, 'error');
      }
    }
    addDebugLog('No user data found or user is not admin', 'warning');
    return false;
  };

  // ===== MANUAL TOKEN SETUP =====
  const setupManualToken = () => {
    const manualToken = prompt('Introduceți token-ul manual pentru testing:');
    if (manualToken) {
      localStorage.setItem('authToken', manualToken);
      localStorage.setItem('token', manualToken);
      addDebugLog('Manual token set', 'info');
      alert('Token setat manual. Încercați din nou operațiunea.');
    }
  };

  const clearAllTokens = () => {
    localStorage.clear();
    sessionStorage.clear();
    addDebugLog('All storage cleared', 'info');
    alert('Toate datele au fost șterse din storage.');
  };

  // ===== ICON COMPONENT =====
  const Icon = ({ name, size = 18, className = "" }) => {
    const icons = {
      users: (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>),
      search: (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.35-4.35"></path></svg>),
      filter: (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}><polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46"></polygon></svg>),
      plus: (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}><path d="M5 12h14"></path><path d="M12 5v14"></path></svg>),
      edit: (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4Z"></path></svg>),
      eye: (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path><circle cx="12" cy="12" r="3"></circle></svg>),
      trash: (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}><polyline points="3,6 5,6 21,6"></polyline><path d="m19,6v14a2,2 0 0,1-2,2H7a2,2 0 0,1-2-2V6m3,0V4a2,2 0 0,1,2-2h4a2,2 0 0,1,2,2v2"></path></svg>),
      mail: (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}><rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-10 5L2 7"></path></svg>),
      shield: (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>),
      check: (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}><polyline points="20,6 9,17 4,12"></polyline></svg>),
      x: (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}><path d="m18 6-12 12"></path><path d="m6 6 12 12"></path></svg>),
      refresh: (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4-4.64 4.36A9 9 0 0 1 3.51 15"></path></svg>),
      google: (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>),
      github: (<svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>),
      save: (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>),
      lock: (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><circle cx="12" cy="16" r="1"></circle><path d="m7 11V7a5 5 0 0 1 10 0v4"></path></svg>),
    };
    return icons[name] || icons.users;
  };

  // ===== API ERROR HANDLING FĂRĂ AUTO-REDIRECT =====
  const handleApiError = (error, action) => {
    addDebugLog(`API Error in ${action}: ${JSON.stringify(error)}`, 'error');
    
    if (error.status === 401) {
      setError(`Sesiunea a expirat pentru acțiunea: ${action}. Verificați autentificarea.`);
      addDebugLog('401 Unauthorized - Token might be expired', 'error');
      // NU MAI FACEM AUTO-REDIRECT
    } else if (error.status === 403) {
      setError('Nu aveți permisiunile necesare pentru această acțiune.');
      addDebugLog('403 Forbidden - Insufficient permissions', 'error');
    } else if (error.status === 404) {
      setError('Resursa nu a fost găsită.');
      addDebugLog('404 Not Found', 'error');
    } else if (error.message && error.message.includes('Email-ul este deja folosit')) {
      setError('Email-ul este deja folosit de alt utilizator.');
    } else {
      setError(`Eroare la ${action}: ${error.message || 'Eroare necunoscută'}`);
    }
  };

  // ===== API FUNCTIONS CU LOGGING DETALIAT =====
  const loadUsers = useCallback(async (showLoadingIndicator = true) => {
    if (showLoadingIndicator) setLoading(true);
    setError(null);
    
    try {
      addDebugLog('Starting to load users...', 'info');
      debugAuth();
      syncTokens();
      
      if (!checkAdminRole()) {
        throw new Error('Access denied. Admin role required.');
      }
      
      addDebugLog('Making API call to getAllUsers...', 'info');
      const usersData = await ApiService.getAllUsers();
      addDebugLog(`API call successful, received ${usersData.length} users`, 'info');
      
      const transformedUsers = usersData.map(user => ({
        id: user.id,
        nume: user.name || 'Fără nume',
        email: user.email || 'Fără email',
        rol: user.role || 'USER',
        authProvider: user.authProvider || user.auth_provider || 'local',
        emailVerified: user.emailVerified || user.email_verified || false,
        requestedNewEmail: user.requestedNewEmail || user.requested_new_email,
        profileImageId: user.profileImageId || user.profile_image_id,
        firmaId: user.firma_id,
        originalData: user
      }));
      
      setUsers(transformedUsers);
      addDebugLog(`Users transformed and set in state: ${transformedUsers.length}`, 'info');
      
    } catch (error) {
      addDebugLog(`Error loading users: ${JSON.stringify(error)}`, 'error');
      handleApiError(error, 'încărcarea utilizatorilor');
      setUsers([]);
    } finally {
      if (showLoadingIndicator) setLoading(false);
    }
  }, []);

  // ===== LIFECYCLE =====
  useEffect(() => {
    let mounted = true;
    
    const loadUsersLocal = async () => {
      if (!mounted) return;
      
      try {
        addDebugLog('Component mounted, initializing...', 'info');
        debugAuth();
        syncTokens();
        
        if (!checkAdminRole()) {
          setError('Nu aveți permisiunile necesare pentru a accesa această pagină. Rolul ADMIN este necesar.');
          setLoading(false);
          return;
        }
        
        const usersData = await ApiService.getAllUsers();
        
        if (!mounted) return;
        
        if (usersData && Array.isArray(usersData)) {
          const transformedUsers = usersData.map(user => ({
            id: user.id,
            nume: user.name || 'Fără nume',
            email: user.email || 'Fără email',
            rol: user.role || 'USER',
            authProvider: user.authProvider || user.auth_provider || 'local',
            emailVerified: user.emailVerified || user.email_verified || false,
            requestedNewEmail: user.requestedNewEmail || user.requested_new_email,
            profileImageId: user.profileImageId || user.profile_image_id,
            firmaId: user.firma_id,
            originalData: user
          }));
          
          setUsers(transformedUsers);
          setFilteredUsers(transformedUsers);
        }
      } catch (error) {
        if (!mounted) return;
        addDebugLog(`Error in initial load: ${JSON.stringify(error)}`, 'error');
        handleApiError(error, 'încărcarea inițială a utilizatorilor');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadUsersLocal();
    
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const filtered = users.filter(user => {
      const matchesSearch = user.nume.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           user.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = selectedRole === 'all' || user.rol === selectedRole;
      
      return matchesSearch && matchesRole;
    });
    
    setFilteredUsers(filtered);
  }, [users, searchTerm, selectedRole]);

  // ===== HELPER FUNCTIONS =====
  const getStatusBadge = (user) => {
    if (!user.emailVerified) {
      return <span className="badge bg-warning text-dark">Email neverificat</span>;
    }
    return <span className="badge bg-success">Activ</span>;
  };

  const getRoleBadge = (role) => {
    const roleConfig = {
      'ADMIN': { class: 'bg-danger', icon: 'shield', text: 'Administrator' },
      'MANAGER': { class: 'bg-primary', icon: 'users', text: 'Manager' },
      'USER': { class: 'bg-secondary', icon: 'users', text: 'Utilizator' }
    };
    
    const config = roleConfig[role] || roleConfig['USER'];
    return (
      <span className={`badge ${config.class} d-flex align-items-center`}>
        <Icon name={config.icon} size={12} className="me-1" />
        {config.text}
      </span>
    );
  };

  const getProviderIcon = (provider) => {
    const icons = {
      'google': 'google',
      'github': 'github',
      'local': 'mail'
    };
    return icons[provider] || 'mail';
  };

  // ===== EVENT HANDLERS =====
  const handleViewDetails = (user) => {
    setSelectedUser(user);
    setDetailedUser(user);
    setShowDetailsModal(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setDetailedUser(user);
    setShowEditModal(true);
  };

  const handleAddUser = () => {
    setDetailedUser(null);
    setSelectedUser(null);
    setShowAddModal(true);
  };

  const handleRefresh = () => {
    loadUsers();
  };

  const handleDeleteUser = async (user) => {
    if (window.confirm(`Ești sigur că vrei să ștergi utilizatorul "${user.nume}"? Această acțiune este ireversibilă.`)) {
      setIsSubmitting(true);
      try {
        addDebugLog(`Deleting user ${user.id}`, 'info');
        await ApiService.deleteUser(user.id);
        addDebugLog('Delete successful', 'info');
        alert('Utilizator șters cu succes!');
        loadUsers();
      } catch (error) {
        addDebugLog(`Error deleting user: ${JSON.stringify(error)}`, 'error');
        handleApiError(error, 'ștergerea utilizatorului');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleToggleEmailVerification = async (user) => {
    setIsSubmitting(true);
    try {
      addDebugLog(`Toggling email verification for user ${user.id}`, 'info');
      
      // Încearcă prima metodă - PATCH
      try {
        await ApiService.toggleEmailVerification(user.id);
        addDebugLog('Email verification toggled successfully with PATCH', 'info');
      } catch (patchError) {
        addDebugLog(`PATCH failed, trying PUT: ${JSON.stringify(patchError)}`, 'warning');
        
        // Fallback: încearcă cu PUT manual
        const payload = {
          id: user.id,
          name: user.nume,
          email: user.email,
          emailVerified: !user.emailVerified,
          role: user.rol,
          authProvider: user.authProvider,
          requestedNewEmail: user.requestedNewEmail,
          firmaId: user.firmaId
        };
        
        await ApiService.updateUser(user.id, payload);
        addDebugLog('Email verification toggled successfully with PUT fallback', 'info');
      }
      
      alert('Status email schimbat cu succes!');
      loadUsers();
    } catch (error) {
      addDebugLog(`Error toggling email verification: ${JSON.stringify(error)}`, 'error');
      handleApiError(error, 'schimbarea statusului email');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ===== MODAL COMPONENTS =====
  const UserDetailsModal = ({ show, onHide, user, detailedData }) => {
    if (!show || !user) return null;
    const currentUserData = detailedData || user;

    return (
      <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
        <div className="modal-dialog modal-xl">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                <Icon name="users" size={24} className="me-2" />
                Detalii Utilizator: {currentUserData.name || currentUserData.nume}
              </h5>
              <button type="button" className="btn-close" onClick={onHide}></button>
            </div>
            <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
              {modalLoading && !detailedData ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary mb-3"></div>
                  <p>Se încarcă...</p>
                </div>
              ) : currentUserData ? (
                <div className="row">
                  <div className="col-md-6">
                    <h6 className="fw-bold mb-3">Informații Generale</h6>
                    <p className="mb-1"><strong>ID:</strong> {currentUserData.id}</p>
                    <p className="mb-1"><strong>Nume:</strong> {currentUserData.name || currentUserData.nume}</p>
                    <p className="mb-1"><strong>Email:</strong> {currentUserData.email}</p>
                    <p className="mb-1"><strong>Email Verificat:</strong> {currentUserData.emailVerified ? 'Da' : 'Nu'}</p>
                    <div className="mb-2">
                      <strong>Rol:</strong> {getRoleBadge(currentUserData.role || currentUserData.rol)}
                    </div>
                    <div className="mb-2">
                      <strong>Status:</strong> {getStatusBadge(currentUserData)}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <h6 className="fw-bold mb-3">Securitate & Autentificare</h6>
                    <p className="mb-1">
                      <strong>Provider Autentificare:</strong>
                      <Icon name={getProviderIcon(currentUserData.authProvider)} size={16} className="ms-2 me-1" />
                      {currentUserData.authProvider}
                    </p>
                    {currentUserData.requestedNewEmail && (
                      <p className="mb-1">
                        <strong>Email Nou Solicitat:</strong> {currentUserData.requestedNewEmail}
                      </p>
                    )}
                    {currentUserData.profileImage && (
                      <p className="mb-1">
                        <strong>Imagine Profil:</strong> Setată
                      </p>
                    )}
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
              {/* <button type="button" className="btn btn-primary" onClick={() => { onHide(); handleEditUser(currentUserData); }}>
                <Icon name="edit" size={16} className="me-2" />Editează
              </button> */}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const UserEditModal = ({ show, onHide, user, detailedData }) => {
    const initialEditState = {
      name: '', email: '', role: 'USER', emailVerified: false
    };
    const [editData, setEditData] = useState(initialEditState);

    useEffect(() => {
      const sourceData = detailedData || user?.originalData || user;
      if (sourceData) {
        setEditData({
          name: sourceData.name || sourceData.nume || '',
          email: sourceData.email || '',
          role: sourceData.role || sourceData.rol || 'USER',
          emailVerified: sourceData.emailVerified || false
        });
      } else if (!show) {
        setEditData(initialEditState);
      }
    }, [detailedData, user, show]);

    const handleInputChange = (e) => {
      const { name, value, type, checked } = e.target;
      const val = type === 'checkbox' ? checked : value;
      setEditData(prev => ({ ...prev, [name]: val }));
    };

    const handleSave = async (e) => {
      if (e) e.preventDefault(); // PREVINE REFRESH
      
      const sourceForId = detailedData || user?.originalData || user;
      if (!sourceForId || !sourceForId.id) {
        alert("ID-ul utilizatorului lipsește. Nu se poate salva.");
        return;
      }

      const userUpdatePayload = {
        name: editData.name,
        email: editData.email,
        role: editData.role,
        emailVerified: editData.emailVerified,
        authProvider: sourceForId.authProvider || 'local'
      };

      addDebugLog(`Updating user ${sourceForId.id} with payload: ${JSON.stringify(userUpdatePayload)}`, 'info');

      setIsSubmitting(true);
      try {
        await ApiService.updateUser(sourceForId.id, userUpdatePayload);
        addDebugLog('User update successful', 'info');
        alert('Utilizator actualizat cu succes!');
        onHide();
        loadUsers();
      } catch (error) {
        addDebugLog(`Error updating user: ${JSON.stringify(error)}`, 'error');
        handleApiError(error, 'actualizarea utilizatorului');
      } finally {
        setIsSubmitting(false);
      }
    };

    if (!show) return null;
    const currentUserName = editData.name || "utilizatorul selectat";

    return (
      <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <form onSubmit={handleSave}>
              <div className="modal-header">
                <h5 className="modal-title">
                  <Icon name="edit" size={24} className="me-2" />
                  Editează Utilizator: {currentUserName}
                </h5>
                <button type="button" className="btn-close" onClick={onHide}></button>
              </div>
              <div className="modal-body" style={{ maxHeight: '75vh', overflowY: 'auto' }}>
                {modalLoading && !editData.name ? (
                  <div className="text-center py-5">
                    <div className="spinner-border text-primary mb-3"></div>
                    <p>Se încarcă...</p>
                  </div>
                ) : (
                  <>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label htmlFor="edit-name" className="form-label fw-semibold">Nume Complet</label>
                        <input 
                          type="text" 
                          className="form-control" 
                          id="edit-name" 
                          name="name" 
                          value={editData.name} 
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label htmlFor="edit-email" className="form-label fw-semibold">Email</label>
                        <input 
                          type="email" 
                          className="form-control" 
                          id="edit-email" 
                          name="email" 
                          value={editData.email} 
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label htmlFor="edit-role" className="form-label fw-semibold">Rol</label>
                        <select 
                          id="edit-role" 
                          name="role" 
                          className="form-select" 
                          value={editData.role} 
                          onChange={handleInputChange}
                        >
                          <option value="USER">Utilizator</option>
                          <option value="MANAGER">Manager</option>
                          <option value="ADMIN">Administrator</option>
                        </select>
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label fw-semibold">Opțiuni</label>
                        <div className="form-check form-switch">
                          <input 
                            className="form-check-input" 
                            type="checkbox" 
                            role="switch" 
                            id="edit-emailVerified" 
                            name="emailVerified" 
                            checked={editData.emailVerified} 
                            onChange={handleInputChange} 
                          />
                          <label className="form-check-label" htmlFor="edit-emailVerified">Email verificat</label>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline-secondary" onClick={onHide} disabled={isSubmitting || modalLoading}>
                  Anulează
                </button>
                <button type="submit" className="btn btn-primary" disabled={isSubmitting || modalLoading}>
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
            </form>
          </div>
        </div>
      </div>
    );
  };

  const UserAddModal = ({ show, onHide }) => {
    const initialAddData = {
      name: '', email: '', password: '', role: 'USER', emailVerified: false
    };
    const [addData, setAddData] = useState(initialAddData);

    useEffect(() => {
      if (show) {
        setAddData(initialAddData);
      }
    }, [show]);

    const handleAddInputChange = (e) => {
      const { name, value, type, checked } = e.target;
      const val = type === 'checkbox' ? checked : value;
      setAddData(prev => ({ ...prev, [name]: val }));
    };

    const handleSaveNew = async (e) => {
      if (e) e.preventDefault(); // PREVINE REFRESH
      
      if (!addData.name.trim()) {
        alert('Numele este obligatoriu!');
        return;
      }
      if (!addData.email.trim()) {
        alert('Email-ul este obligatoriu!');
        return;
      }
      if (!addData.password.trim()) {
        alert('Parola este obligatorie!');
        return;
      }

      setIsSubmitting(true);
      const newUserPayload = {
        name: addData.name.trim(),
        email: addData.email.trim(),
        password: addData.password,
        role: addData.role,
        emailVerified: addData.emailVerified,
        authProvider: 'local'
      };

      addDebugLog(`Creating new user with payload: ${JSON.stringify(newUserPayload)}`, 'info');

      try {
        await ApiService.createUser(newUserPayload);
        addDebugLog('User creation successful', 'info');
        alert('Utilizator adăugat cu succes!');
        onHide();
        loadUsers();
      } catch (error) {
        addDebugLog(`Error creating user: ${JSON.stringify(error)}`, 'error');
        handleApiError(error, 'adăugarea utilizatorului');
      } finally {
        setIsSubmitting(false);
      }
    };

    if (!show) return null;
    
    return (
      <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <form onSubmit={handleSaveNew}>
              <div className="modal-header">
                <h5 className="modal-title">
                  <Icon name="plus" size={24} className="me-2" />
                  Adaugă Utilizator Nou
                </h5>
                <button type="button" className="btn-close" onClick={onHide}></button>
              </div>
              <div className="modal-body" style={{ maxHeight: '75vh', overflowY: 'auto' }}>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="add-name" className="form-label fw-semibold">
                      Nume Complet <span className="text-danger">*</span>
                    </label>
                    <input 
                      type="text" 
                      className="form-control" 
                      id="add-name" 
                      name="name" 
                      value={addData.name} 
                      onChange={handleAddInputChange} 
                      required 
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label htmlFor="add-email" className="form-label fw-semibold">
                      Email <span className="text-danger">*</span>
                    </label>
                    <input 
                      type="email" 
                      className="form-control" 
                      id="add-email" 
                      name="email" 
                      value={addData.email} 
                      onChange={handleAddInputChange} 
                      required 
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="add-password" className="form-label fw-semibold">
                      Parolă <span className="text-danger">*</span>
                    </label>
                    <input 
                      type="password" 
                      className="form-control" 
                      id="add-password" 
                      name="password" 
                      value={addData.password} 
                      onChange={handleAddInputChange} 
                      required 
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label htmlFor="add-role" className="form-label fw-semibold">Rol</label>
                    <select 
                      id="add-role" 
                      name="role" 
                      className="form-select" 
                      value={addData.role} 
                      onChange={handleAddInputChange}
                    >
                      <option value="USER">Utilizator</option>
                      <option value="MANAGER">Manager</option>
                      <option value="ADMIN">Administrator</option>
                    </select>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold">Opțiuni</label>
                    <div className="form-check form-switch">
                      <input 
                        className="form-check-input" 
                        type="checkbox" 
                        role="switch" 
                        id="add-emailVerified" 
                        name="emailVerified" 
                        checked={addData.emailVerified} 
                        onChange={handleAddInputChange} 
                      />
                      <label className="form-check-label" htmlFor="add-emailVerified">Email verificat</label>
                    </div>
                  </div>
                </div>
                <div className="alert alert-info small mt-3 py-2">
                  <strong>Notă:</strong> Câmpurile marcate cu <span className="text-danger">*</span> sunt obligatorii. 
                  Utilizatorul va fi creat cu provider-ul local.
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline-secondary" onClick={onHide} disabled={isSubmitting}>
                  Anulează
                </button>
                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Se adaugă...
                    </>
                  ) : (
                    <>
                      <Icon name="save" size={16} className="me-2" />
                      Adaugă Utilizator
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  };

  // ===== RENDER =====
  if (loading && users.length === 0) {
    return (
      <div className="container-fluid py-3 px-lg-4">
        <div className="text-center py-5">
          <div className="spinner-border text-primary mb-3"></div>
          <p>Se încarcă utilizatorii...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-3 px-lg-4">

      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
          <h1 className="h3 fw-bold mb-0">Management Utilizatori</h1>
          <p className="text-muted small mb-0">Administrează utilizatorii, rolurile și permisiunile din sistem.</p>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-secondary btn-sm" onClick={handleRefresh} disabled={loading || isSubmitting}>
            <Icon name="refresh" size={16} className="me-1" />Reîmprospătează
          </button>
          <button className="btn btn-primary btn-sm" onClick={handleAddUser} disabled={isSubmitting}>
            <Icon name="plus" size={16} className="me-1" />Adaugă Utilizator
          </button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="alert alert-warning alert-dismissible fade show small" role="alert">
          <strong>⚠️ Atenție:</strong> {error}
          <button type="button" className="btn-close" onClick={() => setError(null)} aria-label="Close"></button>
        </div>
      )}

      {/* Statistici */}
      <div className="row g-3 mb-4">
        <div className="col-sm-6 col-lg-4">
          <div className="card border-0 shadow-sm">
            <div className="card-body d-flex align-items-center p-3">
              <div className="p-3 rounded-circle bg-primary bg-opacity-10 me-3">
                <Icon name="users" size={22} className="text-primary" />
              </div>
              <div>
                <h5 className="fw-bold mb-0">{users.length}</h5>
                <small className="text-muted">Total Utilizatori</small>
              </div>
            </div>
          </div>
        </div>
        <div className="col-sm-6 col-lg-4">
          <div className="card border-0 shadow-sm">
            <div className="card-body d-flex align-items-center p-3">
              <div className="p-3 rounded-circle bg-success bg-opacity-10 me-3">
                <Icon name="check" size={22} className="text-success" />
              </div>
              <div>
                <h5 className="fw-bold mb-0">{users.filter(u => u.emailVerified).length}</h5>
                <small className="text-muted">Email Verificat</small>
              </div>
            </div>
          </div>
        </div>
        <div className="col-sm-6 col-lg-4">
          <div className="card border-0 shadow-sm">
            <div className="card-body d-flex align-items-center p-3">
              <div className="p-3 rounded-circle bg-danger bg-opacity-10 me-3">
                <Icon name="shield" size={22} className="text-danger" />
              </div>
              <div>
                <h5 className="fw-bold mb-0">{users.filter(u => u.rol === 'ADMIN').length}</h5>
                <small className="text-muted">Administratori</small>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filtre */}
      <div className="card border-0 shadow-sm p-3 mb-4">
        <div className="row g-3 align-items-center">
          <div className="col-xl-6 col-lg-6 col-md-12">
            <div className="input-group">
              <span className="input-group-text text-muted">
                <Icon name="search" size={16} />
              </span>
              <input 
                type="text" 
                className="form-control" 
                placeholder="Caută după nume sau email..." 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
              />
            </div>
          </div>
          <div className="col-xl-6 col-lg-6 col-md-12">
            <select className="form-select" value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)}>
              <option value="all">Toate rolurile</option>
              <option value="USER">Utilizator</option>
              <option value="MANAGER">Manager</option>
              <option value="ADMIN">Administrator</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lista de utilizatori */}
      <div className="row g-4">
        {filteredUsers.length > 0 ? filteredUsers.map(user => (
          <div key={user.id} className="col-md-6 col-lg-4 d-flex">
            <div className="card shadow-sm border-0 h-100 w-100">
              <div className="card-header bg-light p-3">
                <div className="d-flex align-items-center">
                  <div className="bg-primary rounded-circle p-2 me-3" style={{ width: '50px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span className="text-white fw-bold">
                      {user.nume.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-grow-1">
                    <h6 className="fw-bold mb-1">{user.nume}</h6>
                    <small className="text-muted">ID: {user.id}</small>
                  </div>
                  {getStatusBadge(user)}
                </div>
              </div>
              <div className="card-body p-3 d-flex flex-column">
                <div className="mb-2">
                  <div className="d-flex align-items-center mb-1">
                    <Icon name="mail" size={14} className="text-muted me-2" />
                    <small className="text-truncate">{user.email}</small>
                  </div>
                  <div className="d-flex align-items-center mb-2">
                    <Icon name={getProviderIcon(user.authProvider)} size={14} className="text-muted me-2" />
                    <small>{user.authProvider}</small>
                  </div>
                </div>
                <div className="mb-3">
                  {getRoleBadge(user.rol)}
                </div>
                <div className="mt-auto">
                  <div className="d-grid gap-2 d-sm-flex mb-2">
                    <button 
                      className="btn btn-outline-primary btn-sm flex-sm-fill" 
                      onClick={() => handleViewDetails(user)} 
                      disabled={isSubmitting}
                    >
                      <Icon name="eye" size={14} className="me-1" />Detalii
                    </button>
                    {/* <button 
                      className="btn btn-outline-secondary btn-sm flex-sm-fill" 
                      onClick={() => handleEditUser(user)} 
                      disabled={isSubmitting}
                    >
                      <Icon name="edit" size={14} className="me-1" />Editează
                    </button> */}
                  </div>
                  <div className="d-grid gap-2 d-sm-flex">
                    <button 
                      className={`btn btn-sm flex-sm-fill ${user.emailVerified ? 'btn-outline-warning' : 'btn-outline-success'}`} 
                      onClick={() => handleToggleEmailVerification(user)} 
                      disabled={isSubmitting}
                      title={user.emailVerified ? 'Marchează email ca neverificat' : 'Marchează email ca verificat'}
                    >
                      {user.emailVerified ? 'Anulează verificare' : 'Verifică email'}
                    </button>
                    <button 
                      title="Șterge Utilizator" 
                      className="btn btn-outline-danger btn-sm" 
                      onClick={() => handleDeleteUser(user)} 
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
                  <Icon name="users" size={48} className="text-muted mb-3" />
                  <h5 className="text-muted">Niciun utilizator nu corespunde filtrelor actuale.</h5>
                  <p className="text-muted small">Încearcă să ajustezi căutarea sau filtrele.</p>
                </div>
              </div>
            </div>
          )
        )}
      </div>

      {/* Modaluri */}
      {showDetailsModal && selectedUser && (
        <UserDetailsModal 
          show={showDetailsModal} 
          onHide={() => { 
            setShowDetailsModal(false); 
            setDetailedUser(null); 
          }} 
          user={selectedUser} 
          detailedData={detailedUser} 
        />
      )}
      
      {showEditModal && (selectedUser || detailedUser) && (
        <UserEditModal 
          show={showEditModal} 
          onHide={() => { 
            setShowEditModal(false); 
            setDetailedUser(null); 
          }} 
          user={selectedUser} 
          detailedData={detailedUser} 
        />
      )}
      
      {showAddModal && (
        <UserAddModal 
          show={showAddModal} 
          onHide={() => setShowAddModal(false)} 
        />
      )}
      
      {/* Footer Debug Info */}
      {/* <div style={{ 
        marginTop: '20px', 
        padding: '15px', 
        background: '#e9ecef', 
        borderRadius: '4px',
        fontSize: '14px',
        color: '#6c757d'
      }}>
        💡 <strong>Debug Info:</strong> Folosește panel-ul de debug pentru a verifica statusul autentificării. 
        Toate operațiunile sunt loggate în consolă și în panel. Codul are {filteredUsers.length} utilizatori afișați din {users.length} total.
      </div> */}
    </div>
  );
};

export default UsersManagement;