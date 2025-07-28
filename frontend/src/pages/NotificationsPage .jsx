import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  Trash2, 
  Ticket, 
  // Calendar, 
  // AlertCircle,
  // Info,
  // X,
  // Settings,
  BellOff,
  RefreshCw
} from 'lucide-react';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  // const [selectedFilter, setSelectedFilter] = useState('toate');
  const [selectedNotifications, setSelectedNotifications] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 0,
    totalPages: 0,
    totalElements: 0,
    size: 10
  });

  // 🔗 CONECTARE LA API
  useEffect(() => {
    fetchNotifications();
  }, []);

  const getAuthToken = () => {
    return localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
  };

  const getHeaders = () => {
    const token = getAuthToken();
    const headers = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  };

  // 📥 ÎNCĂRCARE NOTIFICĂRI
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError('');
      
      const token = getAuthToken();
      if (!token) {
        setError('Nu ești autentificat. Te rugăm să te loghezi.');
        setLoading(false);
        return;
      }

      const response = await fetch('http://localhost:8080/api/notificari?page=0&size=50', {
        method: 'GET',
        headers: getHeaders(),
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error(`Eroare ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      let content = data.content || data;
      if (!Array.isArray(content)) {
        throw new Error('Răspunsul nu conține un array de notificări');
      }
      
      const transformedNotifications = content.map(notif => ({
        id: notif.id,
        // tip: getTipFromContent(notif.continut),
        // titlu: getTitluFromContent(notif.continut),
        mesaj: notif.continut,
        codRezervare: extractCodRezervare(notif.continut),
        data: new Date(notif.dataOra),
        // important: notif.continut.includes('confirmată') || notif.continut.includes('anulată'),
        rezervareId: notif.rezervareId
      }));

      setNotifications(transformedNotifications);
      setPagination({
        currentPage: data.number || 0,
        totalPages: data.totalPages || 1,
        totalElements: data.totalElements || content.length,
        size: data.size || content.length
      });

    } catch (err) {
      setError(`Nu s-au putut încărca notificările: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // 🔧 HELPER FUNCTIONS
  /* const getTipFromContent = (continut) => {
    if (continut.includes('confirmată')) return 'rezervare';
    if (continut.includes('anulată')) return 'anulare';
    if (continut.includes('modificată')) return 'modificare';
    if (continut.includes('Reminder') || continut.includes('Nu uita')) return 'reminder';
    if (continut.includes('sistem') || continut.includes('actualizare')) return 'system';
    if (continut.includes('ofertă') || continut.includes('reducere')) return 'oferta';
    return 'system';
  }; */

  /* const getTitluFromContent = (continut) => {
    if (continut.includes('confirmată')) return '✅ Rezervare confirmată';
    if (continut.includes('anulată')) return '❌ Rezervare anulată';
    if (continut.includes('modificată')) return '🔄 Rezervare modificată';
    if (continut.includes('Reminder')) return '⏰ Reminder rezervare';
    if (continut.includes('sistem')) return '🔧 Notificare sistem';
    if (continut.includes('ofertă')) return '🎁 Ofertă specială';
    return '📢 Notificare';
  }; */

  const extractCodRezervare = (continut) => {
    const match = continut.match(/RZ\d+/);
    return match ? match[0] : null;
  };

  // 🗑️ ȘTERGERE NOTIFICĂRI
  const deleteNotification = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/api/notificari/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });

      if (response.ok) {
        setNotifications(prev => prev.filter(notif => notif.id !== id));
        setSelectedNotifications(prev => prev.filter(nId => nId !== id));
      } else {
        throw new Error('Eroare la ștergerea notificării');
      }
    } catch (err) {
      setError('Nu s-a putut șterge notificarea');
    }
  };

  const deleteSelected = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/notificari/bulk', {
        method: 'DELETE',
        headers: getHeaders(),
        body: JSON.stringify(selectedNotifications)
      });

      if (response.ok) {
        setNotifications(prev => 
          prev.filter(notif => !selectedNotifications.includes(notif.id))
        );
        setSelectedNotifications([]);
        setShowDeleteModal(false);
        
        console.log(`✅ ${selectedNotifications.length} notificări șterse cu succes`);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Eroare la ștergerea notificărilor');
      }
    } catch (err) {
      console.error('❌ Eroare ștergere bulk:', err);
      setError(`Nu s-au putut șterge notificările: ${err.message}`);
    }
  };

  // ✅ SELECTARE NOTIFICĂRI
  const toggleSelectNotification = (id) => {
    setSelectedNotifications(prev => 
      prev.includes(id) 
        ? prev.filter(nId => nId !== id)
        : [...prev, id]
    );
  };

  const selectAllNotifications = () => {
    const allSelected = notifications.every(notif => selectedNotifications.includes(notif.id));
    
    if (allSelected) {
      setSelectedNotifications([]);
    } else {
      setSelectedNotifications(notifications.map(notif => notif.id));
    }
  };

  // 🔍 FILTRARE NOTIFICĂRI - COMENTAT
  /* const getFilteredNotifications = () => {
    switch (selectedFilter) {
      case 'rezervari':
        return notifications.filter(notif => ['rezervare', 'anulare', 'modificare', 'reminder'].includes(notif.tip));
      case 'system':
        return notifications.filter(notif => ['system', 'oferta'].includes(notif.tip));
      default:
        return notifications;
    }
  }; */

  // 🎨 ICOANE PENTRU TIPURI - SIMPLIFICAT
  /* const getNotificationIcon = (tip, important) => {
    const iconProps = { 
      size: 20, 
      className: important ? 'text-danger' : 'text-primary' 
    };

    switch (tip) {
      case 'rezervare':
        return <Ticket {...iconProps} />;
      case 'anulare':
        return <X {...iconProps} />;
      case 'modificare':
        return <Settings {...iconProps} />;
      case 'reminder':
        return <Calendar {...iconProps} />;
      case 'system':
        return <Info {...iconProps} />;
      case 'oferta':
        return <AlertCircle {...iconProps} />;
      default:
        return <Bell {...iconProps} />;
    }
  }; */

  // Folosim direct notifications în loc de filteredNotifications
  // const filteredNotifications = getFilteredNotifications();

  // 🔄 LOADING STATE
  if (loading) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Se încarcă...</span>
          </div>
          <p>Se încarcă notificările...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      {/* Header */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="fw-bold d-flex align-items-center">
                <Bell className="me-3 text-primary" size={32} />
                Notificări
              </h1>
              <p className="text-muted mb-0">
                Confirmările rezervărilor tale
              </p>
              {pagination.totalElements > 0 && (
                <small className="text-muted">
                  Total: {pagination.totalElements} notificări
                </small>
              )}
            </div>
            
            {/* Acțiuni rapide */}
            <div className="d-flex gap-2">
              <button 
                className="btn btn-outline-secondary btn-sm"
                onClick={fetchNotifications}
                title="Reîmprospătează"
                disabled={loading}
              >
                <RefreshCw size={16} className="me-1" />
                Reîmprospătează
              </button>
              
              {selectedNotifications.length > 0 && (
                <button 
                  className="btn btn-outline-danger btn-sm"
                  onClick={() => setShowDeleteModal(true)}
                >
                  <Trash2 size={16} className="me-1" />
                  Șterge selectate ({selectedNotifications.length})
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="row mb-4">
          <div className="col-12">
            <div className="alert alert-danger" role="alert">
              <h4 className="alert-heading">Eroare!</h4>
              <p>{error}</p>
              <hr />
              <button className="btn btn-outline-danger" onClick={fetchNotifications}>
                <RefreshCw size={16} className="me-1" />
                Încearcă din nou
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FILTRE COMENTATE */}
      {/* <div className="row mb-4">
        <div className="col-12">
          <div className="card border-0 shadow-sm rounded-4">
            <div className="card-body p-3">
              <div className="d-flex flex-wrap gap-2 align-items-center">
                <span className="fw-semibold me-3">Filtrează:</span>
                
                <button
                  className={`btn btn-sm ${selectedFilter === 'toate' ? 'btn-primary' : 'btn-outline-secondary'}`}
                  onClick={() => setSelectedFilter('toate')}
                >
                  Toate ({notifications.length})
                </button>
                
                <button
                  className={`btn btn-sm ${selectedFilter === 'rezervari' ? 'btn-primary' : 'btn-outline-secondary'}`}
                  onClick={() => setSelectedFilter('rezervari')}
                >
                  Rezervări ({notifications.filter(n => ['rezervare', 'anulare', 'modificare', 'reminder'].includes(n.tip)).length})
                </button>
                
                <button
                  className={`btn btn-sm ${selectedFilter === 'system' ? 'btn-primary' : 'btn-outline-secondary'}`}
                  onClick={() => setSelectedFilter('system')}
                >
                  Sistem ({notifications.filter(n => ['system', 'oferta'].includes(n.tip)).length})
                </button>

                {notifications.length > 0 && (
                  <div className="ms-auto">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="selectAll"
                        checked={notifications.length > 0 && notifications.every(notif => selectedNotifications.includes(notif.id))}
                        onChange={selectAllNotifications}
                      />
                      <label className="form-check-label small" htmlFor="selectAll">
                        Selectează tot
                      </label>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div> */}

      {/* Checkbox pentru selectare toate */}
      {notifications.length > 0 && (
        <div className="row mb-3">
          <div className="col-12">
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id="selectAll"
                checked={notifications.length > 0 && notifications.every(notif => selectedNotifications.includes(notif.id))}
                onChange={selectAllNotifications}
              />
              <label className="form-check-label" htmlFor="selectAll">
                Selectează toate notificările
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Lista de notificări - SIMPLIFICATĂ */}
      <div className="row">
        <div className="col-12">
          {notifications.length === 0 ? (
            <div className="text-center py-5">
              <BellOff size={64} className="text-muted mb-3" />
              <h4 className="text-muted">Nu există notificări</h4>
              <p className="text-muted">
                Nu ai încă nicio notificare. Fă o rezervare pentru a primi prima notificare!
              </p>
              <small className="text-muted d-block mb-2">
                💡 Notificările vor apărea automat după ce confirmei o rezervare prin plată.
              </small>
            </div>
          ) : (
            <div className="d-flex flex-column gap-3">
              {notifications.map((notification) => (
                <div 
                  key={notification.id}
                  className="card border-0 shadow-sm rounded-4"
                >
                  <div className="card-body p-4">
                    <div className="d-flex align-items-start">
                      {/* Checkbox pentru selecție */}
                      <div className="form-check me-3">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={selectedNotifications.includes(notification.id)}
                          onChange={() => toggleSelectNotification(notification.id)}
                        />
                      </div>

                      {/* Iconul notificării - SIMPLIFICAT */}
                      <div className="me-3 mt-1">
                        <Ticket size={20} className="text-success" />
                      </div>

                      {/* Conținutul notificării - SIMPLIFICAT */}
                      <div className="flex-grow-1">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <h6 className="mb-0 fw-semibold">
                            ✅ Rezervare confirmată
                          </h6>
                          <small className="text-muted">
                            {notification.data.toLocaleDateString('ro-RO', {
                              day: 'numeric',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </small>
                        </div>
                        
                        {/* Mesaj simplificat */}
                        <div className="mb-3 text-dark">
                          <p className="mb-2">Rezervarea ta a fost făcută cu succes!</p>
                          {notification.codRezervare && (
                            <p className="mb-0">
                              <strong>Codul rezervării tale este: {notification.codRezervare}</strong>
                            </p>
                          )}
                        </div>

                        {/* Acțiuni - SIMPLIFICATE */}
                        <div className="d-flex gap-2">
                          {notification.codRezervare && (
                            <button className="btn btn-sm btn-primary">
                              <Ticket size={14} className="me-1" />
                              Vezi rezervarea
                            </button>
                          )}
                          
                          <button
                            className="btn btn-sm btn-outline-danger ms-auto"
                            onClick={() => deleteNotification(notification.id)}
                          >
                            <Trash2 size={14} className="me-1" />
                            Șterge
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal pentru confirmare ștergere */}
      {showDeleteModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 rounded-4">
              <div className="modal-header border-0">
                <h5 className="modal-title">Confirmare ștergere</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowDeleteModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p>Ești sigur că vrei să ștergi {selectedNotifications.length} notificări selectate?</p>
                <p className="text-muted small">Această acțiune nu poate fi anulată.</p>
              </div>
              <div className="modal-footer border-0">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setShowDeleteModal(false)}
                >
                  Anulează
                </button>
                <button 
                  type="button" 
                  className="btn btn-danger"
                  onClick={deleteSelected}
                >
                  <Trash2 size={16} className="me-1" />
                  Șterge
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;