import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { FavoritesContext } from '../contexts/FavoritesContext';
import ProfileSidebar from '../components/profile/ProfileSidebar';
import ProfileInfo from '../components/profile/ProfileInfo';
import ReservationsList from '../components/profile/ReservationsList';
import ChangePasswordModal from '../components/auth/ChangePasswordModal';
import ApiClient from "../api/src/ApiClient";
import PlajaControllerApi from "../api/src/api/PlajaControllerApi";
import apiService from '../services/ApiService';
import { useAuth } from '../hooks/useAuth';


// Inițializăm client-ul API
const apiClient = new ApiClient();
apiClient.enableCookies = true;
const plajaApi = new PlajaControllerApi(apiClient);
/**
 * Pagina de profil modernă și conectată la baza de date
 */
const ProfilePage = () => {
  const { user, updateUserData, refreshUserData, uploadProfileImage } = useContext(AuthContext);
  const { favorites } = useContext(FavoritesContext);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  
  const [activeTab, setActiveTab] = useState('info');
  const [rezervari, setRezervari] = useState([]);
  const [plajeFavorite, setPlajeFavorite] = useState([]);
  const [loading, setLoading] = useState({
    rezervari: false,
    favorite: false,
    profileUpdate: false
  });

  const { deleteAccountAndLogout } = useAuth();

  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {    
      const confirmHardDelete = window.confirm(
        'ATENȚIE: Această acțiune va șterge DEFINITIV toate datele tale (rezervări, favorite, etc.). ' +
        'Ești absolut sigur că vrei să continui? Această acțiune NU poate fi anulată!'
      );
      
      if (!confirmHardDelete) {
        return;
      }
     setIsDeleting(true);
    
    try {
      await deleteAccountAndLogout(user.id);
    } catch (error) {
      console.error('Eroare la ștergerea contului:', error);
      // Eroarea este deja afișată în useAuth prin addNotification
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  // ✅ ÎNCĂRCĂM DATELE LA MOUNT
  useEffect(() => {
    loadProfileData();
    // Refresh user data pentru a ne asigura că avem datele cele mai recente
    if (refreshUserData) {
      refreshUserData();
    }
  }, []);

  // ✅ ÎNCĂRCĂM DATELE FAVORITE CÂND SE SCHIMBĂ
  useEffect(() => {
    if (favorites && favorites.length > 0) {
      loadFavorites();
    }
  }, [favorites]);



  useEffect(() => {
    console.log("📋 Rezervări:", user.id);
    const loadRezervari = async () => {
      if (!user?.id) {
        setError("Utilizator invalid. Te rugăm să te autentifici din nou.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        console.log("🔍 Încărcare rezervări pentru utilizatorul:", user?.email);
        console.log("🔍 URL complet:", window.location.origin + '/api/rezervari/user');

        const response = await apiService.getAllRezervariByUser();


        console.log("📋 Rezervări din API:", response);
        // Mapează datele din API la formatul UI
        const rezervariMapped = response.map(mapApiDataToUI);


        console.log("📋 Rezervări mapate pentru UI:", rezervariMapped);
        setRezervari(rezervariMapped);

      } catch (err) {
        console.error("❌ Eroare la încărcarea rezervărilor:", err);

        // 🔧 VERIFICA TIPUL DE EROARE cu detalii
        if (err.message.includes('Unexpected token') || err.message.includes('<!doctype')) {
          setError("Backend-ul returnează HTML în loc de JSON. Verificați că endpoint-ul /api/rezervari/user există și funcționează.");
        } else if (err.message.includes('NetworkError') || err.message.includes('Failed to fetch')) {
          setError("Nu se poate conecta la backend. Verificați că serverul rulează pe http://localhost:8080");
        } else {
          setError(`Eroare la încărcarea rezervărilor: ${err.message}`);
        }
      } finally {
        setLoading(false);
      }
    };

    loadRezervari();
  }, [user?.id]);

  

  // ✅ HANDLER PENTRU SUCCESUL SCHIMBĂRII PAROLEI
  const handlePasswordChangeSuccess = () => {
    console.log('✅ Password changed successfully!');
    setShowChangePasswordModal(false);
  };

  const extragePozitie = (denumire) => {
    const [_, linie, coloana] = denumire.split('-');
    return [`R${linie}C${coloana}`,`Randul: ${linie}, Coloana: ${coloana}`];
  }

  // 🆕 FUNCȚIE pentru maparea datelor din API la formatul UI
  const mapApiDataToUI = (apiRezervare) => {
    const liniiDetalii = apiRezervare.liniiDetalii || [];
    const totalCantitate = apiRezervare.cantitate || 0;
    const totalCalculat = apiRezervare.pretCalculat || apiRezervare.sumaPlatita || 0;
    const tipuriEchipament = apiRezervare.tipuriEchipament || [];
    const tipEchipamentPrincipal = tipuriEchipament.length > 0 ? tipuriEchipament[0] : 'Nespecificat';
    const stareRezervare = apiRezervare.stareRezervare || 'Necunoscuta';

    let pretBucata = 0;
    if (liniiDetalii.length > 0 && totalCantitate > 0) {
      pretBucata = Math.round(totalCalculat / totalCantitate);
    }
    let dataInceput = apiRezervare.dataInceput;
    let dataSfarsit = apiRezervare.dataSfarsit;
    // if (liniiDetalii.length > 0) {
    //   // Găsește prima și ultima dată din linii
    //   const dateLinii = liniiDetalii.flatMap(linie => [linie.dataInceput, linie.dataSfarsit]).filter(Boolean);
    //   if (dateLinii.length > 0) {
    //     dataInceput = dateLinii.sort()[0];
    //     dataSfarsit = dateLinii.sort().reverse()[0];
    //   }
    // }

    return {

      id: apiRezervare.id,
      codRezervare: apiRezervare.codRezervare,
      numePlaja: apiRezervare.numePlaja || 'Plajă necunoscută',
      pozitiaSezlong: apiRezervare.pozitiaSezlong || '',
      sumaPlatita: apiRezervare.sumaPlatita || 0,
      stareRezervare: stareRezervare,
      dataRezervare: apiRezervare.dataInceput,
      createdAt: apiRezervare.createdAt,
      imageUrl: apiRezervare.imageUrl,
      // Date calculate
      cantitate: totalCantitate,
      dataInceput: dataInceput,
      dataSfarsit: dataSfarsit,
      pretBucata: pretBucata,
      pretCalculat: totalCalculat,
      tipEchipament: tipEchipamentPrincipal,

      // Linii detaliate mapate
      liniiDetalii: liniiDetalii.map(linie => ({
        id: linie.id,
        cantitate: linie.cantitate || 1,
        dataInceput: linie.dataInceput,
        dataSfarsit: linie.dataSfarsit,
        pretBucata: linie.pretBucata || 0,
        pretCalculat: linie.pretCalculat || 0,
        tipEchipament: linie.tipEchipament || 'Nespecificat',
        echipament: linie.echipamentNume || linie.echipament?.denumire || `Echipament ${linie.id}`,
        pozitie: extragePozitie(linie.echipament)[0],
        pozitieDetalii: extragePozitie(linie.echipament)[1]
      })),

      // Date originale pentru referință
      _originalData: apiRezervare
    };
  };



  // ✅ HANDLER PENTRU SCHIMBAREA PAROLEI
  const handlePasswordChange = async (currentPassword, newPassword) => {
    try {
      console.log('🔐 Initiating password change...');
      
      const token = localStorage.getItem('token') || sessionStorage.getItem('token') || localStorage.getItem('authToken');
      console.log('🔑 Token found:', token ? 'Yes' : 'No');
      
      const response = await fetch('http://localhost:8080/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        credentials: 'include',
        body: JSON.stringify({
          currentPassword,
          newPassword
        })
      });

      const responseText = await response.text();
      console.log('📝 Raw response:', responseText);

      if (!response.ok) {
        let errorMessage = 'Eroare la schimbarea parolei';
        let errorField = undefined;
        
        if (responseText.trim().startsWith('{')) {
          try {
            const errorData = JSON.parse(responseText);
            errorMessage = errorData.message || errorMessage;
            errorField = errorData.field;
          } catch (e) {
            console.warn('Could not parse error response as JSON');
          }
        } else if (response.status === 401) {
          errorMessage = 'Parola curentă este incorectă';
          errorField = 'currentPassword';
        }
        
        return { 
          success: false, 
          message: errorMessage,
          field: errorField
        };
      }

      if (!responseText.trim()) {
        return { success: true, message: 'Parola a fost schimbată cu succes!' };
      }

      try {
        const result = JSON.parse(responseText);
        return { 
          success: result.success !== false, 
          message: result.message || 'Parola a fost schimbată cu succes!'
        };
      } catch (e) {
        return { success: true, message: 'Parola a fost schimbată cu succes!' };
      }

    } catch (error) {
      console.error('❌ Error changing password:', error);
      return { 
        success: false, 
        message: 'Eroare de conexiune. Te rugăm să încerci din nou.' 
      };
    }
  };

  // ✅ ÎNCĂRCAREA REZERVĂRILOR DIN BAZA DE DATE (nu mock!)
  const loadProfileData = async () => {
    // setLoading(prev => ({ ...prev, rezervari: true }));
    // try {
    //   // TODO: Înlocuiește cu API call real pentru rezervări
    //   // const response = await fetch('/api/rezervari/user', { credentials: 'include' });
    //   // const rezervariData = await response.json();
    //   // setRezervari(rezervariData);
      
    //   // Temporar - până implementezi API-ul pentru rezervări
    //   setRezervari([]);
    // } catch (error) {
    //   console.error('Eroare la încărcarea rezervărilor:', error);
    // } finally {
    //   setLoading(prev => ({ ...prev, rezervari: false }));
    // }
  };

  const loadFavorites = () => {
    setLoading(prev => ({ ...prev, favorite: true }));
    try {
      plajaApi.getAllPlajeUsingGET((error, data) => {
        if (error) {
          console.error("Eroare la încărcarea plajelor favorite:", error);
        } else {
          const filteredPlaje = data.filter(plaja => favorites.includes(plaja.id));
          setPlajeFavorite(filteredPlaje);
        }
        setLoading(prev => ({ ...prev, favorite: false }));
      });
    } catch (error) {
      console.error('Eroare la încărcarea plajelor favorite:', error);
      setLoading(prev => ({ ...prev, favorite: false }));
    }
  };

  // ✅ HANDLER PENTRU ACTUALIZARE PROFIL
  const handleUpdateProfile = async (updatedData) => {
    setLoading(prev => ({ ...prev, profileUpdate: true }));
    try {
      console.log('🔄 Updating profile with data:', updatedData);
      
      const result = await updateUserData(updatedData);
      
      if (result.success) {
        console.log('✅ Profile updated successfully');
        if (refreshUserData) {
          await refreshUserData();
        }
        return { success: true, message: 'Profil actualizat cu succes!' };
      } else {
        console.error('❌ Profile update failed:', result.message);
        return { success: false, message: result.message || 'Eroare la actualizarea profilului' };
      }
    } catch (error) {
      console.error('❌ Error updating profile:', error);
      return { success: false, message: 'Eroare neașteptată la actualizarea profilului' };
    } finally {
      setLoading(prev => ({ ...prev, profileUpdate: false }));
    }
  };

  // ✅ HANDLER PENTRU UPLOAD IMAGINE PROFIL
  const handleProfileImageUpload = async (file) => {
    try {
      console.log('📸 Uploading profile image:', file.name);
      
      if (file.size > 5 * 1024 * 1024) {
        return { success: false, message: 'Fișierul este prea mare. Maximum 5MB.' };
      }
      
      if (!file.type.startsWith('image/')) {
        return { success: false, message: 'Doar imagini sunt permise (JPG, PNG, GIF).' };
      }
      
      const result = await uploadProfileImage(file);
      
      if (result.success) {
        console.log('✅ Profile image uploaded successfully');
        return { success: true, message: result.message || 'Poza de profil a fost actualizată!' };
      } else {
        console.error('❌ Profile image upload failed:', result.error);
        return { success: false, message: result.error };
      }
      
    } catch (error) {
      console.error('❌ Error uploading profile image:', error);
      return { success: false, message: 'Eroare la încărcarea imaginii' };
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'info':
        return (
          <ProfileInfo 
            user={user} 
            onUpdate={handleUpdateProfile}
            onImageUpload={handleProfileImageUpload}
            loading={loading.profileUpdate}
          />
        );
        
      case 'reservations':
        return (
          <div className="modern-card">
            <div className="card-header">
              <div className="d-flex align-items-center">
                <div className="icon-wrapper bg-primary">
                  📅
                </div>
                <div className="ms-3">
                  <h4 className="mb-0">Rezervările mele</h4>
                  <p className="text-muted mb-0">Gestionează rezervările tale</p>
                </div>
              </div>
            </div>
            <div className="card-body">
              <ReservationsList 
                rezervari={rezervari} 
                loading={loading.rezervari} 
              />
            </div>
          </div>
        );
        
      case 'favorites':
        return (
          <div className="modern-card">
            <div className="card-header">
              <div className="d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center">
                  <div className="icon-wrapper bg-danger">
                    ❤️
                  </div>
                  <div className="ms-3">
                    <h4 className="mb-0">Plaje favorite</h4>
                    <p className="text-muted mb-0">Plajele tale preferate</p>
                  </div>
                </div>
                <span className="badge bg-danger rounded-pill">{favorites.length}</span>
              </div>
            </div>
            <div className="card-body">
              {loading.favorite ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Se încarcă...</span>
                  </div>
                  <p className="mt-3 text-muted">Se încarcă plajele favorite...</p>
                </div>
              ) : plajeFavorite.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-state-icon">
                    💔
                  </div>
                  <h5>Nicio plajă favorită</h5>
                  <p className="text-muted mb-4">Nu ai adăugat încă nicio plajă la favorite. Explorează plajele și adaugă-le pe cele care îți plac!</p>
                  <a href="/plaje" className="btn btn-primary">
                    🔍 Explorează plajele
                  </a>
                </div>
              ) : (
                <div className="row g-3">
                  {plajeFavorite.map(plaja => (
                    <div className="col-lg-6" key={plaja.id}>
                      <div className="favorite-card">
                        <div className="row g-0 h-100">
                          <div className="col-4">
                            <div className="favorite-image">
                              <img 
                                src={plaja.detaliiWeb?.images?.[0] || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e"} 
                                alt={plaja.denumire}
                              />
                            </div>
                          </div>
                          <div className="col-8">
                            <div className="favorite-content">
                              <h6 className="favorite-title">{plaja.denumire}</h6>
                              <p className="favorite-location">
                                📍 {plaja.statiune?.denumire}, Constanța
                              </p>
                              <div className="favorite-footer">
                                <span className="rating-badge">
                                  ⭐ {plaja.detaliiWeb?.rating?.toFixed(1) || 'N/A'}
                                </span>
                                <a href={`/plaja/${plaja.id}`} className="btn btn-sm btn-outline-primary">
                                  Vezi
                                </a>
                              </div>
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
        );
        
        case 'settings':
          return (
            <div className="modern-card">
              <div className="card-header">
                <div className="d-flex align-items-center">
                  <div className="icon-wrapper bg-warning">
                    ⚙️
                  </div>
                  <div className="ms-3">
                    <h4 className="mb-0">Setări cont</h4>
                    <p className="text-muted mb-0">Configurează preferințele tale</p>
                  </div>
                </div>
              </div>
              <div className="card-body">
                <div className="settings-section">
                  <h5 className="settings-title">
                    🛡️ Securitate
                  </h5>
                  <div className="settings-item">
                    <div className="settings-item-content">
                      <div className="settings-item-info">
                        <h6>Schimbă parola</h6>
                        <p className="text-muted">Actualizează parola pentru o securitate mai bună</p>
                      </div>
                      <button 
                        className="btn btn-outline-primary btn-sm"
                        onClick={() => setShowChangePasswordModal(true)}
                      >
                        🔑 Schimbă
                      </button>
                    </div>
                  </div>
                </div>

                {/* <div className="settings-section">
                  <h5 className="settings-title">
                    🔔 Notificări
                  </h5>
                  
                  <div className="settings-item">
                    <div className="settings-toggle">
                      <div className="settings-toggle-info">
                        <h6>Notificări prin email</h6>
                        <p className="text-muted">Primește confirmări și actualizări pentru rezervări</p>
                      </div>
                      <div className="form-check form-switch">
                        <input className="form-check-input" type="checkbox" id="emailNotif" defaultChecked />
                      </div>
                    </div>
                  </div>

                  <div className="settings-item">
                    <div className="settings-toggle">
                      <div className="settings-toggle-info">
                        <h6>Notificări prin SMS</h6>
                        <p className="text-muted">Primește alerte importante pe telefon</p>
                      </div>
                      <div className="form-check form-switch">
                        <input className="form-check-input" type="checkbox" id="smsNotif" defaultChecked />
                      </div>
                    </div>
                  </div>

                  <div className="settings-item">
                    <div className="settings-toggle">
                      <div className="settings-toggle-info">
                        <h6>Email-uri promoționale</h6>
                        <p className="text-muted">Primește oferte speciale și noutăți</p>
                      </div>
                      <div className="form-check form-switch">
                        <input className="form-check-input" type="checkbox" id="promoNotif" />
                      </div>
                    </div>
                  </div>
                </div> */}

                {/* <div className="settings-section">
                  <h5 className="settings-title">
                    📊 Statistici cont
                  </h5>
                  <div className="stats-grid">
                    <div className="stat-card">
                      <div className="stat-icon bg-primary">
                        📅
                      </div>
                      <div className="stat-content">
                        <h3>{rezervari.length}</h3>
                        <p>Rezervări totale</p>
                      </div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-icon bg-danger">
                        ❤️
                      </div>
                      <div className="stat-content">
                        <h3>{favorites.length}</h3>
                        <p>Plaje favorite</p>
                      </div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-icon bg-success">
                        🔐
                      </div>
                      <div className="stat-content">
                        <h3>Sigur</h3>
                        <p>Cont protejat</p>
                      </div>
                    </div>
                  </div>
                </div> */}

                <div className="settings-section">
                  <h5 className="settings-title">
                    🚨 Zona periculoasă
                  </h5>
                  <div className="danger-zone">
                    <div className="settings-item">
                      <div className="settings-item-content">
                        <div className="settings-item-info">
                          <h6 className="text-danger">Șterge contul</h6>
                          <p className="text-muted">Această acțiune nu poate fi anulată. Toate datele tale vor fi șterse permanent.</p>
                        </div>
                        <button 
          className="btn btn-outline-danger btn-sm"
          onClick={handleDeleteClick}
          disabled={isDeleting}
        >
          {isDeleting ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status"></span>
              Se șterge...
            </>
          ) : (
            <>🗑️ Șterge Contul</>
          )}
        </button>
                      </div>

                           {/* Modal de confirmare ștergere */}
      {showDeleteModal && (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header border-bottom-0">
                <h5 className="modal-title text-danger">⚠️ Confirmare Ștergere Cont</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowDeleteModal(false)}
                ></button>
              </div>
              
              
              
              <div className="modal-footer border-top-0">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setShowDeleteModal(false)}
                  disabled={isDeleting}
                >
                  Anulează
                </button>
                <button 
                  type="button" 
                  className={`btn btn-danger`}
                  onClick={handleConfirmDelete}
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Se șterge...
                    </>
                  ) : (
                    `Confirm ștergerea completă`
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        
      default:
        return (
          <div className="modern-card">
            <div className="card-body text-center py-5">
              ⚠️ Conținut indisponibil
              <p className="text-muted">Această secțiune nu este disponibilă momentan.</p>
            </div>
          </div>
        );
    }
  };

  if (!user) {
    return (
      <div className="container my-5">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Se încarcă...</span>
          </div>
          <h5 className="mt-3">Se încarcă profilul...</h5>
          <p className="text-muted">Te rugăm să aștepți</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="container-fluid px-4 py-4">
        <div className="profile-header mb-4">
          <div className="row align-items-center">
            <div className="col">
              <h2 className="profile-title">
                👤 Profilul meu
              </h2>
              <p className="profile-subtitle">Gestionează informațiile tale personale și preferințele</p>
            </div>
          </div>
        </div>
        
        <div className="row g-4">
          <div className="col-xl-3 col-lg-4">
            <ProfileSidebar 
              user={user}
              activeTab={activeTab} 
              onTabChange={setActiveTab} 
              counts={{
                reservations: rezervari.length,
                favorites: favorites.length
              }}
            />
          </div>
          
          <div className="col-xl-9 col-lg-8">
            {renderContent()}
          </div>
        </div>
      </div>

      {/* ✅ MODAL PENTRU SCHIMBAREA PAROLEI - FOLOSEȘTE COMPONENTA SEPARATĂ */}
      <ChangePasswordModal
        show={showChangePasswordModal}
        onHide={() => setShowChangePasswordModal(false)}
        onSuccess={handlePasswordChangeSuccess}
        onPasswordChange={handlePasswordChange}
      />

      <style>{`
        .profile-page {
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          min-height: 100vh;
        }

        .profile-title {
          color: #2d3748;
          font-weight: 600;
          margin-bottom: 0;
        }

        .profile-subtitle {
          color: white;
          margin-bottom: 0;
        }

        .modern-card {
          background: white;
          border-radius: 16px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          border: none;
          overflow: hidden;
        }

        .card-header {
          background: white;
          border-bottom: 1px solid #e2e8f0;
          padding: 1.5rem;
          margin-bottom: 0;
        }

        .card-body {
          padding: 1.5rem;
        }

        .icon-wrapper {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 1.125rem;
        }

        .empty-state {
          text-align: center;
          padding: 3rem 1rem;
        }

        .empty-state-icon {
          font-size: 4rem;
          color: #cbd5e0;
          margin-bottom: 1rem;
        }

        .favorite-card {
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          transition: all 0.2s;
          height: 120px;
        }

        .favorite-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .favorite-image {
          height: 120px;
          overflow: hidden;
        }

        .favorite-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .favorite-content {
          padding: 1rem;
          height: 120px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .favorite-title {
          font-weight: 600;
          margin-bottom: 0.25rem;
          font-size: 0.875rem;
        }

        .favorite-location {
          color: #718096;
          font-size: 0.75rem;
          margin-bottom: 0;
        }

        .favorite-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .rating-badge {
          background: #fed7d7;
          color: #c53030;
          padding: 0.25rem 0.5rem;
          border-radius: 6px;
          font-size: 0.75rem;
          font-weight: 500;
        }

        .settings-section {
          margin-bottom: 2rem;
        }

        .settings-section:last-child {
          margin-bottom: 0;
        }

        .settings-title {
          color: #2d3748;
          font-size: 1.125rem;
          font-weight: 600;
          margin-bottom: 1rem;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid #e2e8f0;
        }

        .settings-item {
          padding: 1rem 0;
          border-bottom: 1px solid #f7fafc;
        }

        .settings-item:last-child {
          border-bottom: none;
        }

        .settings-item-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .settings-item-info h6 {
          margin-bottom: 0.25rem;
          font-weight: 600;
        }

        .settings-item-info p {
          margin-bottom: 0;
          font-size: 0.875rem;
        }

        .settings-toggle {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .settings-toggle-info h6 {
          margin-bottom: 0.25rem;
          font-weight: 600;
        }

        .settings-toggle-info p {
          margin-bottom: 0;
          font-size: 0.875rem;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
        }

        .stat-card {
          background: #f7fafc;
          border-radius: 12px;
          padding: 1.5rem;
          display: flex;
          align-items: center;
        }

        .stat-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          margin-right: 1rem;
        }

        .stat-content h3 {
          margin-bottom: 0.25rem;
          font-weight: 700;
          font-size: 1.875rem;
        }

        .stat-content p {
          margin-bottom: 0;
          color: #718096;
          font-size: 0.875rem;
        }

        .danger-zone {
          background: #fed7d7;
          border-radius: 8px;
          padding: 1rem;
          border: 1px solid #feb2b2;
        }

        .form-check-input:checked {
          background-color: #3182ce;
          border-color: #3182ce;
        }

        @media (max-width: 768px) {
          .container-fluid {
            padding: 1rem !important;
          }
          
          .profile-header {
            margin-bottom: 2rem !important;
          }
          
          .stats-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default ProfilePage;