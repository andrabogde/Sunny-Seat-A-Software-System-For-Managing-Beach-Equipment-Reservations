import React, { useState, useEffect, useContext } from 'react';
import apiService from '../services/ApiService';
import PositiveNumberInput from '../components/common/PositiveNumberInput';
import { AuthContext } from '../contexts/AuthContext';

const ReservationsManagement = () => {
  const { user, isAuthenticated } = useContext(AuthContext);
  
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [users, setUsers] = useState([]);
  const [statusOptions, setStatusOptions] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  // Form data pentru creare/editare
  const [formData, setFormData] = useState({
    utilizatorId: '',
    stareRezervareId: '',
    codRezervare: '',
    dataInceput: '',
    dataSfarsit: '',
    pretBucata: '',
    cantitate: '',
    observatii: ''
  });

  const Icon = ({ name, size = 18, className = "" }) => {
    const icons = {
      ticket: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <path d="M3 7v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2Z"></path>
          <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
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
      eye: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
          <circle cx="12" cy="12" r="3"></circle>
        </svg>
      ),
      trash: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <polyline points="3,6 5,6 21,6"></polyline>
          <path d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"></path>
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
      calendar: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="16" y1="2" x2="16" y2="6"></line>
          <line x1="8" y1="2" x2="8" y2="6"></line>
          <line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>
      ),
      clock: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="12,6 12,12 16,14"></polyline>
        </svg>
      ),
      user: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
      ),
      creditCard: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
          <line x1="1" y1="10" x2="23" y2="10"></line>
        </svg>
      ),
      beach: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <path d="M2 18h20"></path>
          <path d="M12 18V6"></path>
          <path d="M8 14l4-4 4 4"></path>
        </svg>
      ),
      refresh: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <polyline points="23,4 23,10 17,10"></polyline>
          <polyline points="1,20 1,14 7,14"></polyline>
          <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"></path>
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
    
    return icons[name] || icons.ticket;
  };

  // Încărcare date inițiale
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    await Promise.all([
      loadReservations(),
      loadUsers(),
      loadStatusOptions()
    ]);
  };

  const loadReservations = async () => {
    try {
      setRefreshing(true);
      setError(null);
      console.log('📥 Loading reservations from API...');
      
      const data = await apiService.getAllRezervari();
      console.log('✅ Reservations loaded:', data);
      if(user.role==='MANAGER')
        setReservations(data.filter((el)=>el.userId===user.id) || []);
      else if(user.role==='ADMIN')
        setReservations(data || []);
    } catch (err) {
      console.error('❌ Error loading reservations:', err);
      setError('Eroare la încărcarea rezervărilor: ' + (err.message || 'Eroare necunoscută'));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const loadUsers = async () => {
    try {
      console.log('👥 Loading users from API...');
      const data = await apiService.getAllUsers();
      console.log('✅ Users loaded:', data);
      setUsers(data || []);
    } catch (err) {
      console.error('❌ Error loading users:', err);
      // Fallback cu date mock pentru utilizatori în caz de eroare
      setUsers([
        { id: 1, name: 'Administrator', email: 'admin@sunnyseat.ro' }
      ]);
    }
  };

  const loadStatusOptions = async () => {
    try {
      console.log('📊 Loading status options from API...');
      const data = await apiService.getAllStariRezervare();
      console.log('✅ Status options loaded:', data);
      setStatusOptions(data || []);
    } catch (err) {
      console.error('❌ Error loading status options:', err);
      // Fallback cu statusuri default
      setStatusOptions([
        { id: 'pending', denumire: 'În așteptare', activ: true },
        { id: 'confirmata', denumire: 'Confirmată', activ: true },
        { id: 'anulata', denumire: 'Anulată', activ: true },
        { id: 'completa', denumire: 'Completă', activ: true }
      ]);
    }
  };

  const generateReservationCode = () => {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `RZ${timestamp}${random}`;
  };

  const calculateTotal = () => {
    const pret = parseFloat(formData.pretBucata) || 0;
    const cantitate = parseInt(formData.cantitate) || 0;
    return pret * cantitate;
  };

  const handleCreateReservation = async () => {
    try {
      if (!formData.utilizatorId || !formData.stareRezervareId) {
        alert('Vă rugăm să completați toate câmpurile obligatorii.');
        return;
      }

      console.log('➕ Creating reservation with data:', formData);
      
      const reservationData = {
        utilizatorId: parseInt(formData.utilizatorId),
        stareRezervareId: parseInt(formData.stareRezervareId),
        codRezervare: formData.codRezervare || generateReservationCode(),
        dataInceput: formData.dataInceput,
        dataSfarsit: formData.dataSfarsit,
        pretBucata: parseFloat(formData.pretBucata),
        cantitate: parseInt(formData.cantitate),
        pretTotal: calculateTotal(),
        observatii: formData.observatii
      };

      await apiService.createRezervare(reservationData);
      console.log('✅ Reservation created successfully');
      
      setShowCreateModal(false);
      resetForm();
      await loadReservations(); // Reîncarcă lista
      alert('Rezervarea a fost creată cu succes!');
    } catch (err) {
      console.error('❌ Error creating reservation:', err);
      alert('Eroare la crearea rezervării: ' + (err.message || 'Eroare necunoscută'));
    }
  };

  const handleUpdateReservation = async () => {
    try {
      console.log('✏️ Updating reservation:', selectedReservation.id, formData);
      
      const reservationData = {
        utilizatorId: parseInt(formData.utilizatorId),
        stareRezervareId: parseInt(formData.stareRezervareId),
        codRezervare: formData.codRezervare,
        dataInceput: formData.dataInceput,
        dataSfarsit: formData.dataSfarsit,
        pretBucata: parseFloat(formData.pretBucata),
        cantitate: parseInt(formData.cantitate),
        pretTotal: calculateTotal(),
        observatii: formData.observatii
      };

      await apiService.updateRezervare(selectedReservation.id, reservationData);
      console.log('✅ Reservation updated successfully');
      
      setShowEditModal(false);
      resetForm();
      await loadReservations(); // Reîncarcă lista
      alert('Rezervarea a fost actualizată cu succes!');
    } catch (err) {
      console.error('❌ Error updating reservation:', err);
      alert('Eroare la actualizarea rezervării: ' + (err.message || 'Eroare necunoscută'));
    }
  };

  const handleDeleteReservation = async (reservationId) => {
    if (!confirm('Sigur doriți să ștergeți această rezervare?')) {
      return;
    }

    try {
      console.log('🗑️ Deleting reservation:', reservationId);
      await apiService.deleteRezervare(reservationId);
      console.log('✅ Reservation deleted successfully');
      
      await loadReservations(); // Reîncarcă lista
      alert('Rezervarea a fost ștearsă cu succes!');
    } catch (err) {
      console.error('❌ Error deleting reservation:', err);
      alert('Eroare la ștergerea rezervării: ' + (err.message || 'Eroare necunoscută'));
    }
  };

  const resetForm = () => {
    setFormData({
      utilizatorId: '',
      stareRezervareId: '',
      codRezervare: '',
      dataInceput: '',
      dataSfarsit: '',
      pretBucata: '',
      cantitate: '',
      observatii: ''
    });
  };

  const openCreateModal = () => {
    resetForm();
    setFormData(prev => ({
      ...prev,
      codRezervare: generateReservationCode()
    }));
    setShowCreateModal(true);
  };

  const openEditModal = (reservation) => {
    setSelectedReservation(reservation);
    setFormData({
      utilizatorId: reservation.utilizator?.id?.toString() || '',
      stareRezervareId: reservation.stareRezervare?.id?.toString() || '',
      codRezervare: reservation.codRezervare || '',
      dataInceput: reservation.dataInceput || '',
      dataSfarsit: reservation.dataSfarsit || '',
      pretBucata: reservation.pretBucata?.toString() || '',
      cantitate: reservation.cantitate?.toString() || '',
      observatii: reservation.observatii || ''
    });
    setShowEditModal(true);
  };

  const handleViewDetails = (reservation) => {
    setSelectedReservation(reservation);
    setShowDetailsModal(true);
  };

  // Filtrare rezervări
  const filteredReservations = reservations.filter(reservation => {
    const matchesSearch = (reservation.codRezervare || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (reservation.utilizator?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (reservation.utilizator?.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (reservation.plaja || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || reservation.stareRezervare?.toLowerCase().toString() === selectedStatus;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (stareRezervare) => {
    if (!stareRezervare) {
      return <span className="badge bg-secondary">Necunoscut</span>;
    }
    
    const statusName = stareRezervare?.toLowerCase() || '';
    let badgeClass = 'bg-secondary';
    
    if (statusName.includes('confirmata') || statusName.includes('confirmat')) {
      badgeClass = 'bg-success';
    } else if (statusName.includes('asteptare') || statusName.includes('pending')) {
      badgeClass = 'bg-warning';
    } else if (statusName.includes('anulata') || statusName.includes('cancelled')) {
      badgeClass = 'bg-danger';
    } else if (statusName.includes('completa') || statusName.includes('completed')) {
      badgeClass = 'bg-info';
    }
    
    return <span className={`badge ${badgeClass}`}>{stareRezervare}</span>;
  };

  // Calcularea statisticilor din datele reale
  const calculateStats = () => {
    const total = reservations.length;
    const confirmate = reservations.filter(r => 
      r.stareRezervare?.toLowerCase().includes('confirmata') ||
      r.stareRezervare?.toLowerCase().includes('confirmat')
    ).length;
    const inAsteptare = reservations.filter(r => 
      r.stareRezervare?.toLowerCase().includes('asteptare') ||
      r.stareRezervare?.toLowerCase().includes('pending')
    ).length;
    const venitTotal = reservations.reduce((sum, r) => sum + (r.pretTotal || 0), 0);
    
    return { total, confirmate, inAsteptare, venitTotal };
  };

  const stats = calculateStats();

  // Modals - acestea rămân la fel
  const CreateReservationModal = () => (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-xl">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Creare Rezervare Nouă</h5>
            <button type="button" className="btn-close" onClick={() => setShowCreateModal(false)}></button>
          </div>
          <div className="modal-body">
            <div className="row">
              <div className="col-md-6">
                <h6 className="fw-bold mb-3">Detalii Rezervare</h6>
                <div className="mb-3">
                  <label className="form-label">Cod Rezervare *</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.codRezervare}
                    onChange={(e) => setFormData({...formData, codRezervare: e.target.value})}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Utilizator *</label>
                  <select
                    className="form-select"
                    value={formData.utilizatorId}
                    onChange={(e) => setFormData({...formData, utilizatorId: e.target.value})}
                    required
                  >
                    <option value="">Selectează utilizatorul</option>
                    {users.map(user => (
                      <option key={user.id} value={user.id}>
                        {user.name} ({user.email})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Stare Rezervare *</label>
                  <select
                    className="form-select"
                    value={formData.stareRezervareId}
                    onChange={(e) => setFormData({...formData, stareRezervareId: e.target.value})}
                    required
                  >
                    <option value="">Selectează starea</option>
                    {statusOptions.map(status => (
                      <option key={status.id} value={status.id}>{status.denumire}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="col-md-6">
                <h6 className="fw-bold mb-3">Detalii Perioada & Preț</h6>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Data Început *</label>
                    <input
                      type="date"
                      className="form-control"
                      value={formData.dataInceput}
                      onChange={(e) => setFormData({...formData, dataInceput: e.target.value})}
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Data Sfârșit *</label>
                    <input
                      type="date"
                      className="form-control"
                      value={formData.dataSfarsit}
                      onChange={(e) => setFormData({...formData, dataSfarsit: e.target.value})}
                      required
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Preț/Bucată (RON) *</label>
                    <PositiveNumberInput
                      // type="number"
                      className="form-control"
                      value={formData.pretBucata}
                      onChange={(e) => setFormData({...formData, pretBucata: e.target.value})}
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Cantitate *</label>
                    <PositiveNumberInput
                      // type="number"
                      className="form-control"
                      value={formData.cantitate}
                      onChange={(e) => setFormData({...formData, cantitate: e.target.value})}
                      required
                    />
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label">Preț Total</label>
                  <input
                    type="text"
                    className="form-control bg-light"
                    value={`${calculateTotal()} RON`}
                    readOnly
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={() => setShowCreateModal(false)}>
              Anulează
            </button>
            <button type="button" className="btn btn-primary" onClick={handleCreateReservation}>
              Creează Rezervarea
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const EditReservationModal = () => (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-xl">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Editare Rezervare #{selectedReservation?.id}</h5>
            <button type="button" className="btn-close" onClick={() => setShowEditModal(false)}></button>
          </div>
          <div className="modal-body">
            {/* Același conținut ca la CreateReservationModal */}
            <div className="row">
              <div className="col-md-6">
                <h6 className="fw-bold mb-3">Detalii Rezervare</h6>
                <div className="mb-3">
                  <label className="form-label">Cod Rezervare *</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.codRezervare}
                    onChange={(e) => setFormData({...formData, codRezervare: e.target.value})}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Utilizator *</label>
                  <select
                    className="form-select"
                    value={formData.utilizatorId}
                    onChange={(e) => setFormData({...formData, utilizatorId: e.target.value})}
                    required
                  >
                    <option value="">Selectează utilizatorul</option>
                    {users.map(user => (
                      <option key={user.id} value={user.id}>
                        {user.name} ({user.email})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Stare Rezervare *</label>
                  <select
                    className="form-select"
                    value={formData.stareRezervareId}
                    onChange={(e) => setFormData({...formData, stareRezervareId: e.target.value})}
                    required
                  >
                    <option value="">Selectează starea</option>
                    {statusOptions.map(status => (
                      <option key={status.id} value={status.id}>{status.denumire}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="col-md-6">
                <h6 className="fw-bold mb-3">Detalii Perioada & Preț</h6>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Data Început *</label>
                    <input
                      type="date"
                      className="form-control"
                      value={formData.dataInceput}
                      onChange={(e) => setFormData({...formData, dataInceput: e.target.value})}
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Data Sfârșit *</label>
                    <input
                      type="date"
                      className="form-control"
                      value={formData.dataSfarsit}
                      onChange={(e) => setFormData({...formData, dataSfarsit: e.target.value})}
                      required
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Preț/Bucată (RON) *</label>
                    <PositiveNumberInput
                      // type="number"
                      className="form-control"
                      value={formData.pretBucata}
                      onChange={(e) => setFormData({...formData, pretBucata: e.target.value})}
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Cantitate *</label>
                    <PositiveNumberInput
                      // type="number"
                      className="form-control"
                      value={formData.cantitate}
                      onChange={(e) => setFormData({...formData, cantitate: e.target.value})}
                      required
                    />
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label">Preț Total</label>
                  <input
                    type="text"
                    className="form-control bg-light"
                    value={`${calculateTotal()} RON`}
                    readOnly
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={() => setShowEditModal(false)}>
              Anulează
            </button>
            <button type="button" className="btn btn-primary" onClick={handleUpdateReservation}>
              Salvează Modificările
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const ReservationDetailsModal = ({ show, onHide, reservation }) => {
    if (!show || !reservation) return null;

    return (
      <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Detalii Rezervare #{reservation.id}</h5>
              <button type="button" className="btn-close" onClick={onHide}></button>
            </div>
            <div className="modal-body">
              <div className="row">
                <div className="col-md-6">
                  <h6 className="fw-bold mb-3">Informații Rezervare</h6>
                  <div className="mb-2">
                    <strong>Cod:</strong> {reservation.codRezervare || 'N/A'}
                  </div>
                  <div className="mb-2">
                    <strong>Status:</strong> {getStatusBadge(reservation.stareRezervare)}
                  </div>
                  <div className="mb-2">
                    <strong>Perioada:</strong> {reservation.dataInceput || 'N/A'} - {reservation.dataSfarsit || 'N/A'}
                  </div>
                  <div className="mb-2">
                    <strong>Data Creării:</strong> {
                      reservation.createdAt 
                        ? new Date(reservation.createdAt).toLocaleString('ro-RO')
                        : 'N/A'
                    }
                  </div>
                </div>
                
                <div className="col-md-6">
                  <h6 className="fw-bold mb-3">Informații Utilizator & Preț</h6>
                  <div className="mb-2">
                    <strong>Nume:</strong> {reservation.utilizator?.name || 'N/A'}
                  </div>
                  <div className="mb-2">
                    <strong>Email:</strong> {reservation.utilizator?.email || 'N/A'}
                  </div>
                  <div className="mb-2">
                    <strong>Preț/Bucată:</strong> {reservation.pretBucata ? `${reservation.pretBucata} RON` : 'N/A'}
                  </div>
                  <div className="mb-2">
                    <strong>Cantitate:</strong> {reservation.cantitate || 'N/A'}
                  </div>
                  <div className="mb-2">
                    <strong>Preț Total:</strong> <span className="fw-bold text-success">{reservation.pretTotal ? `${reservation.pretTotal} RON` : 'N/A'}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onHide}>
                Închide
              </button>
              <button 
                type="button" 
                className="btn btn-primary"
                onClick={() => {
                  openEditModal(reservation);
                  onHide();
                }}
              >
                Editează
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
          <p className="text-muted">Se încarcă rezervările din baza de date...</p>
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
            <button className="btn btn-outline-danger" onClick={loadReservations}>
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
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">Managementul Rezervărilor</h2>
          <p className="text-muted mb-0">
            Gestionează rezervările și statusurile acestora 
            {/* <span className="badge bg-success ms-2">Live Data</span> */}
          </p>
        </div>
        <div className="d-flex gap-2">
          <button 
            className="btn btn-outline-primary" 
            onClick={loadReservations}
            disabled={refreshing}
          >
            {refreshing ? (
              <span className="spinner-border spinner-border-sm me-2" />
            ) : (
              <Icon name="refresh" size={18} className="me-2" />
            )}
            Actualizează
          </button>
          {/* <button className="btn btn-primary" onClick={openCreateModal}>
            <Icon name="plus" size={18} className="me-2" />
            Adaugă Rezervare
          </button> */}
        </div>
      </div>

      {/* Statistici cu date reale */}
      <div className="row g-4 mb-4">
        <div className="col-md-3">
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="d-flex align-items-center">
              <div className="p-3 rounded-circle bg-primary bg-opacity-10 me-3">
                <Icon name="ticket" size={24} className="text-primary" />
              </div>
              <div>
                <h4 className="fw-bold mb-0">{stats.total}</h4>
                <small className="text-muted">Total Rezervări</small>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="d-flex align-items-center">
              <div className="p-3 rounded-circle bg-success bg-opacity-10 me-3">
                <Icon name="check" size={24} className="text-success" />
              </div>
              <div>
                <h4 className="fw-bold mb-0">{stats.confirmate}</h4>
                <small className="text-muted">Confirmate</small>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="d-flex align-items-center">
              <div className="p-3 rounded-circle bg-warning bg-opacity-10 me-3">
                <Icon name="clock" size={24} className="text-warning" />
              </div>
              <div>
                <h4 className="fw-bold mb-0">{stats.inAsteptare}</h4>
                <small className="text-muted">În așteptare</small>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="d-flex align-items-center">
              <div className="p-3 rounded-circle bg-info bg-opacity-10 me-3">
                <Icon name="creditCard" size={24} className="text-info" />
              </div>
              <div>
                <h5 className="fw-bold mb-0">{stats.venitTotal.toFixed(2)} RON</h5>
                <small className="text-muted">Venit Total</small>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filtre */}
      <div className="bg-white rounded-lg shadow-sm border p-4 mb-4">
        <div className="row g-3">
          <div className="col-md-4">
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0">
                <Icon name="search" size={18} className="text-muted" />
              </span>
              <input
                type="text"
                className="form-control border-start-0 bg-light"
                placeholder="Caută rezervare, utilizator sau plajă..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="col-md-4">
            <select 
              className="form-select"
              value={selectedStatus}
              onChange={(e) => {
                console.log('s-a selectat',e.target.value);
                setSelectedStatus(e.target.value)}
              }
            >
              <option value="all">Toate statusurile</option>
              {statusOptions.map(status => (
                <option key={status.id} value={status.id}>{status.denumire}</option>
              ))}
            </select>
          </div>
          <div className="col-md-4">
            <div className="d-flex gap-2">
              <button className="btn btn-outline-primary flex-fill" onClick={loadReservations}>
                <Icon name="search" size={18} className="me-2" />
                Reîncarcă
              </button>
              <button className="btn btn-outline-success" onClick={() => {/* TODO: Export functionality */}}>
                <Icon name="refresh" size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabel rezervări */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead className="table-light">
              <tr>
                <th className="border-0 ps-4">Cod Rezervare</th>
                <th className="border-0">Utilizator</th>
                <th className="border-0">Plaja</th>
                <th className="border-0">Perioada</th>
                <th className="border-0">Preț</th>
                <th className="border-0">Status</th>
                <th className="border-0 text-center">Acțiuni</th>
              </tr>
            </thead>
            <tbody>
              {filteredReservations.map(reservation => (
                <tr key={reservation.id}>
                  <td className="ps-4 py-3">
                    <div>
                      <div className="fw-bold text-primary">{reservation.codRezervare}</div>
                      <small className="text-muted">#{reservation.id}</small>
                    </div>
                  </td>
                  <td className="py-3">
                    <div>
                      <div className="fw-bold d-flex align-items-center">
                        <Icon name="user" size={14} className="text-muted me-2" />
                        {reservation.utilizator?.name || 'N/A'}
                      </div>
                      <small className="text-muted">{reservation.utilizator?.email || 'N/A'}</small>
                    </div>
                  </td>
                  <td className="py-3">
                    <div className="d-flex align-items-center">
                      <Icon name="beach" size={14} className="text-muted me-2" />
                      <span className="fw-bold">{reservation.plaja || 'N/A'}</span>
                    </div>
                  </td>
                  <td className="py-3">
                    <div>
                      <div className="fw-bold">{reservation.dataInceput || 'N/A'}</div>
                      <small className="text-muted">până {reservation.dataSfarsit || 'N/A'}</small>
                    </div>
                  </td>
                  <td className="py-3">
                    <div>
                      <div className="fw-bold text-success">{reservation.pretTotal || 0} RON</div>
                      {/* <small className="text-muted">{reservation.pretBucata || 0} RON × {reservation.cantitate || 0}</small> */}
                    </div>
                  </td>
                  <td className="py-3">
                    {getStatusBadge(reservation.stareRezervare)}
                  </td>
                  <td className="py-3 text-center">
                    <div className="btn-group btn-group-sm">
                      <button 
                        className="btn btn-outline-primary"
                        title="Vezi detalii"
                        onClick={() => handleViewDetails(reservation)}
                      >
                         <Icon name="eye" size={14} />
                      </button>

                      {/* <button  
                        className="btn btn-outline-secondary"
                        title="Editează"
                        onClick={() => openEditModal(reservation)}
                      >
                        <Icon name="edit" size={14} />
                      </button>
                      <button 
                        className="btn btn-outline-danger"
                        title="Șterge"
                        onClick={() => handleDeleteReservation(reservation.id)}
                      >
                        <Icon name="trash" size={14} />
                      </button> */}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredReservations.length === 0 && (
          <div className="text-center py-5">
            <Icon name="ticket" size={48} className="text-muted mb-3" />
            <h5 className="text-muted">Nu au fost găsite rezervări</h5>
            <p className="text-muted">
              {reservations.length === 0 
                ? 'Nu există rezervări în baza de date. Adaugă prima rezervare!'
                : 'Încearcă să modifici criteriile de căutare'
              }
            </p>
            {/* {reservations.length === 0 && (
              <button className="btn btn-primary" onClick={openCreateModal}>
                <Icon name="plus" size={18} className="me-2" />
                Adaugă prima rezervare
              </button>
            )} */}
          </div>
        )}
      </div>

      {filteredReservations.length > 0 && (
        <div className="d-flex justify-content-between align-items-center mt-4">
          <small className="text-muted">
            Se afișează {filteredReservations.length} din {reservations.length} rezervări
          </small>
          <div className="text-end">
            <small className="text-muted">
              Venit total afișat: <span className="fw-bold text-success">
                {filteredReservations.reduce((total, r) => total + (r.pretTotal || 0), 0).toFixed(2)} RON
              </span>
            </small>
          </div>
        </div>
      )}

      {/* Modals */}
      {showCreateModal && <CreateReservationModal />}
      {showEditModal && <EditReservationModal />}
      <ReservationDetailsModal 
        show={showDetailsModal} 
        onHide={() => setShowDetailsModal(false)} 
        reservation={selectedReservation}
      />
    </div>
  );
};

export default ReservationsManagement;