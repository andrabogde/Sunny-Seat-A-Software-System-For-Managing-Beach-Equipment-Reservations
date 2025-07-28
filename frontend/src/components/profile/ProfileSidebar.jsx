import React, { useContext, useRef } from 'react';
import { AuthContext } from '../../contexts/AuthContext';

/**
 * Componentă modernă pentru sidebar-ul profilului utilizatorului
 */
const ProfileSidebar = ({ user, activeTab, onTabChange, counts = {} }) => {
  const { logout } = useContext(AuthContext);
  const fileInputRef = useRef(null);

  // ✅ CONFIGURARE TAB-URI MODERNE CU UNICODE ICONS
  const tabs = [
    { 
      id: 'info', 
      label: 'Informații personale', 
      icon: '👤', // Unicode user icon
      color: 'primary'
    },
    // { 
    //   id: 'reservations', 
    //   label: 'Rezervările mele', 
    //   icon: '📅', // Unicode calendar icon
    //   color: 'success',
    //   count: counts.reservations || 0
    // },
    // { 
    //   id: 'favorites', 
    //   label: 'Plaje favorite', 
    //   icon: '❤️', // Unicode heart icon
    //   color: 'danger',
    //   count: counts.favorites || 0
    // },
    { 
      id: 'settings', 
      label: 'Setări', 
      icon: '⚙️', // Unicode settings icon
      color: 'warning'
    }
  ];

  // ✅ HANDLER PENTRU SCHIMBAREA POZEI DE PROFIL
  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      console.log('📸 Image selected from sidebar:', file.name);
      // Aici poți implementa upload-ul imaginii sau să transmiți către parent
      // onImageUpload(file);
    }
  };

  // ✅ FUNCȚIE PENTRU OBȚINEREA IMAGINII DE PROFIL DIN BAZA DE DATE
  const getProfileImage = () => {
    // Verifică dacă utilizatorul are o imagine setată în baza de date
    if (user?.profileImage?.data) {
      // Dacă imaginea e stocată ca blob în baza de date
      return `data:${user.profileImage.mimeType};base64,${user.profileImage.data}`;
    } else if (user?.profileImage?.url) {
      // Dacă imaginea e stocată ca URL
      return user.profileImage.url;
    } else if (user?.profileImage) {
      // Dacă e un string simplu cu URL-ul
      return user.profileImage;
    } else {
      // Imagine default cu inițialele CORECTE din numele complet
      const nameParts = user?.name ? user.name.trim().split(' ') : ['Utilizator'];
      const initials = nameParts.length >= 2 
        ? (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase()
        : nameParts[0].substring(0, 2).toUpperCase();
      
        const userName = user?.name || user?.nume || user?.prenume || 'User';
        return `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&size=200&background=667eea&color=ffffff&format=png`;
    }
  };

  // ✅ ELIMINAT - Nu avem created_at în baza de date

  return (
    <div className="modern-sidebar">
      {/* ✅ HEADER CU POZA DE PROFIL DIN BAZA DE DATE */}
      <div className="sidebar-header">
        <div className="profile-image-container" onClick={handleImageClick}>
          <img 
            src={getProfileImage()} 
            alt="Poza de profil" 
            className="profile-image"
          />
          <div className="image-overlay">
            📷
          </div>
        </div>
        
        <input 
          type="file" 
          ref={fileInputRef}
          onChange={handleImageChange}
          accept="image/*"
          style={{ display: 'none' }}
        />
        
        <div className="profile-info">
          {/* ✅ AFIȘARE NUME DIN BAZA DE DATE */}
          <h5 className="profile-name">{user?.name || 'Nume utilizator'}</h5>
          <p className="profile-email">{user?.email}</p>
          <div className="profile-stats">
            {user?.emailVerified && (
              <div className="verified-badge">
                ✅
                <span>Email verificat</span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* ✅ NAVIGAȚIE MODERNĂ */}
      <nav className="sidebar-nav">
        <ul className="nav-list">
          {tabs.map(tab => (
            <li key={tab.id} className="nav-item">
              <button 
                className={`nav-link ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => onTabChange(tab.id)}
              >
                <div className="nav-link-content">
                  <div className="nav-icon-wrapper">
                    <span className="nav-icon">{tab.icon}</span>
                  </div>
                  <span className="nav-label">{tab.label}</span>
                  {tab.count > 0 && (
                    <span className={`nav-badge bg-${tab.color}`}>
                      {tab.count}
                    </span>
                  )}
                </div>
              </button>
            </li>
          ))}
        </ul>
      </nav>
      
      {/* ✅ FOOTER CU DECONECTARE */}
      <div className="sidebar-footer">
        <button 
          className="logout-btn"
          onClick={logout}
        >
          🚪
          <span>Deconectare</span>
        </button>
      </div>

      <style jsx>{`
        .modern-sidebar {
          background: white;
          border-radius: 16px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          overflow: hidden;
          position: sticky;
          top: 2rem;
        }

        .sidebar-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 2rem 1.5rem;
          text-align: center;
          color: white;
        }

        .profile-image-container {
          position: relative;
          display: inline-block;
          margin-bottom: 1rem;
          cursor: pointer;
        }

        .profile-image {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          border: 4px solid rgba(255, 255, 255, 0.2);
          object-fit: cover;
          transition: all 0.3s ease;
        }

        .profile-image-container:hover .profile-image {
          transform: scale(1.05);
        }

        .image-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s ease;
          color: white;
          font-size: 1.25rem;
        }

        .profile-image-container:hover .image-overlay {
          opacity: 1;
        }

        .profile-info {
          text-align: center;
        }

        .profile-name {
          font-weight: 600;
          margin-bottom: 0.25rem;
          font-size: 1.125rem;
        }

        .profile-email {
          opacity: 0.9;
          margin-bottom: 1rem;
          font-size: 0.875rem;
        }

        .profile-stats {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          align-items: center;
        }

        .stat-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.75rem;
          opacity: 0.9;
        }

        .verified-badge {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          background: rgba(34, 197, 94, 0.2);
          padding: 0.25rem 0.5rem;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 500;
        }

        .sidebar-nav {
          padding: 1rem 0;
        }

        .nav-list {
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .nav-item {
          margin-bottom: 0.25rem;
        }

        .nav-link {
          width: 100%;
          background: none;
          border: none;
          padding: 0;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .nav-link-content {
          display: flex;
          align-items: center;
          padding: 0.75rem 1.5rem;
          text-decoration: none;
          color: #4a5568;
          transition: all 0.2s ease;
          position: relative;
        }

        .nav-link:hover .nav-link-content {
          background: #f7fafc;
          color: #3182ce;
        }

        .nav-link.active .nav-link-content {
          background: linear-gradient(90deg, #3182ce20 0%, transparent 100%);
          color: #3182ce;
          border-right: 3px solid #3182ce;
        }

        .nav-icon-wrapper {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 0.75rem;
          background: #f7fafc;
          transition: all 0.2s ease;
        }

        .nav-link:hover .nav-icon-wrapper,
        .nav-link.active .nav-icon-wrapper {
          background: #3182ce;
          color: white;
        }

        .nav-icon {
          font-size: 1.2rem;
        }

        .nav-label {
          flex: 1;
          text-align: left;
          font-weight: 500;
          font-size: 0.875rem;
        }

        .nav-badge {
          font-size: 0.75rem;
          font-weight: 600;
          padding: 0.25rem 0.5rem;
          border-radius: 12px;
          color: white;
          min-width: 20px;
          text-align: center;
        }

        .bg-primary { background-color: #3182ce !important; }
        .bg-success { background-color: #38a169 !important; }
        .bg-danger { background-color: #e53e3e !important; }
        .bg-warning { background-color: #d69e2e !important; }

        .sidebar-footer {
          border-top: 1px solid #e2e8f0;
          padding: 1rem 1.5rem;
        }

        .logout-btn {
          width: 100%;
          background: none;
          border: 1px solid #e2e8f0;
          padding: 0.75rem 1rem;
          border-radius: 8px;
          color: #e53e3e;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .logout-btn:hover {
          background: #fed7d7;
          border-color: #e53e3e;
          transform: translateY(-1px);
        }

        @media (max-width: 768px) {
          .modern-sidebar {
            border-radius: 12px;
          }
          
          .sidebar-header {
            padding: 1.5rem 1rem;
          }
          
          .profile-image {
            width: 60px;
            height: 60px;
          }
          
          .nav-link-content {
            padding: 0.75rem 1rem;
          }
          
          .nav-label {
            font-size: 0.8rem;
          }
        }
      `}</style>
    </div>
  );
};

export default ProfileSidebar;